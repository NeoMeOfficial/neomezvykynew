import { useState, useEffect } from 'react';
import HabitTracker from "@/components/HabitTracker";
import { AccessCodeWelcome } from "@/components/AccessCodeWelcome";
import { BiometricWelcome } from "@/components/BiometricWelcome";
import { BiometricPrompt } from "@/components/BiometricPrompt";
import { AccessCodeInput } from "@/components/AccessCodeInput";
import { AccessCodeSettings } from "@/components/AccessCodeSettings";
import { StorageHealthIndicator } from "@/components/StorageHealthIndicator";
import { Button } from "@/components/ui/button";
import { useAccessCode } from "@/hooks/useAccessCode";
import { persistentStorage } from "@/lib/persistentStorage";

const Index = () => {
  const { 
    accessCode, 
    loading, 
    reconnect,
    shouldOfferBiometric,
    isEnrolled,
    isMobile,
    authenticateWithBiometrics
  } = useAccessCode();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showAccessCodeSettings, setShowAccessCodeSettings] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFirstInteraction = () => {
    if (!hasInteracted && !accessCode) {
      setHasInteracted(true);
      setShowWelcome(true);
    }
  };

  const handleSettingsClick = () => {
    if (accessCode) {
      setShowAccessCodeSettings(true);
    } else {
      setShowWelcome(true);
    }
  };

  const handleEnterCodeClick = () => {
    setShowCodeInput(true);
  };

  const handleBiometricSuccess = (code: string) => {
    // Access code is already set by the authenticateWithBiometrics function
    console.log('Biometric authentication successful for code:', code);
  };

  const handleShowBiometricPrompt = () => {
    setShowBiometricPrompt(true);
  };

  const handleEnterExistingCode = () => {
    setShowWelcome(false);
    setShowCodeInput(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
          <div className="text-muted-foreground">
            {persistentStorage.isEmbedded() ? 'Connecting to your data...' : 'Načítavam...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <HabitTracker 
          onFirstInteraction={handleFirstInteraction} 
          onSettingsClick={handleSettingsClick}
          onEnterCodeClick={handleEnterCodeClick}
        />
        
        {!accessCode && (
          <div className="max-w-[600px] mx-auto mt-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-3">
                {isMobile && isEnrolled 
                  ? "Použite Face ID alebo zadajte váš prístupový kód."
                  : "Máte už prístupový kód? Zadajte ho pre prístup k vašim uloženým údajom."
                }
              </p>
              <div className="flex gap-2 justify-center">
                {isMobile && isEnrolled && (
                  <Button 
                    onClick={handleShowBiometricPrompt}
                    className="text-sm"
                  >
                    Prihlásiť sa
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleEnterCodeClick}
                  className="text-sm"
                >
                  Zadať existujúci kód
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {accessCode && (
          <div className="fixed bottom-4 right-4">
            <StorageHealthIndicator 
              accessCode={accessCode} 
              onReconnect={reconnect}
              showPersonalLink={true}
            />
          </div>
        )}
        
        <AccessCodeSettings 
          open={showAccessCodeSettings}
          onOpenChange={setShowAccessCodeSettings}
        />
        
        {shouldOfferBiometric() ? (
          <BiometricWelcome
            open={showWelcome}
            onOpenChange={setShowWelcome}
            onEnterExistingCode={handleEnterExistingCode}
          />
        ) : (
          <AccessCodeWelcome
            open={showWelcome}
            onOpenChange={setShowWelcome}
            onEnterExistingCode={handleEnterExistingCode}
          />
        )}
        
        <BiometricPrompt
          open={showBiometricPrompt}
          onOpenChange={setShowBiometricPrompt}
          onSuccess={handleBiometricSuccess}
          onFallbackToCode={handleEnterCodeClick}
        />
        
        <AccessCodeInput 
          open={showCodeInput} 
          onOpenChange={setShowCodeInput} 
        />
      </div>
    </div>
  );
};

export default Index;