# Workflow: Expand Recipe Database

## Objective
Add new recipes to `src/data/recipes.ts` from Spoonacular, translated into Slovak via DeepL, without duplicating existing entries.

## Required Inputs
- Spoonacular API key (in `.env.local` as `VITE_SPOONACULAR_API_KEY`)
- DeepL API key (in `.env.local` as `VITE_DEEPL_API_KEY`)
- Knowledge of which categories are underpopulated (check NEOME.md current state)

## Tools
- `populate-spoonacular-recipes.cjs` — see `tools/populate-spoonacular-recipes.md`

## Steps

1. **Confirm quota has reset.** Spoonacular free tier = 150 points/day, resets at midnight UTC. If the last import was today and hit 402 errors, wait.

2. **Run the import script:**
   ```bash
   cd /Users/sambot/.openclaw/workspace/projects/neome/neome_app
   DEEPL_API_KEY=fe985a2e-6a3a-47fd-969d-18ff82a769c4:fx \
   SPOONACULAR_API_KEY=119acea27b3d4e6d94fec2314ef81f82 \
   node populate-spoonacular-recipes.cjs
   ```

3. **Read the console summary.** Check how many recipes were added per category. Note any `❌ Failed` lines — most are transient and non-fatal.

4. **Run DeepL retranslation immediately** after any import — see `workflows/retranslate-recipes.md`.

5. **Update NEOME.md** current state table with the new recipe counts.

## Expected Output
- `src/data/recipes.ts` updated with new recipes merged in (no duplicates)
- A dated backup file created automatically: `src/data/recipes-backup-{timestamp}.ts`
- Console summary showing category totals

## Edge Cases

| Error | Meaning | Action |
|-------|---------|--------|
| `API Error: 402 Payment Required` | Daily quota exhausted | Wait until midnight UTC; do not retry |
| `fetch failed` on individual ingredient | Transient network issue | Non-fatal — script continues; ingredient name stays in English until DeepL pass |
| `❌ Failed to get details for recipe {id}` | Spoonacular detail call failed | Non-fatal — recipe skipped, not added |
| `Translation failed: {text} fetch failed` | DeepL transient failure | Non-fatal — original English text kept; re-run DeepL pass later |
| Duplicate recipe | Script deduplicates by Spoonacular ID | No action needed |

## Category → Spoonacular mapping
| Slovak key | Spoonacular query type | Target count |
|-----------|----------------------|--------------|
| `ranajky` | breakfast | 25 |
| `obed` | lunch | 15 |
| `vecera` | dinner | 20 ⚠️ currently 5 |
| `snack` | snack | 12 |
| `smoothie` | beverage | 10 ⚠️ currently 3 |

The script currently fetches: `dinner` (20), `snack` (15), `beverage` (10). Adjust `CATEGORIES` array in the script if breakfast/lunch need topping up.
