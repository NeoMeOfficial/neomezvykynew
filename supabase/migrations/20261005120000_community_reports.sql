-- Community reports (Sam 2026-10-05): users can flag a post or reply
-- as inappropriate; reports feed the admin "Čaká na teba" panel.

create table if not exists public.community_reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  post_id     uuid not null,
  reply_id    uuid,
  reason      text,
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

-- One report per person per target.
create unique index if not exists community_reports_unique_uidx
  on public.community_reports (reporter_id, post_id, coalesce(reply_id, '00000000-0000-0000-0000-000000000000'::uuid));

alter table public.community_reports enable row level security;

drop policy if exists "Users file own reports" on public.community_reports;
create policy "Users file own reports" on public.community_reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists "Admin manages reports" on public.community_reports;
create policy "Admin manages reports" on public.community_reports
  for all using (public.is_admin()) with check (public.is_admin());
