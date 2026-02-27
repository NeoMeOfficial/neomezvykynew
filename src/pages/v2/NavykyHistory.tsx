import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import EmptyStateHabits from '../../components/v2/EmptyStateHabits';

interface Habit {
  id?: string;
  name?: string;
  label?: string;
  icon?: string;
  completedDates?: string[];
  history?: Record<string, boolean>;
}

export default function NavykyHistory() {
  const navigate = useNavigate();

  const habits = useMemo((): Habit[] => {
    try {
      const raw = localStorage.getItem('neome-habits');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/kniznica')} className="p-1">
          <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-semibold text-[#2E2218]">Návyky</h1>
      </div>

      {habits.length === 0 ? (
        <EmptyStateHabits onCreateHabit={() => console.log('Creating habit...')} />
      ) : (
        habits.map((habit, idx) => {
          const completed = getCompletedDays(habit);
          const streak = calcStreak(completed);
          const last30 = getLast30Days();

          return (
            <GlassCard key={habit.id || idx}>
              <div className="flex items-center gap-2 mb-3">
                {habit.icon && <span className="text-lg">{habit.icon}</span>}
                <p className="text-[15px] font-semibold text-[#2E2218]">{habit.name || habit.label || `Návyk ${idx + 1}`}</p>
                {streak > 0 && (
                  <span className="ml-auto text-[12px] font-medium text-[#B8864A]">🔥 {streak} dní</span>
                )}
              </div>
              {/* Heatmap grid - last 30 days */}
              <div className="grid grid-cols-10 gap-1">
                {last30.map(date => {
                  const done = completed.has(date);
                  return (
                    <div
                      key={date}
                      title={date}
                      className="aspect-square rounded-sm"
                      style={{
                        background: done ? '#B8864A' : '#F0EBE6',
                        opacity: done ? 1 : 0.5,
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-[12px] text-[#888] mt-2">
                Posledných 30 dní • {completed.size} splnených
              </p>
            </GlassCard>
          );
        })
      )}
    </div>
  );
}

function getCompletedDays(habit: Habit): Set<string> {
  if (habit.completedDates) return new Set(habit.completedDates);
  if (habit.history) return new Set(Object.entries(habit.history).filter(([, v]) => v).map(([k]) => k));
  return new Set();
}

function calcStreak(completed: Set<string>): number {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (completed.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

function getLast30Days(): string[] {
  const days: string[] = [];
  const d = new Date();
  for (let i = 29; i >= 0; i--) {
    const dd = new Date(d);
    dd.setDate(dd.getDate() - i);
    days.push(dd.toISOString().slice(0, 10));
  }
  return days;
}
