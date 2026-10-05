-- SECURITY FIXES (audit 2026-10-05). Each block closes a verified or
-- code-confirmed hole; all are safe to run repeatedly.

-- ── 1. Anon-executable credit minting (VERIFIED EXPLOITABLE) ────
-- Legacy SECURITY DEFINER RPCs run for the anon role; an anonymous
-- caller with any real user_id can mint or drain credits. The credits
-- system is retired — drop every overload.
DROP FUNCTION IF EXISTS public.add_user_credits(uuid, integer);
DROP FUNCTION IF EXISTS public.add_user_credits(uuid, integer, uuid);
DROP FUNCTION IF EXISTS public.apply_user_credits(uuid, integer);

-- ── 2. Self-approved referral rows (money-adjacent) ─────────────
-- The INSERT policy let any signed-in user insert a referral row with
-- themselves as referrer, status 'approved' and an arbitrary
-- credit_amount — the input the credit RPCs trusted. Friend-referrals
-- are retired; nothing legitimate inserts here any more.
DROP POLICY IF EXISTS "Users insert referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can create referrals" ON public.referrals;

-- ── 3. referral_codes enumeration (VERIFIED: anon dumps all codes
--      + user_ids today). Legacy table; nothing reads it client-side.
DROP POLICY IF EXISTS "Anyone can validate code" ON public.referral_codes;
DROP POLICY IF EXISTS "Anyone can validate codes" ON public.referral_codes;

-- ── 4. Affiliate payout double-request race ─────────────────────
-- The "one open request" guard was check-then-insert; two concurrent
-- requests created two payable rows over one set of earnings. The
-- partial unique index makes the database the referee.
CREATE UNIQUE INDEX IF NOT EXISTS affiliate_payouts_one_open_uidx
  ON public.affiliate_payouts (affiliate_user_id)
  WHERE status = 'requested';
