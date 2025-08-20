import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Fingerprint, AlertCircle } from 'lucide-react';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';

interface BiometricPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (accessCode: string) => void;
  onFallbackToCode: () => void;
}

export const BiometricPrompt = ({ 
  open, 
  onOpenChange, 
  onSuccess, 
  onFallbackToCode 
}: BiometricPromptProps) => {
  const { authenticateWithBiometric } = useBiometricAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string>('');

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    setError('');

    try {
      const accessCode = await authenticateWithBiometric();
      if (accessCode) {
        onSuccess(accessCode);
        onOpenChange(false);
      } else {
        setError('Prihlásenie sa nepodarilo');
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      setError('Face ID/Touch ID sa nepodarilo. Skúste znovu alebo použite kód.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleUseFallback = () => {
    onOpenChange(false);
    onFallbackToCode();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Prihlásenie
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Použite Face ID alebo Touch ID na prihlásenie do aplikácie
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-accent/50 p-6 rounded-lg border border-accent text-center">
            <Fingerprint className="h-12 w-12 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Stlačte tlačidlo nižšie a potvrďte svoju identitu
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleBiometricAuth}
              disabled={isAuthenticating}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Fingerprint className="mr-2 h-4 w-4" />
              {isAuthenticating ? 'Overuje sa...' : 'Použiť Face ID / Touch ID'}
            </Button>
            
            <Button 
              onClick={handleUseFallback}
              variant="outline"
              className="w-full"
            >
              Použiť prístupový kód
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="w-full text-muted-foreground hover:bg-accent"
            >
              Zrušiť
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};