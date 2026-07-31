import { useMemo, useState } from 'react';
import { NM, ConfirmSheet } from '../../components/v2/neome';
import { useSupabaseHabits } from '../../hooks/useSupabaseHabits';
import { useSmartBack } from '../../hooks/useSmartBack';
import { useAchievements } from '../../hooks/useAchievements';
import { usePointsLedger } from '../../hooks/usePointsLedger';

/**
 * Návyky a ciele — rebuilt 2026-07-31 (Gabi).
 *
 * One screen for both entry points (home card + knižnica tile). Habit =
 * one-tap preset or custom name, plus a goal length. Goal lengths are
 * honest: 21 dní (rozbeh) / 66 dní (research average for automaticity,
 * Lally et al. 2009) / bez limitu. Green completion language matches the
 * diary; streak is real consecutive days, worded gently — no guilt.
 *
 * Deliberately absent (never worked / can't work yet): categories, icon
 * picker, per-day frequencies, timed reminders (no push), the fake water
 * widget — water is now a normal habit with target 8 poháre (~2 l).
 */

const SAVED_GREEN = '#7A9E78';
const CORAL = '#C27A6E';

const PRESETS = [
  { name: '2l vody denne', unit: 'pohárov', target: 8 },
  { name: '30-min prechádzka', unit: 'krát', target: 1 },
  { name: '5-min meditácia', unit: 'krát', target: 1 },
  { name: 'Večerný zápis do denníka', unit: 'krát', target: 1 },
  { name: 'Cvičenie / strečing', unit: 'krát', target: 1 },
] as const;

// duration_days ≥ UNLIMITED is displayed as "bez limitu".
const UNLIMITED = 365;
const DURATIONS = [
  { label: '21 dní', days: 21 },
  { label: '66 dní', days: 66 },
  { label: 'Bez limitu', days: UNLIMITED },
] as const;

const MAX_HABITS = 5;
const WEEK_LABELS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'] as const;

// The habits hook keys completions by UTC ISO dates — stay consistent.
const isoOf = (d: Date) => d.toISOString().split('T')[0];
const isoDaysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoOf(d);
};

