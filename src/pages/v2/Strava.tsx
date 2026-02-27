import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, RefreshCw, UtensilsCrossed } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import ProgressRing from '../../components/v2/ProgressRing';
import { useNutritionProfile } from '../../features/nutrition/useNutritionProfile';
import { useMealPlan } from '../../features/nutrition/useMealPlan';
import NutritionOnboarding from '../../features/nutrition/NutritionOnboarding';
import { recipes } from '../../data/recipes';
import type { NutritionProfile } from '../../features/nutrition/types';

const tabs = ['Recepty', 'Jedálniček'] as const;
const categories = [
  { label: 'Raňajky', count: 24, img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=500&fit=crop' },
  { label: 'Hlavné jedlá a polievky', count: 32, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop' },
  { label: 'Dobrotky', count: 16, img: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800&h=500&fit=crop' },
  { label: 'Smoothie & Nápoje', count: 12, img: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=800&h=500&fit=crop' },
  { label: 'Snacky', count: 16, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=500&fit=crop' },
];

const dayLabels = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export default function Strava() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<typeof tabs[number]>('Recepty');
  const { profile, saveProfile } = useNutritionProfile();
  const { plan, generatePlan, swapMeal } = useMealPlan();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState(() => {
    if (!plan) return 0;
    const today = new Date().toISOString().split('T')[0];
    const idx = plan.days.findIndex((d) => d.date === today);
    return idx >= 0 ? idx : 0;
  });

  const handleOnboardingComplete = (p: NutritionProfile) => {
    saveProfile(p);
    generatePlan(p);
    setShowOnboarding(false);
    setTab('Jedálniček');
  };

  const handleRegenerate = () => {
    if (profile) {
      generatePlan(profile);
      setSelectedDayIdx(0);
    }
  };

  const selectedDay = plan?.days[selectedDayIdx] ?? null;

  // Full-screen onboarding
  if (showOnboarding) {
    return (
      <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setShowOnboarding(false)} className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
                <UtensilsCrossed className="w-4 h-4" style={{ color: '#7A9E78' }} />
              </div>
              <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Nastavenie jedálnička</h1>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <NutritionOnboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/kniznica')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <UtensilsCrossed className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Strava</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Zdravá výživa pre tvoje ciele
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="relative h-64">
          <img
            src="/images/strava-hero.jpg"
            alt="NeoMe Strava"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30" />
          <div className="absolute bottom-6 left-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Jedz zdravo a chutne
            </h2>
            <p className="text-white/90 text-sm">
              108 receptov a personalizované jedálničky
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                t === tab 
                  ? 'bg-[#7A9E78] text-white' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Recepty */}
      {tab === 'Recepty' && (
        <div className="space-y-4">
          {categories.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
              <button
                onClick={() => navigate(`/recepty?cat=${encodeURIComponent(c.label)}`)}
                className="relative w-full h-44 block active:scale-[0.99] transition-transform"
              >
                <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <p className="text-white text-xl font-bold leading-tight drop-shadow-lg">{c.label}</p>
                  <p className="text-white/80 text-xs mt-0.5">{c.count} receptov</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Jedálniček */}
      {tab === 'Jedálniček' && (
        plan && selectedDay ? (
          <div className="space-y-4">
            {/* Day pills */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {plan.days.map((d, i) => {
                  const date = new Date(d.date);
                  const dayLabel = dayLabels[(date.getDay() + 6) % 7];
                  const isToday = d.date === new Date().toISOString().split('T')[0];
                  return (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDayIdx(i)}
                      className={`flex flex-col items-center px-3 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all ${
                        i === selectedDayIdx
                          ? 'bg-[#7A9E78] text-white'
                          : isToday
                          ? 'bg-[#7A9E78]/10 text-[#7A9E78] border border-[#7A9E78]/20'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xs">{dayLabel}</span>
                      <span className="text-base font-semibold">{date.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meals */}
            {selectedDay.meals.map((meal, mealIdx) => {
              const recipe = recipes.find((r) => r.id === meal.options[meal.selected]);
              const altRecipe = recipes.find((r) => r.id === meal.options[meal.selected === 0 ? 1 : 0]);
              if (!recipe) return null;
              const adjustedCal = Math.round(recipe.calories * meal.portionMultiplier);
              return (
                <div key={meal.type} className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                  <div className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{meal.label}</p>
                      <span className="text-[10px] text-gray-400">{Math.round(meal.portionMultiplier * 100)}% porcia</span>
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
                  {/* Swap button */}
                  {altRecipe && (
                    <div className="p-4 pt-3">
                      <button
                        onClick={() => swapMeal(selectedDayIdx, mealIdx)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-gray-50 text-xs text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
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
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
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
                  <p className="text-xs text-gray-500 mt-0.5">
                    B: {selectedDay.totalProtein}g · S: {selectedDay.totalCarbs}g · T: {selectedDay.totalFat}g
                  </p>
                </div>
              </div>
            </div>

            {/* Regenerate */}
            <div className="text-center">
              <button
                onClick={handleRegenerate}
                className="text-xs text-gray-500 py-2 hover:text-[#7A9E78] transition-colors"
              >
                Vygenerovať nový jedálniček
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <UtensilsCrossed className="w-6 h-6" style={{ color: '#7A9E78' }} />
            </div>
            <h2 className="text-[16px] font-semibold mb-2" style={{ color: '#2E2218' }}>Personalizovaný jedálniček</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B4C3B' }}>
              Odpovedz na pár otázok a pripravíme ti jedálniček na mieru — podľa tvojich cieľov, preferencií a alergií.
            </p>
            <div className="space-y-3 mb-6">
              {['Vypočítame tvoje denné kalórie', 'Navrhneme recepty podľa preferencií', '2 možnosti na každé jedlo — vyber si'].map((q, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-5 h-5 rounded-full bg-[#7A9E78]/20 text-[#7A9E78] text-[10px] font-bold flex items-center justify-center">✓</div>
                  <span className="text-sm text-gray-600 text-left">{q}</span>
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
