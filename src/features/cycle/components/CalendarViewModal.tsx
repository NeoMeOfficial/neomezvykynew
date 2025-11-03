import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarView } from '../CalendarView';
import { CycleData, DerivedState, PeriodIntensity } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect?: (date: Date) => void;
  mode?: 'select-start' | 'select-end';
  cycleData: CycleData;
  derivedState: DerivedState;
  onPeriodIntensityChange?: (date: string, intensity: PeriodIntensity | null) => void;
  getPeriodIntensity?: (date: string) => PeriodIntensity | undefined;
  accessCode?: string;
}

export function CalendarViewModal({
  isOpen,
  onClose,
  onDateSelect,
  mode = 'select-start',
  cycleData,
  derivedState,
  onPeriodIntensityChange,
  getPeriodIntensity,
  accessCode
}: CalendarViewModalProps) {
  const isMobile = useIsMobile();

  const handleDaySelect = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const modeTitle = mode === 'select-start' 
    ? 'Vyber začiatok periody' 
    : 'Vyber koniec periody';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${isMobile ? 'w-[95vw] max-w-[95vw] h-[90vh]' : 'max-w-6xl w-[90vw] max-h-[90vh]'} overflow-hidden flex flex-col rounded-3xl bg-background/80 backdrop-blur-xl border-white/20`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold" style={{ color: '#955F6A' }}>
            {modeTitle}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Klikni na deň v kalendári pre výber dátumu. Môžeš pridať symptómy a poznámky.
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <CalendarView
            cycleData={cycleData}
            derivedState={derivedState}
            onPeriodIntensityChange={onPeriodIntensityChange}
            getPeriodIntensity={getPeriodIntensity}
            accessCode={accessCode}
            readOnly={false}
            onDaySelect={handleDaySelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
