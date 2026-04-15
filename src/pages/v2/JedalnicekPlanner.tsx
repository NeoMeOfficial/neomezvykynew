import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed, ChefHat, Coffee, Moon, Cookie, Download, Check } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import ProgressRing from '../../components/v2/ProgressRing';
import { useSubscription } from '../../contexts/SimpleSubscriptionContext';
import { usePaywall } from '../../hooks/usePaywall';
import { MealPlannerBanner } from '../../components/v2/paywall/MealPlannerBanner';
import { PaywallModal } from '../../components/v2/paywall/PaywallModal';
import { DummyCheckoutModal } from '../../components/v2/paywall/DummyCheckoutModal';
import NutritionOnboarding from '../../features/nutrition/NutritionOnboarding';
import { useMealPlan } from '../../features/nutrition/useMealPlan';
import { WeekDayNavigator } from '../../features/nutrition/WeekDayNavigator';
import { exportMealPlanPDF } from '../../features/nutrition/exportMealPlanPDF';
import { recipes, getRecipeImage } from '../../data/recipes';
import { colors } from '../../theme/warmDusk';
import type { NutritionProfile, MealSlot } from '../../features/nutrition/types';

const MEAL_ICONS: Record<string, typeof Coffee> = {
  ranajky: Coffee,
  desiata: Cookie,
  obed: ChefHat,
  olovrant: Cookie,
  vecera: Moon,
};

function isFutureOrToday(dateStr: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return dateStr >= today;
}

interface DualMealCardProps {
  meal: MealSlot;
  mealIdx: number;
  dayIndex: number;
  showSwap: boolean;
  onSwap: (dayIndex: number, mealIndex: number) => void;
}

function DualMealCard({ meal, mealIdx, dayIndex, showSwap, onSwap }: DualMealCardProps) {
  const Icon = MEAL_ICONS[meal.type] || ChefHat;

  if (!showSwap) {
    // Past day — single card
    const recipeId = meal.options[meal.selected];
    const recipe = recipes.find((r) => r.id === recipeId);
    return (
      <GlassCard className="!p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(184,134,74,0.1)' }}>
            <Icon className="w-3.5 h-3.5" style={{ color: '#B8864A' }} />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#A0907E' }}>{meal.label}</span>
        </div>
        {recipe ? (
          <div className="flex items-start gap-3">
            <img
              src={getRecipeImage(recipe.title, recipe.category)}
              alt={recipe.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug" style={{ color: '#2E2218' }}>{recipe.title}</p>
              <p className="text-[11px] mt-1" style={{ color: '#8B7560' }}>
                {Math.round(recipe.calories * meal.portionMultiplier)} kcal · B{Math.round((recipe.protein ?? 0) * meal.portionMultiplier)}g
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm italic" style={{ color: '#A0907E' }}>Žiadny recept</p>
        )}
      </GlassCard>
    );
  }

  // Current/future day — dual cards
  const option0 = recipes.find((r) => r.id === meal.options[0]);
  const option1 = recipes.find((r) => r.id === meal.options[1]);
  const isSameRecipe = meal.options[0] === meal.options[1];

  return (
    <GlassCard className="!p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(184,134,74,0.1)' }}>
          <Icon className="w-3.5 h-3.5" style={{ color: '#B8864A' }} />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#A0907E' }}>{meal.label}</span>
      </div>

      <div className={`grid gap-3 ${isSameRecipe ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {([0, 1] as const).filter((i) => !isSameRecipe || i === 0).map((optIdx) => {
          const recipe = optIdx === 0 ? option0 : option1;
          const isActive = meal.selected === optIdx;
          const kcal = recipe ? Math.round(recipe.calories * meal.portionMultiplier) : 0;

          return (
            <button
              key={optIdx}
              onClick={() => !isActive && onSwap(dayIndex, mealIdx)}
              className={`rounded-xl p-3 text-left transition-all ${isActive ? 'ring-2' : 'opacity-75'}`}
              style={{
                background: isActive ? 'rgba(122,158,120,0.12)' : 'rgba(255,255,255,0.4)',
                ringColor: isActive ? '#7A9E78' : 'transparent',
                border: isActive ? '2px solid #7A9E78' : '2px solid transparent',
              }}
            >
              {recipe ? (
                <>
                  <img
                    src={getRecipeImage(recipe.title, recipe.category)}
                    alt={recipe.title}
                    className="w-full h-20 rounded-lg object-cover mb-2"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <p className="text-xs font-medium leading-snug line-clamp-2" style={{ color: '#2E2218' }}>
                    {recipe.title}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: '#8B7560' }}>{kcal} kcal</p>
                  <div className={`flex items-center gap-1 mt-2 text-[10px] font-medium ${isActive ? 'text-[#7A9E78]' : 'text-[#A0907E]'}`}>
                    {isActive && <Check className="w-3 h-3" />}
                    <span>{isActive ? 'Vybraté' : 'Vybrať'}</span>
                  </div>
                </>
              ) : (
                <p className="text-xs italic" style={{ color: '#A0907E' }}>Žiadny recept</p>
              )}
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}

export default function JedalnicekPlanner() {
  const navigate = useNavigate();
  const { canUseMealPlanner, purchaseMealPlanner } = useSubscription();
  const { paywallState, showMealPlannerPaywall, closePaywall, handleUpgrade, checkoutOpen, closeCheckout } = usePaywall();
  const { plan, generatePlan, swapMeal, activeDay, activeWeek, setActiveDay, setActiveWeek } = useMealPlan();

  if (!plan) {
    return (
      <NutritionOnboarding
        onComplete={(profile: NutritionProfile, startDate: Date) => generatePlan(profile, startDate)}
      />
    );
  }

  const day = plan.days[activeDay];
  const caloriePercent = day ? Math.min(Math.round((day.totalCalories / plan.profile.dailyCalories) * 100), 100) : 0;
  const showSwap = day ? isFutureOrToday(day.date) : false;

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
          <h1 className="text-[26px] font-medium leading-tight" style={{ color: '#2E2218', fontFamily: '"Bodoni Moda", Georgia, serif' }}>Jedálniček</h1>
        </div>
        <button
          onClick={() => exportMealPlanPDF(plan)}
          className="w-9 h-9 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center"
          title="Stiahnuť PDF"
        >
          <Download className="w-4 h-4" style={{ color: '#8B7560' }} strokeWidth={1.5} />
        </button>
      </div>

      {/* Paywall for free users */}
      {!canUseMealPlanner && (
        <MealPlannerBanner onPurchase={showMealPlannerPaywall} />
      )}

      {/* Week + Day navigator */}
      <GlassCard className="!p-4">
        <WeekDayNavigator
          plan={plan}
          activeWeek={activeWeek}
          activeDay={activeDay}
          onWeekChange={setActiveWeek}
          onDayChange={setActiveDay}
        />
      </GlassCard>

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

      {/* Meals — dual cards for today/future, single for past */}
      <div className="space-y-3">
        {day?.meals.map((meal, mealIdx) => (
          <DualMealCard
            key={mealIdx}
            meal={meal}
            mealIdx={mealIdx}
            dayIndex={activeDay}
            showSwap={showSwap}
            onSwap={swapMeal}
          />
        ))}
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

      {/* Dummy checkout modal */}
      <DummyCheckoutModal
        isOpen={checkoutOpen}
        onClose={closeCheckout}
        onSuccess={() => {
          purchaseMealPlanner();
          closeCheckout();
        }}
      />
    </div>
  );
}
