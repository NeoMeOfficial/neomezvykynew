import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function handler(event: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { subscriptionId } = JSON.parse(event.body);

    if (!subscriptionId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing subscriptionId' }) };
    }

    // Cancel at period end (not immediately)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
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
