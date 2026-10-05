import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { stripeEnv } from './_stripeEnv';
import { sendTransactionalEmail, renderBrandedEmail } from './_resend';

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

// Stripe price ID for the €57 nutrition plan one-time purchase. The webhook
// uses this to identify which checkout.session.completed events should set
// `profiles.nutrition_plan_purchased = true`. Env-overridable so test mode
// can match against the test-mode meal plan price ID.
// Audit C3 (2026-10-02): accept live AND test meal-price ids, no
// hardcoded fallback — an unmatched payment logs instead of guessing.
const MEAL_PLAN_PRICE_IDS = new Set(
  [
    process.env.STRIPE_MEAL_PRICE_ID,
    process.env.STRIPE_MEAL_PRICE_ID_TEST,
    process.env.VITE_STRIPE_MEAL_PRICE_ID,
    process.env.VITE_STRIPE_MEAL_PRICE_ID_TEST,
  ].filter((v): v is string => !!v),
);

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
      stripeEnv('STRIPE_WEBHOOK_SECRET')!
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
        // Paused collection keeps Stripe status 'active' but the user
        // isn't paying — access stops too (Sam: cancel OR pause must
        // restrict access). Audit C2.
        const active = (sub.status === 'active' || sub.status === 'trialing') && !sub.pause_collection;
        await upsertSubscription(sub, active);
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
      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        await handleAffiliateCommission(invoice);
        break;
      }
      case 'charge.refunded':
      case 'charge.dispute.created': {
        // Refunded/disputed money must not pay commission — reverse the
        // matching earning while it's still inside the 30-day maturity
        // window (audit 2026-10-05).
        const obj = stripeEvent.data.object as any;
        const charge: Stripe.Charge = stripeEvent.type === 'charge.refunded'
          ? obj
          : await stripe.charges.retrieve(obj.charge as string);
        await reverseAffiliateCommission(charge);
        break;
      }
      case 'invoice.payment_failed': {
        // Subscription renewal payment failed — user's card was declined
        // or has insufficient funds. Logged so the UI can surface a
        // "please update card" prompt and so Gabi can email-retarget.
        const inv = stripeEvent.data.object as Stripe.Invoice;
        await logPaymentEvent(inv, 'invoice_payment_failed');
        await notifyPaymentFailed(inv);
        break;
      }
      case 'checkout.session.expired': {
        // User opened a checkout but never paid. Default expiry is 24h.
        // Captured so we can retarget abandoned €57 meal-plan carts.
        await logCheckoutEvent(stripeEvent.data.object as Stripe.Checkout.Session, 'checkout_expired');
        break;
      }
      case 'checkout.session.async_payment_failed': {
        // SEPA / bank-redirect payment failed asynchronously.
        await logCheckoutEvent(stripeEvent.data.object as Stripe.Checkout.Session, 'async_payment_failed');
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

// Log a failed invoice (renewal payment declined) to payment_events so the
// app can surface a card-update prompt and Gabi can retarget the user.
async function logPaymentEvent(invoice: Stripe.Invoice, eventType: 'invoice_payment_failed') {
  // Best-effort user lookup: subscription.metadata.userId is the canonical
  // source. If the invoice is for a subscription we can reach the metadata.
  let userId: string | null = null;
  if (invoice.subscription && typeof invoice.subscription === 'string') {
    try {
      const sub = await stripe.subscriptions.retrieve(invoice.subscription);
      userId = sub.metadata?.userId ?? null;
    } catch (err) {
      console.warn('Could not fetch subscription for failed invoice:', err);
    }
  }
  // Fallback: invoice.metadata.userId if set
  if (!userId) userId = invoice.metadata?.userId ?? null;

  const { error } = await supabase.from('payment_events').insert({
    user_id: userId,
    event_type: eventType,
    stripe_object_id: invoice.id,
    stripe_customer_id: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id,
    amount_cents: invoice.amount_due ?? invoice.amount_remaining ?? null,
    currency: invoice.currency,
    failure_code: (invoice.last_finalization_error?.code as string | undefined) ?? null,
    failure_message: invoice.last_finalization_error?.message ?? null,
    metadata: {
      invoice_number: invoice.number,
      hosted_invoice_url: invoice.hosted_invoice_url,
      attempt_count: invoice.attempt_count,
    },
  });

  if (error) {
    console.error('Failed to log invoice payment event:', error);
  } else {
    console.log(`Payment event logged — ${eventType} for user ${userId ?? '(unknown)'}, invoice ${invoice.id}`);
  }
}

/**
 * Send a transactional "card declined" email via Resend on payment
 * failure. Best-effort: never throws — webhook must still return 200
 * to Stripe even if the email fails (Stripe will retry the webhook
 * otherwise, which would re-send the email).
 */
async function notifyPaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  try {
    // Pull customer email. Invoice has it expanded if charge succeeded
    // earlier; otherwise fetch the customer object.
    let email: string | null = null;
    let firstName: string | null = null;
    if (invoice.customer_email) {
      email = invoice.customer_email;
    } else if (typeof invoice.customer === 'string') {
      const cust = await stripe.customers.retrieve(invoice.customer);
      if (!cust.deleted) {
        email = cust.email ?? null;
        firstName = (cust.metadata?.firstName as string | undefined) ?? null;
      }
    }
    if (!email) {
      console.warn('notifyPaymentFailed: no email for invoice', invoice.id);
      return;
    }

    const attempt = invoice.attempt_count ?? 1;
    const nextAttempt = invoice.next_payment_attempt
      ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString('sk-SK')
      : null;
    const hello = firstName ? `Ahoj ${escapeForHtml(firstName)},` : 'Ahoj,';

    const body = `
      <p>${hello}</p>
      <p>Pri obnovení tvojho predplatného NeoMe nám banka odmietla platbu (pokus č. ${attempt}).
      Najčastejšie ide o vypršanú kartu, nedostatok prostriedkov alebo bezpečnostné overenie.</p>
      <p>Aby si nestratila prístup k Plus funkciám, prosíme ťa o aktualizáciu platobnej karty.
      ${nextAttempt ? `Ďalší automatický pokus prebehne <strong>${nextAttempt}</strong>.` : ''}</p>
    `;

    const html = renderBrandedEmail({
      preheader: 'Platba kartou bola odmietnutá — aktualizuj kartu, aby si nestratila prístup.',
      headline: 'Platba sa nepodarila',
      body,
      ctaLabel: 'Aktualizovať kartu',
      ctaHref: 'https://app.neome.com.au/profil/predplatne',
      footnote: 'Ak si platbu nezadávala alebo si si predplatné neobjednala, napíš nám a hneď to vyriešime.',
    });

    await sendTransactionalEmail({
      to: email,
      subject: 'NeoMe · Platba kartou bola odmietnutá',
      html,
    });
    console.log(`notifyPaymentFailed: sent to ${email} for invoice ${invoice.id}`);
  } catch (err) {
    console.error('notifyPaymentFailed failed (non-fatal):', err);
  }
}

function escapeForHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Log an abandoned / failed checkout session to payment_events. Used for
// both 'checkout.session.expired' and 'checkout.session.async_payment_failed'.
async function logCheckoutEvent(
  session: Stripe.Checkout.Session,
  eventType: 'checkout_expired' | 'async_payment_failed',
) {
  const userId = session.metadata?.userId ?? null;

  const { error } = await supabase.from('payment_events').insert({
    user_id: userId,
    event_type: eventType,
    stripe_object_id: session.id,
    stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
    amount_cents: session.amount_total ?? null,
    currency: session.currency,
    failure_code: null,
    failure_message: null,
    metadata: {
      mode: session.mode,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
    },
  });

  if (error) {
    console.error('Failed to log checkout event:', error);
  } else {
    console.log(`Payment event logged — ${eventType} for user ${userId ?? '(unknown)'}, session ${session.id}`);
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
  const boughtMealPlan = lineItems.data.some((item) => !!item.price?.id && MEAL_PLAN_PRICE_IDS.has(item.price.id));
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

  await accrueAffiliateCommission(userId, session.amount_total ?? 0, 'one_time', session.id);
}

// Affiliate program (Sam 2026-10-02): every paid invoice from an
// attributed user accrues commission_pct of the amount to their
// affiliate. stripe_ref is unique, so webhook retries can't double-pay;
// the earning matures (becomes payable) 30 days later.
async function accrueAffiliateCommission(
  userId: string,
  amountCents: number,
  source: 'subscription' | 'one_time',
  stripeRef: string,
) {
  if (!amountCents || amountCents <= 0) return;

  const { data: attribution, error: attrErr } = await supabase
    .from('affiliate_referrals')
    .select('affiliate_user_id')
    .eq('referred_user_id', userId)
    .maybeSingle();
  // Table missing (migration not run yet) or no attribution — nothing to do.
  if (attrErr || !attribution) return;

  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('commission_pct, status')
    .eq('user_id', attribution.affiliate_user_id)
    .maybeSingle();
  if (!affiliate) return;

  // Candidate referrers earn POINTS, approved affiliates earn MONEY —
  // never both for the same payment (Sam's Decision B, 2026-10-05).
  // ref_id is keyed on the referred user, so only her FIRST payment
  // pays the +150 (renewals hit the unique index and are skipped).
  if (affiliate.status === 'candidate') {
    const { error: ptsErr } = await supabase.from('points_ledger').insert({
      user_id: attribution.affiliate_user_id,
      event_type: 'referral_paid',
      points: 150,
      ref_id: `referral_${userId}`,
      ref_type: 'referral',
    });
    if (ptsErr && (ptsErr as any).code !== '23505') {
      console.error('Referral points award failed:', ptsErr);
    } else if (!ptsErr) {
      console.log(`Referral +150 pts awarded to candidate ${attribution.affiliate_user_id} (referred ${userId} paid)`);
    }
    return;
  }
  if (affiliate.status !== 'active') return;

  const commission = Math.floor((amountCents * Number(affiliate.commission_pct)) / 100);
  if (commission <= 0) return;

  const availableAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
  const { error } = await supabase.from('affiliate_earnings').insert({
    affiliate_user_id: attribution.affiliate_user_id,
    referred_user_id: userId,
    amount_cents: commission,
    source,
    stripe_ref: stripeRef,
    available_at: availableAt,
  });
  if (error) {
    if ((error as any).code === '23505') return; // retry — already accrued
    console.error('Affiliate commission accrual failed:', error);
  } else {
    console.log(`Affiliate commission ${commission}c accrued to ${attribution.affiliate_user_id} (${source} ${stripeRef})`);
  }
}

// Flip the earning tied to a refunded/disputed payment to 'reversed'.
// stripe_ref is the invoice id (subscriptions) or the checkout session
// id (one-time) — resolve both from the charge. Already-paid earnings
// are left alone but logged loudly so Gabi can claw back manually.
async function reverseAffiliateCommission(charge: Stripe.Charge) {
  const refs: string[] = [];
  if (typeof charge.invoice === 'string') refs.push(charge.invoice);
  if (typeof charge.payment_intent === 'string') {
    try {
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: charge.payment_intent,
        limit: 1,
      });
      if (sessions.data[0]?.id) refs.push(sessions.data[0].id);
    } catch (err) {
      console.error('Refund reversal: session lookup failed:', err);
    }
  }
  if (refs.length === 0) return;

  const { data: reversed, error } = await supabase
    .from('affiliate_earnings')
    .update({ status: 'reversed' })
    .in('stripe_ref', refs)
    .eq('status', 'accrued')
    .select('id, affiliate_user_id, amount_cents');
  if (error) {
    console.error('Refund reversal failed:', error);
    return;
  }
  if (reversed && reversed.length > 0) {
    console.log(`Reversed ${reversed.length} affiliate earning(s) for refunded charge ${charge.id}`);
  } else {
    const { data: paid } = await supabase
      .from('affiliate_earnings')
      .select('id, affiliate_user_id, amount_cents, status')
      .in('stripe_ref', refs)
      .neq('status', 'accrued');
    if (paid && paid.length > 0) {
      console.error(`ATTENTION: refund on charge ${charge.id} but earning already ${paid[0].status} — manual clawback needed:`, JSON.stringify(paid));
    }
  }
}

async function handleAffiliateCommission(invoice: Stripe.Invoice) {
  // userId travels in subscription metadata (set at checkout); Stripe
  // copies it onto the invoice via subscription_details.
  let userId = (invoice as any).subscription_details?.metadata?.userId as string | undefined;
  if (!userId && typeof invoice.subscription === 'string') {
    try {
      const sub = await stripe.subscriptions.retrieve(invoice.subscription);
      userId = sub.metadata?.userId;
    } catch (err) {
      console.error('Invoice subscription lookup failed:', err);
    }
  }
  if (!userId) return;
  await accrueAffiliateCommission(userId, invoice.amount_paid, 'subscription', invoice.id);
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
