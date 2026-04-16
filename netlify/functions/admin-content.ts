import { createClient } from '@supabase/supabase-js';

// Service role bypasses RLS — required to read ALL content (including inactive)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate env vars at startup so errors are obvious
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('MISSING ENV VARS: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY not set in Netlify environment variables');
}

const supabase = createClient(
  SUPABASE_URL ?? '',
  SUPABASE_SERVICE_ROLE_KEY ?? ''
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const TABLES: Record<string, string> = {
  recipes: 'recipes',
  exercises: 'exercises',
  meditations: 'meditations',
  programmes: 'programmes',
};

const ORDER_BY: Record<string, { column: string; ascending: boolean }> = {
  recipes: { column: 'created_at', ascending: false },
  exercises: { column: 'content_type', ascending: true },
  meditations: { column: 'created_at', ascending: false },
  programmes: { column: 'level', ascending: true },
};

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  // Guard: fail fast with a clear message if env vars are missing
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Server config error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in Netlify → Site settings → Environment variables. Redeploy after adding them.' }),
    };
  }

  // ─── GET — list all items of a type ────────────────────────────────────
  if (event.httpMethod === 'GET') {
    const type = event.queryStringParameters?.type;
    if (!type || !TABLES[type]) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing or invalid ?type= parameter. Use: recipes, exercises, meditations, programmes' }) };
    }
    const { column, ascending } = ORDER_BY[type];
    const { data, error } = await supabase.from(TABLES[type]).select('*').order(column, { ascending });
    if (error) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ items: data ?? [] }) };
  }

  // ─── POST — upsert, delete, or seed ────────────────────────────────────
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      const { type, action, data, id, items } = body;

      if (!type || !TABLES[type]) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing or invalid type' }) };
      }
      const table = TABLES[type];

      // Upsert single item
      if (action === 'upsert') {
        if (!data) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing data' }) };
        const { data: result, error } = await supabase.from(table).upsert([data], { onConflict: 'id' }).select();
        if (error) throw error;
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ item: result?.[0] }) };
      }

      // Delete single item
      if (action === 'delete') {
        if (!id) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing id' }) };
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ deleted: true }) };
      }

      // Batch seed — upsert many items at once
      if (action === 'seed') {
        if (!items || !Array.isArray(items) || items.length === 0) {
          return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing items array' }) };
        }
        // Upsert in chunks of 100 to avoid payload limits
        const chunkSize = 100;
        let inserted = 0;
        for (let i = 0; i < items.length; i += chunkSize) {
          const chunk = items.slice(i, i + chunkSize);
          const { error } = await supabase.from(table).upsert(chunk, { onConflict: 'id' });
          if (error) throw error;
          inserted += chunk.length;
        }
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ seeded: inserted }) };
      }

      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: `Unknown action: ${action}` }) };

    } catch (error: any) {
      console.error('admin-content error:', error);
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
    }
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
}
