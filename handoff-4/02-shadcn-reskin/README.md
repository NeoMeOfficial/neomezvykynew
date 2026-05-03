# Shadcn Re-Skin

Drop-in replacements for shadcn primitives that already exist in your codebase. Keep your existing import paths — only the file contents change.

## Files

| File | Replaces | Strategy |
|---|---|---|
| `button.tsx` | `src/components/ui/button.tsx` | **Add** new variants (`pill`, `pillGold`, `pillOutline`, `pillCream`, `link-muted`) and sizes (`md`, `pillLg`, `pillSm`). Old variants untouched. |
| `card.tsx` | `src/components/ui/card.tsx` | **Add** new variants (`ritual`, `hero`, `inset`, `dark`, `hairline`, `pillar`). Default variant unchanged. New `pillar` prop tints background. |
| `input.tsx` | `src/components/ui/input.tsx` | **Replace** the default styling. Cream-200 background, hairline border, 48px tall, DM Sans. No new variants needed. |

## Variant catalog

### Button

```tsx
// Primary CTAs across NeoMe
<Button variant="pill" size="pillLg">Začať dnes</Button>

// Plus tier upsell
<Button variant="pillGold" size="pillLg">Aktivovať Plus · 4,99 €</Button>

// Secondary
<Button variant="pillOutline" size="md">Pozrieť viac</Button>

// In-context (e.g. card actions)
<Button variant="pillCream" size="md">Začať</Button>

// De-emphasized escape hatch (paywall "no thanks")
<Button variant="link-muted">Pokračovať zdarma</Button>
```

### Card

```tsx
// Daily ritual card on Home
<Card variant="ritual" pad="default">…</Card>

// Hero card (top of pillar hub)
<Card variant="hero" pad="lg">…</Card>

// Pillar-tinted card (Body / Nutrition / etc.)
<Card variant="pillar" pillar="telo" pad="default">…</Card>

// Pressed / inset surface (e.g. inside a card)
<Card variant="inset" pad="sm">…</Card>

// Dark editorial paywall card
<Card variant="dark" pad="lg">…</Card>

// Cream surface with just a hairline (subtle separation)
<Card variant="hairline" pad="default">…</Card>
```

## Migration prompt for Claude Code

> Replace three files with the contents from `handoff/02-shadcn-reskin/`:
>
> - `src/components/ui/button.tsx` ← `button.tsx`
> - `src/components/ui/card.tsx` ← `card.tsx`
> - `src/components/ui/input.tsx` ← `input.tsx`
>
> The Button and Card replacements are **additive** — every existing variant string in the codebase still resolves correctly. The Input replacement changes default styling; existing usages will look different but still work.
>
> Don't change any other shadcn primitive yet. After this change, run the dev server and confirm:
> 1. Build succeeds.
> 2. Every existing `<Button>` and `<Card>` still renders.
> 3. Every existing `<Input>` looks different (cream background instead of white) but still functions.

## Future re-skins (not in this batch)

When we get there, we'll re-skin these too — let me know when each is needed:

- `sheet.tsx` — bottom sheet (used for Cyklus log, paywall details)
- `dialog.tsx` — modal (used for delete confirms, cancel flow)
- `tabs.tsx` — segmented control (used in Knižnica, Telo programs)
- `switch.tsx` — toggle (settings, notification preferences)
- `progress.tsx` — progress bars (onboarding, programs)
- `avatar.tsx` — user avatars (profil, komunita)

For the trial batch (Onboarding + Settings + Home), the three above are enough.
