import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, RefreshCw, Sparkles, UtensilsCrossed } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import ProgressRing from '../../components/v2/ProgressRing';
import { useNutritionProfile } from '../../features/nutrition/useNutritionProfile';
import { useMealPlan } from '../../features/nutrition/useMealPlan';
import { WeekDayNavigator } from '../../features/nutrition/WeekDayNavigator';
import { useSubscription } from '../../contexts/SimpleSubscriptionContext';
import NutritionOnboarding from '../../features/nutrition/NutritionOnboarding';
import { recipes } from '../../data/recipes';
import type { NutritionProfile } from '../../features/nutrition/types';
import { colors } from '../../theme/warmDusk';

const tabs = ['Recepty', 'Jedálniček'] as const;

const getRecipeCount = (category: string) => {
  switch (category) {
    case 'Raňajky':
      return recipes.filter(r => r.category === 'ranajky').length;
    case 'Hlavné jedlá a polievky':
      return recipes.filter(r => r.category === 'obed' || r.category === 'vecera').length;
    case 'Hlavné jedlá':
      return recipes.filter(r => r.category === 'main_meal').length;
    case 'Snacky':
      return recipes.filter(r => r.category === 'snack').length;
    case 'Dezerty':
      return recipes.filter(r => r.category === 'dessert').length;
    default:
      return 0;
  }
};

