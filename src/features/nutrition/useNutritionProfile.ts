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

const MIN_CALORIES_DEFAULT = 1500;
const MIN_CALORIES_BREASTFEEDING = 1800;

/**
 * Breastfeeding calorie bonus based on feedings per 24h.
 * Confirmed by Gabi on 2026-04-20.
 *   8+   → +500 kcal  (full/exclusive)
 *   5–7  → +400 kcal  (mostly breastfeeding)
 *   3–4  → +300 kcal  (partial)
 *   1–2  → +250 kcal  (minimal)
 * If isBreastfeeding=true but no frequency given → +300 kcal (safe default).
 */
export function getBreastfeedingBonus(
  isBreastfeeding?: boolean,
  frequency?: number,
): number {
  if (!isBreastfeeding) return 0;
  if (frequency == null || frequency <= 0) return 300;
  if (frequency >= 8) return 500;
  if (frequency >= 5) return 400;
  if (frequency >= 3) return 300;
  return 250;
}

export function calculateDailyTargets(
  weight: number,
  height: number,
  age: number,
  activityLevel: NutritionProfile['activityLevel'],
  goal: NutritionProfile['goal'],
  isBreastfeeding?: boolean,
  breastfeedingFrequency?: number,
) {
  // Mifflin-St Jeor (female)
  const bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const bfBonus = getBreastfeedingBonus(isBreastfeeding, breastfeedingFrequency);

  // Floor: 1800 kcal for breastfeeding women, 1500 otherwise.
  // Floor is applied AFTER goal adjustment AND breastfeeding bonus.
  const minCalories = isBreastfeeding ? MIN_CALORIES_BREASTFEEDING : MIN_CALORIES_DEFAULT;

  const rawCalories = tdee + GOAL_ADJUSTMENTS[goal] + bfBonus;
  const dailyCalories = Math.max(minCalories, Math.round(rawCalories));

  // Macros: protein 30%, carbs 40%, fat 30%
  const dailyProtein = Math.round((dailyCalories * 0.3) / 4);
  const dailyCarbs = Math.round((dailyCalories * 0.4) / 4);
  const dailyFat = Math.round((dailyCalories * 0.3) / 9);

  return { dailyCalories, dailyProtein, dailyCarbs, dailyFat, breastfeedingBonus: bfBonus };
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
    const targets = calculateDailyTargets(
      p.weight,
      p.height,
      p.age,
      p.activityLevel,
      p.goal,
      p.isBreastfeeding,
      p.breastfeedingFrequency,
    );
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
