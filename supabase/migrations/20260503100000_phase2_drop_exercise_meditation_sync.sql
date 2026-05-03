-- Phase 2: Admin tabs for exercises and meditations now write `status` directly.
-- Drop the legacy sync triggers (active → status) for these two tables.
-- The `active` column is kept for now; both columns stay in sync via the admin code.

DROP TRIGGER IF EXISTS sync_exercises_active_to_status ON public.exercises;
DROP FUNCTION IF EXISTS public.sync_exercises_active_to_status();

DROP TRIGGER IF EXISTS sync_meditations_active_to_status ON public.meditations;
DROP FUNCTION IF EXISTS public.sync_meditations_active_to_status();
