// netlify/functions/_adminAuth.ts
//
// Shared admin-auth check for every admin-* netlify function.
//
// Accepts either source of admin role:
//   1. JWT app_metadata.role = 'admin'  (fast — no DB query)
//   2. profiles.role = 'admin'          (canonical — works the moment
//                                        you flip a user via the admin
//                                        chip, no re-login needed)
//
// Mirrors the RequireAdmin guard in src/AppV2.tsx so a user the SPA
// considers admin is also accepted by every server function.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;
function client() {
  if (!cached) {
    cached = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return cached;
}

export type AdminAuthResult =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; status: 401 | 403; error: string };

export async function requireAdmin(authHeader: string | undefined): Promise<AdminAuthResult> {
  if (!authHeader) return { ok: false, status: 401, error: 'Unauthorized' };

  const supabase = client();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', ''),
  );
  if (authErr || !user) return { ok: false, status: 401, error: 'Unauthorized' };

  // Fast path: JWT already has the admin claim.
  const jwtRole = (user.app_metadata as Record<string, unknown> | null)?.role;
  if (jwtRole === 'admin') {
    return { ok: true, userId: user.id, email: user.email ?? null };
  }

  // Slow path: query profiles.role.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role === 'admin') {
    return { ok: true, userId: user.id, email: user.email ?? null };
  }

  return { ok: false, status: 403, error: 'Forbidden' };
}
