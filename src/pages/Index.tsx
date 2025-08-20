import { useState, useEffect } from 'react';
import HabitTracker from "@/components/HabitTracker";
import ReflectionWidget from "@/components/ReflectionWidget";
import { AccessCodeWelcome } from "@/components/AccessCodeWelcome";
import { BiometricWelcome } from "@/components/BiometricWelcome";
import { BiometricPrompt } from "@/components/BiometricPrompt";
import { AccessCodeInput } from "@/components/AccessCodeInput";
import { AccessCodeSettings } from "@/components/AccessCodeSettings";
import { StorageHealthIndicator } from "@/components/StorageHealthIndicator";
import { DateNavigationHeader } from "@/components/DateNavigationHeader";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
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
    authenticateWithBiometrics,
    enterAccessCode
  } = useAccessCode();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showAccessCodeSettings, setShowAccessCodeSettings] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [hasInteracted, setHasInteracted] = useState(false);

  // Debug logging
  console.log('Index state:', { accessCode: !!accessCode, isMobile, isEnrolled, loading });

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

  const handleBiometricSuccess = async (code: string) => {
    try {
      console.log('Biometric authentication successful for code:', code);
      await enterAccessCode(code);
      setShowBiometricPrompt(false);
    } catch (error) {
      console.error('Failed to enter access code from biometric auth:', error);
    }
  };

  const handleShowBiometricPrompt = () => {
    setShowBiometricPrompt(true);
  };

  const handleEnterExistingCode = () => {
    setShowWelcome(false);
    setShowCodeInput(true);
  };

  const handleDateChange = (dateString: string) => {
    const newDate = new Date(dateString + 'T00:00:00');
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentDateString = formatDate(selectedDate);

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
        {/* Unified Date Navigation */}
        <div className="max-w-[600px] mx-auto mb-6">
          <DateNavigationHeader
            currentDate={currentDateString}
            onDateChange={handleDateChange}
            hasAccessCode={!!accessCode}
            onSettingsClick={handleSettingsClick}
          />
        </div>

        {/* Habit Tracker Widget */}
        <HabitTracker 
          selectedDate={selectedDate}
          onFirstInteraction={handleFirstInteraction} 
        />
        
        {/* Reflection Widget */}
        <ReflectionWidget 
          selectedDate={selectedDate}
          onFirstInteraction={handleFirstInteraction}
        />
        
        {!accessCode && (
          <div className="max-w-[600px] mx-auto mt-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg border border-border/50">
              <div className="space-y-3">
                {shouldOfferBiometric() ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Použite Face ID pre rýchle prihlásenie
                    </p>
                    <Button 
                      onClick={handleShowBiometricPrompt}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Prihlásiť sa s Face ID/Touch ID
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleEnterCodeClick}
                      className="w-full"
                    >
                      Použiť prístupový kód
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Zadajte váš prístupový kód pre prístup k údajom
                    </p>
                    <Button 
                      onClick={handleEnterCodeClick}
                      className="w-full"
                    >
                      Zadať prístupový kód
                    </Button>
                  </>
                )}
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