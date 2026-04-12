import type { NutritionProfile, MealSlot, DayPlan, MealPlan, WeekMeta } from './types';
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
  vecera: ['vecera', 'obed'],
};

// 14-day ring buffer: tracks recent recipe use per slot type
type RecentEntry = { id: string; dayIndex: number };
type RecentUse = Map<MealSlot['type'], RecentEntry[]>;

function ingredientNames(r: Recipe): string[] {
  return (r.ingredients ?? []).map((ing) =>
    typeof ing === 'string' ? ing.toLowerCase() : ing.name.toLowerCase()
  );
}

function filterRecipes(
  allRecipes: Recipe[],
  categories: string[],
  profile: NutritionProfile,
): Recipe[] {
  const disliked = (profile.dislikedIngredients ?? []).map((d) => d.toLowerCase());
  const allergies = (profile.allergies ?? []).map((a) => a.toLowerCase());
  const blocked = [...disliked, ...allergies];

  return allRecipes.filter((r) => {
    if (!categories.includes(r.category)) return false;

    const names = ingredientNames(r);
    const allergenList = ((r as any).allergens as string[] | undefined) ?? [];

    for (const term of blocked) {
      if (allergenList.includes(term)) return false;
      if (names.some((n) => n.includes(term))) return false;
    }

    const dietary = ((r as any).dietary as string[] | undefined) ?? [];
    const tags = (r.tags ?? []).map((t) => t.toLowerCase());
    if (profile.dietType === 'vegan') {
      if (!dietary.includes('vegánske') && !tags.includes('vegan') && !tags.includes('vegánske')) return false;
    }
    if (profile.dietType === 'vegetarian') {
      if (!dietary.includes('vegetariánske') && !dietary.includes('vegánske')
        && !tags.includes('vegetarian') && !tags.includes('vegan')) return false;
    }

    return true;
  });
}

function daysSinceUsed(recentUse: RecentUse, slotType: MealSlot['type'], recipeId: string, currentDay: number): number {
  const entries = recentUse.get(slotType) ?? [];
  const entry = entries.find((e) => e.id === recipeId);
  if (!entry) return Infinity;
  return currentDay - entry.dayIndex;
}

function scoreRecipe(
  recipe: Recipe,
  profile: NutritionProfile,
  recentUse: RecentUse,
  slotType: MealSlot['type'],
  targetCalories: number,
  currentDay: number,
  windowDays: number,
): number {
  let score = Math.random() * 10;

  const daysSince = daysSinceUsed(recentUse, slotType, recipe.id, currentDay);

  if (daysSince === Infinity) {
    score += 20; // never used
  } else if (daysSince >= 14) {
    score += 20; // not in 2-week window
  } else if (daysSince >= 7) {
    score += 10; // used 7–13 days ago — mild prefer
  } else if (daysSince < windowDays) {
    score -= 30; // used recently — heavy penalty
  }

  const liked = (profile.likedIngredients ?? []).map((l) => l.toLowerCase());
  const names = ingredientNames(recipe);
  for (const term of liked) {
    if (names.some((n) => n.includes(term))) {
      score += 15;
      break;
    }
  }

  const slotCategoryMap: Record<MealSlot['type'], string> = {
    ranajky: 'ranajky', desiata: 'snack', obed: 'obed', olovrant: 'snack', vecera: 'vecera',
  };
  if (profile.favouriteMealOfDay && slotCategoryMap[slotType] === profile.favouriteMealOfDay) {
    score += 10;
  }

  const calDiff = Math.abs(recipe.calories - targetCalories);
  const calScore = Math.max(0, 10 - (calDiff / Math.max(targetCalories, 1)) * 10);
  score += calScore;

  return score;
}

function recordUse(recentUse: RecentUse, slotType: MealSlot['type'], recipeId: string, dayIndex: number) {
  if (!recentUse.has(slotType)) recentUse.set(slotType, []);
  const entries = recentUse.get(slotType)!;
  // Remove old entry for this recipe if present, then push updated
  const filtered = entries.filter((e) => e.id !== recipeId);
  filtered.push({ id: recipeId, dayIndex });
  recentUse.set(slotType, filtered);
}

