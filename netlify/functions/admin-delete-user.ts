import { createClient } from '@supabase/supabase-js';

// Service role client bypasses RLS — required for auth.admin operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { userId } = JSON.parse(event.body);
    if (!userId) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing userId' }) };

    // Delete from Supabase auth — cascades to profiles via FK
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ deleted: true }) };
  } catch (error: any) {
    console.error('admin-delete-user error:', error);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
}
