import { useState, useCallback } from 'react';
import { useSubscription } from '../contexts/SimpleSubscriptionContext';
import { useAuthContext } from '../contexts/AuthContext';

interface PaywallState {
  isOpen: boolean;
  title: string;
  message: string;
  limitType: 'content' | 'data_save' | 'meal_planner';
}

export function usePaywall() {
  const { limits, tier, getRemainingCount, canUseMealPlanner } = useSubscription();
  const { user } = useAuthContext();
  
  const [paywallState, setPaywallState] = useState<PaywallState>({
    isOpen: false,
    title: '',
    message: '',
    limitType: 'content',
  });

  const closePaywall = useCallback(() => {
    setPaywallState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Check if user can access content (considering limits)
  const checkContentAccess = useCallback((
    contentType: 'exercises' | 'recipes' | 'meditations' | 'stretches',
    requestedCount: number = 1
  ): boolean => {
    if (tier !== 'free') return true; // Premium users have unlimited access
    
    const remaining = getRemainingCount(contentType);
    if (remaining === null) return true; // unlimited
    
    return remaining >= requestedCount;
  }, [tier, getRemainingCount]);

  // Show content limit paywall
  const showContentPaywall = useCallback((contentType: 'exercises' | 'recipes' | 'meditations' | 'stretches') => {
    const contentNames = {
      exercises: 'cvičenia',
      recipes: 'recepty', 
      meditations: 'meditácie',
      stretches: 'strečing',
    };

    const remaining = getRemainingCount(contentType);
    
    setPaywallState({
      isOpen: true,
      title: `Limit ${contentNames[contentType]} dosiahnutý`,
      message: `Máš prístup len k ${remaining === 0 ? 'prvým 10' : `${remaining} zostávajúcim`} ${contentNames[contentType]}. Upgradni si účet pre prístup k celej knižnici.`,
      limitType: 'content',
    });
  }, [getRemainingCount]);

  // Show data save paywall
  const showDataSavePaywall = useCallback(() => {
    setPaywallState({
      isOpen: true,
      title: 'Údaje sa neuložia',
      message: 'V bezplatnej verzii sa tvoje údaje neukladajú. Upgradni si účet pre trvalé ukladanie svojich pokrokov a preferencií.',
      limitType: 'data_save',
    });
  }, []);

  // Show meal planner paywall
  const showMealPlannerPaywall = useCallback(() => {
    setPaywallState({
      isOpen: true,
      title: 'Jedálničky sú prémiová funkcia',
      message: 'Personalizované jedálničky vyžadujú samostatný nákup alebo Program Bundle. Jeden token ti umožní vytvoriť jeden kompletný týždňový jedálniček.',
      limitType: 'meal_planner',
    });
  }, []);

  // Handle upgrade action (mock for now)
  const handleUpgrade = useCallback((selectedTier: 'neome_plus' | 'program_bundle' | 'meal_planner_tokens') => {
    // In real app, this would redirect to Stripe checkout
    console.log(`Upgrading to: ${selectedTier}`);
    
    // Mock: close paywall and show success message
    closePaywall();
    
    // TODO: Implement actual Stripe integration
    alert(`Presmerovanie na platbu pre ${selectedTier}... (Mock)`);
  }, [closePaywall]);

  // Check if user needs to see data save warning
  const shouldShowDataSaveWarning = useCallback((): boolean => {
    return !limits.canSaveData;
  }, [limits.canSaveData]);

  // Get content warning message (async)
  const getContentWarning = useCallback(async (contentType: 'exercises' | 'recipes' | 'meditations' | 'stretches'): Promise<string | null> => {
    const remaining = await getRemainingCount(contentType);
    if (remaining === null || remaining > 5) return null;
    
    const contentNames = {
      exercises: 'cvičení',
      recipes: 'receptov',
      meditations: 'meditácií', 
      stretches: 'strečingov',
    };

    return `Zostáva ti ${remaining} ${contentNames[contentType]} v bezplatnej verzii.`;
  }, [getRemainingCount]);

  return {
    // State
    paywallState,
    
    // Content access
    checkContentAccess,
    getContentWarning,
    
    // Data save
    shouldShowDataSaveWarning,
    
    // Meal planner
    canUseMealPlanner,
    
    // Paywall triggers
    showContentPaywall,
    showDataSavePaywall, 
    showMealPlannerPaywall,
    
    // Actions
    closePaywall,
    handleUpgrade,
  };
}