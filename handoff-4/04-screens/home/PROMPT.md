# Home (Domov) — Trial Batch Screen

**Pillar:** root (no single pillar — this is the home surface)
**Status:** canonical (R12 in the prototype, marked Keep)
**Source variants in prototype:** `r12-hpp` (Plus full), `r12-hpm` (Plus no meal plan), `r12-hpn` (Plus no program), `r12-hf` (Free)

---

## What this screen is

The first screen a logged-in user sees. Five ritual cards in fixed order make up the entire daily flow — they ARE the nav. There is no "browse by pillar" tile grid; the cards do that work themselves.

**Order is non-negotiable:** Telo → Strava → Myseľ → Návyky → Reflexie. The Cyklus card sits above DNES because it's a state strip, not a ritual.

## Variants this single page must handle

| Tier | Has program | Has meal plan | Has cycle data | Result |
|---|---|---|---|---|
| Plus | yes | yes | yes | canonical full state |
| Plus | yes | **no** | yes | Strava card shows SADA upsell inline |
| Plus | **no** | yes | yes | Telo card shows "navrhnutý cvik" suggested workout fallback |
| Plus | yes | yes | **no** | Cyklus card shows tracking prompt |
| Free | n/a | n/a | n/a | All cards link to Knižnica content; Plus upgrade banner shown above DNES |

All four states must work in the same component — branch on `user.tier`, `user.hasProgram`, `user.hasMealPlan`, `user.hasCycleData`. No separate "free home" page.

## Components used

- `GreetingHero` — name, tier chip, date, tagline
- `PhaseStrip` — cycle phase row (or prompt if not configured)
- `UpgradeBanner` — only on Free tier, between phase strip and DNES
- `SectionHeader` — eyebrow "DNES"
- `RitualCard` — five times, pillar prop varies
- `BottomNav` — active="domov"

All listed in `handoff/03-components/COMPONENTS.md`.

## Data dependencies

Hooks expected on the project side. Replace the placeholders with whatever your data layer is (TanStack Query, SWR, Zustand, etc.):

```ts
const user = useUser();
// { name: string; tier: "free" | "plus"; hasProgram: boolean; hasMealPlan: boolean; hasCycleData: boolean }

const rituals = useTodayRituals();
// { telo: RitualSlot; strava: RitualSlot; mysel: RitualSlot }
// RitualSlot = { title, subtitle, status, duration?, href, freeAccess? }
// status = "not-started" | "in-progress" | "done"

const cycle = useCycle();
// { phase: "menstrual"|"follicular"|"ovulatory"|"luteal"; dayOfCycle: number; note: string } | null
```

## Tone (Slovak)

- Greeting changes with hour: `Krásne ráno` (<11), `Krásny deň` (<17), `Krásny večer` (>=17)
- Date format: `Streda · 22. apríla` (use date-fns sk locale)
- Tagline rotates daily from CMS (placeholder string in code)
- Eyebrow labels: `POHYB`, `JEDÁLNIČEK`, `MEDITÁCIA`, `NÁVYKY`, `REFLEXIE` — all uppercase, tracked

## Acceptance checklist

- [ ] Five ritual cards always render in the order Telo → Strava → Myseľ → Návyky → Reflexie
- [ ] Each card uses its pillar accent color (or `ink` for habits/diary)
- [ ] Free tier shows the upgrade banner; Plus tier never shows it
- [ ] Strava card shows the SADA upsell when Plus user has no meal plan
- [ ] Telo card falls back to a suggested exercise when Plus user has no active program
- [ ] PhaseStrip shows a prompt (not phase data) when user hasn't set up tracking
- [ ] Greeting line uses time-of-day correct variant
- [ ] Date renders in Slovak with diacritics
- [ ] BottomNav reads active="domov"
- [ ] Page bottom padding (`pb-28`) clears the BottomNav
- [ ] No emoji anywhere
- [ ] No gradients on cards or background

## Out of scope for this PR

- Long-press card actions (planned later)
- Skeleton loading state (use `<Skeleton />` from a future batch — for now, render placeholder text)
- Pull-to-refresh
- Card reorder by user

## See also

- Tokens: `handoff/01-tokens/MIGRATION.md`
- Component catalog: `handoff/03-components/COMPONENTS.md`
- Reference screenshot: `home-canonical.png` in this folder
