# Tool: patch-steps.cjs

## Location
`/Users/sambot/.openclaw/workspace/projects/neome/neome_app/patch-steps.cjs`

## Purpose
Inject hand-written Slovak cooking steps into specific recipes that have broken or missing instructions. Also cleans up recipe titles (removes blog-post prefixes, truncates to 70 chars).

## Invoke
```bash
cd /Users/sambot/.openclaw/workspace/projects/neome/neome_app
node patch-steps.cjs
```

No environment variables required.

## Inputs
| Input | Source |
|-------|--------|
| `src/data/recipes.ts` | file — reads existing recipes |
| `STEPS` object inside the script | hardcoded — keyed by recipe ID |

## What It Does
1. Reads `src/data/recipes.ts`
2. For each recipe ID found in the `STEPS` object, replaces that recipe's `steps` array with the hand-written content
3. Also normalizes `title` (removes leading blog prefixes like "How To:", truncates to 70 chars)
4. Backs up the file, then writes the result back

## Outputs
- Updated `src/data/recipes.ts`
- Console: `Patched X recipes, Y remaining broken`

## When to Use
Only when a new import produces recipes with:
- `steps` containing `"QUERY LENGTH LIMIT EXCEEDED"` (MyMemory error from old imports)
- `steps: []` (empty — Spoonacular had no instruction data)

**All 27 original broken recipes were patched in April 2026.** Only run this for new imports with the same problem.

## How to Add a New Recipe's Steps
1. Find the broken recipe ID in `src/data/recipes.ts` (e.g. `spoon-123456`)
2. Open `patch-steps.cjs` and add to the `STEPS` object:
   ```javascript
   'spoon-123456': [
     'Predhrej rúru na 180 °C.',
     'V miske zmiešaj múku, soľ a prášok do pečiva.',
     'Pridaj vajcia a maslo, miešaj do hladka.',
     'Nalejú do formy a peč 30 minút.',
   ],
   ```
3. Run the script
4. Add `spoon-123456` to `HAND_WRITTEN_IDS` in `deepl-retranslate.cjs` (see `tools/deepl-retranslate.md`)
5. Run `workflows/retranslate-recipes.md` to clean up everything else in the recipe
