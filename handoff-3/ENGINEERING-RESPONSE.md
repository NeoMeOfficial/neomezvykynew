# Response to engineering — re: visual cross-check ask

Hi! Everything you asked for is in this update. Quick map:

## 1. Prototype HTML

Single self-contained file, no external assets, works offline:

```
handoff/00-prototype/NeoMe-Final-Review.html
```

Open it in any browser side-by-side with the running app. All 107 screens are
on the same pan/zoom canvas, organised by section. Click any artboard's label
to open it fullscreen and use ←/→ to step through that section.

## 2. Reference screenshots

`handoff/04-screens/reference/` — PNGs of all 7 screens you listed, plus two
extra `*-rituals.png` shots (the home cards live below the fold). They're
above-the-fold orientation snapshots; the prototype is the source of truth for
fidelity.

## 3. Editorial hero photography

`handoff/04-screens/onboarding/hero-yoga.jpg` — drop-in for the
`OnboardingWelcomePage` placeholder. Slot it into the welcome screen behind
the "Tvoja cesta späť k sebe" title.

The prototype renders this same image at the top of `r7-onb-w` so you can
match the treatment (it's full-bleed top, with the title overlaid in white
serif).

## 4a. The four "missing" components — now official

You're right that `DatePicker`, `NumberStepper`, `ToggleRow`, and `TopBar`
were referenced by trial-batch screens but not in `03-components/`. That was
my oversight — they're standard atoms, not pillar-specific, so I deferred
them and you ended up building them. **Your minimal versions are not what we
want long-term**, so I've now shipped canonical versions:

```
handoff/03-components/ui/top-bar.tsx
handoff/03-components/ui/toggle-row.tsx
handoff/03-components/ui/number-stepper.tsx
handoff/03-components/ui/date-picker.tsx
```

Each ships with a full prop API (see file-level JSDoc). One thing worth
flagging — the `DatePicker` here is the **simple** version (a tap-target row
that opens the native date picker). The cycle-setup screen will eventually
want a richer calendar UX with phase preview overlays, which means swapping
the underlying control for something like react-day-picker styled with our
tokens. The prop shape (`label`, `value`, `onChange`, `min`, `max`) stays the
same, so screen code won't change.

If your minimal versions are working fine in the trial batch, **keep them
running and migrate to ours next iteration** — no need to swap mid-PR. But
treat ours as canonical from here on.

## 4b. RitualCard prop API

You're also right — the screen file (`home-page.tsx`) calls `RitualCard` with
props that didn't exist on the canonical component (`subtitle`, `status`,
`duration`, `href`, `upsell`, `fallback`, `progress`). The screen file was
written from the prototype's richer internal API; the component file shipped
the simpler one. **Your defensive extensions are the right shape.**

I've now reconciled the canonical component with what the home screen needs:

- `subtitle` (alias for `sub`) — keeps both for compat
- `status` — typed enum: `'ready' | 'in-progress' | 'completed' | 'not-started' | 'locked'`. Drives the pill copy automatically.
- `duration` — extra meta line (e.g. "14 min")
- `progress` — fractional 0–1; renders a thin pillar-coloured progress rule
- `upsell="sada"` — Plus-tier inline meal-plan upsell badge
- `fallback="navrhnuty-cvik"` — Plus-tier program fallback badge ("Návrh")
- `href` — renders as `<a>` instead of `<button>` when set
- `pillar="ink"` — added for Návyky / Reflexie cards (no pillar accent, just ink)

See the updated `handoff/03-components/v2/ritual-card.tsx` — same file, fully
backwards compatible with your earlier extensions. Diff it against what you
shipped; if anything diverges, your shape wins for the trial batch and we'll
align on the next pass.

## What the visual cross-check should focus on

When you compare your build against the prototype:

- **Type rhythm** — Gilda Display serif sizes, especially headers and
  italic accents. Mismatched type sizes are the most common drift.
- **Pillar accent rails on RitualCard** — the small left rail should be 4px
  wide × 48px tall, perfectly pillar-coloured (TERRA / SAGE / MAUVE / INK).
- **Cream background** — `--cream` (#F5EFE6) everywhere, no white pages.
- **No drop shadows on cards** — we use 1px warm borders + a tiny
  `shadow-nm-sm` only. Material-style elevations would be wrong.
- **Status pill copy** — Slovak, lowercase-ish (Pripravené, Rozbehnuté,
  Hotovo, Začať). Don't translate.

Send the diffs back and I'll spec corrections.

— Sam
