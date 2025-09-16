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
        className="glass-container border-0 backdrop-blur-xl shadow-2xl max-w-md w-[95vw] max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader className="pb-2 text-center">
          <DialogTitle className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
            <CalendarIcon className="w-4 h-4" style={{ color: 'hsl(var(--blush))' }} />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="glass-surface rounded-xl p-3">
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
              className="rounded-lg border-0 w-full pointer-events-auto"
              classNames={{
                months: "flex flex-col w-full",
                month: "w-full space-y-2",
                caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7",
                table: "w-full border-collapse",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-xs flex-1 text-center py-1",
                row: "flex w-full mt-1",
                cell: "text-center text-sm p-0 relative flex-1 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-8 w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center text-xs hover:bg-accent hover:text-accent-foreground rounded-md",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-semibold",
                day_outside: "text-muted-foreground opacity-30",
                day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              fixedWeeks
            />
          </div>
          
          {selectedDate && (
            <div className="glass-surface rounded-xl p-3">
              <div className="text-center mb-2">
                <p className="text-sm font-medium text-foreground">
                  📅 {formatDateSk(selectedDate)}
                </p>
              </div>
              <HistoricalSymptoms date={selectedDate} accessCode={accessCode} />
            </div>
          )}
          
          {/* Compact Legend */}
          <div className="glass-surface rounded-xl p-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-[hsl(355_60%_90%)]"></div>
                <span className="text-foreground/70">Menštruácia</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-[hsl(25_50%_88%)]"></div>
                <span className="text-foreground/70">Plodné dni</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-[hsl(315_40%_88%)]"></div>
                <span className="text-foreground/70">Ovulácia</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-[hsl(45_85%_70%)]"></div>
                <span className="text-foreground/70">Dnes</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" onClick={handleCancel} size="sm" className="text-sm">
              <X className="w-4 h-4 mr-1" />
              Zrušiť
            </Button>
            <Button 
              variant="hero"
              onClick={handleConfirm} 
              disabled={!selectedDate}
              size="sm" 
              className="text-sm"
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