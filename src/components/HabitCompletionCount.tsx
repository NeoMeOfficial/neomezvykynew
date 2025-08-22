import React, { useMemo } from 'react';
import { useCodeBasedHabits } from '../hooks/useCodeBasedHabits';
import { useTemporaryHabits } from '../hooks/useTemporaryHabits';
import { useAccessCode } from '../hooks/useAccessCode';

interface HabitCompletionCountProps {
  selectedDate: Date;
}

export default function HabitCompletionCount({ selectedDate }: HabitCompletionCountProps) {
  const { accessCode } = useAccessCode();
  const realHabitsData = useCodeBasedHabits();
  const tempHabitsData = useTemporaryHabits();
  
  // Use appropriate data source based on access code availability
  const { habits, habitData, loading, formatDate, startOfDay } = 
    accessCode ? realHabitsData : tempHabitsData;

  const isHabitCompleted = (habitId: string, date: Date) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return false;
    const dateStr = formatDate(startOfDay(date));
    const value = habitData[habitId]?.[dateStr] || 0;
    const progress = typeof value === 'number' ? value : Number(value) || 0;
    return progress >= habit.target;
  };

  const completedCount = useMemo(() => {
    return habits.filter(habit => isHabitCompleted(habit.id, selectedDate)).length;
  }, [habits, selectedDate, habitData]);

  if (loading) return null;

  return `${completedCount} z ${habits.length} dokončených`;
}