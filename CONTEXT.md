# NeoMe — Domain Language

Vocabulary for the NeoMe app domain. Use these terms exactly when discussing the architecture; don't drift to synonyms.

This file is updated inline as concepts crystallize during design conversations (per the `improve-codebase-architecture` and `grill-with-docs` skill workflows).

---

## Subscription & Access

- **Tier** — the user's billing status. Exactly `free` or `premium` (sometimes called "Plus" in UI copy). One per user, derived from Stripe subscription state.
- **Subscription** — the Stripe-side record. Lives in `subscriptions` table, surfaced via `SubscriptionContext`. Owns billing actions (checkout, portal, cancel) and tier derivation only.
- **Entitlement** — the *consumption-aware* gating check. "Given this user's tier and what they've already viewed in the current window, can they view this specific piece of content?" Separate from Subscription because subscription tells you *what plan they're on* and entitlement tells you *what they can do right now*. Free users have a metered quota per content type; premium users are unconditionally entitled.
- **Meal planner** — a one-time-purchase add-on (€57). Separate from the subscription tier. Flagged on `profiles.nutrition_plan_purchased`. Once purchased, always available.

## Content types

- **Recipe** — written content. Consumption event: opening the recipe detail page.
- **Exercise** — guided video/audio workout. Lives inside a Program. Consumption event: 10 seconds of accumulated play.
- **Meditation** — guided audio/video meditation. Consumption event: 10 seconds of accumulated play.
- **Stretch** — guided stretching video. Consumption event: 10 seconds of accumulated play.

"Read content" (recipes) logs on mount. "Play content" (exercises, meditations, stretches) logs on dwell.

## Quotas

- Recipes: 15 unique per rolling 30 days
- Exercises: 2 unique per rolling 7 days
- Meditations: 2 unique per rolling 7 days
- Stretches: 2 unique per rolling 7 days

"Unique" means dedup on `content_id` within the window — re-opening a recipe you already viewed in the window doesn't burn a fresh credit. Premium users are never logged and never gated.

## Programs

- **Program** — a multi-week structured exercise sequence (Postpartum 8 weeks, BodyForming/ElasticBands/Strong&Sexy 6 weeks each). Has its own enrollment, start date, and lifecycle (started / paused / canceled / completed). Free users can browse programs but only Plus can fully enroll.

## Consent

- **Consent** — a granular, typed, time-stamped record that the user has agreed to a specific data-processing purpose. Multiple types coexist: ToS+Privacy, cycle data, symptom logging, community posting, etc.
- **Consent authority** — the module that owns the read+prompt path for consents. Today fragmented across `TosConsentGate` (full-screen) and `ConsentGuardContext` (sheet). Pending deepening.

## Cycle

- **Cycle phase** — derived state (menstrual / follicular / ovulatory / luteal) computed from period logs + user-supplied cycle length. Used for daily recommendations and predictions.
- **Period log** — a single recorded period event. Multiple per user. The source data for cycle math.

---

## See also

- `docs/adr/` — Architecture Decision Records (load-bearing decisions worth preserving)
- `CLAUDE.md` — agent operating rules for this repo
