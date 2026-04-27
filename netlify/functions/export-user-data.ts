import { createClient } from '@supabase/supabase-js';

/**
 * F-032 · GDPR data export.
 *
 * Authenticated GET. Aggregates the user's rows across user-scoped
 * tables and returns a JSON download. Rate-limited to one successful
 * export per 24 hours via profiles.last_data_export_at.
 */

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const USER_TABLES = [
  'profiles',
  'subscriptions',
  'user_credits',
  'credit_transactions',
  'referrals',
  'community_posts',
  'community_comments',
  'community_reactions',
  'messages',
  'conversation_members',
  'habits',
  'habit_completions',
  'cycle_data',
  'cycle_symptoms',
  'diary_entries',
  'meal_plans',
  'recipe_favorites',
  'program_progress',
  'program_purchases',
  'nutrition_profiles',
  'user_consents',
  'notifications',
  'points_ledger',
  'user_badges',
];

export async function handler(event: { httpMethod: string; headers: Record<string, string> }) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'method_not_allowed' }) };

  const auth = event.headers.authorization ?? event.headers.Authorization;
  const token = auth?.replace(/^Bearer\s+/i, '');
  if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'no_token' }) };

  try {
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData.user) {
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'invalid_token' }) };
    }
    const userId = userData.user.id;

    // Rate limit: 1 / 24h
    const { data: prof } = await supabaseAdmin
      .from('profiles')
      .select('last_data_export_at')
      .eq('id', userId)
      .maybeSingle();
    const last = prof?.last_data_export_at ? new Date(prof.last_data_export_at) : null;
    if (last && Date.now() - last.getTime() < 24 * 60 * 60 * 1000) {
      return { statusCode: 429, headers: CORS, body: JSON.stringify({ error: 'rate_limited' }) };
    }

    const out: Record<string, unknown> = {
      exported_at: new Date().toISOString(),
      user_id: userId,
      auth_user: {
        id: userData.user.id,
        email: userData.user.email,
        created_at: userData.user.created_at,
      },
    };

    for (const table of USER_TABLES) {
      // Most tables key on user_id; profiles uses id.
      const column = table === 'profiles' ? 'id' : 'user_id';
      const { data, error } = await supabaseAdmin.from(table).select('*').eq(column, userId);
      if (error) {
        // Tables that don't exist in this environment just get skipped.
        out[table] = { error: error.message };
        continue;
      }
      out[table] = data ?? [];
    }

    // Stamp the export timestamp for rate limiting.
    await supabaseAdmin.from('profiles').update({ last_data_export_at: new Date().toISOString() }).eq('id', userId);

    return {
      statusCode: 200,
      headers: {
        ...CORS,
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="neome-export-${userId}.json"`,
      },
      body: JSON.stringify(out, null, 2),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    console.error('export-user-data error:', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: message }) };
  }
}
