/**
 * Thin bridge — delegates everything to SupabaseAuthContext.
 *
 * Legacy callers import `useAuthContext()` from here.
 * New code should import `useSupabaseAuth()` from SupabaseAuthContext directly.
 * Both return the same data from the same provider.
 */
import { useSupabaseAuth } from './SupabaseAuthContext';

export function useAuthContext() {
  return useSupabaseAuth();
}
