# PRD: Period Tracker (Periodka)

## Problem Statement

The period tracker exists in the app but is partially implemented — it has cycle calculation logic, symptom tracking, and a calendar view, but lacks the daily content layer that is the core product vision. The tracker is currently a logging tool; it needs to become the personalisation engine for the entire app, delivering daily phase-aware guidance across food, movement, and mind. Key features like notifications, PDF export, post-plan content, and app-wide integration are missing or not defined.

---

## Solution

A cycle tracking system that:
1. Predicts cycle phases from user-provided data
2. Delivers daily personalised guidance (what to expect today, food/movement/mind tips) based on cycle phase
3. Logs symptoms with pre-set and custom options, and surfaces patterns over time
4. Connects to the home page so cycle phase is always visible
5. Supports PDF export for doctor appointments
6. Handles irregular, postpartum, and perimenopausal cycles gracefully

All content is in Slovak only. All tips are expert-curated, not AI-generated.

---

## User Stories

### Initial Setup
- As a new user, I enter the start date of my last period, the duration of my bleeding, and my average cycle length
- As a user who doesn't know my cycle length, I can instead enter the date I expect my next period — the app calculates cycle length from this
- As a user, my cycle phases (menstrual, follicular, ovulatory, luteal) are calculated automatically from my inputs
- As a user during onboarding, I choose which notifications I want to receive (period reminder is pre-selected by default)

### Daily Experience
- As a user, I open the period tracker and immediately see which day of my cycle I am on today
- As a user, I see a clear label for my current phase (e.g. "Luteálna fáza — deň 19")
- As a user, I see "Čo môžeš dnes očakávať" — a short description of what my body is doing today hormonally
- As a user, I see "Čo ti pomôže cítiť sa lepšie" with three sections:
  - **Strava** — one practical food tip for today based on my phase
  - **Pohyb** — one movement recommendation for today based on my phase
  - **Myseľ** — one mental/emotional tip for today based on my phase
- As a user, all tips are short, practical, and written for busy Slovak mothers
- As a user, tips rotate through a curated library — I see different tips on different days within the same phase

### Symptom Logging
- As a user, I can log symptoms for any day in the calendar
- As a user, I see pre-set symptom options (e.g. bolesti brucha, únava, nadúvanie, bolesti hlavy, podráždenosť, zmeny nálady, akné, citlivé prsia)
- As a user, I can add my own custom symptoms that are saved for future use
- As a user, I can see what symptoms I logged on the same cycle day last month, for comparison
- As a user, the calendar clearly shows: period days, predicted period days, ovulation window, and phase boundaries

### Cycle Predictions & Corrections
- As a user, I receive a reminder 2–3 days before my predicted period start (default on)
- As a user, when my period arrives I tap to confirm the start date — the app recalculates future predictions
- As a user, if my period arrives earlier or later than predicted, I can log the actual start date at any time
- As a user with an irregular cycle, the app learns my average cycle length over time and improves predictions
- As a user going through postpartum recovery, the app handles irregular early cycles without confusion
- As a user approaching menopause or in perimenopause, the app handles longer, shorter, or skipped cycles gracefully

### Notifications (User-Configurable)
- **Period due reminder** — 2–3 days before predicted start (default ON)
- **Ovulation window reminder** — when entering fertile window (default OFF)
- **Daily symptom log reminder** — gentle evening nudge (default OFF)
- **Phase change notification** — when moving to a new phase (default OFF)
- As a user, I configure my notification preferences during onboarding and can change them in settings

### Ovulation Window
- As a user, I can see my estimated ovulation window highlighted on the calendar
- As a user, this is shown as useful health information — not as a fertility/TTC feature
- No basal body temperature logging, no conception-specific guidance

### Home Page Integration
- As a user on the home page, I see a cycle phase widget showing:
  - My current phase name
  - Which day of my cycle I'm on
  - One tip for today (rotating from the content library)
- As a user who has not set up period tracking, the widget shows a CTA to set it up

### PDF Export
- As a user, I can export my cycle history as a PDF for doctor appointments
- The PDF includes: cycle dates, average cycle length, symptom log per cycle, phase durations
- Export is available from the period tracker settings screen

---

## Content Library — Phase-Aware Tips

### Structure
Tips are curated by Gabi or a qualified health professional. They are mapped to cycle phases, not individual days. The app rotates through tips within the appropriate phase.

**4 phases × 3 categories × 5–8 tips each = 60–96 tip entries**

| Phase | Days (approximate) | Slovak name |
|-------|-------------------|-------------|
| Menstrual | Days 1–5 | Menštruačná fáza |
| Follicular | Days 6–13 | Folikulárna fáza |
| Ovulatory | Days 14–16 | Ovulačná fáza |
| Luteal | Days 17–28 | Luteálna fáza |

### Example tip structure
```typescript
interface CycleTip {
  id: string;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  category: 'strava' | 'pohyb' | 'mysel';
  text: string; // Slovak, max 2 sentences, practical
}
```

### Content creation requirement
This content must be written before the daily tip feature can launch. It is a content task, not a development task. Gabi should write or commission this content from a health professional.

---

## Implementation Decisions

