-- Recipes table — mirrors the Recipe interface in src/data/recipes.ts
CREATE TABLE IF NOT EXISTS public.recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ranajky', 'obed', 'vecera', 'snack', 'smoothie')),
  description TEXT,
  prep_time INTEGER DEFAULT 15,
  servings INTEGER DEFAULT 2,
  calories INTEGER DEFAULT 0,
  protein NUMERIC(5,1) DEFAULT 0,
  carbs NUMERIC(5,1) DEFAULT 0,
  fat NUMERIC(5,1) DEFAULT 0,
  fiber NUMERIC(5,1) DEFAULT 0,
  ingredients JSONB DEFAULT '[]',   -- [{ name: string, amount: string }]
  steps JSONB DEFAULT '[]',         -- string[]
  allergens JSONB DEFAULT '[]',     -- string[]
  dietary JSONB DEFAULT '[]',       -- string[]
  tags JSONB DEFAULT '[]',          -- string[]
  image TEXT,
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium')),
  pdf_path TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Anyone can read active recipes
CREATE POLICY "Active recipes are public" ON public.recipes
  FOR SELECT USING (active = true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_recipes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.set_recipes_updated_at();
