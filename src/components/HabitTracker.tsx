import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCodeBasedHabits } from '../hooks/useCodeBasedHabits';
import { WeekDay } from './WeekDay';
import { HabitCard } from './HabitCard';
import { MonthlyCalendar } from './MonthlyCalendar';

import { SuccessIndicator } from './SuccessIndicator';

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
  onFirstInteraction?: () => void;
}

export default function HabitTracker({ onFirstInteraction }: HabitTrackerProps) {
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  
  const handleSuccess = useCallback(() => {
    setShowSuccessIndicator(true);
    setTimeout(() => {
      setShowSuccessIndicator(false);
    }, 1200);
  }, []);
  
  const { habits, habitData, loading, updateHabitProgress, formatDate, startOfDay, hasAccessCode } = useCodeBasedHabits(handleSuccess);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [monthlyCalendarDate, setMonthlyCalendarDate] = useState(new Date());
  const [showMonthlyCalendar, setShowMonthlyCalendar] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-center today's date when component loads
  useEffect(() => {
    if (todayButtonRef.current && scrollRef.current) {
      const button = todayButtonRef.current;
      const container = scrollRef.current;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [loading, habits]);

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

  const weekDays = useMemo(() => {
    const days = [];
    // Show 5 days total (-2, -1, 0, +1, +2) with the middle day being selected
    for (let i = -2; i <= 2; i++) {
      days.push(addDays(selectedDate, i));
    }
    return days;
  }, [selectedDate]);

  const goToPreviousDay = useCallback(() => {
    setSelectedDate(prev => addDays(prev, -1));
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDate(prev => addDays(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
  }, []);

  const completedCount = useMemo(() => {
    return habits.filter(habit => isHabitCompleted(habit.id, selectedDate)).length;
  }, [habits, selectedDate, isHabitCompleted]);

  if (loading) {
    return (
      <div className="bg-background p-1">
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Loading your habits...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-1">
      <div className="max-w-md mx-auto space-y-2">
        {/* Navigation with arrows */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousDay}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-2">
            {weekDays.map((date, index) => {
              const isToday = isSameDay(date, new Date());
              const isSelected = index === 2; // Middle day is always selected (index 2 of 5 days)
              const completionPercentage = getDayCompletionPercentage(date);
              
              return (
                <WeekDay
                  key={index}
                  date={date}
                  isSelected={isSelected}
                  isToday={isToday}
                  isCentral={isSelected}
                  completionPercentage={completionPercentage}
                  onClick={() => setSelectedDate(date)}
                />
              );
            })}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextDay}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Moje návyky</h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                {completedCount} z {habits.length} dokončených
              </p>
              <Dialog open={showMonthlyCalendar} onOpenChange={setShowMonthlyCalendar}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm">
                    <Calendar size={20} className="text-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-fit">
                  <DialogHeader>
                    <DialogTitle>Mesačný pohľad</DialogTitle>
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

        {hasAccessCode && (
          <div className="text-center mt-4">
            <p className="text-green-300 text-sm">✓ Údaje sa synchronizujú s databázou</p>
          </div>
        )}
        
        <SuccessIndicator show={showSuccessIndicator} />

      </div>
    </div>
  );
}