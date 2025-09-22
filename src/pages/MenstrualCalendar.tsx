import { useAccessCode } from "@/hooks/useAccessCode";
import MenstrualCycleTracker from "@/features/cycle/MenstrualCycleTracker";

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
          <MenstrualCycleTracker accessCode={accessCode} />
        </div>
      </div>
    </div>
  );
};

export default MenstrualCalendar;