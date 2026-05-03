# NeoMe Components — Catalog

Every reusable component in the design system, where it lives, what props it takes, and where it's used.

**Conventions for all components:**
- Located under `src/components/ui/` (atoms) or `src/components/v2/` (molecules).
- Use Tailwind classes only — no inline styles, no CSS modules.
- Forward refs and accept `className` for caller overrides.
- Default export omitted; named export only.
- File names are kebab-case; component names are PascalCase.

---

## Trial batch (Step 3 — Onboarding + Settings + Home)

These are shipped in this handoff. Migrate these first.

### Atoms (`src/components/ui/`)

| Component | File | Purpose | Used in |
|---|---|---|---|
| `Eyebrow` | `eyebrow.tsx` | Small uppercase tracked label above serif headers. Tones: default, muted, gold. | Everywhere |
| `SerifHeader` | `serif-header.tsx` | Gilda Display heading. Sizes: display, hero, h1, h2, h3. Italic optional. | Everywhere |
| `BodyText` | `body-text.tsx` | DM Sans body copy. Sizes: lg, md, sm, xs. Tones: primary, secondary, muted, onDark. | Everywhere |
| `PlusTag` | `plus-tag.tsx` | Gold "Plus" inline chip — marks Plus-tier affordances. | Cards, list items, settings |
| `PillarChip` | `pillar-chip.tsx` | Pillar-themed chip. Filled when `active`. | Filters in Knižnica, Home |
| `IconButton` | `icon-button.tsx` | Circular icon button. Variants: ghost, filled, outline. Sizes: sm, md, lg. | Top bars, modals |
| `SectionHeader` | `section-header.tsx` | Eyebrow + serif title + optional right link. Used above lists/grids. | Home, all hubs |
| `Avatar` | `avatar.tsx` | Circular avatar. Img or typographic initial fallback. Pillar-tinted bg. | Profil, Komunita, Buddy |
| `PriceDisplay` | `price-display.tsx` | Large serif price + period + optional strikethrough. | Paywall, Settings |
| `TopBar` | `top-bar.tsx` | Sticky screen header — back arrow + centered serif title + optional right slot. | All secondary screens |
| `ToggleRow` | `toggle-row.tsx` | Settings list row with title + subtitle + switch on the right. | Settings, Onboarding |
| `NumberStepper` | `number-stepper.tsx` | Labeled +/- numeric input with unit. | Onboarding (cycle), forms |
| `DatePicker` | `date-picker.tsx` | Labeled date row that opens native date picker. | Onboarding (cycle), Diary |

### Molecules (`src/components/v2/`)

| Component | File | Purpose | Used in |
|---|---|---|---|
| `CTASticky` | `cta-sticky.tsx` | Sticky-bottom primary CTA + sub-text + skip link. | Onboarding, Paywall |
| `OnbShell` | `onb-shell.tsx` | Onboarding step scaffold: back btn + step progress + body. | All onboarding steps |
| `GreetingHero` | `greeting-hero.tsx` | Personalized hello + date + optional right slot. | Home (top) |
| `RitualCard` | `ritual-card.tsx` | Daily ritual card — pillar accent + title + state. | Home (5 cards) |
| `PhaseStrip` | `phase-strip.tsx` | Compact cycle phase strip — day, name, note. | Home |
| `UpgradeBanner` | `upgrade-banner.tsx` | Free-tier inline Plus upgrade affordance. | Home, pillar hubs |
| `ProfileHero` | `profile-hero.tsx` | Centered avatar + name + tier + since date. | Profil (top) |
| `SettingsGroup` | `settings-row.tsx` | Labeled group of settings rows. | Settings, Profil |
| `SettingsRow` | `settings-row.tsx` | One row inside a SettingsGroup. Tone: default, danger. | Settings, Profil |
| `BottomNav` | `bottom-nav.tsx` | 5-tab primary nav. Reads active from current route. | All primary surfaces |

---

## Future batches (NOT in this handoff)

When you're ready to build subsequent sections, request these components and I'll port them.

### Knižnica + Search

- `PillarTile` — pillar pivot tile (icon + label + count) for Knižnica index.
- `ContinueCard` — "Pokračuj tu" tile with image + progress.
- `SectionedList` — labeled sections of compact rows (exercises, recipes, meditations).
- `SearchBar` — top-of-screen search input with icon.
- `BlogArticleCard` — magazine + digest layouts.
- `ArticleHero` — full-bleed article header.

### Telo (Body)

- `NextWorkoutCard` — program · week · day + continue CTA.
- `ProgramCard` — large program tile with hero image and meta.
- `ExerciseRow` — compact list row.
- `VideoPlayer` — workout video chrome.
- `WorkoutHistoryRow` — completed session row.

### Strava (Nutrition)

- `RecipeCard` — recipe tile with hero image.
- `RecipeRow` — compact recipe list row.
- `MealPlanDayStrip` — 7-day horizontal meal planner.
- `JedalnicekDayCard` — meal plan day card with all 4 meals.

### Myseľ (Mind)

- `DailyAffirmationCard` — mauve serif quote card.
- `MeditationCard` — gradient meditation tile.
- `AudioPlayer` — meditation player chrome.

### Cyklus (Period)

- `PhaseRing` — full circular phase ring (220px).
- `SymptomChip` — selectable symptom tag.
- `LogSheet` — bottom-sheet symptom logger.
- `InsightCard` — data-driven insight card.

### Komunita

- `FeedPost` — post with photo, likes, comments.
- `CommentRow` — comment under a post.
- `CommunityPromo` — "tento týždeň" promo strip on Home.

### Správy (Messages)

- `InboxRow` — conversation row.
- `MessageBubble` — chat bubble (me / them).

### Paywall + Checkout

- `PaywallPricingCard` — large price + recurring detail.
- `PaywallProgramsList` — programs as bullets.
- `PlanCompareRow` — feature comparison row (free vs plus).
- `CheckoutPaymentMethod` — payment method selector.
- `ReceiptRow` — receipt detail row.

### Points + Referral

- `PointsBalance` — large serif balance hero.
- `PointsActivityRow` — activity log row.
- `RewardCard` — redeemable reward tile.
- `ReferralCodeCard` — code + share URL hero.
- `InviteeStatusRow` — invitee with status pill.
- `BadgeTile` — earned/locked badge.

### Diary + Habits

- `DiaryEntryCard` — diary entry card.
- `HabitRow` — habit row with check toggle.
- `HabitComposerForm` — habit creation form.

### Other

- `EmptyState` — generic empty state with CTA.
- `CompletionMoment` — full-screen "krásna práca" celebration.
- `WeekCalendarStrip` — Po-Ne strip with active marker.
- `ProgressRing` — circular progress (0-100).
- `Sheet` — bottom sheet scaffold.
- `Skeleton` — shimmer placeholder.
- `ToggleSwitch` — settings toggle.
- `TopBar` — generic top header (status-safe).

---

## Naming rules

- **Atoms** = visual primitives that take props but no children that are themselves complex components. (Eyebrow, BodyText, PillarChip, etc.)
- **Molecules** = compositions of atoms with domain meaning. (RitualCard, GreetingHero, etc.)
- **Screens** stay in `src/pages/v2/` — never extract a "screen" as a component.

If a piece appears 2+ times across screens, extract it. If it appears once, keep it inline in the screen file.
