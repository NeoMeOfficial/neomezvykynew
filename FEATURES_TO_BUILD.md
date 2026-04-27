# NeoMe — Features To Build

This document tracks every feature, service, or schema change that the **R12 Final Review redesign** assumes but the live app doesn't yet have. Each entry comes from a `FEATURE-NEEDED-*` marker in source, discovered while wiring the visual ports onto existing hooks.

**Source of truth:** marker comments in [src/pages/v2/](src/pages/v2/). Search the codebase for `FEATURE-NEEDED-` to jump to the exact place where a feature is currently substituted with static content.

**Last updated:** 2026-04-27 · branch `redesign/r12-final-review`

---

## How to read this doc

Every feature has:
- **ID** — matches the source comment marker (`FEATURE-NEEDED-<area>-<slug>`)
- **What the design shows** — the visible promise to users
- **Current state** — what the screen renders today (placeholder / static / partial)
- **Build outline** — the minimum work to fulfill the design
- **Effort** — rough sizing: S = under a day, M = 1-3 days, L = a week+, XL = multi-sprint
- **Priority** — based on which screens it lights up

Priority scale:
- **P0** — design feels broken without it; ship before launch
- **P1** — important but the screen still works; ship soon after launch
- **P2** — nice to have; can sit until usage data tells us we need it

---

## P0 — Ship before launch

### F-001 · Daily meditation rotation

- **ID:** `FEATURE-NEEDED-DOMOV-MEDITATION`
- **Where it shows:** Domov "Meditácia dňa" card; Myseľ hub featured meditation
- **Current state:** Static editorial copy "Ranný pokoj · 10 min · Gabi"
- **Build outline:**
  - Supabase table `daily_meditations` (id, title, duration_min, audio_url, image_url, day_of_year, season, active)
  - Admin UI in [admin-panel/](admin-panel/) to add/edit rows
  - Client picks today's row by `day_of_year` (with fallback to most recent active)
- **Effort:** S
- **Priority:** P0 — front and center on Domov; static copy reads as broken when reviewed daily

### F-002 · Daily recipe rotation

- **ID:** `FEATURE-NEEDED-STRAVA-DAILY-RECIPE`
- **Where it shows:** Strava hub "Recept dňa" full-bleed card; Domov nutrition fallback when no meal plan
- **Current state:** Deterministic client pick — `recipes[dayOfYear() % recipes.length]`. Works (and rotates), but every user sees the same recipe each day, no curation
- **Build outline:**
  - Either add `featured_on` (date) column to existing recipes table, or new `daily_recipes` join table
  - Admin UI to set/clear "featured today"
  - Client preference order: explicit feature → deterministic fallback (current)
- **Effort:** S
- **Priority:** P0 if Gabi wants curation; P1 if deterministic is acceptable

### F-003 · Reflection store on `user.id`

- **ID:** `FEATURE-NEEDED-DOMOV-REFLECTIONS`, `FEATURE-NEEDED-PROFIL-REFLECTION-COUNT`
- **Where it shows:** Domov reflection prompt card (Plus history pills); Profil "X reflexií" stat
- **Current state:** Reflections currently scoped by *access code* via [useReflectionData](src/hooks/useReflectionData.ts) (legacy entry-point pattern). Domov can't easily access them; Profil shows `—`
- **Build outline:**
  - Migration: add `user_id` column on `reflections` table; backfill from access codes where mapping exists
  - New hook `useAccountReflections()` keyed by `useSupabaseAuth().user.id`
  - Or: wrapper hook that resolves access code from auth context (simpler, less data migration)
- **Effort:** M (data migration + dual-write while transitioning)
- **Priority:** P0 — Domov's reflection card is the most-prompted ritual; Profil count is visible

### F-004 · Symptom log persistence

- **ID:** `FEATURE-NEEDED-PERIODKA-SYMPTOMS`
- **Where it shows:** Periodka "Ako sa dnes cítiš" chip selector; calendar dots showing symptom-marked days
- **Current state:** Symptom chips render but tap state doesn't persist; calendar only marks today
- **Build outline:**
  - Supabase table `cycle_symptoms` (user_id, date, symptom_key, intensity int)
  - Extend [useCycleData](src/features/cycle/useCycleData.ts) with `symptoms` field + `toggleSymptom(date, key)` mutation
  - Wire chips to mutation, calendar dots to `symptoms` lookup
- **Effort:** S-M
- **Priority:** P0 — design promises persistence; tapping a chip and seeing it reset breaks trust

