# NeoMe Engineering Handoff

This folder is a self-contained handoff for the engineering team rebuilding NeoMe in Vite + React + TypeScript + Tailwind + shadcn.

> **You are receiving this because the design phase produced ~107 mobile screens. We've selected the canonical set, distilled the design system into tokens + a small component library, and are migrating screen by screen.**

---

## What's in here

```
handoff/
├── README.md                        ← you are here
├── PLAYBOOK.md                      ← how to migrate one screen at a time
├── MIGRATION.md                     ← end-to-end migration plan
├── 01-tokens/                       ← design tokens (colors, type, radii)
│   ├── tokens.ts                    drop-in replacement for warmDusk.ts
│   ├── index.css                    HSL token block for tailwind/shadcn
│   ├── tailwind.config.snippet.ts   theme.extend additions
│   └── MIGRATION.md                 step-by-step token migration
├── 02-shadcn-reskin/                ← variant patches for shadcn primitives
│   ├── button.tsx                   adds: pillar variants, large rounded
│   ├── card.tsx                     adds: cream / outlined-warm
│   ├── input.tsx                    adds: settings, search, large
│   └── README.md                    how to apply, why each variant exists
├── 03-components/                   ← NeoMe-specific components
│   ├── ui/                          atoms (Eyebrow, BodyText, PillarChip, …)
│   ├── v2/                          molecules (RitualCard, GreetingHero, …)
│   └── COMPONENTS.md                what each component does, where it's used
└── 04-screens/                      ← trial batch + per-screen prompts
    ├── home/                        Domov — canonical
    ├── onboarding/                  Welcome + Cycle + Notifications
    ├── settings/                    Hub + Notifications
    └── REFERENCE-VISUALS.md         where to find PNGs / live prototype
```

---

## How to use this handoff

### Step 1 — tokens (one PR)

Apply `01-tokens/` to your project. This replaces the old palette + type wholesale. After this PR, the existing app won't look like NeoMe yet, but every primitive will be reading from the new variables.

See `01-tokens/MIGRATION.md` for the file-by-file walkthrough.

### Step 2 — shadcn reskin (one PR)

Add the variants in `02-shadcn-reskin/` to your existing shadcn/ui primitives. These don't break existing usages — they're additive.

See `02-shadcn-reskin/README.md` for which file changes which.

### Step 3 — install component library (one PR)

Copy `03-components/ui/` and `03-components/v2/` into your project under `src/components/ui/` and `src/components/v2/`. These are the NeoMe-specific atoms and molecules — pure Tailwind, no inline styles, fully typed.

See `03-components/COMPONENTS.md` for the inventory.

### Step 4 — trial batch (one PR per screen)

Migrate the three trial-batch screens, in order:

1. **Onboarding** (`04-screens/onboarding/`) — three pages
2. **Settings** (`04-screens/settings/`) — hub + notifications
3. **Home** (`04-screens/home/`) — Domov canonical

Each folder has a `PROMPT.md` you can copy-paste into your engineering tracking tool. Each screen is a single `*-page.tsx` file with placeholder hooks.

### Step 5 — request next batches

Once Step 4 lands cleanly, ping the design team to release the next batch. The full screen inventory and migration order is in `MIGRATION.md`.

---

## Context — what NeoMe is, in one paragraph

A Slovak-language wellness/lifestyle app for women, built around four pillars: **Telo** (Body), **Strava** (Nutrition), **Myseľ** (Mind), **Cyklus** (Cycle). Plus **Komunita** (Community), **Knižnica** (Library), and **Denník** (Diary). Editorial in tone, never clinical, never gamified. Plus tier unlocks programs, meal plans, full meditations, community. Free tier still gets a complete home screen and library access.

For full design context, the prototype at `neome/NeoMe Final Review.html` is the source of truth. The CLAUDE.md at the project root is the running brief.

---

## Conventions you'll see referenced

| Term | Meaning |
|---|---|
| **Pillar** | One of: telo, strava, mysel, cyklus. Each has a dedicated accent color. Never mix pillar colors in one component. |
| **Plus tier** | Paid users. Unlocked content is marked with the `Plus` chip (gold). |
| **Free tier** | Everyone else. They see scaffolding for Plus features so they know what they'd unlock. |
| **R7, R10, R12, …** | "Round" — a design iteration. The prototype is organized by round; canonical screens are tagged with their final round number. |
| **Canonical** | The Keep-marked screen that engineering should build. |

---

## Questions

Drop them in the design Slack thread or comment directly on this handoff folder. Don't guess — every screen has a deliberate decision behind it, and there's a 300-line `DESIGN_DECISIONS.md` at the project root that captures most of them.
