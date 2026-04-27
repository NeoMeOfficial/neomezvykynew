import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

/**
 * F-007 · User-callable account deletion.
 *
 * Differs from admin-delete-user: caller is the user themselves,
 * authenticated via their own access token. The function verifies
 * the token, then deletes the auth user (cascades to profile + all
 * user-scoped rows via existing FK on delete cascade), and finally
 * deletes the Stripe customer if one is linked.
 */

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
});

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function handler(event: { httpMethod: string; headers: Record<string, string> }) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'method_not_allowed' }) };

  const auth = event.headers.authorization ?? event.headers.Authorization;
  const token = auth?.replace(/^Bearer\s+/i, '');
  if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'no_token' }) };

  try {
    // Verify token → user id
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData.user) {
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'invalid_token' }) };
    }
    const userId = userData.user.id;

    // Look up linked Stripe customer (subscriptions table or user_credits/profile)
    const { data: subRow } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();
    const stripeCustomerId = subRow?.stripe_customer_id ?? null;

    // Delete Stripe customer (if any). Cancels subs implicitly.
    if (stripeCustomerId && process.env.STRIPE_SECRET_KEY) {
      try {
        await stripe.customers.del(stripeCustomerId);
      } catch (sErr) {
        // Don't block account deletion on Stripe errors — log and continue.
        console.error('delete-account: stripe customer delete failed', sErr);
      }
    }

    // Delete auth user — cascades to profiles + user-scoped tables via FK.
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (delErr) throw delErr;

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ deleted: true }) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    console.error('delete-account error:', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: message }) };
  }
}
