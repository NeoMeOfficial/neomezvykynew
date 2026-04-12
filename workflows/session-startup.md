# Workflow: Session Startup

## Objective
Orient a new Claude Code session on the NeoMe codebase before touching any code.

## Required Inputs
- None. Run at the start of every session.

## Steps

1. **Read NEOME.md** — confirms current state, pending tasks, and known gotchas.

2. **Read these source files** (in this order):
   ```
   src/features/nutrition/types.ts
   src/features/nutrition/mealPlanGenerator.ts
   src/features/nutrition/useNutritionProfile.ts
   src/pages/v2/Strava.tsx
   src/pages/v2/JedalnicekPlanner.tsx
   src/data/recipes.ts                    (first 60 lines — understand schema)
   .env.local                             (confirm API keys are present)
   ```

3. **Check recipe counts** by scanning `src/data/recipes.ts` for category distribution. Compare to targets in NEOME.md.

4. **Check pending tasks** listed in NEOME.md under "Current State".

5. **Confirm which workflow applies** to today's task and read it before starting.

## Expected Output
Clear mental model of: current recipe DB state, which features are done vs pending, and which workflow to follow for today's task.

## Edge Cases
- If `.env.local` is missing API keys, stop and ask Sam before running any import scripts.
- If `recipes.ts` has schema that doesn't match the schema in NEOME.md, trust the file — update NEOME.md if needed.
