import React from 'react';
import { PhaseRange } from './types';
import { getSubphase } from './utils';
import { getCycleTipByDay } from '@/data/cycleTips';

interface PhaseOverviewProps {
  phaseRanges: PhaseRange[];
  currentPhase: PhaseRange;
  currentDay: number;
  cycleLength: number;
  periodLength: number;
  className?: string;
}

export function PhaseOverview({
  phaseRanges,
  currentPhase,
  currentDay,
  cycleLength,
  periodLength,
  className = ""
}: PhaseOverviewProps) {
  const { phase, subphase } = getSubphase(currentDay, cycleLength, periodLength);

  // Day within the current phase (1-based) — used to rotate through the 7 tips
  const phaseStart = currentPhase?.start ?? 1;
  const dayInPhase = Math.max(1, currentDay - phaseStart + 1);

  const stravaText = getCycleTipByDay(phase, subphase, 'strava', dayInPhase);
  const pohybText  = getCycleTipByDay(phase, subphase, 'pohyb',  dayInPhase);
  const myselText  = getCycleTipByDay(phase, subphase, 'mysel',  dayInPhase);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Strava */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-400"></div>
          <h3 className="text-base font-medium" style={{ color: '#955F6A' }}>
            Strava
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
          {stravaText}
        </p>
      </div>

      {/* Pohyb */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-400"></div>
          <h3 className="text-base font-medium" style={{ color: '#955F6A' }}>
            Pohyb
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
          {pohybText}
        </p>
      </div>

      {/* Myseľ */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-400"></div>
          <h3 className="text-base font-medium" style={{ color: '#955F6A' }}>
            Myseľ
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
          {myselText}
        </p>
      </div>
    </div>
  );
}
