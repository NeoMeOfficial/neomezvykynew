import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

/**
 * Affiliate status of the signed-in user ('active' | 'candidate' |
 * 'disabled' | null). RLS only exposes the user's own row. Profil
 * shows the partner dashboard entry only for 'active'; everyone else
 * gets the refer-a-friend entry instead.
 */
export function useAffiliateStatus(): string | null {
  const { user } = useSupabaseAuth();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) { setStatus(null); return; }
    (async () => {
      const { data } = await supabase
        .from('affiliates')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!cancelled) setStatus(data?.status ?? null);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  return status;
}

export function useIsAffiliate(): boolean {
  return useAffiliateStatus() === 'active';
}
