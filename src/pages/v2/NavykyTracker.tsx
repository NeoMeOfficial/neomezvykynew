import { useEffect, useRef, useState } from 'react';
import { NM, ConfirmSheet } from '../../components/v2/neome';
import { useSupabaseHabits } from '../../hooks/useSupabaseHabits';
import { useSmartBack } from '../../hooks/useSmartBack';
import { useAchievements } from '../../hooks/useAchievements';
import { usePointsLedger } from '../../hooks/usePointsLedger';

/**
 * Návyky a ciele — card layout (Gabi 2026-07-31).
 *
 * Diary-style white cards with full-colour serif titles. The five
 * presets sit on screen as ready-made cards with "Chcem začať dnes" —
 * activation IS the add flow. Each card owns its "Ako dlho?" choice
 * (21 recommended to start / 66 = research average, Lally 2009 /
 * vlastná) and an editable name so a preset becomes her own. Streak
 * lives per habit, not globally. No reminders/categories until the
 * infrastructure exists.
 */

const SAVED_GREEN = '#7A9E78';
const CORAL = '#C27A6E';

// Preset titles carry the colour of the pillar they nudge toward —
// same language as the diary's coloured question heads.
// Ordered in colour pairs (Gabi 2026-07-31): strava green, telo brown,
// myseľ mauve — custom habit closes the list in gold.
// No category tags on habit cards — auto-classifying user-written
// habits can't be guaranteed correct, so nothing is classified
// (Gabi 2026-07-31). Cards anchor on the dark serif name alone.
const PRESETS = [
  { name: '2l vody', unit: 'krát', target: 1 },
  { name: 'Po večeri už nezobkám', unit: 'krát', target: 1 },
  { name: '30-min prechádzka', unit: 'krát', target: 1 },
  { name: 'Cvičenie / strečing', unit: 'krát', target: 1 },
  { name: '5-min meditácia / stíšenie', unit: 'krát', target: 1 },
  { name: 'Sebareflexia a zápis do denníka', unit: 'krát', target: 1 },
] as const;

// duration_days ≥ UNLIMITED is displayed as "bez limitu".
const UNLIMITED = 365;
const MAX_HABITS = 5;

// The habits hook keys completions by UTC ISO dates — stay consistent.
const isoOf = (d: Date) => d.toISOString().split('T')[0];
const isoDaysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoOf(d);
};
// "Dnes to nevyšlo" marks — a gentle acknowledgment, stored locally
// per habit per day (no schema; it changes nothing in the data model).
const SKIPS_KEY = 'neome_habit_skips_v1';
function readSkips(): Record<string, string[]> {
  try {
    const v = JSON.parse(localStorage.getItem(SKIPS_KEY) || '{}');
    return v && typeof v === 'object' ? v : {};
  } catch { return {}; }
}
function writeSkips(v: Record<string, string[]>) {
  try { localStorage.setItem(SKIPS_KEY, JSON.stringify(v)); } catch { /* full */ }
}

// i-th day of a goal (0-based) counted from its start date.
const isoFromStart = (startISO: string, i: number) => {
  const d = new Date(`${startISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + i);
  return isoOf(d);
};

function DurationPicker({ value, custom, onPick, onCustom }: {
  value: number | 'custom';
  custom: string;
  onPick: (v: number | 'custom') => void;
  onCustom: (v: string) => void;
}) {
  // Quiet secondary controls — the card's visual order is title →
  // CTA → duration → edit link, so the chips stay small and muted.
  const chip = (on: boolean): React.CSSProperties => ({
    all: 'unset',
    cursor: 'pointer',
    padding: '6px 11px',
    borderRadius: 999,
    background: on ? NM.GOLD : 'transparent',
    color: on ? '#fff' : NM.MUTED,
    border: on ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`,
    fontFamily: NM.SANS,
    fontSize: 11.5,
    fontWeight: on ? 500 : 400,
  });
  return (
    <>
      <div style={{ marginTop: 14, fontFamily: NM.SANS, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: NM.TERTIARY, fontWeight: 500 }}>
        Ako dlho?
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => onPick(21)} style={chip(value === 21)}>21 dní</button>
        <button onClick={() => onPick(66)} style={chip(value === 66)}>66 dní</button>
        <button onClick={() => onPick('custom')} style={chip(value === 'custom')}>Vlastná</button>
        {value === 'custom' && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <input
              value={custom}
              onChange={(e) => onCustom(e.target.value.replace(/\D/g, '').slice(0, 3))}
              inputMode="numeric"
              autoFocus
              placeholder="30"
              style={{ width: 48, padding: '6px 9px', borderRadius: 999, border: `1px solid ${NM.HAIR_2}`, fontFamily: NM.SANS, fontSize: 11.5, color: NM.DEEP, background: '#fff', outline: 'none', textAlign: 'center', boxSizing: 'border-box' }}
            />
            <span style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED }}>dní</span>
          </span>
        )}
      </div>
    </>
  );
}

