import { useMemo } from 'react';
import { Calendar, TrendingUp, Clock, Activity } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { colors } from '../../../theme/warmDusk';
import { useCycleData, calculateAverageCycleLength } from '../../../features/cycle/useCycleData';
import {
  getPhaseRanges, getPhaseByDay, getCurrentCycleDay,
  getNextPeriodDate, formatDateSk,
} from '../../../features/cycle/utils';

export default function PeriodOverview() {
  const { cycleData } = useCycleData();
  const { lastPeriodStart, cycleLength, periodLength, history } = cycleData;

  const today = useMemo(() => new Date(), []);

  const currentDay = useMemo(
    () => lastPeriodStart ? getCurrentCycleDay(lastPeriodStart, today, cycleLength) : null,
    [lastPeriodStart, today, cycleLength]
  );

  const ranges = useMemo(() => getPhaseRanges(cycleLength, periodLength), [cycleLength, periodLength]);
  const phase = useMemo(
    () => currentDay ? getPhaseByDay(currentDay, ranges, cycleLength) : null,
    [currentDay, ranges, cycleLength]
  );

  const nextPeriod = useMemo(
    () => lastPeriodStart ? getNextPeriodDate(lastPeriodStart, cycleLength) : null,
    [lastPeriodStart, cycleLength]
  );

  const daysUntilNext = useMemo(() => {
    if (!nextPeriod) return null;
    return differenceInDays(nextPeriod, today);
  }, [nextPeriod, today]);

  const avgCycle = useMemo(
    () => calculateAverageCycleLength(history || []),
    [history]
  );

  const totalTracked = (history || []).length;

  // Not set up yet
  if (!lastPeriodStart) {
    return null; // PeriodkaTracker handles the main UI; no need for a duplicate empty state
  }

  const isLate = currentDay !== null && currentDay > cycleLength;
  const daysLate = isLate ? currentDay! - cycleLength : 0;

  const getStatusText = () => {
    if (isLate) {
      return `${daysLate} ${daysLate === 1 ? 'deň' : daysLate < 5 ? 'dni' : 'dní'} po očakávanom termíne`;
    }
    if (daysUntilNext !== null) {
      if (daysUntilNext <= 0) return 'Menštruácia očakávaná dnes';
      return `${daysUntilNext} ${daysUntilNext === 1 ? 'deň' : daysUntilNext < 5 ? 'dni' : 'dní'} do menštruácie`;
    }
    return 'Sledovanie cyklu';
  };

  const getStatusColor = () => {
    if (isLate) return '#e67e22';
    if (daysUntilNext !== null && daysUntilNext <= 2) return colors.periodka;
    return colors.strava;
  };

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${getStatusColor()}20` }}
            >
              <Calendar className="w-5 h-5" style={{ color: getStatusColor() }} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#2E2218]">Menštruačný cyklus</p>
              <p className="text-[12px] text-[#8B7560]">{getStatusText()}</p>
            </div>
          </div>
          {isLate && (
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mt-1" />
          )}
        </div>

        {nextPeriod && (
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#8B7560]">Ďalšia menštruácia:</span>
            <span className="font-medium text-[#2E2218]">{formatDateSk(nextPeriod)}</span>
          </div>
        )}
      </div>

      {/* Stats Grid — only show if we have history */}
      {totalTracked >= 2 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-3 shadow-sm border border-white/30 text-center">
            <TrendingUp className="w-4 h-4 mx-auto mb-1" style={{ color: colors.strava }} />
            <p className="text-lg font-bold text-[#2E2218]">
              {avgCycle ? avgCycle.average : cycleLength}
            </p>
            <p className="text-[10px] text-[#A0907E]">Priemer dní</p>
          </div>

          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-3 shadow-sm border border-white/30 text-center">
            <Clock className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent }} />
            <p className="text-lg font-bold text-[#2E2218]">{totalTracked}</p>
            <p className="text-[10px] text-[#A0907E]">Sledovaných</p>
          </div>

          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-3 shadow-sm border border-white/30 text-center">
            <Activity className="w-4 h-4 mx-auto mb-1" style={{ color: colors.periodka }} />
            <p className="text-lg font-bold text-[#2E2218]">{periodLength}</p>
            <p className="text-[10px] text-[#A0907E]">Dní periódy</p>
          </div>
        </div>
      )}
    </div>
  );
}
