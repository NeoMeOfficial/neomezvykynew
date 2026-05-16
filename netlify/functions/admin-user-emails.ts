// netlify/functions/admin-user-emails.ts
//
// Returns recent transactional emails (from Resend) sent to a specific
// user's email address. Used by the admin Users tab to answer
// "did the confirmation email actually send?" without leaving the app.
//
// Body: { userId: string }
// Returns: { emails: [{ id, to, from, subject, created_at, last_event }] }
//
// Auth: caller must be authenticated AND have profiles.role = 'admin'.
// Requires RESEND_API_KEY in Netlify env (read-only key is fine).

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

interface ResendEmail {
  id: string;
  from: string;
  to: string[] | string;
  subject?: string;
  created_at: string;
  last_event?: string;
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    // Admin auth
    const auth = await requireAdmin(event.headers.authorization || event.headers.Authorization);
    if (!auth.ok) return jsonResponse({ error: auth.error }, auth.status);

    const { userId } = JSON.parse(event.body || '{}') as { userId?: string };
    if (!userId) return jsonResponse({ error: 'userId required' }, 400);

    // Look up target user's email
    const { data: targetUser, error: lookupErr } = await supabase.auth.admin.getUserById(userId);
    if (lookupErr || !targetUser?.user?.email) {
      return jsonResponse({ error: 'User not found' }, 404);
    }
    const targetEmail = targetUser.user.email.toLowerCase();

    // Pull recent sends from Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return jsonResponse({ error: 'RESEND_API_KEY not configured in Netlify env' }, 500);
    }

    const resendRes = await fetch('https://api.resend.com/emails?limit=100', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!resendRes.ok) {
      const text = await resendRes.text();
      return jsonResponse({ error: `Resend API ${resendRes.status}: ${text}` }, 502);
    }
    const body = await resendRes.json() as { data?: ResendEmail[] };
    const all = body.data ?? [];

    // Filter to this user's email — `to` can be string or array.
    const emails = all
      .filter((e) => {
        const tos = Array.isArray(e.to) ? e.to : [e.to];
        return tos.some((t) => (t || '').toLowerCase() === targetEmail);
      })
      .map((e) => ({
        id: e.id,
        to: Array.isArray(e.to) ? e.to.join(', ') : e.to,
        from: e.from,
        subject: e.subject || '(no subject)',
        created_at: e.created_at,
        last_event: e.last_event || 'unknown',
      }));

    return jsonResponse({ emails, target: targetEmail });
  } catch (err: any) {
    console.error('admin-user-emails error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
