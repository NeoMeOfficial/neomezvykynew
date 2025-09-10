import { format, differenceInDays, addDays, subDays, isBefore, isAfter } from 'date-fns';
import { PhaseRange, PhaseKey, DerivedState, CycleData } from './types';

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
  const ovulationStart = Math.max(follicularStart, cycleLength - 16);
  const ovulationEnd = Math.min(ovulationStart + 2, cycleLength - 3);
  const lutealStart = ovulationEnd + 1;

  return [
    { key: "menstrual", name: "Menštruácia", start: 1, end: periodLength },
    { key: "follicular", name: "Folikulárna", start: follicularStart, end: ovulationStart - 1 },
    { key: "ovulation", name: "Ovulácia", start: ovulationStart, end: ovulationEnd },
    { key: "luteal", name: "Luteálna", start: lutealStart, end: cycleLength }
  ];
}

export function getPhaseByDay(day: number, ranges: PhaseRange[]): PhaseRange {
  return ranges.find(range => day >= range.start && day <= range.end) || ranges[0];
}

export function getCurrentCycleDay(lastPeriodStart: string, today: Date): number {
  const startDate = new Date(lastPeriodStart);
  const daysSince = differenceInDays(today, startDate);
  return ((daysSince % 28) + 28) % 28 + 1; // Handle negative values
}

export function getDerivedState(cycleData: CycleData): DerivedState {
  const today = new Date();
  const minDate = subDays(today, 90);
  const maxDate = today;
  
  const currentDay = cycleData.lastPeriodStart 
    ? getCurrentCycleDay(cycleData.lastPeriodStart, today)
    : 1;
    
  const phaseRanges = getPhaseRanges(cycleData.cycleLength, cycleData.periodLength);
  const currentPhase = getPhaseByDay(currentDay, phaseRanges);
  
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
  const startDate = new Date(lastPeriodStart);
  return addDays(startDate, cycleLength);
}

export function isPeriodDate(date: Date, lastPeriodStart: string, cycleLength: number, periodLength: number): boolean {
  if (!lastPeriodStart) return false;
  
  const startDate = new Date(lastPeriodStart);
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