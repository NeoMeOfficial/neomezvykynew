import { useState } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface NextDatesInfoProps {
  lastPeriodStart: string | null;
  cycleLength: number;
  periodLength: number;
  currentPhase?: string;
  onEditClick?: () => void;
  onPeriodStart?: (date: Date) => void;
  onPeriodEnd?: (startDate: Date, endDate: Date) => void;
  onUseCustomDatePicker?: () => void;
  onPeriodEndClick?: () => void;
  onSetupComplete?: (data: { lastPeriodStart: Date; periodLength: number; cycleLength: number }) => void;
  onPeriodLengthChange?: (length: number) => void;
}

export function NextDatesInfo({ 
  lastPeriodStart, 
  cycleLength,
  periodLength,
  currentPhase,
  onEditClick,
  onPeriodEndClick,
  onSetupComplete,
  onPeriodLengthChange
}: NextDatesInfoProps) {
  
  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [setupLastPeriod, setSetupLastPeriod] = useState<Date | undefined>(undefined);
  const [setupPeriodLength, setSetupPeriodLength] = useState(5);
  const [setupNextPeriod, setSetupNextPeriod] = useState<Date | undefined>(undefined);
  const [showPeriodLengthPopover, setShowPeriodLengthPopover] = useState(false);

  const formatDate = (date: Date) => {
    return format(date, 'd. M. yyyy', { locale: sk });
  };

  // Calculate dates if lastPeriodStart exists
  const startDate = lastPeriodStart ? new Date(lastPeriodStart) : null;
  const nextPeriodDate = startDate ? addDays(startDate, cycleLength) : null;
  const periodEndDate = startDate ? addDays(startDate, periodLength - 1) : null;
  
  // Calculate fertile window (ovulation typically 14 days before next period)
  const ovulationDay = cycleLength - 14;
  const fertilityStartDay = ovulationDay - 2;
  const fertilityEndDay = ovulationDay;
  
  const fertilityStart = startDate ? addDays(startDate, fertilityStartDay) : null;
  const fertilityEnd = startDate ? addDays(startDate, fertilityEndDay) : null;

  // Calculate days until next period
  const today = new Date();
  const daysUntilNextPeriod = nextPeriodDate ? differenceInDays(nextPeriodDate, today) : null;

  const isInMenstruationPhase = currentPhase === 'Menštruácia';

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    if (setupLastPeriod && setupNextPeriod && onSetupComplete) {
      const calculatedCycleLength = differenceInDays(setupNextPeriod, setupLastPeriod);
      onSetupComplete({
        lastPeriodStart: setupLastPeriod,
        periodLength: setupPeriodLength,
        cycleLength: calculatedCycleLength
      });
    }
  };

  // Validate cycle length
  const getCalculatedCycleLength = () => {
    if (setupLastPeriod && setupNextPeriod) {
      return differenceInDays(setupNextPeriod, setupLastPeriod);
    }
    return null;
  };

  const calculatedCycleLength = getCalculatedCycleLength();
  const isCycleLengthValid = calculatedCycleLength !== null && calculatedCycleLength >= 21 && calculatedCycleLength <= 35;

  // ONBOARDING VIEW - for new users
  if (!lastPeriodStart) {
    return (
      <div className="space-y-3 px-1">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5" style={{ color: '#FF7782' }} />
          <h3 className="text-base font-semibold" style={{ color: '#955F6A' }}>
            Nastavenie kalendára
          </h3>
        </div>

        {/* Step 1: Last period start */}
        <div className="p-4 rounded-xl" 
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
               boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
             }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" 
                    style={{ backgroundColor: setupLastPeriod ? '#4ade80' : '#FF7782' }}>
                {setupLastPeriod ? '✓' : '1'}
              </span>
              <p className="text-sm font-medium" style={{ color: '#955F6A' }}>
                Kedy ti začala posledná menštruácia?
              </p>
            </div>
          </div>
          
          <div className="mt-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-pink-200",
                    !setupLastPeriod && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" style={{ color: '#FF7782' }} />
                  {setupLastPeriod ? formatDate(setupLastPeriod) : "Vyber dátum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={setupLastPeriod}
                  onSelect={(date) => {
                    setSetupLastPeriod(date);
                    if (date) setOnboardingStep(2);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Step 2: Period length */}
        {onboardingStep >= 2 && (
          <div className="p-4 rounded-xl" 
               style={{ 
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
                 boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
               }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" 
                      style={{ backgroundColor: onboardingStep > 2 ? '#4ade80' : '#FF7782' }}>
                  {onboardingStep > 2 ? '✓' : '2'}
                </span>
                <p className="text-sm font-medium" style={{ color: '#955F6A' }}>
                  Koľko dní zvyčajne krvácaš?
                </p>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-2">
              {[3, 4, 5, 6, 7].map((days) => (
                <button
                  key={days}
                  onClick={() => {
                    setSetupPeriodLength(days);
                    setOnboardingStep(3);
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full text-sm font-medium transition-all",
                    setupPeriodLength === days 
                      ? "text-white shadow-md" 
                      : "bg-white/50 hover:bg-white/80"
                  )}
                  style={{ 
                    backgroundColor: setupPeriodLength === days ? '#FF7782' : undefined,
                    color: setupPeriodLength === days ? 'white' : '#955F6A'
                  }}
                >
                  {days}
                </button>
              ))}
              <span className="text-sm ml-1" style={{ color: '#955F6A' }}>dní</span>
            </div>
          </div>
        )}

        {/* Step 3: Expected next period */}
        {onboardingStep >= 3 && (
          <div className="p-4 rounded-xl" 
               style={{ 
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
                 boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
               }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" 
                      style={{ backgroundColor: setupNextPeriod ? '#4ade80' : '#FF7782' }}>
                  {setupNextPeriod ? '✓' : '3'}
                </span>
                <p className="text-sm font-medium" style={{ color: '#955F6A' }}>
                  Kedy očakávaš ďalšiu menštruáciu?
                </p>
              </div>
            </div>
            
            <div className="mt-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-pink-200",
                      !setupNextPeriod && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" style={{ color: '#FF7782' }} />
                    {setupNextPeriod ? formatDate(setupNextPeriod) : "Vyber dátum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={setupNextPeriod}
                    onSelect={setSetupNextPeriod}
                    disabled={(date) => date <= new Date() || (setupLastPeriod && date <= setupLastPeriod)}
                    defaultMonth={setupLastPeriod ? addDays(setupLastPeriod, 28) : addDays(new Date(), 14)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {/* Show calculated cycle length */}
              {setupNextPeriod && calculatedCycleLength !== null && (
                <div className="mt-3 p-2 rounded-lg bg-white/50">
                  <p className="text-xs" style={{ color: '#955F6A' }}>
                    Vypočítaná dĺžka cyklu: <span className="font-semibold" style={{ color: isCycleLengthValid ? '#4ade80' : '#ef4444' }}>
                      {calculatedCycleLength} dní
                    </span>
                    {!isCycleLengthValid && (
                      <span className="block mt-1 text-red-500">
                        Dĺžka cyklu by mala byť medzi 21-35 dňami. Skontroluj dátumy.
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complete button */}
        {setupLastPeriod && setupNextPeriod && isCycleLengthValid && (
          <Button
            onClick={handleOnboardingComplete}
            className="w-full mt-4"
            style={{ backgroundColor: '#FF7782' }}
          >
            Dokončiť nastavenie
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // EXISTING USER VIEW - show all cycle info
  return (
    <div className="space-y-2 px-1">
      {/* Countdown to next period - highlight box */}
      {daysUntilNextPeriod !== null && daysUntilNextPeriod > 0 && (
        <div className="p-4 rounded-xl mb-3" 
             style={{ 
               background: 'linear-gradient(135deg, #FF7782 0%, #FFB3B8 100%)',
               boxShadow: '0 4px 12px rgba(255, 119, 130, 0.3)'
             }}>
          <p className="text-white text-sm font-medium text-center">
            Do ďalšej menštruácie ti ostáva
          </p>
          <p className="text-white text-2xl font-bold text-center mt-1">
            {daysUntilNextPeriod} {daysUntilNextPeriod === 1 ? 'deň' : daysUntilNextPeriod < 5 ? 'dni' : 'dní'}
          </p>
        </div>
      )}

      {/* Last period start date */}
      <div className="p-3 rounded-lg" 
           style={{ 
             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
           }}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
            Posledná menštruácia: <span style={{ color: '#FF7782' }}>
              {formatDate(startDate!)}
            </span>
          </p>
          {onEditClick && (
            <button
              onClick={onEditClick}
              className="px-2 py-1 text-xs font-medium rounded-lg bg-white/50 hover:bg-white/80 transition-colors flex-shrink-0"
              style={{ color: '#FF7782' }}
            >
              Zmeniť
            </button>
          )}
        </div>
      </div>

      {/* Bleeding duration */}
      <div className="p-3 rounded-lg" 
           style={{ 
             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
           }}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
            Dĺžka krvácania: <span style={{ color: '#FF7782' }}>
              {periodLength} {periodLength === 1 ? 'deň' : periodLength < 5 ? 'dni' : 'dní'}
            </span>
          </p>
          <Popover open={showPeriodLengthPopover} onOpenChange={setShowPeriodLengthPopover}>
            <PopoverTrigger asChild>
              <button
                className="px-2 py-1 text-xs font-medium rounded-lg bg-white/50 hover:bg-white/80 transition-colors flex-shrink-0"
                style={{ color: '#FF7782' }}
              >
                Zmeniť
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 pointer-events-auto" align="end">
              <p className="text-sm font-medium mb-2" style={{ color: '#955F6A' }}>Dĺžka krvácania</p>
              <div className="flex items-center gap-2">
                {[3, 4, 5, 6, 7].map((days) => (
                  <button
                    key={days}
                    onClick={() => {
                      onPeriodLengthChange?.(days);
                      setShowPeriodLengthPopover(false);
                    }}
                    className={cn(
                      "w-9 h-9 rounded-full text-sm font-medium transition-all",
                      periodLength === days 
                        ? "text-white shadow-md" 
                        : "bg-gray-100 hover:bg-gray-200"
                    )}
                    style={{ 
                      backgroundColor: periodLength === days ? '#FF7782' : undefined,
                      color: periodLength === days ? 'white' : '#955F6A'
                    }}
                  >
                    {days}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Predicted next period */}
      {nextPeriodDate && (
        <div className="p-3 rounded-lg" 
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
               boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
             }}>
        <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
          Odhadovaná ďalšia menštruácia: <span style={{ color: '#FF7782' }}>
            {formatDate(nextPeriodDate)}
          </span>
        </p>
      </div>
      )}

      {/* Cycle length - calculated automatically */}
      <div className="p-3 rounded-lg" 
           style={{ 
             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
           }}>
        <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
          Dĺžka cyklu: <span style={{ color: '#FF7782' }}>
            {cycleLength} dní
          </span>
        </p>
      </div>

      {/* Fertile window info */}
      {fertilityStart && fertilityEnd && (
        <div className="p-3 rounded-lg"
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
               boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
             }}>
          <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
            Odhadované plodné dni: <span style={{ color: '#FF7782' }}>
              {formatDate(fertilityStart)} - {formatDate(fertilityEnd)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
