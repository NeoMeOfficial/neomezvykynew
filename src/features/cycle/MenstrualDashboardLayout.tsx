import React, { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { MenstrualSidebar } from './MenstrualSidebar';
import { TodaysEstimateSection } from './sections/TodaysEstimateSection';
import { FeelBetterSection } from './sections/FeelBetterSection';
import { CalendarViewSection } from './sections/CalendarViewSection';
import { DatePickerModal } from './DatePickerModal';
import { SettingsModal } from './SettingsModal';
import { ShareCalendarDialog } from '@/components/ShareCalendarDialog';
import { useCycleData } from './useCycleData';
import { PeriodkaTour } from './PeriodkaTour';
import { NextDatesInfo } from './components/NextDatesInfo';
import { CalendarViewModal } from './components/CalendarViewModal';
type OutcomeType = 'next-period' | 'fertile-days';
interface MenstrualDashboardLayoutProps {
  accessCode?: string;
  compact?: boolean;
  onFirstInteraction?: () => void;
  onAccessCodeGenerated?: (code: string) => void;
}
export function MenstrualDashboardLayout({
  accessCode,
  compact = false,
  onFirstInteraction,
  onAccessCodeGenerated
}: MenstrualDashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState('estimate');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarModalMode, setCalendarModalMode] = useState<'select-start' | 'select-end'>('select-start');
  const [showSettings, setShowSettings] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null);
  const {
    cycleData,
    derivedState,
    loading,
    setLastPeriodStart,
    setCycleLength,
    setPeriodLength,
    addPeriodToHistory,
    updateCycleData,
    setPeriodIntensity,
    getPeriodIntensity
  } = useCycleData(accessCode);
  
  const handlePeriodStart = (date: Date) => {
    setLastPeriodStart(date);
    handleFirstInteraction();
  };

  const handlePeriodEnd = (startDate: Date, endDate: Date) => {
    const startStr = format(startDate, 'yyyy-MM-dd');
    const endStr = format(endDate, 'yyyy-MM-dd');
    addPeriodToHistory(startStr, endStr);
    setLastPeriodStart(startDate);
    handleFirstInteraction();
  };
  const handleFirstInteraction = () => {
    onFirstInteraction?.();
  };
  const handleDateSelect = (date: Date) => {
    setLastPeriodStart(date);
    handleFirstInteraction();
  };

  const handleCalendarDateSelect = (date: Date) => {
    if (calendarModalMode === 'select-start') {
      setLastPeriodStart(date);
    } else {
      // For select-end - update end of period
      const startDate = cycleData.lastPeriodStart ? new Date(cycleData.lastPeriodStart) : date;
      const startStr = format(startDate, 'yyyy-MM-dd');
      const endStr = format(date, 'yyyy-MM-dd');
      
      // Calculate and update period length based on the selected end date
      const calculatedLength = differenceInDays(date, startDate) + 1;
      setPeriodLength(calculatedLength);
      
      addPeriodToHistory(startStr, endStr);
    }
    setShowCalendarModal(false);
    handleFirstInteraction();
  };
  if (loading) {
    return <div className="bg-widget-bg p-3 w-full overflow-hidden">
        <div className="w-full max-w-[600px] mx-auto space-y-2">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>;
  }
  if (!derivedState) {
    return null;
  }
  const {
    currentDay,
    phaseRanges,
    currentPhase
  } = derivedState;

  // Mobile view - return original accordion layout
  if (isMobile) {
    return <div className="w-full px-2 py-6 space-y-6">
        {/* Main Header with Action Buttons */}
        <div className="flex items-center justify-between gap-2 pb-2 px-3">
          <h2 className="text-xl font-semibold leading-tight" style={{
            color: '#955F6A'
          }}>
            Menštruačný kalendár
          </h2>
          <PeriodkaTour accessCode={accessCode} autoStart={true} activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>

        {/* Next Dates Info for Mobile */}
        <NextDatesInfo 
          lastPeriodStart={cycleData.lastPeriodStart} 
          cycleLength={cycleData.cycleLength}
          periodLength={cycleData.periodLength}
          currentPhase={currentPhase.name}
          onEditClick={() => {
            setCalendarModalMode('select-start');
            setShowCalendarModal(true);
          }}
          onPeriodStart={handlePeriodStart}
          onPeriodEnd={handlePeriodEnd}
          onUseCustomDatePicker={() => setShowDatePicker(true)}
          onPeriodEndClick={() => {
            setCalendarModalMode('select-end');
            setShowCalendarModal(true);
          }}
        />

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
            onSettingsClick={() => setShowSettings(true)}
            onPeriodStart={handlePeriodStart}
            onPeriodEnd={handlePeriodEnd}
            onUseCustomDatePicker={() => setShowDatePicker(true)}
          />

          <FeelBetterSection phaseRanges={phaseRanges} currentPhase={currentPhase} />

          <CalendarViewSection cycleData={cycleData} derivedState={derivedState} onOutcomeSelect={setSelectedOutcome} selectedOutcome={selectedOutcome} onPeriodIntensityChange={setPeriodIntensity} getPeriodIntensity={getPeriodIntensity} accessCode={accessCode} onAccessCodeGenerated={onAccessCodeGenerated} />
        </div>

        {/* Modals */}
        <DatePickerModal isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} onDateSelect={handleDateSelect} derivedState={derivedState} cycleLength={cycleData.cycleLength} periodLength={cycleData.periodLength} lastPeriodStart={cycleData.lastPeriodStart} title="Nová perioda" accessCode={accessCode} />

        <CalendarViewModal
          isOpen={showCalendarModal}
          onClose={() => setShowCalendarModal(false)}
          onDateSelect={handleCalendarDateSelect}
          mode={calendarModalMode}
          cycleData={cycleData}
          derivedState={derivedState}
          onPeriodIntensityChange={setPeriodIntensity}
          getPeriodIntensity={getPeriodIntensity}
          accessCode={accessCode}
        />

        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} cycleData={cycleData} onUpdateCycleLength={setCycleLength} onUpdatePeriodLength={setPeriodLength} onEditPeriodStart={() => setShowDatePicker(true)} onReset={() => {
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
      }} />
      </div>;
  }

  // Desktop view - sidebar layout
  return <div className="min-h-screen flex w-full bg-background">
        <MenstrualSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
          onEditClick={() => setShowDatePicker(true)} 
          onSettingsClick={() => setShowSettings(true)} 
          onShareClick={() => setShowShareDialog(true)} 
          accessCode={accessCode} 
          lastPeriodStart={cycleData.lastPeriodStart} 
          cycleLength={cycleData.cycleLength}
          periodLength={cycleData.periodLength}
          currentPhase={currentPhase.name}
          onPeriodStart={handlePeriodStart}
          onPeriodEnd={handlePeriodEnd}
          onUseCustomDatePicker={() => setShowDatePicker(true)}
          onPeriodEndClick={() => {
            setCalendarModalMode('select-end');
            setShowCalendarModal(true);
          }}
        />
        
        <main className="flex-1 p-8 max-w-none">
          {/* Tour and Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold" style={{
          color: '#955F6A'
        }}>
              <span data-tour="current-phase">Deň {currentDay} • {currentPhase.name}</span>
            </h2>
          </div>
          
          {/* Content Area */}
          <div className="w-full">
            {activeSection === 'estimate' && <TodaysEstimateSection 
              derivedState={derivedState} 
              selectedOutcome={selectedOutcome} 
              cycleData={cycleData} 
              currentDay={currentDay} 
              currentPhase={currentPhase} 
              accessCode={accessCode} 
              lastPeriodStart={cycleData.lastPeriodStart} 
              onSettingsClick={() => setShowSettings(true)}
              onPeriodStart={handlePeriodStart}
              onPeriodEnd={handlePeriodEnd}
              onUseCustomDatePicker={() => setShowDatePicker(true)}
            />}

            {activeSection === 'feel-better' && <FeelBetterSection phaseRanges={phaseRanges} currentPhase={currentPhase} />}

            {activeSection === 'calendar' && <CalendarViewSection cycleData={cycleData} derivedState={derivedState} onOutcomeSelect={setSelectedOutcome} selectedOutcome={selectedOutcome} onPeriodIntensityChange={setPeriodIntensity} getPeriodIntensity={getPeriodIntensity} accessCode={accessCode} onAccessCodeGenerated={onAccessCodeGenerated} />}
          </div>

          {/* Modals */}
          <DatePickerModal isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} onDateSelect={handleDateSelect} derivedState={derivedState} cycleLength={cycleData.cycleLength} periodLength={cycleData.periodLength} lastPeriodStart={cycleData.lastPeriodStart} title="Nová perioda" accessCode={accessCode} />

          <CalendarViewModal
            isOpen={showCalendarModal}
            onClose={() => setShowCalendarModal(false)}
            onDateSelect={handleCalendarDateSelect}
            mode={calendarModalMode}
            cycleData={cycleData}
            derivedState={derivedState}
            onPeriodIntensityChange={setPeriodIntensity}
            getPeriodIntensity={getPeriodIntensity}
            accessCode={accessCode}
          />

          <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} cycleData={cycleData} onUpdateCycleLength={setCycleLength} onUpdatePeriodLength={setPeriodLength} onEditPeriodStart={() => setShowDatePicker(true)} onReset={() => {
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
      }} />

          {accessCode && <ShareCalendarDialog open={showShareDialog} onOpenChange={setShowShareDialog} accessCode={accessCode} onAccessCodeGenerated={onAccessCodeGenerated} />}
        </main>
      </div>;
}