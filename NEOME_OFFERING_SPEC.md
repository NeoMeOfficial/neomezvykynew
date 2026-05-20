# NeoMe — Offering Spec (source of truth for the website)

**Purpose:** This document is extracted from the **NeoMe application** (`app.neome.com.au`)
on 2026-05-20. It is the canonical description of what NeoMe sells, who it's for,
and the exact story the app tells a user when they sign up.

**For the website agent:** Rebuild / review `neome-website` (or `NeoMe-WEB`) so the
marketing site tells *exactly this story*. The website's job is to get a visitor to
the app; the app is where they actually sign up. The two must not contradict each
other on features, pricing, program names, or tone.

> ⚠️ The website backup the App agent can see is a ~May 13 snapshot and may be stale.
> Trust **this spec** over anything in that backup where they disagree.

---

## 1. Brand & positioning

- **Product:** NeoMe — a wellness PWA for women, in Slovak.
- **Audience:** Slovak mothers and working women. 90% on phones (mobile-first, 375px).
- **Founder:** Gabi (authored all four exercise programs). Sam is developer/product lead.
- **Core promise (app's own words):** *"Späť k sebe."* — back to yourself.
  Paywall headlines in use: *"Všetko, čo potrebuješ."* / *"Celá cesta, tvoja."*
- **Positioning vs. dieting:** explicitly anti-restriction. *"Toto nie je diéta."*
  *"Žiadne zákazy."* Sustainable change, not short-term results.

### Tone of voice
Slovak, informal **"ty"** form throughout. Warm, female-to-female, founder-led.
Encouraging, never shaming. Speaks to time-poor mothers ("15 minút denne").

---

## 2. The four pillars

The whole app — and the website — is organised around four pillars. Each has a
fixed colour (Warm Dusk palette). Use these names and colours on the website.

| Pillar | SK name | What it is | Colour |
|---|---|---|---|
| Body | **Telo** | Exercise — the 4 programs | brown `#6B4C3B` |
| Nutrition | **Strava** | Recipes + meal planner | green `#7A9E78` |
| Mind | **Myseľ** | Meditations, journaling, habits | mauve `#A8848B` |
| Cycle | **Periodka** | Period & cycle tracking | coral `#C27A6E` |

Accent / CTA colour: copper `#B8864A`. Background: warm cream `#F0E6DA`.
Text: heading `#2E2218`, body `#8B7560`. **No purple/cyan/pink.**

---

## 3. Exercise programs (Telo) — 4 canonical programs

All authored by Gabi. Progressive levels 1→4. Each is a structured plan delivered
day-by-day (Mon–Fri email with that day's exercise + motivational video).
**These names are canonical — do not rename them on the website.**

### Level 1 — Postpartum (8 weeks)
For women who need to strengthen the abdominal corset, resolve diastasis or
incontinence — months *or years* after birth. Safe after C-section (3+ months).
- 24 safe strengthening exercises
- 16 stretching exercises
- 16 meditations
- Progressive 8-week plan
- Safe even years post-partum

### Level 2 — BodyForming (6 weeks)
For women starting full-body toning who do **not** have diastasis. Beginner entry point.
- 18 bodyweight strengthening exercises
- 12 stretches + 12 short meditations
- Progressive 6-week plan, rising intensity
- Posture & breathing technique

### Level 3 — ElasticBands (6 weeks)
For women shaping their figure with the dynamic resistance of elastic bands.
Assumes a solid base (do L2/L1 first if returning from a long break).
- 18 strengthening exercises with bands
- 12 stretches + 12 short meditations
- Progressive 6-week plan
- Targets "critical" areas (glutes, thighs, arms, core)

### Level 4 — Strong&Sexy (6 weeks)
For advanced women with good technique who want to push limits — dumbbell training.
- 18 advanced dumbbell exercises
- 12 deep-relaxation stretches + 12 meditations
- Progressive 6-week plan
- Builds a stronger, defined, "sexy" physique + confidence

**Common structure (all programs):** Mon/Tue/Thu = strengthening (15 min);
Wed/Fri = stretching & meditation (15–20 min). Home equipment only
(mat, bands, Pilates ball, dumbbells — affiliate links to SharpShape.cz).

---

## 4. Nutrition (Strava)

### Recipe library
**120+ recipes** included with NeoMe Plus — this is the canonical figure; use
**"120+"** on the website. Categories: raňajky, obed, večera, snack, smoothie.
Recipes use ingredients available in Slovak supermarkets (the app says "z Tesca").
Each has macros, prep time, steps, allergen & dietary tags (vegetarian / vegan /
gluten-free).

> Resolved 2026-05-20: the app previously stated the count three ways (105 / 108+
> / 116). All user-facing surfaces in the app are now standardised to **"120+"**.

### Meal planner — €57 one-time add-on ("Jedálniček na mieru")
A separate paid product, **not** part of the subscription. One-time €57, then
yours forever. Positioned as *"Toto nie je diéta."*

What it is: a personalised 7-day meal plan generated from the user's age, weight,
height, goal and activity level (BMR-based).
- 7-day personalised plan with macros & calories per day
- A recipe for every meal
- Automatic shopping list
- Vegetarian / vegan / gluten-free variants
- 3 goals: lose weight (−300 kcal), maintain, gain muscle (+250 kcal)
- 4 steps: fill profile → set preferences → get plan → eat & progress

App marketing claims on this product (for reference / reuse): "2 400+ women using",
"4.9 rating", testimonials present. Guarantee: *"100% spokojnosť alebo zmena plánu kedykoľvek."*

---

## 5. Pricing — exact figures

### NeoMe Plus (subscription) — one plan, three billing periods
| Period | Total charged | Per month | Saving |
|---|---|---|---|
| Monthly | **€24,90** / mo | €24,90 | — |
| Quarterly | **€63,00** / 3 mo | €21,00 | ~15% |
| Yearly | **€199,00** / yr | €16,58 | ~33% |

"Zrušíš kedykoľvek" — cancel anytime, no long-term commitment.

### Meal planner add-on
**€57** one-time payment (see §4).

### Free tier
NeoMe has a genuine free tier — the website can offer "start free".

> ⚠️ Memory note: some app files still show stale prices (€29,90, €4,99). The
> figures in **this table** are canonical. Don't copy old website prices either.

---

## 6. Free vs. Plus — what's gated

| Feature | Free | Plus |
|---|---|---|
| Library: exercises, recipes, meditations | ✅ | ✅ |
| Reflection / journal | ✅ (7-day history) | ✅ (full history) |
| Cycle prediction | ✅ (preview only) | ✅ (full + recommendations) |
| The 4 exercise programs | ❌ | ✅ |
| Cycle with phase recommendations | ❌ | ✅ |
| Custom habits | ❌ | ✅ (unlimited) |

**Plus feature list (verbatim from app):**
- All fitness programs (4 levels)
- Unlimited access to the recipe library
- Menstrual cycle & symptom tracking
- Community of Slovak women + buddy system
- Personal journal & habit tracking
- Offline access to content & meditations

**Plus highlights (verbatim):**
- 15-minute workouts adapted to your cycle
- Recipes with ingredients from Tesco
- Support from experienced mothers
- No long-term commitment

---

## 7. Full app feature surface (for the "what's inside" section)

Beyond the four pillars, the app includes:

- **Periodka** — cycle & period tracking, phase overview, symptom logging,
  insights, calendar, per-phase recommendations (mood / food / movement).
- **Komunita** — community feed: posts, threads, messaging.
- **Buddy system** — pairs users for accountability.
- **Denník** — personal journal / daily reflection (with history).
- **Návyky** — habit tracker with history & stats.
- **Gamifikácia** — badges (Odznaky), points & rewards.
- **Meditácie** — meditation library + audio player.
- **Knižnica** — central content library (exercises, recipes, meditations).
- **Referral program** — invite friends, earn credits.
- **Favorites, search, offline (PWA installable).**

---

## 8. Signup story / conversion flow

The website's job ends at "open the app". Inside the app the flow is:
Welcome → cycle setup → notifications → plan → program pick → paywall.

The paywall offers **Plus** (primary CTA "Začať s Plus") or "Pokračovať zdarma".
The €57 meal planner is sold separately, post-signup, via its own promo page.

**Implication for the website:** lead with the free entry + the four pillars +
the 4 programs as the headline offer. Present Plus pricing transparently
(€24,90/mo, cheaper quarterly/yearly). Treat the meal planner as a secondary
"also available" item, not the hero.

---

## 9. Resolved decisions (2026-05-20)

1. **Recipe count → "120+"** — canonical. Standardised across the app; use "120+"
   on the website.
2. **Program names** — the canonical four are Postpartum, BodyForming,
   ElasticBands, Strong&Sexy (§3). The stale Paywall string has been corrected.
3. **Pricing** — €24,90/mo is canonical, per the in-app onboarding pricing page
   (`OnboardingPlan.tsx`, which reads the `SUBSCRIPTION_PLANS` constant). The §5
   table reflects this. No stale prices remain in the app.

4. **Onboarding program tiles** — both onboarding flows (`Onboarding.tsx`,
   `OnboardingPrograms.tsx`) previously offered two non-existent programs
   (*"Hormón v rovnováhe"*, *"Pokoj v hlave"*) with wrong durations. Corrected to
   the canonical four with accurate durations.

### Open follow-up (app-side, non-blocking)
Dedicated onboarding tile images for ElasticBands & Strong&Sexy don't exist yet —
`program-hormonal.jpg` / `program-mindful.jpg` are reused as placeholders (flagged
with TODOs in both files). Add `program-elastic-bands.jpg` /
`program-strong-sexy.jpg` when available. Does not affect the website.

---

## 10. Domains

- App: `app.neome.com.au` (where users sign up)
- Admin: `admin.neome.com.au`
- Marketing site: deploys separately (the website agent owns this)
