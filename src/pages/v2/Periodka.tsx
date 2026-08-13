import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useCycleData } from '../../features/cycle/useCycleData';
import { useCycleSymptoms } from '../../hooks/useDailyRituals';
import { Page, Eye, Ser, Body, PlusTag, ConfirmSheet, NM } from '../../components/v2/neome';
import { getDailyTips } from '../../features/cycle/dailyHeadlines';
import type { DerivedState, CycleData } from '../../features/cycle/types';
import { PHASE_NAMES } from '../../features/cycle/constants';
import { getDailyHeadline } from '../../features/cycle/dailyHeadlines';
import { useConsentGuard } from '../../contexts/ConsentGuardContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { CONSENT_TYPES } from '../../lib/consents';
import PlusUnlockBanner from '../../components/v2/paywall/PlusUnlockBanner';

/**
 * Cyklus / Periodka — R5 dashboard
 *
 * Plus: rich one-stop dashboard with phase ring, calendar, symptoms,
 * phase advice, upcoming events.
 * Free: faded ring preview + dark Plus card + educational phase list.
 *
 * Wired:
 * - useCycleData → cycleData + derivedState (currentDay, phase,
 *   phaseRanges, today). Plus state shows real day + phase + calendar
 *   centered on today's month.
 * - hasCycleSetup gates dashboard/setup view (?free=1 forces setup view).
 *   Period tracking is open to all users — no paywall on this surface.
 *
 * Behavior rule (BC-4): for free users we don't persist preview
 * interactions ("Náhľad bez ukladania"). Visuals only here; the
 * persistence guard is a separate behavior PR.
 *
 * Old version: Periodka.old.tsx.
 */

// Round 18 phase palette: ROSE (menstrual), SAGE (follicular),
// LILAC (ovulation), SAND (luteal). Plus tints used for calendar cell
// fills, halo backgrounds, and active-state glows.
const PHASE = {
  MENSTR: '#C98FA3',   // ROSE
  FOLLIC: '#8B9E88',   // SAGE
  OVULAT: '#B7A5C8',   // LILAC
  LUTEAL: '#D6C2A8',   // SAND
};
const TINT = {
  MENSTR_50:  '#FAEEF2',
  MENSTR_100: '#F2DEE6',
  FOLLIC_100: '#D8DFD7',
  OVULAT_100: '#E2D6EE',
  LUTEAL_100: '#EBDCC6',
  GOLD_SOFT:  'rgba(184,150,90,0.15)',
};

function TopBar({ title, showLock = false, onBack, onSettings }: { title: string; showLock?: boolean; onBack?: () => void; onSettings?: () => void }) {
  return (
    <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onBack} aria-label="Späť" style={{ all: 'unset', cursor: 'pointer', padding: 6, marginLeft: -6 }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10l6 6" stroke={NM.DEEP} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div style={{ flex: 1, fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{title}</div>
      {showLock && <PlusTag />}
      {onSettings && (
        <button onClick={onSettings} aria-label="Nastavenia" style={{ all: 'unset', cursor: 'pointer', padding: 6 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="4" width="12" height="11" rx="1.5" stroke={NM.DEEP} strokeWidth="1.3" />
            <path d="M6 3v3M12 3v3M3 8h12" stroke={NM.DEEP} strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

// "O X dní" with Slovak declension; 0 → Dnes, 1 → Zajtra.
function inDaysLabel(n: number): string {
  if (n <= 0) return 'Dnes';
  if (n === 1) return 'Zajtra';
  if (n < 5) return `O ${n} dni`;
  return `O ${n} dní`;
}

interface RingDialProps {
  faded?: boolean;
  totalDays?: number;
  currentDay?: number;
  phaseLabel?: string;
  phaseColor?: string;
  daysToNextLabel?: string;
  /** Real phase ranges (1-indexed, inclusive) from derivedState. Without
   *  them the dial falls back to a generic 28-day split — only for the
   *  faded FreeView preview. */
  phaseRanges?: { key: string; start: number; end: number }[];
}

const RING_PHASE_COLOR: Record<string, string> = {
  menstrual: PHASE.MENSTR,
  follicular: PHASE.FOLLIC,
  ovulation: PHASE.OVULAT,
  luteal: PHASE.LUTEAL,
};

function RingDial({
  faded = false,
  totalDays = 28,
  currentDay = 7,
  phaseLabel = 'Folikulárna',
  phaseColor = PHASE.FOLLIC,
  daysToNextLabel = 'ďalšia o 21 dní',
  phaseRanges,
}: RingDialProps) {
  const size = 230;
  const strokeW = 16;
  const r = (size - strokeW) / 2;
  const cx = size / 2;
  const cy = size / 2;
  // Arcs from the user's real phase boundaries; day N occupies the arc
  // segment (N-1, N], so a range start..end maps to (start-1)..end.
  const phases = (phaseRanges && phaseRanges.length > 0
    ? phaseRanges.map((p) => ({ s: p.start - 1, e: p.end, c: RING_PHASE_COLOR[p.key] ?? PHASE.FOLLIC }))
    : [
        { s: 0, e: 5, c: PHASE.MENSTR },
        { s: 5, e: 13, c: PHASE.FOLLIC },
        { s: 13, e: 16, c: PHASE.OVULAT },
        { s: 16, e: totalDays, c: PHASE.LUTEAL },
      ]
  );
  const polar = (d: number) => {
    const a = (d / totalDays) * Math.PI * 2 - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const arc = (s: number, e: number) => {
    const [x1, y1] = polar(s);
    const [x2, y2] = polar(e);
    const large = e - s > totalDays / 2 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  // A late period pushes currentDay past totalDays — clamp the marker to
  // the cycle end instead of letting it wrap into "menstruation" again.
  const [mx, my] = polar(Math.min(currentDay, totalDays));
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 14px', opacity: faded ? 0.55 : 1 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} stroke={NM.HAIR} strokeWidth={strokeW} fill="none" />
        {phases.map((p, i) => (
          <path key={i} d={arc(p.s, p.e)} stroke={p.c} strokeWidth={strokeW} fill="none" strokeLinecap="butt" opacity={0.85} />
        ))}
        {/* Today marker — ink-filled chip with white border (Round 18) */}
        <circle cx={mx} cy={my} r={11} fill="#fff" />
        <circle cx={mx} cy={my} r={9} fill={NM.DEEP} />

        <text x={cx} y={cy - 22} textAnchor="middle" fontFamily="DM Sans" fontSize="9.5" letterSpacing="2.5" fill={NM.TERTIARY}>
          DEŇ
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="Gilda Display" fontSize="48" fontWeight="500" fill={NM.DEEP} letterSpacing="-1">
          {currentDay}
        </text>
        <text x={cx} y={cy + 36} textAnchor="middle" fontFamily="Gilda Display" fontSize="14" fontWeight="500" fill={NM.GOLD} fontStyle="italic">
          {phaseLabel}
        </text>
        <text x={cx} y={cy + 52} textAnchor="middle" fontFamily="DM Sans" fontSize="10" fill={NM.TERTIARY}>
          {daysToNextLabel}
        </text>
      </svg>
    </div>
  );
}

function PhaseLegend({ activeKey }: { activeKey?: string }) {
  const items = [
    { k: 'menstrual',  n: 'Menštruácia', c: PHASE.MENSTR },
    { k: 'follicular', n: 'Folikulárna', c: PHASE.FOLLIC },
    { k: 'ovulation',  n: 'Ovulácia',    c: PHASE.OVULAT },
    { k: 'luteal',     n: 'Luteálna',    c: PHASE.LUTEAL },
  ];
  return (
    <div style={{ padding: '8px 20px 22px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
      {items.map((p) => {
        const active = activeKey === p.k;
        return (
          <div key={p.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: 999, background: p.c,
              boxShadow: active ? `0 0 0 4px ${p.c}28` : 'none',
            }} />
            <div style={{
              fontFamily: NM.SANS, fontSize: 10.5,
              color: active ? NM.DEEP : NM.MUTED,
              fontWeight: active ? 500 : 400,
              letterSpacing: '0.02em',
            }}>{p.n}</div>
          </div>
        );
      })}
    </div>
  );
}

interface PaidViewProps {
  navigate: (p: string) => void;
  cycleData: CycleData;
  derivedState: DerivedState | null;
  onMarkPeriodStart: () => void;
  onMarkPeriodEnd: (date: Date) => void;
}

const SK_MONTHS_FULL = ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'];
const SK_MONTHS_SHORT_LOWER = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];

function PaidView({ navigate, cycleData, derivedState, onMarkPeriodStart, onMarkPeriodEnd }: PaidViewProps) {
  const totalDays = cycleData.cycleLength ?? 28;
  const periodLength = cycleData.periodLength ?? 5;
  const currentDay = derivedState?.currentDay ?? 1;
  const currentPhaseKey = derivedState?.currentPhase?.key ?? 'follicular';
  const phases = derivedState?.phaseRanges ?? [
    { key: 'menstrual' as const, name: 'Menštruácia', start: 1, end: periodLength },
    { key: 'follicular' as const, name: 'Folikulárna', start: periodLength + 1, end: 13 },
    { key: 'ovulation' as const, name: 'Ovulácia', start: 14, end: 16 },
    { key: 'luteal' as const, name: 'Luteálna', start: 17, end: totalDays },
  ];
  const phaseColorByKey: Record<string, string> = {
    menstrual: PHASE.MENSTR,
    follicular: PHASE.FOLLIC,
    ovulation: PHASE.OVULAT,
    luteal: PHASE.LUTEAL,
  };
  const phaseTintByKey: Record<string, string> = {
    menstrual: TINT.MENSTR_100,
    follicular: TINT.FOLLIC_100,
    ovulation: TINT.OVULAT_100,
    luteal: TINT.LUTEAL_100,
  };
  const phaseColor = phaseColorByKey[currentPhaseKey];
  const currentPhaseName = derivedState?.currentPhase?.name ?? 'Folikulárna';
  const today = derivedState?.today ?? new Date();
  // Entered via the home card's 'Zisti viac' → today-first section order.
  const fromHome = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('from') === 'home';
  const todayDate = today.getDate();
  // Calendar month paging (Gabi 2026-07-28): 0 = current month, negative
  // pages into the past (arrows + swipe). Clamped to a year back.
  const [monthOffset, setMonthOffset] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const viewedMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthIdx = viewedMonth.getMonth();
  const yearIdx = viewedMonth.getFullYear();
  const monthLabel = SK_MONTHS_FULL[monthIdx];
  const monthShort = SK_MONTHS_SHORT_LOWER[monthIdx];

  // Day-of-month → cycle-day → phase key. Maps a calendar date in the
  // visible month back to a phase. Both the cell tint AND the legend
  // highlight derive from this so they're guaranteed to agree.
  const cycleInfoForCalendarDay = (d: number): { cycleDay: number; key: string | null } | null => {
    if (!cycleData.lastPeriodStart) return null;
    const target = new Date(yearIdx, monthIdx, d);
    const start = new Date(cycleData.lastPeriodStart + 'T00:00:00');
    const daysSince = Math.floor((target.getTime() - start.getTime()) / 86400000);
    // Wrap both directions — past months approximate previous cycles with
    // the current cycle length (same rule as phaseKeyForDateISO).
    const cycleDay = ((daysSince % totalDays) + totalDays) % totalDays + 1;
    const range = phases.find((p) => cycleDay >= p.start && cycleDay <= p.end);
    return { cycleDay, key: range?.key ?? null };
  };
  const phaseKeyForCalendarDay = (d: number): string | null => cycleInfoForCalendarDay(d)?.key ?? null;
  const phaseOf = (d: number) => {
    const key = phaseKeyForCalendarDay(d);
    return key ? phaseColorByKey[key] : null;
  };
  const phaseTintOf = (d: number) => {
    const key = phaseKeyForCalendarDay(d);
    return key ? phaseTintByKey[key] : null;
  };

  // Day selected by tap on the calendar — drives the legend highlight.
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const selectedPhaseKey = selectedDay !== null ? phaseKeyForCalendarDay(selectedDay) : null;

  // Next period starts on day totalDays + 1 (day `totalDays` is still part
  // of the current cycle) — `totalDays - currentDay` predicted one day
  // early and disagreed with getNextPeriodDate used by settings.
  const daysToMenstruation = Math.max(0, totalDays + 1 - currentDay);
  const ovulationStart = phases.find((p) => p.key === 'ovulation')?.start ?? 14;
  const daysToOvulation = ovulationStart > currentDay ? ovulationStart - currentDay : Math.max(0, totalDays + ovulationStart - currentDay);

  // Predicted next-period date
  const nextPeriodDate = new Date(today);
  nextPeriodDate.setDate(today.getDate() + daysToMenstruation);
  const nextPeriodLabel = `${nextPeriodDate.getDate()}. ${SK_MONTHS_SHORT_LOWER[nextPeriodDate.getMonth()]}.`;

  const ovulationDate = new Date(today);
  ovulationDate.setDate(today.getDate() + daysToOvulation);
  const fmtShortDate = (d: Date) => `${d.getDate()}. ${SK_MONTHS_SHORT_LOWER[d.getMonth()]}.`;

  // Actual bleed tracking: "Skončila dnes" sets currentPeriodEnd, which
  // overrides the assumed periodLength for this cycle's card states.
  const periodEnded = !!cycleData.currentPeriodEnd
    && !!cycleData.lastPeriodStart
    && cycleData.currentPeriodEnd >= cycleData.lastPeriodStart;
  const bleedingOngoing = !periodEnded && currentDay <= periodLength;
  // Just past the assumed length with no recorded end — ask instead of
  // silently assuming. Dismissable for the rest of the day.
  const [bleedPromptDismissed, setBleedPromptDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('neome_bleed_prompt_dismissed') === format(new Date(), 'yyyy-MM-dd');
    } catch { return false; }
  });
  const dismissBleedPrompt = () => {
    setBleedPromptDismissed(true);
    try { sessionStorage.setItem('neome_bleed_prompt_dismissed', format(new Date(), 'yyyy-MM-dd')); } catch { /* ignore */ }
  };
  const [endPickerOpen, setEndPickerOpen] = useState(false);
  const bleedOverduePrompt = !periodEnded
    && !bleedPromptDismissed
    && currentDay > periodLength
    && currentDay <= periodLength + 3;

  const isLate = currentDay > totalDays;
  const daysLate = isLate ? currentDay - totalDays : 0;

  // Headline copy comes from the shared getDailyHeadline (sub-phase
  // accurate, rotates daily) so the home Periodka card reads identically;
  // the 'late' bucket covers the overdue override.
  const head = getDailyHeadline(currentDay, totalDays, periodLength);

  // Build calendar grid for the current month, Mon-first
  type Cell = { d: number; mute?: boolean };
  const firstOfMonth = new Date(yearIdx, monthIdx, 1);
  const lastOfMonth = new Date(yearIdx, monthIdx + 1, 0);
  const lastOfPrevMonth = new Date(yearIdx, monthIdx, 0);
  const startDow = (firstOfMonth.getDay() + 6) % 7; // Mon=0
  const weeks: Cell[][] = [];
  let row: Cell[] = [];
  for (let i = startDow - 1; i >= 0; i--) {
    row.push({ d: lastOfPrevMonth.getDate() - i, mute: true });
  }
  for (let d = 1; d <= lastOfMonth.getDate(); d++) {
    row.push({ d });
    if (row.length === 7) {
      weeks.push(row);
      row = [];
    }
  }
  let next = 1;
  while (row.length > 0 && row.length < 7) {
    row.push({ d: next++, mute: true });
  }
  if (row.length === 7) weeks.push(row);

  // F-004: cycle_symptoms via useCycleSymptoms (real DB / localStorage demo).
  const {
    days: symptomDayEntries,
    todayMap,
    symptomDates,
    toggleSymptom,
    toggleSymptomForDate,
    setNoteForDate,
    customDefs,
    addCustomSymptom,
    removeCustomSymptom,
  } = useCycleSymptoms();
  const { isPremium } = useSubscription();
  const [addingSymptom, setAddingSymptom] = useState(false);
  const [newSymptomText, setNewSymptomText] = useState('');
  const [noteEditing, setNoteEditing] = useState(false);
  // Long-press any symptom chip → ✕ to remove it (custom chips are
  // deleted, preset chips hidden per device; history and the calendar
  // filter keep working — Gabi 2026-08-03).
  const [hiddenSymptomKeys, setHiddenSymptomKeys] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('neome_cycle_hidden_symptoms_v1');
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch { return []; }
  });
  const hideSymptomChip = (k: string) => {
    setHiddenSymptomKeys((prev) => {
      const next = prev.includes(k) ? prev : [...prev, k];
      try { localStorage.setItem('neome_cycle_hidden_symptoms_v1', JSON.stringify(next)); } catch { /* full */ }
      return next;
    });
  };
  const [symptomDeleteFor, setSymptomDeleteFor] = useState<string | null>(null);
  const symptomLpTimer = useRef<number | null>(null);
  const symptomLpFired = useRef(false);
  useEffect(() => {
    if (!symptomDeleteFor) return;
    const t = window.setTimeout(() => setSymptomDeleteFor(null), 4000);
    return () => window.clearTimeout(t);
  }, [symptomDeleteFor]);
  const symptomLpStart = (k: string) => {
    symptomLpFired.current = false;
    symptomLpTimer.current = window.setTimeout(() => {
      symptomLpFired.current = true;
      setSymptomDeleteFor(k);
    }, 550);
  };
  const symptomLpCancel = () => {
    if (symptomLpTimer.current !== null) { window.clearTimeout(symptomLpTimer.current); symptomLpTimer.current = null; }
  };
  // Calendar dots — derive day-of-month for the VIEWED month (paging).
  const ym = `${yearIdx}-${String(monthIdx + 1).padStart(2, '0')}`;
  const symptomDays: number[] = symptomDates
    .filter((d) => d.startsWith(ym))
    .map((d) => parseInt(d.slice(8, 10), 10));
  const noteDays: number[] = symptomDayEntries
    .filter((d) => (d.note ?? '').trim() && d.date.startsWith(ym))
    .map((d) => parseInt(d.date.slice(8, 10), 10));

  const SYMPTOM_DEFS = [
    { l: 'Energická',     k: 'energetic' },
    { l: 'Sústredená',    k: 'focused' },
    { l: 'Kreatívna',     k: 'creative' },
    { l: 'Spoločenská',   k: 'social' },
    { l: 'Bolesti hlavy', k: 'headache' },
    { l: 'Citlivé prsia', k: 'breast_tenderness' },
    { l: 'Nafúknutá',     k: 'bloating' },
    { l: 'Únava',         k: 'fatigue' },
  ];
  const allSymptomDefs = [
    ...SYMPTOM_DEFS.map((s) => ({ ...s, custom: false as const })),
    ...customDefs.map((s) => ({ ...s, custom: true as const })),
  ];
  const symptoms = allSymptomDefs
    .filter((s) => !hiddenSymptomKeys.includes(s.k))
    .map((s) => ({ l: s.l, k: s.k, on: !!todayMap[s.k], custom: s.custom }));

  // ── Symptom filter on the calendar (Gabi 2026-07-28) ────────────────
  // Pick a symptom → its logged days highlight in the calendar and a
  // summary shows how often it lands in which phase, so she can spot
  // patterns ("hlava ma bolí vždy pred periódou").
  const [symptomFilter, setSymptomFilter] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const symptomCounts = (() => {
    const counts = new Map<string, number>();
    for (const entry of symptomDayEntries) {
      for (const k of Object.keys(entry.symptoms)) {
        if (entry.symptoms[k]) counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    return counts;
  })();
  const filterableSymptoms = allSymptomDefs.filter((sd) => (symptomCounts.get(sd.k) ?? 0) > 0);
  const activeFilterDef = symptomFilter ? allSymptomDefs.find((sd) => sd.k === symptomFilter) ?? null : null;
  const filteredDates: string[] = symptomFilter
    ? symptomDayEntries.filter((entry) => !!entry.symptoms[symptomFilter]).map((entry) => entry.date)
    : [];
  const filteredMonthDays: number[] = filteredDates
    .filter((d) => d.startsWith(ym))
    .map((d) => parseInt(d.slice(8, 10), 10));
  // Phase for any logged date — past cycles approximated with the current
  // cycle length (wrap-around modulo), good enough for pattern-spotting.
  const phaseKeyForDateISO = (iso: string): string | null => {
    if (!cycleData.lastPeriodStart) return null;
    const target = new Date(iso + 'T00:00:00');
    const start = new Date(cycleData.lastPeriodStart + 'T00:00:00');
    const daysSince = Math.floor((target.getTime() - start.getTime()) / 86400000);
    const cycleDay = ((daysSince % totalDays) + totalDays) % totalDays + 1;
    return phases.find((ph) => cycleDay >= ph.start && cycleDay <= ph.end)?.key ?? null;
  };
  const cycleDayForDateISO = (iso: string): number | null => {
    if (!cycleData.lastPeriodStart) return null;
    const target = new Date(iso + 'T00:00:00');
    const start = new Date(cycleData.lastPeriodStart + 'T00:00:00');
    const daysSince = Math.floor((target.getTime() - start.getTime()) / 86400000);
    return ((daysSince % totalDays) + totalDays) % totalDays + 1;
  };

  const filterPhaseSummary = (() => {
    if (!symptomFilter || filteredDates.length === 0) return null;
    const perPhase = new Map<string, number>();
    for (const d of filteredDates) {
      const key = phaseKeyForDateISO(d);
      if (key) perPhase.set(key, (perPhase.get(key) ?? 0) + 1);
    }
    let top: { key: string; n: number } | null = null;
    for (const [key, n] of perPhase) if (!top || n > top.n) top = { key, n };
    // Which CYCLE DAYS it last happened on — the number she can apply to
    // her next cycle ("okolo 10. dňa to príde zas") (Gabi 2026-08-13).
    const recentDays: number[] = [];
    for (const iso of [...filteredDates].sort().slice(-3)) {
      const cd = cycleDayForDateISO(iso);
      if (cd !== null && !recentDays.includes(cd)) recentDays.push(cd);
    }
    recentDays.sort((a, b) => a - b);
    return { total: filteredDates.length, top, recentDays };
  })();

  // ── Day-detail sheet (tap on a calendar day) ────────────────────────
  const PHASE_LOCATIVE: Record<string, string> = {
    menstrual: 'v menštruačnej fáze',
    follicular: 'vo folikulárnej fáze',
    ovulation: 'vo fáze ovulácie',
    luteal: 'v luteálnej fáze',
  };
  const selectedInfo = selectedDay !== null ? cycleInfoForCalendarDay(selectedDay) : null;
  const selectedDateISO = selectedDay !== null
    ? `${yearIdx}-${String(monthIdx + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null;
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const selectedIsToday = selectedDateISO === todayISO;
  const todayNoteText = (symptomDayEntries.find((e) => e.date === todayISO)?.note ?? '').trim();
  const selectedIsPast = !!selectedDateISO && selectedDateISO < todayISO;
  const selectedSymptomLabels = selectedDateISO
    ? Object.keys(symptomDayEntries.find((e) => e.date === selectedDateISO)?.symptoms ?? {})
        .map((k) => allSymptomDefs.find((s) => s.k === k)?.l)
        .filter((l): l is string => !!l)
    : [];
  const phaseSentence = selectedInfo?.key
    ? `${selectedIsToday ? 'Nachádzaš sa' : selectedIsPast ? 'Bola si' : 'Budeš'} ${PHASE_LOCATIVE[selectedInfo.key]}.`
    : null;

  // Custom-symptom input inside the day-detail sheet (separate state from
  // the main section's input so the two never fight over focus).
  const [sheetAddingSymptom, setSheetAddingSymptom] = useState(false);
  const [sheetNewSymptomText, setSheetNewSymptomText] = useState('');

  const dayDetailSheet = selectedDay !== null && (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => setSelectedDay(null)}
      style={{ position: 'fixed', inset: 0, background: 'rgba(42,26,20,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 480, background: NM.BG, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: '24px 24px max(env(safe-area-inset-bottom), 24px)', boxShadow: '0 -10px 40px rgba(0,0,0,0.18)' }}
      >
        <div aria-hidden="true" style={{ width: 36, height: 4, borderRadius: 999, background: NM.HAIR_2, margin: '0 auto 16px' }} />
        <Eye color={NM.TERRA}>{selectedDay}. {monthShort}. {yearIdx}</Eye>
        {selectedInfo ? (
          <>
            <Ser size={24} style={{ marginTop: 10, lineHeight: 1.15 }}>{selectedInfo.cycleDay}. deň tvojho cyklu</Ser>
            {phaseSentence && (
              <Body size={13} style={{ marginTop: 8 }}>{phaseSentence}</Body>
            )}
          </>
        ) : (
          <Ser size={22} style={{ marginTop: 10, lineHeight: 1.2 }}>Mimo zaznamenaného cyklu</Ser>
        )}

        {selectedIsPast && selectedDateISO ? (
          // Past days are editable — retroactively add or fix symptoms.
          <>
            <Eye size={10} style={{ marginTop: 18, marginBottom: 10 }}>Cítila som sa</Eye>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allSymptomDefs.map((s) => {
                const on = !!(symptomDayEntries.find((e) => e.date === selectedDateISO)?.symptoms ?? {})[s.k];
                return (
                  <button
                    key={s.k}
                    type="button"
                    onClick={() => toggleSymptomForDate(selectedDateISO, s.k)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '7px 13px',
                      borderRadius: 999,
                      background: on ? TINT.GOLD_SOFT : '#fff',
                      color: on ? NM.GOLD : NM.DEEP,
                      border: `1px solid ${on ? NM.GOLD : NM.HAIR_2}`,
                      fontFamily: NM.SANS,
                      fontSize: 12.5,
                      fontWeight: on ? 500 : 400,
                    }}
                  >
                    {on && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
                    )}
                    {s.l}
                  </button>
                );
              })}

              {sheetAddingSymptom ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const def = addCustomSymptom(sheetNewSymptomText);
                    if (def) toggleSymptomForDate(selectedDateISO, def.k);
                    setSheetNewSymptomText('');
                    setSheetAddingSymptom(false);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 6px 4px 14px', borderRadius: 999, background: '#fff', border: `1px solid ${NM.HAIR_2}` }}
                >
                  <input
                    autoFocus
                    value={sheetNewSymptomText}
                    onChange={(e) => setSheetNewSymptomText(e.target.value)}
                    onBlur={() => {
                      if (!sheetNewSymptomText.trim()) setSheetAddingSymptom(false);
                    }}
                    maxLength={28}
                    placeholder="Vlastný príznak…"
                    style={{ all: 'unset', fontFamily: NM.SANS, fontSize: 12.5, color: NM.DEEP, minWidth: 0, width: 130 }}
                  />
                  <button
                    type="submit"
                    disabled={!sheetNewSymptomText.trim()}
                    style={{ all: 'unset', cursor: sheetNewSymptomText.trim() ? 'pointer' : 'not-allowed', background: NM.DEEP, color: '#fff', padding: '4px 10px', borderRadius: 999, fontFamily: NM.SANS, fontSize: 11.5, fontWeight: 500, opacity: sheetNewSymptomText.trim() ? 1 : 0.5 }}
                  >
                    Pridať
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSheetAddingSymptom(true)}
                  style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 12px', borderRadius: 999, background: 'transparent', color: NM.MUTED, border: `1px dashed ${NM.HAIR_2}`, fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500 }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Pridať vlastný
                </button>
              )}
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, fontWeight: 400, marginTop: 10, lineHeight: 1.45 }}>
              Zmeny sa ukladajú automaticky.
            </div>
          </>
        ) : selectedSymptomLabels.length > 0 ? (
          <>
            <Eye size={10} style={{ marginTop: 18, marginBottom: 10 }}>Ako sa cítiš</Eye>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedSymptomLabels.map((l) => (
                <div key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 999, background: TINT.GOLD_SOFT, color: NM.GOLD, border: `1px solid ${NM.GOLD}`, fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
                  {l}
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Poznámka dňa — editable for today and past days; future days
            have nothing to note yet. */}
        {selectedDateISO && (selectedIsPast || selectedIsToday) && (
          <>
            <Eye size={10} style={{ marginTop: 18, marginBottom: 8 }}>Poznámka</Eye>
            <textarea
              key={selectedDateISO}
              defaultValue={symptomDayEntries.find((e) => e.date === selectedDateISO)?.note ?? ''}
              rows={3}
              maxLength={500}
              placeholder="Napíš si čokoľvek k tomuto dňu…"
              onBlur={(e) => setNoteForDate(selectedDateISO, e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: `1px solid ${NM.HAIR_2}`, fontFamily: NM.SERIF, fontSize: 14, color: NM.DEEP, background: '#fff', outline: 'none', resize: 'none', lineHeight: 1.5, boxSizing: 'border-box' }}
            />
          </>
        )}

        {!isPremium && (
          <div style={{ marginTop: 18, padding: '12px 14px', borderRadius: 14, background: TINT.GOLD_SOFT, border: `1px solid ${NM.GOLD}55` }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.DEEP, lineHeight: 1.5 }}>
              Chceš, aby sa ti príznaky a poznámky ukladali ku každému dňu a história zostala navždy? S <span style={{ color: NM.GOLD, fontWeight: 500 }}>NeoMe Plus</span> sa nič nestratí.
            </div>
            <button
              onClick={() => navigate('/paywall')}
              style={{ all: 'unset', cursor: 'pointer', marginTop: 10, fontFamily: NM.SANS, fontSize: 12, fontWeight: 500, color: '#fff', background: NM.GOLD, padding: '8px 16px', borderRadius: 999 }}
            >
              Vyskúšať Plus
            </button>
          </div>
        )}

        <button
          onClick={() => setSelectedDay(null)}
          style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center', marginTop: 18, padding: '12px 20px', borderRadius: 999, color: NM.MUTED, fontFamily: NM.SANS, fontSize: 13, fontWeight: 500 }}
        >
          Zavrieť
        </button>
      </div>
    </div>
  );

  // Phase-tailored daily advice — one concrete tip per category for the
  // current sub-phase state, from the same shared source as the daily
  // headline (features/cycle/dailyHeadlines.ts). "Menej je viac" — the
  // tip holds for the whole state; the headline above changes daily.
  const PILLAR_META: Record<'telo' | 'strava' | 'mysel', { category: 'pohyb' | 'strava' | 'mysel'; label: string; title: string; color: string; img: string; path: string }> = {
    telo:   { category: 'pohyb',  label: 'Pohyb',  title: 'Tvoj pohyb dnes',  color: NM.TERRA, img: 'lifestyle-core-workout.jpg', path: '/kniznica/telo' },
    strava: { category: 'strava', label: 'Strava', title: 'Tvoja strava dnes', color: NM.SAGE,  img: 'testimonial-recipe.jpg',     path: '/kniznica/strava' },
    mysel:  { category: 'mysel',  label: 'Myseľ',  title: 'Tvoja myseľ dnes', color: NM.MAUVE, img: 'section-mind.jpg',           path: '/kniznica/mysel' },
  };

  const dailyTips = getDailyTips(currentDay, totalDays, periodLength);

  const advice = (['telo', 'strava', 'mysel'] as const).map((pillarKey) => {
    const meta = PILLAR_META[pillarKey];
    return {
      pillar: meta.label,
      color: meta.color,
      title: meta.title,
      body: dailyTips[meta.category],
      img: meta.img,
      path: meta.path,
    };
  });

  const headerBlock = (
    <>
      {/* Round 18 top bar — back chevron + centered Gilda title + calendar shortcut */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(fromHome ? '/domov-new' : '/kniznica')} aria-label="Späť" style={{ all: 'unset', width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${NM.HAIR_2}`, display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <div style={{ fontFamily: NM.SERIF, fontSize: 20, fontWeight: 400, color: NM.DEEP, letterSpacing: '-0.005em' }}>Periodka</div>
        </div>
        <button onClick={() => navigate('/kniznica/periodka/nastavenia')} aria-label="Nastavenia cyklu" style={{ all: 'unset', width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${NM.HAIR_2}`, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>
          </svg>
        </button>
      </div>

      <div style={{ padding: '4px 22px 0' }}>
        <Ser size={40} style={{ lineHeight: 1.05 }}>
          {head.before}
          <br />
          <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 400 }}>{head.em}</em>
        </Ser>
        <Body style={{ marginTop: 12, maxWidth: 320 }}>{head.body}</Body>
      </div>

    </>
  );

  const ringBlock = (
    <>
      <RingDial
        currentDay={currentDay}
        totalDays={totalDays}
        phaseRanges={phases}
        phaseLabel={isLate ? 'Cyklus predĺžený' : currentPhaseName}
        phaseColor={phaseColor}
        daysToNextLabel={
          isLate
            ? `mešká ${daysLate} ${daysLate === 1 ? 'deň' : daysLate < 5 ? 'dni' : 'dní'}`
            : `menštruácia o ${daysToMenstruation} dní`
        }
      />
      <PhaseLegend activeKey={currentPhaseKey} />
    </>
  );

  const periodCtaBlock = (
    <>
      {/* Period-start action adapts to where the user is in her cycle:
          during menstruation → informational card with a "Skončila dnes"
          action (records the real bleed length; after 3 periods the
          default length auto-calibrates); just past the expected length
          with no recorded end → "ešte krvácaš?" prompt; mid-cycle →
          quiet one-line link; ≤3 days before prediction or late → full
          prominent card. */}
      {bleedingOngoing ? (
        <div style={{ padding: '18px 18px 0' }}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              padding: '14px 16px',
              borderRadius: 20,
              background: TINT.MENSTR_50,
              border: `1px solid ${PHASE.MENSTR}40`,
              alignItems: 'center',
              gap: 14,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 999, background: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={PHASE.MENSTR}>
                <path d="M12 3c-3 4-6 7.5-6 12a6 6 0 1 0 12 0c0-4.5-3-8-6-12z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: NM.SERIF, fontSize: 16, color: NM.DEEP, letterSpacing: '-0.005em' }}>Menštruácia · deň {currentDay} z {periodLength}</div>
              <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.EYEBROW, marginTop: 3, fontWeight: 300 }}>Prebieha — opatruj sa</div>
            </div>
            <button
              onClick={() => onMarkPeriodEnd(new Date())}
              style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 11.5, color: PHASE.MENSTR, fontWeight: 500, padding: '8px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${PHASE.MENSTR}55`, flexShrink: 0 }}
            >
              Skončila dnes
            </button>
          </div>
        </div>
      ) : bleedOverduePrompt ? (
        <div style={{ padding: '18px 18px 0' }}>
          <div
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 20,
              background: TINT.MENSTR_50,
              border: `1px solid ${PHASE.MENSTR}40`,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontFamily: NM.SERIF, fontSize: 16, color: NM.DEEP, letterSpacing: '-0.005em' }}>Ešte stále krvácaš?</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.EYEBROW, marginTop: 3, fontWeight: 300 }}>
              Máš nastavených {periodLength} dní — zaznač, kedy menštruácia skončila, a appka sa to naučí.
            </div>
            {endPickerOpen ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {[
                  { n: 0, l: 'Dnes' },
                  { n: 1, l: 'Včera' },
                  { n: 2, l: 'Pred 2 dňami' },
                  { n: 3, l: 'Pred 3 dňami' },
                ].map(({ n, l }) => (
                  <button
                    key={n}
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() - n);
                      onMarkPeriodEnd(d);
                    }}
                    style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: PHASE.MENSTR, fontWeight: 500, padding: '8px 14px', borderRadius: 999, background: '#fff', border: `1px solid ${PHASE.MENSTR}55` }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => setEndPickerOpen(true)}
                  style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: '#fff', fontWeight: 500, padding: '9px 16px', borderRadius: 999, background: PHASE.MENSTR }}
                >
                  Už skončila
                </button>
                <button
                  onClick={dismissBleedPrompt}
                  style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: PHASE.MENSTR, fontWeight: 500, padding: '9px 16px', borderRadius: 999, background: '#fff', border: `1px solid ${PHASE.MENSTR}55` }}
                >
                  Áno, ešte prebieha
                </button>
              </div>
            )}
          </div>
        </div>
      ) : daysToMenstruation <= 3 || isLate ? (
        <div style={{ padding: '18px 18px 0' }}>
          <button
            onClick={onMarkPeriodStart}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              width: '100%',
              padding: '14px 16px',
              borderRadius: 20,
              background: '#fff',
              border: `1.5px solid ${PHASE.MENSTR}`,
              alignItems: 'center',
              gap: 14,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 999, background: TINT.MENSTR_50, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={PHASE.MENSTR}>
                <path d="M12 3c-3 4-6 7.5-6 12a6 6 0 1 0 12 0c0-4.5-3-8-6-12z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: NM.SERIF, fontSize: 16, color: NM.DEEP, letterSpacing: '-0.005em' }}>Dnes mi začala menštruácia</div>
              <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.EYEBROW, marginTop: 3, fontWeight: 300 }}>
                {isLate ? 'Keď príde, zaznač jej začiatok' : 'Zaznamenať začiatok cyklu'}
              </div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NM.TERTIARY} strokeWidth="1.8" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      ) : (
        <div style={{ padding: '14px 18px 0', textAlign: 'center' }}>
          <button
            onClick={onMarkPeriodStart}
            style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, padding: 6 }}
          >
            Prišla ti menštruácia skôr? <span style={{ color: PHASE.MENSTR, fontWeight: 500 }}>Zaznačiť začiatok</span>
          </button>
        </div>
      )}
    </>
  );

  const calendarBlock = (
      <div style={{ padding: '28px 20px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Eye>Kalendár cyklu</Eye>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => setMonthOffset((o) => Math.max(o - 1, -12))}
              aria-label="Predchádzajúci mesiac"
              style={{ all: 'unset', cursor: 'pointer', width: 28, height: 28, display: 'grid', placeItems: 'center', color: monthOffset <= -12 ? NM.HAIR_2 : NM.MUTED }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <div style={{ fontFamily: NM.SERIF, fontSize: 14, color: NM.DEEP, fontWeight: 500, fontStyle: 'italic', minWidth: 96, textAlign: 'center' }}>{monthLabel} {yearIdx}</div>
            <button
              onClick={() => setMonthOffset((o) => Math.min(o + 1, 0))}
              aria-label="Ďalší mesiac"
              style={{ all: 'unset', cursor: monthOffset === 0 ? 'default' : 'pointer', width: 28, height: 28, display: 'grid', placeItems: 'center', color: monthOffset === 0 ? NM.HAIR_2 : NM.MUTED }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 5 }}>
          {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((d) => (
            <div key={d} style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: NM.EYEBROW, textAlign: 'center', fontWeight: 500 }}>
              {d}
            </div>
          ))}
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, touchAction: 'pan-y' }}
          onTouchStart={(e) => { swipeStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (swipeStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - swipeStartX.current;
            swipeStartX.current = null;
            if (dx > 48) setMonthOffset((o) => Math.max(o - 1, -12));
            else if (dx < -48) setMonthOffset((o) => Math.min(o + 1, 0));
          }}
        >
          {weeks.flat().map((c, i) => {
            const tint = !c.mute ? phaseTintOf(c.d) : null;
            const today = !c.mute && monthOffset === 0 && c.d === todayDate;
            const sym = !c.mute && symptomDays.includes(c.d);
            const selected = !c.mute && selectedDay === c.d;
            const cellPhase = !c.mute ? phaseOf(c.d) : null;
            const filterHit = !c.mute && symptomFilter !== null && filteredMonthDays.includes(c.d);
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (c.mute) return;
                  setSelectedDay((prev) => (prev === c.d ? null : c.d));
                }}
                style={{
                  all: 'unset',
                  cursor: c.mute ? 'default' : 'pointer',
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 9,
                  background: today ? NM.DEEP : filterHit ? NM.GOLD : tint ?? 'transparent',
                  boxShadow: filterHit && today
                    ? `0 0 0 2px ${NM.GOLD}`
                    : selected && !today && !filterHit && cellPhase ? `0 0 0 1.5px ${cellPhase}` : 'none',
                  display: 'grid',
                  placeItems: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{
                  fontFamily: NM.SERIF,
                  fontSize: 14,
                  fontWeight: today ? 500 : 400,
                  letterSpacing: '-0.01em',
                  color: today || filterHit ? '#fff' : c.mute ? 'rgba(61,41,33,0.40)' : NM.DEEP,
                  opacity: c.mute ? 0.5 : 1,
                }}>{c.d}</div>
                {!c.mute && noteDays.includes(c.d) && (
                  <svg
                    width="8" height="8" viewBox="0 0 24 24" fill="none"
                    stroke={today || filterHit ? '#fff' : NM.GOLD} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                    style={{ position: 'absolute', top: 2.5, right: 3, opacity: symptomFilter !== null && !filterHit ? 0.25 : 1 }}
                  >
                    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                )}
                {sym && (
                  <div style={{ position: 'absolute', bottom: 2.5, display: 'flex', gap: 1.5, opacity: symptomFilter !== null && !filterHit ? 0.25 : 1 }}>
                    {[0, 1, 2].map((k) => (
                      <div key={k} style={{ width: 2, height: 2, borderRadius: 999, background: today || filterHit ? '#fff' : NM.DEEP, opacity: today || filterHit ? 1 : 0.55 }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend — tap any calendar day to highlight its phase here */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 8,
            marginTop: 16,
          }}
        >
          {([
            { key: 'menstrual', name: 'Menštruácia', color: PHASE.MENSTR },
            { key: 'follicular', name: 'Folikulárna', color: PHASE.FOLLIC },
            { key: 'ovulation', name: 'Ovulácia', color: PHASE.OVULAT },
            { key: 'luteal', name: 'Luteálna', color: PHASE.LUTEAL },
          ] as const).map((item) => {
            const active = selectedPhaseKey === null || selectedPhaseKey === item.key;
            return (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 12,
                  background: '#fff',
                  border: `1px solid ${NM.HAIR}`,
                  opacity: active ? 1 : 0.32,
                  transition: 'opacity 180ms',
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: 999, background: item.color, flexShrink: 0 }} />
                <span style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.DEEP, fontWeight: 500, letterSpacing: '0.01em' }}>
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Poznámka k dnešku — lives WITH the calendar it marks (Gabi
            2026-08-13): write here, find it later under the pen ✎. */}
        <div style={{ marginTop: 12, background: '#fff', border: `1px solid ${NM.HAIR}`, borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>
              Poznámka <em style={{ fontFamily: NM.SERIF, fontStyle: 'italic', color: NM.GOLD }}>k dnešku</em>
            </div>
            {!noteEditing && !todayNoteText && (
              <button
                type="button"
                onClick={() => setNoteEditing(true)}
                aria-label="Pridaj si poznámku"
                style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 999, color: NM.GOLD, border: `1px dashed ${NM.GOLD}66`, fontFamily: NM.SANS, fontSize: 11.5, fontWeight: 500 }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Pridať
              </button>
            )}
          </div>
          {noteEditing ? (
            <textarea
              autoFocus
              defaultValue={todayNoteText}
              rows={3}
              maxLength={500}
              placeholder={'Detaily a výnimky dňa — „zabudla som tabletku", „bolesť silnejšia než inokedy"…'}
              onBlur={(e) => { setNoteForDate(todayISO, e.target.value); setNoteEditing(false); }}
              style={{ width: '100%', marginTop: 10, padding: '11px 13px', borderRadius: 12, border: `1px solid ${NM.GOLD}66`, fontFamily: NM.SERIF, fontSize: 14, color: NM.DEEP, background: NM.BG, outline: 'none', resize: 'none', lineHeight: 1.5, boxSizing: 'border-box' }}
            />
          ) : todayNoteText ? (
            <div
              role="button"
              onClick={() => setNoteEditing(true)}
              style={{ marginTop: 10, padding: '10px 12px', borderRadius: 12, background: NM.BG, border: `1px solid ${NM.HAIR}`, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'flex-start' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NM.GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <div style={{ fontFamily: NM.SERIF, fontSize: 13.5, color: NM.DEEP, lineHeight: 1.5, whiteSpace: 'pre-wrap', flex: 1 }}>{todayNoteText}</div>
              <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, flexShrink: 0 }}>Uprav</span>
            </div>
          ) : (
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, marginTop: 6, lineHeight: 1.5 }}>
              Ak si potrebuješ niečo špecifické k dnešku zaznačiť, zapíš si to tu — taký deň dostane v kalendári pero ✎.
            </div>
          )}
        </div>

        {/* Collapsible symptom filter — expands on tap */}
        {filterableSymptoms.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              style={{ all: 'unset', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 14, background: 'rgba(184,134,74,0.08)', border: '1px solid rgba(184,134,74,0.28)', boxSizing: 'border-box' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NM.GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z"/>
              </svg>
              <span style={{ flex: 1, fontFamily: NM.SANS, fontSize: 12, color: NM.DEEP, fontWeight: 500 }}>
                Filtruj podľa symptómov — <em style={{ fontFamily: NM.SERIF, fontStyle: 'italic', color: NM.GOLD, fontSize: 13 }}>ako si sa cítila?</em>
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NM.GOLD} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 160ms' }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {filterOpen && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {filterableSymptoms.map((sd) => {
                    const active = symptomFilter === sd.k;
                    return (
                      <button
                        key={sd.k}
                        onClick={() => setSymptomFilter(active ? null : sd.k)}
                        style={{
                          all: 'unset',
                          cursor: 'pointer',
                          padding: '7px 12px',
                          borderRadius: 999,
                          background: active ? NM.GOLD : '#fff',
                          color: active ? '#fff' : NM.DEEP,
                          border: active ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`,
                          fontFamily: NM.SANS,
                          fontSize: 11.5,
                          fontWeight: active ? 500 : 400,
                        }}
                      >
                        {sd.l} · {symptomCounts.get(sd.k) ?? 0}×
                      </button>
                    );
                  })}
                </div>
                {activeFilterDef && filterPhaseSummary && (
                  <div style={{ marginTop: 10, padding: '12px 14px', borderRadius: 14, background: 'rgba(184,134,74,0.08)', border: '1px solid rgba(184,134,74,0.28)' }}>
                    <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.DEEP, fontWeight: 500, lineHeight: 1.45 }}>
                      {activeFilterDef.l} — {filterPhaseSummary.total}× za posledných 12 mesiacov
                    </div>
                    {filterPhaseSummary.recentDays.length > 0 && (
                      <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.DEEP, marginTop: 3, lineHeight: 1.45 }}>
                        Naposledy si sa tak cítila na{' '}
                        <strong style={{ fontWeight: 600 }}>
                          {filterPhaseSummary.recentDays.map((d) => `${d}.`).join(' a ').replace(/ a (?=.* a )/g, ', ')}
                        </strong>{' '}
                        deň tvojho cyklu.
                      </div>
                    )}
                    {filterPhaseSummary.top && filterPhaseSummary.total >= 2 && (
                      <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: 'rgba(61,41,33,0.6)', marginTop: 3, lineHeight: 1.45 }}>
                        Najčastejšie {PHASE_LOCATIVE[filterPhaseSummary.top.key] ?? ''} ({filterPhaseSummary.top.n}×). Zlaté dni v kalendári sú dni so záznamom — listuj šípkami aj do minulých mesiacov.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
  );

  // Collapsed chips: first 6 in stable order, plus any selected ones from
  // the tail so an active selection is never hidden. "+X ďalších" expands.
  const SYMPTOMS_COLLAPSED_LIMIT = 6;
  const [symptomsExpanded, setSymptomsExpanded] = useState(false);
  const visibleSymptoms = symptomsExpanded
    ? symptoms
    : [
        ...symptoms.slice(0, SYMPTOMS_COLLAPSED_LIMIT),
        ...symptoms.slice(SYMPTOMS_COLLAPSED_LIMIT).filter((s) => s.on),
      ];
  const hiddenSymptomCount = symptoms.length - visibleSymptoms.length;

  // Two at-a-glance squares under the hero (from-home flow): where am I
  // today + when is the next period. Same card language as the stats row.
  const todayStatsBlock = (
      <div style={{ padding: '18px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ padding: '14px 12px', background: '#fff', border: `1px solid ${NM.HAIR}`, borderRadius: 18, textAlign: 'center' }}>
          <Eye size={9} color={NM.TERTIARY}>Dnes</Eye>
          <div style={{ marginTop: 8, fontFamily: NM.SERIF, fontSize: 21, fontWeight: 400, color: NM.DEEP, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {currentDay}. deň z {totalDays}
          </div>
          <div style={{ marginTop: 4, fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, fontWeight: 400 }}>
            {isLate ? 'cyklus predĺžený' : ((PHASE_NAMES as Record<string, string>)[currentPhaseKey] ?? currentPhaseName).toLowerCase()}
          </div>
        </div>
        <div style={{ padding: '14px 12px', background: '#fff', border: `1px solid ${NM.HAIR}`, borderRadius: 18, textAlign: 'center' }}>
          <Eye size={9} color={NM.TERTIARY}>Ďalšia perióda</Eye>
          <div style={{ marginTop: 8, fontFamily: NM.SERIF, fontSize: 21, fontWeight: 400, color: PHASE.MENSTR, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {isLate ? 'mešká' : nextPeriodLabel.replace(/\.$/, '')}
          </div>
          <div style={{ marginTop: 4, fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, fontWeight: 400 }}>
            {isLate
              ? `${daysLate} ${daysLate === 1 ? 'deň' : daysLate < 5 ? 'dni' : 'dní'}`
              : inDaysLabel(daysToMenstruation).toLowerCase()}
          </div>
        </div>
      </div>
  );

  // Symptoms + advice as ONE visually connected card: the question
  // ("zaznač si, ako sa cítiš") flows into the answer ("čo by ti mohlo
  // pomôcť") through an arrow divider.
  const wellbeingBlock = (
      <div style={{ padding: '24px 18px 0' }}>
        <div style={{ background: '#fff', border: `1px solid ${NM.HAIR}`, borderRadius: 22, padding: '20px 16px 10px' }}>
        <Ser size={21} style={{ lineHeight: 1.18, marginBottom: 14 }}>
          Zaznač si, ako sa <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 400 }}>dnes cítiš</em>
        </Ser>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {visibleSymptoms.map((s) => (
            <span key={s.k} style={{ position: 'relative', display: 'inline-flex' }}>
              <button
                type="button"
                onClick={() => {
                  if (symptomLpFired.current) { symptomLpFired.current = false; return; }
                  if (symptomDeleteFor === s.k) { setSymptomDeleteFor(null); return; }
                  toggleSymptom(s.k);
                }}
                onTouchStart={() => symptomLpStart(s.k)}
                onTouchEnd={symptomLpCancel}
                onTouchMove={symptomLpCancel}
                onMouseDown={() => symptomLpStart(s.k)}
                onMouseUp={symptomLpCancel}
                onMouseLeave={symptomLpCancel}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: s.on ? TINT.GOLD_SOFT : '#fff',
                  color: s.on ? NM.GOLD : NM.DEEP,
                  border: `1px solid ${s.on ? NM.GOLD : NM.HAIR_2}`,
                  fontFamily: NM.SANS,
                  fontSize: 12.5,
                  fontWeight: s.on ? 500 : 400,
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                }}
              >
                {s.on && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                )}
                {s.l}
              </button>
              {symptomDeleteFor === s.k && (
                <button
                  type="button"
                  aria-label={`Vymazať ${s.l}`}
                  onClick={() => {
                    // History is untouchable: a custom symptom with logged
                    // days is only HIDDEN (its definition must survive so
                    // past months keep rendering it); truly deleted only
                    // when it was never used.
                    if (s.custom && (symptomCounts.get(s.k) ?? 0) === 0) removeCustomSymptom(s.k);
                    else hideSymptomChip(s.k);
                    setSymptomDeleteFor(null);
                  }}
                  style={{ position: 'absolute', top: -7, right: -7, width: 20, height: 20, borderRadius: 999, background: '#C27A6E', border: '2px solid #fff', display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0, boxSizing: 'border-box', zIndex: 1 }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </span>
          ))}

          {!symptomsExpanded && hiddenSymptomCount > 0 && (
            <button
              type="button"
              onClick={() => setSymptomsExpanded(true)}
              style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 14px', borderRadius: 999, background: 'transparent', color: NM.GOLD, border: `1px dashed ${NM.GOLD}66`, fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500 }}
            >
              +{hiddenSymptomCount} {hiddenSymptomCount < 5 ? 'ďalšie' : 'ďalších'}
            </button>
          )}

          {symptomsExpanded && (addingSymptom ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const def = addCustomSymptom(newSymptomText);
                if (def) toggleSymptom(def.k);
                setNewSymptomText('');
                setAddingSymptom(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 6px 4px 14px',
                borderRadius: 999,
                background: '#fff',
                border: `1px solid ${NM.HAIR_2}`,
              }}
            >
              <input
                autoFocus
                value={newSymptomText}
                onChange={(e) => setNewSymptomText(e.target.value)}
                onBlur={() => {
                  // Cancel if the user taps elsewhere without typing.
                  if (!newSymptomText.trim()) setAddingSymptom(false);
                }}
                maxLength={28}
                placeholder="Vlastný príznak…"
                style={{
                  all: 'unset',
                  fontFamily: NM.SANS,
                  fontSize: 12.5,
                  color: NM.DEEP,
                  minWidth: 0,
                  width: 130,
                }}
              />
              <button
                type="submit"
                disabled={!newSymptomText.trim()}
                style={{
                  all: 'unset',
                  cursor: newSymptomText.trim() ? 'pointer' : 'not-allowed',
                  background: NM.DEEP,
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontFamily: NM.SANS,
                  fontSize: 11.5,
                  fontWeight: 500,
                  opacity: newSymptomText.trim() ? 1 : 0.5,
                }}
              >
                Pridať
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAddingSymptom(true)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '8px 12px',
                borderRadius: 999,
                background: 'transparent',
                color: NM.MUTED,
                border: `1px dashed ${NM.HAIR_2}`,
                fontFamily: NM.SANS,
                fontSize: 12.5,
                fontWeight: 500,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Pridať vlastný
            </button>
          ))}

          {symptomsExpanded && (
            <button
              type="button"
              onClick={() => setSymptomsExpanded(false)}
              style={{ all: 'unset', cursor: 'pointer', padding: '8px 12px', borderRadius: 999, color: NM.MUTED, fontFamily: NM.SANS, fontSize: 12, fontWeight: 500 }}
            >
              Menej
            </button>
          )}
        </div>
        <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, fontWeight: 400, marginTop: 12, lineHeight: 1.45 }}>
          Označenia sa ukladajú automaticky — deň so záznamom dostane v kalendári bodku.
        </div>

        {/* Connector: question above → answer below */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 18px' }}>
          <div style={{ flex: 1, height: 1, background: NM.HAIR_2 }} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          <div style={{ flex: 1, height: 1, background: NM.HAIR_2 }} />
        </div>

        <Ser size={21} style={{ lineHeight: 1.18 }}>
          Čo by ti mohlo <em style={{ color: NM.GOLD, fontWeight: 400, fontStyle: 'italic' }}>dnes pomôcť?</em>
        </Ser>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column' }}>
          {advice.map((r, i) => (
            <button
              key={r.pillar}
              onClick={() => navigate(r.path)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '16px 0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                borderBottom: i < advice.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
              }}
            >
              <div style={{ width: 88, height: 88, flexShrink: 0, borderRadius: 14, backgroundImage: `url(/images/r9/${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Eye size={10} color={r.color}>{r.pillar}</Eye>
                <div style={{ fontFamily: NM.SERIF, fontSize: 20, fontWeight: 400, color: NM.DEEP, marginTop: 6, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{r.title}</div>
                <Body size={12.5} style={{ marginTop: 6 }}>{r.body}</Body>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.TERTIARY} strokeWidth="1.7" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 6 }}><path d="M9 6l6 6-6 6"/></svg>
            </button>
          ))}
        </div>
        </div>
      </div>
  );

  const upcomingBlock = (
      <div style={{ padding: '28px 22px 8px' }}>
        <Eye>Čaká ťa</Eye>
        <div style={{ marginTop: 16 }}>
          {[
            { w: inDaysLabel(daysToMenstruation), d: fmtShortDate(nextPeriodDate), t: 'Nasledujúca perióda', c: PHASE.MENSTR },
            { w: inDaysLabel(daysToOvulation), d: fmtShortDate(ovulationDate), t: 'Nasledujúca ovulácia', c: PHASE.OVULAT },
            { w: 'priemer', d: `${totalDays} dní`, t: 'Dĺžka cyklu', c: NM.GOLD },
          ].map((u, i, arr) => (
            <div
              key={u.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 999, background: u.c, flexShrink: 0 }} />
              <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400 }}>{u.t}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: NM.SERIF, fontSize: 15, color: NM.DEEP, letterSpacing: '-0.005em' }}>{u.d}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, fontWeight: 400, marginTop: 2 }}>{u.w.toLowerCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );

  return (
    <>
      {headerBlock}
      {/* One order for every entry point (Gabi 2026-07-30) — the
          today-first flow she tuned for the home card applies always;
          fromHome now only steers the back arrow. */}
      {todayStatsBlock}
      {wellbeingBlock}
      {periodCtaBlock}
      {ringBlock}
      {upcomingBlock}
      {calendarBlock}
      {dayDetailSheet}
    </>
  );
}

function FreeView({ navigate }: { navigate: (p: string) => void }) {
  // Back returns to wherever she came from — home card or Kniznica.
  const fromHome = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('from') === 'home';
  const phases = [
    { pillar: 'Menštruácia', c: PHASE.MENSTR, d: 'Telo sa resetuje. Doprajte si pokoj, teplo a jemný pohyb.' },
    { pillar: 'Folikulárna', c: PHASE.FOLLIC, d: 'Energia rastie. Skvelý čas na nové výzvy a silový tréning.' },
    { pillar: 'Ovulácia', c: PHASE.OVULAT, d: 'Vrchol energie a sebavedomia. Sociálny, kreatívny čas.' },
    { pillar: 'Luteálna', c: PHASE.LUTEAL, d: 'Spomaľ a ukľudni sa. Telo sa pripravuje na ďalší cyklus.' },
  ];
  return (
    <>
      <TopBar title="Periodka" onBack={() => navigate(fromHome ? '/domov-new' : '/kniznica')} />
      <div style={{ padding: '2px 20px 6px' }}>
        <Eye color={NM.TERRA}>Začni so sledovaním</Eye>
        <Ser size={30} style={{ marginTop: 10, lineHeight: 1.02 }}>
          Spoznaj svoj
          <br />
          <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>cyklus.</em>
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>
          Sleduj fázy, príznaky a energiu. Získaj predpovede menštruácie a odporúčania pre tvoju aktuálnu fázu.
        </Body>
      </div>

      <div style={{ position: 'relative' }}>
        <RingDial faded />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 40%, rgba(248,245,240,0.7) 80%)', pointerEvents: 'none' }} />
      </div>
      <PhaseLegend />

      <div style={{ padding: '0 20px 22px' }}>
        <div
          style={{
            padding: '24px 22px',
            borderRadius: 22,
            background: '#fff',
            border: `1px solid ${NM.HAIR}`,
            boxShadow: '0 10px 28px rgba(61,41,33,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Eye color={NM.TERRA} style={{ marginBottom: 12 }}>Pridaj svoje údaje</Eye>
          <Ser size={22} style={{ lineHeight: 1.12, marginBottom: 10 }}>
            Nastav svoj
            <br />
            <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>cyklus.</em>
          </Ser>
          <Body size={13} style={{ marginTop: 4 }}>
            Zadaj posledný deň menštruácie a priemernú dĺžku cyklu — okamžite uvidíš svoju aktuálnu fázu, odporúčania a predpovede.
          </Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '18px 0 20px' }}>
            {[
              'Sledovanie 28-dňového cyklu a fáz',
              'Predpovede menštruácie a ovulácie',
              'Záznam príznakov a energie',
              'Tipy na stravu a pohyb pre každú fázu',
            ].map((b) => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3 3 7-7" stroke={NM.TERRA} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, fontWeight: 400 }}>{b}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/kniznica/periodka/nastavenia')}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: NM.TERRA,
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              fontFamily: NM.SANS,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.02em',
              cursor: 'pointer',
            }}
          >
            Pridať svoje údaje
          </button>
          <div style={{ textAlign: 'center', marginTop: 10, fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, fontWeight: 400 }}>
            Trvá to menej ako minútu · údaje zostávajú v tvojom telefóne
          </div>
        </div>
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <Eye style={{ marginBottom: 6 }}>Zatiaľ si prečítaj</Eye>
        <Ser size={20} style={{ marginTop: 8, marginBottom: 14, lineHeight: 1.2 }}>
          Ako <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>funguje</em> cyklus
        </Ser>
        <div>
          {phases.map((p, i, arr) => (
            <div key={p.pillar} style={{ padding: '12px 0', display: 'flex', alignItems: 'flex-start', gap: 12, borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: p.c, marginTop: 8, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: NM.SERIF, fontSize: 14, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{p.pillar}</div>
                <Body size={12} style={{ marginTop: 3 }}>{p.d}</Body>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Periodka() {
  const navigate = useNavigate();
  const { cycleData, derivedState, setLastPeriodStart, markPeriodEnded } = useCycleData();
  const [confirmStartOpen, setConfirmStartOpen] = useState(false);
  const requireConsent = useConsentGuard();

  const handleMarkPeriodEnded = async (date: Date) => {
    const ok = await requireConsent(CONSENT_TYPES.HEALTH_DATA, {
      acceptLabel: 'Súhlasím a uložiť',
    });
    if (!ok) return;
    markPeriodEnded(date);
  };

  // ?free=1 still works for testing the upsell/setup view, but tier no
  // longer gates the dashboard — period tracking is open to all users.
  const forceFree = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('free');
  const hasCycleSetup = !!cycleData?.lastPeriodStart;
  // Has data → rich dashboard. No data → setup prompt (no paywall).
  const showDashboard = hasCycleSetup && !forceFree;

  const handleConfirmPeriodStart = async () => {
    // Article 9(2)(a) GDPR — explicit consent before persisting any
    // special-category health data (menstrual cycle start date).
    const ok = await requireConsent(CONSENT_TYPES.HEALTH_DATA, {
      acceptLabel: 'Súhlasím a uložiť',
    });
    if (!ok) return;
    setLastPeriodStart(new Date());
    setConfirmStartOpen(false);
  };

  return (
    <Page>
      {showDashboard && cycleData ? (
        <PaidView
          navigate={navigate}
          cycleData={cycleData}
          derivedState={derivedState}
          onMarkPeriodStart={() => setConfirmStartOpen(true)}
          onMarkPeriodEnd={handleMarkPeriodEnded}
        />
      ) : (
        <FreeView navigate={navigate} />
      )}

      <PlusUnlockBanner label="Náhľad bez ukladania — s NeoMe Plus sa tvoje cyklus záznamy uložia natrvalo" />

      <ConfirmSheet
        open={confirmStartOpen}
        eyebrow="Cyklus"
        title="Označiť dnešok ako začiatok menštruácie?"
        message="Tým sa znovu nastaví tvoj cyklus tak, aby dnešný deň bol deň 1. Ak začala už skôr (napr. keď si appku pár dní neotvorila), vyber presný dátum."
        confirmLabel="Áno, dnes mi začala"
        secondaryLabel="Začala skôr — vybrať dátum"
        onSecondary={() => {
          setConfirmStartOpen(false);
          navigate('/kniznica/periodka/nastavenia?pick=1');
        }}
        cancelLabel="Späť"
        accent={PHASE.MENSTR}
        onConfirm={handleConfirmPeriodStart}
        onCancel={() => setConfirmStartOpen(false)}
      />
    </Page>
  );
}
