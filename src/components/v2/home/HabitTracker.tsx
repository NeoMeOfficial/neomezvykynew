import { colors, innerGlass, sectionLabel as sectionLabelStyle, iconContainer, primaryButton } from '../../../theme/warmDusk';
import { useState, useRef, useCallback } from 'react';
import { Plus, Flame, Trash2, Check, Target, Pencil, CheckSquare } from 'lucide-react';
import GlassCard from '../GlassCard';
import { usePaywall } from '../../../hooks/usePaywall';
import { useSupabaseHabits } from '../../../hooks/useSupabaseHabits';
import { DataSaveWarning } from '../paywall/DataSaveWarning';

/* ── Section Header (matches TodayOverview style) ──────────── */
function SectionHeader({ icon: Icon, label, color }: { icon: typeof CheckSquare; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={iconContainer(color)}>
        <Icon size={16} style={{ color }} strokeWidth={2} />
      </div>
      <h3 className="text-[14px] font-semibold" style={{ color: colors.textPrimary }}>{label}</h3>
    </div>
  );
}

/* ── Types ──────────────────────────────────── */
interface Habit {
  id: string;
  name: string;
  durationDays: number;
  unit: string;
  targetPerDay: number;
  startDate: string; // ISO
  completions: Record<string, number>; // date -> count completed
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysSinceStart(habit: Habit): number {
  const start = new Date(habit.startDate + 'T00:00:00');
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
}

function getStreak(habit: Habit): number {
  let s = 0;
  const cur = new Date();
  for (let i = 0; i < habit.durationDays; i++) {
    const key = cur.toISOString().slice(0, 10);
    if ((habit.completions[key] || 0) >= habit.targetPerDay) {
      s++;
    } else if (i > 0) {
      break;
    } else {
      // today not done yet, check from yesterday
      cur.setDate(cur.getDate() - 1);
      continue;
    }
    cur.setDate(cur.getDate() - 1);
  }
  return s;
}

type NudgeType = 'none' | 'missed-one' | 'missed-many';

function getNudge(habit: Habit): NudgeType {
  const today = todayStr();
  const todayDone = (habit.completions[today] || 0) >= habit.targetPerDay;
  if (todayDone) return 'none';

  const d1 = new Date(); d1.setDate(d1.getDate() - 1);
  const yesterday = d1.toISOString().slice(0, 10);
  const yesterdayDone = (habit.completions[yesterday] || 0) >= habit.targetPerDay;
  if (!yesterdayDone) {
    const d2 = new Date(); d2.setDate(d2.getDate() - 2);
    const twoDaysAgo = d2.toISOString().slice(0, 10);
    const twoDaysDone = (habit.completions[twoDaysAgo] || 0) >= habit.targetPerDay;
    if (!twoDaysDone) return 'missed-many';
    return 'missed-one';
  }
  return 'none';
}

/* Helper: is this a time-based or single-target habit? */
function isSimpleCheckbox(habit: Habit): boolean {
  if (habit.targetPerDay === 1) return true;
  const timeUnits = ['minúty', 'minút', 'min', 'hodín', 'hodiny'];
  return timeUnits.some((u) => habit.unit.toLowerCase().includes(u));
}

/* ── Empty State ────────────────────────────── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <GlassCard className="!p-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: `${colors.accent}14` }}>
          <Target className="w-7 h-7" style={{ color: colors.accent }} strokeWidth={1.5} />
        </div>
        <h3 className="text-[14px] font-semibold mb-1" style={{ color: colors.textPrimary }}>Vybuduj si zdravé návyky krok za krokom</h3>
        <button
          onClick={onAdd}
          className="px-6 py-3 rounded-2xl text-white text-sm font-medium flex items-center gap-2 active:scale-95 transition-transform"
          style={{ background: `linear-gradient(135deg, ${colors.telo}, #4A3428)` }}
        >
          <Plus className="w-4 h-4" /> Pridať návyk
        </button>
      </div>
    </GlassCard>
  );
}

/* ── Habit Form (shared for Add & Edit) ─────── */
function HabitForm({
  initial,
  onSave,
  onCancel,
  title,
  saveLabel,
}: {
  initial?: { name: string; durationDays: number; unit: string; targetPerDay: number };
  onSave: (data: { name: string; durationDays: number; unit: string; targetPerDay: number }) => void;
  onCancel: () => void;
  title: string;
  saveLabel: string;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [days, setDays] = useState(initial?.durationDays || 30);
  const [unit, setUnit] = useState(initial?.unit || 'krát');
  const [target, setTarget] = useState(initial?.targetPerDay || 1);

  const UNITS = ['krát', 'minúty', 'pohárov', 'stránok'];

  return (
    <GlassCard className="!p-4">
      <h3 className="text-[15px] font-semibold text-[#2E2218] mb-3">{title}</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-[#A0907E] font-medium mb-1 block">Názov</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="napr. Ranná joga"
            className="w-full bg-white/30 rounded-xl px-3 py-2.5 text-sm text-[#2E2218] placeholder-[#A0907E] outline-none border border-white/40 focus:border-[#B8864A]/50"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-[#A0907E] font-medium mb-1 block">Trvanie (dní)</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-white/30 rounded-xl px-3 py-2.5 text-sm text-[#2E2218] outline-none border border-white/40 focus:border-[#B8864A]/50"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-[#A0907E] font-medium mb-1 block">Cieľ za deň</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-white/30 rounded-xl px-3 py-2.5 text-sm text-[#2E2218] outline-none border border-white/40 focus:border-[#B8864A]/50"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-[#A0907E] font-medium mb-1 block">Jednotka</label>
          <div className="flex gap-2 flex-wrap">
            {UNITS.map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  unit === u
                    ? 'bg-[#6B4C3B] text-white'
                    : 'bg-white/30 text-[#8B7560] border border-white/40'
                }`}
              >
                {u}
              </button>
            ))}
            <input
              value={UNITS.includes(unit) ? '' : unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="vlastná..."
              className="px-3 py-1.5 rounded-full text-xs bg-white/30 text-[#2E2218] placeholder-[#A0907E] outline-none border border-white/40 w-24 focus:border-[#B8864A]/50"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              if (!name.trim()) return;
              onSave({ name: name.trim(), durationDays: days, unit, targetPerDay: target });
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#6B4C3B] text-white text-sm font-medium active:scale-[0.98] transition-transform"
          >
            {saveLabel}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-white/30 text-sm text-[#8B7560] font-medium active:scale-[0.98] transition-transform"
          >
            Zrušiť
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

/* ── Habit Card ─────────────────────────────── */
function HabitCard({
  habit,
  onToggleComplete,
  onRemove,
  onEdit,
}: {
  habit: Habit;
  onToggleComplete: () => void;
  onRemove: () => void;
  onEdit: (data: { name: string; durationDays: number; unit: string; targetPerDay: number }) => void;
}) {
  const today = todayStr();
  const todayCount = habit.completions[today] || 0;
  const isComplete = todayCount >= habit.targetPerDay;
  const currentDayNum = daysSinceStart(habit);
  const streak = getStreak(habit);
  const nudge = getNudge(habit);
  const progress = Math.min(currentDayNum / habit.durationDays, 1) * 100;
  const [justCompleted, setJustCompleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const simple = isSimpleCheckbox(habit);

  // Remove hold state
  const [showDeleteHint, setShowDeleteHint] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const holdStartRef = useRef<number>(0);
  const removedRef = useRef(false);

  const HOLD_DURATION = 5000;

  const holdMessages = [
    { at: 0, text: 'Si si istá?' },
    { at: 0.3, text: 'Každý návyk ukazuje tvoju silu...' },
    { at: 0.6, text: '...a každý deň, keď si vydržala, má hodnotu' },
    { at: 0.8, text: 'Púšťam...' },
  ];

  const currentHoldMessage = holdMessages.filter((m) => m.at <= holdProgress).pop()?.text || '';

  const startHold = useCallback(() => {
    removedRef.current = false;
    setIsHolding(true);
    holdStartRef.current = Date.now();
    const tick = () => {
      if (removedRef.current) return;
      const elapsed = Date.now() - holdStartRef.current;
      const p = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(p);
      if (p >= 1) {
        removedRef.current = true;
        setIsHolding(false);
        setHoldProgress(0);
        onRemove();
      } else {
        holdTimerRef.current = requestAnimationFrame(tick);
      }
    };
    holdTimerRef.current = requestAnimationFrame(tick);
  }, [onRemove]);

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) cancelAnimationFrame(holdTimerRef.current);
    holdTimerRef.current = null;
    if (!removedRef.current) {
      setIsHolding(false);
      setHoldProgress(0);
    }
  }, []);

  const handleComplete = () => {
    onToggleComplete();
    if (!isComplete) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
  };

  if (editing) {
    return (
      <HabitForm
        initial={{ name: habit.name, durationDays: habit.durationDays, unit: habit.unit, targetPerDay: habit.targetPerDay }}
        onSave={(data) => { onEdit(data); setEditing(false); }}
        onCancel={() => setEditing(false)}
        title="Upraviť návyk"
        saveLabel="Uložiť"
      />
    );
  }

  return (
    <GlassCard className={`!p-4 transition-all duration-300 ${justCompleted ? 'scale-[1.02]' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Complete button */}
        <button
          onClick={handleComplete}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 active:scale-90 ${
            isComplete
              ? 'bg-[#6B4C3B] border-[#6B4C3B]'
              : 'border-[#D0BCA8] bg-transparent'
          } ${justCompleted ? 'animate-bounce' : ''}`}
        >
          {isComplete && <Check className="w-5 h-5 text-white" strokeWidth={3} />}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-medium ${isComplete ? 'text-[#A0907E] line-through' : 'text-[#2E2218]'}`}>
              {habit.name}
            </p>
            {streak > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs text-[#B8864A] font-medium">
                <Flame className="w-3 h-3" /> {streak}
              </span>
            )}
          </div>
          <p className="text-xs text-[#A0907E] mt-0.5">
            Deň {Math.min(currentDayNum, habit.durationDays)}/{habit.durationDays}
            {!simple && habit.targetPerDay > 1 && ` · ${todayCount}/${habit.targetPerDay} ${habit.unit}`}
          </p>

          {/* Pill counters for quantity habits with target > 1 */}
          {!simple && habit.targetPerDay > 1 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {Array.from({ length: habit.targetPerDay }, (_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                    i < todayCount
                      ? 'bg-[#6B4C3B] text-white'
                      : 'bg-black/5 text-[#A0907E]'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}

          {/* Nudge */}
          {nudge === 'missed-one' && (
            <p className="text-xs text-[#B8864A] mt-1 font-medium">
              Včera si vynechala — dnes je tvoj deň! Nevzdávaj sa 💪
            </p>
          )}
          {nudge === 'missed-many' && (
            <p className="text-xs text-[#C27A6E] mt-1 font-medium">
              Vráť sa k svojmu návyku — každý nový začiatok sa počíta 🌟
            </p>
          )}

          {/* Progress bar */}
          <div className="mt-2 h-1.5 rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#6B4C3B] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={() => setEditing(true)}
          className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors shrink-0"
        >
          <Pencil className="w-3 h-3 text-[#A0907E]" />
        </button>

        {/* Remove — click shows hint, hold deletes */}
        <div className="relative shrink-0">
          <button
            onClick={() => { if (!isHolding) setShowDeleteHint(true); }}
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={() => { cancelHold(); }}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <Trash2 className="w-3 h-3 text-[#A0907E]" />
          </button>
        </div>
      </div>

      {/* Delete hint (on click) */}
      {showDeleteHint && !isHolding && (
        <div className="mt-3 p-3 rounded-xl bg-[#B8864A]/10 border border-[#B8864A]/20">
          <p className="text-xs text-[#B8864A] font-medium text-center">
            Podrž tlačidlo 🗑️ pre vymazanie návyku
          </p>
        </div>
      )}

      {/* Hold overlay — encouraging messages */}
      {isHolding && (
        <div className="mt-3 p-3 rounded-xl bg-[#C27A6E]/10 border border-[#C27A6E]/30">
          <div className="h-1.5 rounded-full bg-black/5 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-[#C27A6E] transition-none"
              style={{ width: `${holdProgress * 100}%` }}
            />
          </div>
          <p className="text-xs text-[#C27A6E] font-medium text-center">{currentHoldMessage}</p>
        </div>
      )}
    </GlassCard>
  );
}

/* ── Main Component ─────────────────────────── */
export default function HabitTracker({ 
  hideHeader = false, 
  hideCTA = false, 
  hideWarning = false, 
  renderInCards = false 
}: { 
  hideHeader?: boolean;
  hideCTA?: boolean;
  hideWarning?: boolean;
  renderInCards?: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const { shouldShowDataSaveWarning, showDataSavePaywall } = usePaywall();
  const { habits, loading, addHabit: dbAddHabit, editHabit: dbEditHabit, toggleHabitCompletion, removeHabit: dbRemoveHabit } = useSupabaseHabits();

  const activeHabits = habits;
  const today = todayStr();
  const completed = activeHabits.filter((h) => (h.completions[today] || 0) >= h.targetPerDay).length;
  const total = activeHabits.length;
  const overallPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const addHabit = async (data: { name: string; durationDays: number; unit: string; targetPerDay: number }) => {
    const success = await dbAddHabit(data);
    if (success) {
      setShowForm(false);
    }
  };

  const editHabit = async (id: string, data: { name: string; durationDays: number; unit: string; targetPerDay: number }) => {
    await dbEditHabit(id, data);
  };

  const toggleComplete = async (id: string) => {
    await toggleHabitCompletion(id);
  };

  const removeHabit = async (id: string) => {
    await dbRemoveHabit(id);
  };

  const allDone = total > 0 && completed === total;

  // Show loading state while fetching habits
  if (loading) {
    return (
      <GlassCard className="!p-5">
        <SectionHeader icon={CheckSquare} label="Návyky" color={colors.accent} />
        <div className="flex justify-center py-8">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: colors.accent, animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  if (total === 0 && !showForm) {
    // For renderInCards mode, don't show anything when empty (handled by parent)
    if (renderInCards) {
      return null;
    }

    return (
      <GlassCard className="!p-5">
        {!hideHeader && <SectionHeader icon={CheckSquare} label="Návyky" color={colors.accent} />}
        <EmptyState onAdd={() => setShowForm(true)} />
        {showForm && <div className="mt-3"><HabitForm onSave={addHabit} onCancel={() => setShowForm(false)} title="Nový návyk" saveLabel="Uložiť" /></div>}
        {shouldShowDataSaveWarning && !hideWarning && (
          <div className="mt-3">
            <DataSaveWarning onUpgrade={showDataSavePaywall} compact />
          </div>
        )}
      </GlassCard>
    );
  }

  // If renderInCards is true, render each habit in its own white card
  if (renderInCards) {
    if (total === 0) {
      return null; // Don't show anything if no habits when renderInCards is true
    }

    return (
      <div className="space-y-3">
        {/* Add form in its own card if needed */}
        {showForm && (
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <HabitForm onSave={addHabit} onCancel={() => setShowForm(false)} title="Nový návyk" saveLabel="Uložiť" />
          </div>
        )}

        {/* Data save warning only when interacting */}
        {shouldShowDataSaveWarning && !hideWarning && showForm && (
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <DataSaveWarning onUpgrade={showDataSavePaywall} compact />
          </div>
        )}

        {/* Each habit in its own white card */}
        {habits.map((h) => (
          <div key={h.id} className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <HabitCard
              habit={h}
              onToggleComplete={() => toggleComplete(h.id)}
              onRemove={() => removeHabit(h.id)}
              onEdit={(data) => editHabit(h.id, data)}
            />
          </div>
        ))}

        {/* Celebration in its own card */}
        {allDone && total > 0 && (
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 text-center">
            <p className="text-[13px] font-semibold" style={{ color: colors.strava }}>
              Všetky návyky splnené! 🎉
            </p>
          </div>
        )}
      </div>
    );
  }

  // Original GlassCard layout for other uses
  return (
    <GlassCard className="!p-5" style={allDone ? { opacity: 0.85 } : {}}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {allDone ? (
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: colors.strava, boxShadow: `0 2px 8px ${colors.strava}30` }}>
                <Check size={16} color="#fff" strokeWidth={2.5} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={iconContainer(colors.accent)}>
                <CheckSquare size={16} style={{ color: colors.accent }} strokeWidth={2} />
              </div>
            )}
            <h3 className="text-[14px] font-semibold" style={{
              color: allDone ? colors.textTertiary : colors.textPrimary,
              ...(allDone ? { textDecoration: 'line-through' } : {}),
            }}>
              Návyky
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{
              color: allDone ? colors.strava : colors.accent,
              background: allDone ? `${colors.strava}14` : `${colors.accent}14`,
            }}>
              {completed}/{total}
            </span>
          </div>
          {!hideCTA && (
            <button
              onClick={() => setShowForm(true)}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: `${colors.telo}14` }}
            >
              <Plus className="w-3.5 h-3.5" style={{ color: colors.telo }} strokeWidth={2} />
            </button>
          )}
        </div>
      )}

      {/* Overall progress bar */}
      {total > 0 && (
        <div className="mb-3">
          <div className="h-1.5 rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallPct}%`, background: allDone ? colors.strava : colors.telo }}
            />
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && <div className="mb-3"><HabitForm onSave={addHabit} onCancel={() => setShowForm(false)} title="Nový návyk" saveLabel="Uložiť" /></div>}

      {/* Data save warning for free users */}
      {shouldShowDataSaveWarning && !hideWarning && (
        <div className="mb-3">
          <DataSaveWarning onUpgrade={showDataSavePaywall} compact />
        </div>
      )}

      {/* Habit cards */}
      <div className="space-y-2">
        {habits.map((h) => (
          <HabitCard
            key={h.id}
            habit={h}
            onToggleComplete={() => toggleComplete(h.id)}
            onRemove={() => removeHabit(h.id)}
            onEdit={(data) => editHabit(h.id, data)}
          />
        ))}
      </div>

      {/* Celebration */}
      {allDone && (
        <p className="text-[13px] font-semibold text-center mt-3" style={{ color: colors.strava }}>
          Všetky návyky splnené! 🎉
        </p>
      )}

      {/* Social proof removed */}
    </GlassCard>
  );
}
