import type { NutritionProfile, MealSlot, DayPlan, MealPlan, WeekMeta } from './types';
import type { SupabaseRecipe } from '@/hooks/useRecipes';

/**
 * Meal-plan generator — builds a 6-week (42-day) plan from the Supabase
 * recipe library (public.recipes, 225 curated recipes in 3 slots).
 *
 * v2: recipes are passed in by the caller (async-loaded via loadRecipes());
 * plan recipe IDs are Supabase uuids. Obed + večera draw from the shared
 * 'hlavne' pool, so their recency tracking is pooled too — Tuesday's lunch
 * won't reappear as Wednesday's dinner.
 */

export const PLAN_VERSION = 2;

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

// meal slot → recipe pool in the 3-slot library
const POOL_MAP: Record<MealSlot['type'], SupabaseRecipe['slot']> = {
  ranajky: 'ranajky',
  desiata: 'snack',
  obed: 'hlavne',
  olovrant: 'snack',
  vecera: 'hlavne',
};

/**
 * Mains lighter than this can't stand alone as obed/večera — filters out
 * per-bowl soups (60–190 kcal/tanier) that need pairing with a main.
 */
const MIN_MAIN_KCAL = 250;

/* ── diet heuristics ──────────────────────────────────────────────────────
 * Interim ingredient-keyword matching until import-time diet/allergen tags
 * land (Phase 4 step 2). Matching is against lowercase ingredient names.
 * Semi-vegetarian intentionally gets no exclusions (flexitarian — Gabi to
 * confirm whether it should drop red meat).
 */
const MEAT_FISH = [
  'kurac', 'morčac', 'morcac', 'hovädz', 'hovadz', 'bravč', 'bravc',
  'šunka', 'sunka', 'salám', 'salam', 'slanin', 'losos', 'tuniak',
  'pstruh', 'sumec', 'sumček', 'sumcek', 'sardink', 'krevet', 'sliepka',
  'mäso', 'maso', 'stehno', 'sviečkov', 'svieckov', 'panensk', 'ryba', 'hydin',
];
const EGG = ['vajce', 'vajec', 'vajíčk', 'vajick', 'bielok', 'bielk', 'žĺtok', 'zltok'];
const DAIRY = [
  'mlieko', 'jogurt', 'tvaroh', 'syr', 'smotana', 'maslo', 'bryndza',
  'mozzarella', 'parmezán', 'parmezan', 'cottage', 'acidko', 'cmar',
  'kefír', 'kefir', 'niva', 'lučina', 'lucina', 'halloumi', 'feta', 'eidam', 'skyr',
];
// plant variants that neutralise a DAIRY keyword hit ("sójové mlieko", "arašidové maslo")
const PLANT_PREFIX = [
  'sójov', 'sojov', 'mandľov', 'mandlov', 'kokosov', 'arašidov', 'arasidov',
  'kešu', 'kesu', 'ovsen', 'ryžov', 'ryzov', 'sezamov', 'rastlinn', 'tofu',
  'vegánsk', 'vegansk',
];

function ingredientNames(r: SupabaseRecipe): string[] {
  return (r.ingredients ?? []).map((ing) => (ing.name || ing.raw || '').toLowerCase());
}

function isPlantVariant(name: string): boolean {
  return PLANT_PREFIX.some((p) => name.includes(p));
}

function containsAny(names: string[], terms: string[], skipPlantVariants = false): boolean {
  return names.some((n) => {
    if (skipPlantVariants && isPlantVariant(n)) return false;
    return terms.some((t) => n.includes(t));
  });
}

function matchesDiet(names: string[], diet: NutritionProfile['dietType']): boolean {
  if (diet === 'vegan') {
    if (containsAny(names, MEAT_FISH)) return false;
    if (containsAny(names, EGG)) return false;
    if (containsAny(names, DAIRY, true)) return false;
    return true;
  }
  if (diet === 'vegetarian') {
    return !containsAny(names, MEAT_FISH);
  }
  return true;
}

/* ── filtering & scoring ────────────────────────────────────────────────── */

function filterRecipes(
  allRecipes: SupabaseRecipe[],
  slotType: MealSlot['type'],
  profile: NutritionProfile,
): SupabaseRecipe[] {
  const pool = POOL_MAP[slotType];
  const disliked = (profile.dislikedIngredients ?? []).map((d) => d.toLowerCase());
  const allergies = (profile.allergies ?? []).map((a) => a.toLowerCase());
  const blocked = [...disliked, ...allergies];
  const isMain = slotType === 'obed' || slotType === 'vecera';

  return allRecipes.filter((r) => {
    if (r.slot !== pool) return false;
    if (!r.kcal || r.kcal <= 0) return false;
    if (isMain && r.kcal < MIN_MAIN_KCAL) return false;

    const names = ingredientNames(r);
    for (const term of blocked) {
      if (names.some((n) => n.includes(term))) return false;
    }
    return matchesDiet(names, profile.dietType);
  });
}

// 14-day ring buffer: recent recipe use, keyed by POOL so obed+večera share
type RecentEntry = { id: string; dayIndex: number };
type RecentUse = Map<SupabaseRecipe['slot'], RecentEntry[]>;

function daysSinceUsed(recentUse: RecentUse, pool: SupabaseRecipe['slot'], recipeId: string, currentDay: number): number {
  const entry = (recentUse.get(pool) ?? []).find((e) => e.id === recipeId);
  return entry ? currentDay - entry.dayIndex : Infinity;
}

function recordUse(recentUse: RecentUse, pool: SupabaseRecipe['slot'], recipeId: string, dayIndex: number) {
  const entries = (recentUse.get(pool) ?? []).filter((e) => e.id !== recipeId);
  entries.push({ id: recipeId, dayIndex });
  recentUse.set(pool, entries);
}

