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
import { HistoricalSymptoms } from './HistoricalSymptoms';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  derivedState: DerivedState | null;
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string | null;
  title?: string;
  accessCode?: string;
}

export function DatePickerModal({
  isOpen,
  onClose,
  onDateSelect,
  derivedState,
  cycleLength,
  periodLength,
  lastPeriodStart,
  title = UI_TEXT.lastPeriod,
  accessCode
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
        className="calendar-dialog-container border-0 max-w-md w-[95vw] max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#FBF8F9' }}
        aria-describedby={undefined}
      >
        <DialogHeader className="pb-2 text-center">
          <DialogTitle className="text-lg font-semibold flex items-center justify-center gap-2" style={{ color: 'hsl(var(--cycle-secondary-text))' }}>
            <CalendarIcon className="w-4 h-4" style={{ color: 'hsl(var(--cycle-secondary-text))' }} />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        
        <div className="space-y-3">
          <div className="calendar-inner-container rounded-2xl p-4" style={{ backgroundColor: '#FBF8F9' }}>
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
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium cycle-calendar-label",
                nav: "space-x-1 flex items-center",
                nav_button: "cycle-calendar-nav-button h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-12 font-normal text-[0.8rem] flex items-center justify-center",
                row: "flex w-full mt-2",
                cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "cycle-calendar-day h-12 w-12 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center",
                day_range_end: "day-range-end",
                day_selected: "cycle-calendar-selected",
                day_today: "cycle-calendar-today",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "cycle-calendar-disabled",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              className="p-3 pointer-events-auto slovak-calendar"
              fixedWeeks
            />
          </div>
          
          {selectedDate && (
            <div className="glass-surface rounded-xl p-3">
              <div className="text-center mb-2">
                <p className="text-sm font-medium" style={{ color: 'hsl(var(--cycle-secondary-text))' }}>
                  📅 {formatDateSk(selectedDate)}
                </p>
              </div>
              <HistoricalSymptoms date={selectedDate} accessCode={accessCode} />
            </div>
          )}
          
          
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" onClick={handleCancel} size="sm" className="text-sm">
              <X className="w-4 h-4 mr-1" />
              Zrušiť
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedDate}
              size="sm" 
              className="text-sm bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/30 rounded-3xl symptom-glass hover:from-rose-50 hover:to-pink-50 transition-all"
              style={{ color: 'hsl(var(--cycle-secondary-text))' }}
            >
              <Check className="w-4 h-4 mr-1" />
              Potvrdiť
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}