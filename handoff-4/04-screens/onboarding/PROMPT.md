# Onboarding — Trial Batch Screens

**Pillar:** root
**Status:** canonical (R7 in the prototype, marked Keep)
**Source variants in prototype:** `r7-onb-w` (Welcome), `r7-onb-c` (Cycle setup), `r7-onb-n` (Notifications opt-in)

---

## What this flow is

A **3-step, no-auth-first** onboarding. Editorial in tone: large serif headers, warm cream, one sticky CTA, optional skip link below it.

We deliberately do NOT gate progress behind account creation. The user can complete onboarding and reach Home without an account; account upsell happens later inside the app.

## Steps

1. **Welcome** — `onboarding-welcome-page.tsx` — value prop, single CTA.
2. **Cycle setup** — `onboarding-cycle-page.tsx` — last period date + cycle/period length.
3. **Notifications** — `onboarding-notifications-page.tsx` — three toggles.

## Components used

- `OnbShell` — back button + step progress + body wrapper
- `SerifHeader`, `BodyText`, `Eyebrow` — type primitives
- `CTASticky` — sticky bottom CTA + secondary skip link
- `DatePicker`, `NumberStepper`, `ToggleRow` — form primitives (if your project doesn't have these, build them — they're standard and not pillar-specific)

## Tone rules

- Slovak only, full diacritics.
- Italic on the **single accent word** in each header (`tvojho cyklu`, `menštruáciu`, `sa máme ozvať`) — colored by relevant pillar accent (terra/rose/mauve). Italic appears **only** here in onboarding; nowhere else in body copy across the app.
- "Pokračovať bez účtu" / "Preskočiť" links are always visible but de-emphasized below the primary CTA (small + muted color, not a button).
- No emoji.

## Acceptance checklist

- [ ] All three steps share `OnbShell` chrome (back + step progress)
- [ ] Step counter shows 1 of 3 / 2 of 3 / 3 of 3
- [ ] Cycle step: date picker rejects future dates; sliders clamp to sensible ranges (cycle 20–45, period 2–10)
- [ ] Cycle step: "Preskočiť — nateraz nesledujem" link is present and works
- [ ] Notifications step: defaults are morning=on, cycle=on, community=off
- [ ] Welcome and Notifications: secondary skip link visible but visually de-emphasized
- [ ] All three pages: CTA sticks to viewport bottom regardless of content height
- [ ] All three pages: serif italic colored word matches its pillar accent

## Data dependencies

Each step posts to its own endpoint on submit. Adapt to your real API:

```ts
POST /api/me/cycle-setup        // step 2
POST /api/me/notification-prefs // step 3
```

No need to persist anything from step 1 (welcome).

## Out of scope

- Account creation modal (later flow)
- Email magic-link sign-in (later flow)
- Plus paywall (separate screen, see `paywall/` in a future batch)

## See also

- Component catalog: `handoff/03-components/COMPONENTS.md`
- Reference screenshots: `welcome.png`, `cycle.png`, `notifications.png` in this folder
