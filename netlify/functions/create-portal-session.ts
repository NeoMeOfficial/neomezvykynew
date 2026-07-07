import Stripe from 'stripe';
import { stripeEnv } from './_stripeEnv';
import { requireUser, serviceClient, trustedOrigin, safePath } from './_userAuth';

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

  // The billing portal exposes the customer's card, invoices and cancel
  // button — the customer is resolved from the caller's JWT, never from
  // a client-supplied customerId.
  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) {
    return { statusCode: auth.status, headers, body: JSON.stringify({ error: auth.error }) };
  }

  try {
    const { returnPath } = JSON.parse(event.body || '{}');

    const { data: sub } = await serviceClient()
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', auth.userId)
      .maybeSingle();

    if (!sub?.stripe_customer_id) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'No Stripe customer found' }) };
    }

    const origin = trustedOrigin(event.headers?.origin ?? event.headers?.Origin);

    // Create portal session. Locale forced to Slovak for UI consistency
    // with the checkout flow.
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: origin + safePath(returnPath, '/profil/predplatne'),
      locale: 'sk',
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: portalSession.url }),
    };
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
