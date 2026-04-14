/**
 * Ongoing Supabase sync for app data.
 *
 * Stores arbitrary JSON blobs in `user_app_data` keyed by (user_id, data_key).
 * Falls back silently to localStorage-only mode when Supabase is not configured
 * or the user is not logged in.
 *
 * Usage:
 *   await syncToSupabase('cycle_data', cycleData);
 *   const data = await loadFromSupabase('cycle_data');
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

/** Fire-and-forget upsert. Errors are logged but never thrown. */
export async function syncToSupabase(dataKey: string, data: unknown): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_app_data')
      .upsert(
        { user_id: user.id, data_key: dataKey, data, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,data_key' }
      );

    if (error) {
      console.warn(`[sync] Failed to sync ${dataKey}:`, error.message);
    }
  } catch (err) {
    console.warn(`[sync] Unexpected error syncing ${dataKey}:`, err);
  }
}

/**
 * Load a data blob from Supabase.
 * Returns null if not configured, user not logged in, or no row found.
 */
export async function loadFromSupabase<T>(dataKey: string): Promise<T | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_app_data')
      .select('data')
      .eq('user_id', user.id)
      .eq('data_key', dataKey)
      .maybeSingle();

    if (error) {
      console.warn(`[sync] Failed to load ${dataKey}:`, error.message);
      return null;
    }

    return (data?.data as T) ?? null;
  } catch (err) {
    console.warn(`[sync] Unexpected error loading ${dataKey}:`, err);
    return null;
  }
}
