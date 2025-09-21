import React from 'react';
import { PhaseRange } from './types';
import { getPhaseColor } from './suggestions';
import { PHASE_INSIGHTS } from './insights';

interface PhaseOverviewProps {
  phaseRanges: PhaseRange[];
  currentPhase: PhaseRange;
  className?: string;
}

export function PhaseOverview({ phaseRanges, currentPhase, className = "" }: PhaseOverviewProps) {
  const insights = PHASE_INSIGHTS[currentPhase.key];
  
  // Calculate which day we are in the current phase for daily variations
  const dayInPhase = Math.floor(Math.random() * insights.strava.length); // This should be calculated based on actual day
  
  return (
    <div className={`${className}`}>
      <div
        className="symptom-glass rounded-xl p-4 transition-all duration-300"
        style={{
          backgroundColor: '#FBF8F9',
          borderLeft: `4px solid ${getPhaseColor(currentPhase.key)}`
        }}
      >
        <div className="space-y-4">
          {/* Three Category Recommendations */}
          <div className="space-y-4">
            {/* Strava */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                <h3 className="text-base font-medium" style={{ color: '#955F6A' }}>
                  Strava
                </h3>
              </div>
              <div className="space-y-2">
                {insights.strava[dayInPhase].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-2 flex-shrink-0"></div>
                    <p className="text-sm" style={{ color: '#955F6A' }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pohyb */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                <h3 className="text-base font-medium" style={{ color: '#955F6A' }}>
                  Pohyb
                </h3>
              </div>
              <div className="space-y-2">
                {insights.pohyb[dayInPhase].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-2 flex-shrink-0"></div>
                    <p className="text-sm" style={{ color: '#955F6A' }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Myseľ */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                <h3 className="text-base font-medium" style={{ color: '#955F6A' }}>
                  Myseľ
                </h3>
              </div>
              <div className="space-y-2">
                {insights.mysel[dayInPhase].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-2 flex-shrink-0"></div>
                    <p className="text-sm" style={{ color: '#955F6A' }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}