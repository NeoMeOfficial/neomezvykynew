-- Update RLS policies to allow anonymous users
-- First, drop existing policies
DROP POLICY IF EXISTS "Users can create their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;

DROP POLICY IF EXISTS "Users can create their own habit entries" ON public.habit_entries;
DROP POLICY IF EXISTS "Users can delete their own habit entries" ON public.habit_entries;
DROP POLICY IF EXISTS "Users can update their own habit entries" ON public.habit_entries;
DROP POLICY IF EXISTS "Users can view their own habit entries" ON public.habit_entries;

-- Create new policies that allow anonymous users
-- For habits table
CREATE POLICY "Allow anonymous access to habits" 
ON public.habits 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- For habit_entries table
CREATE POLICY "Allow anonymous access to habit entries" 
ON public.habit_entries 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create default habits for anonymous users
INSERT INTO public.habits (id, name, emoji, color, target, unit, user_id)
VALUES 
  ('default-water', 'Hydratácia', '💧', '#80B9C8', 2, 'L', '00000000-0000-0000-0000-000000000000'),
  ('default-steps', 'Pohyb', '👟', '#E5B050', 10000, 'krokov', '00000000-0000-0000-0000-000000000000'),
  ('default-nutrition', 'Výživa', '🥗', '#B2D9C4', 3, 'jedál', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;