// Spoonacular API Integration Service
const API_BASE = 'https://api.spoonacular.com';
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

// Types for Spoonacular API responses
export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  extendedIngredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  dishTypes: string[];
  diets: string[];
  cuisines: string[];
}

export interface RecipeSearchParams {
  query?: string;
  diet?: string; // vegetarian, vegan, gluten-free, dairy-free, etc.
  cuisine?: string; // european, mediterranean, etc.
  type?: string; // breakfast, lunch, dinner, snack
  maxReadyTime?: number;
  minProtein?: number;
  maxCalories?: number;
  number?: number; // results to return
  offset?: number; // for pagination
}

export interface MealPlanParams {
  timeFrame: 'day' | 'week';
  targetCalories?: number;
  diet?: string;
  exclude?: string;
}

export interface MealPlan {
  meals: Array<{
    id: number;
    title: string;
    readyInMinutes: number;
    servings: number;
    sourceUrl: string;
  }>;
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
}

class SpoonacularService {
  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${API_BASE}${endpoint}`);
    
    // Add API key and parameters
    url.searchParams.append('apiKey', API_KEY);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Search for recipes
  async searchRecipes(params: RecipeSearchParams = {}) {
    const defaultParams = {
      number: 12,
      addRecipeNutrition: true,
      addRecipeInstructions: true,
      fillIngredients: true,
      sort: 'popularity'
    };

    const response = await this.request<{
      results: SpoonacularRecipe[];
      totalResults: number;
      offset: number;
      number: number;
    }>('/recipes/complexSearch', { ...defaultParams, ...params });

    return response;
  }

  // Get detailed recipe information
  async getRecipeDetails(id: number) {
    return this.request<SpoonacularRecipe>(`/recipes/${id}/information`, {
      includeNutrition: true
    });
  }

  // Generate meal plan
  async generateMealPlan(params: MealPlanParams) {
    const response = await this.request<MealPlan>('/mealplanner/generate', params);
    return response;
  }

  // Get random recipes (for discovery)
  async getRandomRecipes(params: { number?: number; tags?: string } = {}) {
    const defaultParams = {
      number: 6,
      include: 'nutrition'
    };

    return this.request<{
      recipes: SpoonacularRecipe[];
    }>('/recipes/random', { ...defaultParams, ...params });
  }

  // Convert measurements
  async convertAmount(ingredientName: string, sourceAmount: number, sourceUnit: string, targetUnit: string) {
    return this.request<{
      sourceAmount: number;
      sourceUnit: string;
      targetAmount: number;
      targetUnit: string;
      answer: string;
    }>('/recipes/convert', {
      ingredientName,
      sourceAmount,
      sourceUnit,
      targetUnit
    });
  }

  // Get shopping list for recipes
  async generateShoppingList(recipeIds: number[]) {
    // This requires authentication with Spoonacular user account
    // For now, we'll create a simple version that aggregates ingredients
    const ingredients = new Map();
    
    for (const id of recipeIds) {
      const recipe = await this.getRecipeDetails(id);
      recipe.extendedIngredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        if (ingredients.has(key)) {
          const existing = ingredients.get(key);
          ingredients.set(key, {
            ...existing,
            amount: existing.amount + ingredient.amount,
            original: `${existing.original}, ${ingredient.original}`
          });
        } else {
          ingredients.set(key, ingredient);
        }
      });
    }

    return Array.from(ingredients.values());
  }
}

export const spoonacularService = new SpoonacularService();