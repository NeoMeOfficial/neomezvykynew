import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';

interface Habit {
  id: string;
  name: string;
  durationDays: number;
  unit: string;
  targetPerDay: number;
  startDate: string; // ISO date string
  completions: Record<string, number>; // date -> count completed
}

interface DatabaseHabit {
  id: string;
  name: string;
  duration_days: number;
  unit: string;
  target_per_day: number;
  start_date: string;
  active: boolean;
}

interface HabitCompletion {
  completion_date: string;
  count: number;
}

export function useSupabaseHabits() {
  const { user } = useAuthContext();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [user]);

  const fetchHabits = async () => {
    if (!user) return;

    try {
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: true });

      if (habitsError) throw habitsError;

      if (habitsData && habitsData.length > 0) {
        // Fetch completions for all habits
        const habitIds = habitsData.map(h => h.id);
        const { data: completionsData, error: completionsError } = await supabase
          .from('habit_completions')
          .select('habit_id, completion_date, count')
          .in('habit_id', habitIds);

        if (completionsError) throw completionsError;

        // Transform data to match frontend format
        const transformedHabits: Habit[] = habitsData.map((dbHabit: DatabaseHabit) => {
          // Get completions for this habit
          const habitCompletions = completionsData?.filter(c => c.habit_id === dbHabit.id) || [];
          const completionsMap: Record<string, number> = {};
          
          habitCompletions.forEach((comp: HabitCompletion) => {
            completionsMap[comp.completion_date] = comp.count;
          });

          return {
            id: dbHabit.id,
            name: dbHabit.name,
            durationDays: dbHabit.duration_days,
            unit: dbHabit.unit,
            targetPerDay: dbHabit.target_per_day,
            startDate: dbHabit.start_date,
            completions: completionsMap,
          };
        });

        setHabits(transformedHabits);
      } else {
        setHabits([]);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (data: { 
    name: string; 
    durationDays: number; 
    unit: string; 
    targetPerDay: number; 
  }): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('habits')
        .insert([{
          user_id: user.id,
          name: data.name,
          duration_days: data.durationDays,
          unit: data.unit,
          target_per_day: data.targetPerDay,
          start_date: new Date().toISOString().split('T')[0], // today
        }]);

      if (error) throw error;

      await fetchHabits(); // Refresh
      return true;
    } catch (error) {
      console.error('Error adding habit:', error);
      return false;
    }
  };

  const editHabit = async (
    id: string, 
    data: { name: string; durationDays: number; unit: string; targetPerDay: number; }
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('habits')
        .update({
          name: data.name,
          duration_days: data.durationDays,
          unit: data.unit,
          target_per_day: data.targetPerDay,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchHabits(); // Refresh
      return true;
    } catch (error) {
      console.error('Error editing habit:', error);
      return false;
    }
  };

  const toggleHabitCompletion = async (habitId: string): Promise<boolean> => {
    if (!user) return false;

    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return false;

    try {
      const currentCount = habit.completions[today] || 0;
      const isSimpleCheckbox = habit.targetPerDay === 1 || 
        ['minúty', 'minút', 'min', 'hodín', 'hodiny'].some(u => 
          habit.unit.toLowerCase().includes(u)
        );

      let newCount: number;
      if (isSimpleCheckbox) {
        // Toggle: complete or uncomplete
        newCount = currentCount >= habit.targetPerDay ? 0 : habit.targetPerDay;
      } else {
        // Increment, wrap to 0 after reaching target
        newCount = currentCount >= habit.targetPerDay ? 0 : currentCount + 1;
      }

      // Upsert the completion
      const { error } = await supabase
        .from('habit_completions')
        .upsert({
          habit_id: habitId,
          user_id: user.id,
          completion_date: today,
          count: newCount,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'habit_id,completion_date'
        });

      if (error) throw error;

      // Update local state immediately for responsiveness
      setHabits(prev => 
        prev.map(h => 
          h.id === habitId 
            ? { ...h, completions: { ...h.completions, [today]: newCount } }
            : h
        )
      );

      return true;
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      return false;
    }
  };

  const removeHabit = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Mark as inactive instead of deleting (for data preservation)
      const { error } = await supabase
        .from('habits')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchHabits(); // Refresh
      return true;
    } catch (error) {
      console.error('Error removing habit:', error);
      return false;
    }
  };

  return {
    habits,
    loading,
    addHabit,
    editHabit,
    toggleHabitCompletion,
    removeHabit,
    refreshHabits: fetchHabits,
  };
}