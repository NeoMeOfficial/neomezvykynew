-- Community posts and comments
-- Run this in Supabase SQL Editor after 01-06

CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  author_name TEXT NOT NULL,          -- display name at time of posting
  type TEXT CHECK (type IN ('post', 'question')) DEFAULT 'post',
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_likes (
  user_id UUID REFERENCES auth.users NOT NULL,
  post_id UUID REFERENCES public.community_posts ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

-- RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

-- Posts: anyone can read, authenticated users can insert/delete own
CREATE POLICY "Posts visible to all" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Comments: same pattern
CREATE POLICY "Comments visible to all" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.community_comments FOR DELETE USING (auth.uid() = user_id);

-- Likes
CREATE POLICY "Likes visible to all" ON public.community_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON public.community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.community_likes FOR DELETE USING (auth.uid() = user_id);

-- Increment/decrement helpers
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS VOID AS $$
  UPDATE public.community_posts SET likes_count = likes_count + 1 WHERE id = post_id;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS VOID AS $$
  UPDATE public.community_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = post_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Performance
CREATE INDEX idx_community_posts_created ON public.community_posts (created_at DESC);
CREATE INDEX idx_community_comments_post ON public.community_comments (post_id, created_at);
