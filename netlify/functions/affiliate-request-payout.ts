// netlify/functions/affiliate-request-payout.ts
//
// Bundles every matured, unclaimed earning into one payout request that
// Gabi processes manually (admin → Affiliates). The 30-day maturity on
// each earning is the refund window; the amount is computed here from
// the ledger, never taken from the client.

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

const MIN_PAYOUT_CENTS = 1000; // 10 €

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  let paymentDetail: string;
  try {
    paymentDetail = String(JSON.parse(event.body || '{}').paymentDetail ?? '').trim().slice(0, 300);
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  if (!paymentDetail) return json(400, { error: 'Chýba IBAN / platobný údaj.' });

  const supabase = serviceClient();

  const { data: me } = await supabase
    .from('affiliates')
    .select('status')
    .eq('user_id', auth.userId)
    .maybeSingle();
  if (!me || me.status !== 'active') return json(403, { error: 'Účet nie je aktívny partner.' });

  const { data: open } = await supabase
    .from('affiliate_payouts')
    .select('id')
    .eq('affiliate_user_id', auth.userId)
    .eq('status', 'requested')
    .limit(1);
  if (open && open.length > 0) {
    return json(409, { error: 'Už máš jednu žiadosť v spracovaní — počkaj, kým ju vybavíme.' });
  }

  const { data: matured } = await supabase
    .from('affiliate_earnings')
    .select('id, amount_cents')
    .eq('affiliate_user_id', auth.userId)
    .eq('status', 'accrued')
    .is('payout_id', null)
    .lte('available_at', new Date().toISOString());

  const total = (matured ?? []).reduce((s, e) => s + e.amount_cents, 0);
  if (total < MIN_PAYOUT_CENTS) {
    return json(400, { error: `Minimálna suma na vyplatenie je 10 €. Dostupné: ${(total / 100).toFixed(2)} €.` });
  }

  const { data: payout, error: insertErr } = await supabase
    .from('affiliate_payouts')
    .insert({
      affiliate_user_id: auth.userId,
      amount_cents: total,
      payment_detail: paymentDetail,
    })
    .select('id')
    .single();
  if (insertErr || !payout) {
    console.error('affiliate-request-payout insert failed:', insertErr);
    return json(500, { error: 'Žiadosť sa nepodarilo vytvoriť.' });
  }

  const ids = (matured ?? []).map((e) => e.id);
  const { error: stampErr } = await supabase
    .from('affiliate_earnings')
    .update({ payout_id: payout.id })
    .in('id', ids)
    .is('payout_id', null);
  if (stampErr) {
    // Roll the request back rather than leave a payout covering nothing.
    await supabase.from('affiliate_payouts').delete().eq('id', payout.id);
    console.error('affiliate-request-payout stamp failed:', stampErr);
    return json(500, { error: 'Žiadosť sa nepodarilo vytvoriť.' });
  }

  return json(200, { ok: true, amount_cents: total });
}
