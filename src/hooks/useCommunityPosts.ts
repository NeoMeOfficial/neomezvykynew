import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface CommunityPost {
  id: string;
  type: 'post' | 'question';
  author: string;
  text: string;
  likes: number;
  comments: number;
  time: string;
  created_at?: string;
  user_id?: string;
}

const SEED_POSTS: CommunityPost[] = [
  { id: 'seed-1', type: 'post', author: 'Mária K.', text: 'Dokončila som 4. týždeň BodyForming! 💪 Cítim sa silnejšia každým dňom.', likes: 24, comments: 6, time: 'pred 2h' },
  { id: 'seed-2', type: 'question', author: 'Jana V.', text: 'Aký strečing odporúčate po behu? Mám problém s lýtkami.', likes: 8, comments: 5, time: 'pred 3h' },
  { id: 'seed-3', type: 'post', author: 'Zuzana P.', text: 'Dnešný recept na Buddha bowl bol úžasný 🥗 Určite vyskúšajte!', likes: 18, comments: 3, time: 'pred 5h' },
  { id: 'seed-4', type: 'question', author: 'Lucia H.', text: 'Má niekto skúsenosti s Postpartum programom? Zvažujem začať.', likes: 12, comments: 8, time: 'pred 8h' },
  { id: 'seed-5', type: 'post', author: 'Katarína M.', text: 'Prvýkrát som zvládla 30 min meditáciu! 🧘‍♀️ Ďakujem NeoMe za guided sessions.', likes: 31, comments: 4, time: 'včera' },
];

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'práve teraz';
  if (minutes < 60) return `pred ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `pred ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'včera';
  return `pred ${days} dňami`;
}

export function useCommunityPosts() {
  const [posts, setPosts] = useState<CommunityPost[]>(SEED_POSTS);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Load posts — Supabase if configured, otherwise use seed data
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    setLoading(true);
    supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setPosts(
            data.map((row) => ({
              id: row.id,
              type: row.type,
              author: row.author_name,
              text: row.content,
              likes: row.likes_count,
              comments: row.comments_count,
              time: formatRelativeTime(row.created_at),
              created_at: row.created_at,
              user_id: row.user_id,
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  const submitPost = useCallback(
    async (text: string, type: 'post' | 'question', authorName: string, userId?: string) => {
      const optimisticPost: CommunityPost = {
        id: 'temp-' + Date.now(),
        type,
        author: authorName,
        text,
        likes: 0,
        comments: 0,
        time: 'práve teraz',
        created_at: new Date().toISOString(),
      };

      // Optimistic update
      setPosts((prev) => [optimisticPost, ...prev]);

      if (!isSupabaseConfigured() || !userId) return;

      const { data, error } = await supabase
        .from('community_posts')
        .insert({ user_id: userId, author_name: authorName, type, content: text })
        .select()
        .single();

      if (!error && data) {
        // Replace optimistic with real
        setPosts((prev) =>
          prev.map((p) =>
            p.id === optimisticPost.id
              ? { ...optimisticPost, id: data.id, created_at: data.created_at }
              : p
          )
        );
      }
    },
    []
  );

  const toggleLike = useCallback(
    async (postId: string, userId?: string) => {
      const isLiked = likedIds.has(postId);

      setLikedIds((prev) => {
        const next = new Set(prev);
        isLiked ? next.delete(postId) : next.add(postId);
        return next;
      });

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p
        )
      );

      if (!isSupabaseConfigured() || !userId || postId.startsWith('seed-') || postId.startsWith('temp-')) return;

      if (isLiked) {
        await supabase.from('community_likes').delete().match({ user_id: userId, post_id: postId });
        await supabase.rpc('decrement_post_likes', { post_id: postId });
      } else {
        await supabase.from('community_likes').insert({ user_id: userId, post_id: postId });
        await supabase.rpc('increment_post_likes', { post_id: postId });
      }
    },
    [likedIds]
  );

  return { posts, likedIds, loading, submitPost, toggleLike };
}
