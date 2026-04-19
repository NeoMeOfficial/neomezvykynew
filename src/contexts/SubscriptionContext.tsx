/**
 * Unified Subscription Module
 *
 * Single provider + hook that replaces:
 *  - SimpleSubscriptionContext (deleted)
 *  - old usePaywall hook (deleted)
 *  - old SubscriptionContext (this file, rewritten)
 *
 * Dual-mode:
 *  - Demo (no Stripe key): everything unlocked, checkout is a no-op
 *  - Production (Stripe key present): real gating, Stripe checkout + billing
 */
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  type SubscriptionData,
  isSubscriptionActive,
  isTrialActive,
  getDaysUntilExpiration,
  createCheckoutSession,
  createCheckoutSessionMock,
  createPortalSession,
  createPortalSessionMock,
  SUBSCRIPTION_PLANS,
  stripePromise,
} from '../lib/stripe';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentType = 'recipes' | 'exercises' | 'meditations' | 'stretches';
export type Tier = 'free' | 'premium';

const MEAL_PLANNER_KEY = 'neome_meal_planner_purchased';

/** Per-tier content limits. -1 = unlimited. */
const TIER_LIMITS: Record<Tier, Record<ContentType, number>> = {
  free: { recipes: 10, exercises: 3, meditations: 3, stretches: 3 },
  premium: { recipes: -1, exercises: -1, meditations: -1, stretches: -1 },
};

