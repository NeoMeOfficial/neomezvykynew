import { useCycleData } from '@/features/cycle/useCycleData';

export type CyclePhase = 'menstrual' | 'folicular' | 'ovulatory' | 'luteal';

export interface CycleInfo {
  phase: CyclePhase;
  dayOfCycle: number;
  totalDays: number;
  phaseName: string;
  note: string;
}

const PHASE_MAP: Record<string, CyclePhase> = {
  menstrual:  'menstrual',
  follicular: 'folicular',
  ovulation:  'ovulatory',
  ovulatory:  'ovulatory',
  luteal:     'luteal',
};

const PHASE_NAME: Record<CyclePhase, string> = {
  menstrual:  'Menštruačná',
  folicular:  'Folikulárna',
  ovulatory:  'Ovulácia',
  luteal:     'Luteálna',
};

const PHASE_NOTE: Record<CyclePhase, string> = {
  menstrual:  'Čas na odpočinok a mierny pohyb.',
  folicular:  'Energia rastie. Dobrý deň na intenzívny pohyb.',
  ovulatory:  'Vrchol energie. Ideálny čas na výzvy.',
  luteal:     'Spomaľ a zaobstarávaj sa.',
};

export function useCycle(): CycleInfo | null {
  const { derivedState } = useCycleData();

  if (!derivedState?.lastPeriodStart) return null;

  const rawPhase = derivedState.currentPhase ?? 'follicular';
  const phase = PHASE_MAP[rawPhase] ?? 'folicular';
  const dayOfCycle = derivedState.currentCycleDay ?? 1;
  const totalDays = derivedState.averageCycleLength ?? 28;

  return {
    phase,
    dayOfCycle,
    totalDays,
    phaseName: PHASE_NAME[phase],
    note: PHASE_NOTE[phase],
  };
}
