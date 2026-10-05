// netlify/functions/referral-code.ts
//
// Every user can refer (Sam 2026-10-05). First call auto-creates a
// 'candidate' affiliates row with a generated code — NAME-XXXX, unique
// by construction, so the vanity namespace stays reserved for approved
// affiliates (who pick their own code on /partner). Also returns the
// funnel progress: paying referrals count toward the 5 needed for
// partner approval.

import { requireUser, serviceClient } from './_userAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: CORS,
  body: JSON.stringify(body),
});

const SUFFIX_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O/1/I/L

function asciiName(raw: string | null | undefined): string {
  const base = (raw ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 8);
  return base.length >= 2 ? base : 'NEOME';
}

function randomSuffix(len = 4): string {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += SUFFIX_ALPHABET[Math.floor(Math.random() * SUFFIX_ALPHABET.length)];
  }
  return out;
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const supabase = serviceClient();

  let { data: me } = await supabase
    .from('affiliates')
    .select('code, status, commission_pct')
    .eq('user_id', auth.userId)
    .maybeSingle();

  if (!me) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, full_name')
      .eq('id', auth.userId)
      .maybeSingle();
    const name = asciiName((profile as any)?.first_name ?? (profile as any)?.full_name);

    for (let attempt = 0; attempt < 5 && !me; attempt++) {
      const code = `${name}-${randomSuffix()}`;
      const { data: created, error } = await supabase
        .from('affiliates')
        .insert({ user_id: auth.userId, status: 'candidate', code })
        .select('code, status, commission_pct')
        .single();
      if (!error && created) {
        me = created;
        break;
      }
      // 23505 on the code index → regenerate; on user_id PK → someone
      // raced us, re-read.
      if ((error as any)?.code === '23505') {
        const { data: existing } = await supabase
          .from('affiliates')
          .select('code, status, commission_pct')
          .eq('user_id', auth.userId)
          .maybeSingle();
        if (existing) { me = existing; break; }
        continue;
      }
      console.error('referral-code insert failed:', error);
      return json(500, { error: 'Could not create referral code' });
    }
    if (!me) return json(500, { error: 'Could not create referral code' });
  }

  const [{ count: referralCount }, { count: payingCount }] = await Promise.all([
    supabase
      .from('affiliate_referrals')
      .select('id', { count: 'exact', head: true })
      .eq('affiliate_user_id', auth.userId),
    supabase
      .from('points_ledger')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', auth.userId)
      .eq('event_type', 'referral_paid'),
  ]);

  return json(200, {
    code: me.code,
    status: me.status,
    referrals: referralCount ?? 0,
    paying: payingCount ?? 0,
    needed_for_partner: 5,
  });
}
