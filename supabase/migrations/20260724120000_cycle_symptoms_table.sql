-- cycle_symptoms — per-day symptom log (Periodka "Ako sa dnes cítiš" chips
-- + retroactive edits from the calendar day-detail sheet).
--
-- Live bug (2026-07-24): the table was defined only in 001_initial_schema,
-- which was never applied to the production database (see the note in
-- 20260520120000_cycle_data_table.sql — cycle_data "never existed" either).
-- Every symptom upsert therefore failed silently and entries vanished on
-- refresh even for Plus users.
--
-- Idempotent: safe to run even if some environment already has the table.
-- Apply in the Supabase SQL editor.

create table if not exists public.cycle_symptoms (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,
  symptoms    jsonb not null default '{}'::jsonb,  -- { "fatigue": 1, "custom:<uuid>": 1, ... }
  notes       text,
  created_at  timestamptz not null default now(),
  unique (user_id, date)                            -- upsert onConflict: 'user_id,date'
);

alter table public.cycle_symptoms enable row level security;

drop policy if exists "Users manage own symptoms" on public.cycle_symptoms;
create policy "Users manage own symptoms" on public.cycle_symptoms
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_cycle_symptoms_user_date
  on public.cycle_symptoms (user_id, date);

-- ── cycle_data safety net ────────────────────────────────────────────
-- The client upserts these columns; make sure they exist regardless of
-- which historical CREATE TABLE variant the live DB ended up with.
alter table public.cycle_data add column if not exists history           jsonb not null default '[]'::jsonb;
alter table public.cycle_data add column if not exists daily_period_data jsonb not null default '[]'::jsonb;
alter table public.cycle_data add column if not exists custom_settings   jsonb not null default '{}'::jsonb;
alter table public.cycle_data add column if not exists updated_at        timestamptz not null default now();

-- Verification (run after applying):
--   select to_regclass('public.cycle_symptoms');          -- not null
--   insert works from the app: tap a symptom, refresh, it stays.
