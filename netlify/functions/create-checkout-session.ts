import Stripe from 'stripe';
import { stripeEnv } from './_stripeEnv';

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

export async function handler(event: any, context: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { priceId, userId, email, mode, successUrl, cancelUrl } = JSON.parse(event.body);

    if (!priceId || !userId || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    const checkoutMode: 'subscription' | 'payment' = mode === 'payment' ? 'payment' : 'subscription';

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