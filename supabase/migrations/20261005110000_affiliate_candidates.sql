-- Referral funnel (Sam 2026-10-05): every user can refer via an
-- auto-generated code. Pre-approval they are a 'candidate' — referrals
-- attribute and earn POINTS (+150 per first payment); after 5 paying
-- referrals Sam/Gabi flip them to 'active' and the same link starts
-- earning MONEY (commission accrual already requires status='active',
-- so no double-dipping is possible).

ALTER TABLE public.affiliates DROP CONSTRAINT IF EXISTS affiliates_status_check;
ALTER TABLE public.affiliates
  ADD CONSTRAINT affiliates_status_check
  CHECK (status IN ('candidate', 'active', 'disabled'));
