// netlify/functions/admin-partner-codes.ts
//
// Admin endpoints for the partner_reward_codes pool.
//
//   GET  ?slug=optional        → list pool stats for all partner-* rewards
//                                (or just one if slug provided), plus the
//                                most-recent 50 served rows for that slug.
//
//   POST { slug, codes: string[] }
//                              → bulk-insert codes into the pool for that
//                                slug. Dedupes against existing rows.
//
//   DELETE ?id=<uuid>          → remove an unserved code from the pool.
//
// Auth: caller must be authenticated AND have profiles.role = 'admin'.

import { createClient } from '@supabase/supabase-js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function requireAdmin(authHeader: string | undefined) {
  if (!authHeader) return { ok: false as const, status: 401, error: 'Unauthorized' };
  const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (error || !user) return { ok: false as const, status: 401, error: 'Unauthorized' };
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') return { ok: false as const, status: 403, error: 'Forbidden' };
  return { ok: true as const, userId: user.id };
}

function jsonResponse(body: unknown, status = 200) {
  return { statusCode: status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const auth = await requireAdmin(event.headers.authorization || event.headers.Authorization);
  if (!auth.ok) return jsonResponse({ error: auth.error }, auth.status);

  try {
    // ── GET — stats per partner reward slug + recent rows ────────
    if (event.httpMethod === 'GET') {
      const slug = (event.queryStringParameters?.slug as string | undefined) || undefined;

      // All active partner-* rewards (those with no Stripe coupon)
      const { data: rewards } = await supabase
        .from('rewards')
        .select('slug, name, point_cost, color_token')
        .is('stripe_coupon_id', null)
        .eq('active', true)
        .order('sort_order');

      const targetSlugs = slug ? [slug] : (rewards ?? []).map(r => r.slug);

      // Pull all codes for those slugs in one query, then aggregate.
      const { data: codes } = await supabase
        .from('partner_reward_codes')
        .select('id, reward_slug, code, served_to, served_at, claimed_at, expires_at, created_at')
        .in('reward_slug', targetSlugs)
        .order('created_at', { ascending: false });

      const byslug: Record<string, { total: number; served: number; available: number }> = {};
      for (const s of targetSlugs) byslug[s] = { total: 0, served: 0, available: 0 };
      for (const c of codes ?? []) {
        const stats = byslug[c.reward_slug];
        if (!stats) continue;
        stats.total++;
        // "Served" = has been claimed by a user (claimed_at set).
        // Reservation-only rows (served_to set, claimed_at null,
        // expires_at in the future) still count toward available because
        // the redeem fn re-uses them after expiry.
        if (c.claimed_at) stats.served++;
        else stats.available++;
      }

      const recent = slug ? (codes ?? []).slice(0, 50).map(c => ({
        id: c.id,
        code: c.code,
        served_to: c.served_to,
        served_at: c.served_at,
        claimed_at: c.claimed_at,
        expires_at: c.expires_at,
        created_at: c.created_at,
      })) : null;

      return jsonResponse({
        rewards: rewards ?? [],
        stats: byslug,
        recent,
      });
    }

    // ── POST — bulk insert codes ────────────────────────────────
    if (event.httpMethod === 'POST') {
      const { slug, codes } = JSON.parse(event.body || '{}') as { slug?: string; codes?: string[] };
      if (!slug || !Array.isArray(codes) || codes.length === 0) {
        return jsonResponse({ error: 'slug and non-empty codes[] required' }, 400);
      }

      // Verify the slug exists and is a partner reward.
      const { data: reward } = await supabase
        .from('rewards')
        .select('slug, stripe_coupon_id')
        .eq('slug', slug)
        .maybeSingle();
      if (!reward) return jsonResponse({ error: 'reward_slug not found' }, 404);
      if (reward.stripe_coupon_id) return jsonResponse({ error: 'reward_slug is a Stripe-coupon reward, not partner-code' }, 400);

      // Dedupe against existing pool entries for this slug.
      const { data: existingRows } = await supabase
        .from('partner_reward_codes')
        .select('code')
        .eq('reward_slug', slug);
      const existing = new Set((existingRows ?? []).map(r => r.code));

      const cleaned = Array.from(new Set(
        codes
          .map(c => (typeof c === 'string' ? c.trim() : ''))
          .filter(c => c.length > 0 && !existing.has(c))
      ));

      if (cleaned.length === 0) {
        return jsonResponse({ inserted: 0, skipped: codes.length, message: 'All codes already exist' });
      }

      const rows = cleaned.map(code => ({ reward_slug: slug, code }));
      const { error } = await supabase.from('partner_reward_codes').insert(rows);
      if (error) return jsonResponse({ error: error.message }, 500);

      return jsonResponse({ inserted: cleaned.length, skipped: codes.length - cleaned.length });
    }

    // ── DELETE — remove unserved code ────────────────────────────
    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id as string | undefined;
      if (!id) return jsonResponse({ error: 'id required' }, 400);

      // Only delete if not claimed — claimed codes are part of the
      // audit trail.
      const { data: existing } = await supabase
        .from('partner_reward_codes')
        .select('claimed_at')
        .eq('id', id)
        .maybeSingle();
      if (!existing) return jsonResponse({ error: 'Not found' }, 404);
      if (existing.claimed_at) return jsonResponse({ error: 'Cannot delete a claimed code (audit trail)' }, 400);

      const { error } = await supabase.from('partner_reward_codes').delete().eq('id', id);
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ deleted: true });
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch (err: any) {
    console.error('admin-partner-codes error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
