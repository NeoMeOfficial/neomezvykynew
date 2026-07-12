-- ════════════════════════════════════════════════════════════════════
-- Admin role unification + audit log.
--
-- Admin-audit finding (2026-07-12): "is this user an admin?" was answered
-- from two diverging sources — the JWT app_metadata claim and the
-- profiles.role column. Content-write RLS, the messages inbox, moderation
-- and the profiles admin-read policy checked ONLY the JWT claim, so an
-- admin promoted via the panel (profiles.role set, JWT stale until
-- re-login) passed the SPA guard but every content write silently
-- no-opped. This migration:
--
--   1. Adds public.is_admin() — true if EITHER source says admin.
--      SECURITY DEFINER so the profiles lookup bypasses profiles RLS
--      (no recursion).
--   2. Recreates every admin RLS policy on top of is_admin().
--   3. Creates admin_audit_log — WHO did WHAT to WHOM. Written by the
--      service role from admin Netlify functions; readable by admins.
--
-- Apply in the Supabase SQL editor.
-- ════════════════════════════════════════════════════════════════════

begin;

-- 1 ── unified admin check ────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      );
$$;

comment on function public.is_admin() is
  'True when the caller is an admin by JWT app_metadata OR profiles.role. Use in every admin RLS policy so freshly-promoted admins work without re-login.';

-- 2 ── recreate admin policies on is_admin() ─────────────────────────
-- Content tables (from 20260501100100). NOTE: "recipes" was recreated by
-- 20260507100000 as the curated library WITHOUT admin RLS — that is
-- intentional (service-role writes via the admin-content function only),
-- so recipes is deliberately absent here.
do $$
declare
  t text;
begin
  for t in select unnest(array['exercises', 'programmes', 'meditations', 'blog_posts'])
  loop
    execute format('drop policy if exists "Admin can manage %1$s" on public.%1$s', t);
    execute format(
      'create policy "Admin can manage %1$s" on public.%1$s
         for all
         using (public.is_admin())
         with check (public.is_admin())',
      t
    );
  end loop;
end $$;

-- Community moderation (20260518130000)
drop policy if exists "Admin update posts" on public.community_posts;
create policy "Admin update posts" on public.community_posts
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin full access on assignments" on public.message_assignments;
create policy "Admin full access on assignments" on public.message_assignments
  for all using (public.is_admin()) with check (public.is_admin());

-- Messages inbox (20260413_messages)
drop policy if exists "Admin full access" on public.messages;
create policy "Admin full access" on public.messages
  for all using (public.is_admin()) with check (public.is_admin());

-- Profiles admin read (20260707120000 replaced the recursive original
-- with a JWT-only check; unify it too — is_admin() is SECURITY DEFINER,
-- so no recursion)
drop policy if exists "Admins view all profiles" on public.profiles;
create policy "Admins view all profiles" on public.profiles
  for select using (public.is_admin());

-- 3 ── audit log ─────────────────────────────────────────────────────
create table if not exists public.admin_audit_log (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid not null,
  actor_email     text,
  action          text not null,
  target_user_id  uuid,
  detail          jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx
  on public.admin_audit_log (created_at desc);

alter table public.admin_audit_log enable row level security;

-- Admins may read the trail; nobody writes through PostgREST — inserts
-- come exclusively from service-role Netlify functions (bypass RLS).
create policy "Admins read audit log" on public.admin_audit_log
  for select using (public.is_admin());

commit;

-- Verification (run after applying):
--   select public.is_admin();                          -- true as admin
--   select count(*) from public.admin_audit_log;       -- readable as admin
--   As a profiles-only admin (no JWT claim): update an exercise → succeeds.
