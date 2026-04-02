import React, { useState } from 'react';
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
import { Leaf, Droplets, MessageCircle } from 'lucide-react';
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
      className={`bg-white rounded-3xl border-0 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${className}`}
      style={{ 
        boxShadow: shadows[priority],
        backdropFilter: 'blur(20px)',
        border: 'none'
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
    <div className="flex items-center gap-4 my-12">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(168, 132, 139, 0.2), transparent)' }} />
      <span className="text-[10px] font-medium tracking-[0.3em] uppercase px-3" style={{ color: '#A89B8C' }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(168, 132, 139, 0.2), transparent)' }} />
    </div>
  );
}

// Custom Water Intake as a Habit-like Component
function WaterHabitCard() {
  const { user } = useSupabaseAuth();
  const [waterData, setWaterData] = React.useState({ glasses: 0, goal: 8 }); // 8 glasses = 2L
  const [justCompleted, setJustCompleted] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  
  React.useEffect(() => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `water_intake_${user.id}_${today}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsedData = JSON.parse(saved);
      setWaterData(parsedData);
    }
  }, [user?.id]);

  const updateWaterData = (newData) => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `water_intake_${user.id}_${today}`;
    localStorage.setItem(storageKey, JSON.stringify(newData));
    setWaterData(newData);

    if (newData.glasses === newData.goal && newData.glasses > waterData.glasses) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
  };

  const handleGlassClick = (index) => {
    const newGlasses = index + 1 <= waterData.glasses ? index : index + 1;
    updateWaterData({ ...waterData, glasses: newGlasses });
  };

  const handleGoalChange = (newGoal) => {
    updateWaterData({ ...waterData, goal: newGoal, glasses: Math.min(waterData.glasses, newGoal) });
    setIsEditing(false);
  };

  const isComplete = waterData.glasses >= waterData.goal;
  const goalLitres = (waterData.goal * 0.25).toFixed(1);

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
      <div className="flex items-start gap-3">
        {/* Complete indicator with water droplet */}
        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
            isComplete ? 'bg-[#8FA3A3] border-[#8FA3A3]' : 'border-white/40 bg-transparent'
          } ${justCompleted ? 'animate-bounce' : ''}`}
        >
          <Droplets className={`w-5 h-5 ${isComplete ? 'text-white' : 'text-[#8FA3A3]'}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Title with edit icon */}
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${isComplete ? 'text-[#8B7560] line-through' : 'text-[#2E2218]'}`}>
              Pitný režim ({goalLitres} litre)
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#8B7560]">
                {waterData.glasses}/{waterData.goal}
              </span>
              <button 
                onClick={() => setIsEditing(true)}
                className="w-5 h-5 text-[#A0907E] hover:text-[#8B7560] transition-colors"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Goal editing */}
          {isEditing && (
            <div className="mt-3 p-3  rounded-lg" style={{ background: colors.bgGradient }}>
              <p className="text-xs text-[#8B7560] mb-2">Denný cieľ (poháre po 250ml):</p>
              <div className="flex gap-1">
                {[4, 6, 8, 10, 12].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleGoalChange(goal)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      goal === waterData.goal ? 'bg-[#8FA3A3] text-white' : 'bg-white text-[#8B7560] border border-white/35 hover:border-[#8FA3A3]'
                    }`}
                  >
                    {goal} ({(goal * 0.25).toFixed(1)}L)
                  </button>
                ))}
              </div>
              <button onClick={() => setIsEditing(false)} className="text-xs text-[#A0907E] mt-2">
                Zrušiť
              </button>
            </div>
          )}

          {/* Interactive glasses - Single row, overflow scroll if needed */}
          <div className="mt-3 overflow-x-auto">
            <div className="flex gap-2 min-w-fit">
              {Array.from({ length: waterData.goal }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleGlassClick(i)}
                  className="shrink-0 transition-all duration-200 active:scale-95 hover:scale-105"
                >
                  <svg 
                    className={`w-6 h-8 transition-colors ${
                      i < waterData.glasses ? 'text-[#8FA3A3]' : 'text-gray-300'
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M5,2 C4.45,2 4,2.45 4,3 C4,3.55 4.45,4 5,4 L5,16 C5,19.31 7.69,22 11,22 L13,22 C16.31,22 19,19.31 19,16 L19,4 C19.55,4 20,3.55 20,3 C20,2.45 19.55,2 19,2 L5,2 Z M7,4 L17,4 L17,16 C17,18.21 15.21,20 13,20 L11,20 C8.79,20 7,18.21 7,16 L7,4 Z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
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
              <div key={habit.id} className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#2E2218] text-sm">{habit.name}</h4>
                    <p className="text-xs text-[#8B7560]">
                      {habit.target} {habit.unit} • {habit.frequency === 'daily' ? 'Každý deň' : habit.frequency}
                    </p>
                    {habit.description && (
                      <p className="text-xs text-[#A0907E] mt-1">{habit.description}</p>
                    )}
                  </div>
                  <div className="text-lg ml-3">
                    {HABIT_CATEGORIES.find(c => c.id === habit.category)?.icon || '✅'}
                  </div>
                </div>
              </div>
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

const HABIT_CATEGORIES = [
  { id: 'health', name: 'Zdravie', color: '#7A9E78', icon: '💚' },
  { id: 'fitness', name: 'Pohyb', color: '#6B4C3B', icon: '💪' },
  { id: 'mindfulness', name: 'Myseľ', color: '#A8848B', icon: '🧘' },
  { id: 'nutrition', name: 'Výživa', color: '#C27A6E', icon: '🥗' },
  { id: 'sleep', name: 'Spánok', color: '#B8864A', icon: '😴' },
  { id: 'productivity', name: 'Produktivita', color: '#8B7D6B', icon: '📈' }
];

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

        <SectionDivider label="DNES" />

        {/* Today Overview - Priority Card */}
        <NordicCard className="px-4 py-6" priority="priority">
          <TodayOverview />
        </NordicCard>

        <SectionDivider label="POKROKY" />

        {/* Workout Stats - Conditional */}
        {stats.totalWorkouts > 0 && (
          <NordicCard className="px-4 py-5" priority="standard">
            <WorkoutStatsWidget variant="compact" />
          </NordicCard>
        )}

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
        <div className="space-y-6">
          {/* Buddy System */}
          <NordicCard className="px-4 py-5" priority="standard">
            <BuddyShortcut />
          </NordicCard>

          {/* Community Topics - Placeholder */}
          <NordicCard className="px-4 py-5" priority="standard">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
                  <MessageCircle className="w-4 h-4" style={{ color: '#B8864A' }} />
                </div>
                <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Sledované témy</h3>
              </div>

              {/* Sub-header */}
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
                  Zatiaľ nemáš uložené žiadne témy z komunity
                </p>
              </div>
            </div>
          </NordicCard>

          {/* Community Achievement/Badge */}
          <NordicCard className="px-4 py-5" priority="priority">
            <CommunityStatusWidget variant="compact" />
          </NordicCard>
        </div>

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