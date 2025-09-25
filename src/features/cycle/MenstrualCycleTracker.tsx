import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Lightbulb, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useSupabaseCycleData } from './useSupabaseCycleData';
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
    setPeriodLength
  } = useSupabaseCycleData(accessCode);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [setupAge, setSetupAge] = useState(25);
  const [setupCycleLength, setSetupCycleLength] = useState(28);
  const [setupPeriodLength, setSetupPeriodLength] = useState(5);
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null);
  
  // Questionnaire progress state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const totalSteps = 7;
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
              {/* Welcome title with decorative dots like the period date */}
              <div className="flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                    <p className="text-base font-medium" style={{ color: '#955F6A' }}>
                      {UI_TEXT.welcome}
                    </p>
                    <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                  </div>
                </div>
              </div>

              {/* Input fields section */}
              <div className="space-y-4">
                {/* Age field - first */}
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

                {/* Cycle and period length - second row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="setupCycleLength" className="text-sm font-medium block" style={{ color: '#955F6A' }}>
                      {UI_TEXT.cycleLength}
                    </Label>
                    <Input 
                      id="setupCycleLength" 
                      type="number" 
                      min="21" 
                      max="45" 
                      value={setupCycleLength} 
                      onChange={e => setSetupCycleLength(Number(e.target.value))} 
                      placeholder="28 dni" 
                      className="w-full text-base bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 rounded-xl symptom-glass hover:from-rose-50 hover:to-pink-50 transition-all"
                      style={{ color: '#F4415F' }}
                    />
                  </div>

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
          <SuggestedToday derivedState={derivedState} accessCode={accessCode} />
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
      />
    </div>;
}