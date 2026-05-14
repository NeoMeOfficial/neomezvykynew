import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Stripe price ID for the €57 nutrition plan one-time purchase. The webhook
// uses this to identify which checkout.session.completed events should set
// `profiles.nutrition_plan_purchased = true`.
const MEAL_PLAN_PRICE_ID = 'price_1TW8SeEpPqBqxo4mOwzTetog';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function handler(event: any) {
  const signature = event.headers['stripe-signature'];

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid signature' }) };
  }

  try {
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = stripeEvent.data.object as Stripe.Subscription;
        const active = sub.status === 'active' || sub.status === 'trialing';
        await upsertSubscription(sub, active);
        if (active) await handleReferralConversion(sub);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = stripeEvent.data.object as Stripe.Subscription;
        await upsertSubscription(sub, false);
        break;
      }
      case 'checkout.session.completed': {
        // One-time purchases (mode='payment') land here. Subscriptions
        // also fire this event but are handled by the subscription.*
        // cases above.
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        if (session.mode === 'payment') {
          await handleOneTimePayment(session);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

// Handle one-time purchases. Currently only the €57 meal plan add-on:
// expanded line items are checked for the known price id, and on match we
// flip profiles.nutrition_plan_purchased so the client unlocks the planner.
async function handleOneTimePayment(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('No userId in checkout.session.completed metadata:', session.id);
    return;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
  const boughtMealPlan = lineItems.data.some((item) => item.price?.id === MEAL_PLAN_PRICE_ID);
  if (!boughtMealPlan) {
    console.log('One-time payment for unknown price — no action:', session.id);
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ nutrition_plan_purchased: true, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Failed to flip nutrition_plan_purchased for', userId, ':', error);
  } else {
    console.log(`Meal plan purchased — user ${userId} unlocked.`);
  }
}

// When a new subscription goes active, check if the user was referred and award
// points to the referrer (300 pts) if not already issued.
async function handleReferralConversion(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId;
  if (!userId) return;

  // Only fire once per subscription (guard via sub_reward_issued)
  const { data: referral } = await supabase
    .from('referrals')
    .select('id, referrer_id, sub_reward_issued')
    .eq('referred_id', userId)
    .maybeSingle();

  if (!referral || referral.sub_reward_issued) return;

  const now = new Date().toISOString();

  // Mark conversion timestamps + issued flags
  await supabase
    .from('referrals')
    .update({ subscribed_at: now, sub_reward_issued: true })
    .eq('id', referral.id);

  // Award 300 points to the referrer
  const { error } = await supabase.from('points_ledger').insert({
    user_id: referral.referrer_id,
    event_type: 'referral_sub',
    points: 300,
    ref_id: referral.id,
    ref_type: 'referral',
  });

  if (error) {
    console.error('Failed to award referral sub points:', error);
  } else {
    console.log(`Referral sub reward (300 pts) awarded to ${referral.referrer_id} for converting ${userId}`);
  }
}

async function upsertSubscription(sub: Stripe.Subscription, active: boolean) {
  const userId = sub.metadata?.userId;
  if (!userId) {
    console.error('No userId in subscription metadata — cannot update DB:', sub.id);
    return;
  }

  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        tier: active ? 'neome_plus' : 'free',
        active,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        current_period_end: periodEnd,
        cancel_at_period_end: sub.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error('Error upserting subscription for user', userId, ':', error);
  } else {
    console.log(`Subscription upserted — user: ${userId}, active: ${active}, tier: ${active ? 'neome_plus' : 'free'}`);
  }
}
