-- ════════════════════════════════════════════════════════════════════
-- Harden profiles against self-service privilege escalation.
--
-- Launch-audit finding (2026-07-07, confirmed by two independent
-- reviews): the "Users update own profile" policy had no WITH CHECK
-- and no column restriction, and both `role` and
-- `nutrition_plan_purchased` live on that row. Any authenticated user
-- could PATCH their own profile via the anon-key REST API and:
--   • set role='admin'  → full admin (SPA guard + admin functions +
--     admin content-write RLS all trust profiles.role)
--   • set nutrition_plan_purchased=true → free €57 meal-plan product
--
-- Fix:
--   1. Recreate the update policy with WITH CHECK.
--   2. BEFORE UPDATE trigger that rejects changes to privileged
--      columns unless the caller is service_role (Netlify functions,
--      Stripe webhook, SQL editor). Trigger-based rather than
--      column-level GRANTs because several profile columns were added
--      outside the repo's migrations and a hardcoded grant list would
--      drift.
--   3. Replace the self-referencing "Admins view all profiles" policy
--      (recursion risk) with a JWT app_metadata check.
--
-- Apply in the Supabase SQL editor.
-- ════════════════════════════════════════════════════════════════════

begin;

-- 1 ── update policy with WITH CHECK ──────────────────────────────────
drop policy if exists "Users update own profile" on public.profiles;

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2 ── privileged-column guard ────────────────────────────────────────
create or replace function public.protect_privileged_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_role text;
begin
  -- service_role (Netlify functions, webhook) and direct SQL-editor
  -- sessions (no request JWT) bypass the guard.
  jwt_role := coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
    'none'
  );
  if jwt_role in ('service_role', 'none') then
    return new;
  end if;

  if new.role is distinct from old.role then
    raise exception 'profiles.role can only be changed by an administrator';
  end if;
  if new.nutrition_plan_purchased is distinct from old.nutrition_plan_purchased then
    raise exception 'profiles.nutrition_plan_purchased is set by the payment webhook only';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_privileged_profile_columns on public.profiles;
create trigger protect_privileged_profile_columns
  before update on public.profiles
  for each row execute function public.protect_privileged_profile_columns();

-- 3 ── non-recursive admin read policy ───────────────────────────────
-- The original policy queried profiles from within a profiles policy
-- (recursion risk). Admins are recognised from the JWT app_metadata
-- claim; server-side admin tooling uses the service role anyway.
drop policy if exists "Admins view all profiles" on public.profiles;

create policy "Admins view all profiles"
  on public.profiles for select
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  );

commit;

-- Verification (run after applying):
--   update public.profiles set role = 'admin' where id = auth.uid();
--   → should fail with "can only be changed by an administrator"
