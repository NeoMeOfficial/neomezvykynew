import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  target: number;
  unit: string;
}

export const useSupabaseHabits = (onSuccess?: () => void) => {
  const [habitData, setHabitData] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState<string>('');

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

  // Initialize persistent anonymous authentication
  useEffect(() => {
    const STORED_USER_KEY = 'habit_tracker_user_id';
    
    const initAuth = async () => {
      try {
        // First, set up auth state listener for session persistence
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              setUserId(session.user.id);
              setConnected(true);
              // Store user ID in localStorage for persistence
              localStorage.setItem(STORED_USER_KEY, session.user.id);
            } else {
              // Try to recover from stored user ID
              const storedUserId = localStorage.getItem(STORED_USER_KEY);
              if (storedUserId) {
                setUserId(storedUserId);
                setConnected(false); // Mark as disconnected but keep user ID
              }
            }
          }
        );

        // Check for existing session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Existing session found
          setUserId(session.user.id);
          setConnected(true);
          localStorage.setItem(STORED_USER_KEY, session.user.id);
        } else {
          // No active session, check for stored user ID
          const storedUserId = localStorage.getItem(STORED_USER_KEY);
          
          if (storedUserId) {
            // Try to restore previous anonymous session
            setUserId(storedUserId);
            setConnected(false); // Will use localStorage until we can reconnect
            
            // Attempt to create new session with stored user context
            try {
              const { data, error } = await supabase.auth.signInAnonymously();
              if (!error && data.user) {
                // New session created, migrate data if needed
                const newUserId = data.user.id;
                if (newUserId !== storedUserId) {
                  // Different user ID, but we'll keep using stored data
                  console.log('Session restored with new user ID, keeping existing data');
                }
                setUserId(newUserId);
                setConnected(true);
                localStorage.setItem(STORED_USER_KEY, newUserId);
              }
            } catch (error) {
              console.log('Could not create new session, using localStorage mode');
            }
          } else {
            // No stored user, create new anonymous session
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) {
              console.error('Error signing in anonymously:', error);
              setConnected(false);
              return;
            }
            const newUserId = data.user?.id || '';
            setUserId(newUserId);
            setConnected(true);
            localStorage.setItem(STORED_USER_KEY, newUserId);
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Fallback to localStorage mode with stored user ID
        const storedUserId = localStorage.getItem(STORED_USER_KEY);
        if (storedUserId) {
          setUserId(storedUserId);
        }
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
          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
            }, 200);
          }
        }
      } catch (error) {
        console.error('Database save failed:', error);
        setConnected(false);
      }
    } else {
      // Show localStorage save confirmation
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 200);
      }
    }
  }, [habits, onSuccess, connected, userId]);

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