/**
 * useStretches — reads the public `stretches` table (migration
 * 20260514140001_stretches_table.sql). Stretches are kept in their own
 * table from exercises so pillar-specific filters and rules can evolve
 * independently.
 */
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { exercises as LOCAL_FALLBACK } from '../data/exercises';

export interface DbStretch {
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

function fallback(): DbStretch[] {
  return LOCAL_FALLBACK
    .filter((e) => e.category === 'stretch')
    .map((e, i): DbStretch => ({
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

export function useStretches() {
  const [stretches, setStretches] = useState<DbStretch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStretches(fallback());
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('stretches')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) {
          setStretches(fallback());
        } else {
          setStretches(data as DbStretch[]);
        }
        setLoading(false);
      });
  }, []);

  return { stretches, loading };
}

export function useStretch(id: string | undefined) {
  const { stretches, loading } = useStretches();
  const stretch = id ? stretches.find((s) => s.id === id) ?? null : null;
  return { stretch, loading };
}
