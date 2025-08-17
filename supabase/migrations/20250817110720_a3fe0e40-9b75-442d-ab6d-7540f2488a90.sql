-- Make user_id nullable since we're using access_code instead
ALTER TABLE public.habits ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.habit_entries ALTER COLUMN user_id DROP NOT NULL;

-- Add default values for user_id to avoid breaking changes
ALTER TABLE public.habits ALTER COLUMN user_id SET DEFAULT gen_random_uuid();
ALTER TABLE public.habit_entries ALTER COLUMN user_id SET DEFAULT gen_random_uuid();