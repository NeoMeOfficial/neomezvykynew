import { useState, useEffect } from 'react';
import HabitTracker from "@/components/HabitTracker";
import { AccessCodeWelcome } from "@/components/AccessCodeWelcome";
import { AccessCodeInput } from "@/components/AccessCodeInput";
import { AccessCodeSettings } from "@/components/AccessCodeSettings";
import { StorageHealthIndicator } from "@/components/StorageHealthIndicator";
import { Button } from "@/components/ui/button";
import { useAccessCode } from "@/hooks/useAccessCode";

const Index = () => {
  const { accessCode, loading, reconnect } = useAccessCode();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showAccessCodeSettings, setShowAccessCodeSettings] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Načítavam...</div>
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
                Máte už prístupový kód? Zadajte ho pre prístup k vašim uloženým údajom.
              </p>
              <Button 
                variant="outline" 
                onClick={handleEnterCodeClick}
                className="text-sm"
              >
                Zadať existujúci kód
              </Button>
            </div>
          </div>
        )}
        
        {accessCode && (
          <div className="fixed bottom-4 right-4">
            <StorageHealthIndicator 
              accessCode={accessCode} 
              onReconnect={reconnect}
            />
          </div>
        )}
        
        <AccessCodeSettings 
          open={showAccessCodeSettings}
          onOpenChange={setShowAccessCodeSettings}
        />
        
        <AccessCodeWelcome 
          open={showWelcome} 
          onOpenChange={setShowWelcome} 
          onEnterExistingCode={handleEnterCodeClick}
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