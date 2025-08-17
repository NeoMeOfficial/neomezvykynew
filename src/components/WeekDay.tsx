import React, { memo } from 'react';

interface WeekDayProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  isCentral: boolean;
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
  isCentral,
  completionPercentage,
  onClick,
  buttonRef
}) => {
  return (
    <div className="flex flex-col items-center flex-1">
      <div className="text-xs font-medium mb-0.5 text-amber-900">
        {getDayName(date)}
      </div>
      <button
        ref={buttonRef}
        onClick={onClick}
        className={`relative rounded-full flex items-center justify-center transition-all duration-75 ease-out shadow-sm ${
          isCentral
            ? 'w-14 h-14 bg-amber-900 text-white ring-2 ring-amber-900/30 scale-105'
            : isToday 
            ? 'w-12 h-12 text-white ring-2 ring-[#88B0BC]/30' 
            : isSelected 
            ? 'w-12 h-12 bg-amber-700 text-white shadow-md' 
            : 'w-12 h-12 bg-muted text-amber-900'
        }`}
        style={isToday && !isCentral ? { backgroundColor: '#88B0BC' } : {}}
      >
        <span className="relative z-10 text-sm font-bold">
          {date.getDate()}.{date.getMonth() + 1}
        </span>
      </button>
      <div
        className={`bg-muted rounded-full h-0.5 mt-2 overflow-hidden transition-all duration-150 ease-out ${
          isCentral ? 'w-14' : 'w-12'
        }`}
        aria-label={`Progress: ${Math.round(completionPercentage)}%`}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-800 transition-all duration-200 ease-out rounded-full"
          style={{ width: `${completionPercentage}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
});