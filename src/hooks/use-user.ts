import { useAuth } from './useAuth';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useUserProgram } from './useUserProgram';

/**
 * Adapter for the NeoMe new-design screens.
 *
 * Exposes: { name, tier, hasProgram, hasMealPlan, hasCycleData }
 *
 * Internally maps:
 *   tier:           SubscriptionContext.tier ('premium' → 'plus')
 *   hasProgram:     useUserProgram().program != null
 *   hasMealPlan:    SubscriptionContext.canUseMealPlanner (close enough for now)
 *   hasCycleData:   localStorage cycle keys present
 *   name:           profile.full_name → user.email local-part → 'priateľka'
 *
 * Adapter contract — keep stable as the underlying hooks evolve. Only
 * change the *internal* mapping; the return shape is locked.
 */
export interface NeoMeUser {
  name: string;
  tier: 'free' | 'plus';
  hasProgram: boolean;
  hasMealPlan: boolean;
  hasCycleData: boolean;
}

const CYCLE_DATA_KEYS = ['cycle_data', 'neome-period-history'];

function hasCycleData(): boolean {
  try {
    return CYCLE_DATA_KEYS.some((k) => {
      const v = localStorage.getItem(k);
      return v && v !== 'null' && v !== '[]' && v !== '{}';
    });
  } catch {
    return false;
  }
}

function deriveName(profile: { full_name?: string | null } | null, email?: string | null): string {
  if (profile?.full_name) return profile.full_name.split(' ')[0];
  if (email) return email.split('@')[0];
  return 'priateľka';
}

export function useUser(): NeoMeUser {
  const { profile, user } = useAuth();
  const { tier, canUseMealPlanner } = useSubscription();
  const { hasProgram } = useUserProgram();

  return {
    name: deriveName(profile, user?.email),
    tier: tier === 'premium' ? 'plus' : 'free',
    hasProgram,
    hasMealPlan: canUseMealPlanner,
    hasCycleData: hasCycleData(),
  };
}
