-- Support role (Sam 2026-10-05): second admin layer. 'support' gets the
-- panel minus anything financial. Financial tables keep is_admin();
-- content + messages move to is_staff() = admin OR support.

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'support')
  );
$$;

-- Content tables: editable by staff (was JWT app_metadata admin-only).
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['exercises','programmes','meditations','recipes','blog_posts'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin can manage %1$s" ON public.%1$s', t);
    EXECUTE format(
      'CREATE POLICY "Staff can manage %1$s" ON public.%1$s
         FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff())', t);
  END LOOP;
END $$;

-- Messages: support answers users too.
DROP POLICY IF EXISTS "Admin full access" ON public.messages;
CREATE POLICY "Staff full access" ON public.messages
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- Message assignments (Gabi/Admin routing), if the table exists.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='message_assignments') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admin manages assignments" ON public.message_assignments';
    EXECUTE 'DROP POLICY IF EXISTS "Admin full access" ON public.message_assignments';
    EXECUTE 'CREATE POLICY "Staff manage assignments" ON public.message_assignments
               FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff())';
  END IF;
END $$;

-- Community reports: support moderates too.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='community_reports') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admin manages reports" ON public.community_reports';
    EXECUTE 'CREATE POLICY "Staff manage reports" ON public.community_reports
               FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff())';
  END IF;
END $$;
