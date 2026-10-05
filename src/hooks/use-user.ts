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

  // What she asked to be called (onboarding step, Sam 2026-10-05) wins;
  // then the registration first name — but never anything that looks
  // like an email local-part ("samuelgrecner+referal"), which the
  // signup trigger uses as a fallback full_name. Empty string = the
  // greeting renders without a name instead of inventing one.
  const storedName = (() => {
    try { return localStorage.getItem('neome_preferred_name') ?? ''; } catch { return ''; }
  })();
  const emailLocal = profile?.email?.split('@')[0] ?? '';
  let name =
    ((profile as any)?.preferred_name as string | undefined) ||
    storedName ||
    profile?.first_name ||
    profile?.full_name?.split(' ')[0] ||
    '';
  if (name && (name.includes('@') || name.includes('+') || name === emailLocal)) name = '';

  return {
    name,
    tier: tier === 'premium' ? 'plus' : 'free',
    hasProgram: !!userProgram,
    hasMealPlanAddon: hasMealPlanner,
    hasMealPlan: !!todayPlan,
    hasCycleData,
  };
}
