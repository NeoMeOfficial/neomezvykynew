import { useNavigate } from 'react-router-dom';
import { Clock, Flame, ChevronRight } from 'lucide-react';
import GlassCard from '../GlassCard';
import { useMealPlan } from '../../../features/nutrition/useMealPlan';
import { recipes } from '../../../data/recipes';
import { colors, glassCard } from '../../theme/warmDusk';

export default function TodayMealPlan() {
  const navigate = useNavigate();
  const { todayPlan } = useMealPlan();

  // No meal plan set up yet — show CTA
  if (!todayPlan) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[15px] font-semibold text-[#2E2218]">Jedálniček</h2>
        </div>
        <GlassCard
          className="!p-4 cursor-pointer"
          onClick={() => navigate('/strava')}
          style={{ background: 'linear-gradient(135deg, rgba(196,149,106,0.12), rgba(95,62,49,0.06))' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-[#2E2218]">Nastav si jedálniček</p>
              <p className="text-xs text-[#888] mt-0.5">Personalizované recepty na mieru</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B8864A]" strokeWidth={1.5} />
          </div>
        </GlassCard>
      </div>
    );
  }

  // Find next upcoming meal (simple: first one, or could be time-based)
  const now = new Date().getHours();
  let nextMealIdx = 0;
  if (now >= 10 && now < 14) nextMealIdx = Math.min(1, todayPlan.meals.length - 1);
  else if (now >= 14 && now < 17) nextMealIdx = Math.min(2, todayPlan.meals.length - 1);
  else if (now >= 17) nextMealIdx = Math.min(todayPlan.meals.length - 1, todayPlan.meals.length - 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[15px] font-semibold text-[#2E2218]">Tvoj dnešný jedálniček</h2>
        <button
          onClick={() => navigate('/strava')}
          className="text-xs text-[#B8864A] font-medium"
        >
          Celý plán →
        </button>
      </div>

      <div className="space-y-2">
        {todayPlan.meals.map((meal, i) => {
          const recipe = recipes.find((r) => r.id === meal.options[meal.selected]);
          if (!recipe) return null;
          const adjustedCal = Math.round(recipe.calories * meal.portionMultiplier);
          const isNext = i === nextMealIdx;

          return isNext ? (
            // Featured next meal — big image card
            <button
              key={meal.type}
              onClick={() => navigate('/strava')}
              className="relative w-full h-36 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform text-left"
            >
              <img src={recipe.image} alt={recipe.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {meal.label}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-bold leading-tight drop-shadow-lg">{recipe.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white/70 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />{recipe.prepTime} min
                  </span>
                  <span className="text-white/70 text-xs flex items-center gap-1">
                    <Flame className="w-3 h-3" />{adjustedCal} kcal
                  </span>
                </div>
              </div>
            </button>
          ) : (
            // Compact row for other meals
            <GlassCard key={meal.type} className="!p-3 cursor-pointer" onClick={() => navigate('/strava')}>
              <div className="flex items-center gap-3">
                <img src={recipe.image} alt={recipe.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#888] font-medium">{meal.label}</p>
                  <p className="text-[13px] font-medium text-[#2E2218] truncate">{recipe.title}</p>
                  <p className="text-xs text-[#888]">{adjustedCal} kcal · {recipe.prepTime} min</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Calorie bar */}
      <div className="mt-3 px-1">
        <div className="flex justify-between text-[10px] text-[#888] mb-1">
          <span>{todayPlan.totalCalories} kcal</span>
          <span>B: {todayPlan.totalProtein}g · S: {todayPlan.totalCarbs}g · T: {todayPlan.totalFat}g</span>
        </div>
        <div className="w-full h-1.5 bg-[#D0BCA8]/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B8864A] to-[#6B4C3B] rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.round((todayPlan.totalCalories / 2000) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
