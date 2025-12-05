import React from 'react';
import { PhaseRange } from './types';
import { getSubphase } from './utils';
import { generateNutrition, generateMovement } from '@/lib/cycleTipsGenerator';
import { useCycleTips } from '@/hooks/useCycleTips';

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
  // Get phase and subphase for current day
  const { phase, subphase } = getSubphase(currentDay, cycleLength, periodLength);
  
  // Generate nutrition and movement from MASTER documents
  const nutritionText = generateNutrition(currentDay, phase, subphase);
  const movementText = generateMovement(currentDay, phase, subphase, phaseRanges);
  
  // Fetch mind text from database (only generic texts come from DB)
  const { data: tips } = useCycleTips(currentDay, cycleLength, periodLength, phaseRanges);
  
  // Parse movement text into bullet points
  const movementLines = movementText.split('\n').filter(line => line.trim());
  
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
        <div className="space-y-2">
          {nutritionText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
              {paragraph}
            </p>
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
          {movementLines.map((line, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-2 flex-shrink-0"></div>
              <p className="text-sm" style={{ color: '#955F6A' }}>
                {line}
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
          {tips?.mind ? (
            <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
              {tips.mind}
            </p>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
              Dnes si dopraj čas na seba. Počúvaj svoje telo a rešpektuj jeho potreby.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