function computePortionMultiplier(recipe: Recipe, targetCalories: number): number {
  const raw = targetCalories / Math.max(recipe.calories, 1);
  return Math.min(Math.max(Math.round(raw * 100) / 100, 0.5), 2.5);
}

function hashProfile(profile: NutritionProfile): string {
  const str = JSON.stringify({
    goal: profile.goal,
    activityLevel: profile.activityLevel,
    mealsPerDay: profile.mealsPerDay,
    allergies: profile.allergies,
    dietType: profile.dietType,
    dislikedIngredients: profile.dislikedIngredients,
    weight: profile.weight,
    height: profile.height,
    age: profile.age,
  });
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash.toString(36);
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function generateMealPlan(profile: NutritionProfile, startDate?: Date): MealPlan {
  const TOTAL_DAYS = 42;
  const distribution = MEAL_DISTRIBUTIONS[profile.mealsPerDay];
  const days: DayPlan[] = [];
  const baseDate = startDate ?? new Date();
  const recentUse: RecentUse = new Map();

  for (let d = 0; d < TOTAL_DAYS; d++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + d);
    const dateStr = formatDate(date);

    const meals: MealSlot[] = distribution.map((slot) => {
      const targetCalories = profile.dailyCalories * slot.pct;
      const categories = CATEGORY_MAP[slot.type];
      const compatible = filterRecipes(recipes, categories, profile);

      let options: [string, string];
      let portionMultiplier = 1;

      if (compatible.length >= 2) {
        // Score with 7-day recency window; if all candidates penalised, relax to 7 days
        const scoreWith = (window: number) =>
          compatible
            .map((r) => ({ r, score: scoreRecipe(r, profile, recentUse, slot.type, targetCalories, d, window) }))
            .sort((a, b) => b.score - a.score);

        let scored = scoreWith(7);
        // If top 2 are both heavily penalised (score < 0), relax window
        if (scored[0].score < 0 && scored[1].score < 0) {
          scored = scoreWith(3);
        }

        const pick0 = scored[0].r;
        const pick1 = scored[1].r;

        // Calorie accuracy: if option0 deviates >5%, try option1
        const mult0 = computePortionMultiplier(pick0, targetCalories);
        const deviation0 = Math.abs(pick0.calories * mult0 - targetCalories) / Math.max(targetCalories, 1);

        if (deviation0 > 0.05) {
          const mult1 = computePortionMultiplier(pick1, targetCalories);
          const deviation1 = Math.abs(pick1.calories * mult1 - targetCalories) / Math.max(targetCalories, 1);
          if (deviation1 < deviation0) {
            options = [pick1.id, pick0.id];
            portionMultiplier = mult1;
          } else {
            options = [pick0.id, pick1.id];
            portionMultiplier = mult0;
          }
        } else {
          options = [pick0.id, pick1.id];
          portionMultiplier = mult0;
        }

        recordUse(recentUse, slot.type, options[0], d);
      } else if (compatible.length === 1) {
        options = [compatible[0].id, compatible[0].id];
        portionMultiplier = computePortionMultiplier(compatible[0], targetCalories);
        recordUse(recentUse, slot.type, compatible[0].id, d);
      } else {
        options = ['', ''];
      }

      return {
        type: slot.type,
        label: slot.label,
        options,
        selected: 0 as const,
        portionMultiplier,
      };
    });

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

  // Build WeekMeta (6 weeks × 7 days)
  const weeks: WeekMeta[] = Array.from({ length: 6 }, (_, wi) => {
    const start = wi * 7;
    const dayIndices = [0, 1, 2, 3, 4, 5, 6].map((i) => start + i) as [number, number, number, number, number, number, number];
    return {
      weekNumber: wi + 1,
      startDate: days[start].date,
      endDate: days[start + 6].date,
      dayIndices,
    };
  });

  const endDate = days[TOTAL_DAYS - 1].date;

  const plan: MealPlan = {
    generatedAt: new Date().toISOString(),
    profileHash: hashProfile(profile),
    profile,
    days,
    weeks,
    totalDays: 42,
    endDate,
  };

  localStorage.setItem('neome-meal-plan', JSON.stringify(plan));
  return plan;
}
