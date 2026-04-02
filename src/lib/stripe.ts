import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  premium: {
    priceId: 'price_demo_neome_premium_monthly', // Demo price ID
    price: 14.90,
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
  trial: {
    days: 7,
    name: '7-dňová skúška zadarmo'
  }
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

// Create checkout session
export async function createCheckoutSession(priceId: string, userId: string, email: string) {
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
        successUrl: `${window.location.origin}/domov-new?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/profil/predplatne?canceled=true`
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Create customer portal session
export async function createPortalSession(customerId: string) {
  try {
    const response = await fetch('/api/create-portal-session', {
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
  
  // Create realistic mock subscription
  const mockSubscription = {
    id: 'sub_demo_neome_' + Date.now(),
    status: 'trialing' as SubscriptionStatus,
    current_period_start: Date.now() / 1000,
    current_period_end: (Date.now() + (30 * 24 * 60 * 60 * 1000)) / 1000,
    trial_end: (Date.now() + (7 * 24 * 60 * 60 * 1000)) / 1000,
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