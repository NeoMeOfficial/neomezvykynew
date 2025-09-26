import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, FileText, CalendarDays, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCycleData } from './useCycleData';
import { WellnessDonutChart } from './WellnessDonutChart';
import { PhaseOverview } from './PhaseOverview';
import { SymptomTracker } from './SymptomTracker';
import { HistoricalDataOverview } from './HistoricalDataOverview';
import { CalendarView } from './CalendarView';
import { DatePickerModal } from './DatePickerModal';
import { SettingsModal } from './SettingsModal';

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
    updateCycleData
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

      {/* Box 1: Cycle Overview and Symptom Tracking */}
      <div className="w-full space-y-6 glass-container bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-md border border-rose-200/30 shadow-xl rounded-2xl p-6"
           style={{ 
             background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.85) 0%, rgba(253, 242, 248, 0.90) 100%)',
             backdropFilter: 'blur(16px)',
             WebkitBackdropFilter: 'blur(16px)',
             boxShadow: '0 8px 32px rgba(149, 95, 106, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
             transform: 'translateY(0)',
             transition: 'transform 0.3s ease'
           }}
           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        
        {/* Section Header: Odhad na dnes */}
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5" style={{ color: '#955F6A' }} />
          <h3 className="text-lg font-medium" style={{ color: '#955F6A' }}>
            Odhad na dnes
          </h3>
        </div>
        
        {/* Cycle Chart */}
        <WellnessDonutChart
          derivedState={derivedState}
          selectedOutcome={selectedOutcome}
          cycleData={cycleData}
          className="mb-6"
        />
        
        {/* Current Phase Information */}
        <div className="symptom-glass rounded-xl p-4 mb-6"
             style={{ backgroundColor: '#FBF8F9' }}>
          <div className="space-y-3">
            <div>
              <h4 className="text-lg font-medium mb-2" style={{ color: '#955F6A' }}>
                {currentPhase.name} - Deň {currentDay}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
                Energia postupne klesá, telo sa pripravuje na menštruáciu.
              </p>
            </div>
            
            <div>
              <h5 className="text-base font-medium mb-2" style={{ color: '#955F6A' }}>
                Čo môžete očakávať dnes:
              </h5>
              <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
                Môžeš sa cítiť menej energicky (65%) a potrebovať viac času na odpočinok. 
                Energia postupne klesá, preto potrebuješ pravidelné jedlá a menej náročné aktivity. 
                Nálada môže kolísať - môžeš sa cítiť podráždenejšia alebo úzkostlivejšia. 
                Je to normálne, buď k sebe trpezlivá.
              </p>
            </div>
          </div>
        </div>

        {/* Section Header: Zaznač si to podstatné */}
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5" style={{ color: '#955F6A' }} />
          <h3 className="text-lg font-medium" style={{ color: '#955F6A' }}>
            Zaznač si to podstatné
          </h3>
        </div>
        
        {/* Symptom Tracker */}
        <div className="symptom-glass rounded-xl p-4"
             style={{ backgroundColor: '#FBF8F9' }}>
          <SymptomTracker
            currentPhase={currentPhase.key}
            currentDay={currentDay}
            accessCode={accessCode}
          />
        </div>
      </div>

      {/* Box 2: Recommendations, Data and Calendar */}
      <div className="w-full space-y-6 glass-container bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-md border border-rose-200/30 shadow-xl rounded-2xl p-6"
           style={{ 
             background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.85) 0%, rgba(253, 242, 248, 0.90) 100%)',
             backdropFilter: 'blur(16px)',
             WebkitBackdropFilter: 'blur(16px)',
             boxShadow: '0 8px 32px rgba(149, 95, 106, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
             transform: 'translateY(0)',
             transition: 'transform 0.3s ease'
           }}
           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        
        {/* Section Header: Ako sa cítiť lepšie */}
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5" style={{ color: '#955F6A' }} />
          <h3 className="text-lg font-medium" style={{ color: '#955F6A' }}>
            Ako sa cítiť lepšie
          </h3>
        </div>
        
        {/* Phase Overview */}
        <div className="mb-6">
          <PhaseOverview
            phaseRanges={phaseRanges}
            currentPhase={currentPhase}
          />
        </div>

        {/* Section Header: Prehľad údajov */}
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5" style={{ color: '#955F6A' }} />
          <h3 className="text-lg font-medium" style={{ color: '#955F6A' }}>
            Prehľad údajov
          </h3>
        </div>
        
        {/* Historical Data Overview */}
        <div className="mb-6">
          <HistoricalDataOverview accessCode={accessCode} />
        </div>

        {/* Section Header: Kalendárny pohľad */}
        <div className="flex items-center gap-3 mb-4">
          <CalendarDays className="w-5 h-5" style={{ color: '#955F6A' }} />
          <h3 className="text-lg font-medium" style={{ color: '#955F6A' }}>
            Kalendárny pohľad
          </h3>
        </div>
        
        {/* Calendar View */}
        <CalendarView
          cycleData={cycleData}
          derivedState={derivedState}
          onOutcomeSelect={setSelectedOutcome}
          selectedOutcome={selectedOutcome}
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