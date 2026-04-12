import React from 'react';
import type { MealPlan } from './types';

const DAY_LABELS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  const months = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const startStr = `${start.getDate()}. ${months[start.getMonth()]}`;
  const endStr = `${end.getDate()}. ${months[end.getMonth()]}`;
  return `${startStr} – ${endStr}`;
}

interface WeekDayNavigatorProps {
  plan: MealPlan;
  activeWeek: number;
  activeDay: number;
  onWeekChange: (weekIndex: number) => void;
  onDayChange: (absoluteDay: number) => void;
}

export function WeekDayNavigator({
  plan,
  activeWeek,
  activeDay,
  onWeekChange,
  onDayChange,
}: WeekDayNavigatorProps) {
  const week = plan.weeks[activeWeek];
  if (!week) return null;

  return (
    <div className="space-y-3">
      {/* Week pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {plan.weeks.map((w, wi) => (
          <button
            key={wi}
            onClick={() => onWeekChange(wi)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              wi === activeWeek
                ? 'bg-[#7A9E78] text-white'
                : 'bg-white/30 text-[#8B7560] border border-white/40'
            }`}
          >
            T{w.weekNumber}
          </button>
        ))}
      </div>

      {/* Day pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {week.dayIndices.map((dayIdx, i) => {
          const day = plan.days[dayIdx];
          const isActive = dayIdx === activeDay;
          return (
            <button
              key={dayIdx}
              onClick={() => onDayChange(dayIdx)}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-colors min-w-[44px] ${
                isActive
                  ? 'bg-[#7A9E78] text-white'
                  : 'bg-white/30 text-[#8B7560] border border-white/40'
              }`}
            >
              <span>{DAY_LABELS[i]}</span>
              {day && <span className="opacity-75 mt-0.5">{formatShortDate(day.date)}</span>}
            </button>
          );
        })}
      </div>

      {/* Date range label */}
      <p className="text-xs text-[#A0907E]">
        Týždeň {week.weekNumber} z 6 · {formatDateRange(week.startDate, week.endDate)}
      </p>
    </div>
  );
}
