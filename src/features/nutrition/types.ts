export interface NutritionProfile {
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  mealsPerDay: 3 | 4 | 5;
  allergies: string[];
  dietType: 'standard' | 'vegetarian' | 'vegan';
  weight: number;
  height: number;
  age: number;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
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

export interface MealPlan {
  generatedAt: string;
  profileHash: string;
  days: DayPlan[];
}
