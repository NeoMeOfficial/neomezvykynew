export interface NutritionProfile {
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  mealsPerDay: 3 | 4 | 5;
  selectedMeals: string[];   // e.g. ['ranajky','obed','vecera']
  allergies: string[];
  dietType: 'standard' | 'vegetarian' | 'semi-vegetarian' | 'vegan';
  weight: number;
  height: number;
  age: number;
  birthDate?: string;        // ISO date string YYYY-MM-DD
  // Body measurements (optional)
  waistCm?: number;
  breastCm?: number;
  hipCm?: number;
  // Activity detail (optional, for future use)
  regularDay?: 'sedentary_work' | 'on_feet' | 'with_kids';
  dailyStepsRange?: '<5000' | '5000-10000' | '>10000';
  sports?: string[];
  sportsFrequency?: number;
  // Health context
  /**
   * Life phase — three-way radio asked early in onboarding.
   *   'regular'    → standard cycle (menštruácia, ovulácia, luteálna fáza)
   *   'postpartum' → after birth (asks breastfeeding frequency follow-up)
   *   'pregnant'   → currently pregnant (gynaecologist disclaimer)
   * Derives `isPregnant` (= 'pregnant') for backwards compat with code
   * that still reads the legacy boolean. Breastfeeding stays a separate
   * sub-question because postpartum users may or may not breastfeed.
   */
  lifePhase?: 'regular' | 'postpartum' | 'pregnant';
  isBreastfeeding?: boolean;
  breastfeedingFrequency?: number;
  isPregnant?: boolean;
  /**
   * Daily calorie midpoint — kept for backwards compat with all existing
   * meal-planner / progress-ring code that consumed the old single number.
   * The new editorial UI shows the range (dailyCaloriesMin–Max) instead.
   */
  dailyCalories: number;
  dailyCaloriesMin: number;  // lower bound of the energy range
  dailyCaloriesMax: number;  // upper bound of the energy range
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyFiber: number;
  proteinPerKg: number;      // e.g. 1.8 or 2.2
  // Preference fields
  likedIngredients: string[];
  dislikedIngredients: string[];
  favouriteMealOfDay: 'ranajky' | 'obed' | 'vecera' | 'snack';
}

export interface MealSlot {
  type: 'ranajky' | 'desiata' | 'obed' | 'olovrant' | 'vecera';
  label: string;
  options: [string, string]; // recipe IDs
  selected: 0 | 1;
  portionMultiplier: number;
}

export interface DayPlan {
  date: string;
  meals: MealSlot[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

export interface WeekMeta {
  weekNumber: number;  // 1–6
  startDate: string;   // YYYY-MM-DD (Monday)
  endDate: string;     // YYYY-MM-DD (Sunday)
  dayIndices: [number, number, number, number, number, number, number];
}

export interface MealPlan {
  /**
   * Plan schema version. v2 = recipe IDs reference Supabase public.recipes
   * (uuid) instead of the retired static src/data/recipes.ts. Plans without
   * this field (or with an older version) are invalidated on load.
   */
  planVersion: number;
  generatedAt: string;
  profileHash: string;
  profile: NutritionProfile;
  days: DayPlan[];     // 42 items for a 6-week plan
  weeks: WeekMeta[];   // exactly 6
  totalDays: 42;
  endDate: string;     // YYYY-MM-DD
}
