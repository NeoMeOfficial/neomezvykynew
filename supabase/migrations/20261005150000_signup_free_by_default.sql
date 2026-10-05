-- Signup gave every new user free Plus (found 2026-10-05, pre-launch).
--
-- Production (schema drifted from this repo's 001 migration) has a
-- trigger on profiles — on_profile_created → handle_new_user_subscription()
-- — that inserts a subscriptions row per signup WITHOUT the active
-- column, and active defaulted to TRUE. The app grants Plus purely on
-- subscriptions.active, while the admin badge reads tier ('free'), so
-- every account was premium in the app and "Free" in admin.
--
-- Applied via dashboard SQL editor 2026-10-05 (this file is the record).

-- 1) Data fix: demote the freeloader rows. Narrow on purpose — never
--    touches a real Stripe subscription (stripe_subscription_id set)
--    or an admin-granted Premium (current_period_end set).
update public.subscriptions
set active = false, updated_at = now()
where active = true
  and stripe_subscription_id is null
  and current_period_end is null;

-- 2) New rows start inactive.
alter table public.subscriptions alter column active set default false;

-- 3) Seal the source: the signup trigger now sets active explicitly.
create or replace function public.handle_new_user_subscription()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Create default free subscription — explicitly inactive: active=true
  -- here was the pre-launch bug that gave every signup free Plus.
  insert into public.subscriptions (user_id, tier, active)
  values (new.id, 'free', false);

  -- Create default meal planner tokens (0 tokens)
  insert into public.meal_planner_tokens (user_id, tokens_remaining)
  values (new.id, 0);

  return new;
end;
$$;
