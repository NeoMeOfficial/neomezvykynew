-- Per-video availability override (Sam 2026-10-05):
--   NULL  = Auto (first no-equipment 15-min per category is free)
--   true  = always free, even without Plus
--   false = always Plus-only
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS free boolean;
