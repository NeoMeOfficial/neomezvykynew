import { useAccessCode } from "@/hooks/useAccessCode";
import { lazy, Suspense } from "react";

// Lazy load the heavy cycle tracker component
const MenstrualCycleTracker = lazy(() => import("@/features/cycle/MenstrualCycleTracker"));

const MenstrualCalendar = () => {
  const { accessCode, loading } = useAccessCode();

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
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-400 mx-auto" />
                <div className="text-sm text-gray-500">Loading cycle tracker...</div>
              </div>
            </div>
          }>
            <MenstrualCycleTracker accessCode={accessCode} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MenstrualCalendar;