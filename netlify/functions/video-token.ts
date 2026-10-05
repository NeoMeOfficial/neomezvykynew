// netlify/functions/video-token.ts
//
// Mints short-lived signed Bunny Stream embed URLs (Sam 2026-10-05).
// This is the signed-playback design from the security audit: content
// tables are public-read, so the GUID alone must be worthless — the
// embed only plays with a token = SHA256(securityKey + guid + expires)
// minted here for AUTHENTICATED users, expiring in 4 hours, plus the
// referrer lock configured in Bunny.
//
// v1 entitlement = any signed-in user (tier/quota stays client-side
// like the rest of the library for now); tightening to per-tier
// server checks is a known follow-up.

import { createHash } from 'crypto';
import { requireUser } from './_userAuth';

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

  const expires = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS;
  const token = createHash('sha256')
    .update(`${TOKEN_KEY}${videoId}${expires}`)
    .digest('hex');

  return json(200, {
    embedUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true&responsive=true`,
    expires,
  });
}
