import { createContext, useContext, type ReactNode } from 'react';
import { useAuthContext } from './AuthContext';
import { useSupabaseSubscription } from '../hooks/useSupabaseSubscription';
import type { Subscription, SubscriptionTier, SubscriptionLimits } from '../types/subscription';

interface SubscriptionContextType {
  subscription: Subscription;
  limits: SubscriptionLimits;
  tier: SubscriptionTier;
  loading: boolean;
  canAccess: (feature: keyof SubscriptionLimits) => boolean;
  getRemainingCount: (contentType: 'exercises' | 'recipes' | 'meditations' | 'stretches') => Promise<number | null>;
  canUseMealPlanner: boolean;
  mealPlannerTokens: number;
  checkContentAccess: (contentType: 'recipes' | 'exercises' | 'meditations' | 'stretches') => Promise<{
    canAccess: boolean;
    usedCount: number;
    limitCount: number;
  }>;
  trackContentUsage: (contentType: string, contentId: string) => Promise<boolean>;
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const { 
    subscription, 
    loading, 
    limits, 
    checkContentAccess, 
    trackContentUsage,
    refreshSubscription 
  } = useSupabaseSubscription();
  
  const canAccess = (feature: keyof SubscriptionLimits): boolean => {
    return limits[feature] === true || limits[feature] === -1;
  };

  const getRemainingCount = async (
    contentType: 'exercises' | 'recipes' | 'meditations' | 'stretches'
  ): Promise<number | null> => {
    if (!user) return 0;
    
    const { limitCount, usedCount } = await checkContentAccess(contentType);
    
    if (limitCount === -1) return null; // unlimited
    return Math.max(0, limitCount - usedCount);
  };

  const canUseMealPlanner = subscription.tier === 'program_bundle' || subscription.mealPlannerTokens > 0;

  const contextValue: SubscriptionContextType = {
    subscription,
    limits,
    tier: subscription.tier,
    loading,
    canAccess,
    getRemainingCount,
    canUseMealPlanner,
    mealPlannerTokens: subscription.mealPlannerTokens,
    checkContentAccess,
    trackContentUsage,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}