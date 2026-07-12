// netlify/functions/admin-delete-user.ts
//
// Admin-triggered account deletion.
//
// Mirrors the self-delete flow in delete-account.ts but takes the
// target userId from the request body (instead of inferring from the
// caller's token) AND verifies the caller is an admin first.
//
// Order of ops:
//   1. Auth: caller has profiles.role = 'admin'
//   2. Look up the target user's Stripe customer id (subscriptions
//      table) and delete it in Stripe — cancels any active sub.
//   3. supabase.auth.admin.deleteUser cascades through profiles +
//      every user-scoped FK that has ON DELETE CASCADE.
//
// Returns 200 on success, 4xx for auth/validation, 500 for downstream
// errors with the underlying message so the admin UI can show it.

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { stripeEnv } from './_stripeEnv';
import { requireAdmin } from './_adminAuth';
import { auditLog } from './_auditLog';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
});

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return { statusCode: status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    // ── Admin auth ────────────────────────────────────────────────
    const auth = await requireAdmin(event.headers.authorization || event.headers.Authorization);
    if (!auth.ok) return jsonResponse({ error: auth.error }, auth.status);

    // ── Inputs ────────────────────────────────────────────────────
    const { userId } = JSON.parse(event.body || '{}') as { userId?: string };
    if (!userId) return jsonResponse({ error: 'Missing userId' }, 400);
    if (userId === auth.userId) {
      return jsonResponse({ error: 'Nemôžeš zmazať vlastný účet cez admin. Použi Profil → Zmazať účet.' }, 400);
    }

    // ── Stripe customer cleanup ──────────────────────────────────
    // Pull the Stripe customer id before we lose the row to CASCADE.
    const { data: subRow } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle();
    const stripeCustomerId = subRow?.stripe_customer_id ?? null;

    if (stripeCustomerId && stripeEnv('STRIPE_SECRET_KEY')) {
      try {
        await stripe.customers.del(stripeCustomerId);
      } catch (sErr) {
        // Non-fatal — log and continue. We'd rather orphan a Stripe
        // customer than block the deletion entirely. Ops can clean
        // the Stripe side manually if needed.
        console.error('admin-delete-user: stripe customer delete failed', sErr);
      }
    }

    // ── Auth user delete (cascades through CASCADE-linked tables) ─
    const { error: delErr } = await supabase.auth.admin.deleteUser(userId);
    if (delErr) {
      // The most common cause here is a FK in some app table that's
      // missing ON DELETE CASCADE. Surface the underlying message so
      // we can identify the offending table and fix the schema.
      return jsonResponse({ error: delErr.message }, 500);
    }

    await auditLog(supabase, {
      actor: auth,
      action: 'user_deleted',
      targetUserId: userId,
    });

    return jsonResponse({ deleted: true, stripeCustomerDeleted: !!stripeCustomerId });
  } catch (err: any) {
    console.error('admin-delete-user error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
