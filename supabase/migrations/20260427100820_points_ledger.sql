-- ============================================================
-- F-017 · Points ledger
-- ============================================================
-- The "bodov" (points) economy in the redesign is conceptually distinct
-- from the EUR-cents referral credit system (referrals.credit_amount,
-- user_credits.total_credits, credit_transactions). Points are an integer
-- engagement count; credits are monetary.
--
-- This migration introduces:
--   - points_ledger      : append-only event log (one row per +/- award)
--   - point_milestones   : "next reward" thresholds shown on PointsSummary
--   - badges             : catalog of available badges (public read)
--   - user_badges        : user-to-badge join (per-user read)
--   - rewards            : catalog of redeemable rewards (public read,
--                          admin write); F-021 redemption flow lives in
--                          a separate Stripe-touching migration.
--
-- Backfill: every approved referral grants 100 points. We seed the
-- ledger from public.referrals where status = 'approved'.
-- ============================================================

-- ── 1. points_ledger ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.points_ledger (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  points      INTEGER NOT NULL,
  ref_id      TEXT,
  ref_type    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.points_ledger IS 'Append-only ledger of point award/spend events. Balance = SUM(points) per user. F-017.';
COMMENT ON COLUMN public.points_ledger.event_type IS 'e.g. workout_completed, program_completed, post_published, comment_published, heart_received, journal_entry, referral_approved, reward_redeemed';
COMMENT ON COLUMN public.points_ledger.points    IS 'Positive = earned, negative = spent.';
COMMENT ON COLUMN public.points_ledger.ref_id    IS 'Optional foreign reference (exercise id, program slug, post id, referral id, reward slug).';
COMMENT ON COLUMN public.points_ledger.ref_type  IS 'e.g. exercise, program, post, comment, referral, reward.';

CREATE INDEX IF NOT EXISTS idx_points_ledger_user_id    ON public.points_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_points_ledger_created_at ON public.points_ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_points_ledger_event_type ON public.points_ledger(event_type);

ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own points ledger" ON public.points_ledger;
CREATE POLICY "Users read own points ledger" ON public.points_ledger
  FOR SELECT USING (auth.uid() = user_id);

-- Inserts go through edge functions / triggers running with service role,
-- so no INSERT policy for end users.

-- ── 2. point_milestones ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.point_milestones (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  threshold     INTEGER NOT NULL,
  reward_name   TEXT NOT NULL,
  reward_slug   TEXT NOT NULL,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.point_milestones IS 'Ascending list of point thresholds; client picks the lowest one above the user balance for "next reward" UI. F-018.';
COMMENT ON COLUMN public.point_milestones.threshold   IS 'Points required.';
COMMENT ON COLUMN public.point_milestones.reward_slug IS 'Matches public.rewards.slug — keeps milestones and catalog in sync.';

ALTER TABLE public.point_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active milestones are public" ON public.point_milestones;
CREATE POLICY "Active milestones are public" ON public.point_milestones
  FOR SELECT USING (active = true);

-- Seed — mirrors the 5 hardcoded rewards from PointsRewards.tsx
INSERT INTO public.point_milestones (threshold, reward_name, reward_slug, sort_order) VALUES
  (80,  'Partnerská zľava · recepty',         'partner-recipes', 1),
  (100, 'Partnerská zľava · jóga štúdio',     'partner-yoga',    2),
  (150, '15% na ďalšiu platbu Plus',          'plus-15',         3),
  (250, '20% zľava na jedálniček',            'mealplan-20',     4),
  (500, 'Mesiac Plus zdarma',                 'plus-month',      5)
ON CONFLICT DO NOTHING;

-- ── 3. badges ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.badges (
  slug             TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  description      TEXT,
  icon_key         TEXT NOT NULL DEFAULT 'star',
  color_token      TEXT NOT NULL DEFAULT 'TERRA',
  threshold_type   TEXT,
  threshold_value  INTEGER,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.badges IS 'Catalog of awardable badges. Issuance triggers/cron are out of scope (FEATURE-NEEDED-POINTS-BADGE-ISSUANCE). F-019.';
COMMENT ON COLUMN public.badges.threshold_type  IS 'e.g. posts_count, streak_days, days_since_signup, comments_count.';
COMMENT ON COLUMN public.badges.threshold_value IS 'Numeric threshold paired with threshold_type.';
COMMENT ON COLUMN public.badges.color_token     IS 'Reference to NM design token (TERRA / SAGE / DUSTY / MAUVE / GOLD).';

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active badges are public" ON public.badges;
CREATE POLICY "Active badges are public" ON public.badges
  FOR SELECT USING (active = true);

INSERT INTO public.badges (slug, name, description, color_token, threshold_type, threshold_value, sort_order) VALUES
  ('first-post',   'Prvý príspevok',   'Tvoj prvý príspevok v komunite.',           'TERRA', 'posts_count',       1,   1),
  ('week-streak',  'Týždeň v rade',    'Sedem dní za sebou aktívna v aplikácii.',   'SAGE',  'streak_days',       7,   2),
  ('first-month',  'Prvý mesiac',      'Tridsať dní s NeoMe.',                      'DUSTY', 'days_since_signup', 30,  3),
  ('50-comments',  '50 komentárov',    'Pridala si päťdesiat komentárov.',          'MAUVE', 'comments_count',    50,  4),
  ('year',         'Rok s NeoMe',      'Tristošestdesiatpäť dní s nami.',           'GOLD',  'days_since_signup', 365, 5)
ON CONFLICT DO NOTHING;

-- ── 4. user_badges ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_slug  TEXT NOT NULL REFERENCES public.badges(slug) ON DELETE CASCADE,
  awarded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_slug)
);

COMMENT ON TABLE public.user_badges IS 'Issued badges per user. Inserts done by issuance service (out of scope). F-019.';

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own badges" ON public.user_badges;
CREATE POLICY "Users read own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- ── 5. rewards (catalog stub for F-020) ─────────────────────
CREATE TABLE IF NOT EXISTS public.rewards (
  id                       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug                     TEXT UNIQUE NOT NULL,
  name                     TEXT NOT NULL,
  description              TEXT,
  image_key                TEXT,
  point_cost               INTEGER NOT NULL,
  color_token              TEXT NOT NULL DEFAULT 'TERRA',
  stripe_coupon_id         TEXT,
  max_redemptions_per_user INTEGER NOT NULL DEFAULT 1,
  active                   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order               INTEGER NOT NULL DEFAULT 0,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.rewards IS 'Catalog of point-redeemable rewards. F-020. Redemption flow (F-021) is on a separate Stripe-touching migration.';
COMMENT ON COLUMN public.rewards.stripe_coupon_id IS 'Stripe Coupon id; redemption attaches a Promotion Code referencing this coupon to the user customer. NULL for non-Stripe rewards (e.g. partner discounts).';
COMMENT ON COLUMN public.rewards.image_key        IS 'Path under /public/images/r9/ (e.g. hero-yoga.jpg).';

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active rewards are public" ON public.rewards;
CREATE POLICY "Active rewards are public" ON public.rewards
  FOR SELECT USING (active = true);

INSERT INTO public.rewards (slug, name, point_cost, color_token, image_key, sort_order) VALUES
  ('plus-month',      'Mesiac Plus zdarma',                500, 'GOLD',  'hero-yoga.jpg',             1),
  ('mealplan-20',     '20% zľava na jedálniček',           250, 'SAGE',  'section-nutrition.jpg',     2),
  ('plus-15',         '15% na ďalšiu platbu Plus',         150, 'TERRA', 'section-body.jpg',          3),
  ('partner-yoga',    'Partnerská zľava · jóga štúdio',    100, 'DUSTY', 'lifestyle-yoga-pose.jpg',   4),
  ('partner-recipes', 'Partnerská zľava · recepty',        80,  'MAUVE', 'testimonial-recipe.jpg',    5)
ON CONFLICT (slug) DO NOTHING;

-- ── 6. Backfill points_ledger from approved referrals ───────
-- Each historical approved referral grants 100 points to the referrer.
-- Idempotent: ref_id is the referrals.id, so re-running won't duplicate.
INSERT INTO public.points_ledger (user_id, event_type, points, ref_id, ref_type, created_at)
SELECT
  r.referrer_user_id,
  'referral_approved',
  100,
  r.id::text,
  'referral',
  COALESCE(r.approved_at, r.created_at)
FROM public.referrals r
WHERE r.status = 'approved'
  AND NOT EXISTS (
    SELECT 1 FROM public.points_ledger pl
    WHERE pl.ref_id = r.id::text AND pl.ref_type = 'referral'
  );
