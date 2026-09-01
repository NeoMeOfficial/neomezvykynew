/**
 * Cycle-settings persistence — the single seam between useCycleData and
 * Supabase. Targets the columnar `cycle_data` table (one row per user),
 * which is also what the push-notification cron reads. See ADR-0002.
 *
 * Legacy migration: cycle settings used to live as a JSON blob in
 * user_app_data (data_key='cycle_data'). loadCycleData() lazily migrates
 * a user off the blob — if the table has no row but the blob does, the
 * blob is returned and the caller's first save writes the table.
 */

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { loadFromSupabase } from '../supabaseSync';
import type { CycleData, CustomSettings, PeriodLog, DailyPeriodData } from './types';

interface CycleDataRow {
  user_id: string;
  last_period_start: string | null;
  cycle_length: number;
  period_length: number;
  history: PeriodLog[] | null;
  daily_period_data: DailyPeriodData[] | null;
  custom_settings: Partial<CustomSettings> | null;
  updated_at: string;
  // Added by migration 20260902100000 — absent (undefined) on older schemas.
  current_period_end?: string | null;
  bleed_lengths?: number[] | null;
}

const defaultCustomSettings: CustomSettings = {
  notifications: true,
  symptomTracking: false,
  moodTracking: true,
  notes: '',
};

function rowToCycleData(row: CycleDataRow): CycleData {
  return {
    lastPeriodStart: row.last_period_start,
    cycleLength: row.cycle_length,
    periodLength: row.period_length,
    history: row.history ?? [],
    dailyPeriodData: row.daily_period_data ?? [],
    customSettings: { ...defaultCustomSettings, ...(row.custom_settings ?? {}) },
    currentPeriodEnd: row.current_period_end ?? null,
    bleedLengths: row.bleed_lengths ?? undefined,
  };
}

async function currentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Load cycle settings from the canonical table. Returns null when there is
 * nothing to load (unauthenticated, demo mode, or a brand-new user).
 *
 * Lazily migrates off the legacy user_app_data blob: if the table has no
 * row but the blob does, the blob's data is returned — the caller's next
 * saveCycleData() writes it into the table.
 */
export async function loadCycleData(): Promise<CycleData | null> {
  const userId = await currentUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from('cycle_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[cycleDataStore] table load failed:', error.message);
    return null;
  }
  if (data) return rowToCycleData(data as CycleDataRow);

  // No table row — attempt one-time migration from the legacy blob.
  const legacy = await loadFromSupabase<CycleData>('cycle_data');
  if (legacy && legacy.lastPeriodStart) {
    return {
      ...legacy,
      history: legacy.history ?? [],
      dailyPeriodData: legacy.dailyPeriodData ?? [],
      customSettings: { ...defaultCustomSettings, ...(legacy.customSettings ?? {}) },
    };
  }
  return null;
}

/** Upsert cycle settings into the canonical table. Fire-and-forget; errors logged. */
export async function saveCycleData(data: CycleData): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;

  const basePayload = {
    user_id: userId,
    last_period_start: data.lastPeriodStart,
    cycle_length: data.cycleLength,
    period_length: data.periodLength,
    history: data.history ?? [],
    daily_period_data: data.dailyPeriodData ?? [],
    custom_settings: data.customSettings,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('cycle_data')
    .upsert(
      {
        ...basePayload,
        current_period_end: data.currentPeriodEnd ?? null,
        bleed_lengths: data.bleedLengths ?? null,
      },
      { onConflict: 'user_id' },
    );

  if (!error) return;

  // Schema not migrated yet (migration 20260902100000) — save what the
  // table can hold rather than losing the whole write.
  const { error: retryError } = await supabase
    .from('cycle_data')
    .upsert(basePayload, { onConflict: 'user_id' });
  if (retryError) console.warn('[cycleDataStore] table save failed:', retryError.message);
  else console.warn('[cycleDataStore] saved without period-end fields (run migration 20260902100000):', error.message);
}
