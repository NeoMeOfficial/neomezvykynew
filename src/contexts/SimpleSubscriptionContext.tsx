import { createContext, useContext, type ReactNode } from 'react';
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
  // Simple mock data without any async calls
  const subscription: Subscription = {
    tier: 'premium',
    active: true,
    mealPlannerTokens: 100,
  };

  const limits: SubscriptionLimits = {
    maxRecipes: 999,
    maxExercises: 999,
    maxMeditations: 999,
    maxStretches: 999,
    canSaveData: true,
    hasPrograms: true,
    hasMealPlanner: true,
  };

  const contextValue: SubscriptionContextType = {
    subscription,
    limits,
    tier: 'premium',
    loading: false,
    canAccess: () => true,
    getRemainingCount: async () => 999,
    canUseMealPlanner: true,
    mealPlannerTokens: 100,
    checkContentAccess: async () => ({
      canAccess: true,
      usedCount: 0,
      limitCount: 999,
    }),
    trackContentUsage: async () => true,
    refreshSubscription: () => {},
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}