### Cycle Phase Calculation
- 4 phases calculated from: last period start date, bleeding duration, cycle length
- Menstrual: day 1 to end of bleeding
- Follicular: end of bleeding to ovulation - 2 days
- Ovulatory: 3-day window centred on cycle length ÷ 2
- Luteal: ovulation + 1 to cycle end
- On cycle recalculation (user corrects start date), all phases recalculate immediately

### Tip Rotation Logic
- Each day, select the tip for the current phase and category using a date-based seed
- Seed ensures the same user sees the same tip on the same calendar date (consistent within a session)
- Different users see different tips (seed includes user ID)
- Tips do not repeat within a 7-day window within the same phase

### Symptom Storage
- Pre-set symptoms stored as constants in Slovak
- Custom symptoms stored per user in localStorage (and Supabase when auth is live)
- Each symptom log entry: `{ date: string, symptoms: string[], notes?: string }`

### Irregular Cycle Handling
- If 3+ cycles are logged, use rolling average for predictions instead of initial input
- Flag cycles that deviate >7 days from average as "irregular" in the calendar
- Never show an error — always show a prediction, even if confidence is lower
- Postpartum mode: if user indicates postpartum, widen prediction tolerance to ±14 days
- Perimenopause mode: if user indicates perimenopause, accept cycles from 21–90 days as valid

### Language
- All content, labels, symptom names, phase names, tips, and notifications in Slovak only
- No English fallbacks anywhere in the period tracker UI

---

## Files to Create or Modify

### New
- `src/data/cycleTips.ts` — the full tip library (content to be provided by Gabi)
- `src/features/cycle/tipSelector.ts` — logic for selecting today's tip based on phase, category, date seed
- `src/features/cycle/phaseCalculator.ts` — pure function: inputs → phase boundaries (replaces/consolidates legacy `periodCalculations.ts`)
- `src/components/v2/periodka/DailyPhaseCard.tsx` — "Čo môžeš dnes očakávať" + three-category tips
- `src/components/v2/periodka/CyclePhaseWidget.tsx` — home page widget (phase + day + one tip)
- `src/features/cycle/exportCyclePDF.ts` — PDF export for doctor appointments
- `src/pages/v2/PeriodkaSettings.tsx` — notification preferences, cycle settings (route already registered)

### Modify
- `src/pages/v2/Periodka.tsx` — add DailyPhaseCard, restructure around new content layer
- `src/pages/v2/DomovNew.tsx` — add CyclePhaseWidget to home page
- `src/features/cycle/useCycleData.ts` — add rolling average calculation, postpartum/perimenopause modes
- `src/components/v2/periodka/SimplePeriodkaTracker.tsx` — add ovulation window display
- Notification system — register and schedule push notifications (requires PWA setup or native bridge)

### Delete / Consolidate
- `src/utils/periodCalculations.ts` — legacy file, consolidate into `src/features/cycle/phaseCalculator.ts`
- Orphaned Supabase hook for period tracking — remove or wire up properly

---

## Testing Strategy

- Phase calculator: given last period date + cycle length → correct phase boundaries for 28-day, 35-day, and 21-day cycles
- Tip selector: same user + same date → same tip; different users → potentially different tip; no repeat within 7 days
- Irregular cycle: period arrives 5 days early → predictions recalculate correctly
- Postpartum mode: 45-day cycle accepted without error
- PDF export: generates correct date ranges and symptom summary

---

## Out of Scope (Future Versions)

- Full fertility / trying to conceive mode (BBT logging, conception tips)
- Cycle-aware meal planner integration (noted in meal planner PRD as future)
- Cycle-aware workout and meditation recommendations (home page shows phase widget only for now)
- Partner sharing / relationship mode
- Apple Health / Google Fit sync

---

## Resolved Decisions

**1. Tip content library — AI-generated, human-reviewed**
Use the Claude API to generate all 60–96 tips using a prompt grounded in established cycle health research (ACOG guidelines, peer-reviewed hormonal literature). Gabi reviews the full set once before publishing. Tips are stored as fixed content — not generated dynamically at runtime. This is a pre-launch content task.

**2. Pre-set symptom list — AI-generated, Gabi-reviewed**
Same approach. AI generates ~20 symptoms in Slovak, Gabi confirms the list in one review session. Symptoms are fixed content, not dynamic. Suggested starting list (to be confirmed):
bolesti brucha, kŕče, únava, nadúvanie, bolesti hlavy, podráždenosť, zmeny nálady, akné, citlivé prsia, nevoľnosť, hnačka, zápcha, nespavosť, zvýšená chuť do jedla, znížená chuť do jedla, úzkosť, smútok, nízka energia, zvýšené libido, znížené libido.

**3. Home page widget — taps to "Today" view, not full calendar**
Tapping the cycle phase widget on the home page opens a focused "Today" screen — today's phase card with the three tips (Strava / Pohyb / Myseľ). A secondary button from there opens the full tracker calendar. Two levels deep, never overwhelming.

**4. Postpartum and perimenopause detection — profile questions at onboarding**
Asked once during profile creation, not detected from patterns:
- Date of birth → if age ≥ 40, perimenopause-aware mode activates (wider cycle tolerance: 21–90 days accepted)
- Date of last birth/delivery → if within 18 months, postpartum mode activates (±14 day prediction tolerance)
- "Are you currently breastfeeding?" → extends postpartum mode further if yes
These fields live in the user profile and can be updated at any time in settings.
