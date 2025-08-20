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
  const { authenticateWithBiometric, clearBiometric, checkIframePermissions } = useBiometricAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string>('');
  const [showResetOption, setShowResetOption] = useState(false);

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
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      
      // Show user-friendly error message if available
      const errorMessage = error.userMessage || error.message || 'Face ID/Touch ID sa nepodarilo. Skúste znovu alebo použite kód.';
      setError(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleUseFallback = () => {
    onOpenChange(false);
    onFallbackToCode();
  };

  const handleResetFaceID = async () => {
    await clearBiometric();
    setError('');
    setShowResetOption(false);
    onOpenChange(false);
    onFallbackToCode();
  };

  // Check iframe permissions
  const iframePermissions = checkIframePermissions();

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
        
        {iframePermissions.inIframe && !iframePermissions.hasPermissions && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Pre správnu funkčnosť Face ID v iframe je potrebné pridať atribút: 
              <code className="bg-yellow-100 px-1 rounded text-xs ml-1">
                allow="publickey-credentials-get 'src'; publickey-credentials-create 'src'"
              </code>
            </p>
          </div>
        )}
        
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
                  {!showResetOption && (
                    <button 
                      onClick={() => setShowResetOption(true)}
                      className="text-xs text-destructive underline mt-2 hover:no-underline"
                    >
                      Problémy s Face ID? Resetovať nastavenia
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {showResetOption && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 mb-2">
                Resetovanie vymaže uložené Face ID údaje. Budete si ich musieť znovu nastaviť.
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleResetFaceID}
                  size="sm"
                  variant="destructive"
                >
                  Resetovať Face ID
                </Button>
                <Button 
                  onClick={() => setShowResetOption(false)}
                  size="sm"
                  variant="outline"
                >
                  Zrušiť
                </Button>
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