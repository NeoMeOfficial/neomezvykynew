import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnbShell } from '@/components/v2/onb-shell';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { CTASticky } from '@/components/v2/cta-sticky';
import { DatePicker } from '@/components/ui/date-picker';
import { NumberStepper } from '@/components/ui/number-stepper';
import { useCycleData } from '@/features/cycle/useCycleData';

export default function OnboardingCycle() {
  const navigate = useNavigate();
  const { setLastPeriodStart, setCycleLength, setPeriodLength } = useCycleData();
  const [lastPeriod, setLastPeriod] = useState<Date | null>(null);
  const [cycleLength, setCycleLengthLocal] = useState(28);
  const [periodLength, setPeriodLengthLocal] = useState(5);

  const handleContinue = () => {
    if (lastPeriod) {
      setLastPeriodStart(lastPeriod.toISOString().split('T')[0]);
      setCycleLength(cycleLength);
      setPeriodLength(periodLength);
    }
    navigate('/onboarding/notifications');
  };

  return (
    <OnbShell step={1} totalSteps={3} onBack={() => navigate('/onboarding')}>
      <div className="pt-4">
        <Eyebrow>KROK 1 Z 3 · CYKLUS</Eyebrow>

        <SerifHeader as="h1" size="hero" className="mt-4">
          Kedy si naposledy mala{' '}
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
            onChange={setCycleLengthLocal}
            min={20}
            max={45}
          />

          <NumberStepper
            label="Priemerná dĺžka menštruácie"
            unit="dní"
            value={periodLength}
            onChange={setPeriodLengthLocal}
            min={2}
            max={10}
          />
        </div>
      </div>

      <CTASticky
        label="Pokračovať"
        skipLabel="Preskočiť — nateraz nesledujem"
        disabled={!lastPeriod}
        onClick={handleContinue}
        onSkip={() => navigate('/onboarding/notifications')}
      />
    </OnbShell>
  );
}
