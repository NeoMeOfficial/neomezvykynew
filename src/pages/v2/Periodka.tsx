import { useCycleData } from '../../features/cycle/useCycleData';
import PeriodkaOnboarding from '../../components/v2/periodka/PeriodkaOnboarding';
import PeriodkaTracker from '../../components/v2/periodka/PeriodkaTracker';

export default function Periodka() {
  const { cycleData, loading } = useCycleData();

  if (loading) {
    return (
      <div className="w-full min-h-screen px-3 py-6 pb-28">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 text-center">
          <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#C27A6E] border-t-transparent animate-spin" />
          <p className="text-sm text-gray-600 mt-4">Načítavam...</p>
        </div>
      </div>
    );
  }

  if (!cycleData.lastPeriodStart) {
    return <PeriodkaOnboarding />;
  }

  return <PeriodkaTracker />;
}
