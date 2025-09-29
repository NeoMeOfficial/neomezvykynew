import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCycleData } from './useCycleData';
import { DatePickerModal } from './DatePickerModal';
import { SettingsModal } from './SettingsModal';
import { TodaysEstimateSection } from './sections/TodaysEstimateSection';
import { FeelBetterSection } from './sections/FeelBetterSection';
import { CalendarViewSection } from './sections/CalendarViewSection';

type OutcomeType = 'next-period' | 'fertile-days';

interface MenstrualCycleTrackerAccordionProps {
  accessCode?: string;
  compact?: boolean;
  onFirstInteraction?: () => void;
}

export default function MenstrualCycleTrackerAccordion({
  accessCode,
  compact = false,
  onFirstInteraction
}: MenstrualCycleTrackerAccordionProps) {
  const {
    cycleData,
    derivedState,
    loading,
    setLastPeriodStart,
    setCycleLength,
    setPeriodLength,
    updateCycleData,
    setPeriodIntensity,
    getPeriodIntensity
  } = useCycleData(accessCode);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null);
  const [openSections, setOpenSections] = useState<string[]>(['section-1']); // Default open first section

  const handleFirstInteraction = () => {
    onFirstInteraction?.();
  };

  const handleDateSelect = (date: Date) => {
    setLastPeriodStart(date);
    handleFirstInteraction();
  };

  if (loading) {
    return (
      <div className="bg-widget-bg p-3 w-full overflow-hidden">
        <div className="w-full max-w-[600px] mx-auto space-y-2">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no cycle data, show original setup (this would be handled by parent component)
  if (!derivedState) {
    return null;
  }

  const { currentDay, phaseRanges, currentPhase } = derivedState;

  return (
    <div className="w-full px-4 py-6 space-y-8">
      {/* Main Header with Action Buttons */}
      <div className="flex justify-between items-start gap-4 pb-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-1 leading-tight" style={{ color: '#955F6A' }}>
            Menštruačný kalendár
          </h2>
          <p className="text-sm opacity-80" style={{ color: '#955F6A' }}>
            Deň {currentDay} • {currentPhase.name}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            size="sm"
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-white border border-[#955F6A] text-[#955F6A] hover:bg-[#955F6A] hover:text-white"
          >
            <CalendarIcon className="w-3 h-3" />
            Upraviť
          </Button>
          <Button
            size="sm"
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-white border border-[#955F6A] text-[#955F6A] hover:bg-[#955F6A] hover:text-white"
          >
            <TrendingUp className="w-3 h-3" />
            Nastavenia
          </Button>
        </div>
      </div>

      {/* All sections for mobile */}
      <div className="space-y-8">
        <TodaysEstimateSection
          derivedState={derivedState}
          selectedOutcome={selectedOutcome}
          cycleData={cycleData}
          currentDay={currentDay}
          currentPhase={currentPhase}
          accessCode={accessCode}
          lastPeriodStart={cycleData.lastPeriodStart}
        />

        <FeelBetterSection
          phaseRanges={phaseRanges}
          currentPhase={currentPhase}
        />

        <CalendarViewSection
          cycleData={cycleData}
          derivedState={derivedState}
          onOutcomeSelect={setSelectedOutcome}
          selectedOutcome={selectedOutcome}
          onPeriodIntensityChange={setPeriodIntensity}
          getPeriodIntensity={getPeriodIntensity}
          accessCode={accessCode}
        />
      </div>

      {/* Modals */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
        derivedState={derivedState}
        cycleLength={cycleData.cycleLength}
        periodLength={cycleData.periodLength}
        lastPeriodStart={cycleData.lastPeriodStart}
        title="Nová perioda"
        accessCode={accessCode}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        cycleData={cycleData}
        onUpdateCycleLength={setCycleLength}
        onUpdatePeriodLength={setPeriodLength}
        onEditPeriodStart={() => setShowDatePicker(true)}
        onReset={() => {
          updateCycleData({
            lastPeriodStart: null,
            cycleLength: 28,
            periodLength: 5,
            customSettings: {
              notifications: true,
              symptomTracking: true,
              moodTracking: true,
              notes: ""
            },
            history: []
          });
        }}
      />
    </div>
  );
}