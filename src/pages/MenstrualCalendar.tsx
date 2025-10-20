import { useAccessCode } from "@/hooks/useAccessCode";
import { MenstrualDashboardLayout } from "@/features/cycle/MenstrualDashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertCircle, Lock } from 'lucide-react';

const MenstrualCalendar = () => {
  const { accessCode, loading } = useAccessCode();
  const isMobile = useIsMobile();

  // Don't block rendering - let the component load while access code initializes
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Mobile layout with constraints */}
      {isMobile ? (
        <div className="w-full max-w-none px-2 py-4 sm:py-8 mx-auto">
          <div className="w-full mx-auto">
            {/* Subscription Warning Message */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg px-4 py-2 mb-4">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700 flex-1">
                  Chceš si svoje údaje uložiť? 
                  <a 
                    href="/checkout" 
                    className="ml-1 font-medium text-amber-800 underline hover:text-amber-900 transition-colors"
                  >
                    Vytvor si vlastný účet
                  </a>
                </p>
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
              </div>
            </div>
            
            <MenstrualDashboardLayout accessCode={accessCode} />
          </div>
        </div>
      ) : (
        /* Desktop layout - full screen */
        <div className="w-full h-screen">
          <MenstrualDashboardLayout accessCode={accessCode} />
        </div>
      )}
    </div>
  );
};

export default MenstrualCalendar;