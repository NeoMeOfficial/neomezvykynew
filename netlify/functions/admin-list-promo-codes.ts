// netlify/functions/admin-list-promo-codes.ts
//
// Returns the list of promotion codes currently in Stripe — used by the
// admin Promo Codes tab so the page reflects what's actually in Stripe
// (codes created anywhere, used/expired state, real redemption counts)
// instead of a localStorage cache of admin-side creates.
//
// Auth: caller must be authenticated AND have profiles.role = 'admin'.

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { stripeEnv } from './_stripeEnv';
import { requireAdmin } from './_adminAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    // Admin auth
    const auth = await requireAdmin(event.headers.authorization || event.headers.Authorization);
    if (!auth.ok) return { statusCode: auth.status, headers: CORS, body: JSON.stringify({ error: auth.error }) };

    // Fetch promotion codes (newest first). Stripe limit per page = 100;
    // for >100 we'd paginate but that's plenty for the foreseeable.
    const res = await stripe.promotionCodes.list({
      limit: 100,
      expand: ['data.coupon'],
    });

    const codes = res.data.map((pc) => {
      const c = pc.coupon as Stripe.Coupon;
      return {
        id: pc.id,
        code: pc.code,
        active: pc.active,
        timesRedeemed: pc.times_redeemed,
        maxRedemptions: pc.max_redemptions ?? null,
        expiresAt: pc.expires_at ? new Date(pc.expires_at * 1000).toISOString() : null,
        created: new Date(pc.created * 1000).toISOString(),
        coupon: {
          id: c.id,
          name: c.name,
          percentOff: c.percent_off ?? null,
          amountOff: c.amount_off ?? null,
          currency: c.currency ?? null,
          duration: c.duration,
        },
      };
    });

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ codes }),
    };
  } catch (error: any) {
    console.error('admin-list-promo-codes error:', error);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
}
