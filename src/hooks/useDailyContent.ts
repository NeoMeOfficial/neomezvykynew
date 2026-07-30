import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Daily content rotation hooks — F-001 / F-002 / F-011
 *
 * Each hook prefers an explicit "featured today" row from the live
 * tables (set via Supabase Studio / admin UI) and falls back to
 * deterministic dayOfYear-indexed picks so the UI never blanks.
 *
 * Powered by React Query (5 min stale time, refetch on window focus).
 * Migrated to React Query in Phase 0 of the admin rebuild as the
 * proof-of-pattern for converting other hooks (see project_admin_panel_plan).
 */

function dayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Meditation ─────────────────────────────────────────────

export interface DailyMeditation {
  id: string;
  title: string;
  duration: string;
  description: string | null;
  audio_url: string | null;
  image: string | null;
  category: string | null;
}

const MEDITATION_FALLBACK: DailyMeditation = {
  id: 'fallback-rano',
  title: 'Ranný pokoj',
  duration: '10 min',
  description: 'Krátka meditácia, ktorá ťa prevedie do dňa.',
  audio_url: null,
  image: '/images/r9/section-mysel.jpg',
  category: 'Mindfulness',
};

async function fetchDailyMeditation(): Promise<DailyMeditation> {
  const today = todayISODate();

  // Prefer today's featured_on row
  const { data: featured } = await supabase
    .from('meditations')
    .select('id, title, duration, description, audio_url, image, category')
    .eq('status', 'published')
    .eq('featured_on', today)
    .limit(1);

  if (featured && featured.length > 0) {
    return featured[0] as DailyMeditation;
  }

  // Fallback: deterministic pick from all published rows
  const { data: all } = await supabase
    .from('meditations')
    .select('id, title, duration, description, audio_url, image, category')
    .eq('status', 'published')
    .order('id', { ascending: true });

  if (all && all.length > 0) {
    const idx = dayOfYear() % all.length;
    return all[idx] as DailyMeditation;
  }

  return MEDITATION_FALLBACK;
}

const MED_CACHE_KEY = 'neome_daily_meditation_v1';
function readMedCache(): DailyMeditation | null {
  try {
    const raw = localStorage.getItem(MED_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && parsed.date === todayISODate() ? parsed.med : null;
  } catch { return null; }
}

export function useDailyMeditation() {
  const { data, isLoading } = useQuery({
    queryKey: ['daily-meditation', todayISODate()],
    queryFn: async () => {
      const med = await fetchDailyMeditation();
      try { localStorage.setItem(MED_CACHE_KEY, JSON.stringify({ date: todayISODate(), med })); } catch { /* full */ }
      return med;
    },
    // Same-day cache renders the correct title instantly on app open;
    // the fetch reconciles in the background.
    initialData: () => readMedCache() ?? undefined,
    initialDataUpdatedAt: 0,
  });
  return {
    meditation: data ?? MEDITATION_FALLBACK,
    loading: isLoading,
  };
}

// ─── Recipe ─────────────────────────────────────────────────

export interface DailyRecipe {
  id: string;
  title: string;
  category: string;
  description: string | null;
  prep_time: number;
  calories: number;
  image: string | null;
}

async function fetchDailyRecipe(): Promise<DailyRecipe | null> {
  const today = todayISODate();

  const { data: featured } = await supabase
    .from('recipes')
    .select('id, title, category, description, prep_time, calories, image')
    .eq('status', 'published')
    .eq('featured_on', today)
    .limit(1);

  if (featured && featured.length > 0) {
    return featured[0] as DailyRecipe;
  }

  const { data: all } = await supabase
    .from('recipes')
    .select('id, title, category, description, prep_time, calories, image')
    .eq('status', 'published')
    .order('id', { ascending: true });

  if (all && all.length > 0) {
    const idx = dayOfYear() % all.length;
    return all[idx] as DailyRecipe;
  }

  return null;
}

export function useDailyRecipe() {
  const { data, isLoading } = useQuery({
    queryKey: ['daily-recipe', todayISODate()],
    queryFn: fetchDailyRecipe,
  });
  return {
    recipe: data ?? null,
    loading: isLoading,
  };
}

// ─── Phase advice ───────────────────────────────────────────

export interface PhaseAdviceRow {
  id: string;
  phase_key: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  pillar: 'telo' | 'strava' | 'mysel';
  title: string;
  body_text: string;
  image_key: string | null;
  target_path: string | null;
  sort_order: number;
}

const PHASE_ADVICE_FALLBACK: Record<string, PhaseAdviceRow[]> = {
  follicular: [
    { id: 'fb1', phase_key: 'follicular', pillar: 'telo',   title: 'Energia rastie — využi ju', body_text: 'Dobré dni na nový program alebo intenzívnejšie cvičenie.',                sort_order: 1, image_key: null, target_path: '/kniznica/telo' },
    { id: 'fb2', phase_key: 'follicular', pillar: 'mysel',  title: 'Plánuj a tvor',             body_text: 'Hormóny ti pomáhajú s jasnosťou — naplánuj si týždeň alebo začni nový projekt.', sort_order: 2, image_key: null, target_path: '/mysel' },
    { id: 'fb3', phase_key: 'follicular', pillar: 'strava', title: 'Ľahké, čerstvé chute',      body_text: 'Šaláty, smoothies a celozrnné jedlá ti dodajú trvalú energiu.',          sort_order: 3, image_key: null, target_path: '/strava/recepty' },
  ],
};

async function fetchPhaseAdvice(phaseKey: string): Promise<PhaseAdviceRow[]> {
  const { data } = await supabase
    .from('phase_advice')
    .select('*')
    .eq('active', true)              // phase_advice keeps `active` (not migrated to status)
    .eq('phase_key', phaseKey)
    .order('sort_order', { ascending: true });

  if (data && data.length > 0) return data as PhaseAdviceRow[];
  return PHASE_ADVICE_FALLBACK[phaseKey] ?? PHASE_ADVICE_FALLBACK.follicular;
}

export function usePhaseAdvice(phaseKey: string | null | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ['phase-advice', phaseKey ?? 'follicular'],
    queryFn: () => fetchPhaseAdvice(phaseKey ?? 'follicular'),
    enabled: !!phaseKey,
  });
  return {
    rows: data ?? PHASE_ADVICE_FALLBACK.follicular,
    loading: isLoading,
  };
}
