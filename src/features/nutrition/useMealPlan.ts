import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { NutritionProfile, MealPlan, DayPlan } from './types';
import { generateMealPlan } from './mealPlanGenerator';
import { recipes } from '../../data/recipes';
import { syncToSupabase, loadFromSupabase } from '../supabaseSync';

const STORAGE_KEY = 'neome-meal-plan';
const SUPABASE_KEY = 'meal_plan';

function loadPlan(): MealPlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MealPlan;
    // Version guard: old 7-day plans lack totalDays or weeks — clear them
    if (parsed.totalDays !== 42 || !parsed.weeks || parsed.weeks.length !== 6) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function isValidPlan(p: MealPlan | null | undefined): p is MealPlan {
  return !!p && p.totalDays === 42 && !!p.weeks && p.weeks.length === 6;
}

function savePlan(plan: MealPlan): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

function recalculateDayTotals(day: DayPlan): DayPlan {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  for (const meal of day.meals) {
    const recipeId = meal.options[meal.selected];
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      totalCalories += Math.round(recipe.calories * meal.portionMultiplier);
      totalProtein += Math.round((recipe.protein ?? 0) * meal.portionMultiplier);
      totalCarbs += Math.round((recipe.carbs ?? 0) * meal.portionMultiplier);
      totalFat += Math.round((recipe.fat ?? 0) * meal.portionMultiplier);
    }
  }

  return { ...day, totalCalories, totalProtein, totalCarbs, totalFat };
}

function getTodayDayIndex(plan: MealPlan): number {
  const todayStr = new Date().toISOString().split('T')[0];
  const idx = plan.days.findIndex((d) => d.date === todayStr);
  return idx >= 0 ? idx : 0;
}

function getWeekForDay(dayIndex: number): number {
  return Math.floor(dayIndex / 7);
}

export function useMealPlan() {
  const initialPlan = loadPlan();
  const initialDayIndex = initialPlan ? getTodayDayIndex(initialPlan) : 0;
  const initialWeek = getWeekForDay(initialDayIndex);

  const [plan, setPlan] = useState<MealPlan | null>(initialPlan);
  const [activeDay, setActiveDay] = useState<number>(initialDayIndex);
  const [activeWeek, setActiveWeek] = useState<number>(initialWeek);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Hydrate from Supabase in the background. If the remote plan is valid and
  // either we have no local plan OR the local plan was generated for an older
  // start date, accept the remote one. Fire-and-forget — silent no-op in demo.
  useEffect(() => {
    loadFromSupabase<MealPlan>(SUPABASE_KEY)
      .then((remote) => {
        if (!isValidPlan(remote)) return;
        setPlan((current) => {
          if (!current) return remote;
          // Prefer remote if it starts on or after the current plan (i.e. newer).
          const remoteStart = new Date(remote.days[0]?.date ?? 0).getTime();
          const currentStart = new Date(current.days[0]?.date ?? 0).getTime();
          if (remoteStart >= currentStart) {
            savePlan(remote);
            const todayIdx = getTodayDayIndex(remote);
            setActiveDay(todayIdx);
            setActiveWeek(getWeekForDay(todayIdx));
            return remote;
          }
          return current;
        });
      })
      .catch((err) => console.warn('Failed to hydrate meal plan from Supabase:', err));
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced Supabase sync. Called whenever the local plan changes.
  const queueSync = useCallback((p: MealPlan) => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncToSupabase(SUPABASE_KEY, p);
    }, 500);
  }, []);

  const generatePlan = useCallback((profile: NutritionProfile, startDate?: Date) => {
    const newPlan = generateMealPlan(profile, startDate);
    setPlan(newPlan);
    savePlan(newPlan);
    queueSync(newPlan);
    const todayIdx = getTodayDayIndex(newPlan);
    setActiveDay(todayIdx);
    setActiveWeek(getWeekForDay(todayIdx));
  }, [queueSync]);

  const swapMeal = useCallback((dayIndex: number, mealIndex: number) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const newPlan = { ...prev, days: [...prev.days] };
      const day = { ...newPlan.days[dayIndex], meals: [...newPlan.days[dayIndex].meals] };
      const meal = { ...day.meals[mealIndex] };
      meal.selected = meal.selected === 0 ? 1 : 0;

      // Recalculate portion multiplier for newly selected recipe
      const recipeId = meal.options[meal.selected];
      const recipe = recipes.find((r) => r.id === recipeId);
      if (recipe) {
        const oldRecipeId = meal.options[meal.selected === 0 ? 1 : 0];
        const oldRecipe = recipes.find((r) => r.id === oldRecipeId);
        if (oldRecipe) {
          const targetCal = meal.portionMultiplier * oldRecipe.calories;
          meal.portionMultiplier = Math.round((targetCal / recipe.calories) * 100) / 100;
        }
      }

      day.meals[mealIndex] = meal;
      newPlan.days[dayIndex] = recalculateDayTotals(day);
      savePlan(newPlan);
      queueSync(newPlan);
      return newPlan;
    });
  }, [queueSync]);

  const handleWeekChange = useCallback((weekIndex: number) => {
    setActiveWeek(weekIndex);
    // Move active day to Monday of selected week if current day is not in that week
    const weekStart = weekIndex * 7;
    const weekEnd = weekStart + 6;
    if (activeDay < weekStart || activeDay > weekEnd) {
      setActiveDay(weekStart);
    }
  }, [activeDay]);

  const todayPlan = useMemo<DayPlan | null>(() => {
    if (!plan) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    return plan.days.find((d) => d.date === todayStr) ?? null;
  }, [plan]);

  return {
    plan,
    generatePlan,
    swapMeal,
    todayPlan,
    activeDay,
    activeWeek,
    setActiveDay,
    setActiveWeek: handleWeekChange,
  };
}
