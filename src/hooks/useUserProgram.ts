/**
 * useUserProgram — the user's active program resolved to TODAY's content.
 *
 * Replaces the old hardcoded mock (hasProgram=false) with the real chain:
 *   user_active_programs (Monday start, one per user)
 *   → programmes.schedule (admin schedule builder: weeks × Mon–Fri days,
 *     each day = exercise | meditation | rest + contentId + Gabi message)
 *   → exercises / meditations row for the scheduled content.
 *
 * The home Telo card renders from this; the scheduled video opens in the
 * player exactly like a library pick. Weekends and 'rest' days are rest.
 */
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useActiveProgram } from './useDailyRituals';
import { programList } from '@/data/programs';

interface ScheduleDay {
  dayName?: string;
  type?: 'exercise' | 'meditation' | 'rest';
  contentId?: string;
  message?: string;
}
interface ScheduleWeek {
  weekNumber?: number;
  title?: string;
  days?: ScheduleDay[];
}

interface ProgrammeRow {
  id: string;
  name: string;
  weeks: number | null;
  schedule: ScheduleWeek[] | null;
}

export interface UserProgramToday {
  id: string;
  name: string;
  totalWeeks: number;
  startDate: string;
  /** upcoming = start Monday is in the future; active = running now. */
  state: 'upcoming' | 'active';
  week: number;
  day: number;
  todayType: 'exercise' | 'meditation' | 'rest';
  /** Gabi's message for today's slot (empty string → null). */
  message: string | null;
  todaysExercise?: {
    id: string;
    kind: 'exercise' | 'meditation';
    title: string;
    duration: string;
    thumb: string | null;
    /** Extracted video id (Vimeo numeric / YouTube 11-char) for the player. */
    videoUrl: string | null;
    /** Raw DB fields the player shows as tags. */
    body?: string | null;
    equip?: string | null;
    description?: string | null;
    category?: string | null;
    diastasisSafe?: boolean;
  };
}

function localDayISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Same extraction the app player expects — vimeo numeric id or YT 11-char id. */
function extractVideoId(videoUrl: string | null | undefined): string | null {
  if (!videoUrl) return null;
  const v = videoUrl.trim();
  const bunny = v.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/);
  if (bunny) return bunny[1].toLowerCase();
  const vimeo = v.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return vimeo[1];
  const yt = v.match(/(?:youtube\.com\/.*[?&]v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return yt[1];
  if (/^\d+$/.test(v) || /^[\w-]{11}$/.test(v)) return v;
  return null;
}

export function useUserProgram() {
  const { program: active, loading: activeLoading } = useActiveProgram();
  const [row, setRow] = useState<ProgrammeRow | null>(null);
  const [content, setContent] = useState<UserProgramToday['todaysExercise'] | null>(null);
  const [loading, setLoading] = useState(true);

  // Today's position in the program — recomputed per render day.
  const position = useMemo(() => {
    if (!active) return null;
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const start = new Date(active.start_date + 'T00:00:00');
    const daysSince = Math.round((todayMid.getTime() - start.getTime()) / 86400000);
    const week = Math.floor(daysSince / 7) + 1;
    const weekday = (todayMid.getDay() + 6) % 7; // Mon=0 .. Sun=6
    return { daysSince, week, weekday };
  }, [active?.start_date, localDayISO(new Date())]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load the programme schedule row for the active program.
  useEffect(() => {
    let cancelled = false;
    if (!active) { setRow(null); setLoading(activeLoading); return; }
    setLoading(true);
    supabase
      .from('programmes')
      .select('id, name, weeks, schedule')
      .eq('id', active.program_id)
      .eq('active', true)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) { setRow((data as ProgrammeRow | null) ?? null); setLoading(false); }
      }, () => { if (!cancelled) { setRow(null); setLoading(false); } });
    return () => { cancelled = true; };
  }, [active?.program_id, activeLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const staticMeta = active ? programList.find((p) => p.slug === active.program_id) : undefined;
  const totalWeeks = row?.weeks ?? staticMeta?.weeks ?? 8;

  const todaySlot: ScheduleDay | null = useMemo(() => {
    if (!active || !position || position.daysSince < 0) return null;
    if (position.weekday >= 5) return { type: 'rest' }; // weekend
    const week = row?.schedule?.find((w) => w.weekNumber === position.week)
      ?? row?.schedule?.[position.week - 1];
    return week?.days?.[position.weekday] ?? null;
  }, [active, position, row]);

  // Resolve the scheduled content row.
  useEffect(() => {
    let cancelled = false;
    const type = todaySlot?.type;
    const id = todaySlot?.contentId;
    if (!id || !type || type === 'rest') { setContent(null); return; }
    const table = type === 'meditation' ? 'meditations' : 'exercises';
    supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) { if (!cancelled) setContent(null); return; }
        if (type === 'meditation') {
          setContent({
            id: data.id,
            kind: 'meditation',
            title: data.title ?? data.name ?? 'Meditácia',
            duration: data.duration ?? '',
            thumb: data.image ?? null,
            videoUrl: null,
          });
        } else {
          setContent({
            id: data.id,
            kind: 'exercise',
            title: data.name ?? 'Cvičenie',
            duration: data.duration ?? '',
            thumb: data.thumb || null,
            videoUrl: extractVideoId(data.video_url),
            body: data.body ?? null,
            equip: data.equip ?? null,
            description: data.description ?? null,
            category: data.category ?? null,
            diastasisSafe: !!data.diastasis_safe,
          });
        }
      }, () => { if (!cancelled) setContent(null); });
    return () => { cancelled = true; };
  }, [todaySlot?.contentId, todaySlot?.type]); // eslint-disable-line react-hooks/exhaustive-deps

  const userProgram: UserProgramToday | null = useMemo(() => {
    if (!active || !position) return null;
    const name = row?.name ?? staticMeta?.name ?? active.program_id;
    if (position.daysSince < 0) {
      return {
        id: active.program_id, name, totalWeeks, startDate: active.start_date,
        state: 'upcoming', week: 1, day: 1, todayType: 'rest', message: null,
      };
    }
    if (position.week > totalWeeks) return null; // finished — home reverts to picks
    const todayType = todaySlot?.type ?? 'rest';
    return {
      id: active.program_id, name, totalWeeks, startDate: active.start_date,
      state: 'active',
      week: position.week,
      day: position.weekday + 1,
      todayType,
      message: (todaySlot?.message ?? '').trim() || null,
      todaysExercise: todayType !== 'rest' && content ? content : undefined,
    };
  }, [active, position, row, staticMeta, totalWeeks, todaySlot, content]);

  return {
    userProgram,
    hasProgram: !!userProgram,
    loading: loading || activeLoading,
  };
}