const SLOT_TO_FAV: Record<MealSlot['type'], NutritionProfile['favouriteMealOfDay']> = {
  ranajky: 'ranajky', desiata: 'snack', obed: 'obed', olovrant: 'snack', vecera: 'vecera',
};

function scoreRecipe(
  recipe: SupabaseRecipe,
  profile: NutritionProfile,
  recentUse: RecentUse,
  slotType: MealSlot['type'],
  targetCalories: number,
  currentDay: number,
  windowDays: number,
): number {
  let score = Math.random() * 10;

  const daysSince = daysSinceUsed(recentUse, POOL_MAP[slotType], recipe.id, currentDay);
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

  if (profile.favouriteMealOfDay && SLOT_TO_FAV[slotType] === profile.favouriteMealOfDay) {
    score += 10;
  }

  const kcal = recipe.kcal ?? 0;
  const calDiff = Math.abs(kcal - targetCalories);
  score += Math.max(0, 10 - (calDiff / Math.max(targetCalories, 1)) * 10);

  return score;
}

function computePortionMultiplier(recipe: SupabaseRecipe, targetCalories: number): number {
  const raw = targetCalories / Math.max(recipe.kcal ?? 1, 1);
  return Math.min(Math.max(Math.round(raw * 100) / 100, 0.5), 2.5);
}

/* ── day totals ─────────────────────────────────────────────────────────── */

export function computeDayTotals(
  meals: MealSlot[],
  allRecipes: SupabaseRecipe[],
): Pick<DayPlan, 'totalCalories' | 'totalProtein' | 'totalCarbs' | 'totalFat' | 'totalFiber'> {
  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0;
  for (const meal of meals) {
    const recipe = allRecipes.find((r) => r.id === meal.options[meal.selected]);
    if (recipe) {
      totalCalories += Math.round((recipe.kcal ?? 0) * meal.portionMultiplier);
      totalProtein += Math.round((recipe.protein ?? 0) * meal.portionMultiplier);
      totalCarbs += Math.round((recipe.carbs ?? 0) * meal.portionMultiplier);
      totalFat += Math.round((recipe.fat ?? 0) * meal.portionMultiplier);
      totalFiber += Math.round((recipe.fiber ?? 0) * meal.portionMultiplier);
    }
  }
  return { totalCalories, totalProtein, totalCarbs, totalFat, totalFiber };
}

/* ── plan generation ────────────────────────────────────────────────────── */

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
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function generateMealPlan(
  profile: NutritionProfile,
  allRecipes: SupabaseRecipe[],
  startDate?: Date,
): MealPlan {
  const TOTAL_DAYS = 42;
  const distribution = MEAL_DISTRIBUTIONS[profile.mealsPerDay];
  const days: DayPlan[] = [];
  const baseDate = startDate ?? new Date();
  const recentUse: RecentUse = new Map();

  // Pre-filter each slot's candidate pool once — profile doesn't change mid-plan.
  const poolCache = new Map<MealSlot['type'], SupabaseRecipe[]>();
  for (const slot of distribution) {
    poolCache.set(slot.type, filterRecipes(allRecipes, slot.type, profile));
  }

  for (let d = 0; d < TOTAL_DAYS; d++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + d);

    const meals: MealSlot[] = distribution.map((slot) => {
      const targetCalories = profile.dailyCalories * slot.pct;
      const compatible = poolCache.get(slot.type)!;

      let options: [string, string];
      let portionMultiplier = 1;

      if (compatible.length >= 2) {
        const scoreWith = (window: number) =>
          compatible
            .map((r) => ({ r, score: scoreRecipe(r, profile, recentUse, slot.type, targetCalories, d, window) }))
            .sort((a, b) => b.score - a.score);

        let scored = scoreWith(7);
        if (scored[0].score < 0 && scored[1].score < 0) {
          scored = scoreWith(3);
        }

        const pick0 = scored[0].r;
        const pick1 = scored[1].r;

        // Calorie accuracy: if option0 deviates >5% even after portioning, try option1
        const mult0 = computePortionMultiplier(pick0, targetCalories);
        const deviation0 = Math.abs((pick0.kcal ?? 0) * mult0 - targetCalories) / Math.max(targetCalories, 1);

        if (deviation0 > 0.05) {
          const mult1 = computePortionMultiplier(pick1, targetCalories);
          const deviation1 = Math.abs((pick1.kcal ?? 0) * mult1 - targetCalories) / Math.max(targetCalories, 1);
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

        recordUse(recentUse, POOL_MAP[slot.type], options[0], d);
      } else if (compatible.length === 1) {
        options = [compatible[0].id, compatible[0].id];
        portionMultiplier = computePortionMultiplier(compatible[0], targetCalories);
        recordUse(recentUse, POOL_MAP[slot.type], compatible[0].id, d);
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

    days.push({ date: formatDate(date), meals, ...computeDayTotals(meals, allRecipes) });
  }

  const weeks: WeekMeta[] = Array.from({ length: 6 }, (_, wi) => {
    const start = wi * 7;
    const dayIndices = [0, 1, 2, 3, 4, 5, 6].map((i) => start + i) as WeekMeta['dayIndices'];
    return {
      weekNumber: wi + 1,
      startDate: days[start].date,
      endDate: days[start + 6].date,
      dayIndices,
    };
  });

  return {
    planVersion: PLAN_VERSION,
    generatedAt: new Date().toISOString(),
    profileHash: hashProfile(profile),
    profile,
    days,
    weeks,
    totalDays: 42,
    endDate: days[TOTAL_DAYS - 1].date,
  };
}
