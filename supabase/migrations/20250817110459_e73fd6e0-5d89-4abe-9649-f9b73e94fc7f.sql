-- Fix function search path issues
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the existing handle_anonymous_user function as well
CREATE OR REPLACE FUNCTION public.handle_anonymous_user()
RETURNS trigger AS $$
BEGIN
  -- Allow anonymous users to have basic functionality
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;