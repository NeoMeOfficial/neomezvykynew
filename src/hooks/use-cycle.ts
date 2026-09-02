/**
 * useCycle — the single cycle read-model.
 *
 * Wraps useCycleData (raw state + setters) and pre-assembles every derived
 * value a consumer might want: current phase + subphase, cycle day, next
 * period / ovulation / fertility dates. Before this, callers imported 4-6
 * standalone functions from cycle/utils and re-derived state by hand —
 * often ignoring the derivedState the data hook already computed.
 *
 * Use this for anything that READS cycle state. useCycleData is still the
 * lower-level hook for components that only need raw cycleData or setters.
 */
import { useMemo } from 'react';
import { useCycleData } from '@/features/cycle/useCycleData';
import {
  getNextPeriodDate,
  getOvulationDate,
  getFertilityDates,
  getFertilityWindow,
  getSubphase,
} from '@/features/cycle/utils';
import { getDailyHeadline } from '@/features/cycle/dailyHeadlines';
import type { PhaseKey, PhaseRange } from '@/features/cycle/types';

const PHASE_NAME: Record<PhaseKey, string> = {
  menstrual:  'Menštruačná',
  follicular: 'Folikulárna',
  ovulation:  'Ovulácia',
  luteal:     'Luteálna',
};


export interface CycleView {
  /** False until the user has logged a first period — derived fields hold safe defaults. */
  hasData: boolean;
  /** 1-indexed day of the current cycle. Can exceed cycleLength when a period is late. */
  currentDay: number;
  /** Current coarse phase as a PhaseRange ({ key, name, start, end }). */
  phase: PhaseRange;
  /** Current phase key — 'menstrual' | 'follicular' | 'ovulation' | 'luteal'. */
  phaseKey: PhaseKey;
  /** Slovak phase name + one-line note, for quick UI display. */
  phaseName: string;
  phaseNote: string;
  /** Sub-phase within the current phase ('early' | 'mid' | 'late' | null). */
  subphase: string | null;
  /** All phase ranges for the current cycle length. */
  phaseRanges: PhaseRange[];
  /** True when currentDay has run past cycleLength (period overdue). */
  isLate: boolean;
  /** True before any period is logged. */
  isFirstRun: boolean;
  /** Predicted next period start, or null when no period logged yet. */
  nextPeriodDate: Date | null;
  /** Predicted ovulation date, or null when no period logged yet. */
  ovulationDate: Date | null;
  /** Fertility window as cycle-day numbers ({ start, end }). */
  fertilityWindow: { start: number; end: number };
  /** Fertility window as calendar dates, or null when no period logged yet. */
  fertilityDates: { startDate: Date; endDate: Date } | null;
}

/** Full cycle hook — raw state + setters from useCycleData, plus the derived read-model. */
export function useCycle() {
  const data = useCycleData();
  const { cycleData, derivedState } = data;

  const view = useMemo<CycleView>(() => {
    const { lastPeriodStart, cycleLength, periodLength } = cycleData;
    const phase = derivedState.currentPhase;
    const phaseKey = phase.key;
    const sub = getSubphase(derivedState.currentDay, cycleLength, periodLength);

    return {
      hasData: !!lastPeriodStart,
      currentDay: derivedState.currentDay,
      phase,
      phaseKey,
      phaseName: PHASE_NAME[phaseKey],
      // Note shown on the home Periodka card — MUST read identically to
      // the tracker hero, so both derive from getDailyHeadline (which
      // also covers the late-period override via its 'late' bucket).
      phaseNote: (() => {
        const h = getDailyHeadline(derivedState.currentDay, cycleLength, periodLength);
        return `${h.before} ${h.em}`;
      })(),
      subphase: sub.subphase,
      phaseRanges: derivedState.phaseRanges,
      isLate: derivedState.currentDay > cycleLength,
      isFirstRun: derivedState.isFirstRun,
      nextPeriodDate: lastPeriodStart ? getNextPeriodDate(lastPeriodStart, cycleLength) : null,
      ovulationDate:  lastPeriodStart ? getOvulationDate(lastPeriodStart, cycleLength) : null,
      fertilityWindow: getFertilityWindow(cycleLength),
      fertilityDates: lastPeriodStart ? getFertilityDates(lastPeriodStart, cycleLength) : null,
    };
  }, [cycleData, derivedState]);

  return { ...data, ...view };
}

/**
 * Legacy compact shape — kept for existing callers that only need the
 * phase summary. Prefer useCycle() for new code.
 */
export type CyclePhase = 'menstrual' | 'folicular' | 'ovulatory' | 'luteal';
export interface CycleInfo {
  phase: CyclePhase;
  /** Canonical phase key ('follicular'/'ovulation' spellings) — what
   *  dailyRecipeOf and the other phase-aware pickers expect. The legacy
   *  `phase` field uses old spellings and MUST NOT be fed to them. */
  phaseKey: PhaseKey;
  dayOfCycle: number;
  totalDays: number;
  phaseName: string;
  note: string;
}

const LEGACY_PHASE_MAP: Record<PhaseKey, CyclePhase> = {
  menstrual:  'menstrual',
  follicular: 'folicular',
  ovulation:  'ovulatory',
  luteal:     'luteal',
};

export function useCycleInfo(): CycleInfo | null {
  const { hasData, phaseKey, currentDay, cycleData, phaseName, phaseNote } = useCycle();
  if (!hasData) return null;
  return {
    phase: LEGACY_PHASE_MAP[phaseKey],
    phaseKey,
    dayOfCycle: currentDay,
    totalDays: cycleData.cycleLength,
    phaseName,
    note: phaseNote,
  };
}
