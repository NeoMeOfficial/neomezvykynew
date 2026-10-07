import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NutritionOnboarding from '../../features/nutrition/NutritionOnboarding';
import { useNutritionProfile } from '../../features/nutrition/useNutritionProfile';
import { useMealPlan } from '../../features/nutrition/useMealPlan';
import { useSubscription } from '../../contexts/SubscriptionContext';

/**
 * Meal-planner onboarding route.
 *
 * Wraps the multi-step NutritionOnboarding questionnaire. On completion
 * we persist the profile and generate the first week's plan. The
 * landing destination depends on where the user came from:
 *   • `?from=onboarding-plus` → /onboarding-plus/hotovo (continue Plus flow)
 *   • default → /jedalnicek (browse the planner)
 */
export default function JedalnicekOnboarding() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { saveProfile } = useNutritionProfile();
  const { generatePlan } = useMealPlan();
  const { hasMealPlanner, isLoading: subLoading } = useSubscription();
  const fromOnboardingPlus = params.get('from') === 'onboarding-plus';

  // Same gate as the planner: the questionnaire generates the full €57
  // plan, so a non-owner must not reach it by deep link. Wait for the
  // subscription read so paid users don't flash a redirect.
  useEffect(() => {
    if (!subLoading && !hasMealPlanner) {
      navigate('/jedalnicek-promo', { replace: true });
    }
  }, [subLoading, hasMealPlanner, navigate]);

  if (!hasMealPlanner) return null;

  return (
    <NutritionOnboarding
      onComplete={async (profile, startDate) => {
        saveProfile(profile);
        // Await: generation loads the Supabase recipe library on cold cache,
        // and the destination page reads the finished plan from storage.
        await generatePlan(profile, startDate);
        navigate(fromOnboardingPlus ? '/onboarding-plus/hotovo' : '/jedalnicek');
      }}
      onCancel={() => navigate(fromOnboardingPlus ? '/onboarding-plus/hotovo' : '/domov-new')}
    />
  );
}
