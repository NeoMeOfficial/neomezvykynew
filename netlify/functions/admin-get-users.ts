import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        role,
        onboarding_completed,
        created_at,
        updated_at,
        subscriptions (
          tier,
          active,
          stripe_customer_id,
          stripe_subscription_id,
          current_period_end,
          cancel_at_period_end
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ users: profiles ?? [] }),
    };
  } catch (error: any) {
    console.error('admin-get-users error:', error);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
}
