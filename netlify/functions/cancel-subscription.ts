import Stripe from 'stripe';
import { stripeEnv } from './_stripeEnv';
import { requireUser, serviceClient } from './_userAuth';

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

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

  // Identify the caller from their JWT — the subscription to cancel is
  // looked up server-side. A client-supplied subscriptionId would let
  // anyone cancel other customers' subscriptions.
  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) {
    return { statusCode: auth.status, headers, body: JSON.stringify({ error: auth.error }) };
  }

  try {
    const { data: sub } = await serviceClient()
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', auth.userId)
      .maybeSingle();

    if (!sub?.stripe_subscription_id) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'No active subscription found' }) };
    }

    // Cancel at period end (not immediately)
    const subscription = await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ canceled: true, cancelAt: subscription.cancel_at }),
    };
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
}
