import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCycleData } from './useCycleData';
import { DatePickerModal } from './DatePickerModal';
import { SettingsModal } from './SettingsModal';
import { TodaysEstimateSection } from './sections/TodaysEstimateSection';
import { TrackEssentialsSection } from './sections/TrackEssentialsSection';
import { FeelBetterSection } from './sections/FeelBetterSection';
import { DataOverviewSection } from './sections/DataOverviewSection';
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
    <div className="w-full space-y-4">
      {/* Main Header with Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: '#955F6A' }}>
            Menštruačný kalendár
          </h2>
          <p className="text-sm" style={{ color: '#955F6A' }}>
            Deň {currentDay} • {currentPhase.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-1.5"
          >
            <CalendarIcon className="w-4 h-4" />
            Upraviť
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4" />
            Nastavenia
          </Button>
        </div>
      </div>

      {/* Section 1: Today's Estimate */}
      <TodaysEstimateSection
        derivedState={derivedState}
        selectedOutcome={selectedOutcome}
        cycleData={cycleData}
        currentDay={currentDay}
        currentPhase={currentPhase}
      />

      {/* Section 2: Track Essentials */}
      <TrackEssentialsSection
        currentPhase={currentPhase.key}
        currentDay={currentDay}
        accessCode={accessCode}
      />

      {/* Section 3: Feel Better */}
      <FeelBetterSection
        phaseRanges={phaseRanges}
        currentPhase={currentPhase}
      />

      {/* Section 4: Data Overview */}
      <DataOverviewSection
        accessCode={accessCode}
      />

      {/* Section 5: Calendar View */}
      <CalendarViewSection
        cycleData={cycleData}
        derivedState={derivedState}
        onOutcomeSelect={setSelectedOutcome}
        selectedOutcome={selectedOutcome}
        onPeriodIntensityChange={setPeriodIntensity}
        getPeriodIntensity={getPeriodIntensity}
      />

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