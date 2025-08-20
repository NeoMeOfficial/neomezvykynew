import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, Smartphone, Shield } from 'lucide-react';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useAccessCode } from '@/hooks/useAccessCode';

interface BiometricWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnterExistingCode?: () => void;
}

export const BiometricWelcome = ({ open, onOpenChange, onEnterExistingCode }: BiometricWelcomeProps) => {
  const { setCustomAccessCode } = useAccessCode();
  const { registerBiometric, shouldOfferBiometric } = useBiometricAuth();
  const [step, setStep] = useState<'welcome' | 'biometric' | 'custom' | 'code'>('welcome');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [customCode, setCustomCode] = useState<string>('');
  const [customCodeError, setCustomCodeError] = useState<string>('');
  const [biometricError, setBiometricError] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleUseBiometric = () => {
    setStep('biometric');
  };

  const handleUseAccessCode = () => {
    setStep('custom');
  };

  const handleRegisterBiometric = async () => {
    if (!customCode.trim()) {
      setCustomCodeError('Prosím zadajte váš kód');
      return;
    }

    if (customCode.trim().length < 4) {
      setCustomCodeError('Kód musí mať aspoň 4 znaky');
      return;
    }

    setIsRegistering(true);
    setBiometricError('');

    try {
      // First create the access code
      const finalCode = await setCustomAccessCode(customCode);
      
      // Then register biometric credential with the final code
      await registerBiometric(finalCode);
      
      setGeneratedCode(finalCode);
      setStep('code');
    } catch (error) {
      console.error('Failed to register biometric:', error);
      setBiometricError('Nepodarilo sa nastaviť Face ID. Skúste to znovu.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCreateAccessCodeOnly = async () => {
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

  const handleBack = () => {
    if (step === 'biometric' || step === 'custom') {
      setStep('welcome');
      setBiometricError('');
      setCustomCodeError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'welcome' ? (
          <div className="space-y-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Zadaj kód a nestratíš svoje návyky
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Vyberte si spôsob ako si uložiť svoje návyky
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-accent/50 p-4 rounded-lg border border-accent">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-xs font-bold">i</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Prečo potrebujete prihlásenie:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Zachováte si súkromie a anonymitu</li>
                    <li>• Budete si môcť prechádzať svoje návyky</li>
                  </ul>
                  <p className="text-sm text-muted-foreground font-medium">
                    💡 Neuchovávame žiadne osobné údaje!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {shouldOfferBiometric() && (
                <Button 
                  onClick={handleUseBiometric} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Použiť Face ID / Touch ID
                </Button>
              )}
              
              <Button 
                onClick={handleUseAccessCode}
                variant={shouldOfferBiometric() ? "outline" : "default"}
                className="w-full"
              >
                <Shield className="mr-2 h-4 w-4" />
                Vytvoriť prístupový kód
              </Button>
              
              {onEnterExistingCode && (
                <Button 
                  onClick={onEnterExistingCode}
                  variant="outline"
                  className="w-full"
                >
                  Mám už kód
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)} 
                className="w-full text-muted-foreground hover:bg-accent"
              >
                Zrušiť
              </Button>
            </div>
          </div>
        ) : step === 'biometric' ? (
          <div className="space-y-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Nastavenie Face ID
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Vytvorte si prístupový kód a aktivujte Face ID pre rýchle prihlásenie
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="biometric-code" className="font-medium">
                  Váš vlastný kód <span className="text-primary font-bold">(minimálne 4 znaky)</span>
                </Label>
                <Input
                  id="biometric-code"
                  value={customCode}
                  onChange={(e) => {
                    setCustomCode(e.target.value.toUpperCase());
                    setCustomCodeError('');
                    setBiometricError('');
                  }}
                  placeholder="MOJKOD (min. 4 znaky)"
                  className="font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRegisterBiometric();
                    }
                  }}
                />
                {(customCodeError || biometricError) && (
                  <p className="text-sm text-destructive mt-1">{customCodeError || biometricError}</p>
                )}
              </div>

              <div className="bg-accent/50 p-4 rounded-lg border border-accent">
                <div className="flex items-start gap-3">
                  <Fingerprint className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">Face ID/Touch ID</h4>
                    <p className="text-sm text-muted-foreground">
                      Po zadaní kódu sa aktivuje biometrické prihlásenie pre vaše zariadenie
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleRegisterBiometric} 
                  className="flex-1"
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Nastavuje sa...' : 'Aktivovať Face ID'}
                </Button>
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Späť
                </Button>
              </div>
            </div>
          </div>
        ) : step === 'custom' ? (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Vytvorenie prístupového kódu</DialogTitle>
              <DialogDescription>
                Vytvorte si vlastný prístupový kód (minimálne 4 znaky)
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
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
                      handleCreateAccessCodeOnly();
                    }
                  }}
                />
                {customCodeError && (
                  <p className="text-sm text-destructive mt-1">{customCodeError}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateAccessCodeOnly} className="flex-1">
                  Vytvoriť kód
                </Button>
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Späť
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Úspešne nastavené!</DialogTitle>
              <DialogDescription>
                Váš prístupový kód a prihlásenie sú pripravené
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="font-mono text-xl font-bold tracking-wider">
                  {generatedCode}
                </div>
              </div>
              
              <div className="bg-accent/50 p-4 rounded-lg border border-accent">
                <p className="text-sm text-muted-foreground font-medium text-center">
                  💡 Na tomto zariadení sa môžete prihlasovať pomocou Face ID/Touch ID. 
                  Kód použite na iných zariadeniach.
                </p>
              </div>
              
              <Button onClick={handleContinue} className="w-full">
                Pokračovať
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};