// netlify/functions/admin-set-program-access.ts
//
// Grant or revoke single-program access (program_purchases) for a user —
// the "selected basis" model (Sam 2026-09-30): legacy programme buyers
// get exactly their programme, nothing else in the app. Subscribers
// don't need grants (subscription covers every program).

import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './_adminAuth';
import { auditLog } from './_auditLog';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const VALID_PROGRAMS = ['postpartum', 'bodyforming', 'elastic-bands', 'strong-sexy'];

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const auth = await requireAdmin(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) {
    return { statusCode: auth.status, headers: CORS, body: JSON.stringify({ error: auth.error }) };
  }

  // GET ?userId= — list the user's grants.
  if (event.httpMethod === 'GET') {
    const userId = event.queryStringParameters?.userId;
    if (!userId) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing userId' }) };
    const { data, error } = await supabase
      .from('program_purchases')
      .select('program_id, granted_at, note')
      .eq('user_id', userId);
    if (error) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
    // Program status for the admin summary: the user's active enrollment
    // (one at a time; history of finished runs is not retained by design).
    const { data: active } = await supabase
      .from('user_active_programs')
      .select('program_id, start_date, activated_at')
      .eq('user_id', userId)
      .maybeSingle();
    const { data: history } = await supabase
      .from('user_program_history')
      .select('program_id, start_date, ended_at, status, weeks_reached')
      .eq('user_id', userId)
      .order('ended_at', { ascending: false })
      .limit(10);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ grants: data ?? [], active: active ?? null, history: history ?? [] }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { userId, programId, grant } = JSON.parse(event.body || '{}');
    if (!userId || !VALID_PROGRAMS.includes(programId) || typeof grant !== 'boolean') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Need userId, valid programId, grant:boolean' }) };
    }

    if (grant) {
      const { error } = await supabase.from('program_purchases').upsert(
        { user_id: userId, program_id: programId, granted_by: auth.email ?? auth.userId, note: 'admin grant' },
        { onConflict: 'user_id,program_id' },
      );
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from('program_purchases')
        .delete()
        .eq('user_id', userId)
        .eq('program_id', programId);
      if (error) throw new Error(error.message);
    }

    await auditLog(supabase, {
      actor: { userId: auth.userId, email: auth.email },
      action: grant ? 'program_access_granted' : 'program_access_revoked',
      targetUserId: userId,
      detail: { programId },
    }).catch(() => {});

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  } catch (err: any) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message ?? 'failed' }) };
  }
}
