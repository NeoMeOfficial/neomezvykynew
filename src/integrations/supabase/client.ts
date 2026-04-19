/**
 * Legacy integration client — re-exports the single shared client from lib/supabase.
 *
 * 11 files import from this path. Rather than updating them all,
 * this file now delegates to the canonical client so there is only
 * one Supabase instance in the entire app.
 */
export { supabase } from '../../lib/supabase';
