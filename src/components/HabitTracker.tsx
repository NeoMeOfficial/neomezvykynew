import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useHabits } from '@/hooks/useHabits';
import { WeekDay } from './WeekDay';
import { HabitCard } from './HabitCard';
import { MonthlyCalendar } from './MonthlyCalendar';
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

export default function HabitTracker() {
  const { habits, habitData, loading, connected, updateHabitProgress, formatDate, startOfDay } = useHabits();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyCalendarDate, setMonthlyCalendarDate] = useState(new Date());
  const [showMonthlyCalendar, setShowMonthlyCalendar] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayButtonRef = useRef<HTMLButtonElement>(null);

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
    let totalProgress = 0;
    habits.forEach(habit => {
      const value = getHabitProgress(habit.id, date);
      const progress = Math.min(value / habit.target, 1);
      totalProgress += progress;
    });
    return (totalProgress / habits.length) * 100;
  }, [habits, getHabitProgress]);

  const weekDays = useMemo(() => {
    const today = new Date();
    const days = [];
    // Show 6 days total (-2 to +3) for better spacing
    for (let i = -2; i <= 3; i++) {
      days.push(addDays(today, i));
    }
    return days;
  }, []);

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  }, []);

  const { upcomingHabits, completedHabits } = useMemo(() => {
    const upcoming = [];
    const completed = [];
    
    habits.forEach(habit => {
      if (isHabitCompleted(habit.id, selectedDate)) {
        completed.push(habit);
      } else {
        upcoming.push(habit);
      }
    });
    
    return { upcomingHabits: upcoming, completedHabits: completed };
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
        <ConnectionStatus connected={connected} />
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-1 h-6 w-6 bg-background/80 hover:bg-background border border-border/50 rounded-full shadow-sm"
            onClick={scrollLeft}
          >
            <ChevronLeft size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-1 h-6 w-6 bg-background/80 hover:bg-background border border-border/50 rounded-full shadow-sm"
            onClick={scrollRight}
          >
            <ChevronRight size={12} />
          </Button>
          <div ref={scrollRef} className="flex justify-between w-full pb-1 px-1">
            {weekDays.map((date, index) => {
              const isToday = isSameDay(date, new Date());
              const isSelected = isSameDay(date, selectedDate);
              const completionPercentage = getDayCompletionPercentage(date);
              
              return (
                <WeekDay
                  key={index}
                  date={date}
                  isSelected={isSelected}
                  isToday={isToday}
                  completionPercentage={completionPercentage}
                  onClick={() => setSelectedDate(date)}
                  buttonRef={isToday ? todayButtonRef : undefined}
                />
              );
            })}
          </div>
        </div>

        {upcomingHabits.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Nadchádzajúce</h2>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  {completedHabits.length} z {upcomingHabits.length + completedHabits.length} dokončených
                </p>
                <Dialog open={showMonthlyCalendar} onOpenChange={setShowMonthlyCalendar}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm">
                      <Calendar size={20} className="text-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
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
            {upcomingHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                progress={getHabitProgress(habit.id, selectedDate)}
                streak={getStreak(habit.id)}
                onProgressChange={(value) => updateHabitProgress(habit.id, selectedDate, value)}
              />
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <h2 className="text-sm font-semibold text-foreground">Dnes dokončené</h2>
          {completedHabits.length > 0 ? (
            completedHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                progress={getHabitProgress(habit.id, selectedDate)}
                streak={getStreak(habit.id)}
                onProgressChange={(value) => updateHabitProgress(habit.id, selectedDate, value)}
              />
            ))
          ) : (
            <div className="w-full p-2 rounded-lg border-2 bg-muted border-border text-muted-foreground">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-xl opacity-50">✨</span>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">
                        Aj dnes môžeš pre seba niečo spraviť
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}