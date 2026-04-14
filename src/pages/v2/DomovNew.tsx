import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GreetingHeader from '../../components/v2/home/GreetingHeader';
import WeeklyCalendarStrip, { getWeekDays } from '../../components/v2/home/WeeklyCalendarStrip';
import TodayOverview from '../../components/v2/home/TodayOverview';
import HabitTracker from '../../components/v2/home/HabitTracker';
import ReflectionSection from '../../components/v2/home/ReflectionSection';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import WaterIntakeWidget from '../../components/v2/tracking/WaterIntakeWidget';
import MoodEnergyTracker from '../../components/v2/tracking/MoodEnergyTracker';
import FavoritesShortcut from '../../components/v2/favorites/FavoritesShortcut';
import CommunityStatusWidget from '../../components/v2/achievements/CommunityStatusWidget';
import WorkoutStatsWidget from '../../components/v2/workouts/WorkoutStatsWidget';
import WorkoutDemoShortcut from '../../components/v2/workouts/WorkoutDemoShortcut';
import BuddyShortcut from '../../components/v2/buddy/BuddyShortcut';
import AddHabitModal from '../../components/v2/habits/AddHabitModal';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';
import { useMealPlan } from '../../features/nutrition/useMealPlan';
import { recipes } from '../../data/recipes';
import { Leaf, Droplets, UtensilsCrossed, Clock, ChevronRight, CheckCircle2, Heart, Dumbbell, Brain, Utensils, Moon, TrendingUp, type LucideIcon } from 'lucide-react';
import { useCommunityPosts } from '../../hooks/useCommunityPosts';
import { colors, glassCard } from '../../theme/warmDusk';

