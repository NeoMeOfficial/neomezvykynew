import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Lightbulb } from 'lucide-react';
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

  // Welcome screen for first-time setup
  if (!cycleData.lastPeriodStart) {
    return (
      <div className="w-full space-y-6">
          <div>
            <p className="text-widget-text-soft text-sm">
              {UI_TEXT.welcome}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="setupCycleLength" className="text-sm font-medium text-widget-text block">
                  {UI_TEXT.cycleLength}
                </Label>
                <Input
                  id="setupCycleLength"
                  type="number"
                  min="21"
                  max="45"
                  value={setupCycleLength}
                  onChange={(e) => setSetupCycleLength(Number(e.target.value))}
                  placeholder="28 dni"
                  className="w-full sm:w-20 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setupPeriodLength" className="text-sm font-medium text-widget-text block">
                  {UI_TEXT.periodLength}
                </Label>
                <Input
                  id="setupPeriodLength"
                  type="number"
                  min="2"
                  max="10"
                  value={setupPeriodLength}
                  onChange={(e) => setSetupPeriodLength(Number(e.target.value))}
                  placeholder="5 dni"
                  className="w-full sm:w-20 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-widget-text block">
                  {UI_TEXT.lastPeriod}
                </Label>
                <Button
                  onClick={() => setShowDatePicker(true)}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto px-3 py-2 text-sm"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {UI_TEXT.selectDate}
                </Button>
              </div>
            </div>
          </div>

          <DatePickerModal
            isOpen={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onDateSelect={handleSetupComplete}
            derivedState={derivedState}
            cycleLength={setupCycleLength}
            periodLength={setupPeriodLength}
            lastPeriodStart={null}
          />
        </div>
    );
  }

  if (!derivedState) return null;

  const nextPeriodDate = getNextPeriodDate(cycleData.lastPeriodStart!, cycleData.cycleLength);

  return (
    <div className="w-full space-y-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-widget-text">
            Menštruačný cyklus
          </h2>
          <div className="text-right">
            <p className="text-xs text-widget-text-soft">
              {UI_TEXT.expectedPeriod}
            </p>
            <p className="text-sm font-medium text-widget-text">
              {formatDateSk(nextPeriodDate)}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 glass-surface">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {UI_TEXT.todayEstimate}
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            {UI_TEXT.whatToDo}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SuggestedToday derivedState={derivedState} />
            <WellnessDonutChart 
              derivedState={derivedState} 
              onEditClick={() => setShowSettings(true)} 
            />
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <PhaseOverview 
            phaseRanges={derivedState.phaseRanges}
            currentPhase={derivedState.currentPhase}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-4 pt-4 border-t border-widget-border">
        <Button
          variant="glass"
          size="sm"
          onClick={() => setShowDatePicker(true)}
          className="w-full"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {UI_TEXT.newPeriod}
        </Button>
      </div>

      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
        derivedState={derivedState}
        cycleLength={cycleData.cycleLength}
        periodLength={cycleData.periodLength}
        lastPeriodStart={cycleData.lastPeriodStart}
        title={UI_TEXT.newPeriod}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        cycleData={cycleData}
        onUpdateCycleLength={setCycleLength}
        onUpdatePeriodLength={setPeriodLength}
      />
    </div>
  );
}