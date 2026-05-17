// netlify/functions/admin-set-post-status.ts
//
// Admin-only: set a community post's status to 'visible' or 'removed'.
//
// When status flips to 'removed', also deletes the author's
// post_published award (ref_id = 'post_<id>'). Liker points are left
// in place — they were earned for the act of engaging in good faith
// and shouldn't be punished retroactively for someone else's post.
//
// Restoring to 'visible' does NOT re-award the author — the ledger
// row is gone. They'd need to be credited manually if appropriate.
//
// Body: { postId: string, status: 'visible' | 'removed' }

import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './_adminAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
    const auth = await requireAdmin(event.headers.authorization || event.headers.Authorization);
    if (!auth.ok) return jsonResponse({ error: auth.error }, auth.status);

    const { postId, status } = JSON.parse(event.body || '{}') as {
      postId?: string;
      status?: 'visible' | 'removed';
    };
    if (!postId) return jsonResponse({ error: 'postId required' }, 400);
    if (status !== 'visible' && status !== 'removed') {
      return jsonResponse({ error: 'status must be "visible" or "removed"' }, 400);
    }

    // Flip the status.
    const { error: updateErr } = await supabaseAdmin
      .from('community_posts')
      .update({ status })
      .eq('id', postId);
    if (updateErr) return jsonResponse({ error: `Update failed: ${updateErr.message}` }, 500);

    let reversedAuthor = 0;

    if (status === 'removed') {
      // Author's post_published award — single row at most.
      const { data: authorRows, error: authorErr } = await supabaseAdmin
        .from('points_ledger')
        .delete()
        .eq('ref_id', `post_${postId}`)
        .select('id');
      if (authorErr) console.error('admin-set-post-status: author ledger delete failed', authorErr);
      reversedAuthor = authorRows?.length ?? 0;
    }

    return jsonResponse({ ok: true, status, reversedAuthor });
  } catch (err: any) {
    console.error('admin-set-post-status error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
