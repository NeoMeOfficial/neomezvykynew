// Legacy hook - use useSupabaseHabits for new implementations
import { useSupabaseHabits } from './useSupabaseHabits';

export const useHabits = (onSuccess?: () => void) => {
  return useSupabaseHabits(onSuccess);
};

import { useState, useEffect, useCallback } from 'react';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  target: number;
  unit: string;
}

export const useLocalHabits = (onSuccess?: () => void) => {
  const [habitData, setHabitData] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);

  const habits: Habit[] = [
    { 
      id: 'water', 
      name: 'Hydratácia', 
      emoji: '💧', 
      color: '#80B9C8',
      target: 2,
      unit: 'L'
    },
    { 
      id: 'steps', 
      name: 'Pohyb', 
      emoji: '👟', 
      color: '#E5B050',
      target: 10000,
      unit: 'krokov'
    },
    { 
      id: 'nutrition', 
      name: 'Výživa', 
      emoji: '🥗', 
      color: '#B2D9C4',
      target: 3,
      unit: 'jedál'
    },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('habit_tracker_data');
    if (savedData) {
      try {
        setHabitData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse saved data');
      }
    }
    setLoading(false);
  }, []);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const updateHabitProgress = useCallback((habitId: string, date: Date, value: number) => {
    const dateStr = formatDate(startOfDay(date));
    
    setHabitData(prev => {
      const newData = {
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [dateStr]: Math.max(0, Number(value) || 0)
        }
      };
      localStorage.setItem('habit_tracker_data', JSON.stringify(newData));
      return newData;
    });

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 100);
    }
  }, [onSuccess]);

  return {
    habits,
    loading,
    updateHabitProgress,
    habitData,
    formatDate,
    startOfDay
  };
};