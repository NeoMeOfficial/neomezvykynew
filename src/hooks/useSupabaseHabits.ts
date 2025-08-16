import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  target: number;
  unit: string;
}

export const useSupabaseHabits = () => {
  const [habitData, setHabitData] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const { toast } = useToast();

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

  // Initialize anonymous authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Sign in anonymously
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error('Error signing in anonymously:', error);
            setConnected(false);
            return;
          }
          setUserId(data.user?.id || '');
        } else {
          setUserId(user.id);
        }
        setConnected(true);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setConnected(false);
      }
    };

    initAuth();
  }, []);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      
      try {
        const { data: entries, error } = await supabase
          .from('habit_entries')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Error loading habit entries:', error);
          setConnected(false);
          // Fallback to localStorage
          const savedData = localStorage.getItem('habit_tracker_data');
          if (savedData) {
            try {
              setHabitData(JSON.parse(savedData));
            } catch (e) {
              console.error('Failed to parse saved data');
            }
          }
        } else {
          setConnected(true);
          const dataMap: Record<string, Record<string, number>> = {};
          
          entries?.forEach(entry => {
            if (!dataMap[entry.habit_id]) {
              dataMap[entry.habit_id] = {};
            }
            dataMap[entry.habit_id][entry.date] = Number(entry.value);
          });
          
          setHabitData(dataMap);
        }
      } catch (error) {
        console.error('Database connection failed:', error);
        setConnected(false);
        // Fallback to localStorage
        const savedData = localStorage.getItem('habit_tracker_data');
        if (savedData) {
          try {
            setHabitData(JSON.parse(savedData));
          } catch (e) {
            console.error('Failed to parse saved data');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

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
    const numValue = Math.max(0, Number(value) || 0);
    
    // Update local state immediately
    setHabitData(prev => {
      const newData = {
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [dateStr]: numValue
        }
      };
      localStorage.setItem('habit_tracker_data', JSON.stringify(newData));
      return newData;
    });

    // Try to save to Supabase
    if (connected && userId) {
      try {
        const { error } = await supabase
          .from('habit_entries')
          .upsert({
            user_id: userId,
            habit_id: habitId,
            date: dateStr,
            value: numValue
          }, {
            onConflict: 'user_id,habit_id,date'
          });

        if (error) {
          console.error('Error saving to database:', error);
          setConnected(false);
        } else {
          setTimeout(() => {
            const habit = habits.find(h => h.id === habitId);
            toast({
              title: "✓ Anonymne uložené",
              description: `${habit?.name}: ${value} ${habit?.unit}`,
              duration: 1500,
            });
          }, 800);
        }
      } catch (error) {
        console.error('Database save failed:', error);
        setConnected(false);
      }
    } else {
      // Show localStorage save confirmation
      setTimeout(() => {
        const habit = habits.find(h => h.id === habitId);
        toast({
          title: "✓ Lokálne uložené",
          description: `${habit?.name}: ${value} ${habit?.unit}`,
          duration: 1500,
        });
      }, 800);
    }
  }, [habits, toast, connected, userId]);

  return {
    habits,
    loading,
    connected,
    updateHabitProgress,
    habitData,
    formatDate,
    startOfDay
  };
};