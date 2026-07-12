// netlify/functions/admin-cancel-subscription.ts
//
// Admin-side subscription cancellation for a TARGET user.
//
// Deliberately separate from cancel-subscription.ts: that function is the
// self-service path and derives the subscription from the CALLER's JWT —
// pointing the admin UI at it would cancel the admin's own subscription.
// Here the target comes from the request body and the caller must be an
// admin. Cancels at period end (customer keeps what they paid for).
// Refunds stay a manual Stripe-dashboard operation for now.

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { stripeEnv } from './_stripeEnv';
import { requireAdmin } from './_adminAuth';
import { auditLog } from './_auditLog';

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  const auth = await requireAdmin(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) {
    return { statusCode: auth.status, headers: CORS, body: JSON.stringify({ error: auth.error }) };
  }

  try {
    const { userId } = JSON.parse(event.body || '{}');
    if (!userId) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'userId is required' }) };
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!sub?.stripe_subscription_id) {
      return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'User has no Stripe subscription' }) };
    }

    const subscription = await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await auditLog(supabase, {
      actor: auth,
      action: 'subscription_cancelled_by_admin',
      targetUserId: userId,
      detail: { stripe_subscription_id: sub.stripe_subscription_id },
    });

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ canceled: true, cancelAt: subscription.cancel_at }),
    };
  } catch (error: any) {
    console.error('admin-cancel-subscription error:', error);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
}
