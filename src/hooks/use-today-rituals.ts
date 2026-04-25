/**
 * Adapter for the NeoMe Home screen — supplies today's ritual data
 * for the three pillar cards (Telo, Strava, Myseľ).
 *
 * For the trial batch we ship a static fallback that matches the
 * editorial copy in the prototype. Subsequent waves will wire actual
 * program/meal-plan/meditation state in.
 */
export type RitualStatus = 'not-started' | 'in-progress' | 'done';

export interface RitualSlot {
  title: string;
  subtitle?: string;
  status: RitualStatus;
  duration?: string;
  href: string;
  freeAccess?: boolean;
}

export interface TodayRituals {
  telo: RitualSlot;
  strava: RitualSlot;
  mysel: RitualSlot;
}

export function useTodayRituals(): TodayRituals {
  return {
    telo: {
      title: 'Pohyb na dnes',
      subtitle: 'Tvoj tréning podľa fázy',
      status: 'not-started',
      duration: '14 min',
      href: '/kniznica/telo',
    },
    strava: {
      title: 'Dnešný jedálniček',
      subtitle: 'Vyvážené, podľa tvojho rytmu',
      status: 'not-started',
      href: '/kniznica/strava',
    },
    mysel: {
      title: 'Krátka meditácia',
      subtitle: 'Pokoj a sústredenie',
      status: 'not-started',
      duration: '5 min',
      href: '/meditacie',
      freeAccess: true,
    },
  };
}
