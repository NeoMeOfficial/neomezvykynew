-- Meditations table — mirrors the inline data in src/pages/v2/MyselNew.tsx
CREATE TABLE IF NOT EXISTS public.meditations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT DEFAULT '5 min',
  description TEXT,
  audio_url TEXT,
  image TEXT,
  category TEXT,     -- 'Stres' | 'Mindfulness' | 'Materstvo' | 'Emócie' | 'Ja'
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active meditations are public" ON public.meditations
  FOR SELECT USING (active = true);

CREATE OR REPLACE FUNCTION public.set_meditations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER meditations_updated_at
  BEFORE UPDATE ON public.meditations
  FOR EACH ROW EXECUTE FUNCTION public.set_meditations_updated_at();
