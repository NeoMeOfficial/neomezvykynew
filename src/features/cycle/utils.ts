import { format, differenceInDays, addDays, subDays, isBefore, isAfter } from 'date-fns';
import { PhaseRange, PhaseKey, DerivedState, CycleData } from './types';

// Universal segment splitter for dynamic subphase calculation
function splitSegment(
  len: number,
  pct: [number, number, number],
  min: [number, number, number],
  prefer: 'MID' | 'FIRST' = 'MID'
): [number, number, number] {
  let r1 = Math.floor(len * pct[0]);
  let r2 = Math.floor(len * pct[1]);
  let r3 = len - r1 - r2;

  let a1 = Math.max(r1, min[0]);
  let a2 = Math.max(r2, min[1]);
  let a3 = Math.max(r3, min[2]);

  let sum = a1 + a2 + a3;

  if (sum > len) {
    const order = prefer === 'MID' ? [1, 0, 2] : [0, 1, 2];
    let remaining = sum - len;
    
    for (const i of order) {
      const arr = [a1, a2, a3];
      const take = Math.min(remaining, arr[i] - min[i]);
      if (i === 0) a1 -= take;
      else if (i === 1) a2 -= take;
      else a3 -= take;
      remaining -= take;
      if (remaining === 0) break;
    }
  } else if (sum < len) {
    a2 += (len - sum);
  }

  return [a1, a2, a3];
}

// Calculate detailed phase ranges including subphases
export function getDetailedPhaseRanges(cycleLength: number, periodLength: number, lutealLength: number = 14) {
  const ovulationDay = cycleLength - lutealLength;

  // Basic phases
  const M_start = 1;
  const M_end = periodLength;
  const F_disp_start = periodLength + 1;
  const F_disp_end = ovulationDay - 1;
  const O_day = ovulationDay;
  const L_start = ovulationDay + 1;
  const L_end = cycleLength;

  // Lengths
  const M_len = M_end - M_start + 1;
  const F_disp_len = Math.max(0, F_disp_end - F_disp_start + 1);
  const L_len = L_end - L_start + 1;

  // --- MENSTRUAL SUBPHASES ---
  let M_early = 0, M_mid = 0, M_late = 0;
  if (M_len >= 3) {
    [M_early, M_mid, M_late] = splitSegment(M_len, [0.40, 0.35, 0.25], [2, 1, 1], 'MID');
  } else {
    M_early = M_len;
  }

  // --- FOLLICULAR SUBPHASES ---
  let F_trans = 0, F_mid = 0, F_late = 0;
  if (F_disp_len > 0) {
    if (F_disp_len <= 8) {
      F_mid = Math.max(1, Math.floor(F_disp_len * 0.70));
      F_late = F_disp_len - F_mid;
      if (F_late === 0 && F_mid > 1) {
        F_mid -= 1;
        F_late += 1;
      }
    } else {
      F_trans = Math.max(1, Math.floor(F_disp_len * 0.15));
      F_mid = Math.max(3, Math.floor(F_disp_len * 0.55));
      F_late = F_disp_len - F_trans - F_mid;
      
      if (F_late < 2 && F_mid > 3) {
        const borrow = Math.min(2 - F_late, F_mid - 3);
        F_mid -= borrow;
        F_late += borrow;
      }
      if (F_late < 2 && F_trans > 1) {
        const borrow = Math.min(2 - F_late, F_trans - 1);
        F_trans -= borrow;
        F_late += borrow;
      }
    }
  }

  // --- LUTEAL SUBPHASES ---
  const [L_early, L_mid, L_late] = splitSegment(L_len, [0.35, 0.40, 0.25], [2, 2, 2], 'MID');

  // --- BUILD RANGES OBJECT ---
  const ranges: Record<string, { start: number; end: number }> = {
    menstrual: { start: M_start, end: M_end },
    ovulation: { start: O_day, end: O_day },
  };

  // Menstrual subphases
  let cursor = M_start;
  if (M_early > 0) {
    ranges.menstrualEarly = { start: cursor, end: cursor + M_early - 1 };
    cursor += M_early;
  }
  if (M_mid > 0) {
    ranges.menstrualMid = { start: cursor, end: cursor + M_mid - 1 };
    cursor += M_mid;
  }
  if (M_late > 0) {
    ranges.menstrualLate = { start: cursor, end: cursor + M_late - 1 };
  }

  // Follicular subphases
  if (F_disp_len > 0) {
    ranges.follicular = { start: F_disp_start, end: F_disp_end };
    cursor = F_disp_start;
    
    if (F_trans > 0) {
      ranges.follicularTransition = { start: cursor, end: cursor + F_trans - 1 };
      cursor += F_trans;
    }
    if (F_mid > 0) {
      ranges.follicularMid = { start: cursor, end: cursor + F_mid - 1 };
      cursor += F_mid;
    }
    if (F_late > 0) {
      ranges.follicularLate = { start: cursor, end: cursor + F_late - 1 };
    }
  }

  // Luteal subphases
  ranges.luteal = { start: L_start, end: L_end };
  cursor = L_start;
  ranges.lutealEarly = { start: cursor, end: cursor + L_early - 1 };
  cursor += L_early;
  ranges.lutealMid = { start: cursor, end: cursor + L_mid - 1 };
  cursor += L_mid;
  ranges.lutealLate = { start: cursor, end: cursor + L_late - 1 };

  return ranges;
}

