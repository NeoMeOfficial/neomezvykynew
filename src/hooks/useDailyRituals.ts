import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

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

// Real Supabase auth users have UUIDs. Demo / mock users have short
// strings like 'demo' or 'demo-user-id'. Treat anything that isn't
// UUID-shaped as demo so we don't 400 the API with bad user_id values.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isRealUser(userId: string | undefined | null): boolean {
  return !!userId && UUID_RE.test(userId);
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

/**
 * Diary cache strategy
 * ────────────────────
 * • Entries are written to a user-scoped localStorage key
 *   ('neome_reflections::<uid>') so they survive logout/login.
 * • An anon key ('neome_reflections_demo') stores entries written
 *   while signed out / in demo mode — migrated into the user's
 *   bucket on the next signed-in refresh.
 * • Each cached entry carries a `synced` flag. If the Supabase insert
 *   fails (RLS, FK, network), the entry stays in cache as
 *   synced=false and refresh() retries the insert next time we have
 *   a real user. Once accepted, it's marked synced.
 */
const ANON_KEY = 'neome_reflections_demo';
const KEY_PREFIX = 'neome_reflections::';

type CachedReflection = ReflectionEntry & { synced?: boolean };

function userKey(uid: string | undefined | null): string {
  return uid && isRealUser(uid) ? `${KEY_PREFIX}${uid}` : ANON_KEY;
}

function loadCache(key: string): CachedReflection[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCache(key: string, rows: CachedReflection[]) {
  try {
    localStorage.setItem(key, JSON.stringify(rows.slice(0, 200)));
  } catch {
    // quota or private mode — ignore
  }
}

function mergeEntries(a: CachedReflection[], b: CachedReflection[]): CachedReflection[] {
  // First dedupe by id, preferring the synced copy.
  const byId = new Map<string, CachedReflection>();
  for (const e of [...a, ...b]) {
    const existing = byId.get(e.id);
    if (!existing || (!existing.synced && e.synced)) byId.set(e.id, e);
  }
  // Then drop unsynced entries that have a synced sibling with the
  // same user_id + date + text. This collapses duplicates that were
  // created before the addReflection insert started passing the
  // client-generated id: the unsynced local row and the synced server
  // row had different ids but the same content.
  const all = Array.from(byId.values());
  const syncedKeys = new Set(
    all
      .filter((e) => e.synced)
      .map((e) => `${e.user_id}::${e.date}::${e.text.trim()}`),
  );
  const filtered = all.filter((e) => {
    if (e.synced) return true;
    const k = `${e.user_id}::${e.date}::${e.text.trim()}`;
    return !syncedKeys.has(k);
  });
  return filtered.sort((x, y) => (y.created_at || '').localeCompare(x.created_at || ''));
}

export function useReflections() {
  const { user } = useSupabaseAuth();
  const real = isRealUser(user?.id);
  const key = userKey(user?.id);

  const [entries, setEntries] = useState<CachedReflection[]>(() => {
    // Initial render: show whatever's already in this bucket plus any
    // anonymous entries that should be migrated.
    const own = loadCache(key);
    const anon = key !== ANON_KEY ? loadCache(ANON_KEY) : [];
    return mergeEntries(own, anon);
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const own = loadCache(key);
    const anon = key !== ANON_KEY ? loadCache(ANON_KEY) : [];
    const localMerged = mergeEntries(own, anon);

    if (!real) {
      setEntries(localMerged);
      setLoading(false);
      return;
    }

    // Fetch remote.
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(100);

    let remote: CachedReflection[] = [];
    if (error) {
      console.warn('[diary] fetch failed, using local cache', error);
    } else {
      remote = ((data as ReflectionEntry[] | null) ?? []).map((r) => ({ ...r, synced: true }));
    }

    // Re-try any cached entries that haven't synced yet. Use upsert so
    // re-runs are idempotent: if the row already exists with this id
    // (e.g. a previous insert succeeded but the success-path didn't
    // run), the conflict is silently ignored instead of duplicating.
    const pending = localMerged.filter((e) => e.synced === false);
    if (pending.length > 0 && !error) {
      const inserts = pending.map((p) => ({
        id: p.id,
        user_id: user!.id,
        text: p.text,
        date: p.date || todayISODate(),
        created_at: p.created_at,
      }));
      const { error: insertErr } = await supabase
        .from('diary_entries')
        .upsert(inserts, { onConflict: 'id', ignoreDuplicates: true });
      if (insertErr) {
        console.warn('[diary] pending sync failed; will retry next refresh', {
          code: insertErr.code,
          message: insertErr.message,
          details: insertErr.details,
          hint: insertErr.hint,
        });
      } else {
        // Re-fetch so we have authoritative ids/timestamps from the server.
        const { data: data2 } = await supabase
          .from('diary_entries')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })
          .limit(100);
        remote = ((data2 as ReflectionEntry[] | null) ?? []).map((r) => ({ ...r, synced: true }));
      }
    }

    const merged = mergeEntries(remote, localMerged);
    setEntries(merged);
    saveCache(key, merged);
    // Anon entries have been migrated into the user bucket — clear so
    // a future logout doesn't replay them for someone else on the same
    // device.
    if (anon.length > 0 && key !== ANON_KEY) localStorage.removeItem(ANON_KEY);
    setLoading(false);
  }, [real, user?.id, key]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addReflection = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const next: CachedReflection = {
        id: crypto.randomUUID(),
        user_id: user?.id ?? 'demo',
        text: trimmed,
        date: todayISODate(),
        created_at: new Date().toISOString(),
        synced: false,
      };
      // Optimistic local write — show immediately, persist to bucket.
      setEntries((prev) => {
        const updated = [next, ...prev];
        saveCache(key, updated);
        return updated;
      });
      if (!real) return;
      // Pass the client id so the local cache entry and the Supabase
      // row share the same primary key — otherwise mergeEntries on the
      // next refresh treats them as two distinct entries and the same
      // reflection shows up twice in the list.
      const { error } = await supabase.from('diary_entries').insert({
        id: next.id,
        user_id: user!.id,
        text: trimmed,
        date: next.date,
        created_at: next.created_at,
      });
      if (error) {
        console.warn('[diary] insert failed; will retry on next refresh', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        return;
      }
      // Mark synced — the next refresh will reconcile ids with the server.
      setEntries((prev) => {
        const updated = prev.map((e) => (e.id === next.id ? { ...e, synced: true } : e));
        saveCache(key, updated);
        return updated;
      });
    },
    [real, user?.id, key],
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
  const { user } = useSupabaseAuth();
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
  }, [real, user?.id]);

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
    [days, real, todayMap, user?.id],
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
  const { user } = useSupabaseAuth();
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
  }, [real, user?.id]);

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
    [real, user?.id],
  );

  return { program, loading, activateProgram, refresh };
}
