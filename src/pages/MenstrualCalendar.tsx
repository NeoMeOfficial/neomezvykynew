import { useAccessCode } from "@/hooks/useAccessCode";
import MenstrualCycleTracker from "@/features/cycle/MenstrualCycleTracker";

const MenstrualCalendar = () => {
  const { accessCode, loading } = useAccessCode();

  // Don't block rendering - let the component load while access code initializes
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