// Get subphase for a given day
export function getSubphase(
  day: number,
  cycleLength: number,
  periodLength: number
): { phase: string; subphase: string | null } {
  // Ak deň presahuje cycleLength, sme v "predĺženej" luteálnej late fáze (menštruácia mešká)
  if (day > cycleLength) {
    return { phase: 'luteal', subphase: 'late' };
  }
  
  const ranges = getDetailedPhaseRanges(cycleLength, periodLength);
  
  // MENSTRUAL subphases
  if (ranges.menstrualEarly && day >= ranges.menstrualEarly.start && day <= ranges.menstrualEarly.end) 
    return { phase: 'menstrual', subphase: 'early' };
  if (ranges.menstrualMid && day >= ranges.menstrualMid.start && day <= ranges.menstrualMid.end) 
    return { phase: 'menstrual', subphase: 'mid' };
  if (ranges.menstrualLate && day >= ranges.menstrualLate.start && day <= ranges.menstrualLate.end) 
    return { phase: 'menstrual', subphase: 'late' };
  
  // FOLLICULAR subphases
  if (ranges.follicularTransition && day >= ranges.follicularTransition.start && day <= ranges.follicularTransition.end) 
    return { phase: 'follicular', subphase: 'mid' };
  if (ranges.follicularMid && day >= ranges.follicularMid.start && day <= ranges.follicularMid.end) 
    return { phase: 'follicular', subphase: 'mid' };
  if (ranges.follicularLate && day >= ranges.follicularLate.start && day <= ranges.follicularLate.end) 
    return { phase: 'follicular', subphase: 'late' };
  
  // OVULATION
  if (day >= ranges.ovulation.start && day <= ranges.ovulation.end) 
    return { phase: 'ovulation', subphase: null };
  
  // LUTEAL subphases
  if (ranges.lutealEarly && day >= ranges.lutealEarly.start && day <= ranges.lutealEarly.end) 
    return { phase: 'luteal', subphase: 'early' };
  if (ranges.lutealMid && day >= ranges.lutealMid.start && day <= ranges.lutealMid.end) 
    return { phase: 'luteal', subphase: 'mid' };
  if (ranges.lutealLate && day >= ranges.lutealLate.start && day <= ranges.lutealLate.end) 
    return { phase: 'luteal', subphase: 'late' };
    
  return { phase: 'menstrual', subphase: null }; // fallback
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function dayFractionInPhase(day: number, phase: PhaseRange): number {
  const phaseDay = day - phase.start + 1;
  const phaseLength = phase.end - phase.start + 1;
  return Math.max(0, Math.min(1, (phaseDay - 1) / Math.max(1, phaseLength - 1)));
}

export function getPhaseRanges(cycleLength: number, periodLength: number): PhaseRange[] {
  const follicularStart = periodLength + 1;
  
  // Ovulation: always 1 day at cycleLength - 14
  const ovulationDay = cycleLength - 14;
  
  // Luteal: always starts at cycleLength - 13 (14 days total)
  const lutealStart = cycleLength - 13;

  return [
    { key: "menstrual", name: "Menštruácia", start: 1, end: periodLength },
    { key: "follicular", name: "Folikulárna", start: follicularStart, end: ovulationDay - 1 },
    { key: "ovulation", name: "Ovulácia", start: ovulationDay, end: ovulationDay },
    { key: "luteal", name: "Luteálna", start: lutealStart, end: cycleLength }
  ];
}

export function getPhaseByDay(day: number, ranges: PhaseRange[], cycleLength?: number): PhaseRange {
  // Ak deň presahuje dĺžku cyklu (menštruácia mešká), zostávame v luteálnej fáze
  if (cycleLength && day > cycleLength) {
    return ranges.find(r => r.key === 'luteal') || ranges[ranges.length - 1];
  }
  return ranges.find(range => day >= range.start && day <= range.end) || ranges[0];
}

export function getCurrentCycleDay(lastPeriodStart: string, today: Date, cycleLength: number): number {
  const startDate = new Date(lastPeriodStart + 'T00:00:00');
  const daysSince = differenceInDays(today, startDate);
  // Ak menštruácia mešká (deň > cycleLength), nevracaj modulo
  // Nechaj deň pokračovať (29, 30, 31...) kým používateľka nezadá nový začiatok
  return daysSince + 1;
}

export function getDerivedState(cycleData: CycleData): DerivedState {
  const today = new Date();
  const minDate = subDays(today, 90);
  const maxDate = today;
  
  const currentDay = cycleData.lastPeriodStart 
    ? getCurrentCycleDay(cycleData.lastPeriodStart, today, cycleData.cycleLength)
    : 1;
    
  const phaseRanges = getPhaseRanges(cycleData.cycleLength, cycleData.periodLength);
  const currentPhase = getPhaseByDay(currentDay, phaseRanges, cycleData.cycleLength);
  
  const isFirstRun = !cycleData.lastPeriodStart;

  return {
    today,
    minDate,
    maxDate,
    currentDay,
    phaseRanges,
    currentPhase,
    isFirstRun
  };
}

export function getNextPeriodDate(lastPeriodStart: string, cycleLength: number): Date {
  const startDate = new Date(lastPeriodStart + 'T00:00:00');
  return addDays(startDate, cycleLength);
}

export function isPeriodDate(date: Date, lastPeriodStart: string, cycleLength: number, periodLength: number): boolean {
  if (!lastPeriodStart) return false;
  
  const startDate = new Date(lastPeriodStart + 'T00:00:00');
  const daysSince = differenceInDays(date, startDate);
  
  // Handle past periods (negative days)
  if (daysSince < 0) {
    const daysSinceAbs = Math.abs(daysSince);
    const cyclesSince = Math.floor(daysSinceAbs / cycleLength);
    const remainingDays = daysSinceAbs % cycleLength;
    const daysFromPreviousPeriodStart = cycleLength - remainingDays;
    return daysFromPreviousPeriodStart < periodLength;
  }
  
  // Handle current and future periods
  const cyclesSince = Math.floor(daysSince / cycleLength);
  const dayInCurrentCycle = daysSince % cycleLength;
  
  // Check if it's within period length from any cycle start
  return dayInCurrentCycle < periodLength;
}

export function validateDate(date: Date, minDate: Date, maxDate: Date): boolean {
  return !isBefore(date, minDate) && !isAfter(date, maxDate);
}

export function formatDateSk(date: Date): string {
  return format(date, 'd.M.yyyy');
}

// ===== CENTRALIZED CALCULATION FUNCTIONS =====

/**
 * Get ovulation day (always 14 days before next period)
 */
export function getOvulationDay(cycleLength: number): number {
  return cycleLength - 14;
}

/**
 * Get fertility window (5 days before ovulation + ovulation day + 1 day after)
 * Returns 7-day window
 */
export function getFertilityWindow(cycleLength: number): { start: number; end: number } {
  const ovulationDay = getOvulationDay(cycleLength);
  return {
    start: ovulationDay - 5,  // 5 days before ovulation
    end: ovulationDay + 1     // 1 day after ovulation
  };
  // = 7 days total
}

/**
 * Get fertility dates based on last period start
 */
export function getFertilityDates(lastPeriodStart: string, cycleLength: number): { startDate: Date; endDate: Date } {
  const periodStart = new Date(lastPeriodStart + 'T00:00:00');
  const { start, end } = getFertilityWindow(cycleLength);
  return {
    startDate: addDays(periodStart, start - 1),
    endDate: addDays(periodStart, end - 1)
  };
}

/**
 * Get ovulation date based on last period start
 */
export function getOvulationDate(lastPeriodStart: string, cycleLength: number): Date {
  const periodStart = new Date(lastPeriodStart + 'T00:00:00');
  const ovulationDay = getOvulationDay(cycleLength);
  return addDays(periodStart, ovulationDay - 1);
}

// ===== DATE CHECK FUNCTIONS =====

export function isFertilityDate(date: Date, lastPeriodStart: string, cycleLength: number): boolean {
  if (!lastPeriodStart) return false;
  
  const startDate = new Date(lastPeriodStart + 'T00:00:00');
  const daysSince = differenceInDays(date, startDate);
  const { start: fertilityStart, end: fertilityEnd } = getFertilityWindow(cycleLength);
  
  // Handle past periods (negative days)
  if (daysSince < 0) {
    const daysSinceAbs = Math.abs(daysSince);
    const remainingDays = daysSinceAbs % cycleLength;
    const dayInCurrentCycle = cycleLength - remainingDays;
    
    return dayInCurrentCycle >= fertilityStart && dayInCurrentCycle <= fertilityEnd;
  }
  
  // Handle current and future periods
  const dayInCurrentCycle = (daysSince % cycleLength) + 1;
  
  return dayInCurrentCycle >= fertilityStart && dayInCurrentCycle <= fertilityEnd;
}

export function isOvulationDate(date: Date, lastPeriodStart: string, cycleLength: number): boolean {
  if (!lastPeriodStart) return false;
  
  const startDate = new Date(lastPeriodStart + 'T00:00:00');
  const daysSince = differenceInDays(date, startDate);
  const ovulationDay = getOvulationDay(cycleLength);
  
  // Handle past periods (negative days)
  if (daysSince < 0) {
    const daysSinceAbs = Math.abs(daysSince);
    const remainingDays = daysSinceAbs % cycleLength;
    const dayInCurrentCycle = cycleLength - remainingDays;
    
    return dayInCurrentCycle === ovulationDay;
  }
  
  // Handle current and future periods
  const dayInCurrentCycle = (daysSince % cycleLength) + 1;
  
  return dayInCurrentCycle === ovulationDay;
}