import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Subscription, SubscriptionTier, SubscriptionLimits } from '../types/subscription';

const MEAL_PLANNER_KEY = 'neome_meal_planner_purchased';

interface SubscriptionContextType {
  subscription: Subscription;
  limits: SubscriptionLimits;
  tier: SubscriptionTier;
  loading: boolean;
  canAccess: (feature: keyof SubscriptionLimits) => boolean;
  getRemainingCount: (contentType: 'exercises' | 'recipes' | 'meditations' | 'stretches') => Promise<number | null>;
  canUseMealPlanner: boolean;
  mealPlannerTokens: number;
  purchaseMealPlanner: () => void;
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
  const [mealPlannerPurchased, setMealPlannerPurchased] = useState<boolean>(() => {
    return localStorage.getItem(MEAL_PLANNER_KEY) === 'true';
  });

  const purchaseMealPlanner = () => {
    localStorage.setItem(MEAL_PLANNER_KEY, 'true');
    setMealPlannerPurchased(true);
  };

  const subscription: Subscription = {
    tier: 'premium',
    active: true,
    mealPlannerTokens: mealPlannerPurchased ? 100 : 0,
  };

  const limits: SubscriptionLimits = {
    maxRecipes: 999,
    maxExercises: 999,
    maxMeditations: 999,
    maxStretches: 999,
    canSaveData: true,
    hasPrograms: true,
    hasMealPlanner: mealPlannerPurchased,
  };

  const contextValue: SubscriptionContextType = {
    subscription,
    limits,
    tier: 'premium',
    loading: false,
    canAccess: () => true,
    getRemainingCount: async () => 999,
    canUseMealPlanner: mealPlannerPurchased,
    mealPlannerTokens: mealPlannerPurchased ? 100 : 0,
    purchaseMealPlanner,
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