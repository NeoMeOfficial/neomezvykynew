// netlify/functions/affiliate-claim-code.ts
//
// An affiliate (row pre-created by admin grant) picks their public code.
// Uniqueness is case-insensitive; the DB index is the final referee.

import { requireUser, serviceClient } from './_userAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: CORS,
  body: JSON.stringify(body),
});

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  let code: string;
  try {
    code = String(JSON.parse(event.body || '{}').code ?? '').trim();
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{2,19}$/.test(code)) {
    return json(400, { error: 'Kód musí mať 3–20 znakov: písmená, číslice, pomlčka.' });
  }

  const supabase = serviceClient();

  const { data: me } = await supabase
    .from('affiliates')
    .select('user_id, status')
    .eq('user_id', auth.userId)
    .maybeSingle();
  if (!me) return json(403, { error: 'Účet nie je zaradený do partnerského programu.' });
  if (me.status !== 'active') return json(403, { error: 'Partnerský účet je pozastavený.' });

  const { data: taken } = await supabase
    .from('affiliates')
    .select('user_id')
    .ilike('code', code)
    .neq('user_id', auth.userId)
    .limit(1);
  if (taken && taken.length > 0) {
    return json(409, { error: 'Tento kód už používa niekto iný. Vyber si iný.' });
  }

  const { error } = await supabase
    .from('affiliates')
    .update({ code })
    .eq('user_id', auth.userId);
  if (error) {
    // 23505 = unique index lost the race to a concurrent claim.
    if ((error as any).code === '23505') {
      return json(409, { error: 'Tento kód už používa niekto iný. Vyber si iný.' });
    }
    console.error('affiliate-claim-code update failed:', error);
    return json(500, { error: 'Uloženie zlyhalo.' });
  }

  return json(200, { ok: true, code });
}
