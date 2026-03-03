import { useCycleData } from '../../features/cycle/useCycleData';
import PeriodkaOnboarding from '../../components/v2/periodka/PeriodkaOnboarding';
import PeriodkaTracker from '../../components/v2/periodka/PeriodkaTracker';
import { colors, glassCard } from '../../theme/warmDusk';

export default function Periodka() {
  const { cycleData, loading } = useCycleData();

  if (loading) {
    return (
      <div className="w-full min-h-screen px-3 py-6 pb-28" style={{ background: colors.bgGradient }}>
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-white/20 text-center">
          <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#C27A6E] border-t-transparent animate-spin" />
          <p className="text-sm text-[#8B7560] mt-4">Načítavam...</p>
        </div>
      </div>
    );
  }

  if (!cycleData.lastPeriodStart) {
    return <PeriodkaOnboarding />;
  }

  return <PeriodkaTracker />;
}
