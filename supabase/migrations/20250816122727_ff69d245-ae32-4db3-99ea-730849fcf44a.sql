-- Fix security vulnerability: Implement proper user isolation for anonymous users
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow anonymous access to habits" ON public.habits;
DROP POLICY IF EXISTS "Allow anonymous access to habit entries" ON public.habit_entries;

-- Create secure policies that isolate user data properly
-- For habits table: Users can only access their own habits
CREATE POLICY "Users can view their own habits" 
ON public.habits 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid()::text = user_id::text
    ELSE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  END
);

CREATE POLICY "Users can create their own habits" 
ON public.habits 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid()::text = user_id::text
    ELSE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  END
);

CREATE POLICY "Users can update their own habits" 
ON public.habits 
FOR UPDATE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid()::text = user_id::text
    ELSE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  END
);

CREATE POLICY "Users can delete their own habits" 
ON public.habits 
FOR DELETE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid()::text = user_id::text
    ELSE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  END
);

-- For habit_entries table: Users can only access their own entries
CREATE POLICY "Users can view their own habit entries" 
ON public.habit_entries 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid()::text = user_id::text
    ELSE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  END
);

CREATE POLICY "Users can create their own habit entries" 
ON public.habit_entries 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid()::text = user_id::text
    ELSE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  END
);

CREATE POLICY "Users can update their own habit entries" 
ON public.habit_entries 
FOR UPDATE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid()::text = user_id::text
    ELSE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  END
);

CREATE POLICY "Users can delete their own habit entries" 
ON public.habit_entries 
FOR DELETE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid()::text = user_id::text
    ELSE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  END
);