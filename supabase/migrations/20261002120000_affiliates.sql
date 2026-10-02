-- Affiliate program (Sam 2026-10-02): curated affiliates get a unique
-- code + signup link; attributed users' Stripe payments accrue a
-- per-affiliate commission that matures after 30 days (refund window)
-- and is paid out manually by Gabi on request.
--
-- Deliberately SEPARATE from the legacy referrals/user_credits tables —
-- that system is the in-app friend referral (300 points via webhook);
-- this one moves real money, so every write goes through server
-- functions (service role). Users get read-only RLS on their own rows.

-- ── affiliates ──────────────────────────────────────────────
create table if not exists public.affiliates (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  code           text,
  commission_pct numeric(5,2) not null default 20.00
                 check (commission_pct >= 0 and commission_pct <= 100),
  status         text not null default 'active' check (status in ('active', 'disabled')),
  created_at     timestamptz not null default now()
);

-- Case-insensitive uniqueness: "Gabi10" and "gabi10" are the same code.
create unique index if not exists affiliates_code_uidx
  on public.affiliates (lower(code)) where code is not null;

alter table public.affiliates enable row level security;

drop policy if exists "Affiliates read own row" on public.affiliates;
create policy "Affiliates read own row" on public.affiliates
  for select using (auth.uid() = user_id);

drop policy if exists "Admin manages affiliates" on public.affiliates;
create policy "Admin manages affiliates" on public.affiliates
  for all using (public.is_admin()) with check (public.is_admin());

-- ── affiliate_referrals ─────────────────────────────────────
-- One row per attributed user; first attribution wins (unique on the
-- referred user), set server-side at the referred user's first session.
create table if not exists public.affiliate_referrals (
  id                uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id  uuid not null unique references auth.users(id) on delete cascade,
  code_used         text,
  created_at        timestamptz not null default now()
);

create index if not exists affiliate_referrals_affiliate_idx
  on public.affiliate_referrals (affiliate_user_id);

alter table public.affiliate_referrals enable row level security;

drop policy if exists "Affiliates read own referrals" on public.affiliate_referrals;
create policy "Affiliates read own referrals" on public.affiliate_referrals
  for select using (auth.uid() = affiliate_user_id);

drop policy if exists "Admin manages affiliate_referrals" on public.affiliate_referrals;
create policy "Admin manages affiliate_referrals" on public.affiliate_referrals
  for all using (public.is_admin()) with check (public.is_admin());

-- ── affiliate_earnings ──────────────────────────────────────
-- One row per commissioned Stripe payment. stripe_ref (invoice id /
-- checkout session id) is unique so webhook retries can't double-pay.
-- available_at = created_at + 30 days; an earning is payable when
-- status='accrued', available_at <= now() and payout_id is null.
create table if not exists public.affiliate_earnings (
  id                uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id  uuid not null references auth.users(id) on delete cascade,
  amount_cents      integer not null check (amount_cents > 0),
  currency          text not null default 'eur',
  source            text not null check (source in ('subscription', 'one_time')),
  stripe_ref        text not null unique,
  status            text not null default 'accrued' check (status in ('accrued', 'paid', 'reversed')),
  available_at      timestamptz not null,
  payout_id         uuid,
  created_at        timestamptz not null default now()
);

create index if not exists affiliate_earnings_affiliate_idx
  on public.affiliate_earnings (affiliate_user_id, created_at desc);

alter table public.affiliate_earnings enable row level security;

drop policy if exists "Affiliates read own earnings" on public.affiliate_earnings;
create policy "Affiliates read own earnings" on public.affiliate_earnings
  for select using (auth.uid() = affiliate_user_id);

drop policy if exists "Admin manages affiliate_earnings" on public.affiliate_earnings;
create policy "Admin manages affiliate_earnings" on public.affiliate_earnings
  for all using (public.is_admin()) with check (public.is_admin());

-- ── affiliate_payouts ───────────────────────────────────────
create table if not exists public.affiliate_payouts (
  id                uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents      integer not null check (amount_cents > 0),
  status            text not null default 'requested' check (status in ('requested', 'paid', 'rejected')),
  payment_detail    text,
  requested_at      timestamptz not null default now(),
  processed_at      timestamptz,
  processed_by      uuid references auth.users(id)
);

create index if not exists affiliate_payouts_affiliate_idx
  on public.affiliate_payouts (affiliate_user_id, requested_at desc);

alter table public.affiliate_payouts enable row level security;

drop policy if exists "Affiliates read own payouts" on public.affiliate_payouts;
create policy "Affiliates read own payouts" on public.affiliate_payouts
  for select using (auth.uid() = affiliate_user_id);

drop policy if exists "Admin manages affiliate_payouts" on public.affiliate_payouts;
create policy "Admin manages affiliate_payouts" on public.affiliate_payouts
  for all using (public.is_admin()) with check (public.is_admin());
