-- Programmes table — fitness programmes with full week/day schedule stored as JSONB
-- The schedule field mirrors the admin schedule builder structure:
-- schedule: [{ title: string, days: [{ videoUrl: string, message: string, isRest: boolean }] }]
CREATE TABLE IF NOT EXISTS public.programmes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER,
  weeks INTEGER DEFAULT 8,
  description TEXT,
  detailed_description TEXT,
  image TEXT,
  schedule JSONB DEFAULT '[]',   -- Array<{ title: string, days: Array<{ videoUrl, message, isRest }> }>
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active programmes are public" ON public.programmes
  FOR SELECT USING (active = true);

CREATE OR REPLACE FUNCTION public.set_programmes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER programmes_updated_at
  BEFORE UPDATE ON public.programmes
  FOR EACH ROW EXECUTE FUNCTION public.set_programmes_updated_at();
