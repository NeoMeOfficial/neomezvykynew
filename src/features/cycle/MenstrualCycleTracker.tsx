import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Lightbulb, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCycleData } from './useCycleData';
import { SuggestedToday } from './SuggestedToday';
import { WellnessDonutChart } from './WellnessDonutChart';
import { PhaseOverview } from './PhaseOverview';
import { DatePickerModal } from './DatePickerModal';
import { SettingsModal } from './SettingsModal';
import { QuestionnaireProgress } from './QuestionnaireProgress';
import { UI_TEXT } from './insights';
import { formatDateSk, getNextPeriodDate } from './utils';
import { PhaseKey } from './types';

type OutcomeType = 'next-period' | 'fertile-days';

interface MenstrualCycleTrackerProps {
  accessCode?: string;
  compact?: boolean;
  onFirstInteraction?: () => void;
}
export default function MenstrualCycleTracker({
  accessCode,
  compact = false,
  onFirstInteraction
}: MenstrualCycleTrackerProps) {
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
  const [setupAge, setSetupAge] = useState(25);
  const [setupCycleLength, setSetupCycleLength] = useState(28);
  const [setupPeriodLength, setSetupPeriodLength] = useState(5);
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null);
  const [cycleStartDate, setCycleStartDate] = useState<Date>();
  const [cycleEndDate, setCycleEndDate] = useState<Date>();
  
  // Questionnaire progress state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedPMSSymptoms, setSelectedPMSSymptoms] = useState<string[]>([]);
  const totalSteps = 5;
  const handleFirstInteraction = () => {
    onFirstInteraction?.();
  };
  const handleSetupComplete = (date: Date) => {
    setLastPeriodStart(date);
    setCycleLength(setupCycleLength);
    setPeriodLength(setupPeriodLength);
    setCompletedSteps([...completedSteps, currentStep]);
    handleFirstInteraction();
  };

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    if (step < totalSteps) {
      setCurrentStep(step + 1);
    }
  };

  const handleStepNavigation = (step: number) => {
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
    }
  };
  const handleDateSelect = (date: Date) => {
    setLastPeriodStart(date);
    handleFirstInteraction();
  };

  // Function to reset and go back to questionnaire
  const resetToQuestionnaire = () => {
    // Clear all cycle data by updating with null/default values
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
    
    // Reset questionnaire state
    setCurrentStep(1);
    setCompletedSteps([]);
    setSelectedPMSSymptoms([]);
    setSetupAge(25);
    setSetupCycleLength(28);
    setSetupPeriodLength(5);
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

  // Welcome screen for first-time setup
  if (!cycleData.lastPeriodStart) {
    return <div className="w-full space-y-4">
          {/* Welcome questionnaire in glass container */}
          <div className="symptom-glass rounded-2xl p-4" style={{ backgroundColor: '#FBF8F9' }}>
            {/* Progress bar */}
            <QuestionnaireProgress 
              currentStep={currentStep}
              totalSteps={totalSteps}
              completedSteps={completedSteps}
              onStepClick={handleStepNavigation}
            />
            
            <div className="space-y-6">
              {/* Welcome title */}
              {currentStep !== 5 && (
                <div className="flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <p className="text-base font-medium" style={{ color: '#955F6A' }}>
                      {currentStep === 1 ? UI_TEXT.welcome : 
                       currentStep === 2 ? "Dĺžka cyklu" :
                       currentStep === 3 ? "Dĺžka menštruácie" :
                       "PMS symptómy"}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Age */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="setupAge" className="text-sm font-medium block" style={{ color: '#955F6A' }}>
                      Vek
                    </Label>
                    <Input 
                      id="setupAge" 
                      type="number" 
                      min="13" 
                      max="60" 
                      value={setupAge} 
                      onChange={e => setSetupAge(Number(e.target.value))} 
                      placeholder="25 rokov" 
                      className="w-full text-base bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 rounded-xl symptom-glass hover:from-rose-50 hover:to-pink-50 transition-all"
                      style={{ color: '#F4415F' }}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Cycle Length */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium block" style={{ color: '#955F6A' }}>
                      Vyber začiatok a koniec svojho posledného cyklu
                    </Label>

                    {/* Legend for period selection */}
                    <div className="bg-white/80 rounded-lg p-3 border border-rose-200/50">
                      <div className="flex flex-col gap-2 text-xs" style={{ color: '#955F6A' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-400"></div>
                          <span>Klikni na dátum pre začiatok cyklu</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-300 to-pink-300"></div>
                          <span>Klikni na druhý dátum pre koniec cyklu</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Single Calendar with Range Selection - matching DatePickerModal style */}
                    <div className="calendar-inner-container rounded-2xl p-2" style={{ backgroundColor: '#FBF8F9' }}>
                      <Calendar
                        mode="range"
                        selected={{ from: cycleStartDate, to: cycleEndDate }}
                        onSelect={(range) => {
                          setCycleStartDate(range?.from);
                          setCycleEndDate(range?.to);
                        }}
                        numberOfMonths={1}
                        weekStartsOn={1}
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4 w-full",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-medium cycle-calendar-label",
                          nav: "space-x-1 flex items-center",
                          nav_button: "cycle-calendar-nav-button h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex w-full",
                          head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] flex items-center justify-center",
                          row: "flex w-full mt-2",
                          cell: "flex-1 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "cycle-calendar-day h-12 w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center",
                          day_range_end: "bg-gradient-primary text-white hover:opacity-90",
                          day_range_start: "bg-gradient-primary text-white hover:opacity-90",
                          day_selected: "bg-rose-400 text-white hover:bg-rose-500",
                          day_today: "border-2 border-rose-400 text-rose-600",
                          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                          day_disabled: "cycle-calendar-disabled",
                          day_range_middle: "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 hover:from-rose-100 hover:to-pink-100",
                          day_hidden: "invisible",
                        }}
                        className="w-full pointer-events-auto slovak-calendar"
                        fixedWeeks
                      />
                    </div>

                    {/* Selected dates display */}
                    {cycleStartDate && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm" style={{ color: '#955F6A' }}>
                          <span className="font-medium">Začiatok:</span>
                          <span>{format(cycleStartDate, "PPP", { locale: sk })}</span>
                        </div>
                        {cycleEndDate && (
                          <>
                            <div className="flex items-center gap-2 text-sm" style={{ color: '#955F6A' }}>
                              <span className="font-medium">Koniec:</span>
                              <span>{format(cycleEndDate, "PPP", { locale: sk })}</span>
                            </div>
                            <div className="mt-4 p-3 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 rounded-xl">
                              <p className="text-sm font-medium" style={{ color: '#955F6A' }}>
                                Dĺžka cyklu: {Math.ceil((cycleEndDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24))} dni
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Period Length */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="setupPeriodLength" className="text-sm font-medium block" style={{ color: '#955F6A' }}>
                      {UI_TEXT.periodLength}
                    </Label>
                    <Input 
                      id="setupPeriodLength" 
                      type="number" 
                      min="2" 
                      max="10" 
                      value={setupPeriodLength} 
                      onChange={e => setSetupPeriodLength(Number(e.target.value))} 
                      placeholder="5 dni" 
                      className="w-full text-base bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 rounded-xl symptom-glass hover:from-rose-50 hover:to-pink-50 transition-all"
                      style={{ color: '#F4415F' }}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: PMS Symptoms */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <p className="text-sm text-center" style={{ color: '#955F6A' }}>
                    Pomôžeme ti pripraviť sa na tieto symptómy vopred.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      "Kŕče",
                      "Bolesť chrbta", 
                      "Nevoľnosť",
                      "Hnačka",
                      "Bolesti hlavy",
                      "Únava",
                      "Závraty",
                      "Citlivosť prsníkov",
                      "Zmeny nálady"
                    ].map((symptom) => (
                      <Button
                        key={symptom}
                        onClick={() => {
                          if (selectedPMSSymptoms.includes(symptom)) {
                            setSelectedPMSSymptoms(selectedPMSSymptoms.filter(s => s !== symptom));
                          } else {
                            setSelectedPMSSymptoms([...selectedPMSSymptoms, symptom]);
                          }
                        }}
                        className={`py-3 px-3 text-sm bg-gradient-to-r border rounded-3xl symptom-glass transition-all text-center ${
                          selectedPMSSymptoms.includes(symptom)
                            ? 'from-rose-100 to-pink-100 border-rose-300/50 shadow-sm'
                            : 'from-rose-50 to-pink-50 border-rose-200/30 hover:from-rose-50 hover:to-pink-50'
                        }`}
                        style={{ color: '#F4415F' }}
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Summary */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-6" style={{ color: '#955F6A' }}>
                      Súhrn tvojich údajov
                    </p>
                  </div>
                  
                  <div className="bg-white/80 rounded-xl border border-rose-200/50 overflow-hidden">
                    <div className="divide-y divide-rose-100">
                      {/* Age */}
                      <div className="flex justify-between items-center p-4">
                        <span className="font-medium" style={{ color: '#955F6A' }}>Vek</span>
                        <span className="font-semibold" style={{ color: '#F4415F' }}>{setupAge} rokov</span>
                      </div>
                      
                      {/* Cycle Length */}
                      <div className="flex justify-between items-center p-4">
                        <span className="font-medium" style={{ color: '#955F6A' }}>Dĺžka cyklu</span>
                        <span className="font-semibold" style={{ color: '#F4415F' }}>
                          {cycleStartDate && cycleEndDate 
                            ? `${Math.ceil((cycleEndDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24))} dni`
                            : `${setupCycleLength} dni`
                          }
                        </span>
                      </div>
                      
                      {/* Period Length */}
                      <div className="flex justify-between items-center p-4">
                        <span className="font-medium" style={{ color: '#955F6A' }}>Dĺžka menštruácie</span>
                        <span className="font-semibold" style={{ color: '#F4415F' }}>{setupPeriodLength} dni</span>
                      </div>
                      
                      {/* PMS Symptoms */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium" style={{ color: '#955F6A' }}>PMS symptómy</span>
                          <span className="text-sm font-medium" style={{ color: '#F4415F' }}>
                            {selectedPMSSymptoms.length} vybraných
                          </span>
                        </div>
                        {selectedPMSSymptoms.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedPMSSymptoms.map((symptom) => (
                              <span
                                key={symptom}
                                className="px-3 py-1 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 rounded-full text-xs font-medium"
                                style={{ color: '#F4415F' }}
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Žiadne symptómy nevybrané</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={() => {
                        if (cycleStartDate) {
                          handleSetupComplete(cycleStartDate);
                        }
                      }}
                      disabled={!cycleStartDate}
                      className="w-full py-3 text-base bg-gradient-primary font-semibold rounded-3xl symptom-glass hover:opacity-90 transition-opacity"
                      style={{ color: '#F4415F' }}
                    >
                      Dokončiť nastavenie
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Last Period Date */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="pt-2">
                    <Button 
                      onClick={() => setShowDatePicker(true)} 
                      className="w-full flex items-center justify-center gap-2 py-3 text-base bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 rounded-3xl symptom-glass hover:from-rose-50 hover:to-pink-50 transition-all"
                      style={{ color: '#F4415F' }}
                    >
                      <CalendarIcon className="w-5 h-5" />
                      {UI_TEXT.lastPeriod}
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="flex-1 py-3 text-base rounded-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: '#F4415F', borderColor: '#F4415F' }}
                >
                  Späť
                </Button>
                <Button 
                  onClick={() => {
                    if (currentStep < totalSteps) {
                      handleStepComplete(currentStep);
                    }
                  }}
                  disabled={currentStep === totalSteps}
                  className="flex-1 py-3 text-base bg-gradient-primary font-semibold rounded-3xl symptom-glass hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: '#F4415F' }}
                >
                  {currentStep === totalSteps ? 'Dokončené' : 'Dopredu'}
                </Button>
              </div>
            </div>
          </div>

          <DatePickerModal isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} onDateSelect={handleSetupComplete} derivedState={derivedState} cycleLength={setupCycleLength} periodLength={setupPeriodLength} lastPeriodStart={null} accessCode={accessCode} />
        </div>;
  }
  if (!derivedState) return null;
  const nextPeriodDate = getNextPeriodDate(cycleData.lastPeriodStart!, cycleData.cycleLength);
  return <div className="w-full space-y-4">
      {/* Cycle Information Card */}
      <div className="symptom-glass rounded-2xl p-4" style={{ backgroundColor: '#FBF8F9' }}>
        {/* Header with reset button */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={resetToQuestionnaire}
            variant="outline"
            size="sm"
            className="text-xs px-3 py-1 rounded-full border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            ← Naspäť na dotazník
          </Button>
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            size="sm"
            className="text-xs px-3 py-1 rounded-full border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <Settings className="w-3 h-3 mr-1" />
            Nastavenia
          </Button>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              <p className="text-base font-medium" style={{ color: '#955F6A' }}>
                Očakávaná menštruácia
              </p>
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            </div>
            <Button 
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 rounded-3xl symptom-glass hover:from-rose-50 hover:to-pink-50 transition-all"
              style={{ color: '#F4415F' }}
            >
              {formatDateSk(nextPeriodDate)}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="today" className="space-y-5">
        <TabsContent value="today" className="space-y-5">
          <div className="space-y-4">
            {/* Outcome selector buttons */}
            <div className="flex gap-2 justify-center overflow-x-auto px-2 py-1 -mx-2">
              {[
                { key: 'next-period' as OutcomeType, name: 'Dalšia perioda' },
                { key: 'fertile-days' as OutcomeType, name: 'Plodné dni' }
              ].map((outcome) => (
                <Button
                  key={outcome.key}
                  onClick={() => setSelectedOutcome(selectedOutcome === outcome.key ? null : outcome.key)}
                  variant={selectedOutcome === outcome.key ? "default" : "outline"}
                  className={`text-sm px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedOutcome === outcome.key 
                      ? 'bg-gradient-primary border-none symptom-glass shadow-sm'
                      : 'bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 symptom-glass hover:from-rose-50 hover:to-pink-50 shadow-sm'
                  }`}
                  style={{ color: '#F4415F' }}
                >
                  {outcome.name}
                </Button>
              ))}
            </div>
            <WellnessDonutChart derivedState={derivedState} selectedOutcome={selectedOutcome} cycleData={cycleData} />
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-5">
          <div className="space-y-4">
            <WellnessDonutChart derivedState={derivedState} />
          </div>
        </TabsContent>

        <TabsList className="grid w-full grid-cols-2 gap-3 bg-transparent p-0">
          <TabsTrigger 
            value="today" 
            className="flex items-center gap-2 text-base bg-gradient-primary font-semibold rounded-3xl px-6 py-3 symptom-glass hover:opacity-90 transition-opacity data-[state=active]:bg-gradient-primary data-[state=inactive]:bg-gradient-primary"
            style={{ color: '#F4415F' }}
          >
            <TrendingUp className="w-4 h-4" />
            {UI_TEXT.todayEstimate}
          </TabsTrigger>
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 text-base bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 backdrop-blur-sm rounded-3xl px-6 py-3 symptom-glass hover:from-rose-50 hover:to-pink-50 transition-all data-[state=active]:from-rose-50 data-[state=active]:to-pink-50 data-[state=inactive]:from-rose-50/80 data-[state=inactive]:to-pink-50/80"
            style={{ color: '#F4415F' }}
          >
            <Lightbulb className="w-4 h-4" />
            {UI_TEXT.whatToDo}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-5">
          <SuggestedToday derivedState={derivedState} accessCode={accessCode} lastPeriodStart={cycleData.lastPeriodStart} />
        </TabsContent>

        <TabsContent value="overview" className="mt-5">
          <PhaseOverview phaseRanges={derivedState.phaseRanges} currentPhase={derivedState.currentPhase} />
        </TabsContent>
      </Tabs>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <Button 
          onClick={() => setShowDatePicker(true)} 
          className="flex items-center gap-2 text-base bg-gradient-primary font-semibold rounded-3xl px-6 py-3 symptom-glass hover:opacity-90 transition-opacity"
          style={{ color: '#F4415F' }}
        >
          <CalendarIcon className="w-4 h-4" />
          Kalendár
        </Button>
        <Button 
          onClick={() => setShowSettings(true)} 
          className="flex items-center gap-2 text-base bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 rounded-3xl px-6 py-3 symptom-glass hover:from-rose-50 hover:to-pink-50 transition-all"
          style={{ color: '#F4415F' }}
        >
          <Settings className="w-4 h-4" />
          Nastavenia
        </Button>
      </div>

      <DatePickerModal isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} onDateSelect={handleDateSelect} derivedState={derivedState} cycleLength={cycleData.cycleLength} periodLength={cycleData.periodLength} lastPeriodStart={cycleData.lastPeriodStart} title={UI_TEXT.newPeriod} accessCode={accessCode} />

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        cycleData={cycleData} 
        onUpdateCycleLength={setCycleLength} 
        onUpdatePeriodLength={setPeriodLength}
        onEditPeriodStart={() => setShowDatePicker(true)}
        onReset={resetToQuestionnaire}
      />
    </div>;
}