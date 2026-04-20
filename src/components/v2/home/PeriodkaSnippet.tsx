import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart } from 'lucide-react';
import GlassCard from '../GlassCard';
import { colors, innerGlass, iconContainer, sectionLabel as sectionLabelStyle } from '../../../theme/warmDusk';
import { useCycleData } from '../../../features/cycle/useCycleData';
import { getPhaseRanges, getPhaseByDay, getCurrentCycleDay, getNextPeriodDate } from '../../../features/cycle/utils';
import { suggestForDay } from '../../../features/cycle/suggestions';
import type { PhaseKey } from '../../../features/cycle/types';
import { differenceInDays } from 'date-fns';

import { PHASE_COLORS, PHASE_NAMES, PHASE_EMOJI } from '../../../features/cycle/constants';

const PHASE_MESSAGES: Record<PhaseKey, string> = {
  menstrual: 'Tvoje telo regeneruje — dopraj si pokoj a teplo',
  follicular: 'Energia rastie — skvelý čas na nové výzvy!',
  ovulation: 'Si na vrchole energie — využi to naplno!',
  luteal: 'Spomaľ a počúvaj svoje telo — zaslúžiš si starostlivosť',
};

export default function PeriodkaSnippet() {
  const navigate = useNavigate();
  const { cycleData } = useCycleData();

  const cycleLength = cycleData.cycleLength || 28;
  const periodLength = cycleData.periodLength || 5;
  const today = new Date();
  const currentDay = cycleData.lastPeriodStart
    ? getCurrentCycleDay(cycleData.lastPeriodStart, today, cycleLength) : 14;
  const ranges = getPhaseRanges(cycleLength, periodLength);
  const phase = getPhaseByDay(currentDay, ranges, cycleLength);
  const suggestion = suggestForDay(currentDay, ranges, cycleLength);
  const daysUntilPeriod = cycleData.lastPeriodStart
    ? Math.max(0, differenceInDays(getNextPeriodDate(cycleData.lastPeriodStart, cycleLength), today))
    : cycleLength - currentDay;
  const phaseColor = PHASE_COLORS[phase.key];

  return (
    <GlassCard
      className="!p-5 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => navigate('/kniznica/periodka')}
    >
      <div className="flex items-center justify-between mb-3">
        <p style={sectionLabelStyle}>Periodka</p>
        <span className="text-[11px] font-medium" style={{ color: colors.textTertiary }}>Deň {currentDay} z {cycleLength}</span>
      </div>

      {/* Phase card */}
      <div className="p-4 rounded-2xl relative overflow-hidden" style={innerGlass}>
        <div className="absolute top-[-15px] right-[-15px] w-24 h-24 rounded-full opacity-[0.12]"
          style={{ background: `radial-gradient(circle, ${phaseColor}, transparent)`, filter: 'blur(20px)' }} />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={iconContainer(phaseColor)}>
            <Heart size={20} style={{ color: phaseColor }} />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold" style={{ color: colors.textPrimary }}>
              {PHASE_NAMES[phase.key]} {PHASE_EMOJI[phase.key]}
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: colors.textTertiary }}>{PHASE_MESSAGES[phase.key]}</p>
          </div>
          <ChevronRight size={16} style={{ color: '#C8B8A8' }} />
        </div>
      </div>

      {/* Phase bar */}
      <div className="flex gap-1.5 mt-4 px-1">
        {([
          { key: 'menstrual', c: colors.periodka, label: 'Menštruácia' },
          { key: 'follicular', c: colors.strava, label: 'Folikulárna' },
          { key: 'ovulation', c: colors.mysel, label: 'Ovulácia' },
          { key: 'luteal', c: colors.accent, label: 'Luteálna' },
        ] as const).map((p) => {
          const isActive = p.key === phase.key;
          const isPast = ['menstrual', 'follicular', 'ovulation', 'luteal'].indexOf(p.key)
            <= ['menstrual', 'follicular', 'ovulation', 'luteal'].indexOf(phase.key);
          return (
            <div key={p.key} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="h-2 w-full rounded-full" style={{
                background: isPast ? `linear-gradient(90deg, ${p.c}, ${p.c}BB)` : 'rgba(0,0,0,0.05)',
                boxShadow: isPast ? `0 2px 8px ${p.c}25` : 'none',
              }} />
              <span className="text-[9px] font-medium" style={{ color: isPast ? p.c : colors.textTertiary }}>{p.label}</span>
            </div>
          );
        })}
      </div>

      {/* Energy + days until period */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[11px]" style={{ color: colors.textTertiary }}>Energia</span>
          <div className="flex-1 h-1.5 rounded-full bg-black/5 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${suggestion.energy}%`, background: phaseColor }} />
          </div>
          <span className="text-[11px]" style={{ color: colors.textTertiary }}>{suggestion.energy}%</span>
        </div>
        <p className="text-[11px] ml-4" style={{ color: colors.textTertiary }}>
          Ďalšia o <span className="font-semibold" style={{ color: colors.textPrimary }}>{daysUntilPeriod} dní</span>
        </p>
      </div>
    </GlassCard>
  );
}
