// netlify/functions/create-subscription-intent.ts
//
// Backend for the in-app checkout page (/checkout/plus, Sam 2026-10-05):
// instead of redirecting to Stripe-hosted Checkout, the app renders the
// Payment Element in our own design and confirms against the client
// secret minted here.
//
// Creates the subscription in `default_incomplete` mode — Stripe only
// activates it when the payment on its first invoice succeeds, at which
// point the existing webhook path (customer.subscription.updated →
// upsertSubscription) grants access exactly like the hosted flow did.
// Abandoned attempts stay `incomplete` and Stripe auto-expires them.
//
// Identity comes from the JWT; the priceId must be on the same server
// allowlist as create-checkout-session (subscription prices only — the
// meal plan is a one-time payment and keeps the hosted flow).

import Stripe from 'stripe';
import { stripeEnv } from './_stripeEnv';
import { requireUser, serviceClient } from './_userAuth';

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

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

function allowedSubscriptionPriceIds(): Set<string> {
  const names = [
    'VITE_STRIPE_SUBSCRIPTION_PRICE_ID',
    'VITE_STRIPE_SUBSCRIPTION_QUARTERLY_PRICE_ID',
    'VITE_STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID',
  ];
  const ids = names.flatMap((n) => [process.env[n], process.env[`${n}_TEST`]]);
  return new Set(ids.filter((v): v is string => !!v));
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  let priceId = '';
  try {
    priceId = String(JSON.parse(event.body || '{}').priceId ?? '');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  if (!allowedSubscriptionPriceIds().has(priceId)) {
    return json(400, { error: 'Unknown priceId' });
  }

  try {
    const supabase = serviceClient();

    const { data: existing } = await supabase
      .from('subscriptions')
      .select('active, stripe_customer_id')
      .eq('user_id', auth.userId)
      .maybeSingle();

    if (existing?.active) {
      return json(409, { error: 'Už máš aktívne predplatné.' });
    }

    // Reuse the user's Stripe customer when one exists AND is reachable
    // in the current (test/live) key's universe; otherwise create fresh.
    let customerId = existing?.stripe_customer_id ?? null;
    if (customerId) {
      try {
        const c = await stripe.customers.retrieve(customerId);
        if ((c as Stripe.DeletedCustomer).deleted) customerId = null;
      } catch {
        customerId = null;
      }
    }
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: auth.email ?? undefined,
        metadata: { userId: auth.userId },
      });
      customerId = customer.id;
    }

    // Website promise: monthly is 19 € the first month, 29 € after —
    // implemented as a once-coupon applied automatically here.
    const monthlyIds = new Set(
      [
        process.env.VITE_STRIPE_SUBSCRIPTION_PRICE_ID,
        process.env.VITE_STRIPE_SUBSCRIPTION_PRICE_ID_TEST,
      ].filter(Boolean),
    );
    const firstMonthCoupon =
      process.env.STRIPE_FIRST_MONTH_COUPON_TEST || process.env.STRIPE_FIRST_MONTH_COUPON;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: { userId: auth.userId },
      ...(monthlyIds.has(priceId) && firstMonthCoupon
        ? { discounts: [{ coupon: firstMonthCoupon }] }
        : {}),
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice | null;
    const intent = invoice?.payment_intent as Stripe.PaymentIntent | null;
    if (!intent?.client_secret) {
      console.error('create-subscription-intent: no client_secret', subscription.id);
      return json(500, { error: 'Platbu sa nepodarilo pripraviť.' });
    }

    return json(200, {
      clientSecret: intent.client_secret,
      subscriptionId: subscription.id,
      // Stripe's own charge amount — the page displays this, so a
      // mispicked price ID can never show one number and charge another.
      amount_cents: intent.amount,
    });
  } catch (err: any) {
    console.error('create-subscription-intent error:', err);
    return json(500, { error: err.message ?? 'Server error' });
  }
}
