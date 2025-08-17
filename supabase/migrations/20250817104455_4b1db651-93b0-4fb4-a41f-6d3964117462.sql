
-- 1) Ensure upsert works by adding a composite unique constraint
ALTER TABLE public.habit_entries
ADD CONSTRAINT habit_entries_unique_user_habit_date
UNIQUE (user_id, habit_id, date);

-- 2) Keep data consistent by linking entries to habits
ALTER TABLE public.habit_entries
ADD CONSTRAINT habit_entries_habit_id_fkey
FOREIGN KEY (habit_id) REFERENCES public.habits (id)
ON DELETE CASCADE;

-- 3) Keep updated_at accurate (function exists, add triggers)
DROP TRIGGER IF EXISTS set_updated_at_habit_entries ON public.habit_entries;
CREATE TRIGGER set_updated_at_habit_entries
BEFORE UPDATE ON public.habit_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_habits ON public.habits;
CREATE TRIGGER set_updated_at_habits
BEFORE UPDATE ON public.habits
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
