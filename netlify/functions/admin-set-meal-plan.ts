// netlify/functions/admin-set-meal-plan.ts
//
// Admin grant/revoke of the €57 meal-plan flag
// (profiles.nutrition_plan_purchased).
//
// This MUST run server-side: the column is protected by the
// protect_privileged_profile_columns trigger (migration 20260707120000),
// which only lets service_role through — an admin's browser session is
// still PostgREST role 'authenticated' and gets rejected. Normal grants
// come from the Stripe webhook; this function covers support cases
// (comp, refund, purchase made with the wrong account).

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

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  const auth = await requireAdmin(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) {
    return { statusCode: auth.status, headers: CORS, body: JSON.stringify({ error: auth.error }) };
  }

  try {
    const { userId, purchased } = JSON.parse(event.body || '{}');
    if (!userId || typeof purchased !== 'boolean') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'userId and purchased(boolean) are required' }) };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ nutrition_plan_purchased: purchased, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('id');

    if (error) throw error;
    if (!data || data.length === 0) {
      return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'User not found' }) };
    }

    await auditLog(supabase, {
      actor: auth,
      action: purchased ? 'meal_plan_granted' : 'meal_plan_revoked',
      targetUserId: userId,
    });

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, purchased }) };
  } catch (error: any) {
    console.error('admin-set-meal-plan error:', error);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
}
