# NeoMe Project Tracker

> **Purpose:** Single living document tracking what's happening across all parallel workstreams (admin rebuild, recipe pipeline, brand redesign, etc.) so nothing gets stuck. Updated as conversations land. Read this first if you've been away for a few days.
>
> **How to use:** Scan "Status snapshot" → check active workstreams → check your domain. Update in-place when status changes. Don't let it go stale.

**Last updated:** 2026-05-01

---

## Status snapshot

| Workstream | Status | Owner | Blocker |
|------------|--------|-------|---------|
| Admin panel rebuild | 📋 Plan locked, Phase 0 doc ready | Sam + Claude | Awaiting go-ahead to start Phase 0 |
| Recipe parser pipeline | ⏸ Paused mid-flight | Gabi (review) + Claude (implement) | Gabi reviewing `nutrition-curated.csv` |
| R12 redesign rollout | ✅ Most screens shipped | Sam | None — incremental polish ongoing |
| Period tracker (Periodka) | ✅ Functional, ~90% complete | — | No active work |
| Auth (real Supabase) | 🔒 Demo-mode | — | Phase 0 of admin rebuild will land this |
| Stripe live checkout | 🔒 Scaffolded | — | Post-MVP |

**Legend:** 📋 plan only · 🚧 in progress · ⏸ paused · ✅ shipped · 🔒 blocked

---

## Active workstreams (this week)

### 1. Admin panel rebuild — Phase 0

**Goal:** Wire up the foundation so admin writes can reach users via Supabase. Nothing user-visible changes after Phase 0.

**Status:** Plan locked. Detailed implementation plan at [.claude/plans/admin-phase-0-foundation.md](.claude/plans/admin-phase-0-foundation.md). 23 design decisions captured in [memory/project_admin_panel_plan.md](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/project_admin_panel_plan.md).

**Phase plan (master):**
- [ ] **Phase 0** — Foundation (auth, RLS, storage, React Query, status enum, route AdminNew at /admin) — *Week 1*
- [ ] **Phase 1** — Blog posts (block editor, image upload, vertical slice) — *Week 2*
- [ ] **Phase 2** — Recipes + Exercises + Stretches + Meditations — *Weeks 3–4*
- [ ] **Phase 3** — Programs + Scheduled inbox messages — *Week 5*
- [ ] **Phase 4** — Messaging + User Management — *Week 6*
- [ ] **Phase 5** — Stats Dashboard — *Week 7*
- [ ] Launch readiness gate (all phases verified, real users opened up)

