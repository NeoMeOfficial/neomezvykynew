import Stripe from 'stripe';
import { stripeEnv } from './_stripeEnv';
import { requireUser, trustedOrigin, safePath } from './_userAuth';

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

/**
 * Server-side allowlist of purchasable prices. Mirrors the client's
 * SUBSCRIPTION_PLANS (src/lib/stripe.ts) — env vars first, same hardcoded
 * fallbacks — so both sides stay in sync when live env vars are set.
 * Without this, any recurring price in the Stripe account could be
 * checked out and would flip `subscriptions.active` via the webhook.
 */
function allowedPriceIds(): Set<string> {
  return new Set(
    [
      process.env.VITE_STRIPE_SUBSCRIPTION_PRICE_ID || 'price_1TM4KREpPqBqxo4m0Swf5F88',
      process.env.VITE_STRIPE_SUBSCRIPTION_QUARTERLY_PRICE_ID || 'price_1TY3sXEpPqBqxo4mJ6EhEPM3',
      process.env.VITE_STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID || 'price_1TY3d6EpPqBqxo4mtqFHOXOz',
      process.env.VITE_STRIPE_MEAL_PRICE_ID || 'price_1TW8SeEpPqBqxo4mOwzTetog',
    ].filter(Boolean),
  );
}

export async function handler(event: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Identity comes from the caller's JWT — never from the request body.
  // A client-supplied userId would let an attacker bind a paid session
  // to an arbitrary account (the webhook grants whatever userId is in
  // session metadata); a client-supplied email attaches the session to
  // someone else's Stripe customer.
  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) {
    return { statusCode: auth.status, headers, body: JSON.stringify({ error: auth.error }) };
  }

  try {
    const { priceId, mode, successPath, cancelPath } = JSON.parse(event.body || '{}');

    if (!priceId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing priceId' }) };
    }
    if (!allowedPriceIds().has(priceId)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown priceId' }) };
    }
    if (!auth.email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Account has no email' }) };
    }

    const checkoutMode: 'subscription' | 'payment' = mode === 'payment' ? 'payment' : 'subscription';
    const userId = auth.userId;
    const email = auth.email;

    // Redirect URLs are built server-side from the trusted origin; the
    // client may only steer the PATH. Absolute client URLs would be an
    // open redirect through the Stripe-branded checkout page.
    const origin = trustedOrigin(event.headers?.origin ?? event.headers?.Origin);
    const type = checkoutMode === 'payment' ? 'meal' : 'subscription';
    const successUrl = origin + safePath(
      successPath,
      `/checkout/success?type=${type}&session_id={CHECKOUT_SESSION_ID}`,
    );
    const cancelUrl = origin + safePath(cancelPath, `/checkout/canceled?type=${type}`);

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      });
    }

    // Create checkout session — subscription (recurring) vs payment (one-time)
    const baseParams = {
      customer: customer.id,
      payment_method_types: ['card'] as const,
      // Force Slovak UI — overrides Stripe's auto-detection from
      // Accept-Language so the checkout page stays consistent for our
      // SK audience regardless of browser locale.
      locale: 'sk' as const,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
      },
    };

    const session = checkoutMode === 'subscription'
      ? await stripe.checkout.sessions.create({
          ...baseParams,
          mode: 'subscription',
          subscription_data: {
            // No trial period — users are billed immediately on
            // checkout. The 7-day trial was removed per product
            // decision.
            metadata: { userId },
          },
        })
      : await stripe.checkout.sessions.create({
          ...baseParams,
          mode: 'payment',
        });

    return {
      statusCode: 200,
      headers,
      // `url` is the Stripe-hosted checkout page; we redirect via
      // window.location instead of the deprecated
      // stripe.redirectToCheckout (removed 2025-09-30). sessionId is
      // kept for callers that still need it.
      body: JSON.stringify({ url: session.url, sessionId: session.id }),
    };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
