import GlassCard from '../../components/v2/GlassCard';
import MenstrualCycleTracker from '../../features/cycle/MenstrualCycleTracker';

export default function Cyklus() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[#2E2218]">Môj cyklus</h1>

      {/* Current Phase Info */}
      <GlassCard>
        <div className="flex items-center gap-4">
          <svg width="56" height="56" viewBox="0 0 56 56" className="flex-shrink-0">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#F0E8E8" strokeWidth="5" />
            <circle
              cx="28" cy="28" r="22" fill="none" stroke="#E8A0A0" strokeWidth="5"
              strokeDasharray={`${(14 / 28) * 138.23} 138.23`}
              strokeLinecap="round" transform="rotate(-90 28 28)"
            />
          </svg>
          <div>
            <p className="text-lg font-semibold text-[#2E2218]">Deň 14</p>
            <p className="text-sm text-[#666666]">Fáza: Ovulácia</p>
            <p className="text-xs text-[#999999] mt-1">Ďalšia menštruácia: ~14 dní</p>
          </div>
        </div>
      </GlassCard>

      {/* Menstrual Cycle Tracker */}
      <MenstrualCycleTracker />
    </div>
  );
}
