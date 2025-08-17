import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAccessCode } from './useAccessCode';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  target: number;
  unit: string;
}

export const useCodeBasedHabits = (onSuccess?: () => void) => {
  const { accessCode } = useAccessCode();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitData, setHabitData] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);

  const defaultHabits: Habit[] = [
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

  // Load habits from database when access code is available
  useEffect(() => {
    if (!accessCode) {
      setLoading(false);
      return;
    }

    const loadHabits = async () => {
      try {
        const { data: existingHabits, error } = await supabase
          .from('habits')
          .select('*')
          .eq('access_code', accessCode);

        if (error) throw error;

        if (existingHabits && existingHabits.length > 0) {
          // Convert from database format to our interface
          const mappedHabits = existingHabits.map(habit => ({
            id: habit.id,
            name: habit.name,
            emoji: habit.emoji,
            color: habit.color,
            target: habit.target,
            unit: habit.unit
          }));
          setHabits(mappedHabits);
        } else {
          // No habits found, seed with defaults
          await seedDefaultHabits();
        }
      } catch (error) {
        console.error('Error loading habits:', error);
        // Fallback to default habits
        setHabits(defaultHabits);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, [accessCode]);

  // Load habit entries when access code is available
  useEffect(() => {
    if (!accessCode) return;

    const loadHabitData = async () => {
      try {
        const { data: entries, error } = await supabase
          .from('habit_entries')
          .select('*')
          .eq('access_code', accessCode);

        if (error) throw error;

        if (entries) {
          const formattedData: Record<string, Record<string, number>> = {};
          
          entries.forEach(entry => {
            if (!formattedData[entry.habit_id]) {
              formattedData[entry.habit_id] = {};
            }
            formattedData[entry.habit_id][entry.date] = Number(entry.value);
          });

          setHabitData(formattedData);
        }
      } catch (error) {
        console.error('Error loading habit data:', error);
      }
    };

    loadHabitData();
  }, [accessCode]);

  const seedDefaultHabits = async () => {
    if (!accessCode) return;

    try {
      const habitsToInsert = defaultHabits.map(habit => ({
        id: habit.id,
        name: habit.name,
        emoji: habit.emoji,
        color: habit.color,
        target: habit.target,
        unit: habit.unit,
        access_code: accessCode
      }));

      const { error } = await supabase
        .from('habits')
        .insert(habitsToInsert);

      if (error) throw error;

      setHabits(defaultHabits);
    } catch (error) {
      console.error('Error seeding habits:', error);
      setHabits(defaultHabits);
    }
  };

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

  const updateHabitProgress = useCallback(async (habitId: string, date: Date, value: number) => {
    const dateStr = formatDate(startOfDay(date));
    const numericValue = Math.max(0, Number(value) || 0);
    
    // Update local state immediately
    setHabitData(prev => {
      const newData = {
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [dateStr]: numericValue
        }
      };
      return newData;
    });

    // Update database if we have an access code
    if (accessCode) {
      try {
        const { error } = await supabase
          .from('habit_entries')
          .upsert({
            habit_id: habitId,
            date: dateStr,
            value: numericValue,
            access_code: accessCode
          }, {
            onConflict: 'habit_id,date,access_code'
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error updating habit progress:', error);
      }
    }

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 200);
    }
  }, [accessCode, onSuccess]);

  return {
    habits,
    loading,
    updateHabitProgress,
    habitData,
    formatDate,
    startOfDay,
    hasAccessCode: !!accessCode
  };
};