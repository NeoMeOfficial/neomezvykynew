// netlify/functions/admin-user-auth-action.ts
//
// Triggers Supabase to *send* an auth email to the user — used by the
// admin Users tab when a user can't log in and needs a re-send.
//
// Body: { userId: string, type: 'recovery' | 'magiclink', redirectTo?: string }
// Returns: { sent: true, email: string, type }
//
// Uses the regular Supabase auth methods (not the admin generateLink
// API) so the email actually goes through the configured SMTP
// (Resend) using your branded email templates:
//   • type 'recovery'  → resetPasswordForEmail → "Reset Password" template
//   • type 'magiclink' → signInWithOtp        → "Magic Link" template
//
// Auth: caller must be authenticated AND have profiles.role = 'admin'
//       OR app_metadata.role = 'admin' (see _adminAuth.ts).

import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './_adminAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Service-role client for the admin look-up of the target user's email.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Anon-key client to call the regular auth methods. The regular methods
// (signInWithOtp, resetPasswordForEmail) trigger the email send via
// the configured SMTP — service-role calls bypass the email flow.
function anonClient() {
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!anonKey) throw new Error('SUPABASE_ANON_KEY not configured in Netlify env');
  return createClient(process.env.SUPABASE_URL!, anonKey);
}

function jsonResponse(body: unknown, status = 200) {
  return { statusCode: status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    // ── Admin auth ────────────────────────────────────────────────
    const auth = await requireAdmin(event.headers.authorization || event.headers.Authorization);
    if (!auth.ok) return jsonResponse({ error: auth.error }, auth.status);

    // ── Inputs ────────────────────────────────────────────────────
    const { userId, type, redirectTo } = JSON.parse(event.body || '{}') as {
      userId?: string;
      type?: 'recovery' | 'magiclink';
      redirectTo?: string;
    };
    if (!userId) return jsonResponse({ error: 'userId required' }, 400);
    if (type !== 'recovery' && type !== 'magiclink') {
      return jsonResponse({ error: 'type must be "recovery" or "magiclink"' }, 400);
    }

    // Look up the target user's email (admin client, no email triggered yet)
    const { data: targetUser, error: lookupErr } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (lookupErr || !targetUser?.user?.email) {
      return jsonResponse({ error: 'User not found' }, 404);
    }
    const email = targetUser.user.email;

    // ── Trigger the email send via the regular auth methods ───────
    const anon = anonClient();

    if (type === 'recovery') {
      const { error } = await anon.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) return jsonResponse({ error: `Reset email failed: ${error.message}` }, 502);
    } else {
      // magiclink — shouldCreateUser:false because the user already
      // exists; we don't want this admin tool to accidentally create
      // a fresh account for a typo'd email.
      const { error } = await anon.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectTo,
        },
      });
      if (error) return jsonResponse({ error: `Magic-link email failed: ${error.message}` }, 502);
    }

    return jsonResponse({ sent: true, email, type });
  } catch (err: any) {
    console.error('admin-user-auth-action error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
