import React, { memo, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Habit } from '@/hooks/useCodeBasedHabits';

interface MonthlyCalendarProps {
  habitData: Record<string, Record<string, number>>;
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  habits: Habit[];
  formatDate: (date: Date) => string;
}

const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const getMonthDays = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  
  const startDay = firstDay.getDay();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push(addDays(firstDay, -i - 1));
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(addDays(lastDay, i));
  }
  
  return days;
};

export const MonthlyCalendar = memo<MonthlyCalendarProps>(({ 
  habitData, 
  selectedMonth, 
  onMonthChange,
  habits,
  formatDate
}) => {
  const monthDays = useMemo(() => getMonthDays(selectedMonth), [selectedMonth]);
  
  const getDayCompletionPercentage = useCallback((date: Date) => {
    const dateStr = formatDate(date);
    let totalProgress = 0;
    habits.forEach(habit => {
      const value = habitData[habit.id]?.[dateStr] || 0;
      const progress = Math.min(value / habit.target, 1);
      totalProgress += progress;
    });
    return (totalProgress / habits.length) * 100;
  }, [habitData, habits, formatDate]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onMonthChange(addDays(selectedMonth, -30))}
        >
          <ChevronLeft size={16} />
        </Button>
        <h3 className="text-lg font-semibold">
          {selectedMonth.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' })}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onMonthChange(addDays(selectedMonth, 30))}
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Ned', 'Pon', 'Uto', 'Str', 'Štv', 'Pia', 'Sob'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((date, index) => {
          const completionPercentage = getDayCompletionPercentage(date);
          const isCurrentMonth = date.getMonth() === selectedMonth.getMonth();
          const isToday = isSameDay(date, new Date());
          
          return (
            <div
              key={index}
              className={`h-10 w-10 rounded-full flex items-center justify-center text-sm relative ${
                !isCurrentMonth 
                  ? 'text-muted-foreground' 
                  : isToday
                  ? 'bg-orange-100 text-orange-600 font-bold'
                  : 'text-foreground'
              }`}
            >
              <span className={`relative z-10 ${completionPercentage === 100 ? 'text-white' : ''}`}>
                {date.getDate()}
              </span>
              {isCurrentMonth && completionPercentage > 0 && (
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600 to-amber-800"
                  style={{ opacity: completionPercentage === 100 ? 1 : 0.65 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});