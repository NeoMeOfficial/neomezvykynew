// netlify/functions/admin-todo.ts
//
// The admin "Čaká na teba" inbox (Sam 2026-10-05): one aggregated feed
// of everything that needs the owner's attention or awareness, so no
// payout, approval, message or signup slips through tab-checking.

import { requireAdmin } from './_adminAuth';
import { serviceClient } from './_userAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: CORS,
  body: JSON.stringify(body),
});

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  const auth = await requireAdmin(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const supabase = serviceClient();
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  const [
    { data: payouts },
    { data: candidates },
    { data: paidRefs },
    { data: unreadMsgs },
    { data: newRefs },
    { data: newSubs },
  ] = await Promise.all([
    supabase.from('affiliate_payouts').select('id, affiliate_user_id, amount_cents, requested_at').eq('status', 'requested').order('requested_at'),
    supabase.from('affiliates').select('user_id, code, status').eq('status', 'candidate'),
    supabase.from('points_ledger').select('user_id, ref_id, created_at').eq('event_type', 'referral_paid'),
    supabase.from('messages').select('user_id, created_at').eq('is_from_admin', false).is('read_at', null),
    supabase.from('affiliate_referrals').select('affiliate_user_id, referred_user_id, code_used, created_at').gte('created_at', since).order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('user_id, updated_at').eq('active', true).gte('updated_at', since),
  ]);

  const emailCache = new Map<string, string>();
  const emailOf = async (id: string): Promise<string> => {
    if (emailCache.has(id)) return emailCache.get(id)!;
    const { data } = await supabase.auth.admin.getUserById(id);
    const email = data?.user?.email ?? id.slice(0, 8);
    emailCache.set(id, email);
    return email;
  };

  // New signups (last 7 days) — with referral source where known.
  const refByUser = new Map((newRefs ?? []).map((r) => [r.referred_user_id, r]));
  let newUsers: any[] = [];
  try {
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
    newUsers = await Promise.all(
      (list?.users ?? [])
        .filter((u) => u.created_at >= since)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .slice(0, 25)
        .map(async (u) => {
          const ref = refByUser.get(u.id);
          return {
            email: u.email,
            created_at: u.created_at,
            confirmed: !!u.email_confirmed_at,
            via_code: ref?.code_used ?? null,
            via_email: ref ? await emailOf(ref.affiliate_user_id) : null,
          };
        }),
    );
  } catch (err) {
    console.error('admin-todo listUsers failed:', err);
  }

  // Payouts to process.
  const payoutItems = await Promise.all(
    (payouts ?? []).map(async (p) => ({
      id: p.id,
      email: await emailOf(p.affiliate_user_id),
      amount_cents: p.amount_cents,
      requested_at: p.requested_at,
    })),
  );

  // Candidates ripe for approval (>= 5 paying referrals).
  const payingByUser = new Map<string, number>();
  for (const r of paidRefs ?? []) {
    payingByUser.set(r.user_id, (payingByUser.get(r.user_id) ?? 0) + 1);
  }
  const ripe = await Promise.all(
    (candidates ?? [])
      .filter((c) => (payingByUser.get(c.user_id) ?? 0) >= 5)
      .map(async (c) => ({
        email: await emailOf(c.user_id),
        code: c.code,
        paying: payingByUser.get(c.user_id) ?? 0,
      })),
  );

  // Unread messages grouped per user.
  const unreadByUser = new Map<string, number>();
  for (const m of unreadMsgs ?? []) {
    unreadByUser.set(m.user_id, (unreadByUser.get(m.user_id) ?? 0) + 1);
  }
  const messages = await Promise.all(
    [...unreadByUser.entries()].slice(0, 25).map(async ([uid, n]) => ({
      email: await emailOf(uid),
      unread: n,
    })),
  );

  return json(200, {
    payouts: payoutItems,
    ripe_candidates: ripe,
    unread_messages: messages,
    new_users: newUsers,
    new_active_subscriptions: (newSubs ?? []).length,
  });
}
