// netlify/functions/ac-sync-contact.ts
//
// Called by a Supabase Database Webhook on INSERT into auth.users (and
// optionally UPDATE, when the user finishes filling out their profile).
//
// Body shape (Supabase webhook envelope):
//   {
//     type: 'INSERT' | 'UPDATE',
//     table: 'users',
//     record: {
//       id: '<uuid>',
//       email: '<email>',
//       raw_user_meta_data: { firstName, lastName, ... }
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

    const meta = record.raw_user_meta_data || {};
    const contactId = await syncContact({
      email: record.email,
      firstName: meta.firstName || meta.first_name || '',
      lastName: meta.lastName || meta.last_name || '',
    });
    await addTag(contactId, 'new-signup');

    return jsonResponse({ ok: true, contactId });
  } catch (err: any) {
    console.error('ac-sync-contact error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
