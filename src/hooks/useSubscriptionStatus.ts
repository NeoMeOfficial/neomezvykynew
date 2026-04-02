import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

export interface SubscriptionStatus {
  isSubscribed: boolean;
  tier: 'free' | 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  trialEndsAt?: Date;
  currentPeriodEnd?: Date;
  loading: boolean;
}

export interface PaywallTrigger {
  showPaywall: (feature: 'period_tracker' | 'daily_reflections' | 'habits', title?: string) => boolean;
  PaywallComponent: React.ComponentType<{
    isOpen: boolean;
    onClose: () => void;
    feature: 'period_tracker' | 'daily_reflections' | 'habits';
    title?: string;
  }>;
}

export function useSubscriptionStatus(): SubscriptionStatus {
  const { session } = useAuthContext();
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    tier: 'free',
    status: 'expired',
    loading: true
  });

  useEffect(() => {
    // Simulate subscription check
    // In real app, this would fetch from Supabase
    const checkSubscription = async () => {
      try {
        if (!session?.user) {
          setStatus({
            isSubscribed: false,
            tier: 'free',
            status: 'expired',
            loading: false
          });
          return;
        }

        // Mock subscription data - in real app, fetch from database
        const mockSubscription = localStorage.getItem('neome-subscription');
        if (mockSubscription) {
          const sub = JSON.parse(mockSubscription);
          setStatus({
            isSubscribed: sub.status === 'active' || sub.status === 'trial',
            tier: sub.tier || 'free',
            status: sub.status || 'expired',
            trialEndsAt: sub.trialEndsAt ? new Date(sub.trialEndsAt) : undefined,
            currentPeriodEnd: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : undefined,
            loading: false
          });
        } else {
          // Default to free tier
          setStatus({
            isSubscribed: false,
            tier: 'free',
            status: 'expired',
            loading: false
          });
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setStatus({
          isSubscribed: false,
          tier: 'free',
          status: 'expired',
          loading: false
        });
      }
    };

    checkSubscription();
  }, [session]);

  return status;
}

export function usePaywall(): PaywallTrigger & { isOpen: boolean; closePaywall: () => void } {
  const [paywall, setPaywall] = useState<{
    isOpen: boolean;
    feature: 'period_tracker' | 'daily_reflections' | 'habits';
    title?: string;
  }>({
    isOpen: false,
    feature: 'period_tracker'
  });
  
  const subscription = useSubscriptionStatus();

  const showPaywall = useCallback((
    feature: 'period_tracker' | 'daily_reflections' | 'habits',
    title?: string
  ): boolean => {
    // 🎯 TESTING MODE: All content freely accessible
    // Removed paywall checks for full app testing
    console.log('🎯 Testing Mode: Paywall bypassed for', feature);
    return false; // Never show paywall - everything is accessible
  }, []);

  const closePaywall = useCallback(() => {
    setPaywall(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Import PaywallModal dynamically to avoid circular imports
  const PaywallComponent = useCallback(({ isOpen, onClose, feature, title }: {
    isOpen: boolean;
    onClose: () => void;
    feature: 'period_tracker' | 'daily_reflections' | 'habits';
    title?: string;
  }) => {
    // This would normally be a dynamic import, but for simplicity we'll return null
    // and handle the modal in the consuming component
    return null;
  }, []);

  return {
    showPaywall,
    PaywallComponent,
    isOpen: paywall.isOpen,
    closePaywall,
    ...paywall
  };
}