import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveProgram } from './useDailyRituals';
import { useMealPlan } from '../features/nutrition/useMealPlan';
import { recipes } from '../data/recipes';
import type { DayPlan, MealSlot } from '../features/nutrition/types';

/**
 * useDayPlan(date) — what's prescribed for a specific calendar date.
 *
 * Resolves two independent sources:
 *   • Exercise — given the user's active program and its start_date,
 *     compute (week, day) for the target date and fetch the matching
 *     program_exercises row.
 *   • Meals — look up plan.days by ISO date (meal plans are flat
 *     calendar arrays with one entry per generated day).
 *
 * Returns nulls + flags so the UI can render empty states per pillar
 * without coupling them.
 */

export interface DayExercise {
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  week: number;
  day: number;
}

export interface DayMealResolved {
  slot: MealSlot['type'];
  label: string;
  recipeId: string;
  recipeName: string;
  recipeImage: string | null;
  recipeCategory: string | null;
}

export interface DayPlanResult {
  exercise: DayExercise | null;
  exerciseLoading: boolean;
  meals: DayMealResolved[];
  mealDay: DayPlan | null;
  hasActiveProgram: boolean;
  withinProgramRange: boolean;
  hasMealPlan: boolean;
}

function isoOf(d: Date): string {
  // Use local time, not UTC, to match the calendar day the user sees.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetween(a: Date, b: Date): number {
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((bMid - aMid) / 86_400_000);
}

export function useDayPlan(date: Date): DayPlanResult {
  const { program } = useActiveProgram();
  const { plan } = useMealPlan();
  const [exercise, setExercise] = useState<DayExercise | null>(null);
  const [exerciseLoading, setExerciseLoading] = useState(false);

  const hasActiveProgram = !!program;
  const targetIso = isoOf(date);

  // Map date → (week, day) within the active program.
  let week = 0;
  let day = 0;
  let withinProgramRange = false;
  if (program) {
    const startDate = new Date(program.start_date + 'T00:00:00');
    const offset = daysBetween(startDate, date);
    if (offset >= 0) {
      week = Math.floor(offset / 7) + 1;
      day = (offset % 7) + 1;
      // We don't know totalWeeks here without fetching the program row.
      // Defer to the fetch: if program_exercises returns null we treat
      // the date as out-of-range.
      withinProgramRange = true;
    }
  }

  useEffect(() => {
    let cancelled = false;
    if (!program || !withinProgramRange) {
      setExercise(null);
      return;
    }
    setExerciseLoading(true);
    (async () => {
      const { data } = await supabase
        .from('program_exercises')
        .select('title, description, video_url, thumbnail_url, duration_seconds, week, day')
        .eq('program_id', program.program_id)
        .eq('week', week)
        .eq('day', day)
        .order('sort_order', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      setExercise((data as DayExercise | null) ?? null);
      setExerciseLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [program?.program_id, week, day, program, withinProgramRange]);

  // Meal lookup — plan.days is the flat array of generated dates.
  const mealDay = plan?.days.find((d) => d.date === targetIso) ?? null;
  const hasMealPlan = !!plan;

  const meals: DayMealResolved[] = (mealDay?.meals ?? []).map((m) => {
    const recipeId = m.options[m.selected];
    const recipe = recipes.find((r) => r.id === recipeId);
    return {
      slot: m.type,
      label: m.label,
      recipeId,
      recipeName: recipe?.name ?? '—',
      recipeImage: recipe?.image ?? null,
      recipeCategory: recipe?.category ?? null,
    };
  });

  return {
    exercise,
    exerciseLoading,
    meals,
    mealDay,
    hasActiveProgram,
    withinProgramRange: withinProgramRange && (exercise !== null || exerciseLoading),
    hasMealPlan,
  };
}
