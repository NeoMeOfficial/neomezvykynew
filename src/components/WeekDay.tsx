import React, { memo } from 'react';

interface WeekDayProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  completionPercentage: number;
  onClick: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

const getDayName = (date: Date): string => {
  const days = ['Ned', 'Pon', 'Uto', 'Str', 'Štv', 'Pia', 'Sob'];
  return days[date.getDay()];
};

export const WeekDay = memo<WeekDayProps>(({ 
  date, 
  isSelected, 
  isToday, 
  completionPercentage,
  onClick,
  buttonRef
}) => {
  return (
    <div className="flex flex-col items-center w-16">
      <div className="text-xs font-medium mb-1 text-amber-900">
        {getDayName(date)}
      </div>
      <button
        ref={buttonRef}
        onClick={onClick}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
          isToday 
            ? 'bg-amber-900 text-white ring-2 ring-amber-900/30' 
            : isSelected 
            ? 'bg-amber-700 text-white shadow-md' 
            : 'bg-muted text-amber-900'
        }`}
      >
        <span className="relative z-10 text-sm font-bold">
          {date.getDate()}
        </span>
      </button>
      <div
        className="w-12 bg-muted rounded-full h-1 mt-1 overflow-hidden"
        aria-label={`Progress: ${Math.round(completionPercentage)}%`}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-800 transition-all duration-500 rounded-full"
          style={{ width: `${completionPercentage}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
});