### F-005 · Cancel flow → 3-step warm arc (BC-1)

- **ID:** behavior change BC-1
- **Where it shows:** Settings → Cancel; design has retention offer → confirm loss → farewell screens (R10)
- **Current state:** Live app routes to Stripe portal directly; no NeoMe-branded retention arc
- **Build outline:**
  - 3 new pages: `/settings/cancel`, `/settings/cancel/confirm`, `/settings/cancel/farewell`
  - Retention offer screen surfaces a discount (e.g. "stay for 50% off next month") via Stripe coupon
  - On confirm: call Stripe `subscription.update({ cancel_at_period_end: true })` (already wired)
  - Farewell preserves dignity, suggests free-tier path
- **Effort:** M
- **Priority:** P0 — current cancel flow is jarring vs. design; retention saves churn

### F-006 · Mondays-only program write-back (BC-5)

- **ID:** behavior change BC-5
- **Where it shows:** Telo Program detail "Aktivovať program · DD. mes" CTA
- **Current state:** Picker UI works (constrains to Mondays); button navigates to `/domov-new` but doesn't persist the choice
- **Build outline:**
  - `user_programs` table column `start_date` (must be a Monday — DB check constraint)
  - `activateProgram(slug, startDate)` mutation in [useUserProgram](src/hooks/useUserProgram.ts)
  - Wire CTA to call mutation, then navigate to Domov
