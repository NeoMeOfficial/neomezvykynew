// supabase/functions/redeem-reward/index.ts
//
// Redemption flow for /body/odmeny (PointsRewards.tsx).
//
// Verifies the JWT, loads the reward, checks balance + cooldown +
// per-user cap, then fulfils:
//   • If reward.stripe_coupon_id is set → look up the user's active
//     stripe_subscription_id from `subscriptions` and call
//     stripe.subscriptions.update(subId, { coupon }) so the discount
//     auto-applies to the next invoice — no code typing, invisible.
//   • Otherwise → claim one row from partner_reward_codes and return
//     the code in the response.
//
// Always deducts points via a negative points_ledger row and logs to
// reward_redemptions.
//
// Deploy:
//   supabase functions deploy redeem-reward
//
// Required secrets (Supabase dashboard → Project Settings → Edge Functions):
//   SUPABASE_URL                  — auto-provided
//   SUPABASE_SERVICE_ROLE_KEY     — auto-provided
//   STRIPE_SECRET_KEY             — your sk_test_… or sk_live_…

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Auth ─────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authErr } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', ''),
    );
    if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

    const { reward_slug } = await req.json();
    if (!reward_slug) return json({ error: 'reward_slug required' }, 400);

    // ── Load reward definition ───────────────────────────────────
    const { data: reward, error: rewardErr } = await supabase
      .from('rewards')
      .select('*')
      .eq('slug', reward_slug)
      .eq('active', true)
      .single();

    if (rewardErr || !reward) return json({ error: 'Reward not found' }, 404);

    // ── Check points balance ─────────────────────────────────────
    const { data: balanceRows, error: balErr } = await supabase
      .from('points_ledger')
      .select('points')
      .eq('user_id', user.id);

    if (balErr) return json({ error: 'Could not load points balance' }, 500);

    const balance = (balanceRows ?? []).reduce((sum, r) => sum + (r.points ?? 0), 0);
    if (balance < reward.point_cost) {
      return json({
        error: 'insufficient_points',
        balance,
        required: reward.point_cost,
      }, 400);
    }

    // ── Cooldown check ───────────────────────────────────────────
    const { data: lastRedemption } = await supabase
      .from('reward_redemptions')
      .select('next_eligible_at')
      .eq('user_id', user.id)
      .eq('reward_slug', reward_slug)
      .order('redeemed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastRedemption && new Date(lastRedemption.next_eligible_at) > new Date()) {
      return json({
        error: 'cooldown_active',
        next_eligible_at: lastRedemption.next_eligible_at,
      }, 429);
    }

    // ── Per-user max redemptions cap ─────────────────────────────
    if (reward.max_redemptions_per_user > 0) {
      const { count } = await supabase
        .from('reward_redemptions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('reward_slug', reward_slug);

      if ((count ?? 0) >= reward.max_redemptions_per_user) {
        return json({ error: 'max_redemptions_reached' }, 400);
      }
    }

    // Cooldown window — all rewards: 30 days between uses. No
    // lifetime cap (rewards.max_redemptions_per_user = 0 disables the
    // cap check). Tune per-slug here if needed.
    const cooldownDays = 30;

    const nextEligibleAt = new Date();
    nextEligibleAt.setDate(nextEligibleAt.getDate() + cooldownDays);

    // ── Deduct points FIRST (audit 2026-10-05) ───────────────────
    // The debit used to come after the Stripe coupon with its error
    // ignored — and because ref_id was the bare slug, the dedupe index
    // silently swallowed every repeat debit: infinite free coupons.
    // Now: unique ref per redemption, insert checked, and a post-debit
    // balance re-read closes the concurrent-spend race (fail-closed —
    // overdraw rolls the debit back before anything is fulfilled).
    const debitRef = `${reward_slug}:${crypto.randomUUID()}`;
    const { data: debitRow, error: debitErr } = await supabase
      .from('points_ledger')
      .insert({
        user_id: user.id,
        event_type: 'reward_redeem',
        points: -reward.point_cost,
        ref_id: debitRef,
        ref_type: 'reward',
      })
      .select('id')
      .single();
    if (debitErr || !debitRow) {
      console.error('redeem-reward debit failed:', debitErr);
      return json({ error: 'debit_failed' }, 500);
    }
    const rollbackDebit = async () => {
      await supabase.from('points_ledger').delete().eq('id', debitRow.id);
    };

    const { data: postRows } = await supabase
      .from('points_ledger')
      .select('points')
      .eq('user_id', user.id);
    const postBalance = (postRows ?? []).reduce((sum, r) => sum + (r.points ?? 0), 0);
    if (postBalance < 0) {
      await rollbackDebit();
      return json({ error: 'insufficient_points', balance: postBalance + reward.point_cost, required: reward.point_cost }, 400);
    }

    // ── Fulfil ───────────────────────────────────────────────────
    let resultCode: string | null = null;
    let fulfillmentDetail: string | null = null;
    let nextBillingDate: string | null = null;

    if (reward.stripe_coupon_id) {
      // Subscription discount path — attach Stripe coupon to the user's
      // active subscription. Pulls IDs from the subscriptions table
      // (not profiles — that's where stripe_subscription_id lives in
      // the current schema).
      const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
      if (!stripeKey) return json({ error: 'Stripe not configured' }, 500);

      const { data: subRow } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id, stripe_subscription_id, active, current_period_end')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!subRow?.stripe_subscription_id || !subRow.active) {
        await rollbackDebit();
        return json({ error: 'no_active_subscription' }, 400);
      }

      nextBillingDate = subRow.current_period_end ?? null;

      const stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
      });

      try {
        await stripe.subscriptions.update(subRow.stripe_subscription_id, {
          coupon: reward.stripe_coupon_id,
        });
      } catch (err) {
        console.error('Stripe update failed:', err);
        await rollbackDebit();
        return json({ error: 'stripe_apply_failed', message: (err as Error).message }, 502);
      }

      fulfillmentDetail = `Coupon ${reward.stripe_coupon_id} applied to subscription`;
    } else {
      // Partner code path — claim one available row from the pool.
      const { data: codeRow, error: codeErr } = await supabase
        .from('partner_reward_codes')
        .select('id, code')
        .eq('reward_slug', reward_slug)
        .or('served_to.is.null,expires_at.lt.now()')
        .is('claimed_at', null)
        .limit(1)
        .single();

      if (codeErr || !codeRow) {
        await rollbackDebit();
        return json({ error: 'no_codes_available' }, 503);
      }

      const reservedUntil = new Date();
      reservedUntil.setDate(reservedUntil.getDate() + 7);

      // Conditional claim — only one concurrent redeemer can flip the
      // row from unclaimed; losers refund and retry.
      const { data: claimed } = await supabase
        .from('partner_reward_codes')
        .update({
          served_to: user.id,
          served_at: new Date().toISOString(),
          expires_at: reservedUntil.toISOString(),
          claimed_at: new Date().toISOString(),
        })
        .eq('id', codeRow.id)
        .is('claimed_at', null)
        .select('id');
      if (!claimed || claimed.length === 0) {
        await rollbackDebit();
        return json({ error: 'no_codes_available' }, 503);
      }

      resultCode = codeRow.code;
      fulfillmentDetail = 'Partner code served';
    }

    // ── Log redemption ───────────────────────────────────────────
    const { error: logErr } = await supabase.from('reward_redemptions').insert({
      user_id: user.id,
      reward_slug,
      next_eligible_at: nextEligibleAt.toISOString(),
      stripe_coupon_id: reward.stripe_coupon_id ?? null,
    });
    if (logErr) console.error('redeem-reward: redemption log failed (reward WAS fulfilled):', logErr);

    return json({
      success: true,
      reward_slug,
      code: resultCode,
      fulfillment_detail: fulfillmentDetail,
      points_spent: reward.point_cost,
      next_eligible_at: nextEligibleAt.toISOString(),
      // For subscription discount rewards — date of the next invoice
      // the user will see the discount on. Null for partner rewards.
      next_billing_date: nextBillingDate,
    });
  } catch (err) {
    console.error('redeem-reward error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
});
