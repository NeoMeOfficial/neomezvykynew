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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <MenstrualCycleTracker accessCode={accessCode} />
      </div>
    </div>
  );
};

export default MenstrualCalendar;