export default function NavykyTracker() {
  const smartBack = useSmartBack('/kniznica');
  const { habits, loading, addHabit, editHabit, toggleHabitCompletion, removeHabit } = useSupabaseHabits();
  const { addActivity } = useAchievements();
  const { addEntry } = usePointsLedger();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [pickedPreset, setPickedPreset] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [pickedDays, setPickedDays] = useState<number>(66);
  const [saving, setSaving] = useState(false);

  const todayISO = isoOf(new Date());

  const dayDone = (iso: string) => habits.some((h) => (h.completions?.[iso] ?? 0) > 0);

  // Real consecutive streak. Today only counts once she's done something;
  // an untouched today doesn't break yesterday's chain.
  const streak = useMemo(() => {
    if (habits.length === 0) return 0;
    let n = 0;
    let offset = dayDone(todayISO) ? 0 : 1;
    while (dayDone(isoDaysAgo(offset + n))) n += 1;
    return n + (offset === 0 ? 0 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits, todayISO]);

  // Current calendar week Mon–Sun; future days render empty.
  const week = useMemo(() => {
    const now = new Date();
    const monOffset = (now.getDay() + 6) % 7; // Mon=0 … Sun=6
    return WEEK_LABELS.map((label, i) => {
      const d = new Date();
      d.setDate(now.getDate() - monOffset + i);
      const iso = isoOf(d);
      return { label, iso, isToday: iso === todayISO, isFuture: iso > todayISO, done: dayDone(iso) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits, todayISO]);

  const daysIn = (h: { startDate: string }) =>
    Math.max(0, Math.floor((Date.parse(todayISO) - Date.parse(h.startDate)) / 86400000)) + 1;

  const handleToggle = async (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;
    const wasZero = (habit.completions?.[todayISO] ?? 0) === 0;
    const ok = await toggleHabitCompletion(habitId);
    // Points only on the first tick of the day, never on re-taps.
    if (ok && wasZero) {
      addEntry('habit_checkin', 3, `habit_${habitId}_${todayISO}`, 'habit');
      addActivity('habit_checkin');
    }
  };

  const resetAdd = () => {
    setAdding(false);
    setPickedPreset(null);
    setCustomName('');
    setPickedDays(66);
  };

  const handleAdd = async () => {
    if (saving) return;
    const preset = PRESETS.find((p) => p.name === pickedPreset);
    const name = preset ? preset.name : customName.trim();
    if (!name) return;
    setSaving(true);
    const ok = await addHabit({
      name,
      durationDays: pickedDays,
      unit: preset?.unit ?? 'krát',
      targetPerDay: preset?.target ?? 1,
    });
    setSaving(false);
    if (ok) resetAdd();
  };

  const availablePresets = PRESETS.filter((p) => !habits.some((h) => h.name === p.name));

  const sectionHead = (text: string) => (
    <div style={{ fontFamily: NM.SERIF, fontSize: 18, color: NM.DEEP, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.005em', paddingLeft: 4 }}>
      {text}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: NM.BG, fontFamily: NM.SANS, paddingBottom: 48 }}>
      {/* Top bar */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={smartBack}
          aria-label="Späť"
          style={{ width: 36, height: 36, borderRadius: 999, background: '#FFFFFF', border: `1px solid ${NM.HAIR_2}`, display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0, flexShrink: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div style={{ fontFamily: NM.SERIF, fontSize: 20, color: NM.DEEP, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
          Návyky a ciele
        </div>
      </div>

      <div style={{ padding: '6px 22px 0', fontFamily: NM.SANS, fontSize: 12.5, color: NM.MUTED, lineHeight: 1.55 }}>
        Aby sa návyk stal prirodzenou súčasťou tvojich dní, potrebuješ v priemere 66 dní. Malé kroky, každý deň.
      </div>

      {/* Streak + week */}
      <div style={{ margin: '16px 18px 0', background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}`, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: NM.SERIF, fontSize: 30, color: NM.DEEP, lineHeight: 1 }}>{streak}</span>
          <span style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}>
            {streak === 1 ? 'deň v rade' : streak >= 2 && streak <= 4 ? 'dni v rade' : 'dní v rade'}
          </span>
        </div>
        <div style={{ marginTop: 4, fontFamily: NM.SANS, fontSize: 11.5, color: NM.TERTIARY, lineHeight: 1.4 }}>
          {streak === 0 ? 'Dnes je dobrý deň začať.' : 'Každý deň sa počíta.'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
          {week.map((d) => (
            <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: d.isToday ? NM.DEEP : NM.TERTIARY, fontWeight: d.isToday ? 600 : 400 }}>{d.label}</span>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: d.done ? SAVED_GREEN : 'transparent',
                  border: d.done ? '1px solid transparent' : `1px solid ${d.isFuture ? NM.HAIR : NM.HAIR_2}`,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {d.done && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit list */}
      <div style={{ margin: '26px 18px 0' }}>
        {sectionHead('Dnešné návyky')}

        {loading && (
          <div style={{ marginTop: 12, background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}`, padding: '16px 18px', fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}>
            Načítavam…
          </div>
        )}

        {!loading && habits.length === 0 && (
          <div style={{ marginTop: 12, fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, lineHeight: 1.55, paddingLeft: 4 }}>
            Vyber si prvý návyk nižšie — alebo si vytvor vlastný.
          </div>
        )}

        {!loading && habits.map((h) => {
          const count = h.completions?.[todayISO] ?? 0;
          const done = count >= h.targetPerDay;
          const multi = h.targetPerDay > 1;
          const unlimited = h.durationDays >= UNLIMITED;
          const dayN = Math.min(daysIn(h), h.durationDays);
          const goalReached = !unlimited && daysIn(h) > h.durationDays;
          const open = expandedId === h.id;

          const subParts: string[] = [];
          if (multi) subParts.push(`${count}/${h.targetPerDay} ${h.unit}`);
          if (goalReached) subParts.push('cieľ splnený ✓');
          else if (!unlimited) subParts.push(`deň ${dayN} z ${h.durationDays}`);

          return (
            <div key={h.id} style={{ marginTop: 10, background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                <div role="button" onClick={() => setExpandedId(open ? null : h.id)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 15.5, color: NM.DEEP, lineHeight: 1.3 }}>{h.name}</div>
                  {subParts.length > 0 && (
                    <div style={{ marginTop: 3, fontFamily: NM.SANS, fontSize: 11.5, color: goalReached ? NM.GOLD : NM.MUTED, fontWeight: goalReached ? 500 : 400 }}>
                      {subParts.join(' · ')}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleToggle(h.id)}
                  aria-label={done ? 'Hotovo' : 'Odfajkni'}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    flexShrink: 0,
                    cursor: 'pointer',
                    background: done ? SAVED_GREEN : count > 0 ? 'rgba(122,158,120,0.12)' : 'transparent',
                    border: done ? '1px solid transparent' : `1px solid ${count > 0 ? SAVED_GREEN : NM.HAIR_2}`,
                    display: 'grid',
                    placeItems: 'center',
                    padding: 0,
                  }}
                >
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : count > 0 ? (
                    <span style={{ fontFamily: NM.SANS, fontSize: 12, fontWeight: 600, color: SAVED_GREEN }}>{count}</span>
                  ) : null}
                </button>
              </div>

              {/* Goal progress — gold = time elapsed, distinct from green = done today */}
              {!unlimited && !goalReached && (
                <div style={{ height: 3, background: NM.HAIR, margin: '0 16px 12px', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, Math.round((dayN / h.durationDays) * 100))}%`, background: NM.GOLD, borderRadius: 999 }} />
                </div>
              )}

              {open && (
                <div style={{ padding: '2px 16px 14px' }}>
                  {/* Last 30 days */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
                    {Array.from({ length: 30 }, (_, i) => {
                      const iso = isoDaysAgo(29 - i);
                      const c = h.completions?.[iso] ?? 0;
                      const full = c >= h.targetPerDay;
                      return (
                        <div
                          key={iso}
                          style={{
                            aspectRatio: '1',
                            borderRadius: 5,
                            background: full ? SAVED_GREEN : c > 0 ? 'rgba(122,158,120,0.35)' : NM.HAIR,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 6, fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY }}>Posledných 30 dní</div>

                  {goalReached && (
                    <button
                      onClick={async () => {
                        await editHabit(h.id, { name: h.name, durationDays: UNLIMITED, unit: h.unit, targetPerDay: h.targetPerDay });
                      }}
                      style={{ all: 'unset', cursor: 'pointer', marginTop: 12, padding: '8px 15px', borderRadius: 999, background: NM.DEEP, color: '#fff', fontFamily: NM.SANS, fontSize: 12, fontWeight: 500, display: 'inline-block' }}
                    >
                      Pokračovať bez limitu
                    </button>
                  )}

                  <div style={{ marginTop: 12 }}>
                    <button
                      onClick={() => setConfirmDeleteId(h.id)}
                      style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: CORAL, fontWeight: 500 }}
                    >
                      Vymazať
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add habit */}
      {!loading && (
        <div style={{ margin: '14px 18px 0' }}>
          {habits.length >= MAX_HABITS ? (
            <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.TERTIARY, lineHeight: 1.5, paddingLeft: 4 }}>
              Najviac 5 návykov naraz — menej je viac.
            </div>
          ) : !adding ? (
            <button
              onClick={() => setAdding(true)}
              style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: 20, border: `1px dashed ${NM.GOLD}66`, color: NM.GOLD, fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, textAlign: 'center' }}
            >
              + Pridaj návyk
            </button>
          ) : (
            <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}`, padding: '16px 18px' }}>
              <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, fontWeight: 600, lineHeight: 1.3 }}>Vyber si návyk</div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
                {availablePresets.map((p) => {
                  const on = pickedPreset === p.name;
                  return (
                    <button
                      key={p.name}
                      onClick={() => { setPickedPreset(on ? null : p.name); setCustomName(''); }}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '8px 13px',
                        borderRadius: 999,
                        background: on ? NM.DEEP : '#fff',
                        color: on ? '#fff' : NM.DEEP,
                        border: on ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`,
                        fontFamily: NM.SANS,
                        fontSize: 12,
                        fontWeight: on ? 500 : 400,
                      }}
                    >
                      {on ? '✓ ' : ''}{p.name}
                    </button>
                  );
                })}
              </div>

              <input
                value={customName}
                onChange={(e) => { setCustomName(e.target.value); setPickedPreset(null); }}
                placeholder="…alebo vlastný návyk"
                style={{ width: '100%', marginTop: 12, padding: '12px 14px', borderRadius: 14, border: `1px solid ${NM.HAIR}`, fontFamily: NM.SERIF, fontSize: 14.5, color: NM.DEEP, background: NM.BG, outline: 'none', boxSizing: 'border-box' }}
              />

              <div style={{ marginTop: 14, fontFamily: NM.SANS, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: NM.TERTIARY, fontWeight: 500 }}>Ako dlho?</div>
              <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
                {DURATIONS.map((d) => {
                  const on = pickedDays === d.days;
                  return (
                    <button
                      key={d.days}
                      onClick={() => setPickedDays(d.days)}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '8px 13px',
                        borderRadius: 999,
                        background: on ? NM.GOLD : '#fff',
                        color: on ? '#fff' : NM.DEEP,
                        border: on ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`,
                        fontFamily: NM.SANS,
                        fontSize: 12,
                        fontWeight: on ? 500 : 400,
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: 14, marginTop: 16, alignItems: 'center' }}>
                <button
                  onClick={handleAdd}
                  disabled={saving || (!pickedPreset && !customName.trim())}
                  style={{
                    all: 'unset',
                    cursor: !saving && (pickedPreset || customName.trim()) ? 'pointer' : 'default',
                    padding: '9px 18px',
                    borderRadius: 999,
                    background: pickedPreset || customName.trim() ? NM.DEEP : NM.HAIR_2,
                    color: pickedPreset || customName.trim() ? '#fff' : NM.TERTIARY,
                    fontFamily: NM.SANS,
                    fontSize: 12.5,
                    fontWeight: 500,
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Pridávam…' : 'Pridať'}
                </button>
                <button onClick={resetAdd} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED }}>
                  Zrušiť
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmSheet
        open={!!confirmDeleteId}
        eyebrow="Návyky a ciele"
        title="Vymazať tento návyk?"
        message="Návyk zmizne zo zoznamu. Jeho doterajšie odfajknutia sa nestratia."
        confirmLabel="Áno, vymazať"
        cancelLabel="Späť"
        tone="danger"
        onConfirm={async () => {
          if (confirmDeleteId) await removeHabit(confirmDeleteId);
          setConfirmDeleteId(null);
          setExpandedId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
