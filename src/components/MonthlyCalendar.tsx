import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Habit } from '@/hooks/useCodeBasedHabits';
import { cn } from '@/lib/utils';
import { sk } from 'date-fns/locale';

interface MonthlyCalendarProps {
  habitData: Record<string, Record<string, number>>;
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  habits: Habit[];
  formatDate: (date: Date) => string;
  accessCode?: string;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  habitData,
  selectedMonth,
  onMonthChange,
  habits,
  formatDate,
  accessCode
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

  const getDateSymptoms = (date: Date) => {
    const dateStr = formatDate(date);
    const symptomsKey = accessCode 
      ? `symptoms_${accessCode}_${dateStr}` 
      : `temp_symptoms_${dateStr}`;
    const savedSymptoms = localStorage.getItem(symptomsKey);
    return savedSymptoms ? JSON.parse(savedSymptoms) : [];
  };

  const getDateNotes = (date: Date) => {
    const dateStr = formatDate(date);
    const notesKey = accessCode 
      ? `notes_${accessCode}_${dateStr}` 
      : `temp_notes_${dateStr}`;
    return localStorage.getItem(notesKey) || '';
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

  const modifiersClassNames = {
    completed: 'calendar-completed-day',
    partial: 'calendar-partial-day'
  };

  return (
    <div className="w-full max-w-none space-y-2 touch-none select-none" style={{ touchAction: 'manipulation' }}>
      <div className="glass-surface rounded-2xl w-full max-w-none overflow-hidden">
        <Calendar
          locale={sk}
          weekStartsOn={1}
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          onMonthChange={onMonthChange}
          month={selectedMonth}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className={cn("rounded-xl border-0 w-full pointer-events-auto")}
          classNames={{
            months: "flex flex-col w-full",
            month: "w-full space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-base font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm flex-1",
            row: "flex w-full mt-2",
            cell: "h-10 w-full text-center text-base p-0 relative flex-1 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              "h-10 w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center"
            ),
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground rounded-lg border-2 border-primary/20",
            day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          showOutsideDays={false}
        />
      </div>
      
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
                    <span className="text-sm">{habit.emoji}</span>
                    <span className="text-sm font-medium text-foreground/80">{habit.name}</span>
                  </div>
                  <div className={`text-sm font-semibold ${isCompleted ? 'text-green-600' : 'text-foreground/60'}`}>
                    {habit.name === 'Hydratácia' ? Number(value).toFixed(1) : Math.round(Number(value))} / {habit.target} {habit.unit}
                  </div>
                </div>
                );
              })}
            </div>
            
            {/* Symptoms and Notes Display */}
            <div className="mt-3 space-y-2">
              {(() => {
                const symptoms = getDateSymptoms(selectedDate);
                const notes = getDateNotes(selectedDate);
                
                if (symptoms.length === 0 && !notes.trim()) return null;
                
                return (
                  <div className="border-t border-muted pt-2">
                    {symptoms.length > 0 && (
                      <div className="mb-2">
                        <h5 className="text-xs font-medium text-foreground/60 mb-1">Príznaky:</h5>
                        <div className="flex flex-wrap gap-1">
                          {symptoms.map((symptomId: string) => {
                            // Import symptoms map here since we need it
                            const symptomEmojis: Record<string, string> = {
                              'cramps': '💢', 'heavy_flow': '🩸', 'back_pain': '🦴', 'headache': '🤕',
                              'fatigue': '😴', 'nausea': '🤢', 'energy_boost': '⚡', 'good_mood': '😊',
                              'clear_skin': '✨', 'motivation': '🎯', 'increased_libido': '💖',
                              'cervical_mucus': '💧', 'ovulation_pain': '⚠️', 'breast_tenderness': '🤱',
                              'bloating': '🎈', 'mood_swings': '🎭', 'food_cravings': '🍫',
                              'irritability': '😤', 'acne': '🔴', 'sleep_issues': '🌙',
                              'anxiety': '😰', 'depression': '😔'
                            };
                            return (
                              <span key={symptomId} className="text-sm">
                                {symptomEmojis[symptomId] || '📝'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {notes.trim() && (
                      <div>
                        <h5 className="text-xs font-medium text-foreground/60 mb-1">Poznámky:</h5>
                        <p className="text-xs text-foreground/70 line-clamp-2">{notes}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
        </div>
      )}
    </div>
  );
};