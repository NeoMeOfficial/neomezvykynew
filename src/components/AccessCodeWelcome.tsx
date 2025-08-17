import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccessCode } from '@/hooks/useAccessCode';

interface AccessCodeWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccessCodeWelcome = ({ open, onOpenChange }: AccessCodeWelcomeProps) => {
  const { setCustomAccessCode } = useAccessCode();
  const [step, setStep] = useState<'welcome' | 'custom' | 'code'>('welcome');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [customCode, setCustomCode] = useState<string>('');
  const [customCodeError, setCustomCodeError] = useState<string>('');

  const handleWantCode = () => {
    setStep('custom');
  };

  const handleCreateCustomCode = () => {
    if (!customCode.trim()) {
      setCustomCodeError('Prosím zadajte váš kód');
      return;
    }

    if (customCode.trim().length < 4) {
      setCustomCodeError('Kód musí mať aspoň 4 znaky');
      return;
    }

    const finalCode = setCustomAccessCode(customCode);
    setGeneratedCode(finalCode);
    setStep('code');
  };

  const handleContinue = () => {
    onOpenChange(false);
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  const handleBack = () => {
    if (step === 'custom') {
      setStep('welcome');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto md:top-[50%] top-[45%]">
        {step === 'welcome' ? (
          <>
            <DialogHeader>
              <DialogTitle>Uloženie vašich údajov</DialogTitle>
              <DialogDescription>
                Vaše údaje sa ukladajú iba lokálne. Vytvorte si kód pre synchronizáciu naprieč zariadeniami.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button onClick={handleWantCode} className="w-full">
                Áno, chcem si uložiť údaje
              </Button>
              <Button variant="outline" onClick={handleSkip} className="w-full">
                Nie, zatial nie
              </Button>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mt-4 border border-blue-200">
              <p className="text-xs text-blue-800 font-medium text-center">
                💡 Neuchovávame žiadne osobné údaje. Iba váš kód a údaje o návykoch.
              </p>
            </div>
          </>
        ) : step === 'custom' ? (
          <>
            <DialogHeader>
              <DialogTitle>Vytvorenie prístupového kódu</DialogTitle>
              <DialogDescription>
                Vytvorte si vlastný prístupový kód (minimálne 4 znaky). Automaticky sa pridá jedinečný identifikátor.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="custom-code" className="font-medium">
                  Váš vlastný kód <span className="text-primary font-bold">(minimálne 4 znaky)</span>
                </Label>
                <Input
                  id="custom-code"
                  value={customCode}
                  onChange={(e) => {
                    setCustomCode(e.target.value.toUpperCase());
                    setCustomCodeError('');
                  }}
                  placeholder="MOJKOD (min. 4 znaky)"
                  className="font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateCustomCode();
                    }
                  }}
                />
                {customCodeError && (
                  <p className="text-sm text-destructive mt-1">{customCodeError}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCustomCode} className="flex-1">
                  Vytvoriť kód
                </Button>
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Späť
                </Button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg mt-4 border border-primary/20">
              <p className="text-sm text-foreground font-medium text-center">
                💡 <span className="font-bold text-primary">Minimálne 4 znaky</span> - Zadajte ľubovoľný kód. Automaticky sa pridá jedinečný identifikátor na zabránenie zmiešania údajov.
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Váš prístupový kód</DialogTitle>
              <DialogDescription>
                Uložte si tento kód bezpečne. Budete ho potrebovať na prístup k svojim údajom na iných zariadeniach.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="font-mono text-xl font-bold tracking-wider">
                  {generatedCode}
                </div>
              </div>
              <Button onClick={handleContinue} className="w-full mt-3">
                Pokračovať
              </Button>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-200">
              <p className="text-sm text-blue-800 font-medium text-center">
                 💡 Váš kód si môžete kedykoľvek zobraziť v nastaveniach aplikácie
               </p>
             </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};