import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { QuestionnaireProgress } from './QuestionnaireProgress';
import { UI_TEXT } from './insights';

interface QuestionnaireViewProps {
  onComplete: (data: {
    lastPeriodStart: Date;
    cycleLength: number;
    periodLength: number;
  }) => void;
}

export function QuestionnaireView({ onComplete }: QuestionnaireViewProps) {
  const [setupAge, setSetupAge] = useState(25);
  const [setupCycleLength, setSetupCycleLength] = useState(28);
  const [setupPeriodLength, setSetupPeriodLength] = useState(5);
  const [cycleStartDate, setCycleStartDate] = useState<Date>();
  const [cycleEndDate, setCycleEndDate] = useState<Date>();
  
  // Questionnaire progress state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedPMSSymptoms, setSelectedPMSSymptoms] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const totalSteps = 5;

  const validateCycleData = (): { valid: boolean; warnings: string[] } => {
    const warnings: string[] = [];
    
    if (!cycleStartDate || !cycleEndDate) {
      return { valid: false, warnings: ['Vyplň oba dátumy (začiatok a koniec cyklu).'] };
    }
    
    const calculatedCycleLength = differenceInDays(cycleEndDate, cycleStartDate);
    
    // Validácia 1: cycle_length 25-35 dní
    if (calculatedCycleLength < 25 || calculatedCycleLength > 35) {
      warnings.push(`⚠️ Dĺžka cyklu ${calculatedCycleLength} dní je mimo rozsahu 25-35 dní. Tieto údaje môžu ovplyvniť presnosť výpočtu.`);
    }
    
    // Validácia 2: periodLength 2-8 dní
    if (setupPeriodLength < 2 || setupPeriodLength > 8) {
      warnings.push('⚠️ Dĺžka krvácania musí byť 2-8 dní.');
      return { valid: false, warnings };
    }
    
    // Validácia 3: Folikulárna fáza minimálne 10 dní
    const ovulationDay = calculatedCycleLength - 14;
    const follicularLength = ovulationDay - 1;
    
    if (follicularLength < 10) {
      warnings.push('⚠️ Tvoja folikulárna fáza sa zdá byť kratšia ako 10 dní, čo môže naznačovať hormonálnu nerovnováhu. Ak sa to opakuje, zváž konzultáciu s gynekológom.');
    }
    
    // Validácia 4: Kritická kontrola
    if (setupPeriodLength + 14 >= calculatedCycleLength) {
      warnings.push(`⚠️ Tvoj cyklus sa zdá byť veľmi krátky (${calculatedCycleLength} dní) alebo s dlhým krvácaním (${setupPeriodLength} dní). Tieto údaje môžu ovplyvniť presnosť výpočtu. Ak sa to opakuje, odporúčame konzultáciu s gynekológom.`);
    }
    
    return { valid: warnings.length === 0 || warnings.every(w => w.startsWith('⚠️')), warnings };
  };

  const handleSetupComplete = (date: Date) => {
    const validation = validateCycleData();
    setValidationWarnings(validation.warnings);
    
    if (!validation.valid) {
      return;
    }
    
    let calculatedCycleLength = setupCycleLength;
    
    if (cycleStartDate && cycleEndDate) {
      calculatedCycleLength = differenceInDays(cycleEndDate, cycleStartDate);
    }
    
    onComplete({
      lastPeriodStart: date,
      cycleLength: calculatedCycleLength,
      periodLength: setupPeriodLength
    });
  };

  const getIncompleteQuestions = () => {
    const incomplete = [];
    if (!setupAge || setupAge < 13 || setupAge > 60) incomplete.push({ step: 1, question: 'Vek' });
    if (!cycleStartDate || !cycleEndDate) incomplete.push({ step: 2, question: 'Dátum cyklu' });
    if (!setupPeriodLength || setupPeriodLength < 2 || setupPeriodLength > 8) incomplete.push({ step: 3, question: 'Dĺžka menštruácie' });
    return incomplete;
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

  return (
    <div className="w-full space-y-4">
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
                  max="8" 
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

              {/* Missing questions warning */}
              {getIncompleteQuestions().length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                  <div className="text-center mb-4">
                    <p className="font-medium text-amber-700 mb-2">
                      Ešte potrebujeme dokončiť tieto otázky:
                    </p>
                    <div className="space-y-2">
                      {getIncompleteQuestions().map((item) => (
                        <Button
                          key={item.step}
                          onClick={() => setCurrentStep(item.step)}
                          variant="outline"
                          className="mr-2 text-xs py-1 px-3 bg-white border-amber-300 text-amber-700 hover:bg-amber-50"
                        >
                          {item.question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
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
              
              {/* Validation Warnings */}
              {validationWarnings.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <p className="font-medium text-amber-700 mb-2">⚠️ Upozornenia:</p>
                  {validationWarnings.map((warning, idx) => (
                    <p key={idx} className="text-sm text-amber-700">{warning}</p>
                  ))}
                </div>
              )}
              
              <div className="text-center">
                <Button 
                  onClick={() => {
                    if (cycleStartDate) {
                      handleSetupComplete(cycleStartDate);
                    }
                  }}
                  disabled={!cycleStartDate || getIncompleteQuestions().length > 0}
                  className="w-full py-3 text-base bg-gradient-primary font-semibold rounded-3xl symptom-glass hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ color: '#F4415F' }}
                >
                  {getIncompleteQuestions().length > 0 ? 'Dokončite všetky otázky' : 'Dokončiť nastavenie'}
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
    </div>
  );
}