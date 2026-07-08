/**
 * Daily cycle log persistence.
 *
 * Stores per-day symptom / mood / energy / sleep / mucus / flow / note
 * entries as a single JSON blob in `user_app_data` keyed by
 * (user_id, data_key='cycle_logs'). The blob is a map from
 * 'YYYY-MM-DD' → CycleLogEntry, so the entire history loads in one
 * round-trip and individual days can be read or written by date key.
 *
 * Same hybrid pattern as useCycleData: instant render from localStorage,
 * background hydrate from Supabase. Demo / unauthenticated path is a
 * silent no-op via syncToSupabase / loadFromSupabase.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { syncToSupabase, loadFromSupabase } from '../supabaseSync';
import { useSubscription } from '@/contexts/SubscriptionContext';

export interface CycleLogEntry {
  flow: string;
  symptoms: string[];
  moods: string[];
  energy: number;
  sleep: string;
  mucus: string;
  note: string;
  saved_at: string;
}

export type CycleLogs = Record<string, CycleLogEntry>;

const STORAGE_KEY = 'neome_cycle_logs';

function loadFromLocal(): CycleLogs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function useCycleLogs() {
  const { isPremium } = useSubscription();
  const [logs, setLogs] = useState<CycleLogs>(loadFromLocal);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Hydrate from Supabase in the background — newer remote data wins by saved_at
  useEffect(() => {
    loadFromSupabase<CycleLogs>('cycle_logs')
      .then((remote) => {
        if (!remote) return;
        setLogs((current) => {
          const merged: CycleLogs = { ...current };
          for (const [date, entry] of Object.entries(remote)) {
            const local = merged[date];
            if (!local || (entry.saved_at && entry.saved_at > local.saved_at)) {
              merged[date] = entry;
            }
          }
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // ignore quota errors
          }
          return merged;
        });
      })
      .catch((err) => console.warn('Failed to hydrate cycle logs from Supabase:', err));
  }, []);

  const saveLog = useCallback((date: Date, entry: Omit<CycleLogEntry, 'saved_at'>) => {
    const key = toDateKey(date);
    const stamped: CycleLogEntry = { ...entry, saved_at: new Date().toISOString() };

    setLogs((current) => {
      const next = { ...current, [key]: stamped };
      // Free tier: the entry lives in state for this session only
      // ("Náhľad bez ukladania") — persistence is the Plus perk.
      if (isPremium) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore quota errors
        }

        // Debounced Supabase sync
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          syncToSupabase('cycle_logs', next);
        }, 500);
      }

      return next;
    });
  }, [isPremium]);

  return { logs, saveLog };
}
