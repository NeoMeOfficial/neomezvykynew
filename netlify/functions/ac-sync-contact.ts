// netlify/functions/ac-sync-contact.ts
//
// Called by a Supabase Database Webhook on INSERT into public.profiles
// (and optionally UPDATE, when the user fills in their name later).
//
// public.profiles is auto-populated by the on_auth_user_created trigger,
// so one signup → one row → one webhook fire. We webhook on profiles
// (not auth.users) because Supabase's dashboard only allows webhooks on
// the public schema.
//
// Body shape (Supabase webhook envelope):
//   {
//     type: 'INSERT' | 'UPDATE',
//     table: 'profiles',
//     record: {
//       id: '<uuid>',
//       email: '<email>',
//       full_name: '<name>',
//       ...
//     }
//   }
//
// Auth: shared secret in `X-Webhook-Secret` header — set the same value
// on the Supabase webhook config and in Netlify env as AC_WEBHOOK_SECRET.

import { syncContact, addTag } from './_acClient';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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

  // Shared-secret check — keeps the endpoint from being abused.
  const expected = process.env.AC_WEBHOOK_SECRET;
  const provided = event.headers['x-webhook-secret'] || event.headers['X-Webhook-Secret'];
  if (!expected || provided !== expected) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const record = payload.record;
    if (!record?.email) return jsonResponse({ error: 'No email in record' }, 400);

    // Split full_name into first/last on the first space — best-effort
    // since the column is a single text field.
    const fullName: string = (record.full_name || '').trim();
    const [firstName = '', ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(' ');

    const contactId = await syncContact({
      email: record.email,
      firstName,
      lastName,
    });
    await addTag(contactId, 'app_new_signup');

    return jsonResponse({ ok: true, contactId });
  } catch (err: any) {
    console.error('ac-sync-contact error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