const categories = [
  { label: 'Raňajky', count: getRecipeCount('Raňajky'), img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=500&fit=crop' },
  { label: 'Hlavné jedlá a polievky', count: getRecipeCount('Hlavné jedlá a polievky'), img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop' },
  { label: 'Hlavné jedlá', count: getRecipeCount('Hlavné jedlá'), img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop' },
  { label: 'Snacky', count: getRecipeCount('Snacky'), img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=500&fit=crop' },
  { label: 'Dezerty', count: getRecipeCount('Dezerty'), img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=500&fit=crop' },
];

function getDailyRecipe(disliked: string[]): typeof recipes[number] | null {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
  const blocked = disliked.map((d) => d.toLowerCase());

  const pool = recipes.filter((r) => {
    if (blocked.length === 0) return true;
    const names = r.ingredients.map((i) => (typeof i === 'string' ? i : i.name).toLowerCase());
    return !blocked.some((term) => names.some((n) => n.includes(term)));
  });

  if (pool.length === 0) return recipes[seed % recipes.length] ?? null;
  return pool[seed % pool.length];
}

function nextMonday(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Strava() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<typeof tabs[number]>('Recepty');
  const { profile, saveProfile } = useNutritionProfile();
  const { plan, generatePlan, swapMeal, activeDay, activeWeek, setActiveDay, setActiveWeek } = useMealPlan();
  const { canUseMealPlanner } = useSubscription();
  const dailyRecipe = getDailyRecipe(profile?.dislikedIngredients ?? []);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = (p: NutritionProfile) => {
    saveProfile(p);
    generatePlan(p, nextMonday());
    setShowOnboarding(false);
    setTab('Jedálniček');
  };

  const handleRegenerate = () => {
    if (profile) {
      generatePlan(profile, nextMonday());
    }
  };

  const selectedDay = plan?.days[activeDay] ?? null;

  if (showOnboarding) {
    return (
      <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setShowOnboarding(false)} className="p-1">
              <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
                <UtensilsCrossed className="w-4 h-4" style={{ color: '#7A9E78' }} />
              </div>
              <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Nastavenie jedálnička</h1>
            </div>
          </div>
        </div>
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
          <NutritionOnboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/kniznica')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <UtensilsCrossed className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[26px] font-medium leading-tight" style={{ color: '#2E2218', fontFamily: '"Bodoni Moda", Georgia, serif' }}>Strava</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                t === tab
                  ? 'bg-[#7A9E78] text-white'
                  : 'bg-white/20 text-[#8B7560] hover:bg-white/25'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Recepty tab */}
      {tab === 'Recepty' && (
        <div className="space-y-4">
          {dailyRecipe && (
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 overflow-hidden">
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#7A9E78' }}>
                  Recept dňa
                </p>
                {!canUseMealPlanner && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(184,134,74,0.12)', color: '#B8864A' }}>
                    Zadarmo
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate(`/recept/${dailyRecipe.id}`)}
                className="relative w-full h-48 block active:scale-[0.99] transition-transform"
              >
                <img src={dailyRecipe.image} alt={dailyRecipe.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-white text-base font-bold leading-tight drop-shadow-lg">{dailyRecipe.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/80 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />{dailyRecipe.prepTime} min
                    </span>
                    <span className="text-white/80 text-xs flex items-center gap-1">
                      <Flame className="w-3 h-3" />{dailyRecipe.calories} kcal
                    </span>
                  </div>
                </div>
              </button>
              {!canUseMealPlanner && (
                <div className="px-4 py-3 border-t border-white/20">
                  <button
                    onClick={() => setTab('Jedálniček')}
                    className="flex items-center gap-2 w-full justify-center py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
                    style={{ background: 'rgba(184,134,74,0.1)', color: '#B8864A' }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Chceš celý jedálniček? Získaj NeoMe+
                  </button>
                </div>
              )}
            </div>
          )}

          {categories.map((c) => (
            <div key={c.label} className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 overflow-hidden">
              <button
                onClick={() => navigate(`/recepty?category=${encodeURIComponent(c.label)}`)}
                className="relative w-full h-44 flex flex-col justify-end items-start p-4 active:scale-[0.99] transition-transform cursor-pointer"
              >
                <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                <div className="relative z-20 text-left pointer-events-none">
                  <p className="text-white text-xl font-bold leading-tight drop-shadow-lg">{c.label}</p>
                  <p className="text-white/80 text-xs mt-0.5">{c.count} receptov</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Jedálniček tab */}
      {tab === 'Jedálniček' && (
        plan && selectedDay ? (
          <div className="space-y-4">
            {/* Week + Day navigator */}
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
              <WeekDayNavigator
                plan={plan}
                activeWeek={activeWeek}
                activeDay={activeDay}
                onWeekChange={setActiveWeek}
                onDayChange={setActiveDay}
              />
            </div>

            {/* Meals */}
            {selectedDay.meals.map((meal, mealIdx) => {
              const recipe = recipes.find((r) => r.id === meal.options[meal.selected]);
              const altRecipe = recipes.find((r) => r.id === meal.options[meal.selected === 0 ? 1 : 0]);
              if (!recipe) return null;
              const adjustedCal = Math.round(recipe.calories * meal.portionMultiplier);
              return (
                <div key={meal.type} className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 overflow-hidden">
                  <div className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-[#8B7560] uppercase tracking-wide">{meal.label}</p>
                      <span className="text-[10px] text-[#A0907E]">{Math.round(meal.portionMultiplier * 100)}% porcia</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/recept/${recipe.id}`)}
                    className="relative w-full h-40 block active:scale-[0.99] transition-transform"
                  >
                    <img src={recipe.image} alt={recipe.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-base font-bold leading-tight drop-shadow-lg">{recipe.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-white/80 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />{recipe.prepTime} min
                        </span>
                        <span className="text-white/80 text-xs flex items-center gap-1">
                          <Flame className="w-3 h-3" />{adjustedCal} kcal
                        </span>
                      </div>
                    </div>
                  </button>
                  {altRecipe && altRecipe.id !== recipe.id && (
                    <div className="p-4 pt-3">
                      <button
                        onClick={() => swapMeal(activeDay, mealIdx)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-white/20 text-xs text-[#8B7560] hover:bg-white/25 active:scale-95 transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Zameniť za: <span className="font-medium text-[#7A9E78]">{altRecipe.title}</span></span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Daily macro summary */}
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
              <div className="flex items-center gap-4">
                <ProgressRing
                  progress={Math.min(100, Math.round((selectedDay.totalCalories / (profile?.dailyCalories || 2000)) * 100))}
                  size={56}
                  stroke={4}
                  color="#7A9E78"
                >
                  <span className="text-[10px] font-bold text-[#7A9E78]">
                    {Math.round((selectedDay.totalCalories / (profile?.dailyCalories || 2000)) * 100)}%
                  </span>
                </ProgressRing>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#2E2218' }}>
                    {selectedDay.totalCalories} / {profile?.dailyCalories || 2000} kcal
                  </p>
                  <p className="text-xs text-[#8B7560] mt-0.5">
                    B: {selectedDay.totalProtein}g · S: {selectedDay.totalCarbs}g · T: {selectedDay.totalFat}g
                  </p>
                </div>
              </div>
            </div>

            {/* Regenerate */}
            <div className="text-center">
              <button
                onClick={handleRegenerate}
                className="text-xs text-[#8B7560] py-2 hover:text-[#7A9E78] transition-colors"
              >
                Vygenerovať nový jedálniček
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <UtensilsCrossed className="w-6 h-6" style={{ color: '#7A9E78' }} />
            </div>
            <h2 className="text-[16px] font-semibold mb-2" style={{ color: '#2E2218' }}>Personalizovaný jedálniček</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B4C3B' }}>
              Odpovedz na pár otázok a pripravíme ti jedálniček na mieru — podľa tvojich cieľov, preferencií a alergií.
            </p>
            <div className="space-y-3 mb-6">
              {['Vypočítame tvoje denné kalórie', 'Navrhneme recepty podľa preferencií', '2 možnosti na každé jedlo — vyber si'].map((q, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/20">
                  <div className="w-5 h-5 rounded-full bg-[#7A9E78]/20 text-[#7A9E78] text-[10px] font-bold flex items-center justify-center">✓</div>
                  <span className="text-sm text-[#8B7560] text-left">{q}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowOnboarding(true)}
              className="w-full rounded-xl text-white py-3 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: '#7A9E78' }}
            >
              Začať
            </button>
          </div>
        )
      )}
    </div>
  );
}