// Nordic Card Wrapper - Enhanced layered effect, no borders
function NordicCard({ children, className = "", priority = "standard" }) {
  const shadows = {
    priority: "0 16px 64px rgba(107, 76, 59, 0.12), 0 8px 32px rgba(107, 76, 59, 0.08), 0 4px 16px rgba(107, 76, 59, 0.04)",
    standard: "0 12px 48px rgba(107, 76, 59, 0.08), 0 6px 24px rgba(107, 76, 59, 0.04), 0 3px 12px rgba(107, 76, 59, 0.02)",
    subtle: "0 8px 32px rgba(107, 76, 59, 0.06), 0 4px 16px rgba(107, 76, 59, 0.03), 0 2px 8px rgba(107, 76, 59, 0.01)"
  };

  return (
    <div
      className={`rounded-[20px] transition-all duration-300 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.22)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.30)',
        boxShadow: shadows[priority],
      }}
    >
      {children}
    </div>
  );
}

// Nordic Section Divider
function SectionDivider({ label }) {
  if (!label) {
    return <div className="h-8" />;
  }
  
  return (
    <div className="flex items-center gap-4 my-10">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(184,134,74,0.25), transparent)' }} />
      <span className="text-[10px] tracking-[0.35em] uppercase px-3 font-light" style={{ color: '#B8864A', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(184,134,74,0.25), transparent)' }} />
    </div>
  );
}

// Water Intake — circular progress ring design
function WaterHabitCard() {
  const { user } = useSupabaseAuth();
  const [waterData, setWaterData] = React.useState({ glasses: 0, goal: 8 });
  const [justCompleted, setJustCompleted] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`water_intake_${user.id}_${today}`);
    if (saved) setWaterData(JSON.parse(saved));
  }, [user?.id]);

  const updateWaterData = (newData: { glasses: number; goal: number }) => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`water_intake_${user.id}_${today}`, JSON.stringify(newData));
    setWaterData(newData);
    if (newData.glasses === newData.goal && newData.glasses > waterData.glasses) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 800);
    }
  };

  const add = () => {
    if (waterData.glasses < waterData.goal) updateWaterData({ ...waterData, glasses: waterData.glasses + 1 });
  };
  const remove = () => {
    if (waterData.glasses > 0) updateWaterData({ ...waterData, glasses: waterData.glasses - 1 });
  };

  const isComplete = waterData.glasses >= waterData.goal;
  const pct = waterData.goal > 0 ? waterData.glasses / waterData.goal : 0;
  const litres = (waterData.glasses * 0.25).toFixed(2).replace('.', ',');
  const goalLitres = (waterData.goal * 0.25).toFixed(1).replace('.', ',');

  // SVG ring params
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(143,163,163,0.15)' }}>
            <Droplets className="w-4 h-4" style={{ color: '#8FA3A3' }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: '#2E2218' }}>Pitný režim</span>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="text-[11px] font-medium px-2.5 py-1 rounded-lg" style={{ color: '#8FA3A3', background: 'rgba(143,163,163,0.12)' }}>
          Cieľ: {goalLitres} L
        </button>
      </div>

      {/* Ring + controls */}
      <div className="flex items-center gap-5">
        {/* Circular progress */}
        <div className={`relative flex-shrink-0 transition-transform duration-300 ${justCompleted ? 'scale-110' : 'scale-100'}`}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            {/* Track */}
            <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(143,163,163,0.15)" strokeWidth="8" />
            {/* Progress */}
            <circle
              cx="48" cy="48" r={r}
              fill="none"
              stroke={isComplete ? '#7A9E78' : '#8FA3A3'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              strokeDashoffset="0"
              transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dasharray 0.4s ease, stroke 0.3s ease' }}
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold leading-none" style={{ color: isComplete ? '#7A9E78' : '#2E2218' }}>
              {waterData.glasses}
            </span>
            <span className="text-[9px] font-medium mt-0.5" style={{ color: '#A0907E' }}>
              / {waterData.goal}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[22px] font-semibold leading-none" style={{ color: isComplete ? '#7A9E78' : '#2E2218' }}>
              {litres} L
            </p>
            <p className="text-[11px] mt-1" style={{ color: '#A0907E' }}>
              {isComplete ? '🎉 Denný cieľ splnený!' : `zostáva ${((waterData.goal - waterData.glasses) * 0.25).toFixed(2).replace('.', ',')} L`}
            </p>
          </div>

          {/* +/- controls */}
          <div className="flex gap-2">
            <button
              onClick={remove}
              disabled={waterData.glasses === 0}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-medium transition-all active:scale-90 disabled:opacity-30"
              style={{ background: 'rgba(143,163,163,0.12)', color: '#8FA3A3' }}
            >
              −
            </button>
            <button
              onClick={add}
              disabled={isComplete}
              className="flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-all active:scale-95 disabled:opacity-40"
              style={{ background: isComplete ? 'rgba(122,158,120,0.15)' : 'rgba(143,163,163,0.18)', color: isComplete ? '#7A9E78' : '#8FA3A3' }}
            >
              <Droplets className="w-3.5 h-3.5" />
              + pohár
            </button>
          </div>
        </div>
      </div>

      {/* Goal selector */}
      {isEditing && (
        <div className="mt-4 pt-3 border-t border-white/20">
          <p className="text-[11px] font-medium mb-2" style={{ color: '#8B7560' }}>Denný cieľ (poháre × 250 ml):</p>
          <div className="flex gap-1.5 flex-wrap">
            {[4, 6, 8, 10, 12].map((g) => (
              <button
                key={g}
                onClick={() => { updateWaterData({ ...waterData, goal: g, glasses: Math.min(waterData.glasses, g) }); setIsEditing(false); }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                style={g === waterData.goal
                  ? { background: '#8FA3A3', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.5)', color: '#8B7560', border: '1px solid rgba(143,163,163,0.25)' }}
              >
                {g}× · {(g * 0.25).toFixed(1)} L
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Enhanced Navyky Card with Water Intake
function EnhancedNavykyCard() {
  const { user } = useSupabaseAuth();
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [habits, setHabits] = useState<any[]>([]);

  // Load user's habits on component mount
  React.useEffect(() => {
    if (user?.id) {
      const storageKey = `user_habits_${user.id}`;
      const savedHabits = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setHabits(savedHabits);
    }
  }, [user?.id]);

  const handleAddHabit = (newHabit: any) => {
    console.log('New habit created:', newHabit);
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    
    // Save to localStorage for demo
    if (user?.id) {
      const storageKey = `user_habits_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedHabits));
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Návyky Header - Restored */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
            <Leaf className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Návyky</h3>
        </div>

        {/* Sub-header */}
        <div className="text-center mb-4">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Vybuduj si zdravé návyky krok za krokom
          </p>
        </div>

        {/* Water Intake Habit - In its own white card */}
        <WaterHabitCard />

        {/* Other Habits - Each in separate cards */}
        <HabitTracker hideHeader hideCTA hideWarning renderInCards />
        
        {/* Show user's custom habits */}
        {habits.length > 0 && (
          <div className="space-y-3">
            {habits.map((habit) => (
              <CustomHabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
          
        {/* Single Brown CTA */}
        <div className="text-center pt-2">
          <button 
            onClick={() => {
              console.log('Debug: Opening Add Habit Modal');
              setShowAddHabitModal(true);
            }}
            className="text-sm font-medium px-6 py-3 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
            style={{ background: '#6B4C3B' }}
          >
            Pridať návyk
          </button>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal 
        isOpen={showAddHabitModal}
        onClose={() => setShowAddHabitModal(false)}
        onSubmit={handleAddHabit}
      />
    </>
  );
}

const HABIT_CATEGORIES: { id: string; name: string; color: string; icon: LucideIcon }[] = [
  { id: 'health', name: 'Zdravie', color: '#7A9E78', icon: Heart },
  { id: 'fitness', name: 'Pohyb', color: '#6B4C3B', icon: Dumbbell },
  { id: 'mindfulness', name: 'Myseľ', color: '#A8848B', icon: Brain },
  { id: 'nutrition', name: 'Výživa', color: '#C27A6E', icon: Utensils },
  { id: 'sleep', name: 'Spánok', color: '#B8864A', icon: Moon },
  { id: 'productivity', name: 'Produktivita', color: '#8B7D6B', icon: TrendingUp },
];

function getStep(unit: string): number {
  if (unit === 'minút') return 5;
  if (unit === 'hodín') return 1;
  if (unit === 'krokov') return 500;
  return 1; // krát, pohárov, strán, etc.
}

function CustomHabitCard({ habit }: { habit: any }) {
  const today = new Date().toISOString().slice(0, 10);
  const storageKey = `habit_progress_${habit.id}_${today}`;
  const [count, setCount] = React.useState<number>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '0'); } catch { return 0; }
  });

  const target = parseInt(habit.target) || 1;
  const step = getStep(habit.unit);
  const pct = Math.min(count / target, 1);
  const isComplete = count >= target;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const cat = HABIT_CATEGORIES.find(c => c.id === habit.category);
  const color = cat?.color || '#B8864A';
  const IconComponent = cat?.icon || CheckCircle2;

  const save = (next: number) => {
    setCount(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  const add = () => { if (!isComplete) save(Math.min(count + step, target)); };
  const remove = () => { if (count > 0) save(Math.max(count - step, 0)); };
  const complete = () => save(target);

  const remaining = target - count;
  const remainingLabel = step > 1
    ? `zostáva ${remaining} ${habit.unit}`
    : `zostáva ${remaining} ${habit.unit}`;

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
            <IconComponent className="w-4 h-4" style={{ color }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: '#2E2218' }}>{habit.name}</span>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg" style={{ color, background: `${color}12` }}>
          Cieľ: {target} {habit.unit}
        </span>
      </div>
      <div className="flex items-center gap-5">
        {/* Progress ring */}
        <div className="relative flex-shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={r} fill="none" stroke={`${color}20`} strokeWidth="8" />
            <circle
              cx="48" cy="48" r={r} fill="none"
              stroke={isComplete ? '#7A9E78' : color}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`} strokeDashoffset="0"
              transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dasharray 0.4s ease, stroke 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold leading-none" style={{ color: isComplete ? '#7A9E78' : '#2E2218' }}>{count}</span>
            <span className="text-[9px] font-medium mt-0.5" style={{ color: '#A0907E' }}>/ {target}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[22px] font-semibold leading-none" style={{ color: isComplete ? '#7A9E78' : '#2E2218' }}>
              {count} {habit.unit}
            </p>
            <p className="text-[11px] mt-1" style={{ color: '#A0907E' }}>
              {isComplete ? 'Denný cieľ splnený!' : remainingLabel}
            </p>
          </div>

          {step === 1 ? (
            /* Count-based unit: − and + 1 buttons */
            <div className="flex gap-2">
              <button
                onClick={remove} disabled={count === 0}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-medium transition-all active:scale-90 disabled:opacity-30"
                style={{ background: `${color}12`, color }}
              >−</button>
              <button
                onClick={add} disabled={isComplete}
                className="flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-all active:scale-95 disabled:opacity-40"
                style={{ background: isComplete ? 'rgba(122,158,120,0.15)' : `${color}18`, color: isComplete ? '#7A9E78' : color }}
              >
                <IconComponent className="w-3.5 h-3.5" />
                + {habit.unit}
              </button>
            </div>
          ) : (
            /* Time/step-based unit: − step, + step, and complete button */
            <div className="flex gap-2">
              <button
                onClick={remove} disabled={count === 0}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all active:scale-90 disabled:opacity-30"
                style={{ background: `${color}12`, color }}
              >−{step}</button>
              <button
                onClick={add} disabled={isComplete}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all active:scale-90 disabled:opacity-30"
                style={{ background: `${color}18`, color }}
              >+{step}</button>
              <button
                onClick={complete} disabled={isComplete}
                className="flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-all active:scale-95 disabled:opacity-40"
                style={{ background: isComplete ? 'rgba(122,158,120,0.15)' : `${color}18`, color: isComplete ? '#7A9E78' : color }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Splnené
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Today Meals Card ─────────────────────────────────────────────────────────
function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()}. ${months[d.getMonth()]}`;
}

function TodayMealsCard() {
  const navigate = useNavigate();
  const { plan, todayPlan } = useMealPlan();

  // Plan exists — find today's meals or the next upcoming day
  if (plan) {
    const todayStr = new Date().toISOString().split('T')[0];
    const displayDay = todayPlan ?? plan.days.find((d) => d.date >= todayStr) ?? plan.days[0];
    const isToday = !!todayPlan;

    if (displayDay) {
      return (
        <div className="rounded-[20px] px-4 py-5 space-y-3" style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.30)', boxShadow: '0 12px 48px rgba(107,76,59,0.08)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(122,158,120,0.14)' }}>
                <UtensilsCrossed className="w-3.5 h-3.5" style={{ color: '#7A9E78' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: '#2E2218' }}>
                  {isToday ? 'Dnešný jedálniček' : 'Blížiaci sa jedálniček'}
                </h3>
                {!isToday && (
                  <p className="text-[10px]" style={{ color: '#A0907E' }}>od {formatShortDate(displayDay.date)}</p>
                )}
              </div>
            </div>
            <span className="text-xs font-medium" style={{ color: '#7A9E78' }}>{displayDay.totalCalories} kcal</span>
          </div>

          <div className="space-y-2">
            {displayDay.meals.map((meal, i) => {
              const recipe = recipes.find((r) => r.id === meal.options[meal.selected]);
              if (!recipe) return null;
              const kcal = Math.round(recipe.calories * meal.portionMultiplier);
              return (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'rgba(122,158,120,0.06)' }}>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#A0907E' }}>{meal.label}</p>
                    <p className="text-xs font-medium leading-snug mt-0.5" style={{ color: '#2E2218' }}>{recipe.title}</p>
                  </div>
                  <span className="ml-auto text-[10px] shrink-0" style={{ color: '#8B7560' }}>{kcal} kcal</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/jedalnicek')}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.98]"
            style={{ background: 'rgba(122,158,120,0.12)', color: '#7A9E78' }}
          >
            Otvoriť celý jedálniček
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }
  }

  // No plan — show date-seeded sample recipe
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((acc, p) => acc + parseInt(p, 10), 0);
  const sampleRecipe = recipes[seed % recipes.length];

  if (!sampleRecipe) return null;

  return (
    <div className="rounded-[20px] px-4 py-5 space-y-3" style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.30)', boxShadow: '0 12px 48px rgba(107,76,59,0.08)' }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(184,134,74,0.12)' }}>
          <UtensilsCrossed className="w-3.5 h-3.5" style={{ color: '#B8864A' }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: '#2E2218' }}>Recept dňa</h3>
      </div>

      <div className="relative rounded-xl overflow-hidden h-32">
        <img src={sampleRecipe.image} alt={sampleRecipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-white text-sm font-semibold leading-tight">{sampleRecipe.title}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-white/80 text-[10px] flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />{sampleRecipe.prepTime} min
            </span>
            <span className="text-white/80 text-[10px]">{sampleRecipe.calories} kcal</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/jedalnicek')}
        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.98]"
        style={{ background: 'rgba(184,134,74,0.1)', color: '#B8864A' }}
      >
        Vytvoriť jedálniček
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Community Home Block ─────────────────────────────────────────────────────
// Generates stable-but-varied "yesterday" numbers seeded by date
function getYesterdayStats() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const seed = d.getDate() + d.getMonth() * 31;
  return {
    workouts: 38 + (seed % 24),        // 38–61
    habits:   72 + ((seed * 3) % 41),   // 72–112
    meditations: 18 + ((seed * 7) % 19), // 18–36
  };
}

