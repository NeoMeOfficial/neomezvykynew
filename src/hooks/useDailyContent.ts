import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Daily content rotation hooks — F-001 / F-002 / F-011
 *
 * Each hook prefers an explicit "featured today" row from the live
 * tables (set via Supabase Studio / admin UI) and falls back to
 * deterministic dayOfYear-indexed picks so the UI never blanks.
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

export function useDailyMeditation() {
  const [meditation, setMeditation] = useState<DailyMeditation>(MEDITATION_FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Prefer today's featured_on row
      const { data: featured } = await supabase
        .from('meditations')
        .select('id, title, duration, description, audio_url, image, category')
        .eq('active', true)
        .eq('featured_on', todayISODate())
        .limit(1);

      if (!cancelled && featured && featured.length > 0) {
        setMeditation(featured[0] as DailyMeditation);
        setLoading(false);
        return;
      }

      // Fallback to deterministic pick across active rows
      const { data: all } = await supabase
        .from('meditations')
        .select('id, title, duration, description, audio_url, image, category')
        .eq('active', true)
        .order('id', { ascending: true });

      if (!cancelled) {
        if (all && all.length > 0) {
          const idx = dayOfYear() % all.length;
          setMeditation(all[idx] as DailyMeditation);
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { meditation, loading };
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

export function useDailyRecipe() {
  const [recipe, setRecipe] = useState<DailyRecipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: featured } = await supabase
        .from('recipes')
        .select('id, title, category, description, prep_time, calories, image')
        .eq('active', true)
        .eq('featured_on', todayISODate())
        .limit(1);

      if (!cancelled && featured && featured.length > 0) {
        setRecipe(featured[0] as DailyRecipe);
        setLoading(false);
        return;
      }

      const { data: all } = await supabase
        .from('recipes')
        .select('id, title, category, description, prep_time, calories, image')
        .eq('active', true)
        .order('id', { ascending: true });

      if (!cancelled) {
        if (all && all.length > 0) {
          const idx = dayOfYear() % all.length;
          setRecipe(all[idx] as DailyRecipe);
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { recipe, loading };
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

export function usePhaseAdvice(phaseKey: string | null | undefined) {
  const [rows, setRows] = useState<PhaseAdviceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!phaseKey) {
      setRows(PHASE_ADVICE_FALLBACK.follicular);
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('phase_advice')
        .select('*')
        .eq('active', true)
        .eq('phase_key', phaseKey)
        .order('sort_order', { ascending: true });

      if (!cancelled) {
        if (data && data.length > 0) {
          setRows(data as PhaseAdviceRow[]);
        } else {
          setRows(PHASE_ADVICE_FALLBACK[phaseKey] ?? PHASE_ADVICE_FALLBACK.follicular);
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [phaseKey]);

  return { rows, loading };
}
