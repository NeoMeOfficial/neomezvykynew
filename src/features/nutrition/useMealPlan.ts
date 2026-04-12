import { useState, useCallback, useMemo } from 'react';
import type { NutritionProfile, MealPlan, DayPlan } from './types';
import { generateMealPlan } from './mealPlanGenerator';
import { recipes } from '../../data/recipes';

const STORAGE_KEY = 'neome-meal-plan';

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

  const generatePlan = useCallback((profile: NutritionProfile, startDate?: Date) => {
    const newPlan = generateMealPlan(profile, startDate);
    setPlan(newPlan);
    const todayIdx = getTodayDayIndex(newPlan);
    setActiveDay(todayIdx);
    setActiveWeek(getWeekForDay(todayIdx));
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
