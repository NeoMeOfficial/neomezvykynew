import { useAccessCode } from "@/hooks/useAccessCode";
import { lazy, Suspense } from "react";

// Fast-loading progressive cycle tracker
const MenstrualCycleTrackerFast = lazy(() => import("@/features/cycle/MenstrualCycleTrackerFast"));

const MenstrualCalendar = () => {
  const { accessCode, loading } = useAccessCode();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-400 mx-auto" />
          <div className="text-sm text-gray-500">Loading cycle tracker...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="w-full max-w-none px-2 sm:px-4 py-4 sm:py-8 mx-auto">
        <div className="w-full max-w-[600px] mx-auto">
          <Suspense fallback={null}>
            <MenstrualCycleTrackerFast accessCode={accessCode} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MenstrualCalendar;