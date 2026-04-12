# Tool: deepl-retranslate.cjs

## Location
`/Users/sambot/.openclaw/workspace/projects/neome/neome_app/deepl-retranslate.cjs`

## Purpose
Run a multi-pass DeepL translation over all recipes in `src/data/recipes.ts` to improve Slovak quality: titles, descriptions, ingredient names, cooking steps, and dietary labels.

## Invoke
```bash
cd /Users/sambot/.openclaw/workspace/projects/neome/neome_app
DEEPL_API_KEY=fe985a2e-6a3a-47fd-969d-18ff82a769c4:fx \
node deepl-retranslate.cjs
```

## Inputs
| Input | Source |
|-------|--------|
| `DEEPL_API_KEY` | env var |
| `src/data/recipes.ts` | file — must contain `export const recipes: Recipe[] = [...]` |

## What It Does (5 passes)

| Pass | Target | Method |
|------|--------|--------|
| 1 | Titles | Single batch of all recipe titles; truncated to 70 chars |
| 2 | Descriptions | Single batch of all descriptions |
| 3 | Ingredient names | Detect non-Slovak names via regex (`/[áäčďéíľĺňóôŕšťúýž]/i`); translate in chunks of 50 |
| 4 | Cooking steps | Skip recipes in `HAND_WRITTEN_IDS`; re-translate all others |
| 5 | Dietary labels | Static normalization map — no API call needed |

## Dietary Label Map
```javascript
'gluten free'           → 'bez lepku'
'dairy free'            → 'bez mlieka'
'lacto ovo vegetarian'  → 'lakto-ovo vegetariánske'
'vegetarian'            → 'vegetariánske'
'vegan'                 → 'vegánske'
'pescatarian'           → 'pescatariánske'
'ketogenic'             → 'ketogénne'
```

## Outputs
- Updated `src/data/recipes.ts` (in-place)
- Backup: `src/data/recipes-backup-deepl-{timestamp}.ts`
- Console sample: 3 spot-checked recipes showing title, ingredients, step 1

## HAND_WRITTEN_IDS
These recipe IDs have manually authored Slovak steps and are skipped in Pass 4:
```
spoon-945221, spoon-775666, spoon-640275, spoon-716432, spoon-639637,
spoon-716276, spoon-716417, spoon-632928, spoon-649777, spoon-660368,
spoon-652651, spoon-657917, spoon-643859, spoon-641651, spoon-634318,
spoon-716211, spoon-651765, spoon-776505, spoon-715467, spoon-715419,
spoon-715421, spoon-715437, spoon-715544, spoon-715562, spoon-715521,
spoon-715415, spoon-715397
```
**When adding new hand-written recipes:** add their IDs to this Set in the script AND to the equivalent list in `workflows/retranslate-recipes.md`.

## Known Constraints
- DeepL free tier: 500k characters/month
- `batch translate failed` = transient API issue; re-run the script
- Script falls back to original text if DeepL call fails — doesn't crash
