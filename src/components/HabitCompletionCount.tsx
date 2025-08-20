import React, { useMemo } from 'react';
import { useCodeBasedHabits } from '../hooks/useCodeBasedHabits';

interface HabitCompletionCountProps {
  selectedDate: Date;
}

export default function HabitCompletionCount({ selectedDate }: HabitCompletionCountProps) {
  const { habits, habitData, loading, formatDate, startOfDay } = useCodeBasedHabits();

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