import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface SupabaseIngredient {
  raw: string;
  name: string;
  grams: number | null;
  /** Section label inside the list ("OMÁČKA", "NA PLACKY") — not a food. */
  header?: boolean;
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
  /** Browsing categories (2026-08-28 library) — a recipe may sit in several. */
  categories?: string[] | null;
  /** Ingredient amounts are for this many portions; kcal is per portion. */
  servings?: number | null;
  vegetarian?: boolean | null;
  image_url?: string | null;
  /** Phase-alignment tags (heuristic; no UI copy claims phase fit). */
  temperature?: 'warm' | 'cold' | null;
  is_iron_rich?: boolean | null;
  is_magnesium_rich?: boolean | null;
  is_complex_carbs?: boolean | null;
  is_high_protein?: boolean | null;
}

// Six browsing categories (Gabi 2026-08-28). `slot` stays the 3-valued
// meal-planner slot; these drive the Strava section and the browser.
export type RecipeCategory = 'ranajky' | 'hlavne' | 'salaty' | 'natierky' | 'snacky' | 'napoje';
export const CATEGORY_KEYS: RecipeCategory[] = ['ranajky', 'hlavne', 'salaty', 'natierky', 'snacky', 'napoje'];
export const CATEGORY_LABEL: Record<RecipeCategory, string> = {
  ranajky: 'Raňajky',
  hlavne: 'Hlavné jedlá a polievky',
  salaty: 'Šaláty',
  natierky: 'Nátierky',
  snacky: 'Snacky a dezerty',
  napoje: 'Nápoje a smoothie',
};
const SLOT_TO_CATEGORY: Record<SupabaseRecipe['slot'], RecipeCategory> = { ranajky: 'ranajky', hlavne: 'hlavne', snack: 'snacky' };

/** Categories of a recipe — falls back to its planner slot for rows
 *  imported before the categories column existed. */
export function recipeCategories(r: Pick<SupabaseRecipe, 'slot' | 'categories'>): RecipeCategory[] {
  const cats = (r.categories ?? []).filter((c): c is RecipeCategory => (CATEGORY_KEYS as string[]).includes(c));
  return cats.length > 0 ? cats : [SLOT_TO_CATEGORY[r.slot]];
}

export function recipeCategoryLabel(r: Pick<SupabaseRecipe, 'slot' | 'categories'>): string {
  return recipeCategories(r).map((c) => CATEGORY_LABEL[c]).join(' · ');
}

export function servingsLabel(n: number | null | undefined): string | null {
  if (!n || n < 1) return null;
  return `Recept na ${n} ${n === 1 ? 'porciu' : n <= 4 ? 'porcie' : 'porcií'}`;
}

// One shared stock cover everywhere until real photos land (Gabi 2026-09-02:
// no mixed placeholders — every category and recipe uses the same photo).
const STOCK_IMG = '/images/r9/testimonial-recipe.jpg';
export function categoryImage(_c: RecipeCategory): string {
  return STOCK_IMG;
}

export const SLOT_LABEL: Record<SupabaseRecipe['slot'], string> = {
  ranajky: 'Raňajky',
  hlavne: 'Hlavné jedlá',
  snack: 'Snacky',
};

// First FREE_PER_SLOT recipes per slot (sorted by name) are accessible on free tier.
export const FREE_PER_SLOT = 10;

const CACHE_KEY = 'neome_recipes_v4';
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

// What each cycle phase loosely prefers (Gabi 2026-07-12 plan): the pick
// quietly leans this way, the UI never claims "vhodné pre tvoju fázu".
type PhaseFlag = 'is_iron_rich' | 'is_magnesium_rich' | 'is_complex_carbs' | 'is_high_protein';
const PHASE_RECIPE_PREFS: Record<string, { temp?: 'warm' | 'cold'; flags: PhaseFlag[] }> = {
  menstrual:  { temp: 'warm', flags: ['is_iron_rich'] },
  follicular: { flags: ['is_high_protein'] },
  ovulation:  { temp: 'cold', flags: ['is_high_protein'] },
  luteal:     { flags: ['is_magnesium_rich', 'is_complex_carbs'] },
};

// Featured-recipe history: every id already featured this lap, so the
// "recept dňa" cycles through the whole library before anything repeats
// (phase preference decides the order within the lap). Per device; once
// all recipes have been featured the lap restarts.
const DAILY_HISTORY_KEY = 'neome_daily_recipe_history_v1';
const NO_REPEAT_DAYS = 6; // hard floor at a lap restart: today + previous 6 stay excluded

type DailyHistoryEntry = { d: string; id: string; p: string | null };

function localDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function readDailyHistory(): DailyHistoryEntry[] {
  try {
    const raw = localStorage.getItem(DAILY_HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeDailyHistory(list: DailyHistoryEntry[]) {
  try { localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(list)); } catch { /* private mode */ }
}

/**
 * The one shared "recept dňa": same recipe on the home card and in the
 * Strava section, rotating at LOCAL midnight. With a known cycle phase
 * it prefers the recipes that best match the phase (candidates ordered
 * best-match first); without one (cycle off) it rotates over the whole
 * library. Every recipe already featured this lap is skipped, so all
 * recipes get their turn before any repeats; at a lap restart the last
 * NO_REPEAT_DAYS days stay excluded so a week never shows a recipe twice.
 * Today's pick is stored and stays stable for the day unless the phase
 * changes.
 */
export function dailyRecipeOf(recipes: SupabaseRecipe[], phaseKey?: string | null): SupabaseRecipe | null {
  if (recipes.length === 0) return null;
  const now = new Date();
  const today = localDayKey(now);
  const phase = phaseKey ?? null;

  const history = readDailyHistory();
  const stored = history.find((h) => h.d === today);
  if (stored && stored.p === phase) {
    const r = recipes.find((x) => x.id === stored.id);
    if (r) return r;
  }

  const doy = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = now.getFullYear() * 366 + doy;

  // Candidates ordered by phase match (best score first); within each score
  // tier the start index rotates daily. No phase → the whole library, rotated.
  const prefs = phase ? PHASE_RECIPE_PREFS[phase] : undefined;
  let ordered: SupabaseRecipe[];
  if (!prefs) {
    const start = seed % recipes.length;
    ordered = [...recipes.slice(start), ...recipes.slice(0, start)];
  } else {
    const score = (r: SupabaseRecipe) => {
      let s = 0;
      if (prefs.temp && r.temperature === prefs.temp) s += 1;
      for (const f of prefs.flags) if (r[f]) s += 1;
      return s;
    };
    const byTier = new Map<number, SupabaseRecipe[]>();
    for (const r of recipes) {
      const s = score(r);
      const tier = byTier.get(s);
      if (tier) tier.push(r); else byTier.set(s, [r]);
    }
    ordered = [];
    for (const s of [...byTier.keys()].sort((a, b) => b - a)) {
      const tier = byTier.get(s)!;
      const start = seed % tier.length;
      ordered.push(...tier.slice(start), ...tier.slice(0, start));
    }
  }

  // Temperature is a HARD rule (Gabi 2026-09-02): a phase that calls for warm
  // food never features a cold recipe, and vice versa. Nutrient flags stay
  // soft — missing iron is not a contradiction, a salad during menstruation is.
  const allowed = prefs?.temp
    ? ordered.filter((r) => r.temperature === prefs.temp)
    : ordered;
  const candidates = allowed.length > 0 ? allowed : ordered;

  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - NO_REPEAT_DAYS);
  const cutoffKey = localDayKey(cutoff);

  // Skip everything already featured this lap (today's stale entry included).
  const past = history.filter((h) => h.d !== today);
  const lapIds = new Set(past.map((h) => h.id));
  let pick = candidates.find((r) => !lapIds.has(r.id));
  let kept = past;
  if (!pick) {
    // No unfeatured recipe satisfies the temperature rule. Prefer repeating
    // the temperature-correct recipe featured longest ago (outside the week
    // window) over contradicting the phase; the lap keeps running so the
    // remaining recipes still surface in unconstrained phases.
    const lastShown = new Map<string, string>();
    for (const h of past) lastShown.set(h.id, h.d);
    const repeatable = candidates
      .filter((r) => (lastShown.get(r.id) ?? '') < cutoffKey)
      .sort((a, b) => (lastShown.get(a.id) ?? '').localeCompare(lastShown.get(b.id) ?? ''));
    pick = repeatable[0];
  }
  if (!pick) {
    // Lap complete — every recipe has been featured. Restart, but keep the
    // last NO_REPEAT_DAYS days excluded so the week rule still holds.
    kept = past.filter((h) => h.d >= cutoffKey);
    const recentIds = new Set(kept.map((h) => h.id));
    pick = candidates.find((r) => !recentIds.has(r.id)) ?? candidates[0];
  }

  writeDailyHistory([...kept, { d: today, id: pick.id, p: phase }]);
  return pick;
}

/** Cover image (full path): the recipe's own photo when it has one,
 *  else the stock image of its first category. */
export function recipeImage(r: Pick<SupabaseRecipe, 'slot' | 'categories' | 'image_url'> | null | undefined): string {
  if (r?.image_url) return r.image_url;
  return STOCK_IMG;
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
