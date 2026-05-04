import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnbShell } from '@/components/v2/onb-shell';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { CTASticky } from '@/components/v2/cta-sticky';
import { ToggleRow } from '@/components/ui/toggle-row';
import { useNotificationPrefs } from '@/hooks/use-notification-prefs';

export default function OnboardingNotifications() {
  const navigate = useNavigate();
  const { prefs, update } = useNotificationPrefs();

  return (
    <OnbShell step={3} totalSteps={3} onBack={() => navigate('/onboarding/cycle')}>
      <div className="pt-4">
        <Eyebrow>KROK 3 Z 3 · UPOZORNENIA</Eyebrow>

        <SerifHeader as="h1" size="hero" className="mt-4">
          Ako často{' '}
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
            checked={prefs.morning}
            onChange={v => update({ morning: v })}
          />
          <ToggleRow
            title="Cyklus"
            subtitle="Začiatok novej fázy a očakávaná menštruácia"
            checked={prefs.cyclePhase}
            onChange={v => update({ cyclePhase: v })}
          />
          <ToggleRow
            title="Komunita"
            subtitle="Reakcie a odpovede na tvoje príspevky"
            checked={prefs.communityReactions}
            onChange={v => update({ communityReactions: v })}
          />
        </div>
      </div>

      <CTASticky
        label="Hotovo"
        skipLabel="Preskočiť"
        onClick={() => navigate('/domov-new')}
        onSkip={() => navigate('/domov-new')}
      />
    </OnbShell>
  );
}
