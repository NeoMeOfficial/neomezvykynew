import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, Smartphone, Shield } from 'lucide-react';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useAccessCode } from '@/hooks/useAccessCode';
import { supabase } from '@/integrations/supabase/client';

interface BiometricWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnterExistingCode?: () => void;
}

export const BiometricWelcome = ({ open, onOpenChange, onEnterExistingCode }: BiometricWelcomeProps) => {
  const { setCustomAccessCode, enterAccessCode } = useAccessCode();
  const { registerBiometric, shouldOfferBiometric } = useBiometricAuth();
  const [step, setStep] = useState<'welcome' | 'biometric' | 'custom' | 'code'>('welcome');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [customCode, setCustomCode] = useState<string>('');
  const [customCodeError, setCustomCodeError] = useState<string>('');
  const [biometricError, setBiometricError] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

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
      setGeneratedCode(finalCode);
      
      // Try to register biometric credential with the final code
      try {
        await registerBiometric(finalCode);
        setStep('code');
      } catch (biometricError: any) {
        // If biometric registration fails, we still have the code
        console.warn('Biometric registration failed, but code was created:', biometricError);
        
        // Show specific error message but continue with code
        if (biometricError.userMessage) {
          setBiometricError(`${biometricError.userMessage} Váš kód je však vytvorený.`);
        } else {
          setBiometricError('Face ID sa nepodarilo aktivovať, ale váš kód je vytvorený.');
        }
        
        setStep('code');
      }
    } catch (error: any) {
      console.error('Failed to create access code:', error);
      setCustomCodeError('Nepodarilo sa vytvoriť kód. Skúste to znovu.');
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

  const handleLinkExistingCode = async () => {
    if (!customCode.trim()) {
      setCustomCodeError('Prosím zadajte váš existujúci kód');
      return;
    }

    setIsValidating(true);
    setBiometricError('');
    setCustomCodeError('');

    try {
      // First validate the existing code using the Supabase function
      const { data, error } = await supabase.functions.invoke('validate-access-code', {
        body: { code: customCode.toUpperCase() }
      });

      console.log('BiometricWelcome: Validation result:', { data, error, code: customCode });

      if (error || !data?.valid) {
        setCustomCodeError(data?.message || 'Neplatný alebo už použitý kód');
        setIsValidating(false);
        return;
      }

      // Store the validated code
      await enterAccessCode(customCode);
      
      console.log('BiometricWelcome: Moving to biometric step with code:', customCode);
      
      // Move to biometric step for Face ID linking
      setStep('biometric');
    } catch (error: any) {
      console.error('Failed to validate access code:', error);
      setCustomCodeError('Nepodarilo sa overiť kód. Skúste to znovu.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleBack = () => {
    if (step === 'biometric' || step === 'custom') {
      setStep('welcome');
      setBiometricError('');
      setCustomCodeError('');
      setCustomCode('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'welcome' ? (
          <div className="space-y-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Zadajte váš existujúci kód
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Zadajte váš prístupový kód pre prístup k vašim údajom
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="existing-code" className="font-medium">
                  Váš prístupový kód
                </Label>
                <Input
                  id="existing-code"
                  value={customCode}
                  onChange={(e) => {
                    setCustomCode(e.target.value.toUpperCase());
                    setCustomCodeError('');
                    setBiometricError('');
                  }}
                  placeholder="VÁŠKÓD"
                  className="font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLinkExistingCode();
                    }
                  }}
                />
                {(customCodeError || biometricError) && (
                  <p className="text-sm text-destructive mt-1">{customCodeError || biometricError}</p>
                )}
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleLinkExistingCode} 
                  className="w-full"
                  disabled={!customCode.trim() || isValidating}
                >
                  {isValidating ? 'Overuje sa...' : 'Pokračovať'}
                </Button>
                
                <Button 
                  onClick={handleUseAccessCode}
                  variant="outline"
                  className="w-full"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Vytvoriť nový prístupový kód
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
          </div>
        ) : step === 'biometric' ? (
          <div className="space-y-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Prepojenie s Face ID
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Váš kód je platný! Chcete ho prepojiť s Face ID?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="font-mono text-xl font-bold tracking-wider">
                  {customCode}
                </div>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg border border-accent">
                <div className="flex items-start gap-3">
                  <Fingerprint className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">Face ID/Touch ID</h4>
                    <p className="text-sm text-muted-foreground">
                      Aktivujte biometrické prihlásenie pre rýchly prístup v budúcnosti
                    </p>
                  </div>
                </div>
              </div>

              {biometricError && (
                <p className="text-sm text-destructive mt-1">{biometricError}</p>
              )}

              <div className="flex gap-2">
                {shouldOfferBiometric() && (
                  <Button 
                    onClick={async () => {
                      setIsRegistering(true);
                      setBiometricError('');
                      try {
                        await registerBiometric(customCode);
                        setGeneratedCode(customCode);
                        setStep('code');
                      } catch (error: any) {
                        setBiometricError(error.userMessage || 'Face ID sa nepodarilo aktivovať');
                        setGeneratedCode(customCode);
                        setStep('code');
                      } finally {
                        setIsRegistering(false);
                      }
                    }} 
                    className="flex-1"
                    disabled={isRegistering}
                  >
                    <Fingerprint className="mr-2 h-4 w-4" />
                    {isRegistering ? 'Nastavuje sa...' : 'Aktivovať Face ID'}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setGeneratedCode(customCode);
                    setStep('code');
                  }} 
                  className="flex-1"
                >
                  Pokračovať bez Face ID
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full text-muted-foreground hover:bg-accent"
              >
                Späť
              </Button>
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
                  {generatedCode || customCode}
                </div>
              </div>
              
              <div className="bg-accent/50 p-4 rounded-lg border border-accent">
                <p className="text-sm text-muted-foreground font-medium text-center">
                  {biometricError ? (
                    <>⚠️ {biometricError}</>
                  ) : (
                    <>💡 Na tomto zariadení sa môžete prihlasovať pomocou Face ID/Touch ID. 
                    Kód použite na iných zariadeniach.</>
                  )}
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