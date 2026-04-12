# PRD: Meal Planner

## Problem Statement

The meal planner is partially built but lacks clear product requirements. Key behaviours — what happens after 6 weeks, how dislikes work, household size, shopping list delivery, and favourites — were never defined. The current implementation makes assumptions that may not match the intended product. This PRD captures confirmed decisions and identifies what needs to be built or changed.

---

## Solution

A personalised 6-week meal plan, purchased as a one-off add-on (€79) by active subscribers. The plan is generated based on the user's calorie goals, dietary preferences, cooking time, and household size. After 6 weeks, users can replay their plan, show only favourites, or purchase a new plan.

The meal planner is a flagship NeoMe differentiator — not just a recipe list, but a full planning system with shopping lists, meal tracking, and preference learning.

---

## User Goals (All Apply)

Users purchase the meal planner to:
1. Save time and reduce daily decision fatigue
2. Eat healthier without having to plan from scratch
3. Lose weight through calorie-targeted meals
4. Eventually (future version): support hormonal and cycle health through phase-aligned nutrition

---

## User Stories

### Onboarding & Plan Generation
- As a subscriber, I can purchase a 6-week meal plan for €79 (or €49 with discount code NEOME30)
- As a user completing purchase, I am immediately taken to a personalisation questionnaire
- As a user in the questionnaire, I specify: goal (lose/maintain/gain), weight, height, age, activity level, meals per day, dietary type, allergies, cooking time available per meal, and household size (1, 2, or family)
- As a user, my plan is generated based on all of the above inputs
- As a user, my plan covers 6 weeks (42 days) starting from the Monday I select

### Viewing the Plan
- As a user, I can navigate my plan week by week (T1–T6) and day by day (Mon–Sun)
- As a user, I can see each meal for a given day: label, recipe name, and calories
- As a user, today's meals are shown on my home page automatically
- As a user on a past day, I see only what was planned (no swap UI)
- As a user on today or a future day, I see two recipe options per meal slot and can choose between them

### Meal Preferences
- As a user, I can mark any recipe as a **favourite** — it will be prioritised in future plan generations
- As a user, I can mark any recipe as **disliked** — it is immediately replaced in my current plan and never shown to me again in future plans (it remains in the recipe library for other users)
- As a user, I can optionally mark a meal as **eaten** to track my actual intake vs. the plan (opt-in feature)

### After 6 Weeks
- As a user whose 6-week plan has ended, I am prompted with three options:
  1. **Replay** — repeat the same 6-week plan from the start
  2. **Favourites only** — show only my favourite recipes on the home page as daily suggestions
  3. **New plan** — purchase a new 6-week plan for €79
- As a user who chooses replay or favourites-only, this continues as long as my subscription is active
- As a user whose subscription is cancelled, my meal plan is removed from my profile immediately

### Shopping List
- As a user, I can view this week's shopping list in the app, grouped by food category, with quantities scaled to my household size
- As a user, I can share my shopping list via WhatsApp or Messages (as formatted text)
- As a user, I can email my shopping list to myself with one tap
- As a user, skipped or disliked meals are automatically excluded from the shopping list
- As a user, I can also export my full meal plan (meals + shopping lists) as a PDF

---

## Implementation Decisions

