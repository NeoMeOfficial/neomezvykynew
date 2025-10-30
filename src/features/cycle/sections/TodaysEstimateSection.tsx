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
  selectedOutcome: 'next-period' | 'fertile-days' | null;
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
  const startDate = lastPeriodStart ? new Date(lastPeriodStart) : null;
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
                Odhad na dnes
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
          />
          
          {/* Smart period prediction button */}
          {uiState && nextPeriodDate && (
            <div className="mt-4">
              {uiState === 'info' && (
                <button
                  onClick={() => setDialogOpen(true)}
                  className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-3xl bg-white border border-rose-200/20 hover:bg-rose-50 transition-all"
                  style={{ color: '#FF7782' }}
                >
                  <span>Ďalšia menštruácia by ti mala začať: {formatDate(nextPeriodDate)}</span>
                </button>
              )}

              {uiState === 'approaching' && (
                <button
                  onClick={() => setDialogOpen(true)}
                  className="w-full flex flex-col items-center gap-1 px-4 py-3 text-center rounded-3xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all"
                  style={{ color: '#d97706' }}
                >
                  <span className="text-sm font-semibold">
                    O {Math.abs(daysUntilPeriod!)} {Math.abs(daysUntilPeriod!) === 1 ? 'deň' : 'dni'} by mala začať menštruácia
                  </span>
                  <span className="text-xs opacity-60 font-normal">Klikni pre potvrdenie</span>
                </button>
              )}

              {uiState === 'imminent' && (
                <button
                  onClick={() => setDialogOpen(true)}
                  className="w-full flex flex-col items-center gap-1 px-4 py-3 text-center rounded-3xl bg-rose-50 border border-rose-300 hover:bg-rose-100 transition-all animate-pulse"
                  style={{ color: '#FF7782' }}
                >
                  <span className="text-sm font-semibold">
                    Menštruácia by mala začať {daysUntilPeriod === 0 ? 'dnes' : `o ${daysUntilPeriod} ${daysUntilPeriod === 1 ? 'deň' : 'dni'}`}
                  </span>
                  <span className="text-xs opacity-60 font-semibold">Už začala?</span>
                </button>
              )}

              {(uiState === 'overdue' || uiState === 'late') && (
                <button
                  onClick={() => setDialogOpen(true)}
                  className="w-full flex flex-col items-center gap-1 px-4 py-3 text-center rounded-3xl bg-red-50 border-2 border-red-400 hover:bg-red-100 transition-all"
                  style={{ color: '#dc2626' }}
                >
                  <span className="text-sm font-semibold">
                    Menštruácia mešká {Math.abs(daysUntilPeriod!)} {Math.abs(daysUntilPeriod!) === 1 ? 'deň' : 'dní'}
                  </span>
                  <span className="text-xs opacity-60 font-semibold">Potvrdiť začiatok</span>
                </button>
              )}
            </div>
          )}

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