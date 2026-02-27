import GlassCard from '../GlassCard';
import { colors } from '../../../theme/warmDusk';

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'] as const;

export interface DayInfo {
  day: string;
  date: number;
  isToday: boolean;
  isPeriod: boolean;
  hasWorkout: boolean;
  habitsComplete: boolean;
}

export function getWeekDays(): DayInfo[] {
  const now = new Date();
  const dow = (now.getDay() + 6) % 7;
  const mon = new Date(now);
  mon.setDate(now.getDate() - dow);

  const periodDays = [0, 1];
  const workoutDays = [0, 2, 4];
  const habitDays = [0, 1, 2];

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    const isPast = i < dow;
    return {
      day: DAYS[i],
      date: d.getDate(),
      isToday: d.toDateString() === now.toDateString(),
      isPeriod: periodDays.includes(i),
      hasWorkout: isPast && workoutDays.includes(i),
      habitsComplete: isPast && habitDays.includes(i),
    };
  });
}

interface Props {
  days: DayInfo[];
  selectedIdx: number;
  onSelect: (i: number) => void;
}

export default function WeeklyCalendarStrip({ days, selectedIdx, onSelect }: Props) {
  return (
    <GlassCard className="!p-4">
      <div className="flex justify-between">
        {days.map((d, i) => {
          const active = i === selectedIdx;
          return (
            <button
              key={d.day}
              onClick={() => onSelect(i)}
              className="flex flex-col items-center gap-1.5 transition-all"
            >
              <span className="text-[11px] font-medium"
                style={{ color: active ? colors.accent : colors.textTertiary }}>
                {d.day}
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold transition-all"
                style={active ? {
                  background: `linear-gradient(135deg, ${colors.accent}, #96703C)`,
                  color: '#FFF',
                  boxShadow: `0 4px 14px rgba(184,134,74,0.3), 0 0 0 3px rgba(184,134,74,0.08)`,
                } : {
                  color: colors.textTertiary,
                }}
              >
                {d.date}
              </div>
              <div className="flex gap-1 h-2 items-center">
                {d.isPeriod && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${colors.periodka}90` }} />
                )}
                {d.hasWorkout && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${colors.telo}70` }} />
                )}
                {d.habitsComplete && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${colors.strava}70` }} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
