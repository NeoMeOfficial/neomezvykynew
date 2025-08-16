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