// netlify/functions/complete-guest-account.ts
//
// Second half of the pay-first flow (Sam 2026-10-06): after the guest
// payment succeeds, the success screen asks for a password and claims
// the silently created account.
//
// Proof of ownership = the PaymentIntent client secret (only the
// paying browser has it) + the PI must be succeeded + the account must
// never have signed in (once a password is set and used, this door is
// closed forever — later changes go through the normal reset flow).

import Stripe from 'stripe';
import { stripeEnv } from './_stripeEnv';
import { serviceClient } from './_userAuth';

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

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

  let clientSecret = '';
  let password = '';
  try {
    const body = JSON.parse(event.body || '{}');
    clientSecret = String(body.payment_intent_client_secret ?? '');
    password = String(body.password ?? '');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const m = clientSecret.match(/^(pi_[A-Za-z0-9]+)_secret_/);
  if (!m) return json(400, { error: 'Invalid payment reference' });
  if (password.length < 8) return json(400, { error: 'Heslo musí mať aspoň 8 znakov.' });

  try {
    let intent: Stripe.PaymentIntent;
    try {
      intent = await stripe.paymentIntents.retrieve(m[1]);
    } catch {
      return json(403, { error: 'Invalid payment reference' });
    }
    if (intent.client_secret !== clientSecret) return json(403, { error: 'Invalid payment reference' });
    if (intent.status !== 'succeeded') return json(409, { error: 'Platba ešte nie je dokončená.' });

    // Resolve the account the payment was made for: invoice →
    // subscription metadata, with customer metadata as fallback.
    let userId: string | undefined;
    if (typeof intent.invoice === 'string') {
      const invoice = await stripe.invoices.retrieve(intent.invoice);
      const subId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : (invoice as any).parent?.subscription_details?.subscription;
      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        userId = sub.metadata?.userId;
      }
    }
    if (!userId && typeof intent.customer === 'string') {
      const customer = await stripe.customers.retrieve(intent.customer);
      if (!(customer as Stripe.DeletedCustomer).deleted) {
        userId = (customer as Stripe.Customer).metadata?.userId;
      }
    }
    if (!userId) return json(404, { error: 'Účet k platbe sa nenašiel.' });

    const supabase = serviceClient();
    const { data: userRow, error: userErr } = await supabase.auth.admin.getUserById(userId);
    if (userErr || !userRow?.user) return json(404, { error: 'Účet k platbe sa nenašiel.' });

    if (userRow.user.last_sign_in_at) {
      return json(409, { error: 'Účet je už aktívny — prihlás sa, alebo si obnov heslo.' });
    }

    const { error: updErr } = await supabase.auth.admin.updateUserById(userId, { password });
    if (updErr) {
      console.error('complete-guest-account password set failed:', updErr);
      return json(500, { error: 'Heslo sa nepodarilo nastaviť.' });
    }

    return json(200, { ok: true, email: userRow.user.email });
  } catch (err: any) {
    console.error('complete-guest-account error:', err);
    return json(500, { error: err.message ?? 'Server error' });
  }
}
