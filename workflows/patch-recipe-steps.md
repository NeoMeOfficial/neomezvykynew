# Workflow: Patch Missing or Broken Recipe Steps

## Objective
Fix recipes whose cooking instructions are missing, empty, or contain the MyMemory error string `"QUERY LENGTH LIMIT EXCEEDED"`.

## Required Inputs
- Recipe IDs of the broken recipes
- Hand-written Slovak cooking steps for each recipe

## Tools
- `patch-steps.cjs` — see `tools/patch-steps.md`

## When to Run
- Only when new recipes are imported and their steps are broken/missing
- All 27 original broken recipes were already patched in the initial setup (April 2026)

## Steps

1. **Identify broken recipes.** Scan `src/data/recipes.ts` for:
   ```
   "QUERY LENGTH LIMIT EXCEEDED"   ← MyMemory error
   steps: []                        ← empty steps array
   ```
   Note the `id` field of each broken recipe.

2. **Write Slovak cooking steps** for each broken recipe. Keep steps concise and accurate. Use the existing hand-written steps in `patch-steps.cjs` as a style guide.

3. **Add each recipe to the `STEPS` object in `patch-steps.cjs`:**
   ```javascript
   'spoon-XXXXXX': [
     'Predhrej rúru na 180 °C.',
     'Zmiešaj všetky suché ingrediencie v miske.',
     // ... etc
   ],
   ```

4. **Run the patch script:**
   ```bash
   cd /Users/sambot/.openclaw/workspace/projects/neome/neome_app
   node patch-steps.cjs
   ```

5. **Add the recipe IDs to `HAND_WRITTEN_IDS`** in `deepl-retranslate.cjs` so future retranslation passes don't overwrite the hand-written steps.

6. **Run DeepL retranslation** — see `workflows/retranslate-recipes.md` — to clean up everything else in the recipe (titles, ingredient names, dietary labels).

## Expected Output
- Broken recipes now have proper Slovak cooking steps
- Console output shows: `Patched X recipes, 0 remaining broken`

## Edge Cases

| Situation | Action |
|-----------|--------|
| Recipe has steps in English (not broken, just untranslated) | Don't patch manually — let DeepL retranslation handle it |
| Steps are partially broken (some good, some error strings) | Replace the whole `steps` array in `STEPS` object |
| Recipe is missing from Spoonacular (detail call fails) | Write steps from scratch based on recipe title and ingredients |
