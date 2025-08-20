import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCodeBasedHabits } from '../hooks/useCodeBasedHabits';
import { useAccessCode } from '../hooks/useAccessCode';
import { HabitCard } from './HabitCard';
import { MonthlyCalendar } from './MonthlyCalendar';
import { DateNavigationHeader } from './DateNavigationHeader';

import { SuccessIndicator } from './SuccessIndicator';
import { ConnectionStatus } from './ConnectionStatus';

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

interface HabitTrackerProps {
  selectedDate: Date;
  onFirstInteraction?: () => void;
}

export default function HabitTracker({ selectedDate, onFirstInteraction }: HabitTrackerProps) {
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  
  const handleSuccess = useCallback(() => {
    setShowSuccessIndicator(true);
    setTimeout(() => {
      setShowSuccessIndicator(false);
    }, 1200);
  }, []);
  
  const { habits, habitData, loading, updateHabitProgress, formatDate, startOfDay, hasAccessCode } = useCodeBasedHabits(handleSuccess);
  const { accessCode } = useAccessCode();
  const [monthlyCalendarDate, setMonthlyCalendarDate] = useState(new Date());
  const [showMonthlyCalendar, setShowMonthlyCalendar] = useState(false);


  const getHabitProgress = useCallback((habitId: string, date: Date) => {
    const dateStr = formatDate(startOfDay(date));
    const value = habitData[habitId]?.[dateStr] || 0;
    return typeof value === 'number' ? value : Number(value) || 0;
  }, [habitData, formatDate, startOfDay]);

  const getStreak = useCallback((habitId: string) => {
    let streak = 0;
    let currentDate = startOfDay(new Date());
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    while (true) {
      const dateStr = formatDate(currentDate);
      const value = habitData[habitId]?.[dateStr] || 0;
      if (value >= habit.target) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [habitData, habits, formatDate]);

  const isHabitCompleted = useCallback((habitId: string, date: Date) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return false;
    const progress = getHabitProgress(habitId, date);
    return progress >= habit.target;
  }, [habits, getHabitProgress]);

  const getDayCompletionPercentage = useCallback((date: Date) => {
    if (habits.length === 0) return 0; // Prevent division by zero
    let totalProgress = 0;
    habits.forEach(habit => {
      const value = getHabitProgress(habit.id, date);
      const progress = Math.min(value / habit.target, 1);
      totalProgress += progress;
    });
    return (totalProgress / habits.length) * 100;
  }, [habits, getHabitProgress]);



  const completedCount = useMemo(() => {
    return habits.filter(habit => isHabitCompleted(habit.id, selectedDate)).length;
  }, [habits, selectedDate, isHabitCompleted]);

  if (loading) {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-widget-text-soft animate-spin" />
          <span className="ml-2 text-sm text-widget-text-soft">Načítavam návyky...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-widget-text-soft">
                {completedCount} z {habits.length} dokončených
              </p>
              <Dialog open={showMonthlyCalendar} onOpenChange={setShowMonthlyCalendar}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm">
                    <Calendar size={20} className="text-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-fit">
                  <DialogHeader className="pb-0">
                    <DialogTitle className="text-lg">Mesačný pohľad - Návyky</DialogTitle>
                  </DialogHeader>
                  <MonthlyCalendar
                    habitData={habitData}
                    selectedMonth={monthlyCalendarDate}
                    onMonthChange={setMonthlyCalendarDate}
                    habits={habits}
                    formatDate={formatDate}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              progress={getHabitProgress(habit.id, selectedDate)}
              streak={getStreak(habit.id)}
              onProgressChange={(value) => updateHabitProgress(habit.id, selectedDate, value)}
              onFirstInteraction={onFirstInteraction}
            />
          ))}
        </div>

        <SuccessIndicator show={showSuccessIndicator} />
    </div>
  );
}