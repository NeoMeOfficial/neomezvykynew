# Settings — Trial Batch Screens

**Pillar:** root (account area)
**Status:** canonical (R10 in the prototype, marked Keep)
**Source variants in prototype:** `r10-sh` (hub), `r10-sn` (notifications), and siblings (`r10-sp`, `r10-spr`, `r10-sl` etc — port these the same way after the trial batch lands)

---

## What this section is

A traditional iOS-pattern settings hub — list of grouped rows, push-navigate to leaf pages. The hub itself has no editable values; each leaf page contains the actual toggles/inputs.

This batch ships **2 of ~8** settings pages. The pattern is the same for all of them — once you've migrated these, the rest are mechanical.

## Pages in this batch

1. **Hub** — `settings-hub-page.tsx` — the index. Three groups + a destructive group at the bottom (Cancel + Log out + Delete account).
2. **Notifications** — `settings-notifications-page.tsx` — three toggle groups (Daily / Cycle / Community).

## Pages NOT in this batch (defer to next handoff)

- Profil (avatar + name + email + password)
- Predplatné (plan summary + change plan + receipts)
- Spôsob platby (payment method)
- Súkromie (privacy controls)
- Jazyk (language picker — Slovak only for now, English coming)
- Stiahnuť moje dáta (data export request)
- Zrušiť predplatné (cancel flow with retention — see `r10-canc-*` in the prototype, this is a multi-step warm-tone flow)

## Components used

- `TopBar` — title + back arrow
- `SettingsGroup`, `SettingsRow` — list scaffolding (atoms in this batch)
- `ToggleRow` — value control (atom)

## Patterns

**Save-on-change**: every toggle persists immediately to the server via `useNotificationPrefs().update({ key: value })`. No save button. Show optimistic state; revert on error.

**Destructive group**: the bottom-most `SettingsGroup` is unlabeled and contains only `tone="danger"` rows. These all open confirmation modals or warm-tone retention flows; never destructive on first tap.

**Plus chip**: where a row references the user's current plan tier, use the `hint` prop with `"Plus"` or `"Free"`. The `SettingsRow` styles the `Plus` hint with the gold pill from `PlusTag` automatically when it sees that exact string.

## Acceptance checklist

- [ ] All settings sub-pages share the same `TopBar` chrome with back arrow → `/nastavenia`
- [ ] Hub renders as 4 groups (Účet / App / Pomoc / [destructive])
- [ ] Hub: Cancel subscription row only renders for Plus users
- [ ] Hub: every row is keyboard navigable
- [ ] Notifications: each toggle persists on change
- [ ] Notifications: optimistic state reverts on API error
- [ ] All Slovak copy renders with diacritics
- [ ] No emoji
- [ ] No gradients

## Data dependencies

```ts
const user = useUser();
// { tier: "free" | "plus" }

const { prefs, update } = useNotificationPrefs();
// prefs = { morning, evening, cyclePhase, cyclePeriod, communityReactions, communityReplies, communityDigest }
// update accepts a partial<typeof prefs> and posts immediately
```

## See also

- Component catalog: `handoff/03-components/COMPONENTS.md`
- Reference screenshots: `hub.png`, `notifications.png` in this folder
