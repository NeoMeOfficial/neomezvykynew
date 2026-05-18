import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import {
  CONSENT_POLICY_VERSION,
  ConsentType,
  CurrentConsent,
} from '../lib/consents';

/**
 * GDPR consents hook.
 *
 * Reads the current_consents view (latest state per consent_type)
 * and exposes grant/withdraw via the record_consent() RPC. Direct
 * INSERT on consent_events is blocked by RLS — the SECURITY DEFINER
 * RPC is the only insertion path.
 *
 * `isGranted(type)` returns true ONLY when:
 *   - a consent row exists for this user + type
 *   - the row's granted = true
 *   - the row's policy_version matches the current one
 *
 * That means a policy bump automatically re-prompts the user.
 */
export function useConsents() {
  const { user } = useSupabaseAuth();
  const [consents, setConsents] = useState<Record<string, CurrentConsent | undefined>>({});
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setConsents({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('current_consents')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      console.warn('[consents] reload failed:', error.message);
      setConsents({});
    } else {
      const map: Record<string, CurrentConsent> = {};
      (data ?? []).forEach((row) => {
        map[row.consent_type] = row as CurrentConsent;
      });
      setConsents(map);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  /**
   * True iff the user has granted this consent under the CURRENT policy
   * version. A withdrawn consent or a stale policy version returns false.
   */
  const isGranted = useCallback(
    (type: ConsentType): boolean => {
      const row = consents[type];
      return !!row && row.granted === true && row.policy_version === CONSENT_POLICY_VERSION;
    },
    [consents]
  );

  /**
   * True iff the user has ever made an explicit choice about this consent
   * (grant or withdraw) under the current policy version. Use this to
   * decide whether to show the consent prompt at all.
   */
  const hasDecision = useCallback(
    (type: ConsentType): boolean => {
      const row = consents[type];
      return !!row && row.policy_version === CONSENT_POLICY_VERSION;
    },
    [consents]
  );

  const grant = useCallback(
    async (type: ConsentType, source: 'app' | 'signup' | 'settings' = 'settings') => {
      return record(type, true, source);
    },
    []
  );

  const withdraw = useCallback(
    async (type: ConsentType, source: 'app' | 'signup' | 'settings' = 'settings') => {
      return record(type, false, source);
    },
    []
  );

  const record = async (
    type: ConsentType,
    granted: boolean,
    source: 'app' | 'signup' | 'settings'
  ) => {
    if (!isSupabaseConfigured()) {
      // Demo mode: keep an in-memory record so the UI flow still works
      setConsents((prev) => ({
        ...prev,
        [type]: {
          user_id: user?.id ?? 'demo',
          consent_type: type,
          granted,
          policy_version: CONSENT_POLICY_VERSION,
          source,
          effective_at: new Date().toISOString(),
        },
      }));
      return { error: null };
    }
    const { error } = await supabase.rpc('record_consent', {
      p_consent_type: type,
      p_granted: granted,
      p_policy_version: CONSENT_POLICY_VERSION,
      p_source: source,
      p_user_agent:
        typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 500) : null,
    });
    if (error) {
      console.warn('[consents] record_consent failed:', error.message);
    } else {
      await reload();
    }
    return { error };
  };

  return {
    loading,
    consents,
    isGranted,
    hasDecision,
    grant,
    withdraw,
    reload,
    policyVersion: CONSENT_POLICY_VERSION,
  };
}
