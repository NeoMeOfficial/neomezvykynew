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
import { validateDate, isPeriodDate, formatDateSk } from './utils';
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => 
              !validateDate(date, derivedState.minDate, derivedState.maxDate)
            }
            modifiers={{
              period: (date) => 
                lastPeriodStart ? isPeriodDate(date, lastPeriodStart, cycleLength, periodLength) : false
            }}
            modifiersStyles={{
              period: { 
                backgroundColor: 'hsl(var(--blush))', 
                color: 'white',
                borderRadius: '4px'
              }
            }}
            className="rounded-md border glass-surface"
          />
          
          {selectedDate && (
            <div className="text-center text-sm text-muted-foreground">
              Vybraný dátum: {formatDateSk(selectedDate)}
            </div>
          )}
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              {UI_TEXT.cancel}
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedDate}
              variant="hero"
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