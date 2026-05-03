-- ============================================================
-- Phase 0 · Admin-write RLS policies for content tables
-- ============================================================
-- Allows users with `app_metadata.role = 'admin'` to insert,
-- update, and delete on every content table. Public read is
-- already gated on `status = 'published'` (see status_enum
-- migration above).
--
-- The pattern mirrors the existing admin policy on the
-- `messages` table (20260413_messages.sql).
--
-- Bootstrap admins receive the role automatically on first
-- login via the `set-admin-role` Edge Function. New admins are
-- added through the admin panel which calls the same function.
-- ============================================================

BEGIN;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['exercises','programmes','meditations','recipes','blog_posts'])
  LOOP
    -- Drop any pre-existing admin policy with the same name (idempotent re-run)
    EXECUTE format('DROP POLICY IF EXISTS "Admin can manage %1$s" ON public.%1$s', t);

    EXECUTE format(
      'CREATE POLICY "Admin can manage %1$s" ON public.%1$s
         FOR ALL
         USING ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'')
         WITH CHECK ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'')',
      t
    );
  END LOOP;
END $$;

COMMIT;

-- ============================================================
-- Verification:
--   1. As an authenticated NON-admin user, attempt:
--        INSERT INTO public.recipes (id, title) VALUES ('x', 'y');
--      → should fail with RLS violation.
--   2. As an admin user (JWT contains app_metadata.role='admin'):
--        INSERT INTO public.recipes (id, title, slot, status)
--        VALUES ('test-1', 'Test recipe', 'ranajky', 'draft');
--      → should succeed.
--   3. Public anonymous read:
--        SELECT * FROM public.recipes WHERE status='published';
--      → should return rows.
--      SELECT * FROM public.recipes WHERE status='draft';
--      → should return zero rows (RLS hides drafts from public).
-- ============================================================
