import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface SupabaseIngredient {
  raw: string;
  name: string;
  grams: number;
}

export interface SupabaseRecipe {
  id: string;
  name: string;
  slot: 'ranajky' | 'hlavne' | 'snack';
  prep_minutes: number | null;
  instructions: string | null;
  ingredients: SupabaseIngredient[];
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fiber: number | null;
  coverage_pct: number | null;
  usage_count: number;
  active: boolean;
}

export const SLOT_LABEL: Record<SupabaseRecipe['slot'], string> = {
  ranajky: 'Raňajky',
  hlavne: 'Hlavné jedlá',
  snack: 'Snacky',
};

// First FREE_PER_SLOT recipes per slot (sorted by name) are accessible on free tier.
export const FREE_PER_SLOT = 10;

const CACHE_KEY = 'neome_recipes_v2';
// Recipe fixes must reach users promptly — iOS standalone PWAs keep a
// session alive for days, so an unversioned sessionStorage entry served
// stale data indefinitely. Entries older than this refetch.
const CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 h
let memoryCache: SupabaseRecipe[] | null = null;
let freeIdCache: Set<string> | null = null;

function buildFreeIds(recipes: SupabaseRecipe[]): Set<string> {
  const bySlot: Record<string, SupabaseRecipe[]> = {};
  for (const r of recipes) {
    if (!bySlot[r.slot]) bySlot[r.slot] = [];
    bySlot[r.slot].push(r);
  }
  const ids = new Set<string>();
  for (const slot of Object.keys(bySlot)) {
    // recipes already sorted by name from Supabase query
    bySlot[slot].slice(0, FREE_PER_SLOT).forEach((r) => ids.add(r.id));
  }
  return ids;
}

let loadPromise: Promise<SupabaseRecipe[]> | null = null;

/**
 * Load the recipe library outside React (meal-plan generation, PDF export).
 * Shares the module cache with useRecipes: memory → sessionStorage → Supabase,
 * deduping concurrent fetches.
 */
export function loadRecipes(): Promise<SupabaseRecipe[]> {
  if (memoryCache !== null) return Promise.resolve(memoryCache);
  if (loadPromise) return loadPromise;

  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { at, list } = JSON.parse(cached) as { at: number; list: SupabaseRecipe[] };
      if (Array.isArray(list) && Date.now() - at < CACHE_MAX_AGE_MS) {
        memoryCache = list;
        freeIdCache = buildFreeIds(list);
        return Promise.resolve(list);
      }
    } catch {}
  }

  loadPromise = supabase
    .from('recipes')
    .select('*')
    .eq('active', true)
    .order('name')
    .then(({ data, error }) => {
      loadPromise = null;
      if (error) throw new Error(error.message);
      const list = (data ?? []) as SupabaseRecipe[];
      memoryCache = list;
      freeIdCache = buildFreeIds(list);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), list }));
      return list;
    });
  return loadPromise;
}

/**
 * The one shared "recept dňa": same recipe on the home card and in the
 * Strava section, rotating at LOCAL midnight, different every day and
 * across year boundaries.
 */
export function dailyRecipeOf(recipes: SupabaseRecipe[]): SupabaseRecipe | null {
  if (recipes.length === 0) return null;
  const now = new Date();
  const doy = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  return recipes[(now.getFullYear() * 366 + doy) % recipes.length];
}

/** Slot-based cover image (full path) for recipes without own photos. */
export function recipeImage(r: Pick<SupabaseRecipe, 'slot'> | null | undefined): string {
  if (r?.slot === 'hlavne') return '/images/r9/section-nutrition.jpg';
  return '/images/r9/testimonial-recipe.jpg';
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>(memoryCache ?? []);
  const [freeIds, setFreeIds] = useState<Set<string>>(freeIdCache ?? new Set());
  const [loading, setLoading] = useState(memoryCache === null);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (memoryCache !== null || fetched.current) return;
    fetched.current = true;

    loadRecipes()
      .then((list) => {
        setRecipes(list);
        setFreeIds(freeIdCache ?? new Set());
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { recipes, freeIds, loading, error };
}

export function useRecipe(id: string | undefined) {
  const { recipes, freeIds, loading } = useRecipes();
  const recipe = id ? recipes.find((r) => r.id === id) ?? null : null;
  const isFree = id ? freeIds.has(id) : false;
  return { recipe, isFree, loading };
}
