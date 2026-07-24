-- Real Cvičenia catalog — placeholders for Gabi's 18 recorded videos
-- (2026-07-24). Archives every previous exercise row (all were demo
-- placeholders — none has a video_url) and inserts one row per recorded
-- video. Gabi then only pastes the video URL (+ optionally a thumbnail)
-- into each row in Admin → Exercise Library.
--
-- Series numbering ("Core & brucho č. N") is derived from created_at
-- order, so the explicit timestamps below define the numbers shown in
-- the app. The diastasis-safe core video is inserted FIRST on purpose:
-- the free video of each focus is its first no-equipment 15-min one,
-- and the safest video is the right free sample.
--
-- Recorded inventory this mirrors:
--   15 min: core bez pomôcok ×3, core bez pomôcok (diastáza) ×1,
--           core s gumou (diastáza) ×1, celé telo s jednoručkami ×1,
--           celé telo s gumou ×2, celé telo bez pomôcok ×2
--   5 min:  core ×3, celé telo ×3, nohy/zadok ×2 (všetko bez pomôcok)
--           + diastáza-safe: core ×2, nohy/zadok ×2 (bez pomôcok)
--
-- Apply via Supabase Dashboard → SQL Editor. Safe to re-run
-- (ON CONFLICT DO NOTHING; archive UPDATE is idempotent).

BEGIN;

-- 1 · Archive the old demo rows (keeps ids referenced by favorites alive).
UPDATE public.exercises
SET status = 'archived', active = FALSE
WHERE content_type = 'exercise'
  AND id NOT LIKE 'cv-%';

-- 2 · Insert the real catalog. created_at defines series numbering.
INSERT INTO public.exercises
  (id, content_type, name, duration, category, body, equip, level, diastasis_safe, thumb, description, video_url, status, active, created_at)
