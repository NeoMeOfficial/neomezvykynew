import { useState, useEffect } from 'react';

interface FavoriteRecipe {
  id: number;
  title: string;
  image: string;
  time: string;
  kcal: number;
  category: string;
  addedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('neome-favorite-recipes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('neome-favorite-recipes', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (recipe: Omit<FavoriteRecipe, 'addedAt'>) => {
    const favoriteRecipe: FavoriteRecipe = {
      ...recipe,
      addedAt: new Date().toISOString(),
    };
    
    setFavorites(prev => {
      // Check if already exists
      const exists = prev.find(f => f.id === recipe.id);
      if (exists) return prev;
      
      return [favoriteRecipe, ...prev];
    });
  };

  const removeFromFavorites = (recipeId: number) => {
    setFavorites(prev => prev.filter(f => f.id !== recipeId));
  };

  const toggleFavorite = (recipe: Omit<FavoriteRecipe, 'addedAt'>) => {
    const isFavorite = favorites.some(f => f.id === recipe.id);
    if (isFavorite) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
  };

  const isFavorite = (recipeId: number): boolean => {
    return favorites.some(f => f.id === recipeId);
  };

  const getFavoritesByCategory = (category?: string) => {
    if (!category) return favorites;
    return favorites.filter(f => f.category === category);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByCategory,
    favoritesCount: favorites.length,
  };
}