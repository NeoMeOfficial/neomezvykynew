/**
 * useExercises — reads strength / cardio / mobility content from the public
 * `exercises` table (migration 20260514140000_exercises_table.sql).
 *
 * Pure read hook. RLS lets anyone read; writes go through admin paths.
 *
 * Falls back to the hardcoded src/data/exercises.ts strength block when
 * Supabase isn't configured (demo / offline), so the UI keeps working.
 */
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { exercises as LOCAL_FALLBACK } from '../data/exercises';

export interface DbExercise {
  id: string;
  name: string;
  duration_min: number;
  body_target: string;
  equipment: string;
  thumb_url: string | null;
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'all';
  intensity: 'low' | 'medium' | 'high';
  video_id: string | null;
  video_provider: 'vimeo' | 'youtube' | null;
  free: boolean;
  sort_order: number;
}

function fallback(): DbExercise[] {
  // Adapt the legacy src/data/exercises.ts shape to DbExercise so callers
  // don't branch on data source.
  return LOCAL_FALLBACK
    .filter((e) => e.category === 'strength')
    .map((e, i): DbExercise => ({
      id: e.id,
      name: e.name,
      duration_min: parseInt(e.duration, 10) || 15,
      body_target: e.body,
      equipment: e.equip,
      thumb_url: e.thumb,
      phase: e.phase,
      intensity: e.intensity,
      video_id: e.videoUrl ?? null,
      video_provider: e.videoUrl
        ? (/^\d+$/.test(e.videoUrl) ? 'vimeo' : 'youtube')
        : null,
      free: e.free ?? false,
      sort_order: i + 1,
    }));
}

export function useExercises() {
  const [exercises, setExercises] = useState<DbExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setExercises(fallback());
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('exercises')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) {
          // Table missing / permission error → fall back to local.
          setExercises(fallback());
        } else {
          setExercises(data as DbExercise[]);
        }
        setLoading(false);
      });
  }, []);

  return { exercises, loading };
}

export function useExercise(id: string | undefined) {
  const { exercises, loading } = useExercises();
  const exercise = id ? exercises.find((e) => e.id === id) ?? null : null;
  return { exercise, loading };
}
