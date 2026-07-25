/**
 * useStretches — reads the existing unified `exercises` table on prod
 * (the same one useExercises queries), filtered to content_type='stretch'.
 *
 * Production schema has both types in one table with a discriminator;
 * this hook just isolates the stretch subset and adapts column names
 * to the DbStretch shape used by the UI.
 *
 * Falls back to hardcoded preview when Supabase isn't configured.
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
  description: string | null;
}

interface RawExercise {
  id: string;
  content_type: 'exercise' | 'stretch';
  name: string;
  duration: string | null;
  category: string | null;
  body: string | null;
  equip: string | null;
  level: number | null;
  thumb: string | null;
  description: string | null;
  video_url: string | null;
  active: boolean | null;
}

function parseDurationMin(s: string | null): number {
  if (!s) return 10;
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 10;
}

function detectProvider(videoUrl: string | null): 'vimeo' | 'youtube' | null {
  if (!videoUrl) return null;
  if (videoUrl.includes('vimeo.com') || /^\d+$/.test(videoUrl)) return 'vimeo';
  if (videoUrl.includes('youtu')) return 'youtube';
  return null;
}

function extractVideoId(videoUrl: string | null): string | null {
  if (!videoUrl) return null;
  if (/^\d+$/.test(videoUrl)) return videoUrl;
  if (/^[A-Za-z0-9_-]{11}$/.test(videoUrl)) return videoUrl;
  const v = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (v) return v[1];
  const y = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
  if (y) return y[1];
  return null;
}

function adapt(row: RawExercise, index: number): DbStretch {
  // Stretches are generally low-intensity in this catalog; treat short
  // ones (≤5 min) and the first morning stretch as free preview.
  const dur = parseDurationMin(row.duration);
  return {
    id: row.id,
    name: row.name,
    duration_min: dur,
    body_target: row.body ?? 'Celé telo',
    equipment: row.equip ?? 'Bez pomôcok',
    thumb_url: row.thumb,
    phase: 'all',
    intensity: 'low',
    video_id: extractVideoId(row.video_url),
    video_provider: detectProvider(row.video_url),
    free: dur <= 7 || row.id === 'ranny-prebudzac' || row.id === 'krk-plecia',
    sort_order: index + 1,
    description: row.description,
  };
}

function fallback(): DbStretch[] {
  return LOCAL_FALLBACK
    .filter((e) => e.category === 'stretch')
    .map((e, i): DbStretch => ({
      id: e.id,
      name: e.name,
      duration_min: parseDurationMin(e.duration),
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
      description: null,
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
      .from('exercises')
      .select('id, content_type, name, duration, category, body, equip, level, thumb, description, video_url, active')
      .eq('content_type', 'stretch')
      .eq('active', true)
      // Creation order keeps series numbering stable — see exerciseTaxonomy.ts.
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setStretches(fallback());
        } else {
          setStretches(data.map((r, i) => adapt(r as RawExercise, i)));
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
