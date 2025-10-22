import { useState, useEffect, lazy, Suspense } from 'react';
import { NavigationWidget } from "@/components/NavigationWidget";

// Lazy load heavy components that may not be immediately needed
const AccessCodeValidation = lazy(() => import("@/components/AccessCodeValidation").then(m => ({ default: m.AccessCodeValidation })));
const PurchaseGatedBiometricWelcome = lazy(() => import("@/components/PurchaseGatedBiometricWelcome").then(m => ({ default: m.PurchaseGatedBiometricWelcome })));
const BiometricPrompt = lazy(() => import("@/components/BiometricPrompt").then(m => ({ default: m.BiometricPrompt })));
const AccessCodeInput = lazy(() => import("@/components/AccessCodeInput").then(m => ({ default: m.AccessCodeInput })));
const AccessCodeSettings = lazy(() => import("@/components/AccessCodeSettings").then(m => ({ default: m.AccessCodeSettings })));
const SaveProgressDialog = lazy(() => import("@/components/SaveProgressDialog").then(m => ({ default: m.SaveProgressDialog })));
const TemporaryDataIndicator = lazy(() => import("@/components/TemporaryDataIndicator").then(m => ({ default: m.TemporaryDataIndicator })));

import { Button } from "@/components/ui/button";
import { Fingerprint, ArrowLeft } from "lucide-react";
import { useAccessCode } from "@/hooks/useAccessCode";
import { persistentStorage } from "@/lib/persistentStorage";
import { useCodeBasedHabits } from "@/hooks/useCodeBasedHabits";
import { useReflectionData } from "@/hooks/useReflectionData";
import { useTemporaryHabits } from "@/hooks/useTemporaryHabits";
import { useTemporaryReflections } from "@/hooks/useTemporaryReflections";
import { temporaryStorage } from "@/lib/temporaryStorage";

// Component loader for lazy components
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-400" />
  </div>
);

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
        {/* Navigation Widgets */}
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
        
        
        <Suspense fallback={<ComponentLoader />}>
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
        </Suspense>
      </div>
    </div>
  );
};

export default Index;