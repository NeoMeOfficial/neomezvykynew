import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSupabaseAuth } from './SupabaseAuthContext';
import {
  SubscriptionData,
  isSubscriptionActive,
  isTrialActive,
  getDaysUntilExpiration,
  createCheckoutSession,
  createCheckoutSessionMock,
  createPortalSession,
  createPortalSessionMock,
  SUBSCRIPTION_PLANS,
  stripePromise
} from '../lib/stripe';
import { supabase } from '../lib/supabase';

// True when a real Stripe publishable key is configured
const isStripeConfigured = () =>
  !!(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY &&
     (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_') ||
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')));

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  isLoading: boolean;
  isPremium: boolean;
  isTrialing: boolean;
  daysLeft: number;
  startCheckout: (priceId: string) => Promise<void>;
  manageBilling: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, profile, updateProfile } = useSupabaseAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load subscription data when user changes
  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscription(null);
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // For development: Load from localStorage first
      const mockSubscription = localStorage.getItem(`subscription_${user.id}`);
      if (mockSubscription) {
        setSubscription(JSON.parse(mockSubscription));
        setIsLoading(false);
        return;
      }

      // TODO: Replace with actual Stripe API call
      // const response = await fetch(`/api/subscription/${user.id}`);
      // const subscriptionData = await response.json();
      // setSubscription(subscriptionData);

      // For now, check profile subscription status
      if (profile?.subscription_status === 'premium') {
        const mockActiveSubscription: SubscriptionData = {
          id: 'sub_premium_' + user.id,
          status: 'active',
          current_period_start: Date.now() / 1000,
          current_period_end: (Date.now() + (30 * 24 * 60 * 60 * 1000)) / 1000,
          cancel_at_period_end: false,
          customer_id: 'cus_' + user.id
        };
        setSubscription(mockActiveSubscription);
      } else if (profile?.subscription_status === 'trial' && profile.trial_end_date) {
        const trialEnd = new Date(profile.trial_end_date).getTime() / 1000;
        const mockTrialSubscription: SubscriptionData = {
          id: 'sub_trial_' + user.id,
          status: 'trialing',
          current_period_start: Date.now() / 1000,
          current_period_end: trialEnd,
          trial_end: trialEnd,
          cancel_at_period_end: false,
          customer_id: 'cus_' + user.id
        };
        setSubscription(mockTrialSubscription);
      } else {
        setSubscription(null);
      }

    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const startCheckout = async (priceId: string) => {
    if (!user || !profile) {
      throw new Error('User must be logged in');
    }

    setIsLoading(true);
    try {
      if (isStripeConfigured()) {
        // Live Stripe checkout — redirect to Stripe-hosted page
        const sessionId = await createCheckoutSession(priceId, user.id, profile.email);
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        }
      } else {
        // Demo/dev mode mock
        const sessionId = await createCheckoutSessionMock(priceId, user.id, profile.email);
        if (sessionId === 'demo_session_success') {
          const trialEnd = (Date.now() + (7 * 24 * 60 * 60 * 1000)) / 1000;
          const newSubscription: SubscriptionData = {
            id: 'sub_' + Date.now(),
            status: 'trialing',
            current_period_start: Date.now() / 1000,
            current_period_end: (Date.now() + (30 * 24 * 60 * 60 * 1000)) / 1000,
            trial_end: trialEnd,
            cancel_at_period_end: false,
            customer_id: 'cus_' + user.id
          };
          setSubscription(newSubscription);
          await updateProfile({
            subscription_status: 'trial',
            subscription_id: newSubscription.id,
            trial_end_date: new Date(trialEnd * 1000).toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const manageBilling = async () => {
    if (!subscription) {
      throw new Error('No active subscription');
    }

    setIsLoading(true);
    try {
      if (isStripeConfigured()) {
        // Live Stripe portal — redirect to billing portal
        const portalUrl = await createPortalSession(subscription.customer_id);
        window.location.href = portalUrl;
      } else {
        // Demo mode
        await createPortalSessionMock(subscription.customer_id);
        alert('Demo: v produkcii by si bola presmerovaná na Stripe billing portál.');
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!subscription || !user) {
      throw new Error('No subscription to cancel');
    }

    setIsLoading(true);
    try {
      if (isStripeConfigured()) {
        // Live: cancel via Netlify function
        await fetch('/.netlify/functions/cancel-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId: subscription.id, userId: user.id })
        });
      }
      // Update local state regardless (webhook will confirm via Supabase)
      const canceledSubscription = { ...subscription, cancel_at_period_end: true };
      setSubscription(canceledSubscription);
      if (!isStripeConfigured()) {
        localStorage.setItem(`subscription_${user.id}`, JSON.stringify(canceledSubscription));
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await loadSubscription();
  };

  // Computed values
  const isPremium = isSubscriptionActive(subscription);
  const isTrialing = isTrialActive(subscription);
  const daysLeft = getDaysUntilExpiration(subscription);

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    isPremium,
    isTrialing,
    daysLeft,
    startCheckout,
    manageBilling,
    cancelSubscription,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// Utility hook for checking premium access
export function useIsPremium(): boolean {
  const { isPremium } = useSubscription();
  return isPremium;
}

// Hook for paywall logic
export function usePaywall() {
  const { isPremium, isTrialing, daysLeft, startCheckout } = useSubscription();
  
  const showPaywall = !isPremium;
  const showTrialBanner = isTrialing && daysLeft <= 3;
  
  return {
    showPaywall,
    showTrialBanner,
    isPremium,
    isTrialing,
    daysLeft,
    startCheckout
  };
}