import { useState, useEffect } from 'react';
import { supabase, UserFavorites } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

// Note: this file previously also exported useUserHabits and
// useUserProgress, both of which queried tables (user_habits,
// user_progress) that never existed in the live DB. Their only
// callers were orphan components that weren't reachable from the
// router. Both hooks and their callers were deleted in the audit-fix
// pass; only useFavorites remains, backed by the user_favorites
// migration 20260518120000_user_favorites.sql.

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
