# Migration Plan — NeoMe → Production App

End-to-end rollout. This complements `README.md` (the orientation) and `PLAYBOOK.md` (the per-screen recipe).

---

## Order of operations

```
Step 1  Tokens (foundation)              ← landed in 01-tokens/
Step 2  shadcn reskin                    ← landed in 02-shadcn-reskin/
Step 3  Component library                ← landed in 03-components/
Step 4  Trial batch screens (3)          ← landed in 04-screens/
Step 5  Wave 1 — pillars (Knižnica + Telo)
Step 6  Wave 2 — Strava + Myseľ + Cyklus
Step 7  Wave 3 — Komunita + Správy + Denník
Step 8  Wave 4 — Commerce (paywall + checkout + cancel)
Step 9  Wave 5 — Polish (referral, points, badges, blog)
```

Steps 1-4 ship in this handoff. Steps 5-9 ship in subsequent batches once the trial batch lands.

---

## Wave 1 — Pillars: Knižnica + Telo

**Why these first:** Knižnica is the single most-used surface for Free users; Telo is the Plus flagship.

Screens (all marked Keep in the prototype):

- `Knižnica index` — pillar tile grid
- `Knižnica · Pohyb` — drill-down
- `Knižnica · Strava`
- `Knižnica · Myseľ`
- `Search` — affordance + results
- `Telo · hub` — "Tvoj program"
- `Telo · program detail`
- `Telo · workout video player`
- `Telo · post-workout completion`

**New components needed** (request when ready): `PillarTile`, `ContinueCard`, `SectionedList`, `SearchBar`, `NextWorkoutCard`, `ProgramCard`, `ExerciseRow`, `VideoPlayer`, `WorkoutHistoryRow`, `CompletionMoment`.

## Wave 2 — Strava + Myseľ + Cyklus

- `Strava · hub` — "Tvoj jedálniček"
- `Strava · recipe browser`
- `Strava · jedálniček (meal plan day)`
- `Strava · recipe detail`
- `Myseľ · hub` — daily affirmation + meditation library
- `Myseľ · meditation player`
- `Cyklus · phase ring (full)` — main cycle screen
- `Cyklus · log sheet (bottom-sheet)` — symptom logger
- `Cyklus · insights`

**New components**: `RecipeCard`, `RecipeRow`, `JedalnicekDayCard`, `MealPlanDayStrip`, `DailyAffirmationCard`, `MeditationCard`, `AudioPlayer`, `PhaseRing`, `SymptomChip`, `LogSheet`, `InsightCard`.

## Wave 3 — Komunita + Správy + Denník

- `Komunita feed`
- `Komunita post detail`
- `Komunita post composer`
- `Správy inbox`
- `Správy thread`
- `Správy composer`
- `Denník archive`
- `Denník entry detail`
- `Návyky composer (habit creator)`
- `Návyky list`

**New components**: `FeedPost`, `CommentRow`, `InboxRow`, `MessageBubble`, `DiaryEntryCard`, `HabitRow`, `HabitComposerForm`, `EmptyState`.

## Wave 4 — Commerce

- `Plus paywall`
- `Plus paywall · plan compare`
- `Checkout · payment method`
- `Checkout · success`
- `Receipt detail`
- `Cancel flow · step 1 (warm retention)`
- `Cancel flow · step 2 (offer)`
- `Cancel flow · final confirm`

**New components**: `PaywallPricingCard`, `PaywallProgramsList`, `PlanCompareRow`, `CheckoutPaymentMethod`, `ReceiptRow`.

## Wave 5 — Polish

- `Referral main`
- `Referral · invitee landing page`
- `Referral · tracking`
- `Points · summary`
- `Points · catalog + redeem`
- `Badges hub`
- `Blog · article hero + body`

**New components**: `ReferralCodeCard`, `InviteeStatusRow`, `PointsBalance`, `PointsActivityRow`, `RewardCard`, `BadgeTile`, `BlogArticleCard`, `ArticleHero`.

---

## How the design team supports each wave

When you finish a wave's PR, the design team will:

1. **Walk the live UI** alongside the prototype on a 30-min review.
2. **Mark deltas** on the new wave's batch (anything we overlooked or want to refine).
3. **Hand off the next batch** the same way — JSX + PROMPT.md per screen, new components, new artboard IDs.

We're not delivering a giant Figma-equivalent dump. We're shipping screens that we've already validated, in priority order, so engineering never blocks on design and design never blocks on engineering.

---

## Out-of-scope for v1 (not in any wave)

These exist as artboards in the prototype but were not marked Keep — defer or kill:

- Buddy / accountability partner flow
- Live class / scheduled events
- Coach DM (paid 1:1 coaching)
- Multi-language (English) — Slovak only at v1
- Apple Watch / wearables sync
- Health Connect / HealthKit integration

---

## Risk register

| Risk | Mitigation |
|---|---|
| Token names collide with shadcn defaults | All new tokens are namespaced (`--pillar-telo`, `--cream-2`); shadcn's `--background`, `--foreground`, etc. are remapped, not renamed. |
| Slovak diacritics break in form inputs | Use `lang="sk"` on root html; verify with Á/Č/Ď/É/Í/Ĺ/Ľ/Ň/Ó/Ô/Ŕ/Š/Ť/Ú/Ý/Ž. |
| Plus tier upsells leak across pillar surfaces | The `PlusTag` component is the only sanctioned way to mark gated content. Reviewers should reject any inline "Plus only" string. |
| Italic creep in body copy | Italic is reserved for blog pull quotes and onboarding hero accents. Do not use `<em>` anywhere else in body copy. |
