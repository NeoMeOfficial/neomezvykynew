import { useState, useCallback, useEffect } from 'react';
import { temporaryStorage } from '@/lib/temporaryStorage';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  target: number;
  unit: string;
}

// Default habits for temporary use
const DEFAULT_HABITS: Habit[] = [
  { id: 'water', name: 'Voda', emoji: '💧', color: '#3B82F6', target: 8, unit: 'pohárov' },
  { id: 'steps', name: 'Kroky', emoji: '👟', color: '#10B981', target: 10000, unit: 'krokov' },
  { id: 'nutrition', name: 'Zdravé jedlo', emoji: '🥗', color: '#F59E0B', target: 5, unit: 'porcií' },
  { id: 'exercise', name: 'Cvičenie-strečing', emoji: '🧘‍♀️', color: '#EF4444', target: 30, unit: 'minút' }
];

export function useTemporaryHabits(onSuccess?: () => void) {
  const [habits] = useState<Habit[]>(DEFAULT_HABITS);
  const [habitData, setHabitData] = useState<{ [key: string]: { [date: string]: number } }>({});
  const [loading] = useState(false);

  // Helper functions
  const formatDate = useCallback((date: Date): string => {
    return date.toISOString().split('T')[0];
  }, []);

  const startOfDay = useCallback((date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }, []);

  // Load temporary data on mount
  useEffect(() => {
    const tempData = temporaryStorage.getAllHabitData();
    const formattedData: { [key: string]: { [date: string]: number } } = {};
    
    tempData.forEach(entry => {
      if (!formattedData[entry.habitId]) {
        formattedData[entry.habitId] = {};
      }
      formattedData[entry.habitId][entry.date] = entry.value;
    });
    
    setHabitData(formattedData);
  }, []);

  const updateHabitProgress = useCallback(async (habitId: string, date: Date, value: number) => {
    const dateStr = formatDate(startOfDay(date));
    
    // Start temporary session if not already active
    if (!temporaryStorage.isSessionActive()) {
      temporaryStorage.startSession();
    }
    
    // Store in temporary storage
    temporaryStorage.storeHabitProgress(habitId, dateStr, value);
    
    // Update local state
    setHabitData(prev => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        [dateStr]: value
      }
    }));

    // Call success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  }, [formatDate, startOfDay, onSuccess]);

  return {
    habits,
    habitData,
    loading,
    updateHabitProgress,
    formatDate,
    startOfDay,
    hasAccessCode: false
  };
}