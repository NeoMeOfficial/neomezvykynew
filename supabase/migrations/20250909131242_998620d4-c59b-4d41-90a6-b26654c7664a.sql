-- Create access_codes table for pre-generated codes
CREATE TABLE public.access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(6) NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE NULL,
  used_by_user_id UUID NULL
);

-- Enable RLS
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for access codes
CREATE POLICY "Anyone can view unused codes for validation" 
ON public.access_codes 
FOR SELECT 
USING (NOT is_used);

CREATE POLICY "System can update codes when used" 
ON public.access_codes 
FOR UPDATE 
USING (true);

-- Create function to generate random 6-character codes
CREATE OR REPLACE FUNCTION public.generate_random_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Function to populate access codes table with 1000 unique codes
CREATE OR REPLACE FUNCTION public.populate_access_codes()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  codes_generated INTEGER := 0;
  max_attempts INTEGER := 2000; -- Allow more attempts than needed
  attempt_count INTEGER := 0;
  new_code TEXT;
BEGIN
  WHILE codes_generated < 1000 AND attempt_count < max_attempts LOOP
    new_code := generate_random_code();
    
    -- Try to insert the code, ignore if duplicate
    BEGIN
      INSERT INTO public.access_codes (code) VALUES (new_code);
      codes_generated := codes_generated + 1;
    EXCEPTION WHEN unique_violation THEN
      -- Code already exists, continue to next iteration
    END;
    
    attempt_count := attempt_count + 1;
  END LOOP;
  
  RETURN codes_generated;
END;
$$;

-- Generate the 1000 access codes
SELECT public.populate_access_codes();