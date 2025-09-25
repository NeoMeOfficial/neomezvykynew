import { useAccessCode } from "@/hooks/useAccessCode";
import { lazy, Suspense, useState } from "react";
import React from "react";

// Use ultra-fast lightweight version for instant loading
const MenstrualCycleTrackerFast = lazy(() => import("@/features/cycle/MenstrualCycleTrackerFast"));
// Load full version in background
const MenstrualCycleTracker = lazy(() => import("@/features/cycle/MenstrualCycleTracker"));

const MenstrualCalendar = () => {
  const { accessCode, loading } = useAccessCode();
  const [showFullVersion, setShowFullVersion] = useState(false);

  // Auto-switch to full version after 2 seconds for progressive loading
  React.useEffect(() => {
    const timer = setTimeout(() => setShowFullVersion(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="w-full max-w-none px-2 sm:px-4 py-4 sm:py-8 mx-auto">
        <div className="w-full max-w-[600px] mx-auto">
          {!showFullVersion ? (
            // Show lightweight version immediately
            <Suspense fallback={
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-400" />
              </div>
            }>
              <MenstrualCycleTrackerFast />
            </Suspense>
          ) : (
            // Load full version after delay
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-400 mx-auto" />
                  <div className="text-sm text-gray-500">Načítavam kompletný kalendár...</div>
                </div>
              </div>
            }>
              <MenstrualCycleTracker accessCode={accessCode} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenstrualCalendar;