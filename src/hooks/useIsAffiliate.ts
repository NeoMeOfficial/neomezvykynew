import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

/**
 * True when the signed-in user has an affiliates row (admin-granted).
 * RLS only ever exposes the user's own row, so this is a cheap probe —
 * used to decide whether Profil shows the Partnerský program entry.
 */
export function useIsAffiliate(): boolean {
  const { user } = useSupabaseAuth();
  const [isAffiliate, setIsAffiliate] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) { setIsAffiliate(false); return; }
    (async () => {
      const { data } = await supabase
        .from('affiliates')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!cancelled) setIsAffiliate(!!data);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  return isAffiliate;
}
