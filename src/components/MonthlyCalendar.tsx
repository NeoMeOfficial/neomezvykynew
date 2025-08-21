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
    <div className="space-y-2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        onMonthChange={onMonthChange}
        month={selectedMonth}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className={cn("rounded-xl border-0")}
        showOutsideDays={false}
      />
      
      {selectedDate && (
        <div className="glass-surface rounded-lg p-2">
          <h4 className="font-medium mb-1.5 text-xs text-foreground">
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
                <div key={habit.id} className="flex items-center justify-between p-1.5 rounded-md bg-background/30 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{habit.emoji}</span>
                    <span className="text-xs font-medium text-foreground/80">{habit.name}</span>
                  </div>
                  <div className={`text-xs font-semibold ${isCompleted ? 'text-green-600' : 'text-foreground/60'}`}>
                    {habit.name === 'Hydratácia' ? Number(value).toFixed(1) : Math.round(Number(value))} / {habit.target} {habit.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="glass-surface rounded-lg p-2">
        <h4 className="text-xs font-medium text-foreground/80 mb-1.5">Legenda</h4>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-green-500"></div>
            <span className="text-foreground/70 text-xs">Všetky návyky dokončené</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-yellow-500"></div>
            <span className="text-foreground/70 text-xs">Čiastočne dokončené</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-muted"></div>
            <span className="text-foreground/70 text-xs">Bez aktivity</span>
          </div>
        </div>
      </div>
    </div>
  );
};