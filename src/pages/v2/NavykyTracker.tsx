import { useState } from 'react';
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
const PRESETS = [
  { name: '2l vody', unit: 'pohárov', target: 8, color: '#7A9E78' },
  { name: 'Po večeri už nezobkám', unit: 'krát', target: 1, color: '#7A9E78' },
  { name: '30-min prechádzka', unit: 'krát', target: 1, color: '#6B4C3B' },
  { name: 'Cvičenie / strečing', unit: 'krát', target: 1, color: '#6B4C3B' },
  { name: '5-min meditácia / stíšenie', unit: 'krát', target: 1, color: '#A8848B' },
  { name: 'Sebareflexia a zápis do denníka', unit: 'krát', target: 1, color: '#A8848B' },
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

const skDays = (n: number) => (n === 1 ? 'deň' : n >= 2 && n <= 4 ? 'dni' : 'dní');

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
      <span style={{ width: 18, height: 18, borderRadius: 999, border: `1px solid ${NM.HAIR_2}`, flexShrink: 0, boxSizing: 'border-box' }} />
      <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>→</span>
      <span style={{ width: 18, height: 18, borderRadius: 999, background: SAVED_GREEN, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <span style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED }}>Máš hotovo? Nezabudni si to odtiknúť.</span>
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
          style={{ width: '100%', padding: '10px 13px', borderRadius: 12, border: `1px solid ${NM.HAIR}`, fontFamily: NM.SERIF, fontSize: 17, fontWeight: 600, color: preset.color, background: NM.BG, outline: 'none', boxSizing: 'border-box' }}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 19, color: preset.color, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.005em' }}>
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
      <div style={{ fontFamily: NM.SERIF, fontSize: 19, color: NM.GOLD, fontWeight: 600, lineHeight: 1.25 }}>
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
  const { habits, loading, addHabit, editHabit, toggleHabitCompletion, removeHabit } = useSupabaseHabits();
  const { addActivity } = useAchievements();
  const { addEntry } = usePointsLedger();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const todayISO = isoOf(new Date());

  // Per-habit consecutive streak; an untouched today doesn't break it.
  const habitStreak = (h: { completions: Record<string, number> }) => {
    let n = 0;
    const offset = (h.completions?.[todayISO] ?? 0) > 0 ? 0 : 1;
    while ((h.completions?.[isoDaysAgo(offset + n)] ?? 0) > 0) n += 1;
    return n;
  };

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

  const startHabit = (unit: string, target: number) => async (name: string, days: number) => {
    if (saving) return;
    setSaving(true);
    await addHabit({ name, durationDays: days, unit, targetPerDay: target });
    setSaving(false);
  };

  const availablePresets = PRESETS.filter((p) => !habits.some((h) => h.name === p.name));
  const canAdd = !loading && habits.length < MAX_HABITS;

  const sectionHead = (text: string) => (
    <div style={{ marginTop: 26, fontFamily: NM.SERIF, fontSize: 18, color: NM.DEEP, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.005em', paddingLeft: 4 }}>
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
            {sectionHead('Budujem si tieto návyky')}
            <div style={{ paddingLeft: 4 }}>
              <TickHint />
            </div>
            {habits.map((h) => {
              const count = h.completions?.[todayISO] ?? 0;
              const done = count >= h.targetPerDay;
              const multi = h.targetPerDay > 1;
              const unlimited = h.durationDays >= UNLIMITED;
              const dayN = Math.min(daysIn(h), h.durationDays);
              const goalReached = !unlimited && daysIn(h) > h.durationDays;
              const open = expandedId === h.id;
              const streak = habitStreak(h);
              const editing = editId === h.id;
              const color = PRESETS.find((p) => p.name === h.name)?.color ?? NM.DEEP;

              const subParts: string[] = [];
              if (multi) subParts.push(`${count}/${h.targetPerDay} ${h.unit}`);
              if (goalReached) subParts.push('cieľ splnený ✓');
              else if (!unlimited) subParts.push(`deň ${dayN} z ${h.durationDays}`);
              if (streak > 0) subParts.push(`${streak} ${skDays(streak)} v rade`);

              return (
                <div key={h.id} style={{ marginTop: 12, background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px' }}>
                    <div role="button" onClick={() => { setExpandedId(open ? null : h.id); setEditId(null); }} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                      <div style={{ fontFamily: NM.SERIF, fontSize: 17, color, fontWeight: 600, lineHeight: 1.3 }}>{h.name}</div>
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

                  {/* Goal progress — gold = time elapsed, green = done today */}
                  {!unlimited && !goalReached && (
                    <div style={{ height: 3, background: NM.HAIR, margin: '0 16px 13px', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, Math.round((dayN / h.durationDays) * 100))}%`, background: NM.GOLD, borderRadius: 999 }} />
                    </div>
                  )}

                  {open && (
                    <div style={{ padding: '2px 16px 14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
                        {Array.from({ length: 30 }, (_, i) => {
                          const iso = isoDaysAgo(29 - i);
                          const c = h.completions?.[iso] ?? 0;
                          const full = c >= h.targetPerDay;
                          return (
                            <div
                              key={iso}
                              style={{ aspectRatio: '1', borderRadius: 5, background: full ? SAVED_GREEN : c > 0 ? 'rgba(122,158,120,0.35)' : NM.HAIR }}
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

                      {editing ? (
                        <div style={{ marginTop: 12 }}>
                          <input
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            autoFocus
                            style={{ width: '100%', padding: '11px 13px', borderRadius: 12, border: `1px solid ${NM.HAIR}`, fontFamily: NM.SERIF, fontSize: 15, color: NM.DEEP, background: NM.BG, outline: 'none', boxSizing: 'border-box' }}
                          />
                          <div style={{ display: 'flex', gap: 14, marginTop: 10, alignItems: 'center' }}>
                            <button
                              onClick={async () => {
                                const clean = editDraft.trim();
                                if (clean && clean !== h.name) {
                                  await editHabit(h.id, { name: clean, durationDays: h.durationDays, unit: h.unit, targetPerDay: h.targetPerDay });
                                }
                                setEditId(null);
                              }}
                              style={{ all: 'unset', cursor: 'pointer', padding: '8px 15px', borderRadius: 999, background: NM.DEEP, color: '#fff', fontFamily: NM.SANS, fontSize: 12, fontWeight: 500 }}
                            >
                              Uložiť
                            </button>
                            <button onClick={() => setEditId(null)} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED }}>
                              Zrušiť
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
                          <button
                            onClick={() => { setEditId(h.id); setEditDraft(h.name); }}
                            style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: NM.GOLD, fontWeight: 500 }}
                          >
                            Upraviť
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(h.id)}
                            style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: CORAL, fontWeight: 500 }}
                          >
                            Vymazať
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Preset cards — activation is the add flow */}
        {canAdd && availablePresets.length > 0 && (
          <>
            {sectionHead(habits.length === 0 ? 'Vyber si svoj prvý návyk' : 'Vyber si ďalší návyk')}
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
