import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { MenstrualSidebar } from './MenstrualSidebar';
import { TodaysEstimateSection } from './sections/TodaysEstimateSection';
import { TrackEssentialsSection } from './sections/TrackEssentialsSection';
import { FeelBetterSection } from './sections/FeelBetterSection';
import { DataOverviewSection } from './sections/DataOverviewSection';
import { CalendarViewSection } from './sections/CalendarViewSection';
import { DatePickerModal } from './DatePickerModal';
import { SettingsModal } from './SettingsModal';
import { useCycleData } from './useCycleData';

type OutcomeType = 'next-period' | 'fertile-days';

interface MenstrualDashboardLayoutProps {
  accessCode?: string;
  compact?: boolean;
  onFirstInteraction?: () => void;
}

export function MenstrualDashboardLayout({
  accessCode,
  compact = false,
  onFirstInteraction
}: MenstrualDashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState('estimate');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null);

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

  if (!derivedState) {
    return null;
  }

  const { currentDay, phaseRanges, currentPhase } = derivedState;

  // Mobile view - return original accordion layout
  if (isMobile) {
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

        {/* All sections for mobile */}
        <TodaysEstimateSection
          derivedState={derivedState}
          selectedOutcome={selectedOutcome}
          cycleData={cycleData}
          currentDay={currentDay}
          currentPhase={currentPhase}
        />

        <TrackEssentialsSection
          currentPhase={currentPhase.key}
          currentDay={currentDay}
          accessCode={accessCode}
        />

        <FeelBetterSection
          phaseRanges={phaseRanges}
          currentPhase={currentPhase}
        />

        <DataOverviewSection
          accessCode={accessCode}
        />

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

  // Desktop view - sidebar layout
  return (
    <div className="min-h-screen flex w-full bg-background">
        <MenstrualSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 p-8 max-w-none">
          {/* Header - Full Width Box */}
          <div className="w-full mb-6 p-6 rounded-2xl relative"
               style={{ 
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.95) 100%)',
                 boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(149, 95, 106, 0.1)'
               }}>
            {/* Header glass accent */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent"></div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#FF7782' }}>
                  Menštruačný kalendár
                </h1>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDatePicker(true)}
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  Upraviť
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Nastavenia
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full">
            {activeSection === 'estimate' && (
              <TodaysEstimateSection
                derivedState={derivedState}
                selectedOutcome={selectedOutcome}
                cycleData={cycleData}
                currentDay={currentDay}
                currentPhase={currentPhase}
              />
            )}

            {activeSection === 'track' && (
              <TrackEssentialsSection
                currentPhase={currentPhase.key}
                currentDay={currentDay}
                accessCode={accessCode}
              />
            )}

            {activeSection === 'feel-better' && (
              <FeelBetterSection
                phaseRanges={phaseRanges}
                currentPhase={currentPhase}
              />
            )}

            {activeSection === 'data' && (
              <DataOverviewSection
                accessCode={accessCode}
              />
            )}

            {activeSection === 'calendar' && (
              <CalendarViewSection
                cycleData={cycleData}
                derivedState={derivedState}
                onOutcomeSelect={setSelectedOutcome}
                selectedOutcome={selectedOutcome}
                onPeriodIntensityChange={setPeriodIntensity}
                getPeriodIntensity={getPeriodIntensity}
              />
            )}
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
        </main>
      </div>
  );
}