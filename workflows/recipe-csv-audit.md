# Recipe CSV Audit — NeoMe-Recepty-Database
**Audited:** 2026-04-08  
**File:** `NeoMe-Recepty-Database - NeoMe-Recepty-Database.csv`  
**Status:** Audit complete. Fixes not yet applied.

---

## What to fix (confirmed by Sam)

### 🔴 Critical — dietary labels wrong
Re-label correctly (remove vegan/vegetarian where meat/fish is present):
- `obed-steak-s-pec-enou-zeleninou` — contains beef. Remove `vegánske, vegetariánske`
- `obed-u-dena-ryba-s-letnou-zeleninou` — contains fish. Remove `vegánske, vegetariánske` from tags
- `obed-bbg-kura-s-mango-salsou` — contains chicken. Remove `vegetariánske` from tags
- `obed-zelene-kari-s-krevetami` — contains shrimp. Remove `vegetariánske` from tags

### 🔴 Critical — allergen errors
- `obed-grilovany-mexicky-s-ala-t` — shrimp labeled as `fish`. Change to `crustaceans`
- `obed-zelene-kari-s-krevetami` — shrimp allergen missing. Add `crustaceans`. Remove `nuts` (coconut milk is not a nut allergen under EU law)
- `obed-paradajkova-polievka-s-fazul-ou` — no allergens listed but contains chicken broth. Add allergen check

### ⚠️ Contradictory labels — dairy + bezlaktózové
Sam confirmed: no dairy-free dairy is used. Remove `bezlaktózové` from any recipe that lists `dairy` as allergen.
Affected recipes (check all that have both):
- `obed-bata-tovy-kola-c-z-mlete-ho-ma-sa`
- `obed-zelene-kari-s-krevetami`
- `obed-hubova-polievka`
- `obed-paradajkova-polievka-s-fazul-ou` (and other soups)
- Run script to catch all cases automatically

### ⚠️ Remove — not a recipe
- `obed-quick-snack-ideas-list` — this is a reference list, not a recipe. Delete row.

### ⚠️ Duplicates — consolidate
These appear twice (breakfast + snack version). Keep both categories but flag as same recipe:
- `Banánovo ovsené lievance` (ranajky + snack)
- `Banánový chlieb` (ranajky + snack)
- `Jahodový chia puding` (ranajky + snack)
- `Ovsený chia puding` (ranajky + snack)
- `Praženica z tofu` — appears 3x. Keep one, delete duplicates:
  - `ranajky-praz-enica-z-tofu`
  - `ranajky-ranajkova-prazenica-z-tofu`
  - `ranajky-healthy-vegan-tofu-scramble-gf-ve`

### ⚠️ Translation needed — 22 English titles
Translate via DeepL and fix ingredient lists too:
- Strawberry Chia Protein Pudding → Slovak
- Healthy Carrot Cake Pancakes → Slovak
- Healthy Vegan Tofu Scramble (GF, VE) → Slovak (then deduplicate)
- Wraps - Rye Mountain Bread (Turkey) → Slovak
- Wraps - Rye Mountain Bread (Ham) → Slovak
- Wraps - Rye Mountain Bread (Chicken) → Slovak
- Sweet Potato Fibre Salad → Slovak
- Vegan Rice Noodle Salad → Slovak
- Sweet Potato and Hummus Roll-Ups (VE) → Slovak
- Vegan Rice Paper Rolls → Slovak
- Summer Salmon Salad → Slovak
- Tamari Tempeh Tacos → Slovak
- Deconstructed Burger Bowl (v1) → Slovak
- Chicken Teriyaki Soba Noodle Salad → Slovak
- Healthy Superfood Fibre Bowl → Slovak
- Crunchy Vegan Tofu Salad → Slovak
- Marinated Asian-Garlic Tofu Stir Fry → Slovak
- Veggie Burgers and Salad with Tahini → Slovak
- Pumpkin, Feta and Beetroot Salad (V) → Slovak
- Choc-Snickers-Date → Slovak
- Grilled Pork with Mexican-Style Corn Cobs → Slovak
- Zucchini Vegan Vegetable Fritters and Salad → Slovak

### ⚠️ Garbled text (OCR/copy-paste errors)
- `"153 šálky ovsenýchvlôčiek"` → `"1,5 šálky ovsenýchvlôčiek"`
- `"½ ČL Turmeriku tuku"` → `"½ ČL kurkumy"`
- `"0 1 žálka take"` → unclear, needs manual review
- `"1/5 pl balzamikovéhooctu"` → `"1/5 pl balzamikovéhooctu"` (words merged)
- Measurement units: convert cups/tbsp/tsp to grams/ml where possible

---

## Calorie & Macro Math — PASS
All recipes within ±6%. Small consistent gap (~22 kcal) in lunch/dinner recipes is explained by fiber not being counted. No action needed.

---

## Next session — what to do

1. Run `fix-recipe-csv.cjs` (to be written) which:
   - Reads `NeoMe-Recepty-Database - NeoMe-Recepty-Database.csv`
   - Applies all label/allergen fixes above
   - Calls DeepL to translate English titles + ingredients
   - Removes the "Quick Snack Ideas List" row
   - Removes duplicate tofu scramble entries
   - Outputs `NeoMe-Recepty-Database-FIXED.csv`

2. Write `import-csv-to-recipes.cjs` which:
   - Reads the fixed CSV
   - Converts to `Recipe[]` TypeScript format
   - Merges with existing `src/data/recipes.ts` (avoid duplicate IDs)
   - Backs up existing file first

3. After import, rebuild the 6-week meal planner generator

---

## Meal planner — confirmed decisions
- **6 weeks only** (not selectable)
- **No cycle-phase integration** (for now)
- **No Stripe yet** — build without paywall, add later
- **PDF export** — yes, include
- **Home page**: free users see sample recipe; plan holders see today's meals
- **Recipes from**: existing `recipes.ts` (73 recipes) + this CSV (~100 recipes) merged
