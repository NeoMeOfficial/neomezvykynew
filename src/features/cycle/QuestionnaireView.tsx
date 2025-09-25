import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { QuestionnaireProgress } from './QuestionnaireProgress';
import { UI_TEXT } from './insights';
import { formatDateSk } from './utils';

type OutcomeType = 'next-period' | 'fertile-days';

interface QuestionnaireViewProps {
  onComplete: (data: {
    lastPeriodStart: Date;
    cycleLength: number;
    periodLength: number;
  }) => void;
}

export function QuestionnaireView({ onComplete }: QuestionnaireViewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [setupAge, setSetupAge] = useState(25);
  const [setupCycleLength, setSetupCycleLength] = useState(28);
  const [setupPeriodLength, setSetupPeriodLength] = useState(5);
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null);
  const [cycleStartDate, setCycleStartDate] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    
    if (step < 4) {
      setCurrentStep(step + 1);
    }
  };

  const handleFinish = () => {
    if (cycleStartDate) {
      onComplete({
        lastPeriodStart: cycleStartDate,
        cycleLength: setupCycleLength,
        periodLength: setupPeriodLength
      });
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="space-y-6">
        <QuestionnaireProgress currentStep={currentStep} totalSteps={4} completedSteps={completedSteps} />
        
        {currentStep === 1 && (
          <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-rose-100">
            <h3 className="text-lg font-medium text-center text-rose-900">
              Čo chcete sledovať?
            </h3>
            <p className="text-sm text-rose-700 text-center">
              Vyberte si, čo je pre vás najdôležitejšie
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setSelectedOutcome('next-period');
                  handleStepComplete(1);
                }}
                variant={selectedOutcome === 'next-period' ? 'default' : 'outline'}
                className="h-16 text-sm flex flex-col items-center justify-center space-y-1"
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Najbližšiu menštruáciu</span>
              </Button>
              
              <Button
                onClick={() => {
                  setSelectedOutcome('fertile-days');
                  handleStepComplete(1);
                }}
                variant={selectedOutcome === 'fertile-days' ? 'default' : 'outline'}
                className="h-16 text-sm flex flex-col items-center justify-center space-y-1"
              >
                <span className="text-lg">🌸</span>
                <span>Plodné dni</span>
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-rose-100">
            <h3 className="text-lg font-medium text-center text-rose-900">
              Základné informácie
            </h3>
            <p className="text-sm text-rose-700 text-center">
              Pomôže nám to lepšie prispôsobiť odporúčania
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age" className="text-rose-800">Vek</Label>
                <Input
                  id="age"
                  type="number"
                  value={setupAge}
                  onChange={(e) => setSetupAge(Number(e.target.value))}
                  min="12"
                  max="55"
                  className="mt-1"
                />
              </div>
              
              <Button
                onClick={() => handleStepComplete(2)}
                className="w-full"
                disabled={setupAge < 12 || setupAge > 55}
              >
                Pokračovať
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-rose-100">
            <h3 className="text-lg font-medium text-center text-rose-900">
              Váš cyklus
            </h3>
            <p className="text-sm text-rose-700 text-center">
              Zadajte typické dĺžky vášho cyklu
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cycle-length" className="text-rose-800">
                  Dĺžka cyklu (dni)
                </Label>
                <Input
                  id="cycle-length"
                  type="number"
                  value={setupCycleLength}
                  onChange={(e) => setSetupCycleLength(Number(e.target.value))}
                  min="21"
                  max="35"
                  className="mt-1"
                />
                <p className="text-xs text-rose-600 mt-1">Obvykle 21-35 dní</p>
              </div>
              
              <div>
                <Label htmlFor="period-length" className="text-rose-800">
                  Dĺžka menštruácie (dni)
                </Label>
                <Input
                  id="period-length"
                  type="number"
                  value={setupPeriodLength}
                  onChange={(e) => setSetupPeriodLength(Number(e.target.value))}
                  min="3"
                  max="7"
                  className="mt-1"
                />
                <p className="text-xs text-rose-600 mt-1">Obvykle 3-7 dní</p>
              </div>
              
              <Button
                onClick={() => handleStepComplete(3)}
                className="w-full"
                disabled={setupCycleLength < 21 || setupCycleLength > 35 || setupPeriodLength < 3 || setupPeriodLength > 7}
              >
                Pokračovať
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-rose-100">
            <h3 className="text-lg font-medium text-center text-rose-900">
              Posledná menštruácia
            </h3>
            <p className="text-sm text-rose-700 text-center">
              Kedy začala vaša posledná menštruácia?
            </p>
            
            <div className="space-y-4">
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-12"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {cycleStartDate ? (
                      formatDateSk(cycleStartDate)
                    ) : (
                      "Vyberte dátum poslednej menštruácie"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={cycleStartDate}
                    onSelect={(date) => {
                      setCycleStartDate(date);
                      setShowDatePicker(false);
                    }}
                    initialFocus
                    locale={sk}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              
              {cycleStartDate && (
                <div className="p-3 bg-rose-100 rounded-lg">
                  <p className="text-sm text-rose-800">
                    Vaša posledná menštruácia začala: <strong>{formatDateSk(cycleStartDate)}</strong>
                  </p>
                </div>
              )}
              
              <Button
                onClick={handleFinish}
                className="w-full"
                disabled={!cycleStartDate}
              >
                Dokončiť nastavenie
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}