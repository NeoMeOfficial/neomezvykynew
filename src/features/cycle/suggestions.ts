import { PhaseRange, PhaseKey, Suggestion } from './types';
import { getPhaseByDay, dayFractionInPhase, lerp } from './utils';

export function suggestForDay(day: number, ranges: PhaseRange[], cycleLength?: number): Suggestion {
  const phase = getPhaseByDay(day, ranges, cycleLength);
  const f = dayFractionInPhase(day, phase);
  
  let energy = 60, mood = 3.5;
  
  switch (phase.key) {
    case "menstrual":
      energy = lerp(30, 45, f);
      mood = lerp(2.3, 3.0, f);
      break;
    case "follicular":
      energy = lerp(50, 85, f);
      mood = lerp(3.3, 4.5, f);
      break;
    case "ovulation":
      energy = 90 - Math.abs(f - 0.5) * 8;
      mood = 4.8 - Math.abs(f - 0.5) * 0.3;
      break;
    case "luteal":
      energy = lerp(70, 35, f);
      mood = lerp(4.0, 2.6, f);
      break;
  }
  
  return {
    phaseKey: phase.key,
    energy: Math.round(energy),
    mood: Math.round(mood * 10) / 10,
  };
}

export function getEnergyColor(energy: number): string {
  if (energy >= 80) return "hsl(var(--mint))";
  if (energy >= 60) return "hsl(var(--gold))";
  if (energy >= 40) return "hsl(var(--peach))";
  return "hsl(var(--blush))";
}

export function getMoodEmoji(mood: number): string {
  if (mood >= 4.5) return "🤩";
  if (mood >= 3.5) return "🙂";
  if (mood >= 2.5) return "😕";
  return "😞";
}

export function getPhaseColor(phaseKey: PhaseKey): string {
  switch (phaseKey) {
    case "menstrual": return "hsl(var(--destructive))"; // Red tone (0 79% 70%)
    case "follicular": return "hsl(var(--mint))"; // Mint green (150 31% 82%)
    case "ovulation": return "hsl(var(--lavender))"; // Purple tone (265 30% 92%)
    case "luteal": return "hsl(var(--peach))"; // Coral/peach (17 80% 86%)
    default: return "hsl(var(--muted))";
  }
}