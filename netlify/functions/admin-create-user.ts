// netlify/functions/admin-create-user.ts
//
// Admin adds a new member (Sam 2026-09-30: manual onboarding of e.g.
// legacy programme buyers). One call:
//   1. Supabase invite — creates the account AND sends the invite email
//      (user clicks it, lands on /reset-password, sets their password).
//   2. Optional single-program grant (program_purchases) so the invite
//      lands with the right access already in place.
//
// Body: { email: string, name?: string, programId?: string }

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
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const VALID_PROGRAMS = ['postpartum', 'bodyforming', 'elastic-bands', 'strong-sexy'];
const APP_ORIGIN = 'https://app.neome.com.au';

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  const auth = await requireAdmin(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return { statusCode: auth.status, headers: CORS, body: JSON.stringify({ error: auth.error }) };

  let email = '';
  let name = '';
  let programId = '';
  try {
    const body = JSON.parse(event.body || '{}');
    email = String(body.email ?? '').trim().toLowerCase();
    name = String(body.name ?? '').trim();
    programId = String(body.programId ?? '').trim();
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Neplatný e-mail' }) };
  }
  if (programId && !VALID_PROGRAMS.includes(programId)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Neznámy program' }) };
  }

  // Invite = create + send the set-your-password email in one step.
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${APP_ORIGIN}/reset-password`,
    data: name ? { name } : undefined,
  });
  if (error) {
    const already = /already|exists|registered/i.test(error.message);
    return {
      statusCode: already ? 409 : 500,
      headers: CORS,
      body: JSON.stringify({ error: already ? 'Používateľka s týmto e-mailom už existuje.' : error.message }),
    };
  }
  const userId = data.user?.id;

  let granted = false;
  if (userId && programId) {
    const { error: grantErr } = await supabase.from('program_purchases').upsert(
      { user_id: userId, program_id: programId, granted_by: auth.email ?? auth.userId, note: 'admin create-user' },
      { onConflict: 'user_id,program_id' },
    );
    granted = !grantErr;
    if (grantErr) console.warn('[admin-create-user] grant failed:', grantErr.message);
  }

  await auditLog(supabase, {
    actor: { userId: auth.userId, email: auth.email },
    action: 'user_invited',
    targetUserId: userId ?? null,
    detail: { email, programId: programId || null, granted },
  }).catch(() => {});

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({ ok: true, userId, invited: true, granted }),
  };
}
