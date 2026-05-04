import { useUserProgram } from '@/hooks/useUserProgram';
import { useMealPlan } from '@/features/nutrition/useMealPlan';
import { useDailyMeditation } from '@/hooks/useDailyContent';

export type RitualStatus = 'not-started' | 'in-progress' | 'done';

export interface RitualSlot {
  title: string;
  subtitle: string;
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
  const { userProgram } = useUserProgram();
  const { todayPlan } = useMealPlan();
  const { meditation } = useDailyMeditation();

  const teloTitle = userProgram?.todaysExercise?.title ?? 'Pohybová zostava dňa';
  const teloSubtitle = userProgram
    ? `Týždeň ${userProgram.week} · Deň ${userProgram.day}`
    : 'Navrhnuté cvičenie pre teba';
  const teloDuration = userProgram?.todaysExercise?.duration;

  const stravaTitle = todayPlan
    ? 'Dnešný jedálniček je pripravený'
    : 'Zostaň na kurze';
  const stravaSubtitle = todayPlan
    ? `${todayPlan.meals?.length ?? 0} jedlá · plán na dnes`
    : 'Pozri sa na dnešné tipy pre výživu';

  const meditationTitle = meditation?.title ?? 'Meditácia dňa';
  const meditationSubtitle = meditation?.category ?? 'Mindfulness · 5 minút';

  return {
    telo: {
      title: teloTitle,
      subtitle: teloSubtitle,
      status: 'not-started',
      duration: teloDuration,
      href: userProgram ? `/program/${userProgram.id}` : '/kniznica/telo/programy',
    },
    strava: {
      title: stravaTitle,
      subtitle: stravaSubtitle,
      status: 'not-started',
      href: todayPlan ? '/jedalnicek' : '/kniznica/strava',
    },
    mysel: {
      title: meditationTitle,
      subtitle: meditationSubtitle,
      status: 'not-started',
      duration: '5 min',
      href: '/meditacie',
      freeAccess: true,
    },
  };
}
