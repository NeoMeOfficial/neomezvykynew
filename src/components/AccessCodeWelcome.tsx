import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useAccessCode } from '@/hooks/useAccessCode';

interface AccessCodeWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccessCodeWelcome = ({ open, onOpenChange }: AccessCodeWelcomeProps) => {
  const { setNewAccessCode } = useAccessCode();
  const [step, setStep] = useState<'welcome' | 'code'>('welcome');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleCreateCode = async () => {
    const code = await setNewAccessCode();
    setGeneratedCode(code);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {step === 'welcome' ? (
          <>
            <DialogHeader>
              <DialogTitle>Uloženie vašich údajov</DialogTitle>
              <DialogDescription>
                Chcete si uložiť svoje návyky a sledovať ich naprieč zariadeniami? 
                Vygenerujeme vám jedinečný kód, ktorý budete môcť použiť na akomkoľvek zariadení.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button onClick={handleCreateCode} className="w-full">
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