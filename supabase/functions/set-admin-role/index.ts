/**
 * set-admin-role
 * ──────────────
 * Edge Function called from the client on session change. If the calling user's
 * email is in the bootstrap allow-list AND they don't already have
 * `app_metadata.role = 'admin'`, set it.
 *
 * Idempotent: callers can fire-and-forget on every session refresh.
 *
 * Returns:
 *   { isAdmin: true,  alreadySet: true }   — was already admin
 *   { isAdmin: true,  justSet: true }      — bootstrap email; we just set role
 *   { isAdmin: false }                      — not in bootstrap list and no role
 *
 * The client should refresh its session whenever `justSet: true` so the new
 * JWT (with the role claim) is picked up by RLS on subsequent queries.
 *
 * Security note: this function uses the service-role key to update auth records.
 * It validates the caller's identity via the Authorization header (forwarded JWT)
 * and only sets the role if the JWT's verified email is in ADMIN_BOOTSTRAP_EMAILS.
 *
 * KEEP IN SYNC: src/config/admin-emails.ts mirrors this list. The two should
 * always match. If they drift, the Edge Function (server-side, this file) wins.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_BOOTSTRAP_EMAILS: ReadonlyArray<string> = [
  'samuelgrecner@gmail.com',
  'gabi@neome.com.au',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'Missing Authorization header' }, 401);
    }

    // Identify the caller via their JWT (anon key + forwarded auth header)
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
    if (!user.email) {
      return jsonResponse({ isAdmin: false });
    }

    const email = user.email.toLowerCase();
    const isBootstrap = ADMIN_BOOTSTRAP_EMAILS.includes(email);
    const currentRole = (user.app_metadata as Record<string, unknown> | null)?.role;

    // Already admin → no-op
    if (currentRole === 'admin') {
      return jsonResponse({ isAdmin: true, alreadySet: true });
    }

    // Not bootstrap and no role → not admin
    if (!isBootstrap) {
      return jsonResponse({ isAdmin: false });
    }

    // Bootstrap email without role → set it
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error: updateErr } = await adminClient.auth.admin.updateUserById(user.id, {
      app_metadata: { ...(user.app_metadata || {}), role: 'admin' },
    });
    if (updateErr) {
      console.error('updateUserById failed', updateErr);
      return jsonResponse({ error: updateErr.message }, 500);
    }

    return jsonResponse({ isAdmin: true, justSet: true });
  } catch (err) {
    console.error('set-admin-role error', err);
    return jsonResponse({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
