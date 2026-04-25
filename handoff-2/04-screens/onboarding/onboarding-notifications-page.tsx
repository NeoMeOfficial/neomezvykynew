/**
 * Onboarding · Notifications opt-in — step 3 of 3
 *
 * Adapted from prototype: neome/round7-onboarding-paywall.jsx (R7 — Notifs opt-in)
 *
 * Three toggle rows + skip-friendly. End of onboarding hands off to Home.
 */

import { useState } from "react";
import { OnbShell } from "@/components/v2/onb-shell";
import { SerifHeader } from "@/components/ui/serif-header";
import { BodyText } from "@/components/ui/body-text";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CTASticky } from "@/components/v2/cta-sticky";
import { ToggleRow } from "@/components/ui/toggle-row";

export default function OnboardingNotificationsPage() {
  const [morning, setMorning] = useState(true);
  const [cycle, setCycle] = useState(true);
  const [community, setCommunity] = useState(false);

  return (
    <OnbShell step={3} totalSteps={3} backHref="/onboarding/cycle">
      <div className="px-6 pt-4">
        <Eyebrow>KROK 3 Z 3 · UPOZORNENIA</Eyebrow>

        <SerifHeader as="h1" size="hero" className="mt-4">
          Ako často&nbsp;
          <em className="text-mauve font-serif italic">sa máme ozvať</em>?
        </SerifHeader>

        <BodyText tone="secondary" className="mt-4 max-w-[320px]">
          Ticho a žiadne reklamy. Len drobné pripomenutia, ktoré ti pomôžu
          ostať v rytme.
        </BodyText>

        <div className="mt-8 flex flex-col gap-2">
          <ToggleRow
            title="Ranná zostava"
            subtitle="Krátky prehľad dňa o 8:00"
            checked={morning}
            onChange={setMorning}
          />
          <ToggleRow
            title="Cyklus"
            subtitle="Začiatok novej fázy a očakávaná menštruácia"
            checked={cycle}
            onChange={setCycle}
          />
          <ToggleRow
            title="Komunita"
            subtitle="Reakcie a odpovede na tvoje príspevky"
            checked={community}
            onChange={setCommunity}
          />
        </div>
      </div>

      <CTASticky
        primary={{
          label: "Hotovo",
          href: "/home",
          onClick: () => savePreferences({ morning, cycle, community }),
        }}
        secondary={{
          label: "Preskočiť",
          href: "/home",
        }}
      />
    </OnbShell>
  );
}

function savePreferences(_p: { morning: boolean; cycle: boolean; community: boolean }) {
  // POST /api/me/notification-prefs
}
