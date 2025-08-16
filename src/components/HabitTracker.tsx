import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useHabits } from '@/hooks/useHabits';
import { WeekDay } from './WeekDay';
import { HabitCard } from './HabitCard';
import { MonthlyCalendar } from './MonthlyCalendar';
import { ConnectionStatus } from './ConnectionStatus';
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

export default function HabitTracker() {
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  
  const handleSuccess = useCallback(() => {
    setShowSuccessIndicator(true);
    setTimeout(() => {
      setShowSuccessIndicator(false);
    }, 1200);
  }, []);
  
  const { habits, habitData, loading, connected, updateHabitProgress, formatDate, startOfDay } = useHabits(handleSuccess);
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
    // Show 7 days total (-3 to +3) for 5 full days + half days on sides
    for (let i = -3; i <= 3; i++) {
      days.push(addDays(anchorDate, i));
    }
    return days;
  }, [anchorDate]);

  // Check if today is visible in current week view
  const isTodayVisible = useMemo(() => {
    const today = new Date();
    return weekDays.some(date => isSameDay(date, today));
  }, [weekDays]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setAnchorDate(today);
    setSelectedDate(today);
  }, []);


  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 30; // Reduced for faster response
    const swipeVelocity = Math.abs(swipeDistance);

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      // More responsive: larger swipes move multiple days
      const daysToMove = swipeVelocity > 100 ? 2 : 1;
      setAnchorDate((prev) => addDays(prev, swipeDistance > 0 ? daysToMove : -daysToMove));
    }
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
        <div className="relative overflow-hidden">
          {!isTodayVisible && (
            <Button
              onClick={goToToday}
              size="sm"
              className="absolute top-2 right-2 z-10 bg-primary/90 hover:bg-primary text-primary-foreground px-3 py-1 text-xs rounded-full shadow-lg"
            >
              Dnes
            </Button>
          )}
          <div 
            ref={scrollRef} 
            className="flex justify-center w-full pb-1 px-4"
            style={{ 
              transform: 'translateX(0)',
              gap: '8px',
              maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {weekDays.map((date, index) => {
              const isToday = isSameDay(date, new Date());
              const isSelected = isSameDay(date, selectedDate);
              const isCentral = index === 3; // Center position in the 7-day layout (-3 to +3)
              const isEdge = index === 0 || index === 6; // First and last items (half visible)
              const completionPercentage = getDayCompletionPercentage(date);
              
              return (
                <div
                  key={index}
                  className={`transition-all duration-200 ${
                    isEdge ? 'opacity-50 scale-75' : 'opacity-100 scale-100'
                  }`}
                >
                  <WeekDay
                    date={date}
                    isSelected={isSelected}
                    isToday={isToday}
                    isCentral={isCentral}
                    completionPercentage={completionPercentage}
                    onClick={() => setSelectedDate(date)}
                    buttonRef={isToday ? todayButtonRef : undefined}
                  />
                </div>
              );
            })}
          </div>
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
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              progress={getHabitProgress(habit.id, selectedDate)}
              streak={getStreak(habit.id)}
              onProgressChange={(value) => updateHabitProgress(habit.id, selectedDate, value)}
            />
          ))}
        </div>

        <ConnectionStatus connected={connected} />
        
        <SuccessIndicator show={showSuccessIndicator} />

      </div>
    </div>
  );
}