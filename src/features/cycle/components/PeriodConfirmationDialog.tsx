import { useState } from 'react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";

interface PeriodConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  predictedDate: Date;
  onConfirmStart: (date: Date) => void;
  onConfirmEnd: (startDate: Date, endDate: Date) => void;
  onUseCustomDatePicker?: () => void;
}

type DialogStep = 'initial' | 'select-start' | 'select-end';

export function PeriodConfirmationDialog({
  open,
  onOpenChange,
  predictedDate,
  onConfirmStart,
  onConfirmEnd,
  onUseCustomDatePicker,
}: PeriodConfirmationDialogProps) {
  const [step, setStep] = useState<DialogStep>('initial');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleClose = () => {
    setStep('initial');
    setStartDate(undefined);
    setEndDate(undefined);
    onOpenChange(false);
  };

  const handleStarted = () => {
    setStep('select-start');
    setStartDate(new Date()); // Default to today
  };

  const handleNotYet = () => {
    toast({
      title: "V poriadku",
      description: "Dáme ti vedieť, keď sa priblíži očakávaný termín.",
    });
    handleClose();
  };

  const handleUseCustomPicker = () => {
    handleClose();
    onUseCustomDatePicker?.();
  };

  const handleConfirmStart = () => {
    if (!startDate) return;
    
    onConfirmStart(startDate);
    setStep('select-end');
  };

  const handleConfirmEnd = () => {
    if (!startDate || !endDate) return;
    
    if (endDate < startDate) {
      toast({
        title: "Neplatný dátum",
        description: "Koniec menštruácie nemôže byť pred jej začiatkom.",
        variant: "destructive",
      });
      return;
    }
    
    onConfirmEnd(startDate, endDate);
    toast({
      title: "Uložené!",
      description: "Menštruácia bola zaznamenaná.",
    });
    handleClose();
  };

  const handleSkipEnd = () => {
    if (!startDate) return;
    
    onConfirmStart(startDate);
    toast({
      title: "Začiatok uložený",
      description: "Môžeš neskôr doplniť koniec menštruácie.",
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'initial' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                Menštruácia
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                Očakávaný začiatok: <strong>{format(predictedDate, 'd. M. yyyy', { locale: sk })}</strong>
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleStarted}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                size="lg"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Už začala
              </Button>
              
              <Button
                onClick={handleNotYet}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Ešte nezačala
              </Button>

              <Button
                onClick={handleUseCustomPicker}
                variant="outline"
                className="w-full border-rose-200 hover:bg-rose-50"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Zadať vlastný dátum
              </Button>
            </div>
          </>
        )}

        {step === 'select-start' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                Kedy začala menštruácia?
              </DialogTitle>
              <DialogDescription className="text-center">
                Vyber deň začiatku
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center gap-4 pt-2">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                locale={sk}
                className="pointer-events-auto"
                disabled={(date) => date > new Date()}
              />
              
              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => setStep('initial')}
                  variant="outline"
                  className="flex-1"
                >
                  Späť
                </Button>
                <Button
                  onClick={handleConfirmStart}
                  disabled={!startDate}
                  className="flex-1 bg-rose-500 hover:bg-rose-600"
                >
                  Pokračovať
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'select-end' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                Kedy skončila menštruácia?
              </DialogTitle>
              <DialogDescription className="text-center">
                Začiatok: {startDate && format(startDate, 'd. M. yyyy', { locale: sk })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center gap-4 pt-2">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                locale={sk}
                className="pointer-events-auto"
                disabled={(date) => !startDate || date < startDate || date > new Date()}
              />
              
              <div className="flex gap-2 w-full">
                <Button
                  onClick={handleSkipEnd}
                  variant="outline"
                  className="flex-1"
                >
                  Preskočiť
                </Button>
                <Button
                  onClick={handleConfirmEnd}
                  disabled={!endDate}
                  className="flex-1 bg-rose-500 hover:bg-rose-600"
                >
                  Uložiť
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
