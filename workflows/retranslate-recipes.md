# Workflow: Retranslate Recipes with DeepL

## Objective
Improve translation quality across all recipes in `src/data/recipes.ts` — titles, descriptions, ingredient names, cooking steps, and dietary labels.

## Required Inputs
- DeepL API key (in `.env.local` as `VITE_DEEPL_API_KEY`)
- `src/data/recipes.ts` must exist and be parseable

## Tools
- `deepl-retranslate.cjs` — see `tools/deepl-retranslate.md`

## When to Run
- **Always** run immediately after `expand-recipe-database.md` workflow
- Run standalone when translation quality looks poor (English words in Slovak content)

## Steps

1. **Run the retranslation script:**
   ```bash
   cd /Users/sambot/.openclaw/workspace/projects/neome/neome_app
   DEEPL_API_KEY=fe985a2e-6a3a-47fd-969d-18ff82a769c4:fx \
   node deepl-retranslate.cjs
   ```

2. **Read the console output.** Verify each pass completed:
   - Pass 1: Titles ✅
   - Pass 2: Descriptions ✅
   - Pass 3: Ingredient names — check count (e.g. `164/164 ingredients translated`)
   - Pass 4: Steps — check count (should be > 0 for non-hand-written recipes)
   - Pass 5: Dietary labels ✅

3. **Check the sample output** printed at the end. Verify Slovak characters appear (`á`, `č`, `š`, etc.) and sentences read naturally.

## Expected Output
- `src/data/recipes.ts` updated in-place with improved Slovak text
- Backup saved automatically: `src/data/recipes-backup-deepl-{timestamp}.ts`
- Console sample showing 3 spot-checked recipes

## How the Script Works (5 passes)

| Pass | What it does | Notes |
|------|-------------|-------|
| 1 | Translate all titles | Batch of all recipes at once; truncated to 70 chars |
| 2 | Translate all descriptions | Batch of all recipes at once |
| 3 | Translate ingredient names | Only names that don't already look Slovak (regex check); chunks of 50 |
| 4 | Retranslate cooking steps | Skips the 27 hand-written recipe IDs hardcoded in `HAND_WRITTEN_IDS` |
| 5 | Normalize dietary labels | Static map: e.g. `lacto ovo vegetarian` → `lakto-ovo vegetariánske` |

## Edge Cases

| Situation | Action |
|-----------|--------|
| DeepL returns original English text unchanged | Transient API issue — re-run script |
| Slovak detection misses a word | Acceptable; the regex catches most cases. Don't over-engineer. |
| Hand-written step accidentally gets overwritten | Restore from `recipes-backup-deepl-*.ts` backup; add the recipe ID to `HAND_WRITTEN_IDS` in the script |
| DeepL free tier quota exceeded (500k chars/month) | Check usage at deepl.com; wait for monthly reset |

## Hand-written recipe IDs (steps are already correct — never re-translate)
These 27 recipes have manually written Slovak cooking steps. Pass 4 skips them.
Stored in `deepl-retranslate.cjs` → `HAND_WRITTEN_IDS` Set.
If new hand-written recipes are added via `patch-steps.cjs`, add their IDs to this Set.
