-- CRITICAL (audit 2026-10-01): supabase-schema/02_subscriptions.sql created
-- "Users can update own subscription" FOR UPDATE with no WITH CHECK and no
-- column guard — any signed-in user could PATCH their own row to
-- {tier:'neome_plus', active:true} via the anon key and get Plus for free.
-- Verified: prod runs that schema (active/cancel_at_period_end columns live).
-- The app only ever SELECTs subscriptions client-side; every legitimate
-- write comes from the Stripe webhook / admin functions using the service
-- role, which bypasses RLS. Same class of hole as the profiles fix
-- (20260707120000), same treatment: drop the client write path entirely.

drop policy if exists "Users can update own subscription" on public.subscriptions;

-- meal_planner_tokens has the identical unguarded UPDATE policy and no
-- client-side writer either.
drop policy if exists "Users can update own tokens" on public.meal_planner_tokens;
