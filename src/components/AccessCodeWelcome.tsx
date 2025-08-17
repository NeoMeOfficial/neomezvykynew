import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import { useAccessCode } from '@/hooks/useAccessCode';

interface AccessCodeWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccessCodeWelcome = ({ open, onOpenChange }: AccessCodeWelcomeProps) => {
  const { setNewAccessCode, setCustomAccessCode } = useAccessCode();
  const [step, setStep] = useState<'welcome' | 'options' | 'custom' | 'code'>('welcome');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [customCode, setCustomCode] = useState<string>('');
  const [customCodeError, setCustomCodeError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleWantCode = () => {
    setStep('options');
  };

  const handleGenerateCode = async () => {
    const code = await setNewAccessCode();
    setGeneratedCode(code);
    setStep('code');
  };

  const handleCustomCodeOption = () => {
    setStep('custom');
  };

  const handleCreateCustomCode = () => {
    if (!customCode.trim()) {
      setCustomCodeError('Prosím zadajte váš kód');
      return;
    }

    // Basic format validation
    const codePattern = /^[A-Z]+-[A-Z]+-\d{4}$/;
    if (!codePattern.test(customCode.toUpperCase().trim())) {
      setCustomCodeError('Kód musí byť vo formáte SLOVO-SLOVO-ČÍSLA (napr. APPLE-BEACH-1234)');
      return;
    }

    const finalCode = setCustomAccessCode(customCode);
    setGeneratedCode(finalCode);
    setStep('code');
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    onOpenChange(false);
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  const handleBack = () => {
    if (step === 'custom' || step === 'options') {
      setStep(step === 'custom' ? 'options' : 'welcome');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
            <p className="text-xs text-muted-foreground mt-2">
              Neuchovávame žiadne osobné údaje. Iba váš kód a údaje o návykoch.
            </p>
          </>
        ) : step === 'options' ? (
          <>
            <DialogHeader>
              <DialogTitle>Vytvorenie prístupového kódu</DialogTitle>
              <DialogDescription>
                Vyberte si, ako chcete vytvoriť váš prístupový kód.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button onClick={handleGenerateCode} className="w-full">
                Vygenerovať automaticky
              </Button>
              <Button variant="outline" onClick={handleCustomCodeOption} className="w-full">
                Vytvoriť vlastný kód
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" onClick={handleBack} className="flex-1">
                Späť
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Automaticky generovaný kód je bezpečnejší, ale vlastný kód si môžete ľahšie zapamätať.
            </p>
          </>
        ) : step === 'custom' ? (
          <>
            <DialogHeader>
              <DialogTitle>Vytvorenie vlastného kódu</DialogTitle>
              <DialogDescription>
                Vytvorte si vlastný prístupový kód vo formáte SLOVO-SLOVO-ČÍSLA.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="custom-code">Váš vlastný kód</Label>
                <Input
                  id="custom-code"
                  value={customCode}
                  onChange={(e) => {
                    setCustomCode(e.target.value.toUpperCase());
                    setCustomCodeError('');
                  }}
                  placeholder="EXAMPLE-WORD-1234"
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
            <p className="text-xs text-muted-foreground mt-2">
              Kód musí byť vo formáte SLOVO-SLOVO-ČÍSLA, napríklad EXAMPLE-WORD-1234
            </p>
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
              <Button 
                variant="outline" 
                onClick={handleCopyCode}
                className="w-full mt-3"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Skopírované!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Kopírovať kód
                  </>
                )}
              </Button>
              <Button onClick={handleContinue} className="w-full mt-2">
                Pokračovať
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Kód si môžete kedykoľvek zobraziť v nastaveniach aplikácie.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};