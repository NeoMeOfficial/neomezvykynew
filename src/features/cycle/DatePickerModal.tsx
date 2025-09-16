import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DerivedState } from './types';
import { validateDate, isPeriodDate, formatDateSk, isFertilityDate, isOvulationDate } from './utils';
import { UI_TEXT } from './insights';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  derivedState: DerivedState | null;
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string | null;
  title?: string;
}

export function DatePickerModal({
  isOpen,
  onClose,
  onDateSelect,
  derivedState,
  cycleLength,
  periodLength,
  lastPeriodStart,
  title = UI_TEXT.lastPeriod
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !derivedState) return;
    
    if (validateDate(date, derivedState.minDate, derivedState.maxDate)) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      setSelectedDate(undefined);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedDate(undefined);
    onClose();
  };

  if (!derivedState) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="glass-container border-0 backdrop-blur-xl shadow-2xl max-w-none top-0 left-1/2 -translate-x-1/2 translate-y-0 w-[calc(100vw-4px)] max-h-[85vh] overflow-y-auto mx-0.5 mt-2 sm:max-w-lg sm:top-1/2 sm:-translate-y-1/2"
        aria-describedby={undefined}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: 'hsl(var(--blush) / 0.15)' }}>
              <CalendarIcon className="w-5 h-5" style={{ color: 'hsl(var(--blush))' }} />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 -mt-4">
          <div className="glass-surface rounded-2xl p-2 w-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => 
                !validateDate(date, derivedState.minDate, derivedState.maxDate)
              }
              weekStartsOn={1}
              modifiers={{
                period: (date) => 
                  lastPeriodStart ? isPeriodDate(date, lastPeriodStart, cycleLength, periodLength) : false,
                fertility: (date) => 
                  lastPeriodStart ? isFertilityDate(date, lastPeriodStart, cycleLength) : false,
                ovulation: (date) => 
                  lastPeriodStart ? isOvulationDate(date, lastPeriodStart, cycleLength) : false,
                today: (date) => {
                  const today = new Date();
                  const isToday = date.toDateString() === today.toDateString();
                  if (!isToday || !lastPeriodStart) return false;
                  
                  // Only apply today style if it's not in any cycle category
                  return !isPeriodDate(date, lastPeriodStart, cycleLength, periodLength) &&
                         !isFertilityDate(date, lastPeriodStart, cycleLength) &&
                         !isOvulationDate(date, lastPeriodStart, cycleLength);
                }
              }}
              modifiersClassNames={{
                period: 'calendar-period-day',
                fertility: 'calendar-fertility-day',
                ovulation: 'calendar-ovulation-day',
                today: 'calendar-today'
              }}
              className="rounded-xl border-0 w-full pointer-events-auto"
              classNames={{
                months: "flex flex-col w-full",
                month: "w-full space-y-4",
                table: "w-full border-collapse",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm flex-1 text-center",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-1 relative flex-1 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-10 w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center text-sm",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
          
          {selectedDate && (
            <div className="glass-surface rounded-xl p-3 text-center">
              <p className="text-sm font-medium text-foreground/80">
                Vybraný dátum: <span className="text-foreground font-semibold">{formatDateSk(selectedDate)}</span>
              </p>
            </div>
          )}
          
          {/* Calendar Legend */}
          <div className="glass-surface rounded-xl p-3">
            <h4 className="text-sm font-medium text-foreground mb-3">Legenda:</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[hsl(355_60%_90%)] border border-[hsl(355_60%_80%)]"></div>
                <span className="text-foreground/80">Menštruácia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[hsl(25_50%_88%)] border border-[hsl(25_50%_78%)]"></div>
                <span className="text-foreground/80">Plodné dni</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[hsl(315_40%_88%)] border border-[hsl(315_40%_78%)]"></div>
                <span className="text-foreground/80">Ovulácia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[hsl(45_85%_70%)] border border-[hsl(45_85%_60%)]"></div>
                <span className="text-foreground/80">Dnes</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={handleCancel} className="glass-surface border-0 hover:bg-background/50">
              <X className="w-4 h-4 mr-2" />
              {UI_TEXT.cancel}
            </Button>
            <Button 
              variant="hero"
              onClick={handleConfirm} 
              disabled={!selectedDate}
              className="shadow-lg"
            >
              <Check className="w-4 h-4 mr-2" />
              {UI_TEXT.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}