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

  const handleCreateCustomCode = async () => {
    if (!customCode.trim()) {
      setCustomCodeError('Prosím zadajte váš kód');
      return;
    }

    if (customCode.trim().length < 4) {
      setCustomCodeError('Kód musí mať aspoň 4 znaky');
      return;
    }

    try {
      const finalCode = await setCustomAccessCode(customCode);
      setGeneratedCode(finalCode);
      setStep('code');
    } catch (error) {
      setCustomCodeError('Nepodarilo sa vytvoriť kód');
    }
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
      <DialogContent className="sm:max-w-md">
        {step === 'welcome' ? (
          <div className="space-y-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Zadaj kód a nestratíš svoje návyky
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Stačí, ak klikneš na 'Vytvoriť kód' a my ti tvoje návyky uložíme anonymne
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900">Prečo potrebuješ kód:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Zachováš si súkromie a anonymitu</li>
                    <li>• Budeš si môcť prechádzať svoje návyky</li>
                  </ul>
                  <p className="text-sm text-blue-800 font-medium">
                    💡 Neuchovávame žiadne osobné údaje. Iba tvoj kód a údaje o tvojich návykoch!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleWantCode} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Vytvoriť kód
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSkip} 
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Zrušiť
              </Button>
            </div>
          </div>
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