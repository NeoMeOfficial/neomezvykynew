import { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { useCycleData } from '../../../features/cycle/useCycleData';
import {
  getNextPeriodDate,
  getCurrentCycleDay,
  getPhaseByDay,
  getPhaseRanges,
} from '../../../features/cycle/utils';
import { PHASE_NAMES } from '../../../features/cycle/constants';
import PlusUnlockBanner from '../paywall/PlusUnlockBanner';

/**
 * PeriodkaSettings — Round 17 redesign.
 *
 * The previous version (~1015 lines) had emoji-heavy CTAs, an inline
 * month calendar, a tabular "Predchádzajúce menštruácie" history view,
 * a debug/test menu, and a "manual vs auto" mode toggle. The Round 17
 * design (claude.ai/design) collapsed this to a single editorial
 * settings page:
 *
 *   • Top bar with mauve eyebrow + back + 'Upraviť' shortcut.
 *   • Hero card — mauve halo crescent SVG (no emoji), phase name in
 *     italic serif, "X. deň cyklu" with Gilda numeral, ROSE pill CTA
 *     "Menštruácia mi začala" with SVG drop icon.
 *   • Five info cards (last period, cycle length, period length,
 *     next period, fertile days) using consistent 22px-radius white
 *     cards with mauve numerals.
 *   • Editorial empty state for history — no database table.
 *
 * Data layer unchanged: useCycleData for cycle_data persistence,
 * existing phase / fertile-window calculations preserved, localStorage
 * 'neome-period-history' still tracks past cycles in the background
 * for the weighted-average prediction logic in useCycleData.ts.
 *
 * Mounted at /kniznica/periodka/nastavenia.
 */

// ─── Period history (same storage key as the previous version) ──────
interface PeriodHistoryEntry {
  id: string;
  startDate: string;
  endDate: string;
  periodLength: number;
  cycleLength?: number;
  createdAt: string;
}

function loadPeriodHistory(): PeriodHistoryEntry[] {
  try {
    const raw = localStorage.getItem('neome-period-history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePeriodHistory(history: PeriodHistoryEntry[]) {
  try {
    localStorage.setItem('neome-period-history', JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save period history:', err);
  }
}

// ─── Tokens (mirror the design's T object) ─────────────────────────
const T = {
  BG:        '#F8F5F0',
  CARD:      '#FFFFFF',
  INK:       '#3D2921',
  FG_2:      'rgba(61,41,33,0.72)',
  FG_3:      'rgba(61,41,33,0.56)',
  FG_MUTED:  'rgba(61,41,33,0.40)',
  HAIR:      'rgba(61,41,33,0.08)',
  HAIR_2:    'rgba(61,41,33,0.14)',
  MAUVE:     '#A8848B',
  MAUVE_300: '#CBB2B6',
  MAUVE_100: '#EFE4E6',
  ROSE:      '#C98FA3',
  SAGE:      '#8B9E88',
  SERIF:     "'Gilda Display', Georgia, serif",
  SANS:      "'DM Sans', system-ui, -apple-system, sans-serif",
} as const;

// ─── Helpers ──────────────────────────────────────────────────────
const SK_MONTHS = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];

function fmtFullDate(d: Date): string {
  return `${d.getDate()}. ${SK_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtMonthDay(d: Date): string {
  return `${d.getDate()}. ${SK_MONTHS[d.getMonth()].slice(0, 3)}`;
}

function fmtFertileRange(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${start.getDate()}. — ${end.getDate()}. ${SK_MONTHS[start.getMonth()]} ${start.getFullYear()}`;
  }
  return `${start.getDate()}. ${SK_MONTHS[start.getMonth()].slice(0, 3)} — ${end.getDate()}. ${SK_MONTHS[end.getMonth()].slice(0, 3)} ${start.getFullYear()}`;
}

function cardOuter(): React.CSSProperties {
  return {
    background: T.CARD,
    borderRadius: 22,
    border: `1px solid ${T.HAIR}`,
    boxShadow: '0 1px 0 rgba(61,41,33,0.02)',
    margin: '0 16px 14px',
  };
}

// ─── Atoms ────────────────────────────────────────────────────────
function Eyebrow({ children, color = T.FG_3, size = 10 }: { children: React.ReactNode; color?: string; size?: number }) {
  return (
    <div style={{
      fontFamily: T.SANS, fontSize: size,
      letterSpacing: '0.22em', textTransform: 'uppercase',
      fontWeight: 500, color,
    }}>{children}</div>
  );
}

function Numeral({ children, color = T.MAUVE, size = 30 }: { children: React.ReactNode; color?: string; size?: number }) {
  return (
    <span style={{
      fontFamily: T.SERIF, fontSize: size,
      fontWeight: 400, color, letterSpacing: '-0.01em', lineHeight: 1,
    }}>{children}</span>
  );
}

// ─── Date picker (sheet) ────────────────────────────────────────────
function DatePickerSheet({ open, value, onClose, onChange }: { open: boolean; value: Date | null; onClose: () => void; onChange: (d: Date) => void }) {
  const [draft, setDraft] = useState<Date>(value ?? new Date());
  useEffect(() => {
    if (open) setDraft(value ?? new Date());
  }, [open, value]);

  if (!open) return null;
  const iso = format(draft, 'yyyy-MM-dd');

  // Render via portal so the sheet escapes the AppLayout's z-10 main
  // stacking context — without this, the BottomNav (zIndex: 50, but a
  // sibling of <main>) draws over the sheet's actions despite the
  // sheet's own zIndex: 100.
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(42,26,20,0.55)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', width: '100%', background: T.BG, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '22px 22px calc(env(safe-area-inset-bottom) + 22px)', boxShadow: '0 -10px 32px rgba(61,41,33,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 38, height: 4, borderRadius: 999, background: T.HAIR_2 }} />
        </div>
        <Eyebrow color={T.MAUVE}>Začiatok poslednej menštruácie</Eyebrow>
        <div style={{ marginTop: 14, marginBottom: 18 }}>
          <input
            type="date"
            value={iso}
            max={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setDraft(new Date(e.target.value + 'T00:00:00'))}
            style={{
              width: '100%', padding: '14px 16px',
              background: T.CARD, border: `1px solid ${T.HAIR_2}`, borderRadius: 14,
              fontFamily: T.SANS, fontSize: 15, color: T.INK,
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px 0', borderRadius: 999, background: 'transparent', border: `1px solid ${T.HAIR_2}`, fontFamily: T.SANS, fontSize: 13, fontWeight: 500, color: T.FG_2, cursor: 'pointer' }}>
            Zrušiť
          </button>
          <button onClick={() => onChange(draft)} style={{ flex: 1, padding: '14px 0', borderRadius: 999, background: T.MAUVE, border: 0, fontFamily: T.SANS, fontSize: 13, fontWeight: 500, color: '#fff', cursor: 'pointer' }}>
            Uložiť
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Top bar ────────────────────────────────────────────────────────
function TopBar({ onBack, onEdit }: { onBack: () => void; onEdit: () => void }) {
  return (
    <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button onClick={onBack} aria-label="Späť" style={{ width: 36, height: 36, borderRadius: 999, background: T.CARD, border: `1px solid ${T.HAIR_2}`, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.INK} strokeWidth="1.8" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Eyebrow color={T.MAUVE}>Cyklus · Nastavenia</Eyebrow>
        <div style={{ width: 22, height: 1, background: T.MAUVE_300 }} />
      </div>
      <button onClick={onEdit} style={{ fontFamily: T.SANS, fontSize: 12, fontWeight: 500, color: T.MAUVE, background: 'transparent', border: 0, padding: '8px 4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        Upraviť
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.MAUVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 4l6 6L8 22H2v-6L14 4z"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Phase hero card ────────────────────────────────────────────────
function PhaseHero({ phaseName, dayOfCycle, headline, onPeriodStarted }: { phaseName: string; dayOfCycle: number; headline: string; onPeriodStarted: () => void }) {
  return (
    <div style={cardOuter()}>
      <div style={{ padding: '26px 22px 22px', textAlign: 'center' }}>
        {/* Mauve halo + stroke crescent */}
        <div style={{ display: 'inline-block', position: 'relative', marginBottom: 14 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 999,
            background: `radial-gradient(circle, ${T.MAUVE_100} 0%, rgba(255,255,255,0) 70%)`,
            display: 'grid', placeItems: 'center',
          }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M30 8a16 16 0 1 0 0 32a13 13 0 1 1 0-32z" fill="none" stroke={T.MAUVE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div style={{ fontFamily: T.SERIF, fontSize: 28, color: T.MAUVE, fontStyle: 'italic', letterSpacing: '-0.005em', lineHeight: 1.15 }}>
          {phaseName}
        </div>
        <div style={{ marginTop: 6, fontFamily: T.SANS, fontSize: 12, color: T.MAUVE, letterSpacing: '0.04em' }}>
          <Numeral color={T.MAUVE} size={14}>{dayOfCycle}.</Numeral>
          <span style={{ marginLeft: 6 }}>deň cyklu</span>
        </div>
        <div style={{ marginTop: 12, fontFamily: T.SANS, fontSize: 12.5, color: T.FG_2, lineHeight: 1.5, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
          {headline}
        </div>
        <button onClick={onPeriodStarted} style={{
          marginTop: 18,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '13px 22px', borderRadius: 999,
          background: T.ROSE, color: '#fff', border: 0,
          fontFamily: T.SANS, fontSize: 13, fontWeight: 500, letterSpacing: '0.01em',
          cursor: 'pointer',
          boxShadow: '0 8px 24px -8px rgba(201,143,163,0.5)',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 3c-3 4-6 7.5-6 12a6 6 0 1 0 12 0c0-4.5-3-8-6-12z"/>
          </svg>
          Menštruácia mi začala
        </button>
      </div>
    </div>
  );
}

// ─── Date display card ─────────────────────────────────────────────
function DateCard({ label, date, action, onAction, note }: { label: string; date: string; action?: string; onAction?: () => void; note?: string }) {
  return (
    <div style={cardOuter()}>
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow color={T.FG_3}>{label}</Eyebrow>
            <div style={{ marginTop: 10 }}>
              <Numeral size={26} color={T.MAUVE}>{date}</Numeral>
            </div>
            {note && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: T.SANS, fontSize: 11.5, color: T.FG_2, lineHeight: 1.5 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.SAGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>
                </svg>
                <span>{note}</span>
              </div>
            )}
          </div>
          {action && onAction && (
            <button onClick={onAction} style={{ background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: T.SANS, fontSize: 12, fontWeight: 500, color: T.MAUVE, flexShrink: 0 }}>
              {action}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.MAUVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 4l6 6L8 22H2v-6L14 4z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Number picker (chip strip) ────────────────────────────────────
function NumPicker({ label, hint, value, suffix, min, max, onChange }: { label: string; hint: string; value: number; suffix: string; min: number; max: number; onChange: (n: number) => void }) {
  const values = useMemo(() => {
    const arr: number[] = [];
    for (let n = min; n <= max; n++) arr.push(n);
    return arr;
  }, [min, max]);

  return (
    <div style={cardOuter()}>
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Eyebrow color={T.FG_3}>{label}</Eyebrow>
            <span style={{ color: T.FG_MUTED }} title={hint} aria-label={hint}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5" strokeLinecap="round"/></svg>
            </span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
            <Numeral color={T.INK} size={22}>{value}</Numeral>
            <span style={{ fontFamily: T.SANS, fontSize: 11.5, color: T.FG_3, letterSpacing: '0.04em' }}>{suffix}</span>
          </div>
        </div>
        <div style={{ marginTop: 6, fontFamily: T.SANS, fontSize: 11, color: T.FG_MUTED, lineHeight: 1.5 }}>
          {hint}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 14, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' as const }}>
          {values.map((n) => {
            const on = n === value;
            return (
              <button
                key={n}
                onClick={() => onChange(n)}
                style={{
                  all: 'unset',
                  flexShrink: 0,
                  width: 40, height: 40, borderRadius: 12,
                  display: 'grid', placeItems: 'center',
                  background: on ? T.MAUVE : T.CARD,
                  border: `1px solid ${on ? T.MAUVE : T.HAIR_2}`,
                  fontFamily: on ? T.SERIF : T.SANS,
                  fontSize: on ? 16 : 13,
                  fontWeight: on ? 400 : 500,
                  color: on ? '#fff' : T.INK,
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── History — editorial empty state ───────────────────────────────
function HistoryEmpty() {
  return (
    <div style={cardOuter()}>
      <div style={{ padding: '20px 20px 24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.MAUVE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>
          </svg>
          <Eyebrow color={T.MAUVE}>Predchádzajúce menštruácie</Eyebrow>
        </div>
        <div style={{ margin: '6px 0 18px', height: 64, width: '100%', display: 'flex', alignItems: 'flex-end', gap: 14, padding: '0 6px' }}>
          {[18, 24, 16, 22, 14].map((h, i) => (
            <div key={i} style={{ flex: 1, height: h, borderRadius: 4, background: `repeating-linear-gradient(45deg, ${T.HAIR} 0 2px, transparent 2px 6px)`, border: `1px dashed ${T.HAIR_2}` }} />
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: T.SERIF, fontSize: 17, color: T.INK, letterSpacing: '-0.005em', fontStyle: 'italic' }}>
            Po prvom zázname<br/>uvidíš svoju históriu tu.
          </div>
          <div style={{ marginTop: 10, fontFamily: T.SANS, fontSize: 11.5, color: T.FG_2, lineHeight: 1.5, maxWidth: 260, marginLeft: 'auto', marginRight: 'auto', fontWeight: 300 }}>
            Záznamy sa vytvoria automaticky, keď zaznačíš začiatok ďalšej menštruácie.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────
export default function PeriodkaSettings() {
  const navigate = useNavigate();
  const { cycleData, setLastPeriodStart, setCycleLength, setPeriodLength, updateCycleData } = useCycleData();
  const { lastPeriodStart, cycleLength, periodLength } = cycleData;

  const [showPicker, setShowPicker] = useState(false);
  const [periodHistory, setPeriodHistory] = useState<PeriodHistoryEntry[]>([]);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    setPeriodHistory(loadPeriodHistory());
  }, []);

  // Derived state (preserved logic from previous version)
  const currentDay = useMemo(() => {
    try {
      return lastPeriodStart ? getCurrentCycleDay(lastPeriodStart, today, cycleLength) : 1;
    } catch {
      return 1;
    }
  }, [lastPeriodStart, today, cycleLength]);

  const ranges = useMemo(() => getPhaseRanges(cycleLength, periodLength), [cycleLength, periodLength]);
  const phase = useMemo(() => {
    try {
      return getPhaseByDay(currentDay, ranges, cycleLength);
    } catch {
      return { key: 'follicular', name: 'Folikulárna fáza' };
    }
  }, [currentDay, ranges, cycleLength]);

  const nextPeriod = useMemo(() => {
    if (!lastPeriodStart) return null;
    return getNextPeriodDate(lastPeriodStart, cycleLength);
  }, [lastPeriodStart, cycleLength]);

  const fertileWindow = useMemo(() => {
    if (!lastPeriodStart) return null;
    const hasReliable = periodHistory.length >= 3;
    if (!hasReliable && periodLength >= 7) return null;

    const ovulationDay = hasReliable
      ? cycleLength - 14
      : Math.max(periodLength + 3 + 5, cycleLength - 14);
    if (ovulationDay >= cycleLength - 3) return null;

    const start = new Date(lastPeriodStart + 'T00:00:00');
    start.setDate(start.getDate() + ovulationDay - 5);
    const end = new Date(lastPeriodStart + 'T00:00:00');
    end.setDate(end.getDate() + ovulationDay + 1);
    return { start, end };
  }, [lastPeriodStart, cycleLength, periodLength, periodHistory.length]);

  // Headline copy based on phase + lateness
  const headlineCopy = useMemo(() => {
    if (!lastPeriodStart) return 'Zaznač prvý deň menštruácie a nastavíme ti odporúčania na mieru.';
    if (currentDay > cycleLength) return 'Podľa plánu by ti menštruácia mala už začať.';
    const phaseLabel = (PHASE_NAMES as Record<string, string>)[phase.key] ?? phase.name ?? '';
    return `Si v ${phaseLabel.toLowerCase()}. Tu si zaznačíš ďalšiu menštruáciu a upravíš dĺžku cyklu.`;
  }, [lastPeriodStart, currentDay, cycleLength, phase]);

  // Actions
  const handlePeriodStarted = useCallback((selectedDate: Date) => {
    if (!lastPeriodStart) {
      setLastPeriodStart(selectedDate);
      updateCycleData({ lastPeriodStart: format(selectedDate, 'yyyy-MM-dd'), periodLength: 5 });
      toast.success('Menštruácia začatá — deň 1');
      // Initial setup complete → take the user straight to her tracker
      // (she arrived from the setup prompt; staying in settings left her
      // hunting for the back arrow). Later edits keep her in settings.
      navigate('/kniznica/periodka');
      return;
    }

    const previousStart = new Date(lastPeriodStart + 'T00:00:00');
    const actualCycle = differenceInDays(startOfDay(selectedDate), startOfDay(previousStart));

    if (actualCycle >= 21 && actualCycle <= 45) {
      const previousEnd = new Date(previousStart);
      previousEnd.setDate(previousEnd.getDate() + periodLength - 1);
      const entry: PeriodHistoryEntry = {
        id: `${previousStart.getTime()}-${Date.now()}`,
        startDate: format(previousStart, 'yyyy-MM-dd'),
        endDate: format(previousEnd, 'yyyy-MM-dd'),
        periodLength,
        cycleLength: actualCycle,
        createdAt: new Date().toISOString(),
      };
      const updated = [entry, ...loadPeriodHistory()].slice(0, 20);
      savePeriodHistory(updated);
      setPeriodHistory(updated);
    }

    const daysSince = differenceInDays(startOfDay(today), startOfDay(selectedDate)) + 1;
    const safePeriodLength = Math.max(daysSince + 2, 5);
    updateCycleData({
      lastPeriodStart: format(selectedDate, 'yyyy-MM-dd'),
      cycleLength: actualCycle >= 21 && actualCycle <= 45 ? actualCycle : cycleLength,
      periodLength: safePeriodLength,
    });
    toast.success(`Nová menštruácia nastavená — deň ${daysSince}`);
  }, [lastPeriodStart, periodLength, cycleLength, today, setLastPeriodStart, updateCycleData, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: T.BG, fontFamily: T.SANS, color: T.INK, paddingBottom: 100 }}>
      <TopBar onBack={() => navigate(-1)} onEdit={() => setShowPicker(true)} />
      <div style={{ height: 6 }} />

      <PhaseHero
        phaseName={phase.name}
        dayOfCycle={currentDay}
        headline={headlineCopy}
        onPeriodStarted={() => setShowPicker(true)}
      />

      <DateCard
        label="Začiatok poslednej menštruácie"
        date={lastPeriodStart ? fmtFullDate(new Date(lastPeriodStart + 'T00:00:00')) : 'Nezaznačené'}
        action="Zmeniť"
        onAction={() => setShowPicker(true)}
      />

      <NumPicker
        label="Dĺžka cyklu"
        hint="Priemerná dĺžka medzi prvými dňami dvoch menštruácií."
        value={cycleLength}
        suffix="dní"
        min={21}
        max={35}
        onChange={(n) => setCycleLength(n)}
      />

      <NumPicker
        label="Dĺžka krvácania"
        hint="Koľko dní zvyčajne trvá tvoje krvácanie."
        value={periodLength}
        suffix="dní"
        min={3}
        max={10}
        onChange={(n) => setPeriodLength(n)}
      />

      <DateCard
        label="Plánovaný začiatok ďalšej menštruácie"
        date={nextPeriod ? fmtFullDate(nextPeriod) : 'Po prvom zázname'}
      />

      <DateCard
        label="Odhadované plodné dni"
        date={fertileWindow ? fmtFertileRange(fertileWindow.start, fertileWindow.end) : 'Po prvom zázname'}
        note={periodHistory.length < 3 ? 'Pre presnejšie výpočty potrebujeme aspoň 3 cykly v histórii.' : undefined}
      />

      <HistoryEmpty />

      <PlusUnlockBanner label="Náhľad bez ukladania — nastavenia cyklu sa uložia s NeoMe Plus" />

      <DatePickerSheet
        open={showPicker}
        value={lastPeriodStart ? new Date(lastPeriodStart + 'T00:00:00') : null}
        onClose={() => setShowPicker(false)}
        onChange={(d) => {
          handlePeriodStarted(d);
          setShowPicker(false);
        }}
      />
    </div>
  );
}
