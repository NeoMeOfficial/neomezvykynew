import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUserProgram } from '@/hooks/useUserProgram';
import { useMealPlan } from '@/features/nutrition/useMealPlan';
import { useCycle } from '@/hooks/use-cycle';

export interface UserProfile {
  name: string;
  tier: 'free' | 'plus';
  hasProgram: boolean;
  /** Has the user purchased the €57 meal-plan add-on. */
  hasMealPlanAddon: boolean;
  /** Has the user actually generated a plan (i.e. completed the
   *  nutrition questionnaire) and there's something to show today. */
  hasMealPlan: boolean;
  hasCycleData: boolean;
}

export function useUser(): UserProfile {
  const { profile } = useSupabaseAuth();
  const { tier, hasMealPlanner } = useSubscription();
  const { userProgram } = useUserProgram();
  const { todayPlan } = useMealPlan();
  const { hasData: hasCycleData } = useCycle();

  const firstName = profile?.first_name ?? profile?.full_name?.split(' ')[0] ?? 'Eva';

  return {
    name: firstName,
    tier: tier === 'premium' ? 'plus' : 'free',
    hasProgram: !!userProgram,
    hasMealPlanAddon: hasMealPlanner,
    hasMealPlan: !!todayPlan,
    hasCycleData,
  };
}
