import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Shield, ArrowLeft } from 'lucide-react';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useAccessCode } from '@/hooks/useAccessCode';

interface PurchaseGatedBiometricWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validatedCode: string;
}

export const PurchaseGatedBiometricWelcome: React.FC<PurchaseGatedBiometricWelcomeProps> = ({
  open,
  onOpenChange,
  validatedCode,
}) => {
  const [step, setStep] = useState<'welcome' | 'biometric' | 'custom' | 'code'>('welcome');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState('');
  const [biometricError, setBiometricError] = useState('');

  const { setCustomAccessCode } = useAccessCode();
  const { 
    registerBiometric, 
    shouldOfferBiometric, 
    isEnrolled,
    isMobile 
  } = useBiometricAuth();

  const handleUseBiometric = () => {
    setStep('biometric');
    setError('');
    setBiometricError('');
  };

  const handleUseAccessCode = () => {
    setStep('custom');
    setError('');
  };

  const handleRegisterBiometric = async () => {
    try {
      setBiometricError('');
      
      if (!customCode.trim()) {
        setError('Zadajte vlastný prístupový kód');
        return;
      }

      // First set the custom code, then register biometric
      await setCustomAccessCode(customCode);
      
      const success = await registerBiometric(customCode);
      
      if (success) {
        setStep('code');
        setError('');
      } else {
        setBiometricError('Nepodarilo sa nastaviť biometrické overenie');
      }
    } catch (err) {
      console.error('Error registering biometric:', err);
      setBiometricError('Chyba pri nastavovaní biometrického overenia');
    }
  };

  const handleCreateAccessCodeOnly = async () => {
    try {
      setError('');
      
      if (!customCode.trim()) {
        setError('Zadajte vlastný prístupový kód');
        return;
      }

      await setCustomAccessCode(customCode);
      setStep('code');
    } catch (err) {
      console.error('Error creating access code:', err);
      setError('Chyba pri vytváraní prístupového kódu');
    }
  };

  const handleContinue = () => {
    onOpenChange(false);
    // Reset state for next time
    setStep('welcome');
    setCustomCode('');
    setError('');
    setBiometricError('');
  };

  const handleBack = () => {
    setStep('welcome');
    setError('');
    setBiometricError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'welcome' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Zabezpečte si svoje údaje</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Vytvorte si bezpečný spôsob prístupu k vašim údajom v budúcnosti.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {shouldOfferBiometric && (
                  <Button 
                    onClick={handleUseBiometric} 
                    className="w-full gap-2"
                    variant="default"
                  >
                    <Smartphone className="h-4 w-4" />
                    {isMobile ? 'Použiť Face ID / Touch ID' : 'Použiť biometrické overenie'}
                  </Button>
                )}

                <Button 
                  onClick={handleUseAccessCode} 
                  variant="outline" 
                  className="w-full"
                >
                  Vytvoriť vlastný prístupový kód
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'biometric' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Biometrické overenie
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  Vytvorte si vlastný kód a aktivujte biometrické prihlásenie pre budúce použitie.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="biometric-code">Vlastný prístupový kód</Label>
                <Input
                  id="biometric-code"
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="Zadajte vlastný kód..."
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {biometricError && (
                <Alert variant="destructive">
                  <AlertDescription>{biometricError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Button 
                  onClick={handleRegisterBiometric} 
                  className="w-full"
                  disabled={!customCode.trim()}
                >
                  Aktivovať biometrické prihlásenie
                </Button>
                
                <Button 
                  onClick={handleCreateAccessCodeOnly} 
                  variant="outline" 
                  className="w-full"
                  disabled={!customCode.trim()}
                >
                  Len vytvoriť kód (bez biometrie)
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'custom' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Vlastný prístupový kód
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Vytvorte si vlastný kód pre prístup k vašim údajom.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="custom-code">Prístupový kód</Label>
                <Input
                  id="custom-code"
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="Zadajte vlastný kód..."
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleCreateAccessCodeOnly} 
                className="w-full"
                disabled={!customCode.trim()}
              >
                Vytvoriť prístupový kód
              </Button>
            </div>
          </>
        )}

        {step === 'code' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Úspešne nastavené!</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Váš prístupový kód bol úspešne vytvorený a prepojený s vašim zakúpeným prístupom.
                </AlertDescription>
              </Alert>

              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Váš prístupový kód:</p>
                <p className="text-lg font-mono font-semibold tracking-wider">{customCode}</p>
              </div>

              {isEnrolled && (
                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    Biometrické overenie je aktívne. Pri ďalšom prihlásení môžete použiť Face ID alebo Touch ID.
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={handleContinue} className="w-full">
                Pokračovať
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};