### What Is Already Built
- 42-day plan generation with 14-day ring buffer (repeat avoidance)
- Dual recipe card UI (two options per meal slot, active highlighted)
- Week/day navigator (T1–T6 pills, Mon–Sun pills)
- PDF export (13 pages: cover, 6 weekly meal pages, 6 weekly shopping list pages)
- Calorie accuracy enforcement (best option selected per slot)
- Home page integration (today's meals shown in TodayMealsCard)
- Version guard (clears old 7-day plans)

### What Needs to Be Built or Changed

**Onboarding additions:**
- Household size selector (1 person, 2 people, family/3+)
- Cooking time per meal selector (under 20 min / under 40 min / no limit)

**Portion scaling:**
- `portionMultiplier` must account for household size, not just calorie target
- Shopping list quantities must scale accordingly

**Preference system (new):**
- `dislikedRecipes: string[]` stored per user in localStorage (and Supabase when auth is live)
- `favouriteRecipes: string[]` stored per user
- Disliked recipes excluded from `filterRecipes()` in `mealPlanGenerator.ts`
- Favourite recipes given scoring boost in `scoreRecipe()`
- When a recipe is marked disliked mid-plan: replace it in the current plan immediately (swap to the other option, or find next best if both options are disliked)

**Post-6-week flow (new):**
- After day 42, show a prompt on the home page and planner screen with three options: Replay / Favourites only / New plan
- Replay: reset day index to 0, reuse existing plan object
- Favourites only: daily home page card shows a date-seeded favourite recipe instead of the plan
- New plan: navigate to subscription purchase flow (€79)

**Meal tracking (optional, opt-in):**
- Toggle per meal: "Mark as eaten"
- If enabled: show a daily and weekly nutrition summary (calories eaten vs. planned)
- Off by default — user must enable in settings

**Shopping list delivery:**
- WhatsApp share: `window.open('whatsapp://send?text=...')` with formatted text
- Email: `mailto:` link with shopping list as plain text body
- Both triggered from a share button on the shopping list screen

### Data Model Additions

```typescript
// Add to NutritionProfile
interface NutritionProfile {
  // existing fields...
  householdSize: number; // exact number of people, min 1 max 8
  maxCookingTimeMinutes: 20 | 40 | null; // null = no limit
}

// New user preference store
interface MealPlannerPreferences {
  dislikedRecipes: string[]; // recipe IDs
  favouriteRecipes: string[]; // recipe IDs
  trackingEnabled: boolean;
  postPlanChoice: 'replay' | 'favourites' | null;
}
```

---

## Files to Create or Modify

### New
- `src/features/nutrition/mealPlannerPreferences.ts` — read/write disliked and favourite recipe IDs
- `src/features/nutrition/PostPlanPrompt.tsx` — the three-option screen shown after week 6

### Modify
- `src/features/nutrition/NutritionOnboarding.tsx` — add household size + cooking time steps
- `src/features/nutrition/mealPlanGenerator.ts` — respect disliked recipes in filterRecipes(), boost favourites in scoreRecipe(), scale portions by household size
- `src/features/nutrition/types.ts` — add householdSize, maxCookingTimeMinutes to NutritionProfile; add MealPlannerPreferences
- `src/pages/v2/JedalnicekPlanner.tsx` — add like/dislike buttons to recipe cards, add post-plan prompt trigger
- `src/pages/v2/DomovNew.tsx` — update TodayMealsCard to handle favourites-only mode
- `src/features/nutrition/exportMealPlanPDF.ts` — ensure shopping list quantities reflect household size
- Shopping list screen — add WhatsApp share button and email button

---

## Testing Strategy

- Generate a plan for household size 2 → verify shopping list quantities are doubled
- Mark a recipe as disliked → verify it is swapped immediately and absent from future generation
- Mark a recipe as favourite → verify it appears more frequently in a regenerated plan
- Complete day 42 → verify post-plan prompt appears with all three options
- Choose "Replay" → verify day index resets and home page shows day 1 meals

---

## Out of Scope (Future Versions)

- Cycle-phase-aware meal planning (period tracker integration)
- Cooking skill level filtering
- Budget per week filtering
- Grocery store integration (e.g. Tesco online basket)
- Quarterly plan duration options

---

## Resolved Decisions

- **Cooking time data**: All 178 recipes need `prepTime` populated — this is a data task that must be completed before cooking time filtering can work. Add as a prerequisite task in the issue backlog.
- **Family household size**: Ask the user for an exact number of people (e.g. 2, 3, 4, 5+). Portion multiplier = number of people. Replace the "family" enum option with a numeric input (min 1, max 8).
- **Meal tracking + habits**: Marking a meal as eaten counts toward a "healthy eating" habit in the habit tracker. This requires the habit tracker and meal planner to share a completion event — coordinate with the habit tracker PRD.
