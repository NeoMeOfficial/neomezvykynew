-- Update existing entries to use a default access code for recovery
UPDATE public.habit_entries 
SET access_code = 'OCEAN-GRAPE-8660' 
WHERE access_code IS NULL;