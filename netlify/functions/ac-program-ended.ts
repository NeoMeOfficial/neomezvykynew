// netlify/functions/ac-program-ended.ts
//
// Called from the SPA when a user cancels, completes, or pauses a
// program. Removes the trigger tag (so AC's program automation stops
// sending emails via its "Exit when tag removed" condition) and adds a
// status tag for reporting.
//
// Auth: standard Supabase Bearer token in Authorization header.
//
// Body: {
//   programSlug: 'postpartum' | 'bodyforming' | 'elastic-bands' | 'strong-sexy',
//   reason: 'canceled' | 'completed' | 'paused'
// }

import { createClient } from '@supabase/supabase-js';
import { syncContact, addTag, removeTag } from './_acClient';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const VALID_SLUGS = new Set(['postpartum', 'bodyforming', 'elastic-bands', 'strong-sexy']);
const VALID_REASONS = new Set(['canceled', 'completed', 'paused']);

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

    const { programSlug, reason } = JSON.parse(event.body || '{}') as {
      programSlug?: string;
      reason?: string;
    };
    if (!programSlug || !VALID_SLUGS.has(programSlug)) {
      return jsonResponse({ error: 'Invalid programSlug' }, 400);
    }
    if (!reason || !VALID_REASONS.has(reason)) {
      return jsonResponse({ error: 'reason must be canceled | completed | paused' }, 400);
    }

    // syncContact is idempotent — returns the existing contact id.
    const meta = (user.user_metadata || {}) as Record<string, string>;
    const contactId = await syncContact({
      email: user.email,
      firstName: meta.firstName || meta.first_name || '',
      lastName: meta.lastName || meta.last_name || '',
    });

    // Order matters: remove the trigger tag first so AC's exit
    // condition fires before the status tag arrives.
    await removeTag(contactId, `app_${programSlug}`);
    await addTag(contactId, `app_${programSlug}_${reason}`);

    return jsonResponse({ ok: true, contactId, removed: `app_${programSlug}`, added: `app_${programSlug}_${reason}` });
  } catch (err: any) {
    console.error('ac-program-ended error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
