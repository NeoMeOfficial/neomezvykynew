/**
 * Thin wrapper around the unified SubscriptionContext.
 * Keeps the old `usePaywall()` API so existing callers don't need big rewrites.
 * New code should use `useAccess()` or `useSubscription()` from contexts/SubscriptionContext directly.
 */
import { useSubscription } from '../contexts/SubscriptionContext';

export function usePaywall() {
  const {
    canAccess,
    isPremium,
    hasMealPlanner,
    gate,
    paywallVisible,
    dismissPaywall,
    startCheckout,
  } = useSubscription();

  return {
    // State — map paywallVisible to the old shape
    paywallState: {
      isOpen: paywallVisible,
      title: '',
      message: '',
      limitType: 'content' as const,
    },

    // Content access
    checkContentAccess: (contentType: 'exercises' | 'recipes' | 'meditations' | 'stretches') =>
      canAccess(contentType),
    getContentWarning: async () => null,

    // Data save
    shouldShowDataSaveWarning: () => !isPremium,

    // Meal planner
    canUseMealPlanner: hasMealPlanner,

    // Paywall triggers
    showContentPaywall: () => gate(),
    showDataSavePaywall: () => gate(),
    showMealPlannerPaywall: () => gate(),

    // Actions
    closePaywall: () => dismissPaywall(),
    handleUpgrade: (selectedTier: string) => {
      dismissPaywall();
      if (selectedTier === 'meal_planner_tokens') {
        startCheckout('price_meal_planner');
      }
    },

    // Checkout
    checkoutOpen: false,
    openCheckout: () => gate(),
    closeCheckout: () => dismissPaywall(),
  };
}