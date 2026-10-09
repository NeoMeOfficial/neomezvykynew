import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { format, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useCycleData } from '../../features/cycle/useCycleData';
import { useDailyTeloPick } from '../../features/telo/useDailyTeloPick';
import { useRecipes, dailyRecipeOf } from '@/hooks/useRecipes';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useCycleSymptoms } from '../../hooks/useDailyRituals';
import { Page, Eye, Ser, Body, PlusTag, ConfirmSheet, NM } from '../../components/v2/neome';
import { getDailyTips, getStravaWants } from '../../features/cycle/dailyHeadlines';
import type { DerivedState, CycleData } from '../../features/cycle/types';
import { PHASE_NAMES } from '../../features/cycle/constants';
import { getDailyHeadline } from '../../features/cycle/dailyHeadlines';
import { getPhaseRanges, getCyclePrediction } from '../../features/cycle/utils';
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
  navigate: (p: string, opts?: { state?: unknown }) => void;
  cycleData: CycleData;
  derivedState: DerivedState | null;
  onMarkPeriodStart: () => void;
  onMarkPeriodEnd: (date: Date) => void;
  onCorrectPeriod: (start: Date, end: Date | null) => void;
  onSetOvulation: (date: Date | null) => void;
  onAddMissedPeriod: (startISO: string, endISO?: string) => void;
  onAcknowledgeGap: (laterStartISO: string) => void;
  onCorrectHistory: (originalStartISO: string, start: Date, end: Date | null) => void;
  onSetPastOvulation: (cycleStartISO: string, date: Date | null) => void;
}

const SK_MONTHS_FULL = ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'];
const SK_MONTHS_SHORT_LOWER = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];

