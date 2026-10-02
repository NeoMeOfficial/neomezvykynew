-- Program completion history (Sam 2026-10-02): ending a program used to
-- DELETE the enrollment, so "did she finish it / when / how far" was
-- unanswerable. Ends now archive into this append-only log; the active
-- table keeps its one-row-per-user shape so every existing reader
-- (useActiveProgram, push cron, program-event) is untouched.

create table if not exists public.user_program_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id text not null,
  start_date date not null,
  activated_at timestamptz,
  ended_at timestamptz not null default now(),
  -- paused | canceled | completed (user's choice when ending)
  -- replaced = a new program activation displaced this one
  status text not null check (status in ('paused', 'canceled', 'completed', 'replaced')),
  weeks_reached int
);

create index if not exists user_program_history_user_idx
  on public.user_program_history (user_id, ended_at desc);

alter table public.user_program_history enable row level security;

drop policy if exists "Users read own program history" on public.user_program_history;
create policy "Users read own program history" on public.user_program_history
  for select using (auth.uid() = user_id);

-- The archive insert happens client-side at the moment of ending, with
-- the user's own session. Insert-only; no update/delete for users.
drop policy if exists "Users log own program history" on public.user_program_history;
create policy "Users log own program history" on public.user_program_history
  for insert with check (auth.uid() = user_id);

drop policy if exists "Admin can manage user_program_history" on public.user_program_history;
create policy "Admin can manage user_program_history" on public.user_program_history
  for all using (public.is_admin()) with check (public.is_admin());
