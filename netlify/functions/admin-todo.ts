// netlify/functions/admin-todo.ts
//
// The admin "Čaká na teba" inbox (Sam 2026-10-05, refined same day):
// ONLY items that need the owner's attention or action — no plain
// "new user" noise. Covered: payouts to send, candidates ripe for
// partner approval, unread user messages, reported community content,
// new posts to review, declined renewal payments, signups that never
// confirmed their email, fresh cancellations (churn outreach), and
// refund-reversed commissions (clawback check).

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
  const now = Date.now();
  const d7 = new Date(now - 7 * 24 * 3600 * 1000).toISOString();
  const d2 = new Date(now - 2 * 24 * 3600 * 1000).toISOString();
  const h24 = new Date(now - 24 * 3600 * 1000).toISOString();

  const [
    { data: payouts },
    { data: candidates },
    { data: paidRefs },
    { data: unreadMsgs },
    reportsRes,
    { data: newPosts },
    paymentFailsRes,
    { data: cancelling },
    { data: reversed },
  ] = await Promise.all([
    supabase.from('affiliate_payouts').select('id, affiliate_user_id, amount_cents, requested_at').eq('status', 'requested').order('requested_at'),
    supabase.from('affiliates').select('user_id, code').eq('status', 'candidate'),
    supabase.from('points_ledger').select('user_id').eq('event_type', 'referral_paid'),
    supabase.from('messages').select('user_id').eq('is_from_admin', false).is('read_at', null),
    // Table may not exist until Sam runs community_reports.sql.
    supabase.from('community_reports').select('post_id, reply_id, reason, created_at').is('resolved_at', null),
    supabase.from('community_posts').select('id, author_name, type, created_at').eq('status', 'visible').gte('created_at', d2),
    supabase.from('payment_events').select('user_id, event_type, created_at').eq('event_type', 'invoice_payment_failed').gte('created_at', d7),
    supabase.from('subscriptions').select('user_id, cancel_at_period_end, current_period_end, updated_at').eq('active', true).eq('cancel_at_period_end', true).gte('updated_at', d7),
    supabase.from('affiliate_earnings').select('affiliate_user_id, amount_cents, created_at, status').eq('status', 'reversed').gte('created_at', d7),
  ]);

  const emailCache = new Map<string, string>();
  const emailOf = async (id: string): Promise<string> => {
    if (emailCache.has(id)) return emailCache.get(id)!;
    const { data } = await supabase.auth.admin.getUserById(id);
    const email = data?.user?.email ?? id.slice(0, 8);
    emailCache.set(id, email);
    return email;
  };

  // Payouts to send.
  const payoutItems = await Promise.all(
    (payouts ?? []).map(async (p) => ({
      id: p.id,
      email: await emailOf(p.affiliate_user_id),
      amount_cents: p.amount_cents,
      requested_at: p.requested_at,
    })),
  );

  // Candidates ripe for approval (>= 5 paying).
  const payingByUser = new Map<string, number>();
  for (const r of paidRefs ?? []) payingByUser.set(r.user_id, (payingByUser.get(r.user_id) ?? 0) + 1);
  const ripe = await Promise.all(
    (candidates ?? [])
      .filter((c) => (payingByUser.get(c.user_id) ?? 0) >= 5)
      .map(async (c) => ({ email: await emailOf(c.user_id), code: c.code, paying: payingByUser.get(c.user_id) ?? 0 })),
  );

  // Unread messages per user.
  const unreadByUser = new Map<string, number>();
  for (const m of unreadMsgs ?? []) unreadByUser.set(m.user_id, (unreadByUser.get(m.user_id) ?? 0) + 1);
  const messages = await Promise.all(
    [...unreadByUser.entries()].slice(0, 25).map(async ([uid, n]) => ({ email: await emailOf(uid), unread: n })),
  );

  // Reported content, grouped per post (table may not exist yet).
  const reportRows = reportsRes.error ? [] : (reportsRes.data ?? []);
  const reportsByPost = new Map<string, number>();
  for (const r of reportRows) reportsByPost.set(r.post_id, (reportsByPost.get(r.post_id) ?? 0) + 1);
  const reports = [...reportsByPost.entries()].slice(0, 25).map(([post_id, n]) => ({ post_id, count: n }));

  // Declined renewal payments — card failed; access is at risk.
  const failRows = paymentFailsRes.error ? [] : (paymentFailsRes.data ?? []);
  const failedByUser = new Map<string, string>();
  for (const f of failRows) {
    if (f.user_id && !failedByUser.has(f.user_id)) failedByUser.set(f.user_id, f.created_at);
  }
  const declined = await Promise.all(
    [...failedByUser.entries()].slice(0, 25).map(async ([uid, at]) => ({ email: await emailOf(uid), at })),
  );

  // Signed up but never confirmed the email (>24h old, last 7 days).
  let unconfirmed: any[] = [];
  try {
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    unconfirmed = (list?.users ?? [])
      .filter((u) => !u.email_confirmed_at && u.created_at >= d7 && u.created_at <= h24)
      .slice(0, 25)
      .map((u) => ({ email: u.email, created_at: u.created_at }));
  } catch (err) {
    console.error('admin-todo listUsers failed:', err);
  }

  // Fresh cancellations — subscription still active, set to end.
  const cancellations = await Promise.all(
    (cancelling ?? []).slice(0, 25).map(async (c) => ({
      email: await emailOf(c.user_id),
      ends: c.current_period_end,
    })),
  );

  // Reversed commissions (refund/chargeback clawbacks) — verify payouts.
  const reversals = await Promise.all(
    (reversed ?? []).slice(0, 10).map(async (r) => ({
      email: await emailOf(r.affiliate_user_id),
      amount_cents: r.amount_cents,
      at: r.created_at,
    })),
  );

  return json(200, {
    payouts: payoutItems,
    ripe_candidates: ripe,
    unread_messages: messages,
    reported_content: reports,
    new_posts: (newPosts ?? []).length,
    declined_payments: declined,
    unconfirmed_signups: unconfirmed,
    cancellations,
    reversals,
  });
}
