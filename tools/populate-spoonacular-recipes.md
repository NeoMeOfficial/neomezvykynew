# Tool: populate-spoonacular-recipes.cjs

## Location
`/Users/sambot/.openclaw/workspace/projects/neome/neome_app/populate-spoonacular-recipes.cjs`

## Purpose
Fetch recipes from the Spoonacular API, translate them into Slovak via DeepL, and merge them into `src/data/recipes.ts` without duplicating existing entries.

## Invoke
```bash
cd /Users/sambot/.openclaw/workspace/projects/neome/neome_app
DEEPL_API_KEY=fe985a2e-6a3a-47fd-969d-18ff82a769c4:fx \
SPOONACULAR_API_KEY=119acea27b3d4e6d94fec2314ef81f82 \
node populate-spoonacular-recipes.cjs
```

## Inputs
| Input | Source | Notes |
|-------|--------|-------|
| `SPOONACULAR_API_KEY` | env var | Free tier: 150 pts/day. `complexSearch` ≈ 1pt, `getRecipeDetails` ≈ 1pt |
| `DEEPL_API_KEY` | env var | Free tier: 500k chars/month |
| `src/data/recipes.ts` | file | Existing recipes — script reads and merges into this |

## What It Does
1. Reads existing `recipes.ts` to get current recipe IDs
2. Fetches `dinner` (20), `snack` (15), `beverage` (10) recipes via `complexSearch`
3. For each result, calls `getRecipeDetails` for full ingredient + step data
4. Translates title and ingredient names via DeepL (batch calls)
5. Maps Spoonacular category to Slovak key (`dinner` → `vecera`, `beverage` → `smoothie`)
6. Skips any recipe whose ID already exists in the file (deduplication by `spoon-{id}`)
7. Backs up existing file to `src/data/recipes-backup-{timestamp}.ts`
8. Writes merged result back to `src/data/recipes.ts`

## Outputs
- Updated `src/data/recipes.ts`
- Backup: `src/data/recipes-backup-{timestamp}.ts`
- Console summary: recipes added per category, total count

## Recipe Schema Output
```typescript
{
  id: 'spoon-{spoonacularId}',
  title: string,           // DeepL translated, max 70 chars
  category: 'ranajky' | 'obed' | 'vecera' | 'snack' | 'smoothie',
  description: string,     // From Spoonacular summary (HTML stripped)
  ingredients: { name: string, amount: string, unit: string }[],
  steps: string[],         // From analyzedInstructions[0].steps, falls back to raw string
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  prepTime: number,        // minutes
  servings: number,
  dietary: string[],       // Raw from Spoonacular (cleaned up by deepl-retranslate.cjs)
  image: string,           // Spoonacular CDN URL
}
```

## Known Constraints
- **402 = quota exhausted.** Do not retry. Wait until midnight UTC.
- `fetch failed` on individual ingredients = transient network, not fatal — script continues
- Steps from Spoonacular are often in English; always follow this tool with `deepl-retranslate.cjs`
- `beverage` category is what becomes `smoothie` in the app

## Category Mapping
| `CATEGORIES` array entry | Slovak key in output | Spoonacular query |
|--------------------------|---------------------|-------------------|
| `dinner` | `vecera` | `type=main+course` |
| `snack` | `snack` | `type=snack` |
| `beverage` | `smoothie` | `type=beverage` |
