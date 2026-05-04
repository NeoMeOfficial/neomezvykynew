-- Phase 3: Add status enum to programmes table.
-- Mirrors the same pattern applied to exercises and meditations in Phase 2.
-- The schedule JSONB column already exists; we document its v2 structure here:
--
--   schedule: Array<{
--     weekNumber: number,
--     title: string,           -- e.g. "Týždeň 1 — Budujeme základy"
--     days: Array<{
--       dayName: string,       -- 'Pondelok' | 'Utorok' | ... | 'Piatok'
--       type: 'exercise' | 'meditation' | 'rest',
--       contentId: string,     -- exercises.id or meditations.id (empty until picked)
--       message: string,       -- optional Gabi motivational message
--     }>
--   }>

ALTER TABLE public.programmes
  ADD COLUMN IF NOT EXISTS status TEXT
    CHECK (status IN ('draft', 'published', 'archived'))
    DEFAULT 'draft';

-- Backfill: active=true → published, active=false → draft
UPDATE public.programmes
  SET status = CASE WHEN active THEN 'published' ELSE 'draft' END
  WHERE status IS NULL OR status = 'draft';

-- Drop the old RLS policy and replace with status-based one
DROP POLICY IF EXISTS "Active programmes are public" ON public.programmes;

CREATE POLICY "Published programmes are public" ON public.programmes
  FOR SELECT USING (status = 'published');
