-- Ensure upsert works by creating a unique index on habit_entries for (habit_id, date, access_code)
CREATE UNIQUE INDEX IF NOT EXISTS ux_habit_entries_habit_date_code
ON public.habit_entries (habit_id, date, access_code);
