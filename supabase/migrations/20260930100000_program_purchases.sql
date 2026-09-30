-- Program-only access (Sam 2026-09-30): subscribers get every program;
-- selected users (e.g. legacy buyers of a single programme) get access
-- to exactly ONE program and nothing else in the app. Grants are managed
-- from the admin Users tab.

create table if not exists public.program_purchases (
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id text not null,
  granted_at timestamptz not null default now(),
  granted_by text,
  note text,
  primary key (user_id, program_id)
);

alter table public.program_purchases enable row level security;

drop policy if exists "Users read own program purchases" on public.program_purchases;
create policy "Users read own program purchases" on public.program_purchases
  for select using (auth.uid() = user_id);

drop policy if exists "Admin can manage program_purchases" on public.program_purchases;
create policy "Admin can manage program_purchases" on public.program_purchases
  for all using (public.is_admin()) with check (public.is_admin());
