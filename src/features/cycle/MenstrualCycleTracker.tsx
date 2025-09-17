import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Lightbulb, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCycleData } from './useCycleData';
import { SuggestedToday } from './SuggestedToday';
import { WellnessDonutChart } from './WellnessDonutChart';
import { PhaseOverview } from './PhaseOverview';
import { DatePickerModal } from './DatePickerModal';
import { SettingsModal } from './SettingsModal';
import { UI_TEXT } from './insights';
import { formatDateSk, getNextPeriodDate } from './utils';
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
  } = useCycleData(accessCode);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [setupCycleLength, setSetupCycleLength] = useState(28);
  const [setupPeriodLength, setSetupPeriodLength] = useState(5);
  const handleFirstInteraction = () => {
    onFirstInteraction?.();
  };
  const handleSetupComplete = (date: Date) => {
    setLastPeriodStart(date);
    setCycleLength(setupCycleLength);
    setPeriodLength(setupPeriodLength);
    handleFirstInteraction();
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
    return <div className="w-full space-y-6">
          <div>
            <p className="md:text-sm text-lg" style={{ color: '#955F6A' }}>
              {UI_TEXT.welcome}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="setupCycleLength" className="text-mobile-sm md:text-sm font-medium text-widget-text block">
                  {UI_TEXT.cycleLength}
                </Label>
                <Input id="setupCycleLength" type="number" min="21" max="45" value={setupCycleLength} onChange={e => setSetupCycleLength(Number(e.target.value))} placeholder="28 dni" className="w-full text-base" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setupPeriodLength" className="text-mobile-sm md:text-sm font-medium text-widget-text block">
                  {UI_TEXT.periodLength}
                </Label>
                <Input id="setupPeriodLength" type="number" min="2" max="10" value={setupPeriodLength} onChange={e => setSetupPeriodLength(Number(e.target.value))} placeholder="5 dni" className="w-full text-base" />
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => setShowDatePicker(true)} variant="outline" className="w-full flex items-center justify-center gap-2 py-3 text-base">
                <CalendarIcon className="w-5 h-5" />
                {UI_TEXT.lastPeriod}
              </Button>
            </div>
          </div>

          <DatePickerModal isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} onDateSelect={handleSetupComplete} derivedState={derivedState} cycleLength={setupCycleLength} periodLength={setupPeriodLength} lastPeriodStart={null} accessCode={accessCode} />
        </div>;
  }
  if (!derivedState) return null;
  const nextPeriodDate = getNextPeriodDate(cycleData.lastPeriodStart!, cycleData.cycleLength);
  return <div className="w-full space-y-4">
      {/* Cycle Information Card */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/50 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              <p className="text-base font-medium text-gray-800">
                Očakávaná menštruácia {formatDateSk(nextPeriodDate)}
              </p>
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            </div>
            <p className="text-sm text-gray-600">
              {derivedState.currentDay}. deň cyklu
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="today" className="space-y-5">
        <TabsList className="grid w-full grid-cols-2 gap-3 bg-transparent p-0">
          <TabsTrigger 
            value="today" 
            className="flex items-center gap-2 text-base bg-gradient-primary text-white font-semibold rounded-3xl px-6 py-3 shadow-[var(--shadow-elegant)] hover:opacity-90 transition-opacity data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=inactive]:bg-gradient-primary data-[state=inactive]:text-white"
          >
            <TrendingUp className="w-4 h-4" />
            {UI_TEXT.todayEstimate}
          </TabsTrigger>
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 text-base bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 backdrop-blur-sm rounded-3xl px-6 py-3 hover:from-rose-50 hover:to-pink-50 transition-all data-[state=active]:from-rose-50 data-[state=active]:to-pink-50 data-[state=inactive]:from-rose-50/80 data-[state=inactive]:to-pink-50/80"
            style={{ color: '#F4415F' }}
          >
            <Lightbulb className="w-4 h-4" />
            {UI_TEXT.whatToDo}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SuggestedToday derivedState={derivedState} accessCode={accessCode} />
            <WellnessDonutChart derivedState={derivedState} />
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-5">
          <PhaseOverview phaseRanges={derivedState.phaseRanges} currentPhase={derivedState.currentPhase} />
        </TabsContent>
      </Tabs>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <Button variant="hero" size="sm" onClick={() => setShowDatePicker(true)} className="text-base">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Kalendár
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowSettings(true)} className="text-base">
          <Settings className="w-4 h-4 mr-2" />
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