- **Effort:** S
- **Priority:** P0 — primary conversion CTA on Telo; broken right now (button routes but doesn't save)

---

## P1 — Soon after launch

### F-007 · Phase-based advice rotation

- **ID:** `FEATURE-NEEDED-PERIODKA-ADVICE`
- **Where it shows:** Periodka "Ako sa môžeš cítiť ešte lepšie" — 3 advice rows per phase
- **Current state:** 3 static rows for folikulárna; other phases reuse the same copy
- **Build outline:**
  - Supabase table `phase_advice` (phase_key, pillar, title, body_text, image_key, target_path)
  - 3 rows per phase × 4 phases = 12 rows initially, admin-editable
  - Client filters by `derivedState.currentPhase.key`
- **Effort:** S
- **Priority:** P1 — subtle wrongness for users not in folikulárna phase

### F-008 · Cyklus log → cross-pillar nudges (BC-2)

- **ID:** behavior change BC-2
- **Where it shows:** Cyklus log success screens (R11, not yet ported); Domov body / nutrition / mindset cards adapt to cycle phase
- **Current state:** Cyklus phase displays everywhere it should, but nothing routes context-aware suggestions
- **Build outline:**
  - Service `cycleNudgeRouter(phase, energy)` returning nudge tuples for Telo / Strava / Myseľ
  - Domov cards consume nudge results when present (override default content)
  - R11 success screen surfaces "Vyskúšaj…" CTAs that route to nudge target
- **Effort:** M
- **Priority:** P1 — design's signature cross-pillar moment; valuable but not blocking

### F-009 · First-started-at on subscriptions

- **ID:** `FEATURE-NEEDED-SETTINGS-STARTED-AT`
- **Where it shows:** Settings hub profile strip "Plus · od mesiac rok"
- **Current state:** Derived from `subscription.current_period_start`, which resets on each renewal — so "od februára 2026" will become "od marca 2026" after first renewal
- **Build outline:**
  - Add `first_started_at` column to subscriptions table
  - Webhook handler: on first `customer.subscription.created`, write the timestamp; never update again
  - Update [SubscriptionContext](src/contexts/SubscriptionContext.tsx) to expose this field
- **Effort:** S
- **Priority:** P1 — visible drift after each user's first renewal

### F-010 · Payment-method surfacing

- **ID:** `FEATURE-NEEDED-PROFIL-PAYMENT-METHOD`
- **Where it shows:** Profil subscription card subtitle (currently "9,99 € / mes · zrušíš kedykoľvek")
- **Current state:** Card brand + last4 stripped from copy because it's not in `SubscriptionData`
- **Build outline:**
  - New Netlify function `/.netlify/functions/get-payment-method` that queries Stripe `customer.payment_methods.list({ type: 'card' })` and returns `{ brand, last4 }`
  - Add to [SubscriptionContext](src/contexts/SubscriptionContext.tsx) as `paymentMethod` field
  - Update Profil card to show "Visa · 4242" when available
- **Effort:** S
- **Priority:** P1 — design has it; trust signal for paying users

### F-011 · Referral 30-day qualification (BC-3)

- **ID:** behavior change BC-3
- **Where it shows:** Referral page "Body sa pripisujú po 30-dňovej lehote" footnote; tracking screen pending vs. approved counts
- **Current state:** Footnote text is in place; [useReferral](src/hooks/useReferral.ts) returns `pendingReferrals` count but no scheduled job credits points after 30 days
- **Build outline:**
  - Supabase scheduled function (pg_cron or edge function) that runs daily
  - For each referral with `created_at + 30 days < now() AND status = 'pending'`: call existing `approveReferral` flow
  - Optional: notify referrer when points credit ("Tvoje body sú tu!")
- **Effort:** M
- **Priority:** P1 — design's anti-churn-farming guard; earnings work without it but invite incentive misaligns

### F-012 · Auto-reply badge on Gabi thread

- **ID:** Spravy detail screen (not yet ported)
- **Where it shows:** First message in any Gabi thread — small "Automatická odpoveď" pill with clock icon
- **Current state:** No auto-reply service; Gabi messages send normally
- **Build outline:**
  - Add `is_auto_reply` boolean to messages table
  - When user sends first message in a session, server creates a paired auto-reply with this flag set
  - Spravy thread renders the badge when `is_auto_reply === true`
- **Effort:** S
- **Priority:** P1 — small but design-canonical detail; sets user expectations on response time

---

## P2 — Backlog

### F-013 · Komunita server-side ranking

- **ID:** `FEATURE-NEEDED-KOMUNITA-RANKING`
- **Where it shows:** Komunita "Najviac rezonovalo dnes" section (top 2 by likes)
- **Current state:** Client sorts `posts` by likes and takes top 2 — works for small feeds
- **Build outline:**
  - DB view or scheduled materialized view: `top_posts_today` ordered by `likes_today DESC` limit 2
  - Hook fetch from this view rather than client sort
- **Effort:** S
- **Priority:** P2 — works fine until the feed grows past a few hundred posts/day

### F-014 · Komunita post photos

- **ID:** `FEATURE-NEEDED-KOMUNITA-ATTACHMENTS`
- **Where it shows:** Komunita feed photo posts (design has 2 photo posts in canonical example)
- **Current state:** `CommunityPost` has no `photo_url`; only seed entries with hardcoded image keys render photos
- **Build outline:**
  - Add `photo_url`, `photo_storage_path` columns to `community_posts`
  - Create Supabase storage bucket `community-photos` with RLS (read = public, write = owner)
  - Composer screen (not yet built — see F-015) handles upload + preview
  - Post card renders photo when present
- **Effort:** M
- **Priority:** P2 — text posts work; photos add richness but aren't essential

### F-015 · Komunita composer screen

- **ID:** `FEATURE-NEEDED-KOMUNITA-COMPOSER` (implicit; design's R2 has a composer)
- **Where it shows:** Komunita feed → "Napíš niečo, spýtaj sa…" pill currently routes to `/komunita/new`, which doesn't exist as a v2 screen
- **Current state:** Pill click 404s in v2
- **Build outline:**
  - New screen `src/pages/v2/KomunitaCompose.tsx`
  - Question/post type toggle, text area, photo upload (depends on F-014), category tags
  - Calls `submitPost` from [useCommunityPosts](src/hooks/useCommunityPosts.ts)
- **Effort:** M (S without photos, M with)
- **Priority:** P1 (without photos) / P2 (with photos)

### F-016 · Komunita follow

- **ID:** `FEATURE-NEEDED-KOMUNITA-FOLLOW`
- **Where it shows:** "Sledovať" link at the bottom of every feed post
- **Current state:** Static affordance; clicking does nothing
- **Build outline:**
  - `community_follows` table (follower_id, followee_id, created_at)
  - `useFollows()` hook with `toggleFollow(authorId)`
  - Replace static link with stateful pill (Sledovať / Sledovaná)
  - Optional: filter feed to "Iba sledované" tab
- **Effort:** M
- **Priority:** P2 — engagement nice-to-have

### F-017 · Spravy peer-to-peer DMs

- **ID:** `FEATURE-NEEDED-SPRAVY-FRIEND-DMS`
- **Where it shows:** Spravy inbox — design's Lucia / Anna / Martina threads
- **Current state:** Inbox shows only the user→Gabi thread; the design's other threads are stripped from the wired version
- **Build outline:** **substantial — possibly a P1 if "social-fitness" is part of the value prop**
  - `friends` table (user_a_id, user_b_id, status: pending/accepted/blocked)
  - `conversations` table (id, participant_a, participant_b, last_message_at)
  - `messages_p2p` table (id, conversation_id, sender_id, body, created_at, read_at)
  - Inbox endpoint: list conversations for current user with last-message preview
  - Friend search + invite flow
  - Composer screen for new thread
  - Moderation: block / report / hide
  - Push notifications for new messages
- **Effort:** XL
- **Priority:** P2 by default; **P1 if social fitness is in the brand promise** (Gabi to decide)

### F-018 · Programs catalog table

- **ID:** `FEATURE-NEEDED-TELO-PROGRAMS-CATALOG`
- **Where it shows:** Telo Programy list
- **Current state:** 4 hardcoded entries in [TeloPrograms.tsx](src/pages/v2/TeloPrograms.tsx)
- **Build outline:**
  - Supabase `programs` table (slug, name, weeks, level, description, hero_image, exercises_count, min_per_day, outline_json, active, sort_order)
  - Migrate the 4 current programs as initial rows
  - Admin UI to add/edit (extends existing [program-admin/](program-admin/))
  - Hook `usePrograms()` to fetch the catalog
- **Effort:** M
- **Priority:** P2 — current 4 programs are stable; only matters when Gabi wants to add a 5th without a deploy

### F-019 · Free Cyklus preview no-persist guard (BC-4)

- **ID:** behavior change BC-4
- **Where it shows:** Periodka Free view — design says interactions should preview but not save ("Náhľad bez ukladania")
- **Current state:** Free view doesn't render the rich dashboard at all (gated by `isPremium && hasCycleSetup`), so "preview that doesn't save" isn't an active risk yet
- **Build outline:** Only relevant if we let Free users into the dashboard — they'd see a banner "Náhľad bez ukladania" and a guard preventing writes to `useCycleData`
- **Effort:** S (when needed)
- **Priority:** P2 — not blocking until product decides Free users get a dashboard preview

---

## Cross-cutting infrastructure (mentioned in passing)

### Push notifications

Several features above (auto-reply badge, F-008 cross-pillar nudges, F-011 referral credit "your points are here") imply a push notification capability. The live app uses email reminders only.

- **Build outline:** PWA push subscription via service worker, Supabase function to send via web-push, in-app notification feed
- **Effort:** L
- **Priority:** P1 if any individual feature above goes P0 with notifications

### Admin curation surfaces

F-001, F-002, F-007, F-018 all need admin tooling to add/edit content rows. The existing [admin-panel/](admin-panel/) handles recipes already.

- **Build outline:** Add daily-meditations, daily-recipes (or feature flag on existing), phase-advice, programs CRUD pages to admin
- **Effort:** M (one screen per content type × 4)
- **Priority:** Bundled with the P0 features that need them

---

## Out-of-scope (not in this redesign)

These were explicitly de-scoped in `design-bundle/project/handoff/MIGRATION.md`:

- Buddy / accountability partner flow
- Live classes / scheduled events
- Coach 1:1 paid DM
- Multi-language (English) UI
- Apple Watch / wearables sync
- HealthKit / Google Fit integration

If product decides any of these are in-scope later, they'd be net-new features outside this doc's scope.

---

## Pre-existing live-app bugs to fix alongside

Discovered during the wiring run. Not redesign work, but blocking a clean tsc baseline:

- [src/pages/Komunita.tsx](src/pages/Komunita.tsx) — 10 tsc errors, NordicCard tag mismatch
- [src/pages/Profil.tsx](src/pages/Profil.tsx) — 6 tsc errors, similar NordicCard issue

Fix at the same time as the redesign cutover so the v1 fallback still compiles cleanly.

---

## Triage summary

| Priority | Count | Items |
|---|---|---|
| P0 | 6 | F-001 daily meditation · F-002 daily recipe · F-003 reflection store · F-004 symptom persistence · F-005 cancel arc (BC-1) · F-006 program write-back (BC-5) |
| P1 | 6 | F-007 phase advice · F-008 cycle nudges (BC-2) · F-009 first-started-at · F-010 payment method · F-011 30-day gate (BC-3) · F-012 auto-reply badge |
| P2 | 7 | F-013 ranking · F-014 photos · F-015 composer · F-016 follow · F-017 P2P DMs · F-018 programs catalog · F-019 BC-4 preview guard |

**Suggested launch path:** ship visual redesign + 6 P0 features simultaneously. Hold the rest until usage data tells you what to ship next.
