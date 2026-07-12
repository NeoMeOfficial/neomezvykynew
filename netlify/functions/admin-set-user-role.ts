// netlify/functions/admin-set-user-role.ts
//
// Promotes / demotes a user to admin from the admin Users tab.
// Updates BOTH role locations so legacy code paths that still read
// JWT app_metadata don't fall out of sync. RequireAdmin is being
// migrated to read profiles.role directly — once that's done the
// app_metadata update here becomes belt-and-braces.
//
// Body: { userId: string, role: 'admin' | 'user' }
//
// Auth: caller must be authenticated AND have profiles.role = 'admin'.
// Self-demotion is blocked so you can't accidentally lock yourself out.

import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './_adminAuth';
import { auditLog } from './_auditLog';

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
    const auth = await requireAdmin(event.headers.authorization || event.headers.Authorization);
    if (!auth.ok) return jsonResponse({ error: auth.error }, auth.status);

    const { userId, role } = JSON.parse(event.body || '{}') as { userId?: string; role?: string };
    if (!userId) return jsonResponse({ error: 'userId required' }, 400);
    if (role !== 'admin' && role !== 'user') {
      return jsonResponse({ error: 'role must be "admin" or "user"' }, 400);
    }
    if (userId === auth.userId && role === 'user') {
      return jsonResponse({ error: 'Nemôžeš sa sám odobrať z admin role.' }, 400);
    }

    // 1) profiles.role — the canonical source going forward
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    if (profileErr) return jsonResponse({ error: profileErr.message }, 500);

    // 2) auth.users.app_metadata.role — kept in sync for any legacy
    //    code that still reads from the JWT. Cleared (key removed)
    //    when demoting; set when promoting.
    const { data: targetUser } = await supabase.auth.admin.getUserById(userId);
    const existingMeta = (targetUser?.user?.app_metadata ?? {}) as Record<string, unknown>;
    const nextMeta: Record<string, unknown> = { ...existingMeta };
    if (role === 'admin') nextMeta.role = 'admin';
    else delete nextMeta.role;

    const { error: authErr } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: nextMeta,
    });
    if (authErr) {
      // Non-fatal — the profiles update is the source of truth. Log.
      console.warn('admin-set-user-role: app_metadata update failed', authErr);
    }

    await auditLog(supabase, {
      actor: auth,
      action: 'role_changed',
      targetUserId: userId,
      detail: { role },
    });

    return jsonResponse({ ok: true, role });
  } catch (err: any) {
    console.error('admin-set-user-role error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
