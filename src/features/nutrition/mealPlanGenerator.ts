import type { NutritionProfile, MealSlot, DayPlan, MealPlan } from './types';
import { recipes } from '../../data/recipes';
import type { Recipe } from '../../data/recipes';

type SlotConfig = { type: MealSlot['type']; label: string; pct: number };

const MEAL_DISTRIBUTIONS: Record<3 | 4 | 5, SlotConfig[]> = {
  3: [
    { type: 'ranajky', label: 'Raňajky', pct: 0.3 },
    { type: 'obed', label: 'Obed', pct: 0.4 },
    { type: 'vecera', label: 'Večera', pct: 0.3 },
  ],
  4: [
    { type: 'ranajky', label: 'Raňajky', pct: 0.25 },
    { type: 'desiata', label: 'Desiata', pct: 0.1 },
    { type: 'obed', label: 'Obed', pct: 0.35 },
    { type: 'vecera', label: 'Večera', pct: 0.3 },
  ],
  5: [
    { type: 'ranajky', label: 'Raňajky', pct: 0.2 },
    { type: 'desiata', label: 'Desiata', pct: 0.1 },
    { type: 'obed', label: 'Obed', pct: 0.3 },
    { type: 'olovrant', label: 'Olovrant', pct: 0.1 },
    { type: 'vecera', label: 'Večera', pct: 0.3 },
  ],
};

const CATEGORY_MAP: Record<MealSlot['type'], string[]> = {
  ranajky: ['ranajky'],
  desiata: ['snack'],
  obed: ['obed'],
  olovrant: ['snack', 'smoothie'],
  vecera: ['vecera'],
};

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function filterRecipes(
  allRecipes: Recipe[],
  categories: string[],
  allergies: string[],
  dietType: NutritionProfile['dietType'],
): Recipe[] {
  return allRecipes.filter((r) => {
    // Match category
    if (!categories.includes(r.category)) return false;

    // Filter by allergens — use the allergens array if available, fallback to ingredient scanning
    if (allergies.length > 0) {
      const recipeAllergens = (r as any).allergens as string[] | undefined;
      if (recipeAllergens && recipeAllergens.length > 0) {
        // Direct allergen matching
        for (const a of allergies) {
          if (recipeAllergens.includes(a.toLowerCase())) return false;
        }
      } else {
        // Fallback: scan ingredients
        const ingredientStr = (r.ingredients ?? []).map((ing) => typeof ing === 'string' ? ing : ing.name).join(' ').toLowerCase();
        for (const a of allergies) {
          if (ingredientStr.includes(a.toLowerCase())) return false;
        }
      }
    }

    // Filter diet type — use dietary array if available, fallback to tags
    const dietary = ((r as any).dietary as string[] | undefined) ?? [];
    const tags = (r.tags ?? []).map((t) => t.toLowerCase());
    if (dietType === 'vegan') {
      if (!dietary.includes('vegánske') && !tags.includes('vegan') && !tags.includes('vegánske')) return false;
    }
    if (dietType === 'vegetarian') {
      if (!dietary.includes('vegetariánske') && !dietary.includes('vegánske')
        && !tags.includes('vegetarian') && !tags.includes('vegan')) return false;
    }
    return true;
  });
}

function hashProfile(profile: NutritionProfile): string {
  const str = JSON.stringify({
    goal: profile.goal,
    activityLevel: profile.activityLevel,
    mealsPerDay: profile.mealsPerDay,
    allergies: profile.allergies,
    dietType: profile.dietType,
    weight: profile.weight,
    height: profile.height,
    age: profile.age,
  });
  // Simple hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash.toString(36);
}

export function generateMealPlan(profile: NutritionProfile): MealPlan {
  const distribution = MEAL_DISTRIBUTIONS[profile.mealsPerDay];
  const days: DayPlan[] = [];
  const today = new Date();

  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    const meals: MealSlot[] = distribution.map((slot) => {
      const targetCalories = profile.dailyCalories * slot.pct;
      const categories = CATEGORY_MAP[slot.type];
      const compatible = filterRecipes(recipes, categories, profile.allergies, profile.dietType);

      let options: [string, string];
      if (compatible.length >= 2) {
        const picked = pickRandom(compatible, 2);
        options = [picked[0].id, picked[1].id];
      } else if (compatible.length === 1) {
        options = [compatible[0].id, compatible[0].id];
      } else {
        options = ['', ''];
      }

      // Calculate portion multiplier for the selected (default 0) recipe
      const selectedRecipe = compatible.find((r) => r.id === options[0]);
      const portionMultiplier = selectedRecipe
        ? Math.round((targetCalories / selectedRecipe.calories) * 100) / 100
        : 1;

      return {
        type: slot.type,
        label: slot.label,
        options,
        selected: 0 as const,
        portionMultiplier,
      };
    });

    // Calculate day totals from selected recipes
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const meal of meals) {
      const recipeId = meal.options[meal.selected];
      const recipe = recipes.find((r) => r.id === recipeId);
      if (recipe) {
        totalCalories += Math.round(recipe.calories * meal.portionMultiplier);
        totalProtein += Math.round((recipe.protein ?? 0) * meal.portionMultiplier);
        totalCarbs += Math.round((recipe.carbs ?? 0) * meal.portionMultiplier);
        totalFat += Math.round((recipe.fat ?? 0) * meal.portionMultiplier);
      }
    }

    days.push({ date: dateStr, meals, totalCalories, totalProtein, totalCarbs, totalFat });
  }

  const plan: MealPlan = {
    generatedAt: new Date().toISOString(),
    profileHash: hashProfile(profile),
    days,
  };

  localStorage.setItem('neome-meal-plan', JSON.stringify(plan));
  return plan;
}
