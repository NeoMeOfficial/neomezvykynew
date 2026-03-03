import { useState, useCallback, useMemo } from 'react';
import type { NutritionProfile, MealPlan, DayPlan } from './types';
import { generateMealPlan } from './mealPlanGenerator';
import { recipes } from '../../data/recipes';

const STORAGE_KEY = 'neome-meal-plan';

function loadPlan(): MealPlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MealPlan) : null;
  } catch {
    return null;
  }
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

export function useMealPlan() {
  const [plan, setPlan] = useState<MealPlan | null>(loadPlan);

  const generatePlan = useCallback((profile: NutritionProfile, startDate?: Date) => {
    const newPlan = generateMealPlan(profile, startDate);
    setPlan(newPlan);
  }, []);

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
        // Keep same target calories (use the original portionMultiplier * old recipe calories)
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
      return newPlan;
    });
  }, []);

  const todayPlan = useMemo<DayPlan | null>(() => {
    if (!plan) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    return plan.days.find((d) => d.date === todayStr) ?? null;
  }, [plan]);

  return { plan, generatePlan, swapMeal, todayPlan };
}
