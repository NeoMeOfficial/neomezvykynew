import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Blog hooks — F-025
 *
 * Reads from public.blog_posts (migration 20260416_blog_posts.sql).
 * Falls back to a small hardcoded list pre-migration so Blog list and
 * BlogArticle never blank out.
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string;
  author: string;
  published: boolean;
  published_at: string | null;
}

const FALLBACK: BlogPost[] = [
  {
    id: 'fb-1',
    slug: 'postpartum-navrat',
    title: 'Postpartum návrat: Prvé tri mesiace',
    excerpt: 'O tom, prečo sa nevracaš k „pôvodnému telu" — a prečo je to v poriadku.',
    content: '## Prvé týždne\n\nTelo si po pôrode pýta čas. Hormóny sa upokojujú, kosti sa vracajú na miesto, panvové dno sa hojí. Nemá zmysel ho ponáhľať.\n\n## Ako začať pohyb\n\nMäkký dych. Aktivácia hlbokého stredu. Krátke prechádzky. Až potom strečing a postupne viac.',
    cover_image: '/images/r9/program-postpartum.jpg',
    category: 'materstvo',
    author: 'Gabi',
    published: true,
    published_at: '2026-04-10T08:00:00Z',
  },
  {
    id: 'fb-2',
    slug: 'cyklus-a-trening',
    title: 'Tréning podľa cyklu',
    excerpt: 'Folikulárna fáza je tvoj zlatý čas. Luteálna chce strečing. Toto funguje.',
    content: '## Štyri fázy\n\nKaždá fáza ti dáva niečo iné. Sila vo folikulárnej, výkon v ovulácii, vytrvalosť v luteálnej, pokoj v menštruácii.',
    cover_image: '/images/r9/program-hormonal.jpg',
    category: 'cyklus',
    author: 'Gabi',
    published: true,
    published_at: '2026-04-05T08:00:00Z',
  },
];

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });
      if (!cancelled) {
        if (data && data.length > 0) setPosts(data as BlogPost[]);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading };
}

export function useBlogPost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .limit(1);
      if (!cancelled) {
        if (data && data.length > 0) {
          setPost(data[0] as BlogPost);
        } else {
          setPost(FALLBACK.find((p) => p.slug === slug) ?? null);
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading };
}
