import { useState, useEffect } from 'react';
import { Droplets, Moon, BookOpen, Dumbbell, Apple, Plus, Check, ArrowLeft, GlassWater } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { colors, glassCard } from '../../theme/warmDusk';

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

interface HabitData {
  icon: any;
  name: string;
  progress: string;
  done: boolean;
}

const defaultHabitsData = [
  { icon: Droplets, name: 'Piť 8 pohárov vody', progress: '6/8', done: false },
  { icon: Dumbbell, name: 'Cvičenie', progress: '1/1', done: true },
  { icon: Moon, name: 'Spánok 8h', progress: '7.5h', done: true },
  { icon: BookOpen, name: 'Čítanie 20 min', progress: '20/20', done: true },
  { icon: Apple, name: '5 porcií ovocia', progress: '3/5', done: false },
];

export default function NavykyTracker() {
  const { user } = useAuthContext();
  const { isPremium } = useSubscription();
  const isSubscribed = isPremium;
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [weekDots, setWeekDots] = useState([true, true, true, false, false, false, false]);
  const [showPaywall, setShowPaywall] = useState(false);

  // Load habits from localStorage on mount
  useEffect(() => {
    if (!user?.id) return;
    
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `navyky_${user.id}_${today}`;
    const weekDotsKey = `navyky_week_${user.id}`;
    
    const savedHabits = localStorage.getItem(storageKey);
    const savedWeekDots = localStorage.getItem(weekDotsKey);
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits(defaultHabitsData);
    }
    
    if (savedWeekDots) {
      setWeekDots(JSON.parse(savedWeekDots));
    }
  }, [user?.id]);

  // For non-subscribers, reset habits daily
  useEffect(() => {
    if (!user?.id || isSubscribed) return;
    
    const today = new Date().toISOString().split('T')[0];
    const lastResetKey = `navyky_last_reset_${user.id}`;
    const lastReset = localStorage.getItem(lastResetKey);
    
    if (lastReset !== today) {
      // Reset to default habits for new day
      setHabits(defaultHabitsData);
      localStorage.setItem(lastResetKey, today);
      
      // Save reset habits
      const storageKey = `navyky_${user.id}_${today}`;
      localStorage.setItem(storageKey, JSON.stringify(defaultHabitsData));
    }
  }, [user?.id, isSubscribed]);

  const saveHabits = (newHabits: HabitData[]) => {
    if (!user?.id) return;
    
    // For non-subscribers, show paywall but still allow saving for current session
    if (!isSubscribed) {
      setShowPaywall(true);
    }
    
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `navyky_${user.id}_${today}`;
    localStorage.setItem(storageKey, JSON.stringify(newHabits));
    setHabits(newHabits);
  };

  const toggleHabit = (i: number) => {
    const newHabits = [...habits];
    newHabits[i] = { ...newHabits[i], done: !newHabits[i].done };
    saveHabits(newHabits);
  };

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Nordic Header */}
      <div className="p-4" style={glassCard}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/domov')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <Check className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[22px] font-medium leading-tight" style={{ color: '#2E2218', fontFamily: '"Bodoni Moda", Georgia, serif' }}>Návyky</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Buduj zdravé návyky každý deň
          </p>
        </div>
      </div>

      {/* Streak */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 flex items-center gap-3 hover:shadow-md transition-all">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="text-sm font-medium" style={{ color: '#2E2218' }}>12 dní v rade</p>
          <p className="text-xs" style={{ color: '#6B4C3B' }}>Tvoja najdlhšia séria!</p>
        </div>
      </div>

      {/* Weekly Dots */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex justify-between">
          {DAYS.map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <span className="text-xs" style={{ color: '#6B4C3B' }}>{d}</span>
              <div
                className={`w-6 h-6 rounded-full ${
                  weekDots[i] ? 'bg-[#7A9E78]' : 'border-2 border-white/35'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Habit Items */}
      <div className="space-y-3">
        {habits.map((h, i) => (
          <div key={h.name} className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 flex items-center gap-3 hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(184, 134, 74, 0.14)' }}>
              <h.icon className="w-4 h-4" style={{ color: '#B8864A' }} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#2E2218' }}>{h.name}</p>
              <p className="text-xs" style={{ color: '#6B4C3B' }}>{h.progress}</p>
            </div>
            <button
              onClick={() => toggleHabit(i)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                h.done ? 'bg-[#7A9E78] text-white' : 'border-2 border-white/35 hover:border-[#7A9E78]'
              }`}
            >
              {h.done && <Check className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Water Tracker */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
            <GlassWater className="w-4 h-4" style={{ color: '#7A9E78' }} strokeWidth={1.5} />
          </div>
          <h2 className="text-sm font-medium" style={{ color: '#2E2218' }}>Pitný režim</h2>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                i < 6 ? 'bg-[#7A9E78]/10 border-2 border-[#7A9E78]' : 'border-2 border-white/35'
              }`}
            >
              {i < 6 && <GlassWater className="w-3.5 h-3.5" style={{ color: '#7A9E78' }} strokeWidth={1.5} />}
            </div>
          ))}
        </div>
      </div>

      {/* Non-subscriber daily reset warning */}
      {!isSubscribed && (
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
              <span style={{ color: '#B8864A' }} className="text-sm">⏰</span>
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: '#2E2218' }}>Bezplatná verzia</p>
              <p className="text-xs" style={{ color: '#6B4C3B' }}>Návyky sa resetujú každý deň. Pre trvalé uloženie si aktivuj predplatné.</p>
            </div>
          </div>
        </div>
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg max-w-sm w-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
                <span className="text-2xl">💾</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#2E2218' }}>Uložiť návyky natrvalo?</h3>
                <p className="text-sm mb-4" style={{ color: '#6B4C3B' }}>
                  Bez predplatného sa tvoje návyky resetujú každý deň. Aktiváciou predplatného si zachováš pokrok a históriu.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaywall(false)}
                  className="flex-1 py-3 rounded-xl bg-white/25 font-medium text-sm hover:bg-white/30 transition-all"
                  style={{ color: '#6B4C3B' }}
                >
                  Zatiaľ nie
                </button>
                <button
                  onClick={() => {
                    setShowPaywall(false);
                    // Navigate to subscription page
                    window.location.href = '/subscribe';
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#B8864A] text-white font-medium text-sm hover:bg-[#A67B42] transition-all"
                >
                  Aktivovať
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Habit */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <button className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-xl border-2 border-dashed border-white/35 hover:border-[#7A9E78] transition-all" style={{ color: '#6B4C3B' }}>
          <Plus className="w-4 h-4" /> Pridať návyk
        </button>
      </div>
    </div>
  );
}