// Grey circle → green check: reminds her of the daily tick under the
// active-habits heading (Gabi 2026-07-31 — offer cards must NOT carry
// this; those habits aren't active yet).
function TickHint() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10 }}>
      <span style={{ width: 18, height: 18, borderRadius: 999, background: SAVED_GREEN, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <span style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED }}>Ak máš hotovo, nezabudni si návyk odtiknúť.</span>
    </div>
  );
}

// Coral X circle: explains the early-end control shown under each
// habit's check circle.
function EndHint() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6 }}>
      <span style={{ width: 18, height: 18, borderRadius: 999, border: `1px solid ${CORAL}66`, display: 'grid', placeItems: 'center', flexShrink: 0, boxSizing: 'border-box' }}>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={CORAL} strokeWidth="2.6" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </span>
      <span style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED }}>Ak dnes nevyšlo, klikni krížik — zajtra to skúsiš zas.</span>
    </div>
  );
}

// Swipe left = end the habit early (the only destructive action, so it
// hides behind a gesture + confirm instead of a visible button).
function SwipeHint() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6 }}>
      <span style={{ width: 18, height: 18, borderRadius: 999, border: `1px solid ${NM.HAIR_2}`, display: 'grid', placeItems: 'center', flexShrink: 0, boxSizing: 'border-box' }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(61,41,33,0.45)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      </span>
      <span style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED }}>Ak chceš návyk úplne ukončiť, potiahni jeho kartu doľava.</span>
    </div>
  );
}

function resolveDays(value: number | 'custom', custom: string): number | null {
  if (value !== 'custom') return value;
  const n = parseInt(custom, 10);
  return Number.isFinite(n) && n >= 1 ? Math.min(n, UNLIMITED) : null;
}

