import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, FileText, CalendarDays, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
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
    <div className="w-full space-y-6">
      {/* Main Header with Action Buttons */}
      <div className="glass-container rounded-2xl p-6 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-raleway text-palette-brown">
              Menštruačný kalendár
            </h2>
            <p className="text-sm text-palette-brown/80 mt-1">
              Deň {currentDay} • {currentPhase.name}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDatePicker(true)}
              className="symptom-glass border-rose-300/50 text-palette-brown hover:bg-rose-100/50 transition-all duration-300 hover:scale-105"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Upraviť
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="symptom-glass border-rose-300/50 text-palette-brown hover:bg-rose-100/50 transition-all duration-300 hover:scale-105"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Nastavenia
            </Button>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="w-full space-y-4"
      >
        {/* Section 1: Odhad na dnes */}
        <AccordionItem 
          value="section-1" 
          className="glass-container rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-rose-100/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-200/30">
                <Clock className="w-5 h-5 text-palette-pink" />
              </div>
              <span className="font-semibold font-raleway text-palette-brown text-lg">
                Odhad na dnes
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-6">
              {/* Cycle Chart */}
              <div className="flex justify-center">
                <WellnessDonutChart
                  derivedState={derivedState}
                  selectedOutcome={selectedOutcome}
                  cycleData={cycleData}
                  className="mb-4"
                />
              </div>
              
              {/* Current Phase Information */}
              <div className="symptom-glass rounded-2xl p-6 bg-gradient-to-br from-white/90 to-rose-50/90 backdrop-blur-sm border border-rose-200/30">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-raleway text-palette-brown mb-3">
                      {currentPhase.name} - Deň {currentDay}
                    </h3>
                    <p className="text-sm leading-relaxed text-palette-brown/80">
                      Energia postupne klesá, telo sa pripravuje na menštruáciu.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold font-raleway text-palette-brown mb-3">
                      Čo môžete očakávať dnes:
                    </h4>
                    <p className="text-sm leading-relaxed text-palette-brown/80">
                      Môžeš sa cítiť menej energicky (65%) a potrebovať viac času na odpočinok. 
                      Energia postupne klesá, preto potrebuješ pravidelné jedlá a menej náročné aktivity. 
                      Nálada môže kolísať - môžeš sa cítiť podráždenejšia alebo úzkostlivejšia. 
                      Je to normálne, buď k sebe trpezlivá.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Zaznač si to podstatné */}
        <AccordionItem 
          value="section-2" 
          className="glass-container rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-rose-100/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-200/30">
                <FileText className="w-5 h-5 text-palette-pink" />
              </div>
              <span className="font-semibold font-raleway text-palette-brown text-lg">
                Zaznač si to podstatné
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="symptom-glass rounded-2xl p-6 bg-gradient-to-br from-white/90 to-rose-50/90 backdrop-blur-sm border border-rose-200/30">
              <SymptomTracker
                currentPhase={currentPhase.key}
                currentDay={currentDay}
                accessCode={accessCode}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Ako sa cítiť lepšie */}
        <AccordionItem 
          value="section-3" 
          className="glass-container rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-rose-100/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-200/30">
                <TrendingUp className="w-5 h-5 text-palette-pink" />
              </div>
              <span className="font-semibold font-raleway text-palette-brown text-lg">
                Ako sa cítiť lepšie
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="symptom-glass rounded-2xl p-6 bg-gradient-to-br from-white/90 to-rose-50/90 backdrop-blur-sm border border-rose-200/30">
              <PhaseOverview
                phaseRanges={phaseRanges}
                currentPhase={currentPhase}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: Prehľad údajov */}
        <AccordionItem 
          value="section-4" 
          className="glass-container rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-rose-100/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-200/30">
                <FileText className="w-5 h-5 text-palette-pink" />
              </div>
              <span className="font-semibold font-raleway text-palette-brown text-lg">
                Prehľad údajov
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="symptom-glass rounded-2xl p-6 bg-gradient-to-br from-white/90 to-rose-50/90 backdrop-blur-sm border border-rose-200/30">
              <HistoricalDataOverview accessCode={accessCode} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Kalendárny pohľad */}
        <AccordionItem 
          value="section-5" 
          className="glass-container rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-rose-100/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-200/30">
                <CalendarDays className="w-5 h-5 text-palette-pink" />
              </div>
              <span className="font-semibold font-raleway text-palette-brown text-lg">
                Kalendárny pohľad
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="symptom-glass rounded-2xl p-6 bg-gradient-to-br from-white/90 to-rose-50/90 backdrop-blur-sm border border-rose-200/30">
              <CalendarView
                cycleData={cycleData}
                derivedState={derivedState}
                onOutcomeSelect={setSelectedOutcome}
                selectedOutcome={selectedOutcome}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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