-- Create table for cycle tips
CREATE TABLE IF NOT EXISTS public.cycle_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase TEXT NOT NULL CHECK (phase IN ('menstruation', 'follicular', 'ovulation', 'luteal')),
  day_range TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('energy', 'mood', 'nutrition', 'activity', 'self_care', 'general')),
  tip_text TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT NOT NULL DEFAULT 'ai' CHECK (created_by IN ('ai', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cycle_tips ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read approved tips
CREATE POLICY "Anyone can view approved tips"
  ON public.cycle_tips
  FOR SELECT
  USING (is_approved = true);

-- Policy: Server can manage all tips (for admin interface and AI generation)
CREATE POLICY "Server can manage all tips"
  ON public.cycle_tips
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_cycle_tips_phase_approved ON public.cycle_tips(phase, is_approved);
CREATE INDEX idx_cycle_tips_day_range ON public.cycle_tips(day_range);

-- Trigger to update updated_at
CREATE TRIGGER update_cycle_tips_updated_at
  BEFORE UPDATE ON public.cycle_tips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();