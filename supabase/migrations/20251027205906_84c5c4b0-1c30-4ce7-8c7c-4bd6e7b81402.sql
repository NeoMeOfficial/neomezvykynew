-- Add new columns to cycle_tips table for 4 sections
ALTER TABLE cycle_tips ADD COLUMN IF NOT EXISTS expectation_text TEXT;
ALTER TABLE cycle_tips ADD COLUMN IF NOT EXISTS nutrition_text TEXT;
ALTER TABLE cycle_tips ADD COLUMN IF NOT EXISTS mind_text TEXT;
ALTER TABLE cycle_tips ADD COLUMN IF NOT EXISTS movement_text TEXT;
ALTER TABLE cycle_tips ADD COLUMN IF NOT EXISTS phase TEXT;
ALTER TABLE cycle_tips ADD COLUMN IF NOT EXISTS subphase TEXT;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_cycle_tips_day_phase ON cycle_tips(day, phase);
CREATE INDEX IF NOT EXISTS idx_cycle_tips_approved ON cycle_tips(is_approved, day);

-- Add comments for documentation
COMMENT ON COLUMN cycle_tips.expectation_text IS 'Čo môžem dnes očakávať? (1-2 vety, hormonálny kontext)';
COMMENT ON COLUMN cycle_tips.nutrition_text IS 'Strava: živiny + potraviny + tip';
COMMENT ON COLUMN cycle_tips.mind_text IS 'Myseľ: insight + návyk + benefit + myšlienka';
COMMENT ON COLUMN cycle_tips.movement_text IS 'Pohyb: hormonálny kontext + intenzita + NeoMe + kardio + prechádzka';
COMMENT ON COLUMN cycle_tips.phase IS 'menstrual / follicular / ovulation / luteal';
COMMENT ON COLUMN cycle_tips.subphase IS 'early / mid / late (len pre luteálnu fázu)';