function CommunityHomeBlock() {
  const navigate = useNavigate();
  const { posts } = useCommunityPosts();

  const hour = new Date().getHours();
  // Before 10am treat today as "not started yet" — show yesterday's numbers
  const isEarlyMorning = hour < 10;
  const yesterday = getYesterdayStats();

  return (
    <div className="space-y-4">
      {/* Community Wins */}
      <NordicCard className="px-4 py-5" priority="standard">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(184,134,74,0.14)' }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: '#B8864A' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>
              {isEarlyMorning ? 'Včerajšie víťazstvá' : 'Dnešné víťazstvá'}
            </h3>
            <p className="text-[10px]" style={{ color: '#A0907E' }}>
              {isEarlyMorning ? 'Spolu sme včera dosiahli' : 'Spolu dnes v komunite'}
            </p>
          </div>
          <button
            onClick={() => navigate('/komunita')}
            className="text-[11px] font-medium flex items-center gap-0.5"
            style={{ color: '#B8864A' }}
          >
            Komunita <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Stats — always show impressive numbers */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { n: yesterday.workouts,    label: 'cvičení',    color: '#7A9E78', bg: 'rgba(122,158,120,0.12)' },
            { n: yesterday.habits,      label: 'návykov',    color: '#B8864A', bg: 'rgba(184,134,74,0.12)' },
            { n: yesterday.meditations, label: 'meditácií',  color: '#A8848B', bg: 'rgba(168,132,139,0.12)' },
          ].map(({ n, label, color, bg }) => (
            <div key={label} className="text-center p-2.5 rounded-xl" style={{ background: bg }}>
              <div className="text-[22px] font-bold leading-none mb-0.5" style={{ color }}>{n}</div>
              <div className="text-[10px] font-medium" style={{ color }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Early morning: invitation to be first. Later: recent posts. */}
        {isEarlyMorning ? (
          <div className="rounded-xl p-3 text-center space-y-2" style={{ background: 'rgba(184,134,74,0.08)', border: '1px dashed rgba(184,134,74,0.3)' }}>
            <p className="text-[13px] font-semibold" style={{ color: '#2E2218' }}>Buď dnes prvá! ✨</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#8B7560' }}>
              Komunita ešte len vstáva. Odcvič si tréning, splň návyk alebo zamedituj — a inšpiruj ostatné.
            </p>
            <button
              onClick={() => navigate('/kniznica/telo')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95"
              style={{ background: '#B8864A', color: '#fff' }}
            >
              Začať tréning
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.slice(0, 2).map((post) => (
              <div key={post.id} className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.35)' }}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D0BCA8] to-[#B8864A] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold" style={{ color: '#2E2218' }}>{post.author} </span>
                  <span className="text-[11px]" style={{ color: '#8B7560' }}>
                    {post.text.length > 55 ? post.text.slice(0, 55) + '…' : post.text}
                  </span>
                </div>
                <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: '#A0907E' }}>{post.time}</span>
              </div>
            ))}
          </div>
        )}
      </NordicCard>

      {/* Achievements */}
      <NordicCard className="px-4 py-5" priority="priority">
        <CommunityStatusWidget variant="compact" />
      </NordicCard>
    </div>
  );
}

