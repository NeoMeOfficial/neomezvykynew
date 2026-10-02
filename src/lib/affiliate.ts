// Affiliate attribution, client side. The code arrives via ?ref=KOD on
// any URL (or typed into the register form), waits out the
// email-confirmation round-trip in localStorage, and is sent to the
// server exactly once the user has a session. The server does all the
// validating (code exists, account is fresh, first attribution wins).

import { supabase } from './supabase';

export const AFFILIATE_REF_KEY = 'neome_affiliate_ref';

export function captureAffiliateRef() {
  try {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && /^[a-zA-Z0-9-]{3,40}$/.test(ref)) {
      localStorage.setItem(AFFILIATE_REF_KEY, ref);
    }
  } catch { /* ignore */ }
}

export async function flushAffiliateAttribution() {
  let code: string | null = null;
  try {
    code = localStorage.getItem(AFFILIATE_REF_KEY);
  } catch { /* ignore */ }
  if (!code) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    const res = await fetch('/.netlify/functions/affiliate-attribute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ code }),
    });
    // Any definitive answer (attributed, unknown code, already bound,
    // not a fresh account) ends the retry loop; only network/5xx keeps
    // the stash for the next session.
    if (res.ok || (res.status >= 400 && res.status < 500)) {
      localStorage.removeItem(AFFILIATE_REF_KEY);
    }
  } catch { /* network — retry on next session */ }
}
