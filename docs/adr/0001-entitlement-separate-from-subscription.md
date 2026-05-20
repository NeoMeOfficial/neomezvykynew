---
status: accepted
date: 2026-05-19
---

# Entitlement is a separate module from Subscription

The original `SubscriptionContext` mixed three concerns: Stripe tier state, paywall presentation, and content-quota gating (`TIER_LIMITS`, `canAccess`, `getRemaining`). The quota gating was stubbed — every caller actually read `isPremium` and ignored the limit interface, which had become dead decoration. We chose to **delete the quota surface from `SubscriptionContext` entirely** and build a new `Entitlement` module that consumes Subscription state but owns its own Supabase table (`content_views`), quotas, and consumption-event rules. Future architecture passes should not re-suggest collapsing these back together.

## Why Entitlement and Subscription are different

**Subscription answers**: what billing plan is this user on right now? Source of truth = Stripe. Pure state.

**Entitlement answers**: given the user's plan, what they've already consumed, and what they're trying to view — should it be allowed, and if so, log the view? Source of truth = `content_views` table. Stateful, time-windowed, content-aware.

Premium users short-circuit entitlement entirely (always allowed, never logged), which is the only intentional coupling.

## Considered alternatives

- **Keep quota gating inside `SubscriptionContext`** — rejected. Would re-fatten an already busy provider, and the natural test surface for quota math (pure function over view-history + quota config) is hidden behind a React context. The 38 callers of SubscriptionContext almost all read tier state, not quotas; conflating both penalises the simple readers.
- **Static catalog gating instead of consumption gating** ("free tier sees these 10 fixed recipes") — rejected. The product wants free users to browse the full catalog with a metered cap, not a walled-off subset.
- **Lifetime caps instead of rolling windows** — rejected. Too punitive; freemium norm is time-windowed.

## Consequences

- New Supabase table `content_views` with RLS; every viewable content type must declare a quota in `Entitlement.QUOTAS` or it goes through ungated.
- Two consumption-event models coexist: mount-time (read content) and dwell-time (play content). Adding a new content type requires deciding which model applies.
- Premium-tier downgrade gives the user a clean rolling-window slate, because premium views are not logged. This is deliberate — see commit message of Entitlement migration for details.
- The Vimeo Player SDK (`@vimeo/player`) becomes a load-bearing dependency for any "play-content" quota enforcement.
