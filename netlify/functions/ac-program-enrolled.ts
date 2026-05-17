// netlify/functions/ac-program-enrolled.ts
//
// Called from the SPA when a user picks a program in
// /onboarding-plus/program-select. Adds a `program:<slug>` tag in
// ActiveCampaign, which is what the per-program email automation
// triggers on.
//
// Auth: standard Supabase Bearer token in Authorization header.
//
// Body: { programSlug: 'postpartum' | 'bodyforming' | 'elastic-bands' | 'strong-sexy' }

import { createClient } from '@supabase/supabase-js';
import { syncContact, addTag } from './_acClient';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Whitelist — anything else is rejected so a typo'd slug doesn't pollute AC.
const VALID_SLUGS = new Set(['postpartum', 'bodyforming', 'elastic-bands', 'strong-sexy']);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function jsonResponse(body: unknown, status = 200) {
  return {
    statusCode: status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) return jsonResponse({ error: 'Unauthorized' }, 401);

    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', ''),
    );
    if (authErr || !user?.email) return jsonResponse({ error: 'Unauthorized' }, 401);

    const { programSlug } = JSON.parse(event.body || '{}') as { programSlug?: string };
    if (!programSlug || !VALID_SLUGS.has(programSlug)) {
      return jsonResponse({ error: 'Invalid programSlug' }, 400);
    }

    const meta = (user.user_metadata || {}) as Record<string, string>;
    const contactId = await syncContact({
      email: user.email,
      firstName: meta.firstName || meta.first_name || '',
      lastName: meta.lastName || meta.last_name || '',
    });
    await addTag(contactId, `program:${programSlug}`);

    return jsonResponse({ ok: true, contactId, tag: `program:${programSlug}` });
  } catch (err: any) {
    console.error('ac-program-enrolled error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
