/**
 * Onboarding · Welcome — first-run hero
 *
 * Adapted from prototype: neome/round7-onboarding-paywall.jsx (R7 — canonical)
 *
 * Editorial hero. No auth-first. The user can browse the value prop and
 * progress straight into the cycle setup; account creation happens later.
 *
 * Pattern: full-bleed warm cream background, serif display, single sticky CTA,
 * de-emphasized "Pokračovať bez účtu" link below.
 */

import { Link } from "react-router-dom"; // or your router of choice
import { SerifHeader } from "@/components/ui/serif-header";
import { BodyText } from "@/components/ui/body-text";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CTASticky } from "@/components/v2/cta-sticky";

export default function OnboardingWelcomePage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col px-6 pt-20">
        <Eyebrow tone="muted">NEOME · ZAČNI TU</Eyebrow>

        <SerifHeader as="h1" size="display" className="mt-5">
          Život v rytme&nbsp;
          <em className="text-terra not-italic font-serif italic">tvojho cyklu</em>
        </SerifHeader>

        <BodyText size="lg" tone="secondary" className="mt-5 max-w-[300px]">
          Pohyb, výživa, myseľ a cyklus — na jednom mieste,
          v slovenčine, pre ženy ako ty.
        </BodyText>

        {/* Editorial imagery placeholder — replace with real photography */}
        <div className="mt-10 mx-auto w-full max-w-[280px] aspect-[3/4] rounded-3xl bg-cream-2 border border-hair" />
      </div>

      {/* Sticky bottom CTA */}
      <CTASticky
        primary={{
          label: "Začnime",
          href: "/onboarding/cycle",
        }}
        secondary={{
          label: "Pokračovať bez účtu",
          href: "/domov-new",
        }}
        legalNote="Pokračovaním súhlasíš s podmienkami."
      />
    </div>
  );
}
