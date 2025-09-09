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
      name: 'Voda', 
      emoji: '💧', 
      color: '#3B82F6',
      target: 8,
      unit: 'pohárov'
    },
    { 
      id: 'steps', 
      name: 'Kroky', 
      emoji: '👟', 
      color: '#89B0BC',
      target: 10000,
      unit: 'krokov'
    },
    { 
      id: 'nutrition', 
      name: 'Zdravé jedlo', 
      emoji: '🥗', 
      color: '#10B981',
      target: 5,
      unit: 'porcií'
    },
    { 
      id: 'exercise', 
      name: 'Cvičenie-strečing', 
      emoji: '🧘‍♀️', 
      color: '#5F3E31',
      target: 30,
      unit: 'minút'
    },
  ];

  // Function to immediately seed habits when code is created
  const seedHabitsForNewCode = useCallback(async (newAccessCode: string) => {
    console.log('Seeding habits for new access code:', newAccessCode);
    setLoading(true);
    
    try {
      const habitsToInsert = defaultHabits.map(habit => ({
        name: habit.name,
        emoji: habit.emoji,
        color: habit.color,
        target: habit.target,
        unit: habit.unit,
        access_code: newAccessCode,
      }));

      console.log('Inserting habits for new code:', habitsToInsert);

      const { data: inserted, error } = await supabase
        .from('habits')
        .insert(habitsToInsert)
        .select('*');

      if (error) {
        console.error('Database insert error for new code:', error);
        throw error;
      }

      console.log('Successfully inserted habits for new code:', inserted);

      const mappedHabits: Habit[] = (inserted ?? []).map(habit => ({
        id: habit.id,
        name: habit.name,
        emoji: habit.emoji,
        color: habit.color,
        target: habit.target,
        unit: habit.unit
      }));

      setHabits(mappedHabits);
      console.log('Habits ready for new access code');
    } catch (error) {
      console.error('Error seeding habits for new code:', error);
      setHabits(defaultHabits);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for access code changes to handle immediate state updates
  useEffect(() => {
    const handleAccessCodeChange = (event: CustomEvent) => {
      console.log('Access code changed event received:', event.detail);
      const newAccessCode = event.detail?.accessCode;
      
      if (newAccessCode) {
        // New code created - reset state and let the main effect handle loading
        console.log('New access code detected, resetting state');
        setHabits([]);
        setHabitData({});
        setLoading(true);
      } else {
        // Code cleared - reset to defaults immediately
        console.log('Access code cleared, resetting to default habits');
        setHabits(defaultHabits);
        setHabitData({});
        setLoading(false);
      }
    };

    window.addEventListener('accessCodeChanged', handleAccessCodeChange as EventListener);
    return () => window.removeEventListener('accessCodeChanged', handleAccessCodeChange as EventListener);
  }, []);


  // Load habits from database when access code is available
  useEffect(() => {
    if (!accessCode) {
      // Return default habits when no access code for local use
      console.log('No access code, using default habits');
      setHabits(defaultHabits);
      setLoading(false);
      return;
    }

    console.log('=== LOADING HABITS FOR ACCESS CODE ===');
    console.log('Access code:', accessCode);
    console.log('Current habits state:', habits.length);
    
    const loadHabits = async () => {
      setLoading(true);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('=== HABITS LOADING TIMEOUT ===');
        console.warn('Falling back to defaults after 10 seconds');
        setHabits(defaultHabits);
        setLoading(false);
      }, 10000); // 10 second timeout

      try {
        console.log('Fetching existing habits from database...');
        const { data: existingHabits, error } = await supabase
          .from('habits')
          .select('*')
          .eq('access_code', accessCode);

        clearTimeout(timeoutId);

        if (error) {
          console.error('=== DATABASE ERROR FETCHING HABITS ===');
          console.error('Error details:', error);
          throw error;
        }

        console.log('=== HABITS FETCH RESULT ===');
        console.log('Existing habits found:', existingHabits?.length || 0);
        console.log('Habits data:', existingHabits);

        if (existingHabits && existingHabits.length > 0) {
          // Convert from database format to our interface
          const mappedHabits = existingHabits.map(habit => ({
            id: habit.id, // Use the database UUID, not the local ID
            name: habit.name,
            emoji: habit.emoji,
            color: habit.color,
            target: habit.target,
            unit: habit.unit
          }));
          console.log('=== USING EXISTING HABITS ===');
          console.log('Mapped habits with DB IDs:', mappedHabits);
          setHabits(mappedHabits);
        } else {
          // No habits found, seed with defaults
          console.log('=== NO HABITS FOUND, SEEDING DEFAULTS ===');
          await seedDefaultHabits();
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('=== ERROR LOADING HABITS ===');
        console.error('Error details:', error);
        // Fallback to default habits
        console.log('=== FALLING BACK TO DEFAULT HABITS ===');
        setHabits(defaultHabits);
      } finally {
        setLoading(false);
        console.log('=== HABITS LOADING COMPLETE ===');
      }
    };

    loadHabits();
  }, [accessCode]);

  // Load habit entries when access code is available
  useEffect(() => {
    if (!accessCode) {
      console.log('No access code for habit entries, clearing data');
      setHabitData({});
      return;
    }

    console.log('=== LOADING HABIT ENTRIES ===');
    console.log('Access code for entries:', accessCode);

    const loadHabitData = async () => {
      try {
        const { data: entries, error } = await supabase
          .from('habit_entries')
          .select('*')
          .eq('access_code', accessCode);

        if (error) {
          console.error('=== ERROR LOADING HABIT ENTRIES ===');
          console.error('Error details:', error);
          throw error;
        }

        console.log('=== HABIT ENTRIES LOADED ===');
        console.log('Entries count:', entries?.length || 0);
        console.log('Entries data:', entries);

        if (entries) {
          const formattedData: Record<string, Record<string, number>> = {};
          
          entries.forEach(entry => {
            console.log('Processing entry:', entry);
            if (!formattedData[entry.habit_id]) {
              formattedData[entry.habit_id] = {};
            }
            formattedData[entry.habit_id][entry.date] = Number(entry.value);
          });

          console.log('=== FORMATTED HABIT DATA ===');
          console.log('Formatted data:', formattedData);
          setHabitData(formattedData);
        }
      } catch (error) {
        console.error('=== ERROR IN HABIT DATA LOADING ===');
        console.error('Error loading habit data:', error);
      }
    };

    loadHabitData();
  }, [accessCode]);

  const seedDefaultHabits = async () => {
    if (!accessCode) {
      console.log('Cannot seed habits: no access code');
      return;
    }

    try {
      console.log('Seeding default habits with access code:', accessCode);
      
      const habitsToInsert = defaultHabits.map(habit => ({
        name: habit.name,
        emoji: habit.emoji,
        color: habit.color,
        target: habit.target,
        unit: habit.unit,
        access_code: accessCode,
      }));

      console.log('Inserting habits:', habitsToInsert);

      const { data: inserted, error } = await supabase
        .from('habits')
        .insert(habitsToInsert)
        .select('*');

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Successfully inserted habits:', inserted);

      // Map inserted DB rows to our Habit interface (use DB-generated UUIDs)
      const mappedHabits: Habit[] = (inserted ?? []).map(habit => ({
        id: habit.id,
        name: habit.name,
        emoji: habit.emoji,
        color: habit.color,
        target: habit.target,
        unit: habit.unit
      }));

      console.log('Setting mapped habits:', mappedHabits);
      setHabits(mappedHabits);
    } catch (error) {
      console.error('Error seeding habits:', error);
      // Fallback to default habits (local-only, won't sync)
      console.log('Using default habits as fallback');
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
    
    console.log('=== UPDATE HABIT PROGRESS START ===');
    console.log('updateHabitProgress called:', {
      habitId,
      dateStr, 
      numericValue,
      accessCode,
      hasAccessCode: !!accessCode
    });
    
    // Update local state immediately
    setHabitData(prev => {
      const newData = {
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [dateStr]: numericValue
        }
      };
      console.log('Local state updated:', newData);
      return newData;
    });

    // Update database if we have an access code
    if (accessCode) {
      try {
        console.log('Attempting to upsert to database:', {
          habit_id: habitId,
          date: dateStr,
          value: numericValue,
          access_code: accessCode,
        });

        const { data, error } = await supabase
          .from('habit_entries')
          .upsert({
            habit_id: habitId,
            date: dateStr,
            value: numericValue,
            access_code: accessCode,
          }, {
            onConflict: 'habit_id,date,access_code'
          })
          .select();

        if (error) {
          console.error('=== DATABASE UPSERT ERROR ===');
          console.error('Database upsert error:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }
        
        console.log('=== DATABASE UPSERT SUCCESS ===');
        console.log('Database upsert successful:', data);
      } catch (error) {
        console.error('=== CAUGHT ERROR IN UPDATE ===');
        console.error('Error updating habit progress:', error);
        // Don't revert local state - let the user see their changes even if DB fails
      }
    } else {
      console.log('No access code available, skipping database save');
    }

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 200);
    }
    
    console.log('=== UPDATE HABIT PROGRESS END ===');
  }, [accessCode, onSuccess]);

  return {
    habits,
    loading,
    updateHabitProgress,
    habitData,
    formatDate,
    startOfDay,
    hasAccessCode: !!accessCode,
    seedHabitsForNewCode
  };
};