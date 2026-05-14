import { useState } from 'react';
import { Plus, Check, GlassWater, Flame, Sparkles } from 'lucide-react';
import { useAchievements } from '../../hooks/useAchievements';
import { usePointsLedger } from '../../hooks/usePointsLedger';
import { useNavigate } from 'react-router-dom';
import { useSupabaseHabits } from '../../hooks/useSupabaseHabits';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SectionHeader } from '@/components/ui/section-header';

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

/**
 * NavykyTracker — daily habits dashboard at /navyky.
 *
 * Reads from useSupabaseHabits (real Supabase: `habits` + `habit_completions`
 * tables). Completions and streaks come from the server so they sync across
 * devices and survive sign-out / sign-in.
 *
 * Empty state: a single suggestion card ("Piť 8 pohárov vody") that links
 * to the /navyky/new wizard. The suggestion disappears as soon as the user
 * adds any habit of their own.
 */
export default function NavykyTracker() {
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  const { habits, loading, toggleHabitCompletion, removeHabit } = useSupabaseHabits();
  const { addActivity } = useAchievements();
  const { addEntry } = usePointsLedger();
  const [editMode, setEditMode] = useState(false);
  const [waterCount, setWaterCount] = useState(6);

  const today = new Date().toISOString().split('T')[0];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  // Build last-7-days dots: a day is "lit" if any habit has at least one
  // completion on that date. Falls back to empty array while loading.
  const weekDots = (() => {
    const dots: boolean[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const anyDone = habits.some((h) => (h.completions?.[key] ?? 0) > 0);
      dots.push(anyDone);
    }
    return dots;
  })();
  const streak = weekDots.filter(Boolean).length;

  const handleToggle = async (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;
    const wasUndone = (habit.completions?.[today] ?? 0) === 0;
    const ok = await toggleHabitCompletion(habitId);
    // Only award points on the check-in transition, not the un-check.
    if (ok && wasUndone) {
      addEntry('habit_checkin', 3, `habit_${habitId}_${today}`, 'habit');
      addActivity('habit_checkin');
    }
  };

  const handleDelete = async (habitId: string) => {
    await removeHabit(habitId);
  };

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Návyky" backHref="/domov-new" right={
        <div className="flex items-center gap-2">
          {habits.length > 0 && (
            <button
              onClick={() => setEditMode(v => !v)}
              className={`h-9 px-3 rounded-full border text-xs font-medium transition-colors ${editMode ? 'bg-ink text-cream border-ink' : 'bg-white border-ink/[0.08] text-ink/60'}`}
            >
              {editMode ? 'Hotovo' : 'Upraviť'}
            </button>
          )}
          <button
            onClick={() => navigate('/navyky/new')}
            className="h-9 w-9 rounded-full bg-white border border-ink/[0.08] flex items-center justify-center"
            aria-label="Pridať návyk"
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

        <SectionHeader eyebrow="Dnešné návyky" className="mt-1" />

        {/* Habit list — either real habits, or a single suggestion */}
        <div className="flex flex-col gap-2">
          {loading && (
            <div className="rounded-card bg-white border border-ink/[0.08] p-4">
              <BodyText size="sm" tone="muted">Načítavam…</BodyText>
            </div>
          )}

          {!loading && habits.length === 0 && (
            <button
              onClick={() => navigate('/navyky/new')}
              className="text-left rounded-card p-4 bg-white border border-dashed border-ink/[0.18] flex items-center gap-3 transition-all active:scale-[0.99]"
            >
              <div className="h-10 w-10 rounded-xl bg-pillar-mysel/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="size-4 text-pillar-mysel" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-sm font-medium text-ink">Piť 8 pohárov vody</div>
                <BodyText size="sm" tone="muted">Pridaj ako svoj prvý návyk →</BodyText>
              </div>
            </button>
          )}

          {!loading && habits.map((h) => {
            const todayCount = h.completions?.[today] ?? 0;
            const done = todayCount >= h.targetPerDay;
            return (
              <div key={h.id} className="flex items-center gap-2">
                {editMode && (
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="h-9 w-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                    aria-label="Vymazať"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E05A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => !editMode && handleToggle(h.id)}
                  className="flex-1 text-left rounded-card p-4 bg-white border border-ink/[0.08] shadow-nm-sm flex items-center gap-3 transition-all active:scale-[0.99]"
                  style={{ cursor: editMode ? 'default' : 'pointer' }}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? 'bg-pillar-strava/15' : 'bg-cream-200'}`}>
                    <Sparkles className={`size-4 ${done ? 'text-pillar-strava' : 'text-ink/40'}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-sans text-sm font-medium ${done ? 'line-through text-ink/40' : 'text-ink'}`}>{h.name}</div>
                    <BodyText size="sm" tone="muted">{todayCount}/{h.targetPerDay} {h.unit}</BodyText>
                  </div>
                  {!editMode && (
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-pillar-strava' : 'border border-ink/[0.15]'}`}>
                      {done && <Check className="size-3.5 text-white" strokeWidth={2.5} />}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Water tracker — separate quick widget, not a Supabase habit */}
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
              <BodyText size="sm" tone="muted">Návyky sa ukladajú a synchronizujú medzi zariadeniami.</BodyText>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
