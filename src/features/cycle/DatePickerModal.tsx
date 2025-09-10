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
      <DialogContent className="glass-container border-0 backdrop-blur-xl shadow-2xl sm:max-w-md translate-y-[-20vh]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 -mt-4">
          <div className="glass-surface rounded-2xl p-1 w-full max-w-md mx-auto">
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
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }
              }}
              className="rounded-xl border-0"
            />
          </div>
          
          {selectedDate && (
            <div className="glass-surface rounded-xl p-3 text-center">
              <p className="text-sm font-medium text-foreground/80">
                Vybraný dátum: <span className="text-foreground font-semibold">{formatDateSk(selectedDate)}</span>
              </p>
            </div>
          )}
          
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={handleCancel} className="glass-surface border-0 hover:bg-background/50">
              <X className="w-4 h-4 mr-2" />
              {UI_TEXT.cancel}
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedDate}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
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