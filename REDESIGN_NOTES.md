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
- ⏳ Knižnica R9-C → replace `KniznicaPreview` with full wired version at `/kniznica`
- ⏳ Domov R12 → `DomovNew.tsx`
- ⏳ Onboarding R7 (6 screens)
- ⏳ Paywall R7 (warm + dark + compare)
- ⏳ Telo R9 (hub + Programy + Program detail)
- ⏳ Cyklus R5 dashboard (R11 log = BC-2 visual port; full behavior = separate PR)
- ⏳ Strava R3 (hub + Recipes + Recipe detail + Meal plan)
- ⏳ Myseľ R3 (hub + Meditation player + Reflection)
- ⏳ Komunita R2 (feed + post + composer + Zľavy)
- ⏳ Správy R10 (inbox + thread + composer)
- ⏳ Profil R7-B + Settings R10
- ⏳ Blog R7 (list + article)
- ⏳ Rewards R10 + Referral R11 (visuals only; BC-3 = behavior PR)
- ⏳ Checkout R10 (entry/processing/success/receipt) + Cancel (BC-1)

---

## Safety constraints (self-imposed during autonomous run)

- Never edit files outside `src/pages/v2/`, `src/components/v2/neome/`, `public/images/r9/`, plus additive-only edits to `src/AppV2.tsx`, `src/index.css`, `tailwind.config.ts`, `index.html`.
- Never touch `App.tsx`, `main.tsx`, `src/contexts/`, `src/hooks/`, `src/services/`, `src/integrations/`, `src/lib/`, `src/features/`, `supabase/`, `package.json`, `tsconfig*`, `vite.config.ts`.
- `tsc --noEmit` baseline = 16 errors (all pre-existing in non-v2 code). Any commit that pushes the count above 16 gets reverted.
- One commit per screen. No `git push`, no remote operations.
- Existing v2 files I replace get renamed to `*.old.tsx` (preserved, not deleted).
