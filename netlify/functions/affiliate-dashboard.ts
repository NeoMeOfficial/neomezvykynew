// netlify/functions/affiliate-dashboard.ts
//
// Everything the affiliate dashboard shows, in one authenticated GET.
// Referred users are identified by masked email only — the affiliate
// gets earnings transparency, not the person's identity.

import { requireUser, serviceClient } from './_userAuth';

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

function maskEmail(email: string | null | undefined): string {
  if (!email) return '•••';
  const [local, domain] = email.split('@');
  if (!domain) return '•••';
  const head = local.slice(0, 2);
  return `${head}•••@${domain}`;
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const supabase = serviceClient();

  const { data: me } = await supabase
    .from('affiliates')
    .select('code, commission_pct, status, created_at')
    .eq('user_id', auth.userId)
    .maybeSingle();
  if (!me) return json(403, { error: 'not_affiliate' });

  const [{ data: referrals }, { data: earnings }, { data: payouts }] = await Promise.all([
    supabase
      .from('affiliate_referrals')
      .select('referred_user_id, created_at')
      .eq('affiliate_user_id', auth.userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('affiliate_earnings')
      .select('referred_user_id, amount_cents, status, available_at, payout_id, created_at')
      .eq('affiliate_user_id', auth.userId),
    supabase
      .from('affiliate_payouts')
      .select('id, amount_cents, status, requested_at, processed_at')
      .eq('affiliate_user_id', auth.userId)
      .order('requested_at', { ascending: false }),
  ]);

  const now = Date.now();
  let pending = 0;   // accrued, still inside the 30-day maturity window
  let available = 0; // matured, not yet in any payout request
  let requested = 0; // sitting in an open payout request
  let paid = 0;
  const perUser = new Map<string, number>();

  for (const e of earnings ?? []) {
    if (e.status === 'reversed') continue;
    perUser.set(e.referred_user_id, (perUser.get(e.referred_user_id) ?? 0) + e.amount_cents);
    if (e.status === 'paid') paid += e.amount_cents;
    else if (e.payout_id) requested += e.amount_cents;
    else if (new Date(e.available_at).getTime() > now) pending += e.amount_cents;
    else available += e.amount_cents;
  }

  // Masked emails for the referred users (service role; batched).
  const userRows = await Promise.all(
    (referrals ?? []).slice(0, 100).map(async (r) => {
      const { data } = await supabase.auth.admin.getUserById(r.referred_user_id);
      return {
        label: maskEmail(data?.user?.email),
        joined: r.created_at,
        earned_cents: perUser.get(r.referred_user_id) ?? 0,
      };
    }),
  );

  return json(200, {
    code: me.code,
    commission_pct: Number(me.commission_pct),
    status: me.status,
    referrals: userRows,
    totals: { pending, available, requested, paid },
    payouts: payouts ?? [],
  });
}