VALUES
  -- ── 15 min · Core & brucho · bez pomôcok (č. 1 = diastáza-safe = free) ──
  ('cv-core-bez-15-1', 'exercise', 'Core 15min bez pomôcok #1 (diastáza)', '15 min', '15min', 'Core/Abs', 'Bez pomôcok', NULL, TRUE,  '/images/r9/lifestyle-core-workout.jpg', 'Jemné posilnenie stredu tela. Bezpečné aj pri diastáze.', NULL, 'published', TRUE, '2026-07-24 12:00:01+00'),
  ('cv-core-bez-15-2', 'exercise', 'Core 15min bez pomôcok #2',            '15 min', '15min', 'Core/Abs', 'Bez pomôcok', NULL, FALSE, '/images/r9/lifestyle-core-workout.jpg', 'Posilnenie stredu tela bez pomôcok.', NULL, 'published', TRUE, '2026-07-24 12:00:02+00'),
  ('cv-core-bez-15-3', 'exercise', 'Core 15min bez pomôcok #3',            '15 min', '15min', 'Core/Abs', 'Bez pomôcok', NULL, FALSE, '/images/r9/lifestyle-core-workout.jpg', 'Posilnenie stredu tela bez pomôcok.', NULL, 'published', TRUE, '2026-07-24 12:00:03+00'),
  ('cv-core-bez-15-4', 'exercise', 'Core 15min bez pomôcok #4',            '15 min', '15min', 'Core/Abs', 'Bez pomôcok', NULL, FALSE, '/images/r9/lifestyle-core-workout.jpg', 'Posilnenie stredu tela bez pomôcok.', NULL, 'published', TRUE, '2026-07-24 12:00:04+00'),

  -- ── 15 min · Core & brucho · s gumou (diastáza-safe) ──
  ('cv-core-guma-15-1', 'exercise', 'Core 15min s gumou #1 (diastáza)', '15 min', '15min', 'Core/Abs', 'S gumou', NULL, TRUE, '/images/r9/lifestyle-core-workout.jpg', 'Posilnenie stredu tela s gumou. Bezpečné aj pri diastáze.', NULL, 'published', TRUE, '2026-07-24 12:00:05+00'),

  -- ── 15 min · Celé telo ──
  ('cv-full-cinky-15-1', 'exercise', 'Celé telo 15min s jednoručkami #1', '15 min', '15min', 'Celé telo', 'S činkami', NULL, FALSE, '/images/r9/program-body-forming.jpg', 'Komplexný tréning celého tela s jednoručkami.', NULL, 'published', TRUE, '2026-07-24 12:00:06+00'),
  ('cv-full-guma-15-1',  'exercise', 'Celé telo 15min s gumou #1',        '15 min', '15min', 'Celé telo', 'S gumou',   NULL, FALSE, '/images/r9/program-body-forming.jpg', 'Komplexný tréning celého tela s gumou.', NULL, 'published', TRUE, '2026-07-24 12:00:07+00'),
  ('cv-full-guma-15-2',  'exercise', 'Celé telo 15min s gumou #2',        '15 min', '15min', 'Celé telo', 'S gumou',   NULL, FALSE, '/images/r9/program-body-forming.jpg', 'Komplexný tréning celého tela s gumou.', NULL, 'published', TRUE, '2026-07-24 12:00:08+00'),
  ('cv-full-bez-15-1',   'exercise', 'Celé telo 15min bez pomôcok #1',    '15 min', '15min', 'Celé telo', 'Bez pomôcok', NULL, FALSE, '/images/r9/program-body-forming.jpg', 'Komplexný tréning celého tela bez pomôcok.', NULL, 'published', TRUE, '2026-07-24 12:00:09+00'),
  ('cv-full-bez-15-2',   'exercise', 'Celé telo 15min bez pomôcok #2',    '15 min', '15min', 'Celé telo', 'Bez pomôcok', NULL, FALSE, '/images/r9/program-body-forming.jpg', 'Komplexný tréning celého tela bez pomôcok.', NULL, 'published', TRUE, '2026-07-24 12:00:10+00'),

  -- ── 5 min dopaľovačky · Core & brucho ──
  ('cv-core-bez-5-1', 'exercise', 'Core 5min dopaľovačka #1', '5 min', 'dopalovacka', 'Core/Abs', 'Bez pomôcok', NULL, FALSE, '/images/r9/lifestyle-core-workout.jpg', 'Krátka dopaľovačka na stred tela.', NULL, 'published', TRUE, '2026-07-24 12:00:11+00'),
  ('cv-core-bez-5-2', 'exercise', 'Core 5min dopaľovačka #2', '5 min', 'dopalovacka', 'Core/Abs', 'Bez pomôcok', NULL, FALSE, '/images/r9/lifestyle-core-workout.jpg', 'Krátka dopaľovačka na stred tela.', NULL, 'published', TRUE, '2026-07-24 12:00:12+00'),
  ('cv-core-bez-5-3', 'exercise', 'Core 5min dopaľovačka #3', '5 min', 'dopalovacka', 'Core/Abs', 'Bez pomôcok', NULL, FALSE, '/images/r9/lifestyle-core-workout.jpg', 'Krátka dopaľovačka na stred tela.', NULL, 'published', TRUE, '2026-07-24 12:00:13+00'),

  -- ── 5 min dopaľovačky · Celé telo ──
  ('cv-full-bez-5-1', 'exercise', 'Celé telo 5min dopaľovačka #1', '5 min', 'dopalovacka', 'Celé telo', 'Bez pomôcok', NULL, FALSE, '/images/r9/program-body-forming.jpg', 'Krátka dopaľovačka na celé telo.', NULL, 'published', TRUE, '2026-07-24 12:00:14+00'),
  ('cv-full-bez-5-2', 'exercise', 'Celé telo 5min dopaľovačka #2', '5 min', 'dopalovacka', 'Celé telo', 'Bez pomôcok', NULL, FALSE, '/images/r9/program-body-forming.jpg', 'Krátka dopaľovačka na celé telo.', NULL, 'published', TRUE, '2026-07-24 12:00:15+00'),
  ('cv-full-bez-5-3', 'exercise', 'Celé telo 5min dopaľovačka #3', '5 min', 'dopalovacka', 'Celé telo', 'Bez pomôcok', NULL, FALSE, '/images/r9/program-body-forming.jpg', 'Krátka dopaľovačka na celé telo.', NULL, 'published', TRUE, '2026-07-24 12:00:16+00'),

  -- ── 5 min dopaľovačky · Nohy & zadok ──
  ('cv-legs-bez-5-1', 'exercise', 'Nohy/zadok 5min dopaľovačka #1', '5 min', 'dopalovacka', 'Nohy/Zadok', 'Bez pomôcok', NULL, FALSE, '/images/r9/lifestyle-yoga-pose.jpg', 'Krátka dopaľovačka na nohy a zadok.', NULL, 'published', TRUE, '2026-07-24 12:00:17+00'),
  ('cv-legs-bez-5-2', 'exercise', 'Nohy/zadok 5min dopaľovačka #2', '5 min', 'dopalovacka', 'Nohy/Zadok', 'Bez pomôcok', NULL, FALSE, '/images/r9/lifestyle-yoga-pose.jpg', 'Krátka dopaľovačka na nohy a zadok.', NULL, 'published', TRUE, '2026-07-24 12:00:18+00'),

  -- ── 5 min dopaľovačky · diastáza-safe (doplnené Gabi 2026-07-24) ──
  ('cv-core-bez-5-4', 'exercise', 'Core 5min dopaľovačka #4 (diastáza)',       '5 min', 'dopalovacka', 'Core/Abs',   'Bez pomôcok', NULL, TRUE, '/images/r9/lifestyle-core-workout.jpg', 'Krátka dopaľovačka na stred tela. Bezpečné aj pri diastáze.', NULL, 'published', TRUE, '2026-07-24 12:00:19+00'),
  ('cv-core-bez-5-5', 'exercise', 'Core 5min dopaľovačka #5 (diastáza)',       '5 min', 'dopalovacka', 'Core/Abs',   'Bez pomôcok', NULL, TRUE, '/images/r9/lifestyle-core-workout.jpg', 'Krátka dopaľovačka na stred tela. Bezpečné aj pri diastáze.', NULL, 'published', TRUE, '2026-07-24 12:00:20+00'),
  ('cv-legs-bez-5-3', 'exercise', 'Nohy/zadok 5min dopaľovačka #3 (diastáza)', '5 min', 'dopalovacka', 'Nohy/Zadok', 'Bez pomôcok', NULL, TRUE, '/images/r9/lifestyle-yoga-pose.jpg', 'Krátka dopaľovačka na nohy a zadok. Bezpečné aj pri diastáze.', NULL, 'published', TRUE, '2026-07-24 12:00:21+00'),
  ('cv-legs-bez-5-4', 'exercise', 'Nohy/zadok 5min dopaľovačka #4 (diastáza)', '5 min', 'dopalovacka', 'Nohy/Zadok', 'Bez pomôcok', NULL, TRUE, '/images/r9/lifestyle-yoga-pose.jpg', 'Krátka dopaľovačka na nohy a zadok. Bezpečné aj pri diastáze.', NULL, 'published', TRUE, '2026-07-24 12:00:22+00')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verification:
--   SELECT id, name, duration, body, equip, diastasis_safe
--   FROM public.exercises
--   WHERE content_type = 'exercise' AND active
--   ORDER BY created_at;               -- expect exactly the 18 cv-* rows
