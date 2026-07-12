// netlify/functions/_auditLog.ts
//
// Minimal audit trail for admin actions: WHO did WHAT to WHOM.
// Writes to admin_audit_log (migration 20260712120000). Fire-and-forget:
// a logging failure must never block the admin action itself, so errors
// are logged to the function console only.

import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuditActor {
  userId: string;
  email: string | null;
}

export async function auditLog(
  serviceClient: SupabaseClient,
  entry: {
    actor: AuditActor;
    action: string;                    // e.g. 'user_deleted', 'role_changed'
    targetUserId?: string | null;
    detail?: Record<string, unknown>;  // small JSON payload (old/new values)
  },
): Promise<void> {
  try {
    const { error } = await serviceClient.from('admin_audit_log').insert({
      actor_id: entry.actor.userId,
      actor_email: entry.actor.email,
      action: entry.action,
      target_user_id: entry.targetUserId ?? null,
      detail: entry.detail ?? {},
    });
    if (error) console.warn('[audit] failed to record', entry.action, error.message);
  } catch (err) {
    console.warn('[audit] unexpected error', err);
  }
}
