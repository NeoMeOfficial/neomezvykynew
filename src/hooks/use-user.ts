import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUserProgram } from '@/hooks/useUserProgram';
import { useMealPlan } from '@/features/nutrition/useMealPlan';
import { useCycleData } from '@/features/cycle/useCycleData';

export interface UserProfile {
  name: string;
  tier: 'free' | 'plus';
  hasProgram: boolean;
  hasMealPlan: boolean;
  hasCycleData: boolean;
}

export function useUser(): UserProfile {
  const { profile } = useSupabaseAuth();
  const { tier } = useSubscription();
  const { userProgram } = useUserProgram();
  const { todayPlan } = useMealPlan();
  const { derivedState } = useCycleData();

  const firstName = profile?.first_name ?? profile?.full_name?.split(' ')[0] ?? 'Eva';

  return {
    name: firstName,
    tier: tier === 'premium' ? 'plus' : 'free',
    hasProgram: !!userProgram,
    hasMealPlan: !!todayPlan,
    hasCycleData: !!derivedState?.lastPeriodStart,
  };
}
