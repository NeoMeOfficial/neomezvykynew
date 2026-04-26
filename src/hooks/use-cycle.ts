import { useCycleData } from '../features/cycle/useCycleData';

/**
 * Adapter for the NeoMe Home screen's PhaseStrip.
 *
 * Returns null when the user hasn't configured cycle data yet — the
 * Home screen branches on `user.hasCycleData` to render the prompt
 * state, so this hook can return null without breaking anything.
 */
export interface NeoMeCycle {
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  dayOfCycle: number;
  note?: string;
}

const PHASE_NOTE: Record<NeoMeCycle['phase'], string> = {
  menstrual:  'Daj si pokoj. Telo prechádza obnovou.',
  follicular: 'Energia rastie. Dobrý deň na intenzívny pohyb.',
  ovulation:  'Vrchol energie. Vyšší výkon, väčšia sociabilita.',
  luteal:     'Telo si pýta viac pokoja a výživy. Drž sa pri hornej hranici.',
};

export function useCycle(): NeoMeCycle | null {
  const { derivedState, loading } = useCycleData();
  if (loading || !derivedState) return null;
  const { currentDay, currentPhase } = derivedState;
  if (!currentPhase) return null;
  return {
    phase: currentPhase.key,
    dayOfCycle: currentDay,
    note: PHASE_NOTE[currentPhase.key],
  };
}
