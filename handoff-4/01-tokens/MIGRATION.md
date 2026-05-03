# Token Migration — Three-Layer Swap

The NeoMe design system lives in three coupled files in your codebase. **All three must change together** or the app will look inconsistent.

This step touches no screen code. After it's done, the app will look weird (old layouts with new colors). That's expected. Screen redesigns happen later.

## The three files

| Layer | Existing file | Replace with |
|---|---|---|
| 1. TS theme constants | `src/theme/warmDusk.ts` | `tokens.ts` (this folder) — drop-in replacement, same export names |
| 2. Global CSS + HSL vars | `src/index.css` (the `:root { ... }` block + .dark) | `index.css` (this folder) — replace those blocks only |
| 3. Tailwind mappings | `tailwind.config.ts` (the `theme.extend` block) | merge `tailwind.config.snippet.ts` into your `extend` |

## Do this in one PR

The goal of doing it as one commit is so HEAD always works. If you split it across three commits, the middle commit will have mismatched colors.

### Step-by-step prompt for Claude Code

> Replace the design system in three coupled files, in one commit:
>
> 1. **`src/theme/warmDusk.ts`** — replace the entire file with the contents of `handoff/01-tokens/tokens.ts`. Existing imports (`section.telo`, `text.primary`, `glassCard`, etc.) must keep working unchanged — the new file preserves all those exports.
>
> 2. **`src/index.css`** — locate the `:root { ... }` block (HSL shadcn variables) and the `.dark { ... }` block. Replace both blocks with the equivalent blocks from `handoff/01-tokens/index.css`. **Do not** touch Tailwind directives or any other custom layers in the file. Add the Google Fonts `@import` line at the very top.
>
> 3. **`tailwind.config.ts`** — open the file. Inside `theme.extend`, merge the contents of `handoff/01-tokens/tailwind.config.snippet.ts`. Specifically:
>    - Add `pillar`, `cream`, `ink`, `gold`, `sandy`, `success`, `danger` to `extend.colors`.
>    - Replace `extend.fontFamily` with the new one.
>    - Replace `extend.fontSize` with the NeoMe scale (display, hero, h1, h2, h3, lg, md, sm, xs).
>    - Add `extend.boxShadow`, `extend.transitionTimingFunction`, `extend.letterSpacing` from the snippet.
>    - **Do not** remove anything else (existing animations, content paths, plugins).
>
> Don't touch any file in `src/components/` or `src/pages/`. After this step, run the dev server and confirm it compiles. The app will look broken — that's expected.

## Verification

After the swap, run the dev server. The app should compile with **zero TypeScript errors** because every export from `warmDusk.ts` is preserved.

Visual sanity check:
- Background should be cream (`#F8F5F0`).
- Body text should be warm dark brown (`#3D2921`), not gray.
- Existing buttons may look off — that's fine, we'll fix them in Step 2.

## Rollback

If anything breaks the build:
- `git diff src/theme/warmDusk.ts` — should compile.
- `git diff src/index.css` — should be limited to the `:root` and `.dark` blocks.
- `git diff tailwind.config.ts` — should only add to `extend`.

Revert and try again. The migration is reversible until you start changing screens.
