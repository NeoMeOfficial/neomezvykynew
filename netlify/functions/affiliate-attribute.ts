// netlify/functions/affiliate-attribute.ts
//
// Binds a freshly signed-up user to the affiliate whose code/link
// brought them in. Called by the client on the user's first session
// (the code survives the email-confirmation round-trip in
// localStorage). First attribution wins; only recent signups qualify,
// so an old account can't be claimed by opening someone's link.

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

const SIGNUP_WINDOW_DAYS = 7;

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
  if (!code || code.length > 40) return json(400, { error: 'Invalid code' });

  const supabase = serviceClient();

  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('user_id, code, status')
    .ilike('code', code)
    .maybeSingle();
  // Unknown/disabled code: report "done" so the client clears its stash —
  // there is nothing to retry.
  if (!affiliate || affiliate.status !== 'active') return json(200, { attributed: false, reason: 'unknown_code' });
  if (affiliate.user_id === auth.userId) return json(200, { attributed: false, reason: 'self' });

  const { data: userRow, error: userErr } = await supabase.auth.admin.getUserById(auth.userId);
  if (userErr || !userRow?.user) return json(500, { error: 'User lookup failed' });
  const createdAt = new Date(userRow.user.created_at).getTime();
  if (Date.now() - createdAt > SIGNUP_WINDOW_DAYS * 24 * 3600 * 1000) {
    return json(200, { attributed: false, reason: 'not_new' });
  }

  const { error } = await supabase.from('affiliate_referrals').insert({
    affiliate_user_id: affiliate.user_id,
    referred_user_id: auth.userId,
    code_used: affiliate.code,
  });
  if (error) {
    // unique(referred_user_id) → already attributed; first wins.
    if ((error as any).code === '23505') return json(200, { attributed: false, reason: 'already_attributed' });
    console.error('affiliate-attribute insert failed:', error);
    return json(500, { error: 'Insert failed' });
  }

  return json(200, { attributed: true });
}
