-- ============================================================
-- F-006 · User active program (Mondays-only start date)
-- ============================================================
-- The redesign's ProgramDetail "Aktivovať program · DD. mes" CTA needs
-- somewhere to write the chosen start Monday. Existing tables don't
-- have this concept (program_purchases tracks purchased programs;
-- program_progress tracks completed exercises). This migration adds
-- a lightweight one-row-per-user table for "currently active program
-- and start date".
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_active_programs (
  user_id      UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id   TEXT NOT NULL,
  start_date   DATE NOT NULL,
  activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_active_programs_start_is_monday
    CHECK (EXTRACT(ISODOW FROM start_date) = 1)
);

COMMENT ON TABLE  public.user_active_programs IS 'Currently active program per user with chosen Monday start. Replaces row on activation. F-006.';
COMMENT ON COLUMN public.user_active_programs.start_date IS 'Must be a Monday (DB-enforced via ISODOW=1). Picker on ProgramDetail constrains the input client-side.';

ALTER TABLE public.user_active_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own active program" ON public.user_active_programs;
CREATE POLICY "Users manage own active program" ON public.user_active_programs
  FOR ALL USING (auth.uid() = user_id);
