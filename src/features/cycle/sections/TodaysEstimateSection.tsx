import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { WellnessDonutChart } from '../WellnessDonutChart';
import { SymptomTracker } from '../SymptomTracker';
import { DailyPlanView } from '../DailyPlanView';
import { PeriodConfirmationDialog } from '../components/PeriodConfirmationDialog';
import { CycleData, DerivedState, PhaseKey } from '../types';
interface TodaysEstimateSectionProps {
  derivedState: DerivedState;
  selectedOutcome: 'next-period' | 'fertile-days' | 'ovulation' | null;
  cycleData: CycleData;
  currentDay: number;
  currentPhase: {
    name: string;
    key: string;
  };
  accessCode?: string;
  lastPeriodStart?: string | null;
  onSettingsClick?: () => void;
  onPeriodStart?: (date: Date) => void;
  onPeriodEnd?: (startDate: Date, endDate: Date) => void;
  onUseCustomDatePicker?: () => void;
}
export function TodaysEstimateSection({
  derivedState,
  selectedOutcome,
  cycleData,
  currentDay,
  currentPhase,
  accessCode,
  lastPeriodStart,
  onSettingsClick,
  onPeriodStart,
  onPeriodEnd,
  onUseCustomDatePicker
}: TodaysEstimateSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Calculate period prediction data
  const startDate = lastPeriodStart ? new Date(lastPeriodStart + 'T00:00:00') : null;
  const nextPeriodDate = startDate ? addDays(startDate, cycleData.cycleLength) : null;
  const today = new Date();
  const daysUntilPeriod = nextPeriodDate ? differenceInDays(nextPeriodDate, today) : null;

  const formatDate = (date: Date) => {
    return format(date, 'd. M. yyyy', { locale: sk });
  };

  const handlePeriodStart = (date: Date) => {
    onPeriodStart?.(date);
  };

  const handlePeriodEnd = (startDate: Date, endDate: Date) => {
    onPeriodEnd?.(startDate, endDate);
  };

  // Determine UI state based on days until period
  const getUIState = () => {
    if (daysUntilPeriod === null) return null;
    if (daysUntilPeriod > 6) return 'info';
    if (daysUntilPeriod >= 3) return 'approaching';
    if (daysUntilPeriod >= 0) return 'imminent';
    if (daysUntilPeriod >= -3) return 'overdue';
    return 'late';
  };

  const uiState = getUIState();
  return <>
      {/* Layered Glass - Multiple glass layers creating depth between header/content */}
      <div className="relative">
        {/* Background layer */}
        <div className="absolute inset-0 rounded-2xl z-0" style={{
        background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.3) 0%, rgba(253, 242, 248, 0.4) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transform: 'translate(2px, 2px)'
      }}></div>
        
        {/* Header with elevated glass layer */}
        <div className="relative px-4 py-5 sm:px-6 rounded-t-2xl z-10" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.95) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(149, 95, 106, 0.1)'
      }}>
          {/* Header glass accent */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" style={{
              color: '#FF7782'
            }} />
              <h3 className="text-lg font-medium" style={{
              color: '#FF7782'
            }}>
                Tvoj dnešný prehľad
              </h3>
            </div>
          </div>
        </div>

        {/* Content with recessed glass layer */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 space-y-5 rounded-b-2xl z-10 relative" style={{
        background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.75) 0%, rgba(253, 242, 248, 0.80) 100%)',
        boxShadow: 'inset 0 2px 8px rgba(149, 95, 106, 0.05)'
      }}>
          {/* Cycle Chart */}
          <div className="mb-4" data-tour="wellness-chart">
            <WellnessDonutChart derivedState={derivedState} selectedOutcome={selectedOutcome} cycleData={cycleData} className="mb-4" />
          </div>
          
          {/* Daily Plan View - NEW COMPONENT */}
          <DailyPlanView 
            currentDay={currentDay} 
            currentPhase={derivedState.currentPhase}
            cycleLength={cycleData.cycleLength}
            periodLength={cycleData.periodLength}
            phaseRanges={derivedState.phaseRanges}
          />
          

          {/* How do you feel today section */}
          <div className="space-y-2 mt-6" data-tour="symptom-tracker">
            <SymptomTracker 
              currentPhase={currentPhase.key as PhaseKey} 
              currentDay={currentDay} 
              accessCode={accessCode} 
              lastPeriodStart={lastPeriodStart} 
            />
          </div>
        </div>
      </div>

      {nextPeriodDate && (
        <PeriodConfirmationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          predictedDate={nextPeriodDate}
          onConfirmStart={handlePeriodStart}
          onConfirmEnd={handlePeriodEnd}
          onUseCustomDatePicker={onUseCustomDatePicker}
        />
      )}
    </>;
}