import { useNavigate } from 'react-router-dom';
import NutritionOnboarding from '../../features/nutrition/NutritionOnboarding';
import { useNutritionProfile } from '../../features/nutrition/useNutritionProfile';
import { useMealPlan } from '../../features/nutrition/useMealPlan';

/**
 * Meal-planner onboarding route.
 *
 * Wraps the existing multi-step NutritionOnboarding questionnaire from
 * `src/features/nutrition/`. On completion we persist the profile and
 * generate the week-1 plan so the user lands on /jedalnicek with
 * something to look at immediately.
 *
 * Mounted at /jedalnicek/onboarding. Entry point is the meal-plan
 * celebration CTA "Vyplniť teraz" on /checkout/success.
 */
export default function JedalnicekOnboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useNutritionProfile();
  const { generatePlan } = useMealPlan();

  return (
    <NutritionOnboarding
      onComplete={(profile, startDate) => {
        saveProfile(profile);
        generatePlan(profile, startDate);
        navigate('/jedalnicek');
      }}
      onCancel={() => navigate('/domov-new')}
    />
  );
}
