-- Add 'daily_plan' to the allowed categories in cycle_tips
ALTER TABLE cycle_tips DROP CONSTRAINT IF EXISTS cycle_tips_category_check;

ALTER TABLE cycle_tips ADD CONSTRAINT cycle_tips_category_check 
CHECK (category = ANY (ARRAY['energy'::text, 'mood'::text, 'nutrition'::text, 'activity'::text, 'self_care'::text, 'general'::text, 'daily_plan'::text]));