function PaidView({ navigate, cycleData, derivedState, onMarkPeriodStart, onMarkPeriodEnd, onCorrectPeriod, onSetOvulation, onAddMissedPeriod, onAcknowledgeGap, onCorrectHistory, onSetPastOvulation }: PaidViewProps) {
  // Same featured picks as the home cards (Gabi 2026-09-02): the advice
  // rows below deep-link to the identical phase-aligned exercise/recipe/
  // meditation views instead of the bare section hubs.
  const { pick: teloPick } = useDailyTeloPick();
  const { recipes } = useRecipes();
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
  // The calendar doesn't page before the account existed (Gabi 2026-10-08):
  // months from account creation onward show "Žiadne údaje" until logged,
  // and there's nothing to show from before the account.
  const { user } = useSupabaseAuth();
  const createdAt = user?.created_at ? new Date(user.created_at) : null;
  const createdMonthOffset = createdAt
    ? (createdAt.getFullYear() * 12 + createdAt.getMonth()) - (today.getFullYear() * 12 + today.getMonth())
    : -12;
  const MONTHS_BACK = Math.max(createdMonthOffset, -24); // hard safety cap
  const MONTHS_FWD = 6; // orientational future projection (recalc per cycle)
  const swipeStartX = useRef<number | null>(null);
  const viewedMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthIdx = viewedMonth.getMonth();
  const yearIdx = viewedMonth.getFullYear();
  const monthLabel = SK_MONTHS_FULL[monthIdx];
  const monthShort = SK_MONTHS_SHORT_LOWER[monthIdx];

  // Actual bleed length of THIS cycle when its end was recorded — overrides
  // the assumed periodLength in the calendar so a corrected end date
  // recolours the days immediately (parked bug, fixed 2026-09-02).
  const actualBleedLen = (cycleData.currentPeriodEnd && cycleData.lastPeriodStart
    && cycleData.currentPeriodEnd >= cycleData.lastPeriodStart)
    ? Math.floor((new Date(cycleData.currentPeriodEnd + 'T00:00:00').getTime()
        - new Date(cycleData.lastPeriodStart + 'T00:00:00').getTime()) / 86400000) + 1
    : null;

  // Day-of-month → cycle-day → phase key. Maps a calendar date in the
  // visible month back to a phase. Both the cell tint AND the legend
  // highlight derive from this so they're guaranteed to agree.
  // All real period starts (recorded history + current), newest first.
  // Krok 1 (2026-10-07): the calendar now draws REAL past cycles from
  // history — each with its own real length and recorded bleed — and
  // only projects where there's no data yet (future, or before the
  // earliest record).
  const realStarts = useMemo(() => {
    const starts = [
      ...(cycleData.history ?? []).map((h) => h.startDate),
      ...(cycleData.lastPeriodStart ? [cycleData.lastPeriodStart] : []),
    ].filter(Boolean);
    return Array.from(new Set(starts)).sort(); // ascending ISO
  }, [cycleData.history, cycleData.lastPeriodStart]);

  const daysBetweenISO = (a: string, b: string) =>
    Math.round((new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / 86400000);

  const cycleInfoForCalendarDay = (d: number): { cycleDay: number; key: string | null; confirmed: boolean; projected: boolean } | null => {
    if (!cycleData.lastPeriodStart) return null;
    const target = new Date(yearIdx, monthIdx, d);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    const targetISO = `${y}-${m}-${day}`;
    // "Confirmed" = anchored to a real recorded start AND already happened
    // (<= today). Confirmed days render vivid; projected days (future, or
    // backward projection before any record) render pastel.
    const todayISOc = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Anchor = the latest real start on or before this date.
    let anchorIdx = -1;
    for (let i = realStarts.length - 1; i >= 0; i--) {
      if (realStarts[i] <= targetISO) { anchorIdx = i; break; }
    }

    if (anchorIdx === -1) {
      // Before the earliest record → project backward with current length.
      const start = new Date(cycleData.lastPeriodStart + 'T00:00:00');
      const daysSince = Math.floor((target.getTime() - start.getTime()) / 86400000);
      const cd = ((daysSince % totalDays) + totalDays) % totalDays + 1;
      return { cycleDay: cd, key: phases.find((p) => cd >= p.start && cd <= p.end)?.key ?? null, confirmed: false, projected: true };
    }

    const anchor = realStarts[anchorIdx];
    const nextStart = realStarts[anchorIdx + 1]; // a later real start, if any
    const isCurrentCycle = anchorIdx === realStarts.length - 1;

    // Real length of THIS cycle: gap to the next real start, else the
    // (recalculated) current cycle length for the ongoing/future cycle.
    const thisLen = nextStart ? Math.max(1, daysBetweenISO(anchor, nextStart)) : totalDays;
    const rawDay = daysBetweenISO(anchor, targetISO) + 1;

    // Real bleed length for this cycle: the current cycle uses the live
    // recorded end; a past cycle uses its history entry's end if present.
    let bleedLen: number | null = null;
    if (isCurrentCycle) {
      bleedLen = actualBleedLen;
    } else {
      const entry = (cycleData.history ?? []).find((h) => h.startDate === anchor);
      if (entry?.endDate && entry.endDate >= anchor) bleedLen = daysBetweenISO(anchor, entry.endDate) + 1;
    }

    // Past cycles are BOUNDED by the next real start, so rawDay stays in
    // [1, thisLen] and maps straight to a phase. The current cycle (and
    // the future) is open-ended: once you pass the cycle length — i.e.
    // you're overdue — wrap forward so the calendar keeps projecting the
    // next predicted cycle instead of going blank (Krok 1 fix 2026-10-07).
    // Current cycle: normal phases within the cycle; once OVERDUE, the days
    // up to today stay in the last phase (luteal — "cyklus predĺžený"), so
    // the calendar agrees with the header/ring (day 39 = luteal), instead of
    // wrapping today into a phantom next cycle. Only days AFTER today project
    // forward (orientational future).
    // Beyond the cycle length:
    //  • OVERDUE (no new period logged): the luteal phase extends REALLY up
    //    to today, and from TOMORROW a fresh predicted cycle begins (period
    //    expected tomorrow, then the planned phases). Because `currentDay`
    //    grows each day, this whole plan slides forward one day per day until
    //    she logs her period — truthful "cyklus predĺžený" with the plan
    //    rolling ahead.
    //  • NOT overdue: future days wrap forward to project the next cycle.
    // An UN-resolved long gap between two recorded periods (gap > 1.5× her
    // normal length, not acknowledged) must NOT stretch one cycle's phases
    // across the whole gap (that balloons follicular to ~40 days). Instead we
    // render a NORMAL-length cycle from the start and clamp the leftover gap
    // days to luteal — exactly like the current overdue cycle ("meškajúca
    // perióda"). Once she resolves the gap (adds the missed period, or
    // acknowledges it was genuinely one long cycle) it renders as a full
    // stretched cycle (delayed ovulation + 14-day luteal).
    const isUnresolvedGap = !isCurrentCycle && !!nextStart
      && thisLen > Math.round(totalDays * 1.5)
      && !(cycleData.acknowledgedGaps ?? []).includes(nextStart);
    const effLen = isUnresolvedGap ? totalDays : thisLen;
    const phaseDay = isCurrentCycle
      ? (rawDay <= thisLen
          ? rawDay
          : (currentDay > thisLen
              ? (rawDay <= currentDay ? thisLen : ((rawDay - currentDay - 1) % thisLen) + 1)
              : ((rawDay - 1) % thisLen + thisLen) % thisLen + 1))
      : (isUnresolvedGap ? Math.min(rawDay, effLen) : rawDay);
    const ranges = getPhaseRanges(effLen, cycleData.periodLength ?? 5);
    let key = ranges.find((r) => phaseDay >= r.start && phaseDay <= r.end)?.key ?? null;
    // Bleed override only on the REAL bleed days of this cycle (rawDay,
    // not the wrapped projection).
    if (bleedLen !== null && rawDay <= bleedLen) {
      key = 'menstrual';
    } else if (bleedLen !== null && rawDay <= effLen && key === 'menstrual') {
      key = 'follicular';
    }
    // Recorded ovulation (current cycle only): the exact day she logged wins,
    // and the generic predicted ovulation band is reassigned to the adjacent
    // phase so the calendar doesn't show two ovulation marks.
    const cycleOvul = isCurrentCycle ? cycleData.ovulationOverride : cycleData.ovulationOverrides?.[anchor];
    if (cycleOvul && cycleOvul >= anchor) {
      if (targetISO === cycleOvul) {
        key = 'ovulation';
      } else if (key === 'ovulation') {
        key = targetISO < cycleOvul ? 'follicular' : 'luteal';
      }
    }
    // "Projected" = a FUTURE prediction (the wrapped next-cycle region,
    // beyond today) — these show only an outline for the predicted period,
    // no phase fill. Real cycle days (past, current, overdue-to-today) are
    // not projected → full phase colour.
    // Faded ("planned/unconfirmed") when: future projection of the current
    // cycle, OR the overdue tail of an unresolved long gap — those days have
    // no confirmed period, so they read as expected, not recorded.
    const projected = (isCurrentCycle && rawDay > thisLen && targetISO > todayISOc)
      || (isUnresolvedGap && rawDay > effLen);
    return { cycleDay: rawDay, key, confirmed: targetISO <= todayISOc, projected };
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

  // Predicted next-period date — anchored to lastPeriodStart + cycleLength
  // (the SAME source as the calendar), NOT `today + daysToMenstruation`.
  // The old form clamped to 0 once overdue, so the text showed "today"
  // while the calendar showed the real predicted day (Sam 2026-10-07:
  // "5.10 v kalendári vs 7.10 v texte"). isLate (currentDay > totalDays)
  // drives the "mešká" wording elsewhere; the date itself stays honest.
  const nextPeriodDate = (() => {
    if (cycleData.lastPeriodStart) {
      const d = new Date(cycleData.lastPeriodStart + 'T00:00:00');
      d.setDate(d.getDate() + totalDays);
      return d;
    }
    const d = new Date(today);
    d.setDate(d.getDate() + daysToMenstruation);
    return d;
  })();
  const nextPeriodLabel = `${nextPeriodDate.getDate()}. ${SK_MONTHS_SHORT_LOWER[nextPeriodDate.getMonth()]}.`;

  // Krok 2: honest range prediction + irregularity flag.
  const prediction = getCyclePrediction(cycleData);
  const fmtDM = (d: Date) => `${d.getDate()}. ${SK_MONTHS_SHORT_LOWER[d.getMonth()]}`;
  const rangeLabel = (a: Date, b: Date) =>
    a.getMonth() === b.getMonth()
      ? `${a.getDate()}.–${b.getDate()}. ${SK_MONTHS_SHORT_LOWER[b.getMonth()]}`
      : `${fmtDM(a)} – ${fmtDM(b)}`;
  const daysWord = (n: number) => (n === 1 ? 'deň' : n >= 2 && n <= 4 ? 'dni' : 'dní');

  // Ovulation anchored to lastPeriodStart + (cycle-day of ovulation − 1),
  // so it auto-recomputes the moment a new period start is logged — the
  // same fix as the next-period date (Sam 2026-10-07). If this cycle's
  // ovulation already passed, show the next cycle's.
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  // User-recorded actual ovulation for THIS cycle, honoured only if it
  // falls on/after the current period start (a stale override is ignored
  // as a safety net; setLastPeriodStart also clears it on a new cycle).
  const ovulationOverrideISO =
    cycleData.ovulationOverride && cycleData.lastPeriodStart && cycleData.ovulationOverride >= cycleData.lastPeriodStart
      ? cycleData.ovulationOverride
      : null;
  // This cycle's ovulation: the recorded day if present, else predicted
  // from the current period start + ovulation day.
  const currentCycleOvulation = (() => {
    if (ovulationOverrideISO) return new Date(ovulationOverrideISO + 'T00:00:00');
    const base = cycleData.lastPeriodStart ? new Date(cycleData.lastPeriodStart + 'T00:00:00') : new Date(today);
    const d = new Date(base);
    d.setDate(d.getDate() + (ovulationStart - 1));
    return d;
  })();
  const ovulationPassed = currentCycleOvulation.getTime() < todayMidnight;
  // "Next" ovulation: this cycle's if still upcoming, else next cycle's
  // (prediction rolls forward by the current cycle length).
  const ovulationDate = ovulationPassed
    ? new Date(currentCycleOvulation.getTime() + totalDays * 86400000)
    : currentCycleOvulation;
  const daysToOvulation = Math.max(0, Math.round((ovulationDate.getTime() - todayMidnight) / 86400000));
  const fmtShortDate = (d: Date) => `${d.getDate()}. ${SK_MONTHS_SHORT_LOWER[d.getMonth()]}.`;

  // Actual bleed tracking: "Skončila dnes" sets currentPeriodEnd, which
  // overrides the assumed periodLength for this cycle's card states.
  const periodEnded = !!cycleData.currentPeriodEnd
    && !!cycleData.lastPeriodStart
    && cycleData.currentPeriodEnd >= cycleData.lastPeriodStart;
  const bleedingOngoing = !periodEnded && currentDay <= periodLength;

  // Ring phase arcs for the CURRENT cycle, adjusted so the dial matches the
  // table + calendar: the menstrual arc follows the REAL recorded bleed
  // length (if "Skončila dnes" was used), and the ovulation arc follows the
  // RECORDED ovulation day (the ✎ override). Falls back to the shared
  // generic ranges when nothing differs, so past/first-run views are
  // unchanged.
  const ringPhases = (() => {
    const start = cycleData.lastPeriodStart;
    if (!start) return phases;
    const bleed = (actualBleedLen && actualBleedLen >= 1 && actualBleedLen <= totalDays)
      ? actualBleedLen
      : periodLength;
    let ovDay = ovulationStart;
    if (ovulationOverrideISO) {
      const d = daysBetweenISO(start, ovulationOverrideISO) + 1;
      if (d > bleed && d < totalDays) ovDay = d;
    }
    if (bleed === periodLength && ovDay === ovulationStart) return phases; // nothing recorded differs
    const r = [{ key: 'menstrual', name: 'Menštruácia', start: 1, end: bleed }];
    if (bleed + 1 <= ovDay - 1) r.push({ key: 'follicular', name: 'Folikulárna', start: bleed + 1, end: ovDay - 1 });
    r.push({ key: 'ovulation', name: 'Ovulácia', start: ovDay, end: ovDay });
    if (ovDay + 1 <= totalDays) r.push({ key: 'luteal', name: 'Luteálna', start: ovDay + 1, end: totalDays });
    return r;
  })();

  // ✎ editor for the last period's dates ("Tvoj cyklus" section).
  const [periodEditOpen, setPeriodEditOpen] = useState(false);
  const [draftStart, setDraftStart] = useState('');
  const [draftEnd, setDraftEnd] = useState('');
  // When editing a PAST cycle's period, the original history start it maps
  // to (null = editing the current period).
  const [editHistoryStart, setEditHistoryStart] = useState<string | null>(null);
  const openPeriodEditor = () => {
    setEditHistoryStart(null);
    setDraftStart(cycleData.lastPeriodStart ?? '');
    setDraftEnd(periodEnded ? cycleData.currentPeriodEnd! : '');
    setPeriodEditOpen(true);
  };
  const openHistoryPeriodEditor = (origStart: string, endISO: string | null) => {
    setEditHistoryStart(origStart);
    setDraftStart(origStart);
    setDraftEnd(endISO ?? '');
    setPeriodEditOpen(true);
  };
  const editTodayISO = format(today, 'yyyy-MM-dd');
  const draftValid = !!draftStart && draftStart <= editTodayISO
    && (!draftEnd || (draftEnd >= draftStart && draftEnd <= editTodayISO));
  const savePeriodEdit = () => {
    if (!draftValid) return;
    const start = new Date(draftStart + 'T00:00:00');
    const end = draftEnd ? new Date(draftEnd + 'T00:00:00') : null;
    if (editHistoryStart) onCorrectHistory(editHistoryStart, start, end);
    else onCorrectPeriod(start, end);
    setPeriodEditOpen(false);
  };

  // ✎ editor for the recorded ovulation day ("Tvoj cyklus" section). Lets
  // her correct the ovulation if she noticed it fell on a different day
  // than predicted (e.g. from tests or symptoms).
  const [ovulEditOpen, setOvulEditOpen] = useState(false);
  // Fáza 2 — "Chýba záznam" resolve sheet (forgot a period / long cycle).
  const [gapSheetOpen, setGapSheetOpen] = useState(false);
  const [gapPickMode, setGapPickMode] = useState(false);
  const [gapDraft, setGapDraft] = useState('');
  const [gapEndDraft, setGapEndDraft] = useState('');
  // The gap currently being resolved (from the month prompt OR a day tap).
  const [activeGap, setActiveGap] = useState<{ prevISO: string; laterISO: string; estimatedISO: string } | null>(null);
  const [draftOvul, setDraftOvul] = useState('');
  // Which cycle's ovulation the editor targets: null = current cycle, else
  // a past cycle (its start + the next start bounding it).
  const [editOvulCycle, setEditOvulCycle] = useState<{ anchor: string; nextStart: string | null } | null>(null);
  const openOvulationEditor = () => {
    setEditOvulCycle(null);
    // Current cycle: open on the recorded day or the current prediction.
    setDraftOvul(ovulationOverrideISO ?? format(currentCycleOvulation, 'yyyy-MM-dd'));
    setOvulEditOpen(true);
  };
  const openPastOvulationEditor = (anchor: string, nextStart: string | null) => {
    setEditOvulCycle({ anchor, nextStart });
    const base = new Date(anchor + 'T00:00:00');
    base.setDate(base.getDate() + (ovulationStart - 1));
    setDraftOvul(cycleData.ovulationOverrides?.[anchor] ?? format(base, 'yyyy-MM-dd'));
    setOvulEditOpen(true);
  };
  const ovulMinISO = editOvulCycle ? editOvulCycle.anchor : (cycleData.lastPeriodStart ?? undefined);
  const ovulMaxISO = editOvulCycle
    ? (editOvulCycle.nextStart
        ? format(new Date(new Date(editOvulCycle.nextStart + 'T00:00:00').getTime() - 86400000), 'yyyy-MM-dd')
        : editTodayISO)
    : editTodayISO;
  const draftOvulValid = !!draftOvul && draftOvul <= ovulMaxISO && (!ovulMinISO || draftOvul >= ovulMinISO);
  const saveOvulEdit = () => {
    if (!draftOvulValid) return;
    const d = new Date(draftOvul + 'T00:00:00');
    if (editOvulCycle) onSetPastOvulation(editOvulCycle.anchor, d);
    else onSetOvulation(d);
    setOvulEditOpen(false);
  };
  const clearOvulOverride = () => {
    if (editOvulCycle) onSetPastOvulation(editOvulCycle.anchor, null);
    else onSetOvulation(null);
    setOvulEditOpen(false);
  };
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
  const daysLate = isLate ? Math.max(1, currentDay - totalDays - 1) : 0;

  // Headline copy comes from the shared getDailyHeadline (sub-phase
  // accurate, rotates daily) so the home Periodka card reads identically;
  // the 'late' bucket covers the overdue override.
  const head = getDailyHeadline(currentDay, totalDays, periodLength);

  // Build calendar grid for the current month, Mon-first
  type Cell = { d: number; mute?: boolean };
  const firstOfMonth = new Date(yearIdx, monthIdx, 1);
  const lastOfMonth = new Date(yearIdx, monthIdx + 1, 0);
  const lastOfPrevMonth = new Date(yearIdx, monthIdx, 0);

  // Fáza 1 — per-month status for the viewed month:
  //  'recorded' = a logged period overlaps this month,
  //  'planned'  = future month (orientational projection),
  //  'gap'      = a gap >1.5× the cycle between two logged starts covers
  //               this month → a period was likely NOT logged (vs a merely
  //               long cycle, which stays under the threshold → no flag).
  const mStart = firstOfMonth.getTime();
  const mEnd = lastOfMonth.getTime();
  // Unacknowledged gap (>1.5× cycle between two logged starts) that covers
  // the viewed month — carries the prev/later starts + an estimated missed
  // start (prev + cycle length) for the resolve sheet.
  const ackGaps = new Set(cycleData.acknowledgedGaps ?? []);
  const monthGapInfo = (() => {
    for (let i = 1; i < realStarts.length; i++) {
      const prevISO = realStarts[i - 1];
      const laterISO = realStarts[i];
      if (ackGaps.has(laterISO)) continue;
      const a = new Date(prevISO + 'T00:00:00').getTime();
      const b = new Date(laterISO + 'T00:00:00').getTime();
      if (Math.round((b - a) / 86400000) > Math.round(totalDays * 1.5) && a < mEnd && b > mStart) {
        const est = new Date(a + totalDays * 86400000);
        return { prevISO, laterISO, estimatedISO: format(est, 'yyyy-MM-dd') };
      }
    }
    return null;
  })();
  const monthStatus: 'ongoing' | 'recorded' | 'planned' | 'gap' | 'none' | null = (() => {
    const lps = cycleData.lastPeriodStart ? new Date(cycleData.lastPeriodStart + 'T00:00:00').getTime() : null;
    if (lps !== null && !periodEnded && bleedingOngoing && lps >= mStart && lps <= mEnd) return 'ongoing';
    const hasRecorded = realStarts.some((s) => {
      const start = new Date(s + 'T00:00:00').getTime();
      const entry = (cycleData.history ?? []).find((h) => h.startDate === s);
      const endISO = s === cycleData.lastPeriodStart
        ? (cycleData.currentPeriodEnd && cycleData.currentPeriodEnd >= s ? cycleData.currentPeriodEnd : null)
        : (entry?.endDate && entry.endDate >= s ? entry.endDate : null);
      const end = endISO ? new Date(endISO + 'T00:00:00').getTime() : start + (periodLength - 1) * 86400000;
      return start <= mEnd && end >= mStart;
    });
    if (hasRecorded) return 'recorded';
    if (monthOffset > 0) return 'planned';
    if (monthGapInfo) return 'gap';
    // Past/current month from account creation onward, nothing logged yet.
    return 'none';
  })();
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

    // Krok 3: cross-cycle recurrence — "v X z posledných Y cyklov". Each
    // real start opens a cycle window [start, nextStart); the newest is
    // open-ended (current cycle). Count how many of the last ≤4 windows
    // contain at least one logged occurrence.
    const windows: [string, string][] = realStarts.map((s, i) => [s, realStarts[i + 1] ?? '9999-12-31']);
    const recentWindows = windows.slice(-4);
    const inCycles = recentWindows.filter(([s, e]) => filteredDates.some((d) => d >= s && d < e)).length;
    const recurrence = recentWindows.length >= 2 ? { inCycles, ofCycles: recentWindows.length } : null;

    return { total: filteredDates.length, top, recentDays, recurrence };
  })();

  // ── Day-detail sheet (tap on a calendar day) ────────────────────────
  const PHASE_LOCATIVE: Record<string, string> = {
    menstrual: 'v menštruačnej fáze',
    follicular: 'vo folikulárnej fáze',
    ovulation: 'vo fáze ovulácie',
    luteal: 'v luteálnej fáze',
  };
  const selectedInfo = selectedDay !== null ? cycleInfoForCalendarDay(selectedDay) : null;
  const selectedDateISO0 = selectedDay !== null
    ? `${yearIdx}-${String(monthIdx + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null;
  // Which recorded cycle the tapped day belongs to (for editing that cycle's
  // period). anchor = latest real start on/before the day.
  const selAnchor = selectedDateISO0
    ? ([...realStarts].reverse().find((s) => s <= selectedDateISO0) ?? null)
    : null;
  const selIsCurrentCycle = !!selAnchor && selAnchor === cycleData.lastPeriodStart;
  const selHistoryEntry = selAnchor && !selIsCurrentCycle
    ? (cycleData.history ?? []).find((h) => h.startDate === selAnchor) ?? null
    : null;
  const selNextStart = selAnchor ? (realStarts.find((s) => s > selAnchor) ?? null) : null;
  // Is the tapped day inside an unacknowledged GAP (its cycle is abnormally
  // long)? If so, offer "Doplniť" (add a missed period) rather than editing
  // the stretched previous cycle.
  // Only the overdue TAIL of an unresolved long gap (days beyond her normal
  // cycle length) is a "fill a missed period" zone. The real period days and
  // the normal-cycle phases at the START of the gap stay editable as usual.
  const selDayGapInfo = (selAnchor && selNextStart && selectedDateISO0
    && Math.round((new Date(selNextStart + 'T00:00:00').getTime() - new Date(selAnchor + 'T00:00:00').getTime()) / 86400000) > Math.round(totalDays * 1.5)
    && (daysBetweenISO(selAnchor, selectedDateISO0) + 1) > totalDays
    && !(cycleData.acknowledgedGaps ?? []).includes(selNextStart))
    ? { prevISO: selAnchor, laterISO: selNextStart, estimatedISO: format(new Date(new Date(selAnchor + 'T00:00:00').getTime() + totalDays * 86400000), 'yyyy-MM-dd') }
    : null;
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

  const dayDetailSheet = selectedDay !== null ? createPortal((
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => setSelectedDay(null)}
      style={{ position: 'fixed', inset: 0, background: 'rgba(42,26,20,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 9999 }}
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

        {/* Day in a GAP (stretched long cycle) → ADD a missed period here,
            not edit the previous cycle. */}
        {selDayGapInfo && (
          <button
            onClick={() => {
              setActiveGap(selDayGapInfo);
              setGapDraft(selDayGapInfo.estimatedISO);
              setGapEndDraft(format(addDays(new Date(selDayGapInfo.estimatedISO + 'T00:00:00'), (cycleData.periodLength ?? 5) - 1), 'yyyy-MM-dd'));
              setGapPickMode(true);
              setGapSheetOpen(true);
              setSelectedDay(null);
            }}
            style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, padding: '9px 16px', borderRadius: 999, background: '#fff', border: `1px solid ${NM.TERRA}`, color: NM.TERRA, fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Doplniť chýbajúcu periódu
          </button>
        )}

        {/* Contextual edit from any day of a REAL cycle (not a gap). Phases
            are derived, so we only edit the two anchors: the period dates and
            (current cycle) the ovulation day. Projections aren't editable. */}
        {!selDayGapInfo && selectedInfo && !selectedInfo.projected && selAnchor && (() => {
          const isOvul = selectedInfo.key === 'ovulation';
          const col = isOvul ? PHASE.OVULAT : PHASE.MENSTR;
          const label = isOvul
            ? 'Upraviť deň ovulácie'
            : (selIsCurrentCycle ? 'Upraviť dátumy periódy' : 'Upraviť periódu tohto cyklu');
          return (
            <button
              onClick={() => {
                if (isOvul && selIsCurrentCycle) openOvulationEditor();
                else if (isOvul) openPastOvulationEditor(selAnchor, selNextStart);
                else if (selIsCurrentCycle) openPeriodEditor();
                else openHistoryPeriodEditor(selAnchor, selHistoryEntry?.endDate ?? null);
                setSelectedDay(null);
              }}
              style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, padding: '9px 16px', borderRadius: 999, background: '#fff', border: `1px solid ${col}`, color: col, fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
              {label}
            </button>
          );
        })()}

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
  ), document.body) : null;

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

  // Arrow targets mirror the home cards exactly: telo → today's phase pick
  // in the player (with "Ďalšie" + favourites below), strava → recept dňa
  // detail, myseľ → the Myseľ section with today's meditation featured.
  const dailyRecipe = dailyRecipeOf(recipes, currentPhaseKey, getStravaWants(currentDay, totalDays, periodLength));
  const advice = (['telo', 'strava', 'mysel'] as const).map((pillarKey) => {
    const meta = PILLAR_META[pillarKey];
    let path = meta.path;
    let state: unknown;
    if (pillarKey === 'telo' && teloPick) {
      path = teloPick.href;
      state = teloPick.playerState;
    } else if (pillarKey === 'strava' && dailyRecipe) {
      path = `/recept/${dailyRecipe.id}`;
    }
    return {
      pillar: meta.label,
      color: meta.color,
      title: meta.title,
      body: dailyTips[meta.category],
      img: meta.img,
      path,
      state,
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
        phaseRanges={ringPhases}
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
              onClick={() => setMonthOffset((o) => Math.max(o - 1, MONTHS_BACK))}
              aria-label="Predchádzajúci mesiac"
              style={{ all: 'unset', cursor: monthOffset <= MONTHS_BACK ? 'default' : 'pointer', width: 40, height: 40, display: 'grid', placeItems: 'center', color: monthOffset <= MONTHS_BACK ? NM.HAIR_2 : NM.MUTED }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <div style={{ fontFamily: NM.SERIF, fontSize: 14, color: NM.DEEP, fontWeight: 500, fontStyle: 'italic', minWidth: 96, textAlign: 'center' }}>{monthLabel} {yearIdx}</div>
            <button
              onClick={() => setMonthOffset((o) => Math.min(o + 1, MONTHS_FWD))}
              aria-label="Ďalší mesiac"
              style={{ all: 'unset', cursor: monthOffset >= MONTHS_FWD ? 'default' : 'pointer', width: 40, height: 40, display: 'grid', placeItems: 'center', color: monthOffset >= MONTHS_FWD ? NM.HAIR_2 : NM.MUTED }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>

        {/* Month status is now conveyed by the day colours (vivid = confirmed,
            pastel = projected). The ONLY status that still needs words is a
            gap — a small tappable prompt that opens the resolve sheet. */}
        {monthStatus === 'gap' && monthGapInfo && (
          <button
            onClick={() => { setActiveGap(monthGapInfo); setGapDraft(monthGapInfo.estimatedISO); setGapEndDraft(format(addDays(new Date(monthGapInfo.estimatedISO + 'T00:00:00'), (cycleData.periodLength ?? 5) - 1), 'yyyy-MM-dd')); setGapPickMode(false); setGapSheetOpen(true); }}
            style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, margin: '-2px 0 10px', fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERRA, fontWeight: 600 }}
          >
            Chýba záznam — možno si vynechala periódu — doplniť
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={NM.TERRA} strokeWidth="2.4" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        )}

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
            if (dx > 48) setMonthOffset((o) => Math.max(o - 1, MONTHS_BACK));
            else if (dx < -48) setMonthOffset((o) => Math.min(o + 1, MONTHS_FWD));
          }}
        >
          {weeks.flat().map((c, i) => {
            const info = !c.mute ? cycleInfoForCalendarDay(c.d) : null;
            const cellKey = info?.key ?? null;
            const isProjected = !!info?.projected;
            // Real (recorded/current) cycle days → full pastel phase fill.
            // Future prediction → the SAME phase colours but faded (still
            // distinguishable, reads as "orientačná predpoveď" — useful for
            // planning). The predicted PERIOD days additionally get a light
            // outline so they stand out. (Sam 2026-10-09.)
            const PROJECTED_ALPHA = '59'; // ~35% — tunable
            const tint = cellKey
              ? (isProjected ? `${phaseTintByKey[cellKey]}${PROJECTED_ALPHA}` : phaseTintByKey[cellKey])
              : null;
            const predictedPeriod = isProjected && cellKey === 'menstrual';
            const today = !c.mute && monthOffset === 0 && c.d === todayDate;
            const sym = !c.mute && symptomDays.includes(c.d);
            const selected = !c.mute && selectedDay === c.d;
            const cellPhase = cellKey ? phaseColorByKey[cellKey] : null;
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
                    : selected && !today && !filterHit && cellPhase ? `0 0 0 1.5px ${cellPhase}`
                    : predictedPeriod && !today && !filterHit ? `inset 0 0 0 1.5px ${PHASE.MENSTR}7A`
                    : 'none',
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
                    {filterPhaseSummary.recurrence && filterPhaseSummary.recurrence.inCycles >= 1 && (
                      <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.DEEP, marginTop: 3, lineHeight: 1.45 }}>
                        Objavilo sa v{' '}
                        <strong style={{ fontWeight: 600 }}>
                          {filterPhaseSummary.recurrence.inCycles} z posledných {filterPhaseSummary.recurrence.ofCycles} cyklov
                        </strong>
                        {filterPhaseSummary.recurrence.inCycles >= Math.ceil(filterPhaseSummary.recurrence.ofCycles * 0.6)
                          ? ' — zdá sa, že sa to opakuje pravidelne.'
                          : '.'}
                      </div>
                    )}
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
            {isLate ? `mešká ${daysLate} ${daysLate === 1 ? 'deň' : daysLate >= 2 && daysLate <= 4 ? 'dni' : 'dní'}` : nextPeriodLabel.replace(/\.$/, '')}
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
              onClick={() => navigate(r.path, r.state ? { state: r.state } : undefined)}
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

  // "Tvoj cyklus" (Gabi 2026-09-02, replaces "Čaká ťa"): two columns —
  // Posledná (recorded past, editable via ✎ on the period row) and
  // Nasledujúca (computed predictions, deliberately NOT editable).
  const fmtNumDate = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`;
  const lastStartDate = cycleData.lastPeriodStart ? new Date(cycleData.lastPeriodStart + 'T00:00:00') : null;
  const lastEndDate = periodEnded ? new Date(cycleData.currentPeriodEnd! + 'T00:00:00') : null;
  const assumedEndDate = lastStartDate ? new Date(lastStartDate.getTime() + (periodLength - 1) * 86400000) : null;
  const lastPeriodLabel = !lastStartDate
    ? '—'
    : lastEndDate
      ? `${fmtNumDate(lastStartDate)} – ${fmtNumDate(lastEndDate)}`
      : bleedingOngoing
        ? `od ${fmtNumDate(lastStartDate)}`
        : `${fmtNumDate(lastStartDate)} – ${fmtNumDate(assumedEndDate!)}`;
  // Recorded/predicted ovulation flows from currentCycleOvulation: if this
  // cycle's ovulation already happened it IS the "last"; otherwise the last
  // one was in the previous cycle.
  const lastOvulationDate = !lastStartDate
    ? null
    : ovulationPassed
      ? currentCycleOvulation
      : new Date(currentCycleOvulation.getTime() - totalDays * 86400000);

  // Concrete predicted day (Sam 2026-10-07): a start-uncertainty RANGE
  // here clashed with the 'last period' row, which shows the bleed
  // DURATION as a range — two different meanings of X–Y side by side read
  // as confusing. The sub-line carries context (how soon / overdue /
  // still learning); the range logic stays for the irregularity warnings.
  const periodNext = fmtNumDate(nextPeriodDate);
  const periodNextSub = isLate
    ? `mešká ${daysLate} ${daysWord(daysLate)}`
    : prediction.learning
      ? `odhad · o ${daysToMenstruation} ${daysWord(daysToMenstruation)}`
      : inDaysLabel(daysToMenstruation).toLowerCase();
  const cyclusRows: { t: string; c: string; last: string; next: string; nextSub?: string; onEdit?: () => void; editColor?: string; editLabel?: string }[] = [
    { t: 'Perióda', c: PHASE.MENSTR, last: lastPeriodLabel, next: periodNext, nextSub: periodNextSub, onEdit: openPeriodEditor, editColor: PHASE.MENSTR, editLabel: 'Upraviť dátumy poslednej periódy' },
    { t: 'Ovulácia', c: PHASE.OVULAT, last: lastOvulationDate ? fmtNumDate(lastOvulationDate) : '—', next: fmtNumDate(ovulationDate), nextSub: inDaysLabel(daysToOvulation).toLowerCase(), onEdit: openOvulationEditor, editColor: PHASE.OVULAT, editLabel: 'Upraviť deň ovulácie' },
    { t: 'Dĺžka cyklu', c: NM.GOLD, last: `${totalDays} dní`, next: `~${totalDays} dní`, nextSub: 'podľa posledných cyklov' },
  ];

  const upcomingBlock = (
      <div style={{ padding: '28px 22px 8px' }}>
        <Eye>Tvoj cyklus</Eye>
        <div style={{ marginTop: 16 }}>
          {/* Column headers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 6 }}>
            <div style={{ width: 8, flexShrink: 0 }} />
            <div style={{ flex: 1 }} />
            <div style={{ width: 104, fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: NM.TERTIARY, fontWeight: 500 }}>Posledná</div>
            <div style={{ width: 88, fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: NM.TERTIARY, fontWeight: 500, textAlign: 'right' }}>Nasledujúca</div>
          </div>
          {cyclusRows.map((u, i, arr) => (
            <div
              key={u.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 999, background: u.c, flexShrink: 0 }} />
              <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400 }}>{u.t}</div>
              <div style={{ width: 104, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: NM.SERIF, fontSize: 13.5, color: NM.DEEP, letterSpacing: '-0.005em', whiteSpace: 'nowrap' }}>{u.last}</span>
                {u.onEdit && (
                  <button
                    onClick={u.onEdit}
                    aria-label={u.editLabel}
                    style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', padding: 4, margin: -4, marginLeft: -2 }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={u.editColor ?? PHASE.MENSTR} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>
                )}
              </div>
              <div style={{ width: 88, textAlign: 'right' }}>
                <div style={{ fontFamily: NM.SERIF, fontSize: 13.5, color: NM.DEEP, letterSpacing: '-0.005em', whiteSpace: 'nowrap' }}>{u.next}</div>
                {u.nextSub && (
                  <div style={{ fontFamily: NM.SANS, fontSize: 9.5, color: NM.TERTIARY, fontWeight: 400, marginTop: 2 }}>{u.nextSub}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
  );

  // Bottom sheet for correcting the last period's dates. Portal to body —
  // PWA rule: overlays must escape the layout or BottomNav covers them.
  const dateInputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 14px', boxSizing: 'border-box',
    background: '#fff', border: `1px solid ${NM.HAIR_2}`, borderRadius: 14,
    fontFamily: NM.SANS, fontSize: 14, color: NM.DEEP, outline: 'none',
  };
  const periodEditSheet = periodEditOpen ? createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(42,26,20,0.55)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={() => setPeriodEditOpen(false)} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', width: '100%', background: NM.BG, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '22px 22px calc(env(safe-area-inset-bottom) + 22px)', boxShadow: '0 -10px 32px rgba(61,41,33,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 38, height: 4, borderRadius: 999, background: NM.HAIR_2 }} />
        </div>
        <Eye color={PHASE.MENSTR}>Posledná perióda</Eye>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, marginBottom: 6 }}>Začiatok</div>
          <input
            type="date"
            value={draftStart}
            max={todayISO}
            onChange={(e) => setDraftStart(e.target.value)}
            style={dateInputStyle}
          />
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, marginBottom: 6 }}>Koniec</div>
          <input
            type="date"
            value={draftEnd}
            min={draftStart || undefined}
            max={todayISO}
            onChange={(e) => setDraftEnd(e.target.value)}
            style={dateInputStyle}
          />
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, marginTop: 6 }}>
            {draftEnd ? 'Dĺžka krvácania sa prepočíta automaticky.' : 'Nechaj prázdne, ak perióda ešte trvá.'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={() => setPeriodEditOpen(false)}
            style={{ all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 999, border: `1px solid ${NM.HAIR_2}`, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}
          >
            Zrušiť
          </button>
          <button
            onClick={savePeriodEdit}
            style={{ all: 'unset', cursor: draftValid ? 'pointer' : 'default', flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 999, background: draftValid ? PHASE.MENSTR : NM.HAIR_2, color: '#fff', fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, opacity: draftValid ? 1 : 0.7 }}
          >
            Uložiť
          </button>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  // Bottom sheet for recording the actual ovulation day.
  const ovulEditSheet = ovulEditOpen ? createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(42,26,20,0.55)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={() => setOvulEditOpen(false)} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', width: '100%', background: NM.BG, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '22px 22px calc(env(safe-area-inset-bottom) + 22px)', boxShadow: '0 -10px 32px rgba(61,41,33,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 38, height: 4, borderRadius: 999, background: NM.HAIR_2 }} />
        </div>
        <Eye color={PHASE.OVULAT}>Deň ovulácie</Eye>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, marginBottom: 6 }}>Kedy si ovulovala?</div>
          <input
            type="date"
            value={draftOvul}
            min={ovulMinISO}
            max={ovulMaxISO}
            onChange={(e) => setDraftOvul(e.target.value)}
            style={dateInputStyle}
          />
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, marginTop: 6 }}>
            Ak si ovuláciu spozorovala iný deň než sme predpovedali, uprav ho tu.{editOvulCycle ? '' : ' Platí pre aktuálny cyklus.'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={() => setOvulEditOpen(false)}
            style={{ all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 999, border: `1px solid ${NM.HAIR_2}`, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}
          >
            Zrušiť
          </button>
          <button
            onClick={saveOvulEdit}
            style={{ all: 'unset', cursor: draftOvulValid ? 'pointer' : 'default', flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 999, background: draftOvulValid ? PHASE.OVULAT : NM.HAIR_2, color: '#fff', fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, opacity: draftOvulValid ? 1 : 0.7 }}
          >
            Uložiť
          </button>
        </div>
        {(editOvulCycle ? cycleData.ovulationOverrides?.[editOvulCycle.anchor] : ovulationOverrideISO) && (
          <button
            onClick={clearOvulOverride}
            style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center', marginTop: 14, fontFamily: NM.SANS, fontSize: 12, color: NM.TERTIARY, textDecoration: 'underline' }}
          >
            Vrátiť na automatický odhad
          </button>
        )}
      </div>
    </div>,
    document.body,
  ) : null;

  // Bottom sheet for resolving a "Chýba záznam" gap (Fáza 2).
  const gapSheet = gapSheetOpen ? createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(42,26,20,0.55)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={() => setGapSheetOpen(false)} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', width: '100%', background: NM.BG, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '22px 22px calc(env(safe-area-inset-bottom) + 22px)', boxShadow: '0 -10px 32px rgba(61,41,33,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 38, height: 4, borderRadius: 999, background: NM.HAIR_2 }} />
        </div>
        <Eye color={NM.TERRA}>Chýbajúci záznam</Eye>
        {!gapPickMode ? (
          <>
            <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, lineHeight: 1.5, marginTop: 12, marginBottom: 16 }}>
              Medzi dvoma zaznačenými periódami je väčšia medzera. Mala si periódu, ktorú si zabudla zaznačiť, alebo bol cyklus naozaj dlhší?
            </div>
            <button
              onClick={() => setGapPickMode(true)}
              style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', boxSizing: 'border-box', textAlign: 'center', padding: '14px 0', borderRadius: 999, background: PHASE.MENSTR, color: '#fff', fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, marginBottom: 10 }}
            >
              Periódu som mala, zabudla som zaznačiť
            </button>
            <button
              onClick={() => { if (activeGap) onAcknowledgeGap(activeGap.laterISO); setGapSheetOpen(false); }}
              style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', boxSizing: 'border-box', textAlign: 'center', padding: '14px 0', borderRadius: 999, border: `1px solid ${NM.HAIR_2}`, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}
            >
              Nie, cyklus bol taký dlhý
            </button>
          </>
        ) : (
          <>
            <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, marginTop: 14, marginBottom: 6 }}>Kedy začala tá perióda?</div>
            <input
              type="date"
              value={gapDraft}
              min={activeGap?.prevISO}
              max={activeGap?.laterISO}
              onChange={(e) => {
                const v = e.target.value;
                setGapDraft(v);
                // Keep the end sensible: default to start + bleed length, and
                // never let it sit before the start.
                const pl = cycleData.periodLength ?? 5;
                if (v && (!gapEndDraft || gapEndDraft < v)) {
                  setGapEndDraft(format(addDays(new Date(v + 'T00:00:00'), pl - 1), 'yyyy-MM-dd'));
                }
              }}
              style={dateInputStyle}
            />
            <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, marginTop: 14, marginBottom: 6 }}>A kedy skončila?</div>
            <input
              type="date"
              value={gapEndDraft}
              min={gapDraft || activeGap?.prevISO}
              max={activeGap?.laterISO}
              onChange={(e) => setGapEndDraft(e.target.value)}
              style={dateInputStyle}
            />
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, marginTop: 6 }}>
              Dátumy sme predvyplnili podľa tvojho cyklu — uprav ich, ak vieš presnejšie.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setGapPickMode(false)}
                style={{ all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 999, border: `1px solid ${NM.HAIR_2}`, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}
              >
                Späť
              </button>
              <button
                onClick={() => {
                  const valid = !!gapDraft && (!activeGap || (gapDraft > activeGap.prevISO && gapDraft < activeGap.laterISO));
                  const end = gapEndDraft && gapEndDraft >= gapDraft ? gapEndDraft : undefined;
                  if (valid) onAddMissedPeriod(gapDraft, end);
                  setGapSheetOpen(false);
                }}
                style={{ all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 999, background: PHASE.MENSTR, color: '#fff', fontFamily: NM.SANS, fontSize: 13, fontWeight: 500 }}
              >
                Doplniť periódu
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  ) : null;

  const irregularBlock = prediction.irregular ? (() => {
    const len = prediction.irregular.length;
    const lead =
      prediction.irregular.kind === 'short'
        ? `Tvoj posledný cyklus bol kratší ako zvyčajne — ${len} dní.`
        : prediction.irregular.kind === 'long'
          ? `Tvoj posledný cyklus bol dlhší ako zvyčajne — ${len} dní.`
          : `Tvoj posledný cyklus sa dosť líšil od tvojho priemeru — ${len} dní.`;
    return (
      <div style={{ padding: '0 22px 4px' }}>
        <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 16, background: 'rgba(194,122,110,0.10)', border: `1px solid rgba(194,122,110,0.28)` }}>
          <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 999, background: 'rgba(194,122,110,0.2)', color: PHASE.MENSTR, display: 'grid', placeItems: 'center', fontFamily: NM.SANS, fontSize: 13, fontWeight: 700 }}>!</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 12.5, color: NM.DEEP, lineHeight: 1.5, fontWeight: 400 }}>
            {lead}{' '}
            <span style={{ color: NM.MUTED }}>Občas sa to stáva. Ak sa to opakuje alebo ťa niečo trápi, pokojne to prober s lekárkou.</span>
          </div>
        </div>
      </div>
    );
  })() : null;

  return (
    <>
      {headerBlock}
      {/* One order for every entry point (Gabi 2026-07-30) — the
          today-first flow she tuned for the home card applies always;
          fromHome now only steers the back arrow. */}
      {todayStatsBlock}
      {wellbeingBlock}
      {periodCtaBlock}
      {/* TEMP hidden to evaluate the calendar-only layout (Sam 2026-10-08) */}
      {false && ringBlock}
      {irregularBlock}
      {false && upcomingBlock}
      {calendarBlock}
      {dayDetailSheet}
      {periodEditSheet}
      {ovulEditSheet}
      {gapSheet}
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
  const { cycleData, derivedState, setLastPeriodStart, markPeriodEnded, correctPeriod, setOvulationDate, acknowledgeGap, addPeriodToHistory, correctHistoryEntry, setPastOvulation } = useCycleData();
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
          onCorrectPeriod={correctPeriod}
          onSetOvulation={setOvulationDate}
          onAddMissedPeriod={(iso, end) => addPeriodToHistory(iso, end)}
          onAcknowledgeGap={acknowledgeGap}
          onCorrectHistory={correctHistoryEntry}
          onSetPastOvulation={setPastOvulation}
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
