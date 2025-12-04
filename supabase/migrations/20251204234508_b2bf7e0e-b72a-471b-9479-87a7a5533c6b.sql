-- Create phase_tips table for phase-based tips (11 rows instead of 300+)
CREATE TABLE public.phase_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase TEXT NOT NULL,
  subphase TEXT,
  expectation_text TEXT NOT NULL,
  mind_text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(phase, subphase)
);

-- Enable RLS
ALTER TABLE public.phase_tips ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved tips
CREATE POLICY "Anyone can view approved phase tips"
ON public.phase_tips
FOR SELECT
USING (is_approved = true);

-- Server can manage all tips
CREATE POLICY "Server can manage all phase tips"
ON public.phase_tips
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_phase_tips_updated_at
BEFORE UPDATE ON public.phase_tips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing approved expectation and mind texts from cycle_tips
-- We'll pick the best texts for each phase/subphase combination
INSERT INTO public.phase_tips (phase, subphase, expectation_text, mind_text, is_approved)
SELECT DISTINCT ON (phase, subphase)
  phase,
  subphase,
  expectation_text,
  mind_text,
  true
FROM public.cycle_tips
WHERE is_approved = true 
  AND cycle_length = 28
  AND expectation_text IS NOT NULL 
  AND mind_text IS NOT NULL
ORDER BY phase, subphase, day;