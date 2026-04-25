/**
 * Onboarding · Cycle setup — step 1 of cycle config
 *
 * Adapted from prototype: neome/round7-onboarding-paywall.jsx (R7 — Cycle setup)
 *
 * Asks for last period start date, then average cycle + period length.
 * Skip allowed — we still want them onboarded if they don't track.
 */

import { useState } from "react";
import { OnbShell } from "@/components/v2/onb-shell";
import { SerifHeader } from "@/components/ui/serif-header";
import { BodyText } from "@/components/ui/body-text";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CTASticky } from "@/components/v2/cta-sticky";
// Whatever date picker you ship with — these props are just suggestions
import { DatePicker } from "@/components/ui/date-picker";
import { NumberStepper } from "@/components/ui/number-stepper";

export default function OnboardingCyclePage() {
  const [lastPeriod, setLastPeriod] = useState<Date | null>(null);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  const isReady = lastPeriod !== null;

  return (
    <OnbShell
      step={1}
      totalSteps={3}
      backHref="/onboarding/welcome"
    >
      <div className="px-6 pt-4">
        <Eyebrow>KROK 1 Z 3 · CYKLUS</Eyebrow>

        <SerifHeader as="h1" size="hero" className="mt-4">
          Kedy&nbsp;si naposledy mala&nbsp;
          <em className="text-rose font-serif italic">menštruáciu</em>?
        </SerifHeader>

        <BodyText tone="secondary" className="mt-4 max-w-[320px]">
          Pomôže nám to ukázať ti správnu fázu cyklu už od prvého dňa.
        </BodyText>

        <div className="mt-8 flex flex-col gap-5">
          <DatePicker
            label="Prvý deň poslednej menštruácie"
            value={lastPeriod}
            onChange={setLastPeriod}
            maxDate={new Date()}
          />

          <NumberStepper
            label="Priemerná dĺžka cyklu"
            unit="dní"
            value={cycleLength}
            onChange={setCycleLength}
            min={20}
            max={45}
          />

          <NumberStepper
            label="Priemerná dĺžka menštruácie"
            unit="dní"
            value={periodLength}
            onChange={setPeriodLength}
            min={2}
            max={10}
          />
        </div>
      </div>

      <CTASticky
        primary={{
          label: "Pokračovať",
          href: "/onboarding/notifications",
          disabled: !isReady,
          // wire up actual save in your data layer:
          onClick: () => saveCycleSetup({ lastPeriod, cycleLength, periodLength }),
        }}
        secondary={{
          label: "Preskočiť — nateraz nesledujem",
          href: "/onboarding/notifications",
        }}
      />
    </OnbShell>
  );
}

// placeholder — wire to your actual data layer
function saveCycleSetup(_data: { lastPeriod: Date | null; cycleLength: number; periodLength: number }) {
  // POST /api/me/cycle-setup
}
