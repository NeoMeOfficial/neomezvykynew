-- Fix security vulnerability with proper type handling
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow anonymous access to habits" ON public.habits;
DROP POLICY IF EXISTS "Allow anonymous access to habit entries" ON public.habit_entries;

-- Create secure policies for authenticated users only
-- For habits table: Users can only access their own habits
CREATE POLICY "Users can view their own habits" 
ON public.habits 
FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own habits" 
ON public.habits 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own habits" 
ON public.habits 
FOR UPDATE 
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own habits" 
ON public.habits 
FOR DELETE 
TO authenticated
USING (auth.uid()::text = user_id);

-- For habit_entries table: Users can only access their own entries
CREATE POLICY "Users can view their own habit entries" 
ON public.habit_entries 
FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own habit entries" 
ON public.habit_entries 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own habit entries" 
ON public.habit_entries 
FOR UPDATE 
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own habit entries" 
ON public.habit_entries 
FOR DELETE 
TO authenticated
USING (auth.uid()::text = user_id);

-- Enable anonymous access for a secure anonymous session approach
-- This will require implementing proper anonymous auth in the application
CREATE POLICY "Allow anon access to their own habits" 
ON public.habits 
FOR ALL 
TO anon
USING (user_id = current_setting('app.current_user_id', true))
WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Allow anon access to their own habit entries" 
ON public.habit_entries 
FOR ALL 
TO anon
USING (user_id = current_setting('app.current_user_id', true))
WITH CHECK (user_id = current_setting('app.current_user_id', true));