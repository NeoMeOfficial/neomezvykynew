// netlify/functions/admin-metrics.ts
//
// Business dashboard data (Sam 2026-10-05): engagement counts from
// Supabase + revenue truth straight from Stripe (paid invoices and
// one-time checkouts; the DB never stores money). Admin-only; a dozen
// Stripe calls per load is fine for an owner dashboard.

import Stripe from 'stripe';
import { stripeEnv } from './_stripeEnv';
import { requireAdmin } from './_adminAuth';
import { serviceClient } from './_userAuth';

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

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

function planName(priceId: string | null | undefined): string {
  const env = (n: string) => process.env[n] || process.env[`${n}_TEST`];
  const pairs: [string | undefined, string][] = [
    [process.env.VITE_STRIPE_SUBSCRIPTION_PRICE_ID, 'Plus mesačné'],
    [process.env.VITE_STRIPE_SUBSCRIPTION_PRICE_ID_TEST, 'Plus mesačné'],
    [process.env.VITE_STRIPE_SUBSCRIPTION_QUARTERLY_PRICE_ID, 'Plus štvrťročné'],
    [process.env.VITE_STRIPE_SUBSCRIPTION_QUARTERLY_PRICE_ID_TEST, 'Plus štvrťročné'],
    [process.env.VITE_STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID, 'Plus ročné'],
    [process.env.VITE_STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID_TEST, 'Plus ročné'],
    [env('VITE_STRIPE_MEAL_PRICE_ID'), 'Jedálniček'],
    [env('STRIPE_MEAL_PRICE_ID'), 'Jedálniček'],
  ];
  for (const [id, name] of pairs) if (id && id === priceId) return name;
  return 'Ostatné';
}

/** Monday 00:00 UTC of the week containing `d`. */
function weekStart(d: Date): Date {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x;
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  const auth = await requireAdmin(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const supabase = serviceClient();
  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
  const thisWeek = weekStart(now);
  const lastWeek = new Date(thisWeek.getTime() - 7 * 24 * 3600 * 1000);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

  // ── Engagement (Supabase) ───────────────────────────────────
  const cnt = async (table: string, sinceCol?: string, since?: string) => {
    let q = supabase.from(table).select('*', { count: 'exact', head: true });
    if (sinceCol && since) q = q.gte(sinceCol, since);
    const { count, error } = await q;
    return error ? null : (count ?? 0);
  };

  const [posts7, postsAll, replies7, repliesAll, likes7, likesAll, candidatesAll, referrals7, referralsAll, waitlistAll] =
    await Promise.all([
      cnt('community_posts', 'created_at', d7), cnt('community_posts'),
      cnt('community_replies', 'created_at', d7), cnt('community_replies'),
      cnt('community_likes', 'created_at', d7), cnt('community_likes'),
      cnt('affiliates'), // everyone with a referral code (candidates + partners)
      cnt('affiliate_referrals', 'created_at', d7), cnt('affiliate_referrals'),
      cnt('meal_plan_waitlist'), // 6-week plan launch audience
    ]);
  const { count: payingReferrals } = await supabase
    .from('points_ledger').select('*', { count: 'exact', head: true }).eq('event_type', 'referral_paid');

  // ── Revenue (Stripe paid invoices + one-time checkouts) ─────
  // Pull the year's paid invoices once; derive every window from it.
  const invoices: Stripe.Invoice[] = [];
  let starting_after: string | undefined;
  for (let page = 0; page < 10; page++) {
    const res = await stripe.invoices.list({
      status: 'paid',
      created: { gte: Math.floor(yearStart.getTime() / 1000) },
      limit: 100,
      ...(starting_after ? { starting_after } : {}),
    });
    invoices.push(...res.data);
    if (!res.has_more) break;
    starting_after = res.data[res.data.length - 1]?.id;
  }

  // One-time payments (meal plan): paid checkout sessions this year.
  const sessions: Stripe.Checkout.Session[] = [];
  starting_after = undefined;
  for (let page = 0; page < 10; page++) {
    const res = await stripe.checkout.sessions.list({
      created: { gte: Math.floor(yearStart.getTime() / 1000) },
      limit: 100,
      ...(starting_after ? { starting_after } : {}),
    });
    sessions.push(...res.data.filter((s) => s.mode === 'payment' && s.payment_status === 'paid'));
    if (!res.has_more) break;
    starting_after = res.data[res.data.length - 1]?.id;
  }

  type Rec = { at: number; cents: number; plan: string };
  const records: Rec[] = [
    ...invoices.map((i) => ({
      at: i.created * 1000,
      cents: i.amount_paid,
      plan: planName(i.lines?.data?.[0]?.price?.id),
    })),
    ...sessions.map((s) => ({ at: s.created * 1000, cents: s.amount_total ?? 0, plan: 'Jedálniček' })),
  ].filter((r) => r.cents > 0);

  const sum = (from: number, to: number) =>
    records.filter((r) => r.at >= from && r.at < to).reduce((a, r) => a + r.cents, 0);

  const byPlan: Record<string, number> = {};
  for (const r of records) byPlan[r.plan] = (byPlan[r.plan] ?? 0) + r.cents;

  // ── Upcoming renewals / attention / expiring (DB + Stripe) ──
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, active, current_period_end, cancel_at_period_end, stripe_subscription_id')
    .eq('active', true)
    .not('stripe_subscription_id', 'is', null);

  const emailOf = async (id: string) => {
    const { data } = await supabase.auth.admin.getUserById(id);
    return data?.user?.email ?? id.slice(0, 8);
  };

  const in30 = now.getTime() + 30 * 24 * 3600 * 1000;
  const in7 = now.getTime() + 7 * 24 * 3600 * 1000;
  const upcoming: any[] = [];
  const expiring: any[] = [];
  let expected30 = 0;

  // Price per sub via Stripe (needed for "expected revenue").
  for (const row of (subs ?? []).slice(0, 100)) {
    const endMs = row.current_period_end ? new Date(row.current_period_end).getTime() : 0;
    if (!endMs || endMs < now.getTime() || endMs > in30) continue;
    let cents = 0;
    try {
      const sub = await stripe.subscriptions.retrieve(row.stripe_subscription_id!);
      cents = sub.items.data[0]?.price?.unit_amount ?? 0;
    } catch { /* missing sub — reconciler's job */ }
    const email = await emailOf(row.user_id);
    if (row.cancel_at_period_end) {
      expiring.push({ email, ends: row.current_period_end });
    } else {
      expected30 += cents;
      if (endMs <= in7) upcoming.push({ email, renews: row.current_period_end, cents });
    }
  }

  return json(200, {
    engagement: {
      posts: { week: posts7, total: postsAll },
      comments: { week: replies7, total: repliesAll },
      likes: { week: likes7, total: likesAll },
      referrers: candidatesAll,
      referrals: { week: referrals7, total: referralsAll, paying: payingReferrals ?? 0 },
      meal_plan_waitlist: waitlistAll,
    },
    revenue: {
      last_week: sum(lastWeek.getTime(), thisWeek.getTime()),
      this_week: sum(thisWeek.getTime(), now.getTime() + 1),
      month_to_date: sum(monthStart.getTime(), now.getTime() + 1),
      year_to_date: sum(yearStart.getTime(), now.getTime() + 1),
      expected_30d: expected30,
      by_plan_ytd: byPlan,
    },
    subscriptions: {
      active: (subs ?? []).length,
      upcoming_7d: upcoming,
      expiring,
    },
  });
}
