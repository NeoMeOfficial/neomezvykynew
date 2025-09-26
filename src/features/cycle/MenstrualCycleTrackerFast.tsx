import React, { useState, lazy, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionnaireView } from './QuestionnaireView';
import { FadingWordsLoader } from '@/components/FadingWordsLoader';
import { useCycleData } from './useCycleData';

// Lazy load heavy components
const SuggestedToday = lazy(() => import('./SuggestedToday').then(module => ({ default: module.SuggestedToday })));
const WellnessDonutChart = lazy(() => import('./WellnessDonutChart').then(module => ({ default: module.WellnessDonutChart })));
const PhaseOverview = lazy(() => import('./PhaseOverview').then(module => ({ default: module.PhaseOverview })));
const DatePickerModal = lazy(() => import('./DatePickerModal').then(module => ({ default: module.DatePickerModal })));
const SettingsModal = lazy(() => import('./SettingsModal').then(module => ({ default: module.SettingsModal })));

interface MenstrualCycleTrackerProps {
  accessCode?: string;
  compact?: boolean;
  onFirstInteraction?: () => void;
}

const ComponentLoader = () => (
  <div className="flex items-center justify-center p-4">
    <FadingWordsLoader />
  </div>
);

export default function MenstrualCycleTrackerFast({
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

  // Check if questionnaire is needed
  const needsQuestionnaire = !cycleData.lastPeriodStart || new Date(cycleData.lastPeriodStart).getTime() < new Date('2000-01-01').getTime();

  const handleQuestionnaireComplete = (data: {
    lastPeriodStart: Date;
    cycleLength: number;
    periodLength: number;
  }) => {
    setLastPeriodStart(data.lastPeriodStart);
    setCycleLength(data.cycleLength);
    setPeriodLength(data.periodLength);
    onFirstInteraction?.();
  };

  const resetToQuestionnaire = () => {
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
  };

  // Show questionnaire if needed
  if (needsQuestionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4">
        <div className="w-full max-w-[600px] mx-auto">
          <QuestionnaireView onComplete={handleQuestionnaireComplete} />
        </div>
      </div>
    );
  }

  // Main tracker view with progressive loading
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
      <div className="w-full max-w-none px-2 sm:px-4 py-4 sm:py-8 mx-auto">
        <div className="w-full max-w-[600px] mx-auto">
          {/* Back to questionnaire button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToQuestionnaire}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Naspäť na dotazník
            </Button>
          </div>

          {/* Progressive loading of main content */}
          <div className="space-y-6">
            <Suspense fallback={<ComponentLoader />}>
              <SuggestedToday 
                derivedState={derivedState!} 
                accessCode={accessCode}
              />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Suspense fallback={<ComponentLoader />}>
              <WellnessDonutChart 
                derivedState={derivedState!}
                cycleData={cycleData}
              />
              </Suspense>

              <Suspense fallback={<ComponentLoader />}>
              <PhaseOverview 
                phaseRanges={derivedState!.phaseRanges}
                currentPhase={derivedState!.currentPhase}
              />
              </Suspense>
            </div>

            {/* Lazy load modals only when needed */}
            {showDatePicker && (
              <Suspense fallback={null}>
                <DatePickerModal
                  isOpen={showDatePicker}
                  onClose={() => setShowDatePicker(false)}
                  onDateSelect={setLastPeriodStart}
                  derivedState={derivedState}
                  cycleLength={cycleData.cycleLength}
                  periodLength={cycleData.periodLength}
                  lastPeriodStart={cycleData.lastPeriodStart}
                  accessCode={accessCode}
                />
              </Suspense>
            )}

            {showSettings && (
              <Suspense fallback={null}>
                <SettingsModal
                  isOpen={showSettings}
                  onClose={() => setShowSettings(false)}
                  cycleData={cycleData}
                  onUpdateCycleLength={setCycleLength}
                  onUpdatePeriodLength={setPeriodLength}
                  onReset={resetToQuestionnaire}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}