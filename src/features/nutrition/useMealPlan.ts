import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { NutritionProfile, MealPlan, DayPlan } from './types';
import { generateMealPlan, computeDayTotals, PLAN_VERSION } from './mealPlanGenerator';
import { useRecipes, loadRecipes } from '@/hooks/useRecipes';
import type { SupabaseRecipe } from '@/hooks/useRecipes';
import { syncToSupabase, loadFromSupabase } from '../supabaseSync';

const STORAGE_KEY = 'neome-meal-plan';
const SUPABASE_KEY = 'meal_plan';

function isValidPlan(p: MealPlan | null | undefined): p is MealPlan {
  // planVersion guard: v1 plans reference the retired static recipe IDs —
  // their uuids don't resolve against Supabase, so they must regenerate.
  return !!p && p.planVersion === PLAN_VERSION && p.totalDays === 42
    && !!p.weeks && p.weeks.length === 6;
}

function loadPlan(): MealPlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MealPlan;
    if (!isValidPlan(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function savePlan(plan: MealPlan): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

function recalculateDayTotals(day: DayPlan, recipes: SupabaseRecipe[]): DayPlan {
  return { ...day, ...computeDayTotals(day.meals, recipes) };
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
  const { recipes } = useRecipes();
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

  /**
   * Generate a fresh plan. Async: waits for the recipe library if it isn't
   * loaded yet (first visit, cold cache). Callers that navigate afterwards
   * should await this so the destination page finds the plan in storage.
   */
  const generatePlan = useCallback(async (profile: NutritionProfile, startDate?: Date) => {
    const list = recipes.length > 0 ? recipes : await loadRecipes();
    const newPlan = generateMealPlan(profile, list, startDate);
    setPlan(newPlan);
    savePlan(newPlan);
    queueSync(newPlan);
    const todayIdx = getTodayDayIndex(newPlan);
    setActiveDay(todayIdx);
    setActiveWeek(getWeekForDay(todayIdx));
    return newPlan;
  }, [recipes, queueSync]);

  /**
   * Replace the currently-selected option of a specific meal slot with a
   * different recipe. Used by RecipeDetail's "Pridať do jedálnička" flow:
   * user picks a day + slot, we drop the chosen recipe into that slot.
   * The other option (recipe at meal.options[1 - meal.selected]) is kept
   * so the user can still swap back, matching the existing two-option UX.
   */
  const setRecipeForSlot = useCallback(
    (dayIndex: number, mealIndex: number, recipeId: string) => {
      setPlan((prev) => {
        if (!prev) return prev;
        const newPlan = { ...prev, days: [...prev.days] };
        const day = { ...newPlan.days[dayIndex], meals: [...newPlan.days[dayIndex].meals] };
        const meal = { ...day.meals[mealIndex], options: [...day.meals[mealIndex].options] as [string, string] };

        // Insert into the currently-selected slot, leave the alt option intact.
        meal.options[meal.selected] = recipeId;

        // Reset portion multiplier — caller can re-tune later via swapMeal logic.
        meal.portionMultiplier = 1;

        day.meals[mealIndex] = meal;
        newPlan.days[dayIndex] = recalculateDayTotals(day, recipes);
        savePlan(newPlan);
        queueSync(newPlan);
        return newPlan;
      });
    },
    [recipes, queueSync],
  );

  const swapMeal = useCallback((dayIndex: number, mealIndex: number) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const newPlan = { ...prev, days: [...prev.days] };
      const day = { ...newPlan.days[dayIndex], meals: [...newPlan.days[dayIndex].meals] };
      const meal = { ...day.meals[mealIndex] };
      meal.selected = meal.selected === 0 ? 1 : 0;

      // Recalculate portion multiplier for newly selected recipe
      const recipe = recipes.find((r) => r.id === meal.options[meal.selected]);
      if (recipe) {
        const oldRecipe = recipes.find((r) => r.id === meal.options[meal.selected === 0 ? 1 : 0]);
        if (oldRecipe) {
          const targetCal = meal.portionMultiplier * (oldRecipe.kcal ?? 0);
          meal.portionMultiplier = Math.round((targetCal / Math.max(recipe.kcal ?? 1, 1)) * 100) / 100;
        }
      }

      day.meals[mealIndex] = meal;
      newPlan.days[dayIndex] = recalculateDayTotals(day, recipes);
      savePlan(newPlan);
      queueSync(newPlan);
      return newPlan;
    });
  }, [recipes, queueSync]);

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
    setRecipeForSlot,
    todayPlan,
    activeDay,
    activeWeek,
    setActiveDay,
    setActiveWeek: handleWeekChange,
  };
}
