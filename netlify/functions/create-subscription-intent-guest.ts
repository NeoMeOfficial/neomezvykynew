// netlify/functions/create-subscription-intent-guest.ts
//
// Pay-first flow (Sam 2026-10-06): the plan picker sends people
// straight to checkout with NO account. This endpoint takes an email +
// priceId, silently creates the auth user (confirmed — they're paying,
// not proving an inbox), and mints the same default_incomplete
// subscription as the logged-in variant with metadata.userId, so the
// webhook grants access identically. The password is claimed on the
// success screen via complete-guest-account, with the PaymentIntent
// client secret as possession proof.
//
// An email that already has an account gets 409 — attaching a payment
// to an existing account requires logging into it first.

import Stripe from 'stripe';
import { stripeEnv } from './_stripeEnv';
import { serviceClient } from './_userAuth';

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let priceId = '';
  let email = '';
  try {
    const body = JSON.parse(event.body || '{}');
    priceId = String(body.priceId ?? '');
    email = String(body.email ?? '').trim().toLowerCase();
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  if (!allowedSubscriptionPriceIds().has(priceId)) return json(400, { error: 'Unknown priceId' });
  if (!EMAIL_RE.test(email) || email.length > 254) return json(400, { error: 'Neplatný e-mail.' });

  try {
    const supabase = serviceClient();

    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (createErr) {
      const msg = (createErr.message || '').toLowerCase();
      if (msg.includes('already') || (createErr as any).code === 'email_exists' || (createErr as any).status === 422) {
        return json(409, { error: 'Tento e-mail už má účet. Prihlás sa a pokračuj v platbe v aplikácii.' });
      }
      console.error('guest createUser failed:', createErr);
      return json(500, { error: 'Účet sa nepodarilo pripraviť.' });
    }
    const userId = created.user.id;

    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: { userId },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice | null;
    const intent = invoice?.payment_intent as Stripe.PaymentIntent | null;
    if (!intent?.client_secret) {
      console.error('guest intent: no client_secret', subscription.id);
      return json(500, { error: 'Platbu sa nepodarilo pripraviť.' });
    }

    return json(200, {
      clientSecret: intent.client_secret,
      subscriptionId: subscription.id,
      amount_cents: intent.amount,
    });
  } catch (err: any) {
    console.error('create-subscription-intent-guest error:', err);
    return json(500, { error: err.message ?? 'Server error' });
  }
}
