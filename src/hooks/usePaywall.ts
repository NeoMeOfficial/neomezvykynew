/**
 * Thin compat wrapper around SubscriptionContext.
 *
 * Surviving callers (HabitTracker) use `shouldShowDataSaveWarning` and
 * `showDataSavePaywall`. New code should depend on SubscriptionContext
 * directly. Content-access methods were removed — that responsibility
 * now lives in src/hooks/useEntitlement (see ADR-0001).
 */
import { useSubscription } from '../contexts/SubscriptionContext';

export function usePaywall() {
  const { isPremium, gate } = useSubscription();

  return {
    shouldShowDataSaveWarning: () => !isPremium,
    showDataSavePaywall: () => gate(),
  };
}
