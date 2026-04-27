import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

/**
 * Daily-ritual hooks — F-003 / F-004 / F-006
 *
 * Three small hooks that back the design's daily-loop screens with
 * real persistence:
 *
 *   useReflections      → diary_entries (F-003 reflection store)
 *   useCycleSymptoms    → cycle_symptoms (F-004 chip toggles)
 *   useActiveProgram    → user_active_programs (F-006 Monday start)
 *
 * Each ships a localStorage demo fallback so the UI works pre-auth.
 */

function isRealUser(userId: string | undefined | null): boolean {
  return !!userId && userId !== 'demo-user-id';
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Reflections ────────────────────────────────────────────
export interface ReflectionEntry {
  id: string;
  user_id: string;
  text: string;
  date: string;
  created_at: string;
}

const REFLECTIONS_DEMO_KEY = 'neome_reflections_demo';

function loadDemoReflections(): ReflectionEntry[] {
  const raw = localStorage.getItem(REFLECTIONS_DEMO_KEY);
  if (raw) return JSON.parse(raw);
  return [];
}

function saveDemoReflections(rows: ReflectionEntry[]) {
  localStorage.setItem(REFLECTIONS_DEMO_KEY, JSON.stringify(rows));
}

export function useReflections() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const real = isRealUser(user?.id);

  const refresh = useCallback(async () => {
    if (!real) {
      setEntries(loadDemoReflections());
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setEntries((data as ReflectionEntry[] | null) ?? []);
    setLoading(false);
  }, [real, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addReflection = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (!real) {
        const next: ReflectionEntry = {
          id: crypto.randomUUID(),
          user_id: user?.id ?? 'demo',
          text: trimmed,
          date: todayISODate(),
          created_at: new Date().toISOString(),
        };
        const updated = [next, ...entries];
        setEntries(updated);
        saveDemoReflections(updated);
        return;
      }
      const { error } = await supabase.from('diary_entries').insert({
        user_id: user!.id,
        text: trimmed,
        date: todayISODate(),
      });
      if (!error) refresh();
    },
    [entries, real, refresh, user],
  );

  return { entries, count: entries.length, loading, addReflection, refresh };
}

// ─── Cycle symptoms ─────────────────────────────────────────
export type SymptomMap = Record<string, number>;

export interface SymptomDay {
  date: string;
  symptoms: SymptomMap;
}

const SYMPTOMS_DEMO_KEY = 'neome_cycle_symptoms_demo';

function loadDemoSymptoms(): SymptomDay[] {
  const raw = localStorage.getItem(SYMPTOMS_DEMO_KEY);
  if (raw) return JSON.parse(raw);
  return [];
}

function saveDemoSymptoms(days: SymptomDay[]) {
  localStorage.setItem(SYMPTOMS_DEMO_KEY, JSON.stringify(days));
}

export function useCycleSymptoms() {
  const { user } = useAuth();
  const [days, setDays] = useState<SymptomDay[]>([]);
  const [loading, setLoading] = useState(true);
  const real = isRealUser(user?.id);

  const refresh = useCallback(async () => {
    if (!real) {
      setDays(loadDemoSymptoms());
      setLoading(false);
      return;
    }
    // Last 60 days is enough for the calendar dots.
    const since = new Date();
    since.setDate(since.getDate() - 60);
    const { data } = await supabase
      .from('cycle_symptoms')
      .select('date, symptoms')
      .eq('user_id', user!.id)
      .gte('date', since.toISOString().slice(0, 10))
      .order('date', { ascending: false });
    setDays((data as SymptomDay[] | null) ?? []);
    setLoading(false);
  }, [real, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const todayMap: SymptomMap = days.find((d) => d.date === todayISODate())?.symptoms ?? {};

  const toggleSymptom = useCallback(
    async (key: string) => {
      const today = todayISODate();
      const current = todayMap[key] ?? 0;
      const next = current > 0 ? 0 : 1;
      const nextMap = { ...todayMap };
      if (next > 0) nextMap[key] = next;
      else delete nextMap[key];

      // Optimistic local update
      const otherDays = days.filter((d) => d.date !== today);
      const updatedDays = Object.keys(nextMap).length === 0
        ? otherDays
        : [{ date: today, symptoms: nextMap }, ...otherDays];
      setDays(updatedDays);

      if (!real) {
        saveDemoSymptoms(updatedDays);
        return;
      }
      // Upsert by (user_id, date)
      if (Object.keys(nextMap).length === 0) {
        await supabase
          .from('cycle_symptoms')
          .delete()
          .eq('user_id', user!.id)
          .eq('date', today);
      } else {
        await supabase
          .from('cycle_symptoms')
          .upsert(
            { user_id: user!.id, date: today, symptoms: nextMap },
            { onConflict: 'user_id,date' },
          );
      }
    },
    [days, real, todayMap, user],
  );

  // Helper: list of dates (YYYY-MM-DD) in the last 60 days that have any symptom logged.
  const symptomDates = days.filter((d) => Object.keys(d.symptoms).length > 0).map((d) => d.date);

  return { days, todayMap, symptomDates, loading, toggleSymptom, refresh };
}

// ─── Active program ─────────────────────────────────────────
export interface ActiveProgram {
  user_id: string;
  program_id: string;
  start_date: string;
  activated_at: string;
}

const ACTIVE_PROGRAM_DEMO_KEY = 'neome_active_program_demo';

export function useActiveProgram() {
  const { user } = useAuth();
  const [program, setProgram] = useState<ActiveProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const real = isRealUser(user?.id);

  const refresh = useCallback(async () => {
    if (!real) {
      const raw = localStorage.getItem(ACTIVE_PROGRAM_DEMO_KEY);
      setProgram(raw ? (JSON.parse(raw) as ActiveProgram) : null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('user_active_programs')
      .select('*')
      .eq('user_id', user!.id)
      .maybeSingle();
    setProgram((data as ActiveProgram | null) ?? null);
    setLoading(false);
  }, [real, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Activate a program with a chosen start Monday. Replaces any
   * existing active program for the user (one active at a time).
   * The DB enforces start_date is a Monday via CHECK constraint.
   */
  const activateProgram = useCallback(
    async (programId: string, startDate: Date) => {
      // Normalize to YYYY-MM-DD (date column)
      const iso = startDate.toISOString().slice(0, 10);
      const next: ActiveProgram = {
        user_id: user?.id ?? 'demo',
        program_id: programId,
        start_date: iso,
        activated_at: new Date().toISOString(),
      };
      setProgram(next);
      if (!real) {
        localStorage.setItem(ACTIVE_PROGRAM_DEMO_KEY, JSON.stringify(next));
        return { error: null };
      }
      const { error } = await supabase
        .from('user_active_programs')
        .upsert(
          { user_id: user!.id, program_id: programId, start_date: iso },
          { onConflict: 'user_id' },
        );
      return { error };
    },
    [real, user],
  );

  return { program, loading, activateProgram, refresh };
}
