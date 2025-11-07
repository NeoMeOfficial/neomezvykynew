-- Remove the old constraint that limits days to 1-28
ALTER TABLE public.cycle_tips 
  DROP CONSTRAINT IF EXISTS cycle_tips_day_check;

-- Add new constraint allowing days 1-35 (matching max cycle_length)
ALTER TABLE public.cycle_tips 
  ADD CONSTRAINT cycle_tips_day_check CHECK (day >= 1 AND day <= 35);

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT cycle_tips_day_check ON public.cycle_tips 
  IS 'Day must be between 1 and 35 to support all cycle lengths (25-35 days)';