import { useState, useEffect } from 'react';
import { supabase, UserHabits, UserProgress, PeriodTracking, UserFavorites } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

export function useUserHabits() {
  const { user } = useSupabaseAuth();
  const [habits, setHabits] = useState<UserHabits[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHabits = async (date?: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading habits:', error);
        return;
      }

      setHabits(data || []);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHabitProgress = async (habitType: string, increment: number = 1) => {
    if (!user) return false;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Try to update existing habit
      const { data: existingHabit } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('habit_type', habitType)
        .eq('date', today)
        .single();

      if (existingHabit) {
        const newCount = Math.max(0, existingHabit.current_count + increment);
        const { error } = await supabase
          .from('user_habits')
          .update({
            current_count: newCount,
            completed: newCount >= existingHabit.target_count
          })
          .eq('id', existingHabit.id);

        if (error) {
          console.error('Error updating habit:', error);
          return false;
        }
      } else {
        // Create new habit for today
        const habitConfig = getHabitConfig(habitType);
        const { error } = await supabase
          .from('user_habits')
          .insert({
            user_id: user.id,
            habit_type: habitType,
            habit_name: habitConfig.name,
            target_count: habitConfig.target,
            current_count: Math.max(0, increment),
            date: today,
            completed: increment >= habitConfig.target
          });

        if (error) {
          console.error('Error creating habit:', error);
          return false;
        }
      }

      await loadHabits();
      return true;
    } catch (error) {
      console.error('Error updating habit progress:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  return {
    habits,
    loading,
    loadHabits,
    updateHabitProgress,
  };
}

export function useUserProgress() {
  const { user } = useSupabaseAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProgress = async (programId?: string) => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (programId) {
        query = query.eq('program_id', programId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error is ok
        console.error('Error loading progress:', error);
        return;
      }

      setProgress(data || null);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!user) return false;

    try {
      if (progress) {
        const { error } = await supabase
          .from('user_progress')
          .update({
            ...updates,
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('id', progress.id);

        if (error) {
          console.error('Error updating progress:', error);
          return false;
        }
      } else {
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            ...updates,
            last_activity_date: new Date().toISOString().split('T')[0]
          });

        if (error) {
          console.error('Error creating progress:', error);
          return false;
        }
      }

      await loadProgress();
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  return {
    progress,
    loading,
    loadProgress,
    updateProgress,
  };
}

export function useFavorites() {
  const { user } = useSupabaseAuth();
  const [favorites, setFavorites] = useState<UserFavorites[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading favorites:', error);
        return;
      }

      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (itemType: string, itemId: string) => {
    if (!user) return false;

    try {
      const existingFavorite = favorites.find(
        f => f.item_type === itemType && f.item_id === itemId
      );

      if (existingFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('id', existingFavorite.id);

        if (error) {
          console.error('Error removing favorite:', error);
          return false;
        }
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            item_type: itemType,
            item_id: itemId
          });

        if (error) {
          console.error('Error adding favorite:', error);
          return false;
        }
      }

      await loadFavorites();
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  };

  const isFavorite = (itemType: string, itemId: string) => {
    return favorites.some(f => f.item_type === itemType && f.item_id === itemId);
  };

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  return {
    favorites,
    loading,
    loadFavorites,
    toggleFavorite,
    isFavorite,
  };
}

// Helper function for habit configuration
function getHabitConfig(habitType: string) {
  switch (habitType) {
    case 'water':
      return { name: 'Pitný režim', target: 8 }; // 8 glasses
    case 'exercise':
      return { name: 'Cvičenie', target: 1 }; // 1 workout
    case 'meditation':
      return { name: 'Meditácia', target: 1 }; // 1 session
    default:
      return { name: habitType, target: 1 };
  }
}