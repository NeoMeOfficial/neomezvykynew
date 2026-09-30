/**
 * useProgramAccess — who may start/play which program (Sam 2026-09-30).
 *
 *   • Subscribers (isPremium) → every program.
 *   • program_purchases rows → exactly those programs, nothing else in
 *     the app (the user stays free-tier everywhere outside them).
 *
 * Grants are managed in the admin Users tab (program_purchases table,
 * RLS: user reads own rows).
 */
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useProgramAccess() {
  const { isPremium } = useSubscription();
  const { user } = useSupabaseAuth();
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id || !UUID_RE.test(user.id)) {
      setPurchased(new Set());
      setLoading(false);
      return;
    }
    supabase
      .from('program_purchases')
      .select('program_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!cancelled) {
          setPurchased(new Set(((data ?? []) as { program_id: string }[]).map((r) => r.program_id)));
          setLoading(false);
        }
      }, () => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id]);

  const hasProgram = (slug: string | null | undefined): boolean =>
    isPremium || (!!slug && purchased.has(slug));

  return { hasAllPrograms: isPremium, purchased, hasProgram, loading };
}
