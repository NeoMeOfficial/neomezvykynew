import { useNavigate } from 'react-router-dom';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { CTASticky } from '@/components/v2/cta-sticky';

export default function OnboardingWelcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 flex flex-col px-6 pt-20 pb-40">
        <Eyebrow tone="muted">NEOME · ZAČNI TU</Eyebrow>

        <SerifHeader as="h1" size="display" className="mt-5">
          Život v rytme{' '}
          <em className="text-terra not-italic font-serif italic">tvojho cyklu</em>
        </SerifHeader>

        <BodyText size="lg" tone="secondary" className="mt-5 max-w-[300px]">
          Pohyb, výživa, myseľ a cyklus — na jednom mieste,
          v slovenčine, pre ženy ako ty.
        </BodyText>

        <div className="mt-10 mx-auto w-full max-w-[280px] aspect-[3/4] rounded-3xl bg-cream-200 border border-ink/[0.08]" />
      </div>

      <CTASticky
        label="Začnime"
        skipLabel="Pokračovať bez účtu"
        onClick={() => navigate('/onboarding/cycle')}
        onSkip={() => navigate('/domov-new')}
        sub="Pokračovaním súhlasíš s podmienkami."
      />
    </div>
  );
}
