import { useState, useCallback } from 'react';
import type { NutritionProfile } from './types';

const STORAGE_KEY = 'neome-nutrition-profile';

const ACTIVITY_MULTIPLIERS: Record<NutritionProfile['activityLevel'], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const GOAL_ADJUSTMENTS: Record<NutritionProfile['goal'], number> = {
  lose: -300,
  maintain: 0,
  gain: 250,
};

export function calculateDailyTargets(
  weight: number,
  height: number,
  age: number,
  activityLevel: NutritionProfile['activityLevel'],
  goal: NutritionProfile['goal'],
) {
  // Mifflin-St Jeor (female)
  const bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const dailyCalories = Math.round(tdee + GOAL_ADJUSTMENTS[goal]);

  // Macros: protein 30%, carbs 40%, fat 30%
  const dailyProtein = Math.round((dailyCalories * 0.3) / 4); // 4 kcal/g
  const dailyCarbs = Math.round((dailyCalories * 0.4) / 4);   // 4 kcal/g
  const dailyFat = Math.round((dailyCalories * 0.3) / 9);     // 9 kcal/g

  return { dailyCalories, dailyProtein, dailyCarbs, dailyFat };
}

function loadProfile(): NutritionProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NutritionProfile) : null;
  } catch {
    return null;
  }
}

export function useNutritionProfile() {
  const [profile, setProfile] = useState<NutritionProfile | null>(loadProfile);

  const saveProfile = useCallback((p: NutritionProfile) => {
    const targets = calculateDailyTargets(p.weight, p.height, p.age, p.activityLevel, p.goal);
    const full: NutritionProfile = { ...p, ...targets };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    setProfile(full);
  }, []);

  const clearProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }, []);

  return { profile, saveProfile, clearProfile };
}
