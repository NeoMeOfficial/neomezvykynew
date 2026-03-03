import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed, ChefHat, Coffee, Moon, Cookie, RefreshCw } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import ProgressRing from '../../components/v2/ProgressRing';
import { useSubscription } from '../../contexts/SimpleSubscriptionContext';
import { usePaywall } from '../../hooks/usePaywall';
import { MealPlannerBanner } from '../../components/v2/paywall/MealPlannerBanner';
import { PaywallModal } from '../../components/v2/paywall/PaywallModal';
import NutritionOnboarding from '../../features/nutrition/NutritionOnboarding';
import { useMealPlan } from '../../features/nutrition/useMealPlan';
import { recipes } from '../../data/recipes';
import { colors } from '../../theme/warmDusk';
import type { NutritionProfile } from '../../features/nutrition/types';

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
const DAYS_FULL = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'];

const MEAL_ICONS: Record<string, typeof Coffee> = {
  raňajky: Coffee,
  obed: ChefHat,
  večera: Moon,
  snack: Cookie,
};

const MEAL_LABELS: Record<string, string> = {
  raňajky: 'Raňajky',
  obed: 'Obed',
  večera: 'Večera',
  snack: 'Snack',
};

export default function JedalnicekPlanner() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { canUseMealPlanner } = useSubscription();
  const { paywallState, showMealPlannerPaywall, closePaywall, handleUpgrade } = usePaywall();
  const { plan, generatePlan, swapMeal } = useMealPlan();

  // Show onboarding if no plan exists
  if (!plan) {
    return (
      <NutritionOnboarding
        onComplete={(profile: NutritionProfile, startDate: Date) => generatePlan(profile, startDate)}
      />
    );
  }

  const day = plan.days[activeDay];
  const caloriePercent = day ? Math.min(Math.round((day.totalCalories / plan.profile.dailyCalories) * 100), 100) : 0;

  return (
    <div className="w-full min-h-screen px-4 pt-5 pb-28 space-y-5" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" style={{ color: '#8B7560' }} strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(122,158,120,0.14)' }}>
            <UtensilsCrossed className="w-4 h-4" style={{ color: '#7A9E78' }} />
          </div>
          <h1 className="text-base font-semibold" style={{ color: '#2E2218' }}>Jedálniček</h1>
        </div>
{/* No regenerate — plan is fixed once purchased */}
      </div>

      {/* Paywall for free users */}
      {!canUseMealPlanner && (
        <MealPlannerBanner onPurchase={showMealPlannerPaywall} />
      )}

      {/* Day selector */}
      <div className="flex gap-1.5">
        {DAYS.map((d, i) => (
          <button
            key={d}
            onClick={() => setActiveDay(i)}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
            style={activeDay === i
              ? { background: '#2E2218', color: '#fff' }
              : { background: 'rgba(255,255,255,0.5)', color: '#8B7560' }
            }
          >
            {d}
          </button>
        ))}
      </div>

      {/* Day label */}
      <p className="text-xs font-medium text-center" style={{ color: '#8B7560' }}>
        {DAYS_FULL[activeDay]}
      </p>

      {/* Calorie summary card */}
      {day && (
        <GlassCard className="!p-4">
          <div className="flex items-center gap-4">
            <ProgressRing progress={caloriePercent} size={60} stroke={5} color="#B8864A">
              <span className="text-[11px] font-bold" style={{ color: '#2E2218' }}>{caloriePercent}%</span>
            </ProgressRing>
            <div className="flex-1 space-y-1.5">
              <p className="text-sm font-semibold" style={{ color: '#2E2218' }}>
                {day.totalCalories} / {plan.profile.dailyCalories} kcal
              </p>
              {[
                { label: 'Bielkoviny', current: day.totalProtein, target: plan.profile.dailyProtein, color: '#6B4C3B' },
                { label: 'Sacharidy', current: day.totalCarbs, target: plan.profile.dailyCarbs, color: '#B8864A' },
                { label: 'Tuky', current: day.totalFat, target: plan.profile.dailyFat, color: '#7A9E78' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span style={{ color: '#8B7560' }}>{m.label}</span>
                    <span style={{ color: '#A0907E' }}>{m.current}g / {m.target}g</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min((m.current / m.target) * 100, 100)}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Meals */}
      <div className="space-y-3">
        {day?.meals.map((meal, mealIdx) => {
          const recipeId = meal.options[meal.selected];
          const recipe = recipes.find((r) => r.id === recipeId);
          const Icon = MEAL_ICONS[meal.slot] || ChefHat;
          const label = MEAL_LABELS[meal.slot] || meal.slot;

          return (
            <GlassCard key={mealIdx} className="!p-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(184,134,74,0.1)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#B8864A' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#A0907E' }}>
                      {label}
                    </span>
                    {recipe && (
                      <span className="text-[11px] font-medium" style={{ color: '#8B7560' }}>
                        {Math.round(recipe.calories * meal.portionMultiplier)} kcal
                      </span>
                    )}
                  </div>
                  {recipe ? (
                    <>
                      <p className="text-sm font-medium truncate" style={{ color: '#2E2218' }}>
                        {recipe.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px]" style={{ color: '#A0907E' }}>
                          B {Math.round((recipe.protein ?? 0) * meal.portionMultiplier)}g
                        </span>
                        <span className="text-[10px]" style={{ color: '#A0907E' }}>
                          S {Math.round((recipe.carbs ?? 0) * meal.portionMultiplier)}g
                        </span>
                        <span className="text-[10px]" style={{ color: '#A0907E' }}>
                          T {Math.round((recipe.fat ?? 0) * meal.portionMultiplier)}g
                        </span>
                        {meal.portionMultiplier !== 1 && (
                          <span className="text-[10px] font-medium" style={{ color: '#B8864A' }}>
                            {meal.portionMultiplier.toFixed(1)}×
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm italic" style={{ color: '#A0907E' }}>Žiadny recept</p>
                  )}
                </div>
                {/* Swap button */}
                {meal.options.length > 1 && (
                  <button
                    onClick={() => swapMeal(activeDay, mealIdx)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                    title="Vymeniť recept"
                  >
                    <RefreshCw className="w-3.5 h-3.5" style={{ color: '#8B7560' }} />
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Paywall modal */}
      <PaywallModal
        isOpen={paywallState.isOpen}
        onClose={closePaywall}
        title={paywallState.title}
        message={paywallState.message}
        limitType={paywallState.limitType}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
