# Per-Screen Migration Playbook

The recipe an engineer follows for **one screen** in this handoff.

This is a living recipe — when a screen breaks the pattern, document the deviation in its `PROMPT.md`, not here.

---

## The recipe (90 minutes per screen, target)

### 1. Read the PROMPT.md (5 min)

It tells you:
- What the screen is
- Which prototype artboard(s) to reference
- Which variants must work in one component (e.g. Plus / Free / no-program)
- Which components are used
- Tone rules
- Acceptance checklist

### 2. Look at the live prototype (5 min)

Open `neome/NeoMe Final Review.html`, find the section, expand the artboard. **Look at all variants.** The hand-off PROMPT.md describes the data states; the prototype shows them rendered.

### 3. Sanity-check your component inventory (5 min)

Every component referenced in the screen file is in `handoff/03-components/`. If you see an import that's missing, check `COMPONENTS.md` — it's likely a "future batch" component. **Do not invent a placeholder**; pause, ping design.

### 4. Wire data hooks (15 min)

The screens import hooks like `useUser()`, `useTodayRituals()`, `useNotificationPrefs()`. These are placeholders. Replace them with whatever your data layer is — TanStack Query, SWR, Zustand, redux, plain context.

The hook signatures are documented in each PROMPT.md under "Data dependencies".

### 5. Drop the screen file in (10 min)

Copy `handoff/04-screens/<screen>/<screen>-page.tsx` to `src/pages/<screen>-page.tsx`. Wire it into your router.

### 6. Visual diff (15 min)

Open the screen at iPhone 14 Pro size (402×874). Open the prototype side by side. Walk through the acceptance checklist.

Common diffs you'll see and how to handle them:

| You see | What it means | Fix |
|---|---|---|
| Type sizes off by 1-2px | Tailwind defaults vs design tokens | Recheck `01-tokens/index.css` is loaded; verify `font-serif` resolves to Gilda Display |
| Wrong cream | Background not reading from `--bg` | Add `bg-cream` on the page root |
| Pillar accent wrong | Component using hardcoded color | Pillar comes from a prop — pass the right one |
| Italic appears in body copy | Component imported wrong header variant | Use `<BodyText>`, not `<SerifHeader italic>` |
| Diacritics render but look thin | Font weight not loading | Verify Gilda Display + DM Sans are imported in `index.css` |

### 7. Variant testing (15 min)

For every state in the variant table (Plus full / Plus no meal plan / Free / etc.), force the data and verify it renders correctly.

You can short-circuit this in dev with a query param hook:

```ts
function useUser() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("force") === "free") return { tier: "free", ... };
  if (params.get("force") === "no-meal-plan") return { tier: "plus", hasMealPlan: false, ... };
  return realUser();
}
```

### 8. Acceptance checklist (5 min)

Tick every box in the PROMPT's "Acceptance checklist". If you can't tick one, comment why on the PR.

### 9. Open the PR (10 min)

PR title: `feat(home): canonical Domov screen`
PR body: paste the PROMPT.md verbatim, then the acceptance checklist with each box ticked.

Tag the design reviewer.

---

## Anti-patterns to avoid

- **Inline styles** — every value lives in tokens; if you find yourself reaching for `style={{}}`, stop and look up the Tailwind class.
- **Hardcoded colors** — never `#3D2921`. Use `text-ink` or the relevant pillar class.
- **Hardcoded copy** — Slovak strings live in screens for now (we'll extract to i18n later). Don't put them in components.
- **Inventing components** — if the design uses a pattern that's not in `03-components/`, it's a sign you misread; ask.
- **Skipping variants** — the Plus / Free / partial-state variants are non-negotiable; the design specifically rejects "we'll do free later".
- **Adding emoji** — never. Photography or typography only.
- **Adding gradients** — never on cards or backgrounds. Texture comes from photography.
- **Italics in body copy** — italic is reserved for editorial pull quotes (blog) and the single-word accent in onboarding hero headers. Anywhere else: not allowed.

---

## When you're stuck

1. Re-read the PROMPT.md — usually the answer is in "Out of scope" or "Tone rules".
2. Open the live prototype, expand the artboard, look at it side by side with your work.
3. Read `DESIGN_DECISIONS.md` at the project root — it captures the "why" for everything.
4. Ping #neome-design with a specific question. "Should the cycle phase strip animate?" not "this screen looks wrong".

---

## Definition of Done (per screen)

- [ ] All variants in PROMPT's table render correctly
- [ ] Every acceptance-checklist item is ticked or commented on
- [ ] No inline styles, no hardcoded hex values, no emoji, no gradients
- [ ] Slovak copy renders with diacritics on iOS Safari
- [ ] Page is accessible: every interactive element keyboard-reachable
- [ ] Page works at 402×874 (iPhone 14 Pro) and at common tablet width (768)
- [ ] Design reviewer has approved