// True when a real Stripe publishable key is configured
const isStripeConfigured = () =>
  !!(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY &&
    (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_') ||
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_'))
  );

// True when Supabase is configured (auth available)
const isAuthConfigured = () =>
  !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface SubscriptionContextType {
  // Stripe-level data (for SubscriptionManagement page)
  subscription: SubscriptionData | null;

  // Computed access state
  tier: Tier;
  isPremium: boolean;
  isTrialing: boolean;
  daysLeft: number;
  loading: boolean;
  isLoading: boolean; // alias for loading (used by SubscriptionManagement)

  // Content access
  canAccess: (content: ContentType) => boolean;
  getRemaining: (content: ContentType) => number | null; // null = unlimited

  // Meal planner (separate one-time purchase)
  hasMealPlanner: boolean;
  canUseMealPlanner: boolean; // alias for hasMealPlanner (used by legacy callers)
  purchaseMealPlanner: () => void;

  // Paywall gate — shows paywall modal (managed by provider)
  gate: () => void;
  paywallVisible: boolean;
  dismissPaywall: () => void;

  // Stripe actions
  startCheckout: (priceId: string) => Promise<void>;
  manageBilling: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);

  const [mealPlannerPurchased, setMealPlannerPurchased] = useState<boolean>(
    () => localStorage.getItem(MEAL_PLANNER_KEY) === 'true'
  );

  // Demo mode: no Stripe key → everything unlocked
  const demoMode = !isStripeConfigured();

  // ------ Load subscription on mount (production only) ------
  useEffect(() => {
    if (demoMode) return;
    loadSubscription();
  }, [demoMode]);

  const loadSubscription = async () => {
    setLoading(true);
    try {
      // Check localStorage for mock/dev subscription
      const userId = getUserId();
      if (userId) {
        const stored = localStorage.getItem(`subscription_${userId}`);
        if (stored) {
          setSubscription(JSON.parse(stored));
          setLoading(false);
          return;
        }
      }
      // TODO: When Supabase subscription table is ready, fetch from there
      setSubscription(null);
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  // ------ Derived state ------
  const isPremium = demoMode || isSubscriptionActive(subscription);
  const isTrialing = !demoMode && isTrialActive(subscription);
  const daysLeft = demoMode ? 999 : getDaysUntilExpiration(subscription);
  const tier: Tier = isPremium ? 'premium' : 'free';

  const canAccess = useCallback(
    (content: ContentType): boolean => {
      if (demoMode) return true;
      if (isPremium) return true;
      const limit = TIER_LIMITS.free[content];
      // For now, free tier has a static limit — usage tracking comes later
      return limit > 0;
    },
    [demoMode, isPremium]
  );

  const getRemaining = useCallback(
    (content: ContentType): number | null => {
      if (demoMode || isPremium) return null; // unlimited
      return TIER_LIMITS.free[content];
    },
    [demoMode, isPremium]
  );

  // ------ Paywall gate ------
  const gate = useCallback(() => {
    if (demoMode || isPremium) return; // no-op in demo or premium
    setPaywallVisible(true);
  }, [demoMode, isPremium]);

  const dismissPaywall = useCallback(() => setPaywallVisible(false), []);

  // ------ Meal planner ------
  const purchaseMealPlanner = useCallback(() => {
    localStorage.setItem(MEAL_PLANNER_KEY, 'true');
    setMealPlannerPurchased(true);
  }, []);

  // ------ Stripe actions ------
  const startCheckout = useCallback(
    async (priceId: string) => {
      setLoading(true);
      try {
        const userId = getUserId();
        const email = getUserEmail();

        if (isStripeConfigured()) {
          const sessionId = await createCheckoutSession(priceId, userId || 'anon', email || '');
          const stripe = await stripePromise;
          if (stripe) {
            await stripe.redirectToCheckout({ sessionId });
          }
        } else {
          const sessionId = await createCheckoutSessionMock(priceId, userId || 'demo', email || 'demo@neome.sk');
          if (sessionId === 'demo_session_success') {
            await loadSubscription();
          }
        }
      } catch (error) {
        console.error('Error starting checkout:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const manageBilling = useCallback(async () => {
    if (!subscription) throw new Error('No active subscription');
    setLoading(true);
    try {
      if (isStripeConfigured()) {
        const portalUrl = await createPortalSession(subscription.customer_id);
        window.location.href = portalUrl;
      } else {
        await createPortalSessionMock(subscription.customer_id);
        alert('Demo: v produkcii by si bola presmerovaná na Stripe billing portál.');
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  const cancelSubscription = useCallback(async () => {
    if (!subscription) throw new Error('No subscription to cancel');
    const userId = getUserId();
    setLoading(true);
    try {
      if (isStripeConfigured()) {
        await fetch('/.netlify/functions/cancel-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId: subscription.id, userId }),
        });
      }
      const canceled = { ...subscription, cancel_at_period_end: true };
      setSubscription(canceled);
      if (!isStripeConfigured() && userId) {
        localStorage.setItem(`subscription_${userId}`, JSON.stringify(canceled));
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  const refreshSubscription = useCallback(async () => {
    await loadSubscription();
  }, []);

  // ------ Context value ------
  const hasMealPlannerValue = demoMode || mealPlannerPurchased;

  const value: SubscriptionContextType = {
    subscription,
    tier,
    isPremium,
    isTrialing,
    daysLeft,
    loading,
    isLoading: loading,
    canAccess,
    getRemaining,
    hasMealPlanner: hasMealPlannerValue,
    canUseMealPlanner: hasMealPlannerValue,
    purchaseMealPlanner,
    gate,
    paywallVisible,
    dismissPaywall,
    startCheckout,
    manageBilling,
    cancelSubscription,
    refreshSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Full subscription context — use in any component. */
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

/**
 * Convenience hook for the most common pattern: check content access + gate.
 *
 *   const { allowed, gate } = useAccess('recipes');
 *   if (!allowed) return gate();
 */
export function useAccess(content: ContentType) {
  const { canAccess, getRemaining, gate, loading } = useSubscription();
  return {
    allowed: canAccess(content),
    remaining: getRemaining(content),
    gate,
    loading,
  };
}

/** Quick boolean check. */
export function useIsPremium(): boolean {
  const { isPremium } = useSubscription();
  return isPremium;
}

// ---------------------------------------------------------------------------
// Helpers (read auth state without importing auth context — avoids circular dep)
// ---------------------------------------------------------------------------

function getUserId(): string | null {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return null;
    const key = 'sb-' + new URL(supabaseUrl).hostname.split('.')[0] + '-auth-token';
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user?.id || null;
  } catch {
    return null;
  }
}

function getUserEmail(): string | null {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return null;
    const key = 'sb-' + new URL(supabaseUrl).hostname.split('.')[0] + '-auth-token';
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user?.email || null;
  } catch {
    return null;
  }
}
