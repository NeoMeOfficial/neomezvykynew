-- Exercises table — covers both strength exercises (TeloExtra) and stretches (TeloStrecing)
-- content_type = 'exercise' → TeloExtra.tsx
-- content_type = 'stretch'  → TeloStrecing.tsx
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('exercise', 'stretch')),
  name TEXT NOT NULL,
  duration TEXT DEFAULT '15 min',         -- '15 min' or '5 min'
  category TEXT,                           -- '15min' | 'dopalovacka' | 'quickstretch'
  body TEXT,                               -- 'Celé telo' | 'Core/Abs' | 'Nohy/Zadok' | 'Vršok/Stred tela' | 'Dolná časť tela'
  equip TEXT,                              -- 'Bez pomôcok' | 'S gumou' | 'S činkami'
  level INTEGER,                           -- 1-4, used by exercises only
  diastasis_safe BOOLEAN DEFAULT TRUE,     -- exercises only
  thumb TEXT,                              -- thumbnail image URL
  description TEXT,
  video_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active exercises are public" ON public.exercises
  FOR SELECT USING (active = true);

CREATE OR REPLACE FUNCTION public.set_exercises_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION public.set_exercises_updated_at();