// ─── Preset card — not yet activated ─────────────────────────────────────────
function PresetCard({ preset, saving, onStart }: {
  preset: (typeof PRESETS)[number];
  saving: boolean;
  onStart: (name: string, days: number) => void;
}) {
  const [name, setName] = useState<string>(preset.name);
  const [editing, setEditing] = useState(false);
  const [dur, setDur] = useState<number | 'custom'>(21);
  const [custom, setCustom] = useState('');
  const days = resolveDays(dur, custom);

  return (
    <div style={{ marginTop: 12, background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}`, padding: '16px 18px' }}>
      {editing ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          onBlur={() => { if (!name.trim()) setName(preset.name); setEditing(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          style={{ width: '100%', padding: '10px 13px', borderRadius: 12, border: `1px solid ${NM.HAIR}`, fontFamily: NM.SERIF, fontSize: 17, fontWeight: 600, color: NM.DEEP, background: NM.BG, outline: 'none', boxSizing: 'border-box' }}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ minWidth: 0, fontFamily: NM.SERIF, fontSize: 19, color: NM.DEEP, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.005em' }}>
            {name}
          </div>
          <button
            onClick={() => setEditing(true)}
            style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, flexShrink: 0, textDecoration: 'underline', textDecorationColor: NM.HAIR_2, textUnderlineOffset: 3 }}
          >
            Uprav si ho
          </button>
        </div>
      )}

      <DurationPicker value={dur} custom={custom} onPick={setDur} onCustom={setCustom} />

      <button
        onClick={() => { if (days && name.trim()) onStart(name.trim(), days); }}
        disabled={saving || !days || !name.trim()}
        style={{
          all: 'unset',
          cursor: !saving && days && name.trim() ? 'pointer' : 'default',
          marginTop: 16,
          padding: '10px 18px',
          borderRadius: 999,
          background: days && name.trim() ? NM.DEEP : NM.HAIR_2,
          color: days && name.trim() ? '#fff' : NM.TERTIARY,
          fontFamily: NM.SANS,
          fontSize: 12.5,
          fontWeight: 500,
          display: 'inline-block',
          opacity: saving ? 0.7 : 1,
        }}
      >
        Chcem začať dnes
      </button>
    </div>
  );
}

// ─── Custom habit card ───────────────────────────────────────────────────────
function CustomCard({ saving, onStart }: { saving: boolean; onStart: (name: string, days: number) => void }) {
  const [name, setName] = useState('');
  const [dur, setDur] = useState<number | 'custom'>(21);
  const [custom, setCustom] = useState('');
  const days = resolveDays(dur, custom);

  return (
    <div style={{ marginTop: 12, background: '#fff', borderRadius: 20, border: `1px dashed ${NM.HAIR_2}`, padding: '16px 18px' }}>
      <div style={{ fontFamily: NM.SERIF, fontSize: 19, color: NM.DEEP, fontWeight: 600, lineHeight: 1.25 }}>
        Vlastný návyk
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Napíš si ho vlastnými slovami…"
        style={{ width: '100%', marginTop: 12, padding: '12px 14px', borderRadius: 14, border: `1px solid ${NM.HAIR}`, fontFamily: NM.SERIF, fontSize: 14.5, color: NM.DEEP, background: NM.BG, outline: 'none', boxSizing: 'border-box' }}
      />
      <DurationPicker value={dur} custom={custom} onPick={setDur} onCustom={setCustom} />
      <button
        onClick={() => { if (days && name.trim()) onStart(name.trim(), days); }}
        disabled={saving || !days || !name.trim()}
        style={{
          all: 'unset',
          cursor: !saving && days && name.trim() ? 'pointer' : 'default',
          marginTop: 16,
          padding: '10px 18px',
          borderRadius: 999,
          background: days && name.trim() ? NM.DEEP : NM.HAIR_2,
          color: days && name.trim() ? '#fff' : NM.TERTIARY,
          fontFamily: NM.SANS,
          fontSize: 12.5,
          fontWeight: 500,
          display: 'inline-block',
          opacity: saving ? 0.7 : 1,
        }}
      >
        Chcem začať dnes
      </button>
    </div>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function NavykyTracker() {
  const smartBack = useSmartBack('/kniznica');
  const { habits, loading, addHabit, editHabit, toggleHabitCompletion, setCompletionForDate, removeHabit } = useSupabaseHabits();
  const { addActivity } = useAchievements();
  const { addEntry } = usePointsLedger();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const activeSectionRef = useRef<HTMLDivElement | null>(null);
  const [backfillId, setBackfillId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [skips, setSkips] = useState<Record<string, string[]>>(() => readSkips());
  const [drag, setDrag] = useState<{ id: string; x: number } | null>(null);
  const touchRef = useRef<{ id: string; x: number; y: number; horiz: boolean | null } | null>(null);

  const todayISO = isoOf(new Date());

  // One-time heal: habits created before 2026-07-31 with a multi-tap
  // target (the old 8-glass water) become single-tick like everything
  // else — no need to delete and re-add (Gabi 2026-08-03).
  const healedRef = useRef(false);
  useEffect(() => {
    if (healedRef.current || loading) return;
    const legacy = habits.filter((h) => h.targetPerDay > 1);
    if (legacy.length === 0) return;
    healedRef.current = true;
    legacy.forEach((h) => {
      editHabit(h.id, { name: h.name, durationDays: h.durationDays, unit: 'krát', targetPerDay: 1 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits, loading]);

  const daysIn = (h: { startDate: string }) =>
    Math.max(0, Math.floor((Date.parse(todayISO) - Date.parse(h.startDate)) / 86400000)) + 1;

  // Days actually completed inside the goal window — the measure and the
  // progress bar mirror the green squares, not elapsed time (a fresh
  // morning shows 0 z 21, not deň 1 z 21).
  const doneDaysOf = (h: { startDate: string; durationDays: number; targetPerDay: number; completions: Record<string, number> }) => {
    let n = 0;
    const span = Math.min(h.durationDays, daysIn(h));
    for (let i = 0; i < span; i++) {
      if ((h.completions?.[isoFromStart(h.startDate, i)] ?? 0) >= h.targetPerDay) n += 1;
    }
    return n;
  };

  const handleToggle = async (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;
    const wasZero = (habit.completions?.[todayISO] ?? 0) === 0;
    const ok = await toggleHabitCompletion(habitId);
    // Points only on the first tick of the day, never on re-taps.
    if (ok && wasZero) {
      addEntry('habit_checkin', 3, `habit_${habitId}_${todayISO}`, 'habit');
      addActivity('habit_checkin');
      // A tick beats an earlier "nevyšlo" — clear today's skip mark.
      setSkips((prev) => {
        if (!prev[habitId]?.includes(todayISO)) return prev;
        const next = { ...prev, [habitId]: prev[habitId].filter((d) => d !== todayISO) };
        writeSkips(next);
        return next;
      });
    }
  };

  const toggleSkip = (habitId: string) => {
    setSkips((prev) => {
      const cur = prev[habitId] ?? [];
      const next = {
        ...prev,
        [habitId]: cur.includes(todayISO) ? cur.filter((d) => d !== todayISO) : [...cur, todayISO],
      };
      writeSkips(next);
      return next;
    });
  };

  const startHabit = (unit: string, target: number) => async (name: string, days: number) => {
    if (saving) return;
    setSaving(true);
    const ok = await addHabit({ name, durationDays: days, unit, targetPerDay: target });
    setSaving(false);
    if (!ok) return;
    // The new habit lands in the top section — scroll her there and
    // flash it green so the move is visible (otherwise the card just
    // vanishes from the offer and she taps again).
    setJustAdded(name);
    setTimeout(() => activeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    setTimeout(() => setJustAdded(null), 3000);
  };

  const availablePresets = PRESETS.filter((p) => !habits.some((h) => h.name === p.name));
  const canAdd = !loading && habits.length < MAX_HABITS;

  // Periodka-style section titles: dark serif with the key words in
  // italic gold ("Zaznač si, ako sa dnes cítiš" pattern).
  const sectionHead = (before: string, em: string) => (
    <div style={{ marginTop: 32, fontFamily: NM.SERIF, fontSize: 26, color: NM.DEEP, lineHeight: 1.15, letterSpacing: '-0.01em', paddingLeft: 4 }}>
      {before} <em style={{ fontStyle: 'italic', color: NM.GOLD }}>{em}</em>
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

      {/* Hero — same format as Myseľ ("Priestor pre seba.") */}
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 40, color: NM.DEEP, lineHeight: 1.04, letterSpacing: '-0.01em' }}>
          Malé kroky,
          <br />
          <em style={{ color: NM.GOLD, fontWeight: 400 }}>veľký rozdiel.</em>
        </div>
        <div style={{ marginTop: 14, maxWidth: 320, fontFamily: NM.SANS, fontSize: 14, color: NM.MUTED, fontWeight: 300, lineHeight: 1.55 }}>
          Stačí málo, ale <strong style={{ color: NM.DEEP, fontWeight: 500 }}>každý deň</strong>. Približne za 66 dní sa z malého kroku stane samozrejmosť — na začiatok si pokojne daj kratší cieľ, 21 dní.
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        {loading && (
          <div style={{ marginTop: 16, background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}`, padding: '16px 18px', fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}>
            Načítavam…
          </div>
        )}

        {/* Active habits */}
        {!loading && habits.length > 0 && (
          <>
            <div ref={activeSectionRef} style={{ scrollMarginTop: 'calc(env(safe-area-inset-top) + 16px)' }}>
              {sectionHead('Budujem si', 'tieto návyky')}
            </div>
            <div style={{ paddingLeft: 4 }}>
              <TickHint />
              <EndHint />
              <SwipeHint />
            </div>
            {habits.map((h) => {
              const count = h.completions?.[todayISO] ?? 0;
              const done = count >= h.targetPerDay;
              const unlimited = h.durationDays >= UNLIMITED;
              const goalWindowOver = !unlimited && daysIn(h) > h.durationDays;
              const doneDays = unlimited ? 0 : doneDaysOf(h);
              const dayN = Math.min(daysIn(h), h.durationDays);
              const goalReached = goalWindowOver;
              const open = expandedId === h.id;

              // One measure only (Gabi 2026-07-31): completed days out of
              // the goal — grows only when she ticks.
              const subParts: string[] = [];
              if (goalReached) {
                // Lally 2009: a few missed days don't derail habit formation
                // — ≥80% of the window still counts as building the habit.
                subParts.push(doneDays >= h.durationDays
                  ? 'cieľ splnený ✓'
                  : doneDays / h.durationDays >= 0.8
                  ? `cieľ zvládnutý ✓ · splnených ${doneDays} z ${h.durationDays} dní`
                  : `cieľ ukončený · splnených ${doneDays} z ${h.durationDays} dní`);
              } else if (!unlimited) {
                // Position first ("kde na ceste som"), achievement second
                // ("čo mám splnené") — two numbers, two meanings.
                subParts.push(`${dayN}. deň tvojej cesty`);
                subParts.push(`${doneDays} z ${h.durationDays} dní splnených`);
              }

              const skippedToday = !done && (skips[h.id] ?? []).includes(todayISO);
              const dragX = drag?.id === h.id ? drag.x : 0;
              return (
                <div key={h.id} style={{ marginTop: 12, position: 'relative' }}>
                  {/* Revealed by the left-swipe — ending a habit lives
                      behind a gesture + confirm, not a button. */}
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'rgba(194,122,110,0.13)', border: '1px solid rgba(194,122,110,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 20, boxSizing: 'border-box' }}>
                    <span style={{ fontFamily: NM.SANS, fontSize: 12, color: CORAL, fontWeight: 600 }}>Ukončiť návyk</span>
                  </div>
                  <div
                    onTouchStart={(e) => {
                      touchRef.current = { id: h.id, x: e.touches[0].clientX, y: e.touches[0].clientY, horiz: null };
                    }}
                    onTouchMove={(e) => {
                      const t = touchRef.current;
                      if (!t || t.id !== h.id) return;
                      const dx = e.touches[0].clientX - t.x;
                      const dy = e.touches[0].clientY - t.y;
                      if (t.horiz === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) t.horiz = Math.abs(dx) > Math.abs(dy);
                      if (t.horiz) setDrag({ id: h.id, x: Math.min(0, dx) });
                    }}
                    onTouchEnd={() => {
                      const wasOpen = drag?.id === h.id && drag.x < -70;
                      touchRef.current = null;
                      setDrag(null);
                      if (wasOpen) setConfirmDeleteId(h.id);
                    }}
                    onTouchCancel={() => { touchRef.current = null; setDrag(null); }}
                    style={{ position: 'relative', background: justAdded === h.name ? 'rgba(122,158,120,0.07)' : '#fff', borderRadius: 20, border: `1px solid ${justAdded === h.name ? SAVED_GREEN : NM.HAIR}`, overflow: 'hidden', transform: `translateX(${dragX}px)`, transition: dragX === 0 ? 'transform 0.25s ease, background 0.6s ease, border-color 0.6s ease' : 'background 0.6s ease, border-color 0.6s ease', touchAction: 'pan-y' }}>
                  {/* Corner controls: tick top-right, X bottom-right — both
                      pre-drawn grey, colouring on tap (Gabi 2026-07-31). */}
                  <button
                    onClick={() => handleToggle(h.id)}
                    aria-label={done ? 'Hotovo' : 'Odfajkni'}
                    style={{
                      position: 'absolute',
                      top: 13,
                      right: 14,
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      cursor: 'pointer',
                      background: done ? SAVED_GREEN : count > 0 ? 'rgba(122,158,120,0.12)' : 'rgba(61,41,33,0.06)',
                      border: done ? '1px solid transparent' : `1px solid ${count > 0 ? SAVED_GREEN : NM.HAIR_2}`,
                      display: 'grid',
                      placeItems: 'center',
                      padding: 0,
                      zIndex: 1,
                    }}
                  >
                    {count > 0 && !done ? (
                      <span style={{ fontFamily: NM.SANS, fontSize: 12, fontWeight: 600, color: SAVED_GREEN }}>{count}</span>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={done ? '#fff' : 'rgba(61,41,33,0.30)'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                  {/* Daily nudge (Gabi 2026-07-31): every day the circle is
                      unticked, point at it; gone once today is green. */}
                  {!done && (
                    <div style={{ position: 'absolute', top: 50, right: 10, width: 64, textAlign: 'center', fontFamily: NM.SANS, fontSize: 9.5, lineHeight: 1.35, color: NM.GOLD, fontWeight: 600, zIndex: 1, pointerEvents: 'none' }}>
                      Splnené?
                      <br />
                      Ťukni ↑
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 58px 15px 16px' }}>
                    <div role="button" onClick={() => { setExpandedId(open ? null : h.id); setBackfillId(null); }} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                      <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, fontWeight: 600, lineHeight: 1.3 }}>{h.name}</div>
                      {subParts.map((part) => (
                        <div key={part} style={{ marginTop: 3, fontFamily: NM.SANS, fontSize: 11.5, color: goalReached ? NM.GOLD : NM.MUTED, fontWeight: goalReached ? 500 : 400, lineHeight: 1.4 }}>
                          {part}
                        </div>
                      ))}

                    </div>
                  </div>

                  {/* Goal progress — green like the ticks: completed days */}
                  {!unlimited && !goalReached && (
                    <div style={{ height: 3, background: NM.HAIR, margin: '0 16px 13px', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, Math.round((doneDays / h.durationDays) * 100))}%`, background: SAVED_GREEN, borderRadius: 999 }} />
                    </div>
                  )}

                  {!open && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '0 16px 13px' }}>
                      <div
                        role="button"
                        onClick={() => { setExpandedId(h.id); setBackfillId(null); }}
                        style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.GOLD, fontWeight: 500, cursor: 'pointer' }}
                      >
                        Pozri si svoje dni ›
                      </div>
                      {!done && (
                        <button
                          onClick={() => toggleSkip(h.id)}
                          style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <span style={{ fontFamily: NM.SANS, fontSize: 10.5, color: skippedToday ? NM.MUTED : CORAL, fontWeight: 600 }}>
                            {skippedToday ? 'Zajtra to skúsiš zas ✓' : 'Dnes nevyšlo? Ťukni →'}
                          </span>
                          <span style={{ width: 20, height: 20, borderRadius: 999, background: skippedToday ? CORAL : 'rgba(61,41,33,0.06)', border: skippedToday ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`, display: 'grid', placeItems: 'center', flexShrink: 0, boxSizing: 'border-box' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={skippedToday ? '#fff' : 'rgba(61,41,33,0.30)'} strokeWidth="2.6" strokeLinecap="round">
                              <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {open && (
                    <div style={{ padding: '2px 16px 14px' }}>
                      {/* Goal habits: one square per goal day from day 1 —
                          missed days stay empty forever. Unlimited: rolling
                          last 30 days. Backfill mode makes past squares
                          tappable so she can add forgotten days. */}
                      {(() => {
                        const backfilling = backfillId === h.id;
                        const gridDays = unlimited
                          ? Array.from({ length: 30 }, (_, i) => isoDaysAgo(29 - i))
                          : Array.from({ length: h.durationDays }, (_, i) => isoFromStart(h.startDate, i));
                        const cols = unlimited ? 10 : h.durationDays <= 35 ? 7 : 11;
                        return (
                          <>
                            {backfilling && (
                              <div style={{ marginBottom: 8, fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED, lineHeight: 1.5 }}>
                                Ťukni na dni, ktoré si splnila, ale zabudla odtiknúť.
                              </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
                              {gridDays.map((iso) => {
                                const c = h.completions?.[iso] ?? 0;
                                const full = c >= h.targetPerDay;
                                const future = iso > todayISO;
                                const isToday = iso === todayISO;
                                const skippedDay = !full && !future && (skips[h.id] ?? []).includes(iso);
                                const tappable = backfilling && !future;
                                return (
                                  <div
                                    key={iso}
                                    onClick={tappable ? () => setCompletionForDate(h.id, iso, full ? 0 : h.targetPerDay) : undefined}
                                    style={{
                                      aspectRatio: '1',
                                      borderRadius: 5,
                                      cursor: tappable ? 'pointer' : 'default',
                                      background: full ? SAVED_GREEN : c > 0 ? 'rgba(122,158,120,0.35)' : skippedDay ? 'rgba(194,122,110,0.45)' : future ? 'transparent' : NM.HAIR,
                                      border: isToday ? `1.5px solid ${NM.GOLD}` : future ? `1px solid ${NM.HAIR}` : '1px solid transparent',
                                      boxSizing: 'border-box',
                                    }}
                                  />
                                );
                              })}
                            </div>
                            <div style={{ marginTop: 6, fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY }}>
                              {unlimited ? 'Posledných 30 dní' : `Tvoj cieľ deň po dni — od 1 do ${h.durationDays}`}
                            </div>
                            <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                              {[
                                [SAVED_GREEN, 'splnené'],
                                ['rgba(194,122,110,0.45)', 'nevyšlo'],
                                [NM.HAIR, 'nezaznačené'],
                              ].map(([clr, lbl]) => (
                                <span key={lbl} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                  <span style={{ width: 10, height: 10, borderRadius: 3, background: clr, flexShrink: 0 }} />
                                  <span style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.TERTIARY }}>{lbl}</span>
                                </span>
                              ))}
                            </div>
                          </>
                        );
                      })()}

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

                      {backfillId === h.id ? (
                        <div style={{ marginTop: 12 }}>
                          <button
                            onClick={() => setBackfillId(null)}
                            style={{ all: 'unset', cursor: 'pointer', padding: '8px 15px', borderRadius: 999, background: NM.DEEP, color: '#fff', fontFamily: NM.SANS, fontSize: 12, fontWeight: 500 }}
                          >
                            Hotovo
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
                          <button
                            onClick={() => setBackfillId(h.id)}
                            style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: NM.GOLD, fontWeight: 500 }}
                          >
                            Zabudla si si zaznačiť?
                          </button>
                          {!done && (
                            <button
                              onClick={() => toggleSkip(h.id)}
                              style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                              <span style={{ fontFamily: NM.SANS, fontSize: 10.5, color: skippedToday ? NM.MUTED : CORAL, fontWeight: 600 }}>
                                {skippedToday ? 'Zajtra zas ✓' : 'Dnes nevyšlo?'}
                              </span>
                              <span style={{ width: 20, height: 20, borderRadius: 999, background: skippedToday ? CORAL : 'rgba(61,41,33,0.06)', border: skippedToday ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`, display: 'grid', placeItems: 'center', flexShrink: 0, boxSizing: 'border-box' }}>
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={skippedToday ? '#fff' : 'rgba(61,41,33,0.30)'} strokeWidth="2.6" strokeLinecap="round">
                                  <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Preset cards — activation is the add flow */}
        {canAdd && availablePresets.length > 0 && (
          <>
            {sectionHead('Vyber si', habits.length === 0 ? 'svoj prvý návyk' : 'ďalší návyk')}
            {availablePresets.map((p) => (
              <PresetCard key={p.name} preset={p} saving={saving} onStart={startHabit(p.unit, p.target)} />
            ))}
          </>
        )}

        {canAdd && <CustomCard saving={saving} onStart={startHabit('krát', 1)} />}

        {!loading && habits.length >= MAX_HABITS && (
          <div style={{ marginTop: 16, fontFamily: NM.SANS, fontSize: 12, color: NM.TERTIARY, lineHeight: 1.5, paddingLeft: 4 }}>
            Najviac 5 návykov naraz — menej je viac.
          </div>
        )}
      </div>

      <ConfirmSheet
        open={!!confirmDeleteId}
        eyebrow="Návyky a ciele"
        title="Ukončiť budovanie návyku?"
        message="Návyk zmizne zo zoznamu. Jeho doterajšie odfajknutia sa nestratia."
        confirmLabel="Áno, ukončiť"
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
