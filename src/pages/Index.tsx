import { useState, useEffect } from 'react';
import { AccessCodeValidation } from "@/components/AccessCodeValidation";
import { PurchaseGatedBiometricWelcome } from "@/components/PurchaseGatedBiometricWelcome";
import { BiometricPrompt } from "@/components/BiometricPrompt";
import { AccessCodeInput } from "@/components/AccessCodeInput";
import { AccessCodeSettings } from "@/components/AccessCodeSettings";
import { StorageHealthIndicator } from "@/components/StorageHealthIndicator";
import { NavigationWidget } from "@/components/NavigationWidget";

import { Button } from "@/components/ui/button";
import { Fingerprint, ArrowLeft } from "lucide-react";
import { useAccessCode } from "@/hooks/useAccessCode";
import { persistentStorage } from "@/lib/persistentStorage";
import { useCodeBasedHabits } from "@/hooks/useCodeBasedHabits";
import { useReflectionData } from "@/hooks/useReflectionData";
import { useTemporaryHabits } from "@/hooks/useTemporaryHabits";
import { useTemporaryReflections } from "@/hooks/useTemporaryReflections";
import { SaveProgressDialog } from "@/components/SaveProgressDialog";
import { TemporaryDataIndicator } from "@/components/TemporaryDataIndicator";
import { temporaryStorage } from "@/lib/temporaryStorage";

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
  const [showAccessCodeValidation, setShowAccessCodeValidation] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [validatedAccessCode, setValidatedAccessCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showAccessCodeSettings, setShowAccessCodeSettings] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyCalendarDate, setMonthlyCalendarDate] = useState(new Date());
  const [showMonthlyCalendar, setShowMonthlyCalendar] = useState(false);
  const [showDiaryView, setShowDiaryView] = useState(false);
  const [showSaveProgressDialog, setShowSaveProgressDialog] = useState(false);

  const [hasInteracted, setHasInteracted] = useState(false);

  // Get habit and reflection data for the widgets
  // Use temporary data hooks when no access code is available
  const realHabitsData = useCodeBasedHabits();
  const realReflectionData = useReflectionData();
  const tempHabitsData = useTemporaryHabits();
  const tempReflectionData = useTemporaryReflections();
  
  // Choose data source based on access code availability
  const habitsData = accessCode ? realHabitsData : tempHabitsData;
  const reflectionData = accessCode ? realReflectionData : tempReflectionData;
  
  const { habits, habitData, formatDate: habitFormatDate } = habitsData;
  const { reflections } = reflectionData;

  // Debug logging
  console.log('Index state:', { accessCode: !!accessCode, isMobile, isEnrolled, loading });

  const handleFirstInteraction = () => {
    if (!hasInteracted && !accessCode) {
      setHasInteracted(true);
      // Don't show welcome immediately - let users explore first
    }
  };

  const handleSettingsClick = () => {
    if (accessCode) {
      setShowAccessCodeSettings(true);
    } else {
      setShowAccessCodeValidation(true);
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

  const handleValidAccessCode = (code: string) => {
    setValidatedAccessCode(code);
    setShowAccessCodeValidation(false);
    setShowBiometricSetup(true);
  };

  const handleEnterExistingCode = () => {
    setShowAccessCodeValidation(false);
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
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="w-full max-w-none px-2 sm:px-4 py-4 sm:py-8 mx-auto">
        {/* Navigation Buttons */}
        <div className="w-full max-w-[600px] mx-auto mb-4 sm:mb-6">
          <div className="grid gap-3" style={{ gridTemplateColumns: '30% 70%' }}>
            <Button 
              onClick={() => {
                // Check if user has temporary data and prompt to save
                if (!accessCode && temporaryStorage.hasTemporaryData()) {
                  setShowSaveProgressDialog(true);
                } else {
                  window.location.href = 'https://neome.mvt.so/mj-de';
                }
              }}
              style={{ backgroundColor: '#f0ede4', borderColor: '#d4c9b8' }}
              className="flex items-center justify-center gap-2 rounded-3xl py-3 px-3 text-mobile-sm md:text-sm font-medium border-1 backdrop-blur-md transition-all hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Naspäť
            </Button>
            <Button 
              onClick={() => setShowAccessCodeValidation(true)}
              style={{ backgroundColor: '#5F3E31' }}
              className="!text-white hover:opacity-90 flex items-center justify-center gap-2 rounded-3xl py-3 px-4 text-mobile-sm md:text-sm font-medium border-0 transition-all shadow-lg"
            >
              <Fingerprint className="h-4 w-4" />
              Uložiť si svoje informácie
            </Button>
          </div>
        </div>

        {/* Temporary Data Indicator */}
        {!accessCode && temporaryStorage.isSessionActive() && (
          <div className="w-full max-w-[600px] mx-auto mb-4">
            <TemporaryDataIndicator onShowAccessCodeValidation={() => setShowAccessCodeValidation(true)} />
          </div>
        )}


        {/* Navigation Widget with Collapsible Sections */}
        <NavigationWidget
          accessCode={accessCode}
          selectedDate={selectedDate}
          onFirstInteraction={handleFirstInteraction}
          habitData={habitData}
          habits={habits}
          formatDate={habitFormatDate}
          reflections={reflections as Record<string, any>}
          monthlyCalendarDate={monthlyCalendarDate}
          setMonthlyCalendarDate={setMonthlyCalendarDate}
          showMonthlyCalendar={showMonthlyCalendar}
          setShowMonthlyCalendar={setShowMonthlyCalendar}
          showDiaryView={showDiaryView}
          setShowDiaryView={setShowDiaryView}
        />
        
        {!accessCode && !shouldOfferBiometric() && (
          <div className="w-full max-w-[600px] mx-auto mt-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg border border-border/50">
              <div className="space-y-3">
                <Button 
                  onClick={handleEnterCodeClick}
                  className="w-full"
                >
                  Zadať prístupový kód
                </Button>
                <p className="text-mobile-sm md:text-sm text-muted-foreground">
                  Zadajte váš prístupový kód pre prístup k údajom
                </p>
              </div>
            </div>
          </div>
        )}
        
        
        <AccessCodeSettings 
          open={showAccessCodeSettings}
          onOpenChange={setShowAccessCodeSettings}
        />
        
        <AccessCodeValidation
          open={showAccessCodeValidation}
          onOpenChange={setShowAccessCodeValidation}
          onValidCode={handleValidAccessCode}
        />
        
        <PurchaseGatedBiometricWelcome
          open={showBiometricSetup}
          onOpenChange={setShowBiometricSetup}
          validatedCode={validatedAccessCode}
        />
        
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

        <SaveProgressDialog
          isOpen={showSaveProgressDialog}
          onSave={() => {
            setShowSaveProgressDialog(false);
            setShowAccessCodeValidation(true);
          }}
          onDiscard={() => {
            temporaryStorage.clearAll();
            setShowSaveProgressDialog(false);
            window.location.href = 'https://neome.mvt.so/mj-de';
          }}
          onCancel={() => {
            setShowSaveProgressDialog(false);
          }}
        />
      </div>
    </div>
  );
};

export default Index;