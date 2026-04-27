-- ============================================================
-- F-001 / F-002 / F-011 · Daily content rotation + phase advice
-- ============================================================
-- Builds on the existing 20260416 content tables:
--   public.meditations  → adds featured_on date (Domov "Meditácia dňa")
--   public.recipes      → adds featured_on date (Strava "Recept dňa")
-- and introduces:
--   public.phase_advice → 12 rows (3 × 4 cycle phases) used by Periodka
--                         "Ako sa môžeš cítiť ešte lepšie".
-- ============================================================

-- ── 1. meditations.featured_on ──────────────────────────────
ALTER TABLE public.meditations
  ADD COLUMN IF NOT EXISTS featured_on DATE;

COMMENT ON COLUMN public.meditations.featured_on IS 'When set to today''s date, this row is the "Meditácia dňa" on Domov. Otherwise client falls back to deterministic dayOfYear pick. F-001.';

CREATE INDEX IF NOT EXISTS idx_meditations_featured_on ON public.meditations(featured_on);

-- ── 2. recipes.featured_on ──────────────────────────────────
ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS featured_on DATE;

COMMENT ON COLUMN public.recipes.featured_on IS 'When set to today''s date, this row is the "Recept dňa" on Strava + Domov. Otherwise client falls back to deterministic dayOfYear pick. F-002.';

CREATE INDEX IF NOT EXISTS idx_recipes_featured_on ON public.recipes(featured_on);

-- ── 3. phase_advice ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.phase_advice (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_key     TEXT NOT NULL CHECK (phase_key IN ('menstrual', 'follicular', 'ovulation', 'luteal')),
  pillar        TEXT NOT NULL CHECK (pillar IN ('telo', 'strava', 'mysel')),
  title         TEXT NOT NULL,
  body_text     TEXT NOT NULL,
  image_key     TEXT,
  target_path   TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.phase_advice IS 'Phase-tailored advice rendered on Periodka under "Ako sa môžeš cítiť ešte lepšie". Three rows per phase × four phases = twelve. F-011.';
COMMENT ON COLUMN public.phase_advice.phase_key   IS 'Cycle phase key matching useCycleData currentPhase.key.';
COMMENT ON COLUMN public.phase_advice.pillar      IS 'Pillar tone for the row icon/accent: telo / strava / mysel.';
COMMENT ON COLUMN public.phase_advice.target_path IS 'Optional in-app route this advice deep-links to (e.g. /strava/recepty).';

CREATE INDEX IF NOT EXISTS idx_phase_advice_phase_key ON public.phase_advice(phase_key);

ALTER TABLE public.phase_advice ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active phase advice is public" ON public.phase_advice;
CREATE POLICY "Active phase advice is public" ON public.phase_advice
  FOR SELECT USING (active = true);

-- Seed — 3 rows per phase. Slovak copy in voice with the rest of the redesign.
INSERT INTO public.phase_advice (phase_key, pillar, title, body_text, sort_order, target_path) VALUES
  ('menstrual',  'mysel',  'Spomaľ a počúvaj telo',           'Prvé dni cyklu sú o jemnosti. Vyhraď si pokojný čas sama pre seba.',      1, '/mysel'),
  ('menstrual',  'telo',   'Jemný strečing namiesto cvičenia', 'Vyber si krátky strečing alebo prechádzku — telo ti poďakuje.',          2, '/kniznica/telo/strecing'),
  ('menstrual',  'strava', 'Železo z teplých jedál',          'Polievky, dusené strukoviny a pečené korenistá zelenina podporia hladinu železa.', 3, '/strava'),

  ('follicular', 'telo',   'Energia rastie — využi ju',       'Dobré dni na nový program alebo intenzívnejšie cvičenie.',                1, '/kniznica/telo'),
  ('follicular', 'mysel',  'Plánuj a tvor',                   'Hormóny ti pomáhajú s jasnosťou — naplánuj si týždeň alebo začni nový projekt.', 2, '/mysel'),
  ('follicular', 'strava', 'Ľahké, čerstvé chute',            'Šaláty, smoothies a celozrnné jedlá ti dodajú trvalú energiu.',          3, '/strava/recepty'),

  ('ovulation',  'telo',   'Tvoj najsilnejší týždeň',         'Sila aj rýchlosť sú teraz najvyššie. Vyzvi sa na intenzívnejšie cvičenie.', 1, '/kniznica/telo/extra'),
  ('ovulation',  'mysel',  'Spojenie s ostatnými',            'Prirodzene sa otváraš — využi to na rozhovor, ktorý si odkladala.',     2, '/komunita'),
  ('ovulation',  'strava', 'Antioxidanty pre vajíčko',        'Bobuľoviny, zelená listová zelenina a orechy podporujú zdravú ovuláciu.', 3, '/strava/recepty'),

  ('luteal',     'mysel',  'Buď k sebe láskavá',              'Predmenštruácia môže byť ťažká — doprajte si viac odpočinku.',            1, '/dennik'),
  ('luteal',     'telo',   'Joga a strečing',                 'Vyhni sa intenzite. Mäkký pohyb tlmí PMS.',                              2, '/kniznica/telo/strecing'),
  ('luteal',     'strava', 'Komplexné sacharidy a horčík',    'Banán, tmavá čokoláda a celozrnný chlieb tlmia chute na sladké.',        3, '/strava/recepty')
ON CONFLICT DO NOTHING;
