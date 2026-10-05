-- Onboarding feedback round (Sam 2026-10-05):
-- 1) preferred_name — what the user wants to be called; asked as the
--    first onboarding step, used by the home greeting (never the email
--    local-part again).
-- 2) meal_plan_waitlist — "tell me when the 6-week plan launches";
--    replaces the dead "V ponuke čoskoro" badge in onboarding-plus.

alter table public.profiles add column if not exists preferred_name text;

create table if not exists public.meal_plan_waitlist (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.meal_plan_waitlist enable row level security;

drop policy if exists "Users join waitlist" on public.meal_plan_waitlist;
create policy "Users join waitlist" on public.meal_plan_waitlist
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users see own waitlist row" on public.meal_plan_waitlist;
create policy "Users see own waitlist row" on public.meal_plan_waitlist
  for select using (auth.uid() = user_id);

drop policy if exists "Staff read waitlist" on public.meal_plan_waitlist;
create policy "Staff read waitlist" on public.meal_plan_waitlist
  for select using (public.is_staff());