// Error Boundary Component
class DomovErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('❌ DomovNew component error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('❌ DomovNew error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: colors.bgGradient }}>
          <div className="bg-white/90 rounded-3xl p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Demo Načítanie...
            </h2>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Aplikácia sa pripravuje. Prosím počkajte.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-xl text-white font-semibold"
              style={{ backgroundColor: colors.telo }}
            >
              Obnoviť
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function DomovNewContent() {
  const days = getWeekDays();
  const todayIdx = days.findIndex((d) => d.isToday);
  const [selectedDay, setSelectedDay] = useState(todayIdx >= 0 ? todayIdx : 0);
  const { stats } = useWorkoutHistory();

  // Handle return from Stripe checkout (success_url has ?session_id=...)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('session_id')) {
      // Clean the URL without reloading
      window.history.replaceState({}, '', window.location.pathname);
      // Show a brief confirmation — webhook will update Supabase asynchronously
      setTimeout(() => {
        alert('Predplatné aktivované! Vitaj v NeoMe Premium.');
      }, 500);
    }
  }, []);

  // No longer need to override parent styles since AppLayout is fixed

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden"
      style={{ 
        background: colors.bgGradient,
        border: 'none',
        outline: 'none',
        margin: '0',
        padding: '0'
      }}
    >
      <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-8">
        
        {/* Header + Calendar - Merged Section */}
        <NordicCard className="px-4 py-6" priority="standard">
          <div className="space-y-6">
            <GreetingHeader />
            <WeeklyCalendarStrip days={days} selectedIdx={selectedDay} onSelect={setSelectedDay} />
          </div>
        </NordicCard>

        {/* Today Overview - Priority Card */}
        <NordicCard className="px-4 py-6" priority="priority">
          <TodayOverview />
        </NordicCard>

        {/* Enhanced Habits with Water Intake */}
        <NordicCard className="px-4 py-6" priority="priority">
          <EnhancedNavykyCard />
        </NordicCard>

        {/* Enhanced Reflection - Reduced Gap */}
        <NordicCard className="px-4 py-6 mt-4" priority="standard">
          <ReflectionSection />
        </NordicCard>

        <SectionDivider label="KOMUNITA" />

        {/* Community Section */}
        <CommunityHomeBlock />

        {/* Quote - Nordic End */}
        <div className="text-center py-16 space-y-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ 
            background: 'rgba(168, 132, 139, 0.06)',
            border: '1px solid rgba(168, 132, 139, 0.1)'
          }}>
            <Leaf className="w-6 h-6 opacity-50" style={{ color: '#A8848B' }} />
          </div>
          
          <p className="text-lg font-light leading-relaxed italic px-6" style={{ color: '#8B7560' }}>
            „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
          </p>
          
          <div className="flex justify-center items-center gap-6">
            <div className="w-8 h-px" style={{ background: '#C27A6E', opacity: 0.3 }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#7A9E78', opacity: 0.4 }} />
            <div className="w-8 h-px" style={{ background: '#B8864A', opacity: 0.3 }} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function DomovNew() {
  return <DomovNewContent />;
}