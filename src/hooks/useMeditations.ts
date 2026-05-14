/**
 * useMeditations — reads the existing `meditations` table on prod.
 *
 * Production schema (from the April 2026 migration + later ALTERs):
 *   id, title, duration (text e.g. '10 min'), description, audio_url,
 *   image, category, status, featured_on, active, created_at, updated_at.
 *
 * This hook returns the unified DbMeditation shape used by the rest of
 * the app (duration_sec numeric, thumb_url, subtitle, eyebrow). Field
 * mapping below.
 *
 * Demo fallback: a static curated list so the UI works when Supabase
 * isn't configured.
 */
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface DbMeditation {
  id: string;
  title: string;
  subtitle: string | null;          // ← description in DB
  eyebrow: string | null;           // ← category in DB (display label)
  category: string;                 // raw category (e.g. 'Mindfulness', 'Stres')
  duration_sec: number;             // parsed from duration text
  instructor: string;
  thumb_url: string | null;         // ← image in DB
  audio_url: string | null;
  free: boolean;
  sort_order: number;
}

interface RawMeditation {
  id: string;
  title: string;
  duration: string | null;
  description: string | null;
  audio_url: string | null;
  image: string | null;
  category: string | null;
  status?: string;
  featured_on?: string | null;
  active?: boolean;
}

// Parse '10 min' / '15 min' → 600 / 900 seconds. Falls back to 600 if
// the string can't be parsed.
function parseDurationToSec(s: string | null): number {
  if (!s) return 600;
  const m = s.match(/(\d+)/);
  if (!m) return 600;
  return parseInt(m[1], 10) * 60;
}

function adapt(row: RawMeditation, index: number): DbMeditation {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.description,
    eyebrow: row.category,
    category: row.category ?? 'general',
    duration_sec: parseDurationToSec(row.duration),
    instructor: 'Gabi',
    thumb_url: row.image,
    audio_url: row.audio_url,
    free: true,
    sort_order: index + 1,
  };
}

const DEMO_FALLBACK: DbMeditation[] = [
  { id: 'ranna-meditacia',  title: 'Ranná meditácia',  subtitle: 'Krátka meditácia na uzemnenie a nájdenie pokoja pred dňom.', eyebrow: 'Mindfulness', category: 'Mindfulness', duration_sec: 600,  instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 1 },
  { id: 'hlboky-spanok',    title: 'Hlboký spánok',    subtitle: '15 minút pomalého dychu pre prechod do spánku.',            eyebrow: 'Spánok',       category: 'Spánok',      duration_sec: 1200, instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 2 },
  { id: 'zvladanie-stresu', title: 'Zvládanie stresu', subtitle: 'Krátka prax pre návrat do tela počas náročného dňa.',       eyebrow: 'Stres',        category: 'Stres',       duration_sec: 900,  instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 3 },
  { id: 'fokus',            title: 'Fokus a koncentrácia', subtitle: '12 minút na zostrenie pozornosti.',                     eyebrow: 'Mindfulness', category: 'Mindfulness', duration_sec: 720,  instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 4 },
];

export function useMeditations() {
  const [meditations, setMeditations] = useState<DbMeditation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setMeditations(DEMO_FALLBACK);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('meditations')
      .select('id, title, duration, description, audio_url, image, category, status, featured_on, active')
      .eq('active', true)
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setMeditations(DEMO_FALLBACK);
        } else {
          setMeditations(data.map((r, i) => adapt(r as RawMeditation, i)));
        }
        setLoading(false);
      });
  }, []);

  return { meditations, loading };
}

export function useMeditation(id: string | undefined) {
  const { meditations, loading } = useMeditations();
  const meditation = id ? meditations.find((m) => m.id === id) ?? null : null;
  return { meditation, loading };
}
