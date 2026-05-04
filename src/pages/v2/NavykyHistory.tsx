import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Plus } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';

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
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="História návykov" backHref="/kniznica/navyky" />

      <div className="px-5 pt-2 pb-6 flex flex-col gap-3">
        {habits.length === 0 ? (
          <div className="mt-12 text-center px-8">
            <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <Flame className="size-7 text-gold" />
            </div>
            <SerifHeader as="h2" size="h2" className="mb-2">Žiadne návyky</SerifHeader>
            <BodyText tone="secondary" className="mb-6 max-w-xs mx-auto">
              Pridaj si prvý návyk a sleduj svoj pokrok v čase.
            </BodyText>
            <button
              onClick={() => navigate('/navyky/new')}
              className="flex items-center gap-2 px-6 py-3 bg-ink text-cream rounded-full font-sans text-sm font-medium mx-auto"
            >
              <Plus className="size-4" /> Pridať návyk
            </button>
          </div>
        ) : (
          habits.map((habit, idx) => {
            const completed = getCompletedDays(habit);
            const streak = calcStreak(completed);
            const last30 = getLast30Days();
            const name = habit.name || habit.label || `Návyk ${idx + 1}`;

            return (
              <div key={habit.id || idx} className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  {habit.icon && <span className="text-base">{habit.icon}</span>}
                  <div className="font-serif text-h3 text-ink flex-1 leading-snug">{name}</div>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 font-sans text-xs font-medium text-terra">
                      <Flame className="size-3.5" />
                      {streak} dní
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-10 gap-1 mb-2">
                  {last30.map(date => {
                    const done = completed.has(date);
                    return (
                      <div
                        key={date}
                        title={date}
                        className={`aspect-square rounded-sm ${done ? 'bg-gold' : 'bg-cream-200'}`}
                      />
                    );
                  })}
                </div>

                <Eyebrow tone="muted">Posledných 30 dní · {completed.size} splnených</Eyebrow>
              </div>
            );
          })
        )}
      </div>
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
