import { useAccessCode } from "@/hooks/useAccessCode";
import { MenstrualDashboardLayout } from "@/features/cycle/MenstrualDashboardLayout";
import { AlertCircle, Lock } from 'lucide-react';

const MenstrualCalendar = () => {
  const { accessCode, loading } = useAccessCode();

  // Don't block rendering - let the component load while access code initializes
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="w-full max-w-none px-2 sm:px-4 py-4 sm:py-8 mx-auto">
        <div className="w-full max-w-[600px] mx-auto">
          {/* Subscription Warning Message */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-base font-medium text-amber-800 mb-1">
                  Chceš si svoje údaje uložiť?
                </p>
                <p className="text-sm text-amber-700 mb-3">
                  Vytvor si vlastný účet
                </p>
                <a 
                  href="/checkout" 
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Vytvoriť účet
                </a>
              </div>
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            </div>
          </div>
          
          <MenstrualDashboardLayout accessCode={accessCode} />
        </div>
      </div>
    </div>
  );
};

export default MenstrualCalendar;