-- Free-text day note in Periodka (Gabi 2026-08-13).
-- Shown as a pen icon in the cycle calendar; editable retroactively
-- from the day-detail sheet. Apply via the Supabase dashboard SQL editor.
alter table public.cycle_symptoms
  add column if not exists note text;
