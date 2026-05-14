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

const CACHE_KEY = 'neome_recipes_v1';
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

export function useRecipes() {
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>(memoryCache ?? []);
  const [freeIds, setFreeIds] = useState<Set<string>>(freeIdCache ?? new Set());
  const [loading, setLoading] = useState(memoryCache === null);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (memoryCache !== null || fetched.current) return;
    fetched.current = true;

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as SupabaseRecipe[];
        const ids = buildFreeIds(parsed);
        memoryCache = parsed;
        freeIdCache = ids;
        setRecipes(parsed);
        setFreeIds(ids);
        setLoading(false);
        return;
      } catch {}
    }

    supabase
      .from('recipes')
      .select('*')
      .eq('active', true)
      .order('name')
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else {
          const list = (data ?? []) as SupabaseRecipe[];
          const ids = buildFreeIds(list);
          memoryCache = list;
          freeIdCache = ids;
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
          setRecipes(list);
          setFreeIds(ids);
        }
        setLoading(false);
      });
  }, []);

  return { recipes, freeIds, loading, error };
}

export function useRecipe(id: string | undefined) {
  const { recipes, freeIds, loading } = useRecipes();
  const recipe = id ? recipes.find((r) => r.id === id) ?? null : null;
  const isFree = id ? freeIds.has(id) : false;
  return { recipe, isFree, loading };
}
