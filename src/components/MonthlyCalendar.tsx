import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Habit } from '@/hooks/useCodeBasedHabits';
import { cn } from '@/lib/utils';

interface MonthlyCalendarProps {
  habitData: Record<string, Record<string, number>>;
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  habits: Habit[];
  formatDate: (date: Date) => string;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  habitData,
  selectedMonth,
  onMonthChange,
  habits,
  formatDate
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getDayCompletionPercentage = (date: Date) => {
    if (habits.length === 0) return 0; // Prevent division by zero
    let totalProgress = 0;
    habits.forEach(habit => {
      const dateStr = formatDate(date);
      const value = habitData[habit.id]?.[dateStr] || 0;
      const progress = Math.min(value / habit.target, 1);
      totalProgress += progress;
    });
    return (totalProgress / habits.length) * 100;
  };

  const modifiers = {
    completed: (date: Date) => {
      const completionPercentage = getDayCompletionPercentage(date);
      return completionPercentage >= 100;
    },
    partial: (date: Date) => {
      const completionPercentage = getDayCompletionPercentage(date);
      return completionPercentage > 0 && completionPercentage < 100;
    }
  };

  const modifiersStyles = {
    completed: { 
      backgroundColor: '#22c55e',
      color: 'white',
      fontWeight: 'bold'
    },
    partial: { 
      backgroundColor: '#fbbf24',
      color: 'white'
    }
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        onMonthChange={onMonthChange}
        month={selectedMonth}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className={cn("p-3 pointer-events-auto")}
        showOutsideDays={false}
      />
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span>Všetky návyky dokončené</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span>Čiastočne dokončené</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200"></div>
          <span>Bez aktivity</span>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">
            {selectedDate.toLocaleDateString('sk-SK', { 
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </h4>
          <div className="space-y-1">
            {habits.map(habit => {
              const dateStr = formatDate(selectedDate);
              const value = habitData[habit.id]?.[dateStr] || 0;
              const isCompleted = value >= habit.target;
              
              return (
                <div key={habit.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{habit.emoji}</span>
                    <span>{habit.name}</span>
                  </div>
                  <div className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {habit.name === 'Hydratácia' ? Number(value).toFixed(1) : Math.round(Number(value))} / {habit.target} {habit.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};