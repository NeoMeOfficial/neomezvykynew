/**
 * Replies (comments) for a single community post.
 *
 * Reads / writes to `community_replies` (post_id, user_id, author_name,
 * content, created_at). A trigger on that table keeps
 * `community_posts.comments_count` in sync, so we don't need to update
 * the parent row from the client.
 *
 * Demo fallback: localStorage keyed by post id, so the UI works for
 * signed-out users browsing the seed feed.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

export interface CommunityReply {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const DEMO_KEY_PREFIX = 'neome_replies_demo_';

function loadDemo(postId: string): CommunityReply[] {
  try {
    const raw = localStorage.getItem(DEMO_KEY_PREFIX + postId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDemo(postId: string, rows: CommunityReply[]) {
  try {
    localStorage.setItem(DEMO_KEY_PREFIX + postId, JSON.stringify(rows));
  } catch {
    // ignore quota
  }
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'práve teraz';
  if (minutes < 60) return `pred ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `pred ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'včera';
  return `pred ${days} dňami`;
}

export function useCommunityReplies(postId: string | undefined) {
  const { user, profile } = useSupabaseAuth();
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setReplies([]);
      setLoading(false);
      return;
    }

    // Seed posts (hardcoded sample feed) never have real replies — skip the
    // round-trip and let the page fall back to its hardcoded REPLIES set.
    if (postId.startsWith('seed-')) {
      setReplies(loadDemo(postId));
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setReplies(loadDemo(postId));
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from('community_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .limit(200)
      .then(({ data, error }) => {
        if (error) {
          // Table missing or permission issue — fall back silently to demo.
          setReplies(loadDemo(postId));
        } else {
          setReplies((data as CommunityReply[]) ?? []);
        }
        setLoading(false);
      });
  }, [postId]);

  const addReply = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !postId) return;

      // Demo path: signed-out, or no Supabase. Store locally.
      const useDemo = !isSupabaseConfigured() || !user?.id || postId.startsWith('seed-');
      if (useDemo) {
        const newReply: CommunityReply = {
          id: `local-${Date.now()}`,
          post_id: postId,
          user_id: user?.id ?? 'demo',
          author_name: profile?.full_name || profile?.first_name || 'Anonym',
          content: trimmed,
          created_at: new Date().toISOString(),
        };
        const next = [...replies, newReply];
        setReplies(next);
        saveDemo(postId, next);
        return;
      }

      // Real path — insert into Supabase. Trigger updates parent comments_count.
      const authorName =
        profile?.full_name?.trim() ||
        (profile?.first_name && profile?.last_name
          ? `${profile.first_name} ${profile.last_name.charAt(0)}.`
          : profile?.first_name) ||
        'Anonym';

      const { data, error } = await supabase
        .from('community_replies')
        .insert({
          post_id: postId,
          user_id: user.id,
          author_name: authorName,
          content: trimmed,
        })
        .select()
        .single();

      if (!error && data) {
        setReplies((prev) => [...prev, data as CommunityReply]);
      }
    },
    [postId, user, profile, replies],
  );

  return { replies, loading, addReply, formatRelativeTime };
}
