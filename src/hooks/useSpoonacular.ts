import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { spoonacularService, RecipeSearchParams, MealPlanParams } from '../services/spoonacular';

// Query keys for caching
export const SPOONACULAR_KEYS = {
  recipes: ['spoonacular', 'recipes'] as const,
  search: (params: RecipeSearchParams) => ['spoonacular', 'recipes', 'search', params] as const,
  recipe: (id: number) => ['spoonacular', 'recipes', id] as const,
  random: (tags?: string) => ['spoonacular', 'recipes', 'random', tags] as const,
  mealPlan: (params: MealPlanParams) => ['spoonacular', 'mealplan', params] as const,
};

// Hook to search recipes
export function useRecipeSearch(params: RecipeSearchParams = {}, enabled: boolean = true) {
  return useQuery({
    queryKey: SPOONACULAR_KEYS.search(params),
    queryFn: () => spoonacularService.searchRecipes(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get recipe details
export function useRecipeDetails(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: SPOONACULAR_KEYS.recipe(id),
    queryFn: () => spoonacularService.getRecipeDetails(id),
    enabled: enabled && id > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes (recipes don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook to get random recipes
export function useRandomRecipes(tags?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: SPOONACULAR_KEYS.random(tags),
    queryFn: () => spoonacularService.getRandomRecipes({ tags }),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook to generate meal plan
export function useMealPlan(params: MealPlanParams, enabled: boolean = false) {
  return useQuery({
    queryKey: SPOONACULAR_KEYS.mealPlan(params),
    queryFn: () => spoonacularService.generateMealPlan(params),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Mutation for generating meal plans (for user-triggered actions)
export function useGenerateMealPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: MealPlanParams) => spoonacularService.generateMealPlan(params),
    onSuccess: (data, variables) => {
      // Cache the result
      queryClient.setQueryData(SPOONACULAR_KEYS.mealPlan(variables), data);
    },
  });
}

// Mutation for converting measurements
export function useConvertAmount() {
  return useMutation({
    mutationFn: ({ ingredientName, sourceAmount, sourceUnit, targetUnit }: {
      ingredientName: string;
      sourceAmount: number;
      sourceUnit: string;
      targetUnit: string;
    }) => spoonacularService.convertAmount(ingredientName, sourceAmount, sourceUnit, targetUnit),
  });
}

// Custom hook for shopping list generation
export function useShoppingList() {
  return useMutation({
    mutationFn: (recipeIds: number[]) => spoonacularService.generateShoppingList(recipeIds),
  });
}