export interface NutritionProfile {
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  mealsPerDay: 3 | 4 | 5;
  allergies: string[];
  dietType: 'standard' | 'vegetarian' | 'vegan';
  weight: number;
  height: number;
  age: number;
  // Body measurements (optional)
  waistCm?: number;
  breastCm?: number;
  hipCm?: number;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyFiber: number;
  proteinPerKg: number;  // e.g. 1.8 or 2.2
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
}

export interface WeekMeta {
  weekNumber: number;  // 1–6
  startDate: string;   // YYYY-MM-DD (Monday)
  endDate: string;     // YYYY-MM-DD (Sunday)
  dayIndices: [number, number, number, number, number, number, number];
}

export interface MealPlan {
  generatedAt: string;
  profileHash: string;
  profile: NutritionProfile;
  days: DayPlan[];     // 42 items for a 6-week plan
  weeks: WeekMeta[];   // exactly 6
  totalDays: 42;
  endDate: string;     // YYYY-MM-DD
}
