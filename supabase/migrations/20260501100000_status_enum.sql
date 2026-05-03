-- ============================================================
-- Phase 0 · Three-state status enum on all content tables
-- ============================================================
-- Adds a `status TEXT CHECK IN ('draft','published','archived')` column
-- to every content table. Public-read RLS policies are replaced to
-- read from `status='published'` instead of `active=true` /
-- `published=true`.
--
-- The legacy boolean columns (`active` for most tables, `published`
-- for blog_posts) are KEPT during Phase 0 to avoid breaking existing
-- admin CRUD code. A trigger keeps `status` in sync whenever the
-- legacy boolean is updated. Admin tabs get rewritten in Phases 1–2;
-- once they all write `status` directly, a follow-up migration drops
-- the legacy columns and the sync trigger.
--
-- Mapping at backfill:
--   exercises / programmes / meditations / recipes:
--     active=TRUE  → status='published'
--     active=FALSE → status='archived'
--   blog_posts:
--     published=TRUE  → status='published'
--     published=FALSE → status='draft'   (blog default-draft, not archived)
-- ============================================================

BEGIN;

-- ── exercises / programmes / meditations / recipes ──────────────────────────
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['exercises','programmes','meditations','recipes'])
  LOOP
    -- 1. Add status column with default
    EXECUTE format(
      'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT ''published''
         CHECK (status IN (''draft'', ''published'', ''archived''))',
      t
    );

    -- 2. Backfill from active
    EXECUTE format(
      'UPDATE public.%I
         SET status = CASE WHEN active = true THEN ''published'' ELSE ''archived'' END',
      t
    );

    -- 3. Replace public-read RLS policy
    EXECUTE format('DROP POLICY IF EXISTS "Active %1$s are public" ON public.%1$s', t);
    EXECUTE format(
      'CREATE POLICY "Published %1$s are public" ON public.%1$s
         FOR SELECT USING (status = ''published'')',
      t
    );

    -- 4. Add sync trigger: when active changes, update status to match
    EXECUTE format(
      'CREATE OR REPLACE FUNCTION public.sync_%1$s_active_to_status()
       RETURNS TRIGGER AS $T$
       BEGIN
         IF NEW.active IS DISTINCT FROM OLD.active OR TG_OP = ''INSERT'' THEN
           NEW.status = CASE WHEN NEW.active = true THEN ''published'' ELSE ''archived'' END;
         END IF;
         RETURN NEW;
       END;
       $T$ LANGUAGE plpgsql',
      t
    );

    EXECUTE format('DROP TRIGGER IF EXISTS sync_%1$s_active_to_status ON public.%1$s', t);
    EXECUTE format(
      'CREATE TRIGGER sync_%1$s_active_to_status
         BEFORE INSERT OR UPDATE OF active ON public.%1$s
         FOR EACH ROW EXECUTE FUNCTION public.sync_%1$s_active_to_status()',
      t
    );
  END LOOP;
END $$;

-- ── blog_posts (uses `published` boolean, defaults to draft) ────────────────
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft'
  CHECK (status IN ('draft', 'published', 'archived'));

UPDATE public.blog_posts
  SET status = CASE WHEN published = true THEN 'published' ELSE 'draft' END;

DROP POLICY IF EXISTS "Published blog posts are public" ON public.blog_posts;
CREATE POLICY "Published blog posts are public" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE OR REPLACE FUNCTION public.sync_blog_posts_published_to_status()
RETURNS TRIGGER AS $T$
BEGIN
  IF NEW.published IS DISTINCT FROM OLD.published OR TG_OP = 'INSERT' THEN
    NEW.status = CASE WHEN NEW.published = true THEN 'published' ELSE 'draft' END;
    -- Mirror the published_at update too (replaces old set_blog_post_published_at trigger logic)
    IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status <> 'published') THEN
      NEW.published_at = NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$T$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_published_at ON public.blog_posts;
DROP FUNCTION IF EXISTS public.set_blog_post_published_at();

DROP TRIGGER IF EXISTS sync_blog_posts_published_to_status ON public.blog_posts;
CREATE TRIGGER sync_blog_posts_published_to_status
  BEFORE INSERT OR UPDATE OF published ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.sync_blog_posts_published_to_status();

COMMIT;

-- ============================================================
-- Verification (run manually after migration):
--   SELECT 'recipes' AS t, status, COUNT(*) FROM public.recipes GROUP BY status
--   UNION ALL SELECT 'exercises', status, COUNT(*) FROM public.exercises GROUP BY status
--   UNION ALL SELECT 'programmes', status, COUNT(*) FROM public.programmes GROUP BY status
--   UNION ALL SELECT 'meditations', status, COUNT(*) FROM public.meditations GROUP BY status
--   UNION ALL SELECT 'blog_posts', status, COUNT(*) FROM public.blog_posts GROUP BY status;
--
--   -- Test trigger sync:
--   UPDATE public.recipes SET active = false WHERE id = 'some-id';
--   SELECT id, active, status FROM public.recipes WHERE id = 'some-id';
--   -- expected: active=false, status='archived'
-- ============================================================

-- ============================================================
-- TODO (later phase, when admin tabs are all rewritten):
--   - Drop sync triggers + functions
--   - Drop legacy columns: ALTER TABLE recipes DROP COLUMN active; (etc.)
--   - Update admin code to write status directly
-- ============================================================
