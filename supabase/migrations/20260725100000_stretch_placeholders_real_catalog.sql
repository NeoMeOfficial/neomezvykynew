-- Real Strečing catalog — placeholders for Gabi's 10 recorded stretch
-- videos (2026-07-25). Companion to 20260724150000 (exercises).
--
-- NOTE: the canonical apply path is the Admin → Exercise Library →
-- "Import katalógu" button (it archives old demo rows and upserts the
-- static catalog from src/data/teloStrecingData.ts). This file exists
-- so the repo's migrations reflect the intended DB state; running it
-- directly is equivalent and idempotent.
--
-- Recorded inventory:
--   15 min: celé telo bez pomôcok ×4, celé telo s gumou ×1
--   5 min rýchla úľava: celé telo bez pomôcok ×3, vršok/stred ×2

BEGIN;

UPDATE public.exercises
SET status = 'archived', active = FALSE
WHERE content_type = 'stretch'
  AND id NOT LIKE 'cvs-%';

INSERT INTO public.exercises
  (id, content_type, name, duration, category, body, equip, level, diastasis_safe, thumb, description, video_url, status, active, created_at)
VALUES
  ('cvs-full-bez-15-1', 'stretch', 'Strečing celé telo 15min bez pomôcok #1', '15 min', '15min', 'Celé telo', 'Bez pomôcok', NULL, TRUE, '/images/r9/hero-yoga.jpg', 'Uvoľnenie celého tela bez pomôcok.', NULL, 'published', TRUE, '2026-07-25 12:00:01+00'),
  ('cvs-full-bez-15-2', 'stretch', 'Strečing celé telo 15min bez pomôcok #2', '15 min', '15min', 'Celé telo', 'Bez pomôcok', NULL, TRUE, '/images/r9/hero-yoga.jpg', 'Uvoľnenie celého tela bez pomôcok.', NULL, 'published', TRUE, '2026-07-25 12:00:02+00'),
  ('cvs-full-bez-15-3', 'stretch', 'Strečing celé telo 15min bez pomôcok #3', '15 min', '15min', 'Celé telo', 'Bez pomôcok', NULL, TRUE, '/images/r9/hero-yoga.jpg', 'Uvoľnenie celého tela bez pomôcok.', NULL, 'published', TRUE, '2026-07-25 12:00:03+00'),
  ('cvs-full-bez-15-4', 'stretch', 'Strečing celé telo 15min bez pomôcok #4', '15 min', '15min', 'Celé telo', 'Bez pomôcok', NULL, TRUE, '/images/r9/hero-yoga.jpg', 'Uvoľnenie celého tela bez pomôcok.', NULL, 'published', TRUE, '2026-07-25 12:00:04+00'),
  ('cvs-full-guma-15-1', 'stretch', 'Strečing celé telo 15min s gumou #1', '15 min', '15min', 'Celé telo', 'S gumou', NULL, TRUE, '/images/r9/hero-yoga.jpg', 'Hlbšie uvoľnenie celého tela s gumou.', NULL, 'published', TRUE, '2026-07-25 12:00:05+00'),
  ('cvs-full-bez-5-1', 'stretch', 'Rýchla úľava celé telo #1', '5 min', 'quickstretch', 'Celé telo', 'Bez pomôcok', NULL, TRUE, '/images/r9/hero-yoga.jpg', 'Krátka úľava pre celé telo.', NULL, 'published', TRUE, '2026-07-25 12:00:06+00'),
  ('cvs-full-bez-5-2', 'stretch', 'Rýchla úľava celé telo #2', '5 min', 'quickstretch', 'Celé telo', 'Bez pomôcok', NULL, TRUE, '/images/r9/hero-yoga.jpg', 'Krátka úľava pre celé telo.', NULL, 'published', TRUE, '2026-07-25 12:00:07+00'),
  ('cvs-full-bez-5-3', 'stretch', 'Rýchla úľava celé telo #3', '5 min', 'quickstretch', 'Celé telo', 'Bez pomôcok', NULL, TRUE, '/images/r9/hero-yoga.jpg', 'Krátka úľava pre celé telo.', NULL, 'published', TRUE, '2026-07-25 12:00:08+00'),
  ('cvs-upper-bez-5-1', 'stretch', 'Rýchla úľava vršok/stred tela #1', '5 min', 'quickstretch', 'Vršok/Stred tela', 'Bez pomôcok', NULL, TRUE, '/images/r9/lifestyle-yoga-pose.jpg', 'Krátke uvoľnenie ramien, krku a chrbtice.', NULL, 'published', TRUE, '2026-07-25 12:00:09+00'),
  ('cvs-upper-bez-5-2', 'stretch', 'Rýchla úľava vršok/stred tela #2', '5 min', 'quickstretch', 'Vršok/Stred tela', 'Bez pomôcok', NULL, TRUE, '/images/r9/lifestyle-yoga-pose.jpg', 'Krátke uvoľnenie ramien, krku a chrbtice.', NULL, 'published', TRUE, '2026-07-25 12:00:10+00')
ON CONFLICT (id) DO NOTHING;

COMMIT;
