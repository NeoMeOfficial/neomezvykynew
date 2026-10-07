// netlify/functions/video-token.ts
//
// Mints short-lived signed Bunny Stream embed URLs (Sam 2026-10-05).
// This is the signed-playback design from the security audit: content
// tables are public-read, so the GUID alone must be worthless — the
// embed only plays with a token = SHA256(securityKey + guid + expires)
// minted here for AUTHENTICATED users, expiring in 4 hours, plus the
// referrer lock configured in Bunny.
//
// Entitlement is enforced SERVER-SIDE before a token is minted: the
// client paywall alone was bypassable by calling this function directly,
// so a free user could watch any premium video. A token is now minted
// only when the caller is actually entitled to THIS video — see
// isEntitled() below.

import { createHash } from 'crypto';
import { requireUser, serviceClient } from './_userAuth';
import {
  resolveByGuid,
  quotaAllows,
  windowStartISO,
  type RawRow,
} from './_contentAccess';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: CORS,
  body: JSON.stringify(body),
});

const LIBRARY_ID =
  process.env.BUNNY_STREAM_LIBRARY_ID ||
  process.env.Bunny_LIBRARY_ID ||
  '770332';

const TOKEN_KEY =
  process.env.BUNNY_STREAM_TOKEN_KEY ||
  process.env.Bunny_API_KEY ||
  process.env.BUNNY_API_KEY ||
  '';

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EXPIRY_SECONDS = 4 * 3600;

/**
 * Decide whether `userId` may watch the video with this Bunny `guid`.
 * Mirrors the client entitlement model:
 *   • premium subscriber        → unlimited
 *   • any program_purchases row → unlimited (admin-granted single-program
 *     buyers; coarse because there is no exercise→program map in the DB,
 *     and they're a small trusted paid set — far better than the old
 *     "any signed-in user" grant)
 *   • effectively-free content  → everyone
 *   • free user within the 2-per-7-day sample quota → allowed, and the
 *     view is logged here so the quota actually counts server-side
 * Fail-OPEN on infrastructure errors / unresolvable GUIDs so a query
 * glitch or not-yet-catalogued video never locks out a legitimate user.
 */
async function isEntitled(userId: string, guid: string): Promise<boolean> {
  const sc = serviceClient();

  // Premium?
  try {
    const { data: sub } = await sc
      .from('subscriptions').select('active').eq('user_id', userId).maybeSingle();
    if (sub?.active) return true;
  } catch { return true; } // fail-open

  // Any single-program grant? (coarse but safe — paid/granted users only)
  try {
    const { data: progs } = await sc
      .from('program_purchases').select('program_id').eq('user_id', userId).limit(1);
    if (progs && progs.length > 0) return true;
  } catch { return true; }

  // Resolve the GUID → content + effective free flag.
  let rows: RawRow[];
  try {
    const { data, error } = await sc
      .from('exercises')
      .select('id, content_type, body, equip, duration, level, video_url, free')
      .eq('active', true)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });
    if (error || !data) return true; // fail-open
    rows = data as RawRow[];
  } catch { return true; }

  const content = resolveByGuid(rows, guid);
  if (!content) return true;      // unknown/uncatalogued GUID → don't lock out
  if (content.isFree) return true;

  // Free user + premium content → metered sample quota.
  try {
    const { data: views } = await sc
      .from('content_views')
      .select('content_id')
      .eq('user_id', userId)
      .eq('content_type', content.contentType)
      .gt('viewed_at', windowStartISO(content.contentType));
    const seen = (views ?? []).map((v: { content_id: string }) => v.content_id);
    if (!quotaAllows(content.contentType, content.id, seen)) return false;
    // Allowed via quota — burn the credit server-side (the token IS the
    // access grant). Dedup is by content_id, so a duplicate client logView
    // after 10s of play doesn't double-count.
    await sc.from('content_views').insert({
      user_id: userId,
      content_type: content.contentType,
      content_id: content.id,
    });
    return true;
  } catch { return true; } // fail-open on quota read/write errors
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  if (!TOKEN_KEY) return json(500, { error: 'Bunny token key not configured' });

  let videoId = '';
  try {
    videoId = String(JSON.parse(event.body || '{}').videoId ?? '').trim().toLowerCase();
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  if (!GUID_RE.test(videoId)) return json(400, { error: 'Invalid videoId' });

  // Server-side paywall: mint a token only if this user may watch this video.
  if (!(await isEntitled(auth.userId, videoId))) {
    return json(402, { error: 'Toto video je súčasťou predplatného Plus.' });
  }

  const expires = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS;
  const token = createHash('sha256')
    .update(`${TOKEN_KEY}${videoId}${expires}`)
    .digest('hex');

  return json(200, {
    embedUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true&responsive=true`,
    expires,
  });
}
