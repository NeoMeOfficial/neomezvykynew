// netlify/functions/award-points.ts
//
// The ONLY write path for earned points (audit C4, Sam 2026-10-02).
// points_ledger has no INSERT policy for end users — every client-side
// insert silently bounced off RLS, which is why balances never moved.
// Points buy real Stripe coupons (redeem-reward), so the client must
// never choose values: it names an event, the server owns the price,
// the dedupe and the caps.
//
// Earn table (canonical — delete any other copy you find):
//   workout_completed    10   per exercise per day
//   meditation_completed  8   per meditation per day (replay-farming
//                             safe: same track re-plays award nothing
//                             until tomorrow)
//   reflection_write      6   once per day
//   cycle_log             4   once per day
//   habit_checkin         3   per habit per day, max 5 habits
//   post_published        5   per post, max 1 earning post per day
//   community_like        1   once per post ever, max 5 per day
//   program_completed    50   once per program
//   (referral_sub 300 is awarded by stripe-webhook, not here)
//
// Overall cap: 40 earned points per day through this endpoint.

import { requireUser, serviceClient } from './_userAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Rule {
  points: number;
  refType: string;
  // Server builds ref_id itself — the ref is the dedupe key, so the
  // client only contributes an entity id, never the full key.
  buildRef: (refId: string | undefined, day: string) => string | null;
  // Max awards of this event per day (on top of per-ref dedupe).
  dailyLimit?: number;
}

const RULES: Record<string, Rule> = {
  workout_completed:    { points: 10, refType: 'exercise',   buildRef: (r, d) => (r ? `${r}_${d}` : null) },
  meditation_completed: { points: 8,  refType: 'meditation', buildRef: (r, d) => (r ? `${r}_${d}` : null) },
  reflection_write:     { points: 6,  refType: 'reflection', buildRef: (_r, d) => `reflection_${d}` },
  cycle_log:            { points: 4,  refType: 'cycle',      buildRef: (_r, d) => `cycle_${d}` },
  habit_checkin:        { points: 3,  refType: 'habit',      buildRef: (r, d) => (r ? `habit_${r}_${d}` : null), dailyLimit: 5 },
  // ref_id stays `post_<id>` — admin-set-post-status reverses the award
  // by deleting exactly that ref when a post is removed.
  post_published:       { points: 5,  refType: 'community',  buildRef: (r) => (r ? `post_${r}` : null), dailyLimit: 1 },
  community_like:       { points: 1,  refType: 'community',  buildRef: (r) => (r ? `like_${r}` : null), dailyLimit: 5 },
  program_completed:    { points: 50, refType: 'program',    buildRef: (r) => r ?? null },
};

const DAILY_CAP = 40;

/** YYYY-MM-DD in the app's home timezone — the user-visible "day". */
function skToday(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Bratislava' });
}

function json(status: number, body: unknown) {
  return { statusCode: status, headers: CORS, body: JSON.stringify(body) };
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  let body: { event?: string; refId?: string };
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const rule = body.event ? RULES[body.event] : undefined;
  if (!rule || !body.event) return json(400, { error: 'Unknown event' });
  if (body.refId !== undefined && (typeof body.refId !== 'string' || body.refId.length > 120)) {
    return json(400, { error: 'Invalid refId' });
  }

  const day = skToday();
  const refId = rule.buildRef(body.refId, day);
  if (!refId) return json(400, { error: 'Missing refId' });

  const supabase = serviceClient();
  const userId = auth.userId;

  try {
    // Per-ref dedupe — the same (event, ref) never pays twice.
    const { data: dup } = await supabase
      .from('points_ledger')
      .select('id')
      .eq('user_id', userId)
      .eq('event_type', body.event)
      .eq('ref_id', refId)
      .limit(1);
    if (dup && dup.length > 0) return json(200, { awarded: 0, reason: 'duplicate' });

    // Today's earns through this endpoint (ledger also holds webhook
    // referral awards and negative redemptions — both excluded).
    const { data: todayRows } = await supabase
      .from('points_ledger')
      .select('event_type, points')
      .eq('user_id', userId)
      .in('event_type', Object.keys(RULES))
      .gte('created_at', `${day}T00:00:00+02:00`);

    const earnedToday = (todayRows ?? []).reduce((s, r) => s + Math.max(0, r.points), 0);
    if (earnedToday + rule.points > DAILY_CAP) {
      return json(200, { awarded: 0, reason: 'daily_cap' });
    }
    if (rule.dailyLimit) {
      const sameEvent = (todayRows ?? []).filter((r) => r.event_type === body.event).length;
      if (sameEvent >= rule.dailyLimit) return json(200, { awarded: 0, reason: 'event_daily_limit' });
    }

    const { error } = await supabase.from('points_ledger').insert({
      user_id: userId,
      event_type: body.event,
      points: rule.points,
      ref_id: refId,
      ref_type: rule.refType,
    });
    if (error) {
      // 23505 = the unique dedupe index caught a concurrent duplicate.
      if ((error as any).code === '23505') return json(200, { awarded: 0, reason: 'duplicate' });
      console.error('award-points insert failed:', error);
      return json(500, { error: 'Insert failed' });
    }

    return json(200, { awarded: rule.points });
  } catch (err: any) {
    console.error('award-points error:', err);
    return json(500, { error: err.message });
  }
}
