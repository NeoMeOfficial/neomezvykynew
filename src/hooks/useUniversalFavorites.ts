import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

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

export function useUniversalFavorites() {
  const { user } = useAuthContext();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's favorites from localStorage on mount
  useEffect(() => {
    if (!user?.id) return;
    
    const storageKey = `neome_favorites_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
        setFavorites([]);
      }
    }
  }, [user?.id]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (!user?.id) return;
    
    const storageKey = `neome_favorites_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites, user?.id]);

  const addToFavorites = async (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (!user?.id || isLoading) return;
    
    setIsLoading(true);
    
    const favoriteItem: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };
    
    setFavorites(prev => {
      // Check if already exists
      const exists = prev.find(f => f.id === item.id && f.type === item.type);
      if (exists) return prev;
      
      return [favoriteItem, ...prev];
    });
    
    setIsLoading(false);
  };

  const removeFromFavorites = async (itemId: string | number, type: ContentType) => {
    if (!user?.id || isLoading) return;
    
    setIsLoading(true);
    setFavorites(prev => prev.filter(f => !(f.id === itemId && f.type === type)));
    setIsLoading(false);
  };

  const toggleFavorite = async (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (!user?.id) return;
    
    const isFav = isFavorite(item.id, item.type);
    if (isFav) {
      await removeFromFavorites(item.id, item.type);
    } else {
      await addToFavorites(item);
    }
  };

  const isFavorite = (itemId: string | number, type: ContentType): boolean => {
    return favorites.some(f => f.id === itemId && f.type === type);
  };

  const getFavoritesByType = (type: ContentType) => {
    return favorites.filter(f => f.type === type);
  };

  const getFavoritesByCategory = (category: string, type?: ContentType) => {
    let filtered = favorites;
    if (type) {
      filtered = filtered.filter(f => f.type === type);
    }
    return filtered.filter(f => f.category === category);
  };

  const getAllFavorites = () => favorites;

  const getFavoriteCounts = () => {
    const counts = {
      total: favorites.length,
      recipe: 0,
      workout: 0,
      meditation: 0,
      article: 0,
      program: 0,
    };
    
    favorites.forEach(fav => {
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
    isLoading,
  };
}