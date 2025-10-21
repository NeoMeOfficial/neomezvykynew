-- Drop old columns and add new day column to cycle_tips
ALTER TABLE public.cycle_tips 
  DROP COLUMN IF EXISTS phase,
  DROP COLUMN IF EXISTS day_range,
  ADD COLUMN IF NOT EXISTS day integer NOT NULL DEFAULT 1;

-- Add constraint to ensure day is between 1 and 28
ALTER TABLE public.cycle_tips 
  ADD CONSTRAINT cycle_tips_day_check CHECK (day >= 1 AND day <= 28);

-- Create index on day for better query performance
CREATE INDEX IF NOT EXISTS idx_cycle_tips_day ON public.cycle_tips(day);

-- Create index on day + category for better query performance
CREATE INDEX IF NOT EXISTS idx_cycle_tips_day_category ON public.cycle_tips(day, category);