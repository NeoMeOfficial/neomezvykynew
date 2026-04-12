# Workflow: Build Meal Planner Feature

## Objective
Complete the remaining meal planner functionality: PDF export, paid Stripe checkout, and €30 discount code claim UI.

## Business Rules (confirmed)
| Item | Decision |
|------|----------|
| Free tier | "Recept dňa" — one recipe per day, date-seeded, filters disliked ingredients |
| Paid tier | €79 one-time purchase, optional €30 in-app discount |
| Generation source | Local recipe DB only — no live Spoonacular calls at generation time |
| Portion scaling | `targetCalories / recipe.baseCalories`, capped 0.5×–2.5× |
| Hard filter | Any recipe containing a disliked ingredient or allergen is completely excluded |

## What's Already Built (do not rebuild)
- `src/features/nutrition/types.ts` — `NutritionProfile` + `MealPlan` interfaces with all new fields
- `src/features/nutrition/mealPlanGenerator.ts` — full scoring algorithm + hard filtering + portion scaling
- `src/components/v2/nutrition/NutritionOnboarding.tsx` — 8-step flow incl. liked/disliked ingredients + favourite meal
- `src/pages/v2/Strava.tsx` — "Recept dňa" card with upgrade CTA for non-premium users
- `src/components/v2/paywall/MealPlannerBanner.tsx` — €79 / €30 discount messaging
- `src/pages/v2/JedalnicekPlanner.tsx` — basic plan display (bugs fixed: `meal.type`, `recipe.title`)

## Remaining Build Steps (in order)

### Step 1 — PDF Export
**File:** `src/pages/v2/JedalnicekPlanner.tsx`

jsPDF is already installed. Add a "Stiahnuť PDF" button that generates a 7-day plan summary.
Include per-day: meals with titles, portion sizes, calorie totals, macro breakdown (protein/carbs/fat).

```typescript
import jsPDF from 'jspdf';

const exportPDF = () => {
  const doc = new jsPDF();
  // Build content from plan.days
  doc.save('neome-jedalnicek.pdf');
};
```

### Step 2 — Paid Tier Purchase Flow
**Files to create/update:**
- `src/pages/v2/Checkout.tsx` — Stripe checkout for €79
- `src/hooks/useSubscription.ts` — add `purchaseMealPlan()` method
- Add route in `AppV2.tsx`: `/checkout/meal-plan`

**Flow:**
1. User clicks "Získať jedálniček — €79" on MealPlannerBanner
2. Routes to `/checkout/meal-plan`
3. Stripe checkout session created via Netlify function
4. On success: `canUseMealPlanner` flips to `true` in localStorage
5. Redirect back to `/jedálniček`

### Step 3 — €30 Discount Code Claim
**File:** `src/pages/v2/Checkout.tsx` (or a separate modal)

Show a code input field before Stripe checkout. If code is valid, reduce price shown to €49.
Valid codes: store a list in `.env.local` as `VITE_DISCOUNT_CODES=CODE1,CODE2`.

### Step 4 — Meal Swap (stretch goal)
Each slot in `JedalnicekPlanner` should show an "alternative" button. Generator already stores `alternatives: Recipe[]` per slot — just wire up the UI.

## Key Files Reference
```
src/features/nutrition/types.ts          NutritionProfile, MealPlan, DayPlan interfaces
src/features/nutrition/mealPlanGenerator.ts  scoreRecipe(), generateMealPlan()
src/pages/v2/JedalnicekPlanner.tsx       Plan display UI
src/components/v2/paywall/MealPlannerBanner.tsx  Paywall CTA
src/hooks/useSubscription.ts             canUseMealPlanner flag
```

## Generator Algorithm Reference
```
For each of 7 days:
  For each meal slot (determined by mealsPerDay preference):
    1. Filter: exclude recipes with disliked ingredients or allergens
    2. Filter: match correct category (ranajky/obed/vecera/snack)
       → vecera falls back to obed if vecera pool < 3
    3. Score: liked ingredients (+15), favourite meal type (+10),
              calorie proximity, not yet used in plan (+20), random noise
    4. Pick highest scorer
    5. portionMultiplier = Math.min(Math.max(targetCals / recipe.calories, 0.5), 2.5)
    6. Store 2 runner-ups as alternatives
```

## Edge Cases
- If the filtered pool for a slot is empty (all recipes contain disliked ingredients), relax the liked-ingredient score only — never relax the hard disliked filter.
- `vecera` only has 5 recipes — generator already falls back to `obed`. Fix properly once DB is expanded (see `workflows/expand-recipe-database.md`).
