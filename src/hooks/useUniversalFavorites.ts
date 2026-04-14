import { useState, useEffect } from 'react';
import { useFavorites } from './useUserData';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

export type ContentType = 'recipe' | 'workout' | 'meditation' | 'article' | 'program';

interface FavoriteItem {
  id: string | number;
  type: ContentType;
  title: string;
  image?: string;
  duration?: string;
  kcal?: number;
  category?: string;
  program?: string;
  addedAt: string;
  metadata?: any; // For additional type-specific data
}

const ANON_KEY = 'neome-favorites-local';

function loadAnonFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(ANON_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAnonFavorites(items: FavoriteItem[]) {
  localStorage.setItem(ANON_KEY, JSON.stringify(items));
}

export function useUniversalFavorites() {
  const { user } = useSupabaseAuth();
  const { toggleFavorite: toggleSupabaseFavorite, isFavorite: isSupabaseFavorite, loading } = useFavorites();
  const [localFavorites, setLocalFavorites] = useState<FavoriteItem[]>([]);

  // Load metadata from localStorage
  useEffect(() => {
    if (user?.id) {
      const storageKey = `neome_favorites_metadata_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try { setLocalFavorites(JSON.parse(stored)); } catch { setLocalFavorites([]); }
      }
    } else {
      setLocalFavorites(loadAnonFavorites());
    }
  }, [user?.id]);

  // Save metadata to localStorage for rich display (authenticated)
  const saveMetadataToLocal = (item: FavoriteItem) => {
    if (!user?.id) return;
    setLocalFavorites(prev => {
      const existing = prev.find(f => f.id === item.id && f.type === item.type);
      if (existing) return prev;
      const updated = [item, ...prev];
      localStorage.setItem(`neome_favorites_metadata_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const removeMetadataFromLocal = (itemId: string | number, type: ContentType) => {
    if (!user?.id) return;
    setLocalFavorites(prev => {
      const updated = prev.filter(f => !(f.id === itemId && f.type === type));
      localStorage.setItem(`neome_favorites_metadata_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Anonymous (no auth) toggle — pure localStorage
  const toggleAnonFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    setLocalFavorites(prev => {
      const exists = prev.some(f => f.id === item.id && f.type === item.type);
      const updated = exists
        ? prev.filter(f => !(f.id === item.id && f.type === item.type))
        : [{ ...item, addedAt: new Date().toISOString() }, ...prev];
      saveAnonFavorites(updated);
      return updated;
    });
  };

  const addToFavorites = async (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (!user?.id || loading) return;
    const favoriteItem: FavoriteItem = { ...item, addedAt: new Date().toISOString() };
    const success = await toggleSupabaseFavorite(item.type as any, String(item.id));
    if (success) saveMetadataToLocal(favoriteItem);
  };

  const removeFromFavorites = async (itemId: string | number, type: ContentType) => {
    if (!user?.id || loading) return;
    const success = await toggleSupabaseFavorite(type as any, String(itemId));
    if (success) removeMetadataFromLocal(itemId, type);
  };

  const toggleFavorite = async (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (!user?.id) {
      toggleAnonFavorite(item);
      return;
    }
    const isFav = isFavorite(item.id, item.type);
    if (isFav) {
      await removeFromFavorites(item.id, item.type);
    } else {
      await addToFavorites(item);
    }
  };

  const isFavorite = (itemId: string | number, type: ContentType): boolean => {
    if (user?.id) {
      if (isSupabaseFavorite(type as any, String(itemId))) return true;
    }
    return localFavorites.some(f => f.id === itemId && f.type === type);
  };

  const getFavoritesByType = (type: ContentType) => {
    return localFavorites.filter(f => f.type === type && isFavorite(f.id, f.type));
  };

  const getFavoritesByCategory = (category: string, type?: ContentType) => {
    let filtered = localFavorites.filter(f => isFavorite(f.id, f.type));
    if (type) {
      filtered = filtered.filter(f => f.type === type);
    }
    return filtered.filter(f => f.category === category);
  };

  const getAllFavorites = () => localFavorites.filter(f => isFavorite(f.id, f.type));

  const getFavoriteCounts = () => {
    const activeFavorites = getAllFavorites();
    const counts = {
      total: activeFavorites.length,
      recipe: 0,
      workout: 0,
      meditation: 0,
      article: 0,
      program: 0,
    };
    
    activeFavorites.forEach(fav => {
      counts[fav.type]++;
    });
    
    return counts;
  };

  return {
    favorites: getAllFavorites(),
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    getFavoritesByCategory,
    getFavoriteCounts,
    isLoading: loading,
  };
}