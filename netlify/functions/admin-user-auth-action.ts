// netlify/functions/admin-user-auth-action.ts
//
// Generates a one-time auth action link for a user — used by the admin
// Users tab when a user can't log in and needs help.
//
// Body: { userId: string, type: 'recovery' | 'magiclink', redirectTo?: string }
// Returns: { actionLink: string, email: string }
//
// The link is a single-use signed URL that lands on the app's auth
// callback. Admin copies it and sends via Slack/email/SMS — bypasses
// our flaky transactional email pipeline entirely.
//
// Auth: caller must be authenticated AND have profiles.role = 'admin'.

import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './_adminAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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

    // Look up the target user's email
    const { data: targetUser, error: lookupErr } = await supabase.auth.admin.getUserById(userId);
    if (lookupErr || !targetUser?.user?.email) {
      return jsonResponse({ error: 'User not found' }, 404);
    }
    const email = targetUser.user.email;

    // Generate the action link
    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type,
      email,
      options: redirectTo ? { redirectTo } : undefined,
    });
    if (linkErr || !linkData?.properties?.action_link) {
      return jsonResponse({ error: linkErr?.message || 'Could not generate link' }, 500);
    }

    return jsonResponse({
      actionLink: linkData.properties.action_link,
      email,
      type,
    });
  } catch (err: any) {
    console.error('admin-user-auth-action error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
