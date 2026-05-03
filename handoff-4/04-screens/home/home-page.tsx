/**
 * Home (Domov) — canonical screen
 *
 * Adapted from prototype: neome/round12-home.jsx (R12 — final approved iteration)
 *
 * The five daily-ritual cards in fixed order ARE the navigation:
 *   1. Telo (Body)        — TERRA accent
 *   2. Strava (Nutrition) — SAGE accent
 *   3. Myseľ (Mind)       — MAUVE accent
 *   4. Návyky (Habits)    — INK (no pillar)
 *   5. Reflexie (Diary)   — INK (no pillar)
 *
 * The Cyklus card sits separately above DNES — it's a prompt for users who
 * haven't set up tracking, or a phase summary for those who have.
 *
 * Tier behavior:
 *   - Plus + program + meal plan + cycle → full state (canonical)
 *   - Plus, no meal plan → SADA upsell visible inline on Strava card
 *   - Plus, no program → "navrhnutý cvik" (suggested exercise) on Telo card
 *   - Free → all cards point to Knižnica content; Plus upgrade banner near top
 */

import { GreetingHero } from "@/components/v2/greeting-hero";
import { PhaseStrip } from "@/components/v2/phase-strip";
import { RitualCard } from "@/components/v2/ritual-card";
import { UpgradeBanner } from "@/components/v2/upgrade-banner";
import { SectionHeader } from "@/components/ui/section-header";
import { BottomNav } from "@/components/v2/bottom-nav";
import { useUser } from "@/hooks/use-user"; // expected: { name, tier, hasProgram, hasMealPlan, hasCycleData }
import { useTodayRituals } from "@/hooks/use-today-rituals";
import { useCycle } from "@/hooks/use-cycle";

export default function HomePage() {
  const user = useUser();
  const rituals = useTodayRituals();
  const cycle = useCycle();
  const greeting = getTimeBasedGreeting(); // "Krásne ráno", "Krásny deň", "Krásny večer"
  const tagline = getDailyTagline(); // editorial line of the day from CMS

  const showMealPlanUpsell = user.tier === "plus" && !user.hasMealPlan;
  const showProgramFallback = user.tier === "plus" && !user.hasProgram;
  const showFreeUpgrade = user.tier === "free";

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Greeting hero */}
      <GreetingHero
        name={user.name}
        tier={user.tier}
        greeting={greeting}
        tagline={tagline}
        date={formatDateLong(new Date())} // "Streda · 22. apríla"
      />

      {/* Cycle phase strip — always visible above DNES, content varies */}
      <div className="mt-6 px-[18px]">
        <PhaseStrip
          state={user.hasCycleData ? "active" : "prompt"}
          phase={cycle?.phase}
          dayOfCycle={cycle?.dayOfCycle}
          note={cycle?.note}
        />
      </div>

      {/* Free-tier upgrade banner — between phase strip and DNES */}
      {showFreeUpgrade && (
        <div className="mt-4 px-[18px]">
          <UpgradeBanner
            headline="Programy, jedálniček a meditácie"
            subline="Odomkni v Plus"
            href="/plus"
          />
        </div>
      )}

      {/* DNES — the five ritual cards */}
      <SectionHeader eyebrow="DNES" className="mt-6 px-[22px]" />

      <div className="mt-3 px-[18px] flex flex-col gap-3">
        <RitualCard
          pillar="telo"
          eyebrow="POHYB"
          title={rituals.telo.title}
          subtitle={rituals.telo.subtitle}
          status={rituals.telo.status}
          duration={rituals.telo.duration}
          fallback={showProgramFallback ? "navrhnuty-cvik" : undefined}
          href={rituals.telo.href}
        />

        <RitualCard
          pillar="strava"
          eyebrow="JEDÁLNIČEK"
          title={rituals.strava.title}
          subtitle={rituals.strava.subtitle}
          status={rituals.strava.status}
          upsell={showMealPlanUpsell ? "sada" : undefined}
          href={rituals.strava.href}
        />

        <RitualCard
          pillar="mysel"
          eyebrow="MEDITÁCIA"
          title={rituals.mysel.title}
          subtitle={rituals.mysel.subtitle}
          status={rituals.mysel.status}
          duration={rituals.mysel.duration}
          locked={user.tier === "free" && !rituals.mysel.freeAccess}
          href={rituals.mysel.href}
        />

        <RitualCard
          pillar="ink"
          eyebrow="NÁVYKY"
          title="3 návyky · 1 splnený"
          subtitle="Voda · Prechádzka · Ranná rutina"
          status="in-progress"
          progress={1 / 3}
          href="/navyky"
        />

        <RitualCard
          pillar="ink"
          eyebrow="REFLEXIE"
          title="Krátky zápis na večer"
          subtitle="Čo dnes bolo dobré?"
          status="not-started"
          href="/dennik/dnes"
        />
      </div>

      <BottomNav active="domov" />
    </div>
  );
}

// ─── helpers (move to lib/ when adding more screens that need them) ───
function getTimeBasedGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Krásne ráno";
  if (h < 17) return "Krásny deň";
  return "Krásny večer";
}

function getDailyTagline(): string {
  // TODO: swap to CMS-fetched daily tagline rotation
  return "Silné telo vzniká z malých každodenných rozhodnutí";
}

function formatDateLong(d: Date): string {
  // TODO: replace with date-fns sk locale
  const days = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
  const months = ["januára", "februára", "marca", "apríla", "mája", "júna", "júla", "augusta", "septembra", "októbra", "novembra", "decembra"];
  return `${days[d.getDay()]} · ${d.getDate()}. ${months[d.getMonth()]}`;
}
