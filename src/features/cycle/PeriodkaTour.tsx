import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from 'react-joyride';
import { 
  getOverviewTourSteps,
  getEstimateDetailedTour,
  getFeelBetterDetailedTour,
  getCalendarDetailedTour,
  getTourCompletionStep
} from './tourSteps';
import { Button } from '@/components/ui/button';
import { HelpCircle, Lightbulb } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PeriodkaTourProps {
  accessCode?: string;
  autoStart?: boolean;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

type TourPhase = 'overview' | 'estimate-detailed' | 'feel-better-detailed' | 'calendar-detailed' | 'completion' | 'none';

export const PeriodkaTour = ({ 
  accessCode, 
  autoStart = false, 
  activeSection = 'estimate',
  onSectionChange 
}: PeriodkaTourProps) => {
  const [runTour, setRunTour] = useState(false);
  const [tourPhase, setTourPhase] = useState<TourPhase>('none');
  const isMobile = useIsMobile();
  
  // Get the appropriate tour steps based on current phase
  const getTourSteps = (): Step[] => {
    switch (tourPhase) {
      case 'overview':
        return getOverviewTourSteps();
      case 'estimate-detailed':
        return getEstimateDetailedTour();
      case 'feel-better-detailed':
        return getFeelBetterDetailedTour();
      case 'calendar-detailed':
        return getCalendarDetailedTour();
      case 'completion':
        return getTourCompletionStep();
      default:
        return [];
    }
  };
  
  const [tourSteps, setTourSteps] = useState<Step[]>(getTourSteps());

  // Update tour steps when phase changes
  useEffect(() => {
    setTourSteps(getTourSteps());
  }, [tourPhase]);

  useEffect(() => {
    // Check if user has completed the full tour
    const fullTourKey = accessCode ? `full_tour_completed_${accessCode}` : 'temp_full_tour_completed';
    const hasCompletedFullTour = localStorage.getItem(fullTourKey);

    // Auto-start tour on first visit if enabled and not completed
    if (autoStart && !hasCompletedFullTour) {
      setTourPhase('overview');
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => setRunTour(true), 500);
    }
  }, [accessCode, autoStart]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      
      // Handle completion based on current phase
      if (tourPhase === 'overview') {
        // User finished overview, ask if they want detailed tours
        const lastStep = getOverviewTourSteps().length - 1;
        if (index === lastStep && action === ACTIONS.NEXT) {
          // User wants to continue - start detailed tours
          if (onSectionChange) {
            onSectionChange('estimate');
          }
          setTimeout(() => {
            setTourPhase('estimate-detailed');
            setRunTour(true);
          }, 300);
        } else {
          // User skipped - mark as completed
          const fullTourKey = accessCode ? `full_tour_completed_${accessCode}` : 'temp_full_tour_completed';
          localStorage.setItem(fullTourKey, 'true');
          setTourPhase('none');
        }
      } else if (tourPhase === 'estimate-detailed') {
        // Move to feel-better section
        if (onSectionChange) {
          onSectionChange('feel-better');
        }
        setTimeout(() => {
          setTourPhase('feel-better-detailed');
          setRunTour(true);
        }, 300);
      } else if (tourPhase === 'feel-better-detailed') {
        // Move to calendar section
        if (onSectionChange) {
          onSectionChange('calendar');
        }
        setTimeout(() => {
          setTourPhase('calendar-detailed');
          setRunTour(true);
        }, 300);
      } else if (tourPhase === 'calendar-detailed') {
        // Show completion message
        setTimeout(() => {
          setTourPhase('completion');
          setRunTour(true);
        }, 300);
      } else if (tourPhase === 'completion') {
        // Mark full tour as completed
        const fullTourKey = accessCode ? `full_tour_completed_${accessCode}` : 'temp_full_tour_completed';
        localStorage.setItem(fullTourKey, 'true');
        setTourPhase('none');
      }
    }
  };

  const startFullTour = () => {
    setTourPhase('overview');
    setRunTour(true);
  };

  return (
    <>
      <button
        onClick={startFullTour}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-3xl bg-white border border-rose-200/20 hover:bg-gray-50 transition-all w-full"
        style={{ color: '#FF7782' }}
        title="Spustiť návod"
        data-tour="welcome"
      >
        <HelpCircle className="w-3 h-3" />
        Návod
      </button>

      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        disableScrolling={false}
        spotlightPadding={isMobile ? 5 : 10}
        floaterProps={{
          disableAnimation: isMobile,
        }}
        styles={{
          options: {
            primaryColor: '#955F6A',
            textColor: '#2D1B1E',
            backgroundColor: '#FFFFFF',
            arrowColor: '#FFFFFF',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
            width: isMobile ? '85vw' : 400,
          },
          tooltip: {
            borderRadius: 12,
            padding: isMobile ? 15 : 20,
            fontSize: isMobile ? 13 : 14,
            maxWidth: isMobile ? '90vw' : 480,
          },
          buttonNext: {
            backgroundColor: '#955F6A',
            borderRadius: 8,
            padding: isMobile ? '6px 12px' : '8px 16px',
            fontSize: isMobile ? 13 : 14,
            fontWeight: 500,
          },
          buttonBack: {
            color: '#955F6A',
            marginRight: 10,
            fontSize: isMobile ? 13 : 14,
          },
          buttonSkip: {
            color: '#6B7280',
            fontSize: isMobile ? 13 : 14,
          },
        }}
        locale={{
          back: 'Späť',
          close: 'Zavrieť',
          last: 'Dokončiť',
          next: 'Ďalší krok',
          skip: 'Preskočiť',
        }}
      />
    </>
  );
};
