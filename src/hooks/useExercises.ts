/**
 * useExercises — reads the existing unified `exercises` table.
 *
 * Production schema (from the April 2026 migration):
 *   id, content_type ('exercise'|'stretch'), name, duration (text),
 *   category, body, equip, level, diastasis_safe, thumb, description,
 *   video_url, active, created_at, updated_at.
 *
 * This hook filters to content_type='exercise' (strength / mobility /
 * cardio rows) and adapts the existing columns to the shape that the
 * UI expects (DbExercise).
 *
 * Falls back to a hardcoded preview when Supabase isn't configured.
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
  diastasis_safe: boolean;
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
  diastasis_safe: boolean | null;
  thumb: string | null;
  description: string | null;
  video_url: string | null;
  active: boolean | null;
}

function parseDurationMin(s: string | null): number {
  if (!s) return 15;
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 15;
}

// Heuristic intensity from level (1–4 in the existing schema) → low/medium/high.
function levelToIntensity(level: number | null): 'low' | 'medium' | 'high' {
  if (level === null || level <= 1) return 'low';
  if (level === 2) return 'medium';
  return 'high';
}

function detectProvider(videoUrl: string | null): 'vimeo' | 'youtube' | null {
  if (!videoUrl) return null;
  if (videoUrl.includes('vimeo.com') || /^\d+$/.test(videoUrl)) return 'vimeo';
  if (videoUrl.includes('youtu')) return 'youtube';
  return null;
}

function extractVideoId(videoUrl: string | null): string | null {
  if (!videoUrl) return null;
  // Already a bare id?
  if (/^\d+$/.test(videoUrl)) return videoUrl;
  if (/^[A-Za-z0-9_-]{11}$/.test(videoUrl)) return videoUrl;
  // Vimeo URL
  const v = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (v) return v[1];
  // YouTube URL — short / long
  const y = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
  if (y) return y[1];
  return null;
}

function adapt(row: RawExercise, index: number): DbExercise {
  return {
    id: row.id,
    name: row.name,
    duration_min: parseDurationMin(row.duration),
    body_target: row.body ?? 'Celé telo',
    equipment: row.equip ?? 'Bez pomôcok',
    thumb_url: row.thumb,
    phase: 'all',
    intensity: levelToIntensity(row.level),
    video_id: extractVideoId(row.video_url),
    video_provider: detectProvider(row.video_url),
    free: (row.level ?? 0) <= 1 || row.id.startsWith('ranne-prebudenie') || row.id.startsWith('jemny-core'),
    sort_order: index + 1,
    diastasis_safe: row.diastasis_safe ?? true,
    description: row.description,
  };
}

function fallback(): DbExercise[] {
  return LOCAL_FALLBACK
    .filter((e) => e.category === 'strength')
    .map((e, i): DbExercise => ({
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
      diastasis_safe: true,
      description: null,
    }));
}

// Warm cache — the home Telo card renders the correct daily pick
// instantly on app open; the network fetch then quietly reconciles.
const EX_CACHE_KEY = 'neome_exercises_cache_v1';
function readExCache(): DbExercise[] | null {
  try {
    const raw = localStorage.getItem(EX_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch { return null; }
}

export function useExercises() {
  const [exercises, setExercises] = useState<DbExercise[]>(() => readExCache() ?? []);
  const [loading, setLoading] = useState(() => readExCache() === null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setExercises(fallback());
      setLoading(false);
      return;
    }
    supabase
      .from('exercises')
      .select('id, content_type, name, duration, category, body, equip, level, diastasis_safe, thumb, description, video_url, active')
      .eq('content_type', 'exercise')
      .eq('active', true)
      // Creation order keeps series numbering (č. 1, č. 2 …) stable as new
      // videos are appended — see exerciseTaxonomy.ts.
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          if (readExCache() === null) setExercises(fallback());
        } else {
          const adapted = data.map((r, i) => adapt(r as RawExercise, i));
          setExercises(adapted);
          try { localStorage.setItem(EX_CACHE_KEY, JSON.stringify(adapted)); } catch { /* full */ }
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
