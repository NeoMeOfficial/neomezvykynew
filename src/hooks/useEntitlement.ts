/**
 * useEntitlement — React hook over the Entitlement module.
 *
 * Returns whether this specific (contentType, contentId) pair is allowed
 * for the current user, plus a logView() callback to invoke when the
 * consumption event fires.
 *
 * Premium / demo users short-circuit: always allowed, logView is a no-op,
 * no Supabase round-trip.
 *
 * Consumption-event timing is per-component (caller decides):
 *   - Recipes: call logView() on detail-page mount.
 *   - Exercises / meditations / stretches: call logView() after 10s of
 *     accumulated play. The hook itself does not own play tracking.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import {
  type EntitledContent,
  type EntitlementResult,
  evaluateEntitlement,
  windowStart,
} from '../lib/entitlement';

interface UseEntitlementReturn extends EntitlementResult {
  loading: boolean;
  /** Record a view of this contentId. Idempotent within the window — re-viewing already-logged content is a no-op write but still resolves. */
  logView: () => Promise<void>;
  /** Show paywall (delegates to SubscriptionContext.gate). */
  gate: () => void;
}

const UNLIMITED: EntitlementResult = { allowed: true, remaining: Number.POSITIVE_INFINITY, alreadyViewed: false };

export function useEntitlement(
  contentType: EntitledContent,
  contentId: string | undefined,
): UseEntitlementReturn {
  const { user } = useSupabaseAuth();
  const { isPremium, gate } = useSubscription();
  const [result, setResult] = useState<EntitlementResult>(UNLIMITED);
  const [loading, setLoading] = useState(true);
  const loggedRef = useRef(false);

  // Premium / demo / no auth / no Supabase / missing contentId → unconditionally allowed.
  const shortCircuit = isPremium || !user || !isSupabaseConfigured() || !contentId;

  useEffect(() => {
    if (shortCircuit) {
      setResult(UNLIMITED);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const cutoff = windowStart(contentType);
    supabase
      .from('content_views')
      .select('content_id, viewed_at')
      .eq('user_id', user!.id)
      .eq('content_type', contentType)
      .gt('viewed_at', cutoff)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          // Fail-open: don't punish the user for our query failure.
          console.warn('[entitlement] window query failed:', error.message);
          setResult(UNLIMITED);
        } else {
          setResult(evaluateEntitlement(contentType, contentId!, data ?? []));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [shortCircuit, contentType, contentId, user]);

  const logView = useCallback(async () => {
    if (shortCircuit) return;
    if (loggedRef.current) return; // idempotent within a session
    if (!result.allowed) return;   // refuse to log if not allowed
    loggedRef.current = true;
    const { error } = await supabase.from('content_views').insert({
      user_id: user!.id,
      content_type: contentType,
      content_id: contentId!,
    });
    if (error) {
      console.warn('[entitlement] logView insert failed:', error.message);
      loggedRef.current = false; // allow retry
    }
  }, [shortCircuit, result.allowed, user, contentType, contentId]);

  return {
    ...result,
    loading,
    logView,
    gate,
  };
}
