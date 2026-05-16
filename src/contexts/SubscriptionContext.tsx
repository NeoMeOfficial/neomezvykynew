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
  MEAL_PLAN_PRICE_ID,
} from '../lib/stripe';
import { supabase } from '../lib/supabase';

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

// True when a real Stripe publishable key is configured. Honors the
// _TEST suffix override so deploy previews (test mode) are detected too.
const isStripeConfigured = () => {
  const e = import.meta.env as Record<string, string | undefined>;
  const key = e.VITE_STRIPE_PUBLISHABLE_KEY_TEST || e.VITE_STRIPE_PUBLISHABLE_KEY;
  return !!(key && (key.startsWith('pk_test_') || key.startsWith('pk_live_')));
};

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
  purchaseMealPlanner: (opts?: { successUrl?: string; cancelUrl?: string }) => Promise<void>;

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

  // Dev-only tier override (set via Admin → Premium Access panel).
  // Stored in localStorage as `dev_tier_override_${userId}` = 'plus' | 'free'.
  // Highest-priority signal: overrides demoMode AND any real subscription.
  // Only honoured in dev builds (import.meta.env.DEV) so it can never leak to prod.
  const [devOverride, setDevOverride] = useState<Tier | null>(() => {
    if (!import.meta.env.DEV) return null;
    try {
      const userId = getUserId();
      if (!userId) return null;
      const stored = localStorage.getItem(`dev_tier_override_${userId}`);
      if (stored === 'premium' || stored === 'free') return stored;
      return null;
    } catch {
      return null;
    }
  });

  // Listen for cross-tab/admin-panel updates so the toggle reflects immediately.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const sync = () => {
      try {
        const userId = getUserId();
        if (!userId) return setDevOverride(null);
        const stored = localStorage.getItem(`dev_tier_override_${userId}`);
        setDevOverride(stored === 'premium' || stored === 'free' ? stored : null);
      } catch {
        setDevOverride(null);
      }
    };
    window.addEventListener('storage', sync);
    window.addEventListener('neome:dev-tier-override', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('neome:dev-tier-override', sync);
    };
  }, []);

  // ------ Load subscription on mount ------
  // Also retry once after 3 s if returning from Stripe Checkout (webhook may not have fired yet)
  useEffect(() => {
    if (demoMode) return;
    loadSubscription();
    const params = new URLSearchParams(window.location.search);
    if (params.has('session_id')) {
      const t = setTimeout(() => loadSubscription(), 3000);
      return () => clearTimeout(t);
    }
  }, [demoMode]);

  const loadSubscription = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) { setSubscription(null); return; }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('tier, active, stripe_customer_id, stripe_subscription_id, current_period_end, cancel_at_period_end')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Could not load subscription from Supabase:', error.message);
        setSubscription(null);
        return;
      }

      if (data?.active) {
        setSubscription({
          id: data.stripe_subscription_id || '',
          status: 'active',
          current_period_start: 0,
          current_period_end: data.current_period_end
            ? new Date(data.current_period_end).getTime() / 1000
            : 0,
          cancel_at_period_end: data.cancel_at_period_end ?? false,
          customer_id: data.stripe_customer_id || '',
        });
      } else {
        setSubscription(null);
      }

      // Read nutrition_plan_purchased from profile (source of truth — set by
      // the Stripe webhook on a successful one-time payment). Merge with the
      // localStorage cache so the UI doesn't flash unpurchased state on reload.
      const { data: profileData } = await supabase
        .from('profiles')
        .select('nutrition_plan_purchased')
        .eq('id', userId)
        .maybeSingle();
      if (profileData?.nutrition_plan_purchased) {
        setMealPlannerPurchased(true);
        localStorage.setItem(MEAL_PLANNER_KEY, 'true');
      } else {
        // DB is the source of truth. If it says false, clear any stale
        // local cache so the UI doesn't keep showing as purchased after
        // a refund / reset / fresh test account.
        setMealPlannerPurchased(false);
        localStorage.removeItem(MEAL_PLANNER_KEY);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  // ------ Derived state ------
  // Dev override takes top priority (only when import.meta.env.DEV is true).
  const overrideForcesPremium = devOverride === 'premium';
  const overrideForcesFree    = devOverride === 'free';

  const isPremium =
    overrideForcesPremium ||
    (!overrideForcesFree && (demoMode || isSubscriptionActive(subscription)));
  const isTrialing = !demoMode && !devOverride && isTrialActive(subscription);
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
  // Opens a Stripe one-time checkout for the €57 nutrition plan add-on.
  // On successful payment, the stripe-webhook flips
  // profiles.nutrition_plan_purchased and loadSubscription() picks it up
  // on next mount (or on the post-checkout redirect back to /domov-new).
  // Demo / unconfigured-Stripe path falls back to the previous local-only
  // unlock so the UI still works end-to-end without keys.
  const purchaseMealPlanner = useCallback(async (opts?: { successUrl?: string; cancelUrl?: string }) => {
    if (demoMode || !isStripeConfigured()) {
      localStorage.setItem(MEAL_PLANNER_KEY, 'true');
      setMealPlannerPurchased(true);
      if (opts?.successUrl) {
        // Demo: simulate the Stripe success redirect so onboarding-plus
        // callers don't need a separate branch.
        window.location.href = opts.successUrl.replace('{CHECKOUT_SESSION_ID}', 'demo');
      }
      return;
    }
    setLoading(true);
    try {
      const userId = getUserId();
      const email = getUserEmail();
      const { url } = await createCheckoutSession(
        MEAL_PLAN_PRICE_ID,
        userId || 'anon',
        email || '',
        'payment',
        {
          successUrl: opts?.successUrl ?? `${window.location.origin}/checkout/success?type=meal&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: opts?.cancelUrl ?? `${window.location.origin}/checkout/canceled?type=meal`,
        },
      );
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Error opening meal-plan checkout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [demoMode]);

  // ------ Stripe actions ------
  const startCheckout = useCallback(
    async (priceId: string) => {
      setLoading(true);
      try {
        const userId = getUserId();
        const email = getUserEmail();

        if (isStripeConfigured()) {
          const { url } = await createCheckoutSession(priceId, userId || 'anon', email || '');
          if (url) window.location.href = url;
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