**Next actions:**
- [ ] Sam reviews [admin-phase-0-foundation.md](.claude/plans/admin-phase-0-foundation.md) and confirms two manual ops (Supabase bucket creation, pre-launch SQL wipe)
- [ ] Sam gives go-ahead to start Phase 0 implementation
- [ ] Recipe schema decisions (from Gabi's pipeline review) merged into Phase 2 plan when available

### 2. Recipe parser pipeline

**Goal:** Convert Gabi's 20 client meal-plan CSVs into a curated NeoMe recipe library with nutrition data and pass/adjust/skip authoring gates.

**Status:** ⏸ Paused at Stage 5b — awaiting Gabi's review of [data/parsed/nutrition-curated.csv](data/parsed/nutrition-curated.csv) (top 150 ingredients, USDA-derived values).

**Stages:**
- [x] Parse 20 CSVs → 2763 raw recipe blocks
- [x] Clean + dedup → 2085 recipes, 1170 ingredients
- [x] Build ingredient normalisation template
- [x] Apply Gabi's normalisation (54 explicit edits, 47 IGNOREs)
- [x] Strip instruction-as-title false positives → 1913 recipes
- [x] OpenFoodFacts auto-match (16% success — abandoned, pivoted)
- [ ] Hand-curated nutrition table (top 150) — *Gabi reviewing*
- [ ] Apply nutrition values to all recipes
- [ ] Compute sub-recipe nutrition from constituents (chlieb hypoalergénny, proteínové muffiny, etc.)
- [ ] Long-tail ingredients (rank 151–1065) — assign category averages or skip
- [ ] Authoring gate (30/40/30 ± 5% macros, fiber min, discrete <25%)
- [ ] Send Gabi pass/adjust/skip report
- [ ] Define recipes table schema (locks Phase 2 of admin rebuild)
- [ ] Import 1900+ recipes to Supabase

**Detailed state:** [memory/project_recipe_pipeline_state.md](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/project_recipe_pipeline_state.md)

**Resume trigger:** Gabi saves `data/parsed/nutrition-reviewed.csv` and writes "nutrition reviewed".

---

## Domains

### Admin panel
- Current implementation: [src/pages/v2/AdminNew.tsx](src/pages/v2/AdminNew.tsx) — to be renamed `Admin.tsx` and routed at `/admin` in Phase 0
- Legacy: [src/pages/v2/AdminDashboard.tsx](src/pages/v2/AdminDashboard.tsx) — deletion in Phase 0
- See "Admin panel rebuild" workstream above

### Recipes & nutrition
- App reads: [src/data/recipes.ts](src/data/recipes.ts) (105 static recipes) — to be replaced with Supabase reads in Phase 2
- Pipeline output: [data/parsed/recipes-final.json](data/parsed/recipes-final.json) (1913 deduped recipes pending nutrition)
- Meal planner: [src/features/nutrition/](src/features/nutrition/) — currently uses static recipes
- Nutrition strategy: [memory/project_nutrition_strategy_2026.md](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/project_nutrition_strategy_2026.md)
- **Editorial constraint:** No juices in recipes (lemon as flavouring OK) — see [memory/feedback_no_juices.md](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/feedback_no_juices.md)

### Exercise programs (Telo)
- Schema: `programmes`, `exercises`, `user_active_programs` (Monday-only start dates)
- App: [src/pages/v2/TeloPrograms.tsx](src/pages/v2/TeloPrograms.tsx), [TeloExtra.tsx](src/pages/v2/TeloExtra.tsx), [TeloStrecing.tsx](src/pages/v2/TeloStrecing.tsx)
- F-049 enforces one active program per user (PK constraint)
- **Phase 3 (admin rebuild):** Programmes will reference exercises by ID (Model B), free-form prefixed tags (`programme:domov`, `body:core`), big-bang migration of existing schedules

### Meditations (Mysel)
- Schema: `meditations` table with audio_url
- App: meditation player in Mysel pillar
- **Phase 2 (admin rebuild):** CRUD + image upload

### Blog (Knižnica)
- Schema: `blog_posts` — `content` will become JSONB block array in Phase 1
- App: [src/pages/v2/Blog.tsx](src/pages/v2/Blog.tsx), [BlogArticle.tsx](src/pages/v2/BlogArticle.tsx)
- **Phase 1 (admin rebuild):** Block editor (paragraph/heading/image/quote/callout), full vertical slice

### Period tracker (Periodka)
- ✅ Functional, no active work
- Settings route exists at `/kniznica/periodka/nastavenia` (CLAUDE.md status note is outdated)
- Data: localStorage via [useCycleData](src/features/cycle/useCycleData.ts)
- Future consideration: migrate to Supabase for multi-device sync

### Community (Komunita)
- Schema: `community_posts`, `community_likes`
- Existing moderation UI in AdminNew (works)
- **Phase 4 (admin rebuild):** verify and polish

### Messaging
- Schema: `messages` (Gabi ↔ user, RLS already JWT-based)
- **Phase 4 (admin rebuild):** admin inbox UI + reply
- **Phase 3 (admin rebuild):** scheduled inbox messages from programmes (lazy delivery on app load)

### Subscriptions / Stripe
- 🔒 Partial: webhooks + status display work, live checkout not wired
- AdminNew has promo code sync to Stripe (verified working)
- Backlog: full live checkout, €79 meal plan + €30 discount UI

### Auth
- 🔒 Currently real-Supabase but with demo-mode fallback when env vars missing
- Phase 0 (admin rebuild) drops demo mode entirely

### Design system (R12 redesign)
- ✅ Tokens, atoms, molecules shipped
- Most v2 screens use new system
- **Backlog:** old screens (`*.old.tsx`) cleanup in a sweep PR after admin rebuild

---

## Backlog (post-launch unless noted)

### Critical (must land before public launch)
- (Everything in admin rebuild Phases 0–5 — see workstream)
- (Recipe pipeline completion — see workstream)

### High value (early post-launch)
- **Webhooks for external integrations** (e.g. ActiveCampaign on programme completion). Schema sketch: `webhooks (id, event_type, target_url, secret, active)`. First triggers: `user_active_programs` updates, `messages` inserts.
- **Per-client recipe scaling** — Gabi's vision system. Depends on recipe pipeline finishing. Design captured in nutrition strategy memory.
- **Engagement dashboard** (Option B from stats grilling) — cohort retention, per-feature usage funnels
- **PDF export for JedalnicekPlanner** — jsPDF already installed
- **Live Stripe checkout** for €79 meal plan + €30 discount code UI
- **Real Supabase auth migration for existing demo users** — N/A while app is pre-launch

### Medium value
- **Cron safety-net for scheduled inbox messages** (if lazy delivery causes "clump on next open" complaints)
- **Scheduled-publish for blog posts** (set go-live date in admin)
- **Content versioning / revisions** (revisable history per content row)
- **Multi-stage approval workflow** (draft → review → published)
- **Periodka Supabase migration** — multi-device cycle data sync

### Low value / nice to have
- **Old screen cleanup PR** — delete `*.old.tsx` files after admin rebuild proves stable
- **Admin audit log** (`admins_audit` table — who did what, when)
- **Bulk import UI** (CSV upload for content tables instead of one-row-at-a-time admin forms)

---

## Recent decisions log

Latest decisions live in memory; this is a quick pointer:

- **2026-05-01** — Admin rebuild plan: 23 design decisions locked, Phase 0 written. See [memory/project_admin_panel_plan.md](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/project_admin_panel_plan.md).
- **2026-04-30** — Recipe pipeline: pivoted from OpenFoodFacts to hand-curated nutrition table after 16% match rate
- **2026-04-30** — No juices in recipes (editorial rule). [memory](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/feedback_no_juices.md)
- **2026-04-29** — Recipe pipeline kicked off, ~67k lines of CSV → 2763 raw blocks → 1913 deduped recipes
- **2026-04-25** — Gamification dropped from nutrition strategy (editorial tone aligned with brand)
- **2026-04-23** — Nutrition strategy redesign: curated library + energy range + cycle awareness

---

## Pointers (where to find things)

| Need... | Look at |
|---------|---------|
| Project context, current state, brand | `/Users/sambot/.openclaw/workspace/projects/neome/_shared/NEOME.md`, `BRAND.md` |
| Repo conventions, design tokens | [CLAUDE.md](CLAUDE.md) |
| Workflow SOPs (deploy, recipe ops) | [workflows/](workflows/) |
| Admin rebuild design decisions | [memory/project_admin_panel_plan.md](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/project_admin_panel_plan.md) |
| Admin Phase 0 implementation plan | [.claude/plans/admin-phase-0-foundation.md](.claude/plans/admin-phase-0-foundation.md) |
| Recipe pipeline state | [memory/project_recipe_pipeline_state.md](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/project_recipe_pipeline_state.md) |
| Nutrition strategy | [memory/project_nutrition_strategy_2026.md](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/project_nutrition_strategy_2026.md) |
| Editorial rules (no juices, no gamification, etc.) | [memory/feedback_*.md](~/.claude/projects/-Users-sambot--openclaw-workspace-projects-neome-neome-app/memory/) |

---

## Maintenance notes

- **Update cadence:** any time a workstream's status changes, an active item moves between Critical / Backlog / Done, or a new domain appears
- **Don't capture in here:** ephemeral conversation context, code snippets, full design rationales (those go in memory or plan docs — link to them)
- **Do capture in here:** what's actively being worked on, what's blocked and on whom, what's next, what we agreed to defer
- **One file** — resist the urge to split. The whole point is that nothing gets stuck across conversations because anyone (Sam, Gabi, Claude in any session) can find the current state in one read.
