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
          <div className="symptom-glass rounded-2xl p-4" style={{ backgroundColor: '#FBF8F9' }}>
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
              className="p-3 pointer-events-auto slovak-calendar"
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
              style={{ color: '#F4415F' }}
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