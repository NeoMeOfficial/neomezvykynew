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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Fingerprint, ArrowLeft, Calendar, NotebookPen } from "lucide-react";
import { useAccessCode } from "@/hooks/useAccessCode";
import { persistentStorage } from "@/lib/persistentStorage";
import MenstrualCycleTracker from "@/features/cycle/MenstrualCycleTracker";
import HabitCompletionCount from "@/components/HabitCompletionCount";
import { MonthlyCalendar } from "@/components/MonthlyCalendar";
import DiaryView from "@/components/DiaryView";
import { useCodeBasedHabits } from "@/hooks/useCodeBasedHabits";
import { useReflectionData } from "@/hooks/useReflectionData";

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
  const [monthlyCalendarDate, setMonthlyCalendarDate] = useState(new Date());
  const [showMonthlyCalendar, setShowMonthlyCalendar] = useState(false);
  const [showDiaryView, setShowDiaryView] = useState(false);

  const [hasInteracted, setHasInteracted] = useState(false);

  // Get habit and reflection data for the widgets
  const { habits, habitData, formatDate: habitFormatDate } = useCodeBasedHabits();
  const { reflections } = useReflectionData();

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
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-gradient)' }}>
      <div className="w-full max-w-none px-2 sm:px-4 py-4 sm:py-8 mx-auto">
        {/* Navigation Buttons */}
        <div className="w-full max-w-[600px] mx-auto mb-4 sm:mb-6">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => window.location.href = 'https://neome.mvt.so/mj-de'}
              className="flex items-center justify-center gap-2 rounded-3xl py-3 px-4 text-sm font-medium border-0 shadow-sm transition-colors"
              style={{ 
                backgroundColor: '#5F3E31',
                color: '#F6F6F1'
              }}
            >
              <ArrowLeft className="h-4 w-4" style={{ color: '#F6F6F1' }} />
              Naspäť
            </Button>
            <Button 
              onClick={handleEnterCodeClick}
              className="flex items-center justify-center gap-2 rounded-3xl py-3 px-4 text-sm font-medium border-2 transition-colors"
              style={{ 
                backgroundColor: '#F6F6F1',
                color: '#5F3E31',
                borderColor: '#5F3E31'
              }}
            >
              Prihlásenie
            </Button>
          </div>
        </div>

        {/* Menstrual Cycle Widget */}
        <div className="w-full max-w-[600px] mx-auto">
          <div className="glass-container">
            <h2 className="text-lg font-semibold text-foreground mb-4">Menštruačný cyklus</h2>
            <MenstrualCycleTracker
              accessCode={accessCode}
              onFirstInteraction={handleFirstInteraction}
            />
          </div>
        </div>
          
        {/* Habit Tracker Widget */}
        <div className="w-full max-w-[600px] mx-auto">
          <div className="glass-container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Moje návyky</h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  <HabitCompletionCount selectedDate={selectedDate} />
                </p>
                <Dialog open={showMonthlyCalendar} onOpenChange={setShowMonthlyCalendar}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm">
                      <Calendar size={20} className="text-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-container border-0 backdrop-blur-xl shadow-2xl">
                    <DialogHeader className="pb-4">
                      <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Calendar size={20} className="text-primary" />
                        </div>
                        Mesačný pohľad - Návyky
                      </DialogTitle>
                    </DialogHeader>
                    <div className="glass-surface rounded-2xl p-4">
                      <MonthlyCalendar
                        habitData={habitData}
                        selectedMonth={monthlyCalendarDate}
                        onMonthChange={setMonthlyCalendarDate}
                        habits={habits}
                        formatDate={habitFormatDate}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <HabitTracker 
              selectedDate={selectedDate} 
              onFirstInteraction={handleFirstInteraction}
            />
          </div>
        </div>
        
        {/* Reflection Widget */}
        <div className="w-full max-w-[600px] mx-auto">
          <div className="glass-container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Denná reflexia</h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Tvoj diár
                </p>
                <Dialog open={showDiaryView} onOpenChange={setShowDiaryView}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm">
                      <NotebookPen size={20} className="text-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader className="pb-0">
                      <DialogTitle className="text-lg font-heading">Môj denník reflexií</DialogTitle>
                    </DialogHeader>
                    <DiaryView
                      reflections={reflections}
                      formatDate={habitFormatDate}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <ReflectionWidget 
              selectedDate={selectedDate}
              onFirstInteraction={handleFirstInteraction}
            />
          </div>
        </div>
        
        {!accessCode && (
          <div className="w-full max-w-[600px] mx-auto mt-4">
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
                    <Button 
                      onClick={handleEnterCodeClick}
                      className="w-full"
                    >
                      Zadať prístupový kód
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Zadajte váš prístupový kód pre prístup k údajom
                    </p>
                  </>
                )}
              </div>
            </div>
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