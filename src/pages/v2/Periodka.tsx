import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useCycleData } from '../../features/cycle/useCycleData';
import { useCycleSymptoms } from '../../hooks/useDailyRituals';
import { Page, Eye, Ser, Body, PlusTag, ConfirmSheet, NM } from '../../components/v2/neome';
import { getCycleTipByDay } from '../../data/cycleTips';
import type { DerivedState, CycleData } from '../../features/cycle/types';
import { PHASE_HEADLINES } from '../../features/cycle/constants';
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
  const monthIdx = today.getMonth();
  const yearIdx = today.getFullYear();
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
    if (daysSince < 0) return null;
    const cycleDay = (daysSince % totalDays) + 1;
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

  // When the period is late the cycle-day counter keeps incrementing
  // past totalDays (29, 30, 31…) on purpose — so we know how late
  // we are. But "deň 31 z 28" reads as a bug to users, so swap the
  // eyebrow to a late-period label instead of the of-N pattern.
  const isLate = currentDay > totalDays;
  const daysLate = isLate ? currentDay - totalDays : 0;
  const dayLabel = isLate
    ? `menštruácia mešká · ${daysLate} ${daysLate === 1 ? 'deň' : daysLate < 5 ? 'dni' : 'dní'}`
    : `deň ${currentDay} z ${totalDays}`;

  // Headline copy adapts to phase. Text comes from the shared
  // PHASE_HEADLINES so the home Periodka card reads identically; only
  // the eyebrow and the late-period override are tracker-specific.
  const EYE_SUFFIX: Record<string, string> = {
    menstrual: ' · menštruácia',
    follicular: ' · folikulárna',
    ovulation: ' · ovulácia',
    luteal: ' · luteálna',
  };
  const baseHeadline = PHASE_HEADLINES[currentPhaseKey as keyof typeof PHASE_HEADLINES] ?? PHASE_HEADLINES.follicular;
  const head = isLate
    ? {
        eye: `${monthLabel} · ${dayLabel}`,
        before: 'Cyklus je',
        em: 'predĺžený.',
        body: 'Ak ti menštruácia ešte nezačala, môže to byť normálne. Keď príde, označ jej začiatok v nastaveniach a cyklus sa zarovná.',
      }
    : {
        eye: `${monthLabel} · ${dayLabel}${EYE_SUFFIX[currentPhaseKey] ?? ''}`,
        ...baseHeadline,
      };

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
    customDefs,
    addCustomSymptom,
    removeCustomSymptom,
  } = useCycleSymptoms();
  const { isPremium } = useSubscription();
  const [addingSymptom, setAddingSymptom] = useState(false);
  const [newSymptomText, setNewSymptomText] = useState('');
  // Calendar dots — derive day-of-month for current month from symptomDates.
  const nowDate = new Date();
  const ym = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}`;
  const symptomDays: number[] = symptomDates
    .filter((d) => d.startsWith(ym))
    .map((d) => parseInt(d.slice(8, 10), 10));

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
  const symptoms = allSymptomDefs.map((s) => ({ l: s.l, k: s.k, on: !!todayMap[s.k], custom: s.custom }));

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
  const todayISO = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}-${String(nowDate.getDate()).padStart(2, '0')}`;
  const selectedIsToday = selectedDateISO === todayISO;
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

  // Phase-tailored daily advice — rotates through Gabi's 105-tip library
  // (5 phases × 3 categories × 7 tips/phase) by day-in-phase. Source:
  // src/data/cycleTips.ts. Categories map: pohyb=Body, strava=Nutrition,
  // mysel=Mindset.
  const PILLAR_META: Record<'telo' | 'strava' | 'mysel', { category: 'pohyb' | 'strava' | 'mysel'; label: string; title: string; color: string; img: string; path: string }> = {
    telo:   { category: 'pohyb',  label: 'Pohyb',  title: 'Tvoj pohyb dnes',  color: NM.TERRA, img: 'lifestyle-core-workout.jpg', path: '/kniznica/telo' },
    strava: { category: 'strava', label: 'Strava', title: 'Tvoja strava dnes', color: NM.SAGE,  img: 'testimonial-recipe.jpg',     path: '/kniznica/strava' },
    mysel:  { category: 'mysel',  label: 'Myseľ',  title: 'Tvoja myseľ dnes', color: NM.MAUVE, img: 'section-mind.jpg',           path: '/kniznica/mysel' },
  };

  // Day-in-phase: 1-indexed within the current phase. e.g. on day 1 of
  // menstruation = 1, on day 14 of a 14-day follicular phase = 14.
  const phaseStart = derivedState?.currentPhase?.start ?? 1;
  const dayInPhase = Math.max(1, currentDay - phaseStart + 1);

  // Subphase: only luteal phase has early/late split. We bisect by halfway
  // through the phase length — anything past midpoint is "late".
  const phaseEnd = derivedState?.currentPhase?.end ?? totalDays;
  const phaseLength = Math.max(1, phaseEnd - phaseStart + 1);
  const subphase = currentPhaseKey === 'luteal'
    ? (dayInPhase > phaseLength / 2 ? 'late' : 'early')
    : null;

  const advice = (['telo', 'strava', 'mysel'] as const).map((pillarKey) => {
    const meta = PILLAR_META[pillarKey];
    const tip = getCycleTipByDay(currentPhaseKey, subphase, meta.category, dayInPhase);
    return {
      pillar: meta.label,
      color: meta.color,
      title: meta.title,
      body: tip,
      img: meta.img,
      path: meta.path,
    };
  });

  const headerBlock = (
    <>
      {/* Round 18 top bar — back chevron + centered Gilda title + calendar shortcut */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/domov-new')} aria-label="Späť" style={{ all: 'unset', width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${NM.HAIR_2}`, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
        </button>
        <div style={{ fontFamily: NM.SERIF, fontSize: 20, fontWeight: 400, color: NM.DEEP, letterSpacing: '-0.005em' }}>Cyklus</div>
        <button onClick={() => navigate('/kniznica/periodka/nastavenia')} aria-label="Nastavenia cyklu" style={{ all: 'unset', width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${NM.HAIR_2}`, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>
          </svg>
        </button>
      </div>

      <div style={{ padding: '4px 22px 0' }}>
        <Eye color={NM.GOLD}>{head.eye}</Eye>
        <Ser size={40} style={{ marginTop: 12, lineHeight: 1.05 }}>
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

  const statsBlock = (
      <div style={{ padding: '0 18px 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { eye: 'Priemer',   v: String(totalDays), suf: 'dní', c: NM.DEEP },
          { eye: 'Predpoveď', v: nextPeriodLabel.replace(/\.$/, ''), suf: '', c: PHASE.MENSTR },
          { eye: 'Ovulácia',  v: String(daysToOvulation), suf: 'dní', c: PHASE.OVULAT, prefix: 'o' },
        ].map((s) => (
          <div key={s.eye} style={{ padding: '14px 12px', background: '#fff', border: `1px solid ${NM.HAIR}`, borderRadius: 18, textAlign: 'center' }}>
            <Eye size={9} color={NM.TERTIARY}>{s.eye}</Eye>
            <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
              {s.prefix && <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, fontWeight: 500 }}>{s.prefix}</span>}
              <span style={{ fontFamily: NM.SERIF, fontSize: 26, fontWeight: 400, color: s.c, letterSpacing: '-0.01em', lineHeight: 1 }}>{s.v}</span>
              {s.suf && <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, fontWeight: 500, letterSpacing: '0.04em' }}>{s.suf}</span>}
            </div>
          </div>
        ))}
      </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <Eye>Kalendár cyklu</Eye>
          <div style={{ fontFamily: NM.SERIF, fontSize: 14, color: NM.DEEP, fontWeight: 500, fontStyle: 'italic' }}>{monthLabel} {yearIdx}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 5 }}>
          {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((d) => (
            <div key={d} style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: NM.EYEBROW, textAlign: 'center', fontWeight: 500 }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
          {weeks.flat().map((c, i) => {
            const tint = !c.mute ? phaseTintOf(c.d) : null;
            const today = !c.mute && c.d === todayDate;
            const sym = !c.mute && symptomDays.includes(c.d);
            const selected = !c.mute && selectedDay === c.d;
            const cellPhase = !c.mute ? phaseOf(c.d) : null;
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
                  background: today ? NM.DEEP : tint ?? 'transparent',
                  boxShadow: selected && !today && cellPhase ? `0 0 0 1.5px ${cellPhase}` : 'none',
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
                  color: today ? '#fff' : c.mute ? 'rgba(61,41,33,0.40)' : NM.DEEP,
                  opacity: c.mute ? 0.5 : 1,
                }}>{c.d}</div>
                {sym && (
                  <div style={{ position: 'absolute', bottom: 2.5, display: 'flex', gap: 1.5 }}>
                    {[0, 1, 2].map((k) => (
                      <div key={k} style={{ width: 2, height: 2, borderRadius: 999, background: today ? '#fff' : NM.DEEP, opacity: today ? 1 : 0.55 }} />
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
      </div>
  );

  const symptomsBlock = (
      <div style={{ padding: '28px 18px 0' }}>
        <Eye style={{ marginBottom: 14 }}>Ako sa dnes cítiš</Eye>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {symptoms.map((s) => (
            <div
              key={s.k}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: s.custom ? '6px 6px 6px 14px' : '8px 14px',
                borderRadius: 999,
                background: s.on ? TINT.GOLD_SOFT : '#fff',
                color: s.on ? NM.GOLD : NM.DEEP,
                border: `1px solid ${s.on ? NM.GOLD : NM.HAIR_2}`,
                fontFamily: NM.SANS,
                fontSize: 12.5,
                fontWeight: s.on ? 500 : 400,
              }}
            >
              <button
                type="button"
                onClick={() => toggleSymptom(s.k)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  color: 'inherit',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                {s.on && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                )}
                {s.l}
              </button>
              {s.custom && (
                <button
                  type="button"
                  aria-label={`Vymazať ${s.l}`}
                  onClick={() => removeCustomSymptom(s.k)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    color: NM.TERTIARY,
                  }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {addingSymptom ? (
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
          )}
        </div>
        <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, fontWeight: 400, marginTop: 12, lineHeight: 1.45 }}>
          Označenia sa ukladajú automaticky — deň so záznamom dostane v kalendári bodku.
        </div>
      </div>
  );

  const adviceBlock = (
      <div style={{ padding: '32px 22px 0' }}>
        <Eye color={NM.GOLD}>Pre {currentPhaseName.toLowerCase()} fázu · deň {dayInPhase}</Eye>
        <Ser size={28} style={{ marginTop: 12, lineHeight: 1.1 }}>
          Ako sa dnes môžeš cítiť<br />
          <em style={{ color: NM.GOLD, fontWeight: 400, fontStyle: 'italic' }}>ešte lepšie</em>
        </Ser>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column' }}>
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
  );

  const upcomingBlock = (
      <div style={{ padding: '28px 22px 8px' }}>
        <Eye>Čaká ťa</Eye>
        <div style={{ marginTop: 16 }}>
          {[
            { w: inDaysLabel(daysToOvulation), d: fmtShortDate(ovulationDate), t: 'Začiatok ovulácie', c: PHASE.OVULAT },
            { w: inDaysLabel(daysToMenstruation), d: fmtShortDate(nextPeriodDate), t: 'Nasledujúca menštruácia', c: PHASE.MENSTR },
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
      {ringBlock}
      {fromHome ? (
        <>
          {periodCtaBlock}
          {symptomsBlock}
          {adviceBlock}
          {upcomingBlock}
          {statsBlock}
          {calendarBlock}
        </>
      ) : (
        <>
          {statsBlock}
          {periodCtaBlock}
          {calendarBlock}
          {symptomsBlock}
          {adviceBlock}
          {upcomingBlock}
        </>
      )}
      {dayDetailSheet}
    </>
  );
}

function FreeView({ navigate }: { navigate: (p: string) => void }) {
  const phases = [
    { pillar: 'Menštruácia', c: PHASE.MENSTR, d: 'Telo sa resetuje. Doprajte si pokoj, teplo a jemný pohyb.' },
    { pillar: 'Folikulárna', c: PHASE.FOLLIC, d: 'Energia rastie. Skvelý čas na nové výzvy a silový tréning.' },
    { pillar: 'Ovulácia', c: PHASE.OVULAT, d: 'Vrchol energie a sebavedomia. Sociálny, kreatívny čas.' },
    { pillar: 'Luteálna', c: PHASE.LUTEAL, d: 'Spomaľ a ukľudni sa. Telo sa pripravuje na ďalší cyklus.' },
  ];
  return (
    <>
      <TopBar title="Cyklus" onBack={() => navigate('/domov-new')} />
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
