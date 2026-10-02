// netlify/functions/admin-affiliates.ts
//
// Admin side of the affiliate program: grant/disable affiliates, set
// their commission, and process payout requests (Gabi pays manually,
// then marks the request paid here).

import { requireAdmin } from './_adminAuth';
import { serviceClient } from './_userAuth';
import { auditLog } from './_auditLog';
import { sendTransactionalEmail, renderBrandedEmail } from './_resend';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: CORS,
  body: JSON.stringify(body),
});

async function findUserIdByEmail(email: string): Promise<string | null> {
  const supabase = serviceClient();
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .ilike('email', email)
    .maybeSingle();
  if (data?.id) return data.id;
  // profiles.email can lag auth — page through auth as a fallback.
  for (let page = 1; page <= 5; page++) {
    const { data: list, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !list?.users?.length) break;
    const hit = list.users.find((u) => (u.email ?? '').toLowerCase() === email.toLowerCase());
    if (hit) return hit.id;
    if (list.users.length < 200) break;
  }
  return null;
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const auth = await requireAdmin(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const supabase = serviceClient();

  if (event.httpMethod === 'GET') {
    const [{ data: affiliates }, { data: earnings }, { data: payouts }] = await Promise.all([
      supabase.from('affiliates').select('user_id, code, commission_pct, status, created_at'),
      supabase.from('affiliate_earnings').select('affiliate_user_id, amount_cents, status, available_at, payout_id'),
      supabase.from('affiliate_payouts').select('*').order('requested_at', { ascending: false }).limit(50),
    ]);

    const { data: refCounts } = await supabase
      .from('affiliate_referrals')
      .select('affiliate_user_id');

    const now = Date.now();
    const rows = await Promise.all(
      (affiliates ?? []).map(async (a) => {
        const { data: u } = await supabase.auth.admin.getUserById(a.user_id);
        let pending = 0, available = 0, requested = 0, paid = 0;
        for (const e of earnings ?? []) {
          if (e.affiliate_user_id !== a.user_id || e.status === 'reversed') continue;
          if (e.status === 'paid') paid += e.amount_cents;
          else if (e.payout_id) requested += e.amount_cents;
          else if (new Date(e.available_at).getTime() > now) pending += e.amount_cents;
          else available += e.amount_cents;
        }
        return {
          user_id: a.user_id,
          email: u?.user?.email ?? null,
          code: a.code,
          commission_pct: Number(a.commission_pct),
          status: a.status,
          referral_count: (refCounts ?? []).filter((r) => r.affiliate_user_id === a.user_id).length,
          totals: { pending, available, requested, paid },
        };
      }),
    );

    return json(200, { affiliates: rows, payouts: payouts ?? [] });
  }

  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let body: any;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const act = String(body.action ?? '');

  if (act === 'grant') {
    const email = String(body.email ?? '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { error: 'Neplatný e-mail.' });
    const userId = await findUserIdByEmail(email);
    if (!userId) return json(404, { error: 'Používateľ s týmto e-mailom neexistuje — najprv ho pozvi cez Users.' });
    const { error } = await supabase
      .from('affiliates')
      .upsert({ user_id: userId, status: 'active' }, { onConflict: 'user_id' });
    if (error) return json(500, { error: error.message });
    await auditLog(supabase, { actor: { userId: auth.userId, email: auth.email }, action: 'affiliate_granted', detail: { email, userId } });

    // Tell the new partner — without this, nothing in their app hints
    // that the Partnerský program row exists. Best-effort: a failed
    // email must not undo the grant.
    try {
      await sendTransactionalEmail({
        to: email,
        subject: 'Vitaj v partnerskom programe NeoMe',
        html: renderBrandedEmail({
          preheader: 'Vyber si svoj kód a začni odporúčať.',
          headline: 'Vitaj v partnerskom programe',
          body: 'Zaradili sme ťa do partnerského programu NeoMe. V aplikácii si teraz vyberieš svoj osobný kód a dostaneš odkaz, ktorý môžeš zdieľať — z každej platby odporúčanej používateľky ti patrí provízia. Všetko (odporúčania, zárobky aj žiadosti o vyplatenie) sleduješ priamo v aplikácii v časti <b>Profil → Partnerský program</b>.',
          ctaLabel: 'Otvoriť partnerský program',
          ctaHref: 'https://app.neome.com.au/partner',
          footnote: 'Provízia sa uvoľňuje 30 dní po platbe; o vyplatenie požiadaš jedným klikom v aplikácii.',
        }),
      });
    } catch (err) {
      console.error('affiliate grant email failed:', err);
    }

    return json(200, { ok: true, userId });
  }

  if (act === 'set_rate') {
    const pct = Number(body.commission_pct);
    if (!body.userId || !Number.isFinite(pct) || pct < 0 || pct > 100) return json(400, { error: 'Bad input' });
    const { error } = await supabase.from('affiliates').update({ commission_pct: pct }).eq('user_id', body.userId);
    if (error) return json(500, { error: error.message });
    await auditLog(supabase, { actor: { userId: auth.userId, email: auth.email }, action: 'affiliate_rate_set', detail: { userId: body.userId, pct } });
    return json(200, { ok: true });
  }

  if (act === 'set_status') {
    const status = String(body.status ?? '');
    if (!body.userId || !['active', 'disabled'].includes(status)) return json(400, { error: 'Bad input' });
    const { error } = await supabase.from('affiliates').update({ status }).eq('user_id', body.userId);
    if (error) return json(500, { error: error.message });
    await auditLog(supabase, { actor: { userId: auth.userId, email: auth.email }, action: 'affiliate_status_set', detail: { userId: body.userId, status } });
    return json(200, { ok: true });
  }

  if (act === 'payout_paid' || act === 'payout_rejected') {
    const payoutId = String(body.payoutId ?? '');
    if (!payoutId) return json(400, { error: 'Bad input' });
    const { data: payout } = await supabase
      .from('affiliate_payouts')
      .select('id, status')
      .eq('id', payoutId)
      .maybeSingle();
    if (!payout) return json(404, { error: 'Payout not found' });
    if (payout.status !== 'requested') return json(409, { error: 'Žiadosť už je vybavená.' });

    if (act === 'payout_paid') {
      await supabase
        .from('affiliate_earnings')
        .update({ status: 'paid' })
        .eq('payout_id', payoutId);
      await supabase
        .from('affiliate_payouts')
        .update({ status: 'paid', processed_at: new Date().toISOString(), processed_by: auth.userId })
        .eq('id', payoutId);
    } else {
      // Rejection releases the earnings back to "available".
      await supabase
        .from('affiliate_earnings')
        .update({ payout_id: null })
        .eq('payout_id', payoutId);
      await supabase
        .from('affiliate_payouts')
        .update({ status: 'rejected', processed_at: new Date().toISOString(), processed_by: auth.userId })
        .eq('id', payoutId);
    }
    await auditLog(supabase, { actor: { userId: auth.userId, email: auth.email }, action: act, detail: { payoutId } });
    return json(200, { ok: true });
  }

  return json(400, { error: 'Unknown action' });
}
