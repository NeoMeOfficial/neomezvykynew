// netlify/functions/admin-user-stripe.ts
//
// Returns live Stripe state for a single customer — used by the admin
// Users tab to show the active subscription, any attached discount,
// last invoices and default payment method without leaving the app.
//
// Auth: caller must be authenticated AND have profiles.role = 'admin'.
//
// Body: { customerId: string }
// Returns: {
//   subscription: { id, status, currentPeriodEnd, amount, currency,
//                   discount: { coupon, percentOff, amountOff } | null } | null,
//   invoices: [{ id, number, created, total, paid, hostedUrl }, ...],
//   paymentMethod: { brand, last4, exp } | null,
// }

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { stripeEnv } from './_stripeEnv';
import { requireAdmin } from './_adminAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    // ── Admin auth ────────────────────────────────────────────────
    const auth = await requireAdmin(event.headers.authorization || event.headers.Authorization);
    if (!auth.ok) {
      return { statusCode: auth.status, headers: CORS, body: JSON.stringify({ error: auth.error }) };
    }

    // ── Inputs ────────────────────────────────────────────────────
    const { customerId } = JSON.parse(event.body || '{}');
    if (!customerId || typeof customerId !== 'string') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'customerId required' }) };
    }

    // ── Customer + default PM ─────────────────────────────────────
    const customer = await stripe.customers.retrieve(customerId, {
      expand: ['invoice_settings.default_payment_method'],
    });

    let paymentMethod = null as null | { brand: string; last4: string; exp: string };
    if (!customer.deleted && customer.invoice_settings?.default_payment_method) {
      const pm = customer.invoice_settings.default_payment_method as Stripe.PaymentMethod;
      if (pm.card) {
        paymentMethod = {
          brand: pm.card.brand,
          last4: pm.card.last4,
          exp: `${String(pm.card.exp_month).padStart(2, '0')}/${String(pm.card.exp_year).slice(-2)}`,
        };
      }
    }

    // ── Active subscription (+ discount) ──────────────────────────
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
      expand: ['data.discount.coupon', 'data.items.data.price'],
    });

    let subscription = null as null | {
      id: string;
      status: string;
      currentPeriodEnd: string | null;
      cancelAtPeriodEnd: boolean;
      amount: number;
      currency: string;
      discount: null | { coupon: string; percentOff: number | null; amountOff: number | null };
    };

    if (subs.data.length > 0) {
      const sub = subs.data[0];
      const item = sub.items.data[0];
      const price = item?.price;
      let discount: typeof subscription extends null ? never : NonNullable<typeof subscription>['discount'] = null;
      if (sub.discount?.coupon) {
        discount = {
          coupon: sub.discount.coupon.id,
          percentOff: sub.discount.coupon.percent_off ?? null,
          amountOff: sub.discount.coupon.amount_off ?? null,
        };
      }
      subscription = {
        id: sub.id,
        status: sub.status,
        currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        amount: price?.unit_amount ?? 0,
        currency: price?.currency ?? 'eur',
        discount,
      };
    }

    // ── Last 5 invoices ───────────────────────────────────────────
    const invoicesRes = await stripe.invoices.list({ customer: customerId, limit: 5 });
    const invoices = invoicesRes.data.map((inv) => ({
      id: inv.id,
      number: inv.number,
      created: new Date(inv.created * 1000).toISOString(),
      total: inv.total,
      currency: inv.currency,
      paid: inv.status === 'paid',
      status: inv.status,
      hostedUrl: inv.hosted_invoice_url,
    }));

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ subscription, invoices, paymentMethod }),
    };
  } catch (error: any) {
    console.error('admin-user-stripe error:', error);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
}
