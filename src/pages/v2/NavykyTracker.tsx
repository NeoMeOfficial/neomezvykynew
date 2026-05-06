import { useState, useEffect } from 'react';
import { Droplets, Moon, BookOpen, Dumbbell, Apple, Plus, Check, GlassWater, Flame } from 'lucide-react';
import { useAchievements } from '../../hooks/useAchievements';
import { usePointsLedger } from '../../hooks/usePointsLedger';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SectionHeader } from '@/components/ui/section-header';

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

interface HabitData {
  icon: React.ElementType;
  name: string;
  progress: string;
  done: boolean;
}

const defaultHabitsData: HabitData[] = [
  { icon: Droplets,  name: 'Piť 8 pohárov vody', progress: '6/8',    done: false },
  { icon: Dumbbell,  name: 'Cvičenie',            progress: '1/1',    done: true  },
  { icon: Moon,      name: 'Spánok 8h',           progress: '7.5h',   done: true  },
  { icon: BookOpen,  name: 'Čítanie 20 min',      progress: '20/20',  done: true  },
  { icon: Apple,     name: '5 porcií ovocia',     progress: '3/5',    done: false },
];

export default function NavykyTracker() {
  const { user } = useAuthContext();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  const { addActivity } = useAchievements();
  const { addEntry } = usePointsLedger();

  const [habits, setHabits] = useState<HabitData[]>([]);
  const [weekDots, setWeekDots] = useState([true, true, true, false, false, false, false]);
  const [waterCount, setWaterCount] = useState(6);

  useEffect(() => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const savedHabits = localStorage.getItem(`navyky_${user.id}_${today}`);
    const savedDots = localStorage.getItem(`navyky_week_${user.id}`);
    setHabits(savedHabits ? JSON.parse(savedHabits) : defaultHabitsData);
    if (savedDots) setWeekDots(JSON.parse(savedDots));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || isPremium) return;
    const today = new Date().toISOString().split('T')[0];
    const lastResetKey = `navyky_last_reset_${user.id}`;
    if (localStorage.getItem(lastResetKey) !== today) {
      setHabits(defaultHabitsData);
      localStorage.setItem(lastResetKey, today);
      localStorage.setItem(`navyky_${user.id}_${today}`, JSON.stringify(defaultHabitsData));
    }
  }, [user?.id, isPremium]);

  const saveHabits = (next: HabitData[]) => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`navyky_${user.id}_${today}`, JSON.stringify(next));
    setHabits(next);
  };

  const toggleHabit = (i: number) => {
    const next = [...habits];
    const wasUndone = !next[i].done;
    next[i] = { ...next[i], done: !next[i].done };
    saveHabits(next);
    // Only award points when checking in (not when unchecking)
    if (wasUndone) {
      const today = new Date().toISOString().slice(0, 10);
      addEntry('habit_checkin', 3, `habit_${i}_${today}`, 'habit');
      addActivity('habit_checkin');
    }
  };

  const [editMode, setEditMode] = useState(false);
  const deleteHabit = (i: number) => {
    const next = habits.filter((_, idx) => idx !== i);
    saveHabits(next);
  };

  const streak = weekDots.filter(Boolean).length;
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Návyky" backHref="/domov-new" right={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(v => !v)}
            className={`h-9 px-3 rounded-full border text-xs font-medium transition-colors ${editMode ? 'bg-ink text-cream border-ink' : 'bg-white border-ink/[0.08] text-ink/60'}`}
          >
            {editMode ? 'Hotovo' : 'Upraviť'}
          </button>
          <button
            onClick={() => navigate('/navyky/new')}
            className="h-9 w-9 rounded-full bg-white border border-ink/[0.08] flex items-center justify-center"
          >
            <Plus className="size-4 text-ink/60" />
          </button>
        </div>
      } />

      <div className="px-5 pt-2 flex flex-col gap-4">
        {/* Streak + week */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-terra/10 flex items-center justify-center flex-shrink-0">
              <Flame className="size-5 text-terra" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-h1 text-ink leading-none">{streak}</span>
                <span className="font-sans text-sm text-ink/56">dní v rade</span>
              </div>
              <Eyebrow tone="muted" className="mt-0.5">Tento týždeň</Eyebrow>
            </div>
          </div>

          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className={`font-sans text-[10px] uppercase tracking-[0.12em] ${i === todayIdx ? 'text-ink' : 'text-ink/40'}`}>{d}</span>
                <div className={`h-6 w-6 rounded-full ${weekDots[i] ? 'bg-terra' : 'border border-ink/[0.12] bg-cream-200'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Habits */}
        <SectionHeader eyebrow="Dnešné návyky" className="mt-1" />

        <div className="flex flex-col gap-2">
          {habits.map((h, i) => {
            const Icon = h.icon;
            return (
              <div key={h.name} className="flex items-center gap-2">
                {editMode && (
                  <button
                    onClick={() => deleteHabit(i)}
                    className="h-9 w-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                    aria-label="Vymazať"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E05A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => !editMode && toggleHabit(i)}
                  className="flex-1 text-left rounded-card p-4 bg-white border border-ink/[0.08] shadow-nm-sm flex items-center gap-3 transition-all active:scale-[0.99]"
                  style={{ cursor: editMode ? 'default' : 'pointer' }}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${h.done ? 'bg-pillar-strava/15' : 'bg-cream-200'}`}>
                    <Icon className={`size-4 ${h.done ? 'text-pillar-strava' : 'text-ink/40'}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-sans text-sm font-medium ${h.done ? 'line-through text-ink/40' : 'text-ink'}`}>{h.name}</div>
                    <BodyText size="sm" tone="muted">{h.progress}</BodyText>
                  </div>
                  {!editMode && (
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${h.done ? 'bg-pillar-strava' : 'border border-ink/[0.15]'}`}>
                      {h.done && <Check className="size-3.5 text-white" strokeWidth={2.5} />}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Water tracker */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-pillar-mysel/10 flex items-center justify-center flex-shrink-0">
              <GlassWater className="size-4 text-pillar-mysel" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="font-sans text-sm font-medium text-ink">Pitný režim</div>
              <Eyebrow tone="muted">{waterCount} / 8 pohárov</Eyebrow>
            </div>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                onClick={() => setWaterCount(i < waterCount ? i : i + 1)}
                className={`flex-1 h-8 rounded-lg flex items-center justify-center transition-all ${
                  i < waterCount ? 'bg-pillar-mysel/20 border border-pillar-mysel/30' : 'bg-cream-200 border border-ink/[0.06]'
                }`}
              >
                <GlassWater className={`size-3 ${i < waterCount ? 'text-pillar-mysel' : 'text-ink/20'}`} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Free tier note */}
        {!isPremium && (
          <button
            onClick={() => navigate('/profil/predplatne')}
            className="rounded-card bg-gold/[0.08] border border-gold/20 p-4 flex items-center gap-3 text-left transition-all active:scale-[0.99]"
          >
            <div className="h-8 w-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
              <span className="font-sans text-sm font-bold text-gold">+</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-sm font-medium text-ink">Bezplatná verzia</div>
              <BodyText size="sm" tone="muted">Návyky sa resetujú každý deň. Plus zachová celú históriu.</BodyText>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
