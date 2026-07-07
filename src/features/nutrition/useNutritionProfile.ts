import { useState, useCallback, useEffect } from 'react';
import type { NutritionProfile } from './types';
import { syncToSupabase, loadFromSupabase } from '../supabaseSync';

const STORAGE_KEY = 'neome-nutrition-profile';
const SUPABASE_KEY = 'nutrition_profile';

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

/**
 * Energy-range adjustments per goal (Strategy memo 2026-04-23).
 *
 * Lose:     [TDEE − 400, TDEE − 100]  → floor enforced AFTER bonus
 * Maintain: [TDEE − 100, TDEE + 100]
 * Gain:     [TDEE + 150, TDEE + 400]
 *
 * Why a range and not a single number:
 *   - On easy days the body burns less, on active days more.
 *   - Sticking to the lower bound on easy days, higher on active days,
 *     keeps the average in deficit/surplus while letting intuition lead.
 *   - "Range, not budget" — Gabi's editorial direction.
 */
const RANGE_ADJUSTMENTS: Record<NutritionProfile['goal'], { low: number; high: number }> = {
  lose:     { low: -400, high: -100 },
  maintain: { low: -100, high:  100 },
  gain:     { low:  150, high:  400 },
};

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
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
  const bfBonus = getBreastfeedingBonus(isBreastfeeding, breastfeedingFrequency);

  // Floor: 1800 kcal for breastfeeding women, 1500 otherwise.
  // Applied AFTER goal adjustment AND breastfeeding bonus to BOTH bounds
  // of the range — even on easy days a breastfeeding mum eats ≥ 1800.
  const minCalories = isBreastfeeding ? MIN_CALORIES_BREASTFEEDING : MIN_CALORIES_DEFAULT;
  const adj = RANGE_ADJUSTMENTS[goal];

  const dailyCaloriesMin = Math.max(minCalories, Math.round(tdee + adj.low + bfBonus));
  const dailyCaloriesMax = Math.max(dailyCaloriesMin + 100, Math.round(tdee + adj.high + bfBonus));
  const dailyCalories = Math.round((dailyCaloriesMin + dailyCaloriesMax) / 2);

  // Macros computed off the midpoint — protein 30%, carbs 40%, fat 30%.
  const dailyProtein = Math.round((dailyCalories * 0.3) / 4);
  const dailyCarbs = Math.round((dailyCalories * 0.4) / 4);
  const dailyFat = Math.round((dailyCalories * 0.3) / 9);

  return {
    tdee,
    dailyCalories,        // midpoint — back-compat for code reading the single value
    dailyCaloriesMin,
    dailyCaloriesMax,
    dailyProtein,
    dailyCarbs,
    dailyFat,
    breastfeedingBonus: bfBonus,
  };
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

  // Hydrate from Supabase: the profile drives the paid €57 meal plan, so
  // it must survive a reinstall / device switch. Remote fills the gap only
  // when nothing exists locally — a fresh local edit always wins.
  useEffect(() => {
    if (profile !== null) return;
    loadFromSupabase<NutritionProfile>(SUPABASE_KEY)
      .then((remote) => {
        if (!remote) return;
        setProfile((current) => {
          if (current) return current;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
          return remote;
        });
      })
      .catch((err) => console.warn('Failed to hydrate nutrition profile:', err));
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    syncToSupabase(SUPABASE_KEY, full);
  }, []);

  const clearProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    syncToSupabase(SUPABASE_KEY, null);
  }, []);

  return { profile, saveProfile, clearProfile };
}
