-- Blog posts table for Gabi's editorial content
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'vyziva', 'pohyb', 'mysel', 'cyklus', 'materstvo')),
  author TEXT DEFAULT 'Gabi',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts (drop first in case it already exists)
DROP POLICY IF EXISTS "Published blog posts are public" ON public.blog_posts;
CREATE POLICY "Published blog posts are public" ON public.blog_posts
  FOR SELECT USING (published = true);

-- Service role (admin) can do everything — RLS bypassed for service role automatically

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_blog_posts_updated_at();

-- Auto-set published_at when published = true
CREATE OR REPLACE FUNCTION public.set_blog_post_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = TRUE AND OLD.published = FALSE THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_published_at ON public.blog_posts;
CREATE TRIGGER blog_posts_published_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_blog_post_published_at();
