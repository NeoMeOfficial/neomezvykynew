// netlify/functions/reconcile-subscriptions.ts
//
// Audit C2 (Sam 2026-10-02): access used to never expire if a webhook
// was missed — subscriptions.active stayed true forever. This daily
// job makes Stripe the source of truth again: every row that claims to
// be active and has a Stripe subscription id is re-checked, and
// active/current_period_end/cancel_at_period_end are synced back.
// Deleted-in-Stripe subscriptions flip to inactive. Rows WITHOUT a
// Stripe id (admin-granted access) are left alone on purpose.
//
// Runs daily at 03:15 UTC (schedule below); also callable on demand —
// it only writes Stripe's truth, so there is nothing an unauthorized
// caller could abuse.

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { stripeEnv } from './_stripeEnv';

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function handler() {
  const { data: rows, error } = await supabase
    .from('subscriptions')
    .select('user_id, active, stripe_subscription_id, current_period_end, cancel_at_period_end')
    .eq('active', true)
    .not('stripe_subscription_id', 'is', null)
    .limit(500);

  if (error) {
    console.error('reconcile: subscriptions read failed:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  let checked = 0, deactivated = 0, updated = 0, errors = 0;

  for (const row of rows ?? []) {
    if (!row.stripe_subscription_id) continue;
    checked++;
    try {
      let sub: Stripe.Subscription | null = null;
      try {
        sub = await stripe.subscriptions.retrieve(row.stripe_subscription_id);
      } catch (err: any) {
        if (err?.code !== 'resource_missing') throw err;
        // Gone from Stripe entirely → no access.
      }

      const active = !!sub
        && (sub.status === 'active' || sub.status === 'trialing')
        && !sub.pause_collection;
      const periodEnd = sub?.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : row.current_period_end;
      const cancelAtEnd = sub?.cancel_at_period_end ?? row.cancel_at_period_end;

      const changed =
        active !== row.active ||
        periodEnd !== row.current_period_end ||
        cancelAtEnd !== row.cancel_at_period_end;
      if (!changed) continue;

      const { error: upErr } = await supabase
        .from('subscriptions')
        .update({
          active,
          tier: active ? 'neome_plus' : 'free',
          current_period_end: periodEnd,
          cancel_at_period_end: cancelAtEnd,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', row.user_id);
      if (upErr) throw upErr;

      if (!active) deactivated++;
      else updated++;
      console.log(`reconcile: ${row.user_id} → active=${active} (stripe status ${sub?.status ?? 'missing'})`);
    } catch (err) {
      errors++;
      console.error(`reconcile: failed for ${row.user_id}:`, err);
    }
  }

  const summary = { checked, deactivated, updated, errors };
  console.log('reconcile-subscriptions done:', JSON.stringify(summary));
  return { statusCode: 200, body: JSON.stringify(summary) };
}

export const config = {
  schedule: '15 3 * * *',
};
