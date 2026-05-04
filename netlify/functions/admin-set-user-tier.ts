import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const VALID_TIERS = ['free', 'neome_plus', 'program_bundle'];

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { userId, tier } = JSON.parse(event.body || '{}');

    if (!userId || !tier) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'userId and tier are required' }) };
    }
    if (!VALID_TIERS.includes(tier)) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: `tier must be one of: ${VALID_TIERS.join(', ')}` }) };
    }

    // Upsert subscription row
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        tier,
        active: tier !== 'free',
        stripe_customer_id: null,
        stripe_subscription_id: null,
        current_period_end: tier !== 'free' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw error;

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ success: true, tier }),
    };
  } catch (error: any) {
    console.error('admin-set-user-tier error:', error);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
}
