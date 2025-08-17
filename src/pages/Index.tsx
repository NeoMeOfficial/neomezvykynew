import { useState, useEffect } from 'react';
import HabitTracker from "@/components/HabitTracker";
import { AccessCodeWelcome } from "@/components/AccessCodeWelcome";
import { AccessCodeInput } from "@/components/AccessCodeInput";
import { AccessCodeSettings } from "@/components/AccessCodeSettings";
import { Button } from "@/components/ui/button";
import { useAccessCode } from "@/hooks/useAccessCode";

const Index = () => {
  const { accessCode, loading } = useAccessCode();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  useEffect(() => {
    if (!loading && !accessCode) {
      // Show welcome dialog after a short delay for new users
      setTimeout(() => setShowWelcome(true), 1000);
    }
  }, [loading, accessCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Načítavam...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Habit Tracker</h1>
          <p className="text-slate-300">Track your daily habits and build consistency</p>
          
          {!accessCode && (
            <div className="mt-4 space-y-2">
              <p className="text-yellow-300 text-sm">
                Vaše údaje sa ukladajú iba lokálne. Vytvorte si kód pre synchronizáciu naprieč zariadeniami.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => setShowWelcome(true)}>
                  Vytvoriť kód
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowCodeInput(true)}>
                  Mám už kód
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <HabitTracker />
        
        <AccessCodeSettings />
        
        <AccessCodeWelcome 
          open={showWelcome} 
          onOpenChange={setShowWelcome} 
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