export type PhaseKey = "menstrual" | "follicular" | "ovulation" | "luteal";

export interface PhaseRange {
  key: PhaseKey;
  name: string;
  start: number; // 1-indexed
  end: number;   // 1-indexed
}

export interface PeriodLog {
  startDate: string; // ISO YYYY-MM-DD
  endDate?: string;  // ISO YYYY-MM-DD
  notes?: string;
}

export interface CustomSettings {
  notifications: boolean;
  symptomTracking: boolean;
  moodTracking: boolean;
  notes: string;
}

export interface CycleData {
  lastPeriodStart: string | null; // ISO YYYY-MM-DD
  cycleLength: number; // default 28
  periodLength: number; // default 5
  customSettings: CustomSettings;
  history?: PeriodLog[];
}

export interface DerivedState {
  today: Date;
  minDate: Date; // 90 days before today
  maxDate: Date; // today
  currentDay: number; // 1..cycleLength
  phaseRanges: PhaseRange[];
  currentPhase: PhaseRange;
  isFirstRun: boolean;
}

export interface Suggestion {
  phaseKey: PhaseKey;
  energy: number; // 0-100
  mood: number;   // 1-5 (float)
}