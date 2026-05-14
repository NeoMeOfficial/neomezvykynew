/**
 * useMeditations — reads the public `meditations` table (migration
 * 20260514140002_meditations_table.sql).
 *
 * The audio_url column is the missing piece for real playback. Until Gabi
 * uploads the audio files, audio_url is NULL and consumers fall back to
 * the visual-only player. The MeditationPlayer page will use it as the
 * single source of truth for the player surface (replacing the dual
 * Meditacie.tsx list + MeditationPlayer.tsx slug dictionary that previously
 * existed side by side).
 *
 * Demo fallback: a static curated list mirroring the seed rows so the UI
 * works when Supabase isn't configured.
 */
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface DbMeditation {
  id: string;          // slug, e.g. 'ranna-meditacia'
  title: string;
  subtitle: string | null;
  eyebrow: string | null;
  category: 'rano' | 'vecer' | 'spanok' | 'stres' | 'fokus' | 'dych' | 'uzkost' | 'telo' | 'general';
  duration_sec: number;
  instructor: string;
  thumb_url: string | null;
  audio_url: string | null;
  free: boolean;
  sort_order: number;
}

const DEMO_FALLBACK: DbMeditation[] = [
  { id: 'ranna-meditacia', title: 'Ranná meditácia', subtitle: 'Krátka meditácia na uzemnenie a nájdenie pokoja pred dňom.', eyebrow: 'Ráno', category: 'rano', duration_sec: 600, instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 1 },
  { id: 'hlboky-spanok', title: 'Hlboký spánok', subtitle: '15 minút pomalého dychu pre prechod do spánku.', eyebrow: 'Večer', category: 'spanok', duration_sec: 1200, instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 2 },
  { id: 'zvladanie-stresu', title: 'Zvládanie stresu', subtitle: 'Krátka prax pre návrat do tela počas náročného dňa.', eyebrow: 'Stres', category: 'stres', duration_sec: 900, instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 3 },
  { id: 'fokus', title: 'Fokus a koncentrácia', subtitle: '12 minút na zostrenie pozornosti.', eyebrow: 'Práca', category: 'fokus', duration_sec: 720, instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 4 },
  { id: 'vecerne-uvolnenie', title: 'Večerné uvoľnenie', subtitle: 'Pomalé telo-skenovanie pred spaním.', eyebrow: 'Večer', category: 'vecer', duration_sec: 1080, instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 5 },
  { id: 'dychanie-4-7-8', title: 'Dýchanie 4-7-8', subtitle: '4 sekundy nádych, 7 zadržanie, 8 výdych — pre upokojenie.', eyebrow: 'Dych', category: 'dych', duration_sec: 480, instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 6 },
  { id: 'upokojenie-uzkosti', title: 'Upokojenie úzkosti', subtitle: 'Sústredená prax pre návrat k zemi.', eyebrow: 'Telo', category: 'uzkost', duration_sec: 720, instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 7 },
  { id: 'prijatie-tela', title: 'Prijatie tela', subtitle: '8 minút body-scan praxe.', eyebrow: 'Telo', category: 'telo', duration_sec: 480, instructor: 'Gabi', thumb_url: null, audio_url: null, free: true, sort_order: 8 },
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
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) {
          setMeditations(DEMO_FALLBACK);
        } else {
          setMeditations(data as DbMeditation[]);
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
