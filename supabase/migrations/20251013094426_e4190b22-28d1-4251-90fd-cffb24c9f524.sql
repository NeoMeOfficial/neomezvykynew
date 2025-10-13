-- Create shared access codes table for sharing calendar data
CREATE TABLE public.shared_access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(6) NOT NULL UNIQUE,
  owner_access_code VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.shared_access_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active shared codes (for validation)
CREATE POLICY "Anyone can view active shared codes"
ON public.shared_access_codes
FOR SELECT
USING (is_active = true AND expires_at > now());

-- Allow access code holders to create shared codes
CREATE POLICY "Access code holders can create shared codes"
ON public.shared_access_codes
FOR INSERT
WITH CHECK (owner_access_code IS NOT NULL);

-- Allow owners to update their shared codes
CREATE POLICY "Owners can update their shared codes"
ON public.shared_access_codes
FOR UPDATE
USING (owner_access_code IS NOT NULL);

-- Function to generate 6-character code
CREATE OR REPLACE FUNCTION public.generate_share_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;