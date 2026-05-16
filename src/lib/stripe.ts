import { loadStripe } from '@stripe/stripe-js';

/**
 * Env lookup with explicit test-suffix override.
 *
 *   {KEY}_TEST   — wins if set; intended for Netlify "Deploy previews"
 *                  scope so the variable name itself reads as test.
 *   {KEY}        — falls back when no _TEST value is present.
 *
 * Lets a single Netlify site host both live (production scope) and test
 * (deploy-preview scope) without renaming the constants in code.
 */
const env = (name: string): string | undefined => {
  const e = import.meta.env as Record<string, string | undefined>;
  return e[`${name}_TEST`] || e[name];
};

// Initialize Stripe
export const stripePromise = loadStripe(env('VITE_STRIPE_PUBLISHABLE_KEY') || '');

// One-time purchase: €57 nutrition plan add-on.
// Activates `profile.nutrition_plan_purchased = true` via the Stripe webhook
// on checkout.session.completed, which the Subscription context then reads
// as hasMealPlanner.
//
// Price IDs default to the live-mode values but can be overridden per env
// (Netlify) so test mode can use distinct test-mode price IDs without a
// code change. _TEST suffix wins when present.
export const MEAL_PLAN_PRICE_ID =
  env('VITE_STRIPE_MEAL_PRICE_ID') || 'price_1TW8SeEpPqBqxo4mOwzTetog';

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  premium: {
    priceId:
      env('VITE_STRIPE_SUBSCRIPTION_PRICE_ID') || 'price_1TM4KREpPqBqxo4m0Swf5F88',
    price: 24.90,
    currency: 'EUR',
    interval: 'month',
    name: 'NeoMe Premium',
    features: [
      'Všetky fitness programy (4 úrovne)',
      'Neobmedzený prístup k 108+ receptom', 
      'Sledovanie menštruačného cyklu a symptómov',
      'Komunita slovenských žien a buddy systém',
      'Osobný denník a sledovanie návykov',
      'Offline prístup k obsahu a meditáciám'
    ],
    highlights: [
      '15-minútové tréningy prispôsobené cyklu',
      'Recepty s ingredienciami z Tesca', 
      'Podpora od skúsených mám',
      'Bez dlhodobých záväzkov'
    ]
  },
};

// Subscription status types
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired';

export interface SubscriptionData {
  id: string;
  status: SubscriptionStatus;
  current_period_start: number;
  current_period_end: number;
  trial_end?: number;
  cancel_at_period_end: boolean;
  customer_id: string;
}

// Create checkout session. `mode` defaults to 'subscription' for the
// recurring NeoMe Plus plan; pass 'payment' for one-time purchases like
// the €57 meal plan add-on (the Netlify function omits trial + subscription
// metadata in payment mode and the webhook treats it as a one-shot flag flip).
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  email: string,
  mode: 'subscription' | 'payment' = 'subscription',
  options?: { successUrl?: string; cancelUrl?: string },
) {
  try {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        email,
        mode,
        successUrl: options?.successUrl ?? `${window.location.origin}/checkout/success?type=subscription&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: options?.cancelUrl ?? `${window.location.origin}/checkout/canceled?type=subscription`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url, sessionId } = await response.json();
    return { url, sessionId } as { url: string; sessionId: string };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Create customer portal session
export async function createPortalSession(customerId: string) {
  try {
    const response = await fetch('/.netlify/functions/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/profil/predplatne`
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

// Enhanced mock functions for realistic demo experience
export async function createCheckoutSessionMock(priceId: string, userId: string, email: string) {
  console.log('🎯 Demo: Creating checkout session for:', { 
    plan: SUBSCRIPTION_PLANS.premium.name,
    price: formatPrice(SUBSCRIPTION_PLANS.premium.price),
    email,
    userId: userId.substring(0, 8) + '...'
  });
  
  // Simulate realistic processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create realistic mock subscription (demo flow only — no trial).
  const mockSubscription = {
    id: 'sub_demo_neome_' + Date.now(),
    status: 'active' as SubscriptionStatus,
    current_period_start: Date.now() / 1000,
    current_period_end: (Date.now() + (30 * 24 * 60 * 60 * 1000)) / 1000,
    cancel_at_period_end: false,
    customer_id: 'cus_demo_neome_' + userId.substring(0, 8)
  };
  
  // Store mock subscription with metadata
  const subscriptionData = {
    ...mockSubscription,
    plan_name: SUBSCRIPTION_PLANS.premium.name,
    price: SUBSCRIPTION_PLANS.premium.price,
    currency: SUBSCRIPTION_PLANS.premium.currency,
    created_at: new Date().toISOString(),
    payment_method: {
      type: 'card',
      brand: 'visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2028
    }
  };
  
  localStorage.setItem(`subscription_${userId}`, JSON.stringify(subscriptionData));
  
  // Log demo success
  console.log('✅ Demo subscription created successfully!', {
    subscriptionId: mockSubscription.id,
    status: mockSubscription.status,
    trialDays: 7,
    price: formatPrice(SUBSCRIPTION_PLANS.premium.price)
  });
  
  return 'demo_session_success';
}

export async function createPortalSessionMock(customerId: string) {
  console.log('🎯 Demo: Accessing billing portal for customer:', customerId);
  
  // Simulate portal access delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('✅ Demo billing portal accessed - staying on current page');
  
  // In demo mode, we just show a notification instead of redirecting
  return 'demo_portal_access';
}

// Utility functions
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

export function isSubscriptionActive(subscription: SubscriptionData | null): boolean {
  if (!subscription) return false;
  
  const now = Date.now() / 1000;
  
  return (
    subscription.status === 'active' || 
    subscription.status === 'trialing' ||
    (subscription.status === 'past_due' && subscription.current_period_end > now)
  );
}

export function isTrialActive(subscription: SubscriptionData | null): boolean {
  if (!subscription) return false;
  
  const now = Date.now() / 1000;
  
  return (
    subscription.status === 'trialing' && 
    subscription.trial_end && 
    subscription.trial_end > now
  );
}

export function getSubscriptionEndDate(subscription: SubscriptionData | null): Date | null {
  if (!subscription) return null;
  
  const endTimestamp = subscription.trial_end || subscription.current_period_end;
  return new Date(endTimestamp * 1000);
}

export function getDaysUntilExpiration(subscription: SubscriptionData | null): number {
  const endDate = getSubscriptionEndDate(subscription);
  if (!endDate) return 0;
  
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}