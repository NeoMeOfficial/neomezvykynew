import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { getTourSteps } from './tourSteps';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface PeriodkaTourProps {
  accessCode?: string;
  autoStart?: boolean;
}

export const PeriodkaTour = ({ accessCode, autoStart = false }: PeriodkaTourProps) => {
  const [runTour, setRunTour] = useState(false);
  const [tourSteps] = useState<Step[]>(getTourSteps());

  useEffect(() => {
    // Check if user has completed the tour before
    const tourKey = accessCode ? `tour_completed_${accessCode}` : 'temp_tour_completed';
    const hasCompletedTour = localStorage.getItem(tourKey);

    // Auto-start tour on first visit if enabled and not completed
    if (autoStart && !hasCompletedTour) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => setRunTour(true), 500);
    }
  }, [accessCode, autoStart]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      
      // Mark tour as completed
      const tourKey = accessCode ? `tour_completed_${accessCode}` : 'temp_tour_completed';
      localStorage.setItem(tourKey, 'true');
    }
  };

  const startTour = () => {
    setRunTour(true);
  };

  const resetTour = () => {
    const tourKey = accessCode ? `tour_completed_${accessCode}` : 'temp_tour_completed';
    localStorage.removeItem(tourKey);
    setRunTour(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={startTour}
        className="relative"
        title="Spustiť návod"
        data-tour="welcome"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#955F6A',
            textColor: '#2D1B1E',
            backgroundColor: '#FFFFFF',
            arrowColor: '#FFFFFF',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: 12,
            padding: 20,
          },
          buttonNext: {
            backgroundColor: '#955F6A',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 500,
          },
          buttonBack: {
            color: '#955F6A',
            marginRight: 10,
          },
          buttonSkip: {
            color: '#6B7280',
          },
        }}
        locale={{
          back: 'Späť',
          close: 'Zavrieť',
          last: 'Dokončiť',
          next: 'Ďalej',
          skip: 'Preskočiť',
        }}
      />
    </>
  );
};
