-- Add cycle_length column to cycle_tips table for dynamic cycle lengths (25-35 days)
ALTER TABLE cycle_tips ADD COLUMN IF NOT EXISTS cycle_length INTEGER DEFAULT 28;

-- Add index for faster queries by cycle_length
CREATE INDEX IF NOT EXISTS idx_cycle_tips_cycle_length ON cycle_tips(cycle_length);

-- Add constraint: cycle length must be between 25 and 35 days
ALTER TABLE cycle_tips ADD CONSTRAINT check_cycle_length CHECK (cycle_length >= 25 AND cycle_length <= 35);

-- Add comment explaining the column
COMMENT ON COLUMN cycle_tips.cycle_length IS 'Length of menstrual cycle in days (25-35). Used to generate personalized daily plans for different cycle lengths.';