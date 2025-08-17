-- Step 1: Add access_code column to both tables
ALTER TABLE public.habits ADD COLUMN access_code VARCHAR(20);
ALTER TABLE public.habit_entries ADD COLUMN access_code VARCHAR(20);

-- Step 2: Create indexes for performance
CREATE INDEX idx_habits_access_code ON public.habits(access_code);
CREATE INDEX idx_habit_entries_access_code ON public.habit_entries(access_code);

-- Step 3: Update RLS policies for habits table
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can create their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;

CREATE POLICY "Access code holders can view habits" ON public.habits
FOR SELECT USING (access_code IS NOT NULL);

CREATE POLICY "Access code holders can create habits" ON public.habits
FOR INSERT WITH CHECK (access_code IS NOT NULL);

CREATE POLICY "Access code holders can update their habits" ON public.habits
FOR UPDATE USING (access_code IS NOT NULL);

CREATE POLICY "Access code holders can delete their habits" ON public.habits
FOR DELETE USING (access_code IS NOT NULL);

-- Step 4: Update RLS policies for habit_entries table  
DROP POLICY IF EXISTS "Users can view their own habit entries" ON public.habit_entries;
DROP POLICY IF EXISTS "Users can create their own habit entries" ON public.habit_entries;
DROP POLICY IF EXISTS "Users can update their own habit entries" ON public.habit_entries;
DROP POLICY IF EXISTS "Users can delete their own habit entries" ON public.habit_entries;

CREATE POLICY "Access code holders can view habit entries" ON public.habit_entries
FOR SELECT USING (access_code IS NOT NULL);

CREATE POLICY "Access code holders can create habit entries" ON public.habit_entries  
FOR INSERT WITH CHECK (access_code IS NOT NULL);

CREATE POLICY "Access code holders can update their habit entries" ON public.habit_entries
FOR UPDATE USING (access_code IS NOT NULL);

CREATE POLICY "Access code holders can delete their habit entries" ON public.habit_entries
FOR DELETE USING (access_code IS NOT NULL);

-- Step 5: Create function to generate random codes
CREATE OR REPLACE FUNCTION public.generate_access_code()
RETURNS TEXT AS $$
DECLARE
  words TEXT[] := ARRAY['apple', 'beach', 'chair', 'dance', 'eagle', 'flame', 'grape', 'house', 'island', 'jungle', 'kite', 'lemon', 'magic', 'night', 'ocean', 'piano', 'quiet', 'river', 'stone', 'tower', 'under', 'voice', 'water', 'young', 'zebra'];
  word1 TEXT;
  word2 TEXT;
  number_part TEXT;
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Pick two random words
    word1 := words[1 + floor(random() * array_length(words, 1))::int];
    word2 := words[1 + floor(random() * array_length(words, 1))::int];
    
    -- Generate 4 digit number
    number_part := lpad(floor(random() * 10000)::text, 4, '0');
    
    -- Combine into format: WORD-WORD-####
    code := upper(word1) || '-' || upper(word2) || '-' || number_part;
    
    -- Check if code already exists in either table
    SELECT EXISTS(
      SELECT 1 FROM public.habits WHERE access_code = code
      UNION
      SELECT 1 FROM public.habit_entries WHERE access_code = code
    ) INTO code_exists;
    
    -- If code doesn't exist, return it
    IF NOT code_exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;