import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { 
  getOverviewTourSteps, 
  getEstimateTourSteps, 
  getFeelBetterTourSteps, 
  getCalendarTourSteps 
} from './tourSteps';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface PeriodkaTourProps {
  accessCode?: string;
  autoStart?: boolean;
  activeSection?: string;
}

export const PeriodkaTour = ({ accessCode, autoStart = false, activeSection = 'estimate' }: PeriodkaTourProps) => {
  const [runTour, setRunTour] = useState(false);
  const [tourType, setTourType] = useState<'overview' | 'section'>('overview');
  
  // Get the appropriate tour steps based on tour type and active section
  const getTourSteps = (): Step[] => {
    if (tourType === 'overview') {
      return getOverviewTourSteps();
    }
    
    switch (activeSection) {
      case 'estimate':
        return getEstimateTourSteps();
      case 'feel-better':
        return getFeelBetterTourSteps();
      case 'calendar':
        return getCalendarTourSteps();
      default:
        return getEstimateTourSteps();
    }
  };
  
  const [tourSteps, setTourSteps] = useState<Step[]>(getTourSteps());

  // Update tour steps when tour type or active section changes
  useEffect(() => {
    setTourSteps(getTourSteps());
  }, [tourType, activeSection]);

  useEffect(() => {
    // Check if user has completed the overview tour
    const overviewTourKey = accessCode ? `overview_tour_completed_${accessCode}` : 'temp_overview_tour_completed';
    const hasCompletedOverviewTour = localStorage.getItem(overviewTourKey);

    // Auto-start overview tour on first visit if enabled and not completed
    if (autoStart && !hasCompletedOverviewTour) {
      setTourType('overview');
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => setRunTour(true), 500);
    }
  }, [accessCode, autoStart]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      
      // Mark appropriate tour as completed
      if (tourType === 'overview') {
        const overviewTourKey = accessCode ? `overview_tour_completed_${accessCode}` : 'temp_overview_tour_completed';
        localStorage.setItem(overviewTourKey, 'true');
      } else {
        const sectionTourKey = accessCode 
          ? `section_tour_${activeSection}_completed_${accessCode}` 
          : `temp_section_tour_${activeSection}_completed`;
        localStorage.setItem(sectionTourKey, 'true');
      }
    }
  };

  const startOverviewTour = () => {
    setTourType('overview');
    setRunTour(true);
  };
  
  const startSectionTour = () => {
    setTourType('section');
    setRunTour(true);
  };

  return (
    <>
      <div className="flex gap-1" data-tour="welcome">
        <Button
          variant="ghost"
          size="icon"
          onClick={startOverviewTour}
          className="relative"
          title="Prehľad aplikácie"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={startSectionTour}
          className="text-xs"
          title="Návod tejto sekcie"
        >
          ?
        </Button>
      </div>

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
