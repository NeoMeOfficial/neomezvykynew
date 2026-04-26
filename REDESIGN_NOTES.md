# NeoMe Redesign — R12 Final Review Port

**Branch:** `redesign/r12-final-review`
**Source:** `../neome_app_design/design-bundle/project/neome/NeoMe Final Review.html` (107 screens, 13 pillars)
**Strategy:** Visual swap inside `src/pages/v2/` + `src/components/v2/neome/`. Old design (non-v2) untouched.

---

## How designs connect to existing infrastructure

Each new screen is a **view-layer swap** over an existing v2 page. The same `react-router-dom` route, the same `useSubscription()`, `SupabaseAuthProvider`, TanStack Query caches — only the rendered markup changes.

Pattern per screen:
1. Read existing `src/pages/v2/<Page>.tsx` to see which hooks/contexts it uses.
2. Port the new design's JSX into a TS React function.
3. Replace placeholder strings (counts, names, prices) with values from existing hooks.
4. Keep `useNavigate()` destinations identical so cross-screen links keep working.
5. Wire CTAs (e.g. "Aktivovať Plus") to the existing checkout/subscription flows.

---

## Tokens (Wave 1 — committed)

All redesign tokens are prefixed `neome-r9-*` so they cannot collide with the existing design system.

- **CSS vars** in [src/index.css](src/index.css): `--neome-r9-bg`, `--neome-r9-deep`, `--neome-r9-sage|terra|dusty|mauve|gold`, etc.
- **Tailwind colors** in [tailwind.config.ts](tailwind.config.ts) under `theme.extend.colors['neome-r9']` — usable as `bg-neome-r9-bg`, `text-neome-r9-deep`, etc.
- **Fonts:** Gilda Display (display serif) + DM Sans (body) — added to `<link>` in [index.html](index.html).

Pillar accent rule (HARD): never mix. Telo→terra, Strava→sage, Cyklus→mauve, Myseľ→dusty, Rewards/Plus→gold.

---

## Behavior changes flagged for separate "feature" PRs

These are **NOT** bundled with the visual port. Each is a new backend/logic concern that needs design review of the spec, not just the visuals.

| ID | Description | Source |
|---|---|---|
| BC-1 | **Cancel flow → 3-step warm arc** (retention offer → confirm loss → farewell) instead of single modal. Discount offer surfaces *after* confirm, not upfront. | R10 cancel screens |
| BC-2 | **Cyklus log → cross-pillar nudges**. Logging energy/symptoms surfaces "vyskúšaj pohyb" / "skús túto receptúru" in Telo/Strava/Myseľ. New service: `cycleNudgeRouter`. | R11 success screen |
| BC-3 | **Referral 30-day qualification gate**. Points credited only after invitee passes 30-day money-back window. Guards against churn-farming. | R11 referral |
| BC-4 | **Free Cyklus preview = "Náhľad bez ukladania"**. Interactive but no persistence; soft upsell. | R5 Cyklus Free |
| BC-5 | **Program start = Mondays only**. Date picker constrains to upcoming Mondays. | R9 Program detail |

---

## De-scoped (not in this redesign)

Per `design-bundle/project/handoff/MIGRATION.md`:

- Buddy / accountability partner
- Live classes / scheduled events
- Coach 1:1 paid DM
- Multi-language (EN) — Slovak only at launch
- Apple Watch / wearables
- HealthKit / Google Fit

---

## Per-screen status

Updated as each ships. Format: `<screen> — <commit sha> — <notes>`.

### Wave 0 — Foundation preview
- ✅ **Knižnica R9-C preview** at `/kniznica/preview` — `src/pages/v2/KniznicaPreview.tsx` — wired to `useSubscription()`, `?free=1` forces free state.

### Wave 1 — Tokens
- ✅ **Tokens** — Gilda Display font added; `neome-r9-*` CSS vars + Tailwind colors registered.

### Wave 2 — Atoms
- ⏳ Pending: `Eye`, `Ser`, `Body`, `Card`, `SearchBar`, `PlusTag`, `BackHeader` in `src/components/v2/neome/`.

### Wave 3 — Screens (priority order)

**Shipped:**
- ✅ Knižnica R9-C wired at `/kniznica` — 7 pillar tiles, live `useSubscription`, free paywall card
- ✅ Domov R12 wired at `/domov-new` — 5 ritual cards + Cyklus, name from auth, Plus/Free conditionals
- ✅ Onboarding R7 6-step flow at `/onboarding` — welcome / cycle / programs / nutrition upsell / nutrition prefs (conditional) / notifs
- ✅ Paywall R7 at `/paywall?v=warm|dark|compare` — three variants for A/B; CTA → `/checkout`
- ✅ Telo R9 hub at `/kniznica/telo` — 3 equal editorial cards
- ✅ Telo Programy at `/kniznica/telo/programy` — list + active program badge
- ✅ Program detail at `/program/:slug` — Mondays-only picker (BC-5 visual)
- ✅ Cyklus R5 at `/kniznica/periodka` — phase ring + calendar + symptoms (Plus) / faded preview (Free)
- ✅ Strava R3 hub at `/kniznica/strava`
- ✅ Myseľ R3 hub at `/kniznica/mysel`
- ✅ Blog R7-A at `/kniznica/blog` — featured + category chips + latest
- ✅ Komunita R2 at `/komunita`
- ✅ Správy R10 inbox at `/spravy` — pinned Gabi w/ gold star
- ✅ Profil R7-B at `/profil` — wired auth + signOut
- ✅ Settings hub R10 at `/settings`
- ✅ Referral R11 main at `/referral` — Web Share API, code derived from email

**Not yet ported (flagged for follow-up):**
- ⏳ R11 Cyklus log sheet (BC-2 — sheet flow + cross-pillar nudge insight)
- ⏳ R10 Settings sub-screens: Profile / Notifications / Privacy / Delete account
- ⏳ R10 Cancel arc (BC-1 — 3-step retention → confirm → farewell)
- ⏳ R10 Checkout entry / processing / success / receipt (existing /checkout still serves Stripe)
- ⏳ R10 Rewards Toast / Summary / Catalog
- ⏳ R11 Referral tracking / invitee landing / success / badges (visual port)
- ⏳ R10 Habit composer + Diary archive + Diary entry (existing v2 pages serve)
- ⏳ R10 Workout / Program completion celebrations
- ⏳ R3 Recipe detail + Meal plan (existing v2 pages serve)
- ⏳ R3 Meditation player
- ⏳ R2 Post detail + Composer + Zľavy
- ⏳ Spravy thread + composer
- ⏳ Blog article detail
- ⏳ R7 Profil A variant (B is canonical, A kept for reference)
- ⏳ R8 Search idle / results / library empty / loading skeleton
- ⏳ R9 Cvičenia / Strečing lists (existing /kniznica/telo/extra and /kniznica/telo/strecing serve)

### Bug-fix follow-ups discovered during port
- `src/pages/Komunita.tsx` (non-v2) has 10 pre-existing tsc errors (NordicCard tag mismatch). Out of scope for this redesign but should be fixed alongside the live-app upgrade.
- `src/pages/Profil.tsx` (non-v2) has 6 pre-existing tsc errors. Same status.

---

## Safety constraints (self-imposed during autonomous run)

- Never edit files outside `src/pages/v2/`, `src/components/v2/neome/`, `public/images/r9/`, plus additive-only edits to `src/AppV2.tsx`, `src/index.css`, `tailwind.config.ts`, `index.html`.
- Never touch `App.tsx`, `main.tsx`, `src/contexts/`, `src/hooks/`, `src/services/`, `src/integrations/`, `src/lib/`, `src/features/`, `supabase/`, `package.json`, `tsconfig*`, `vite.config.ts`.
- `tsc --noEmit` baseline = 16 errors (all pre-existing in non-v2 code). Any commit that pushes the count above 16 gets reverted.
- One commit per screen. No `git push`, no remote operations.
- Existing v2 files I replace get renamed to `*.old.tsx` (preserved, not deleted).
