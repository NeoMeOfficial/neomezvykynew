import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DerivedState, PhaseKey, CycleData } from './types';
import { getPhaseColor } from './suggestions';
import { isPeriodDate, isFertilityDate, getNextPeriodDate } from './utils';

type OutcomeType = 'next-period' | 'fertile-days';
import { UI_TEXT } from './insights';

interface WellnessDonutChartProps {
  derivedState: DerivedState;
  onEditClick?: () => void;
  className?: string;
  selectedOutcome?: OutcomeType | null;
  cycleData?: CycleData;
}

export function WellnessDonutChart({ derivedState, onEditClick, className = "", selectedOutcome, cycleData }: WellnessDonutChartProps) {
  const { currentDay, phaseRanges, currentPhase } = derivedState;
  const cycleLength = phaseRanges[phaseRanges.length - 1].end;
  
  // Helper function to check if a day should be highlighted
  const isDayHighlighted = (day: number): boolean => {
    if (!selectedOutcome || !cycleData?.lastPeriodStart) return false;
    
    const dayDate = new Date(cycleData.lastPeriodStart);
    dayDate.setDate(dayDate.getDate() + day - 1);
    
    if (selectedOutcome === 'next-period') {
      return isPeriodDate(dayDate, cycleData.lastPeriodStart, cycleData.cycleLength, cycleData.periodLength);
    } else if (selectedOutcome === 'fertile-days') {
      return isFertilityDate(dayDate, cycleData.lastPeriodStart, cycleData.cycleLength);
    }
    
    return false;
  };
  
  // Calculate angles for each phase
  const phaseAngles = phaseRanges.map(phase => {
    const length = phase.end - phase.start + 1;
    const percentage = length / cycleLength;
    return percentage * 360;
  });
  
  // Calculate current position angle
  const currentAngle = ((currentDay - 1) / cycleLength) * 360;
  
  let cumulativeAngle = 0;
  
  return (
    <div className={`${className}`}>
      <div className="relative w-full max-w-[300px] h-[250px] mx-auto">
        {/* SVG Donut Chart - adjusted viewBox to remove vertical padding */}
        <svg viewBox="0 25 200 150" className="w-full h-full -rotate-90">
          {/* Base ring track */}
          <circle
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Day dots */}
          {Array.from({ length: cycleLength }, (_, index) => {
            const day = index + 1;
            const dayAngle = ((day - 1) / cycleLength) * 360;
            const dayAngleRad = (dayAngle * Math.PI) / 180;
            
            const dotX = 100 + 74 * Math.cos(dayAngleRad);
            const dotY = 100 + 74 * Math.sin(dayAngleRad);
            
            // Find which phase this day belongs to
            const dayPhase = phaseRanges.find(phase => day >= phase.start && day <= phase.end);
            const phaseColor = dayPhase ? getPhaseColor(dayPhase.key) : 'hsl(var(--muted))';
            const isCurrentPhase = dayPhase?.key === currentPhase.key;
            const isToday = day === currentDay;
            const isHighlighted = isDayHighlighted(day);
            const shouldHighlight = selectedOutcome ? isHighlighted : isCurrentPhase;
            
            return (
              <g key={day}>
                {/* Today's background circle */}
                {isToday && (
                  <circle
                    cx={dotX}
                    cy={dotY}
                    r="10"
                    fill="hsl(var(--peach) / 0.35)"
                    stroke="hsl(var(--peach) / 0.55)"
                    strokeWidth="1"
                    style={{
                      filter: 'drop-shadow(0 0 8px hsl(var(--peach) / 0.45))'
                    }}
                  />
                )}
                
                {/* Day dot */}
                <circle
                  cx={dotX}
                  cy={dotY}
                  r={isToday ? "5" : (shouldHighlight ? "4" : "3")}
                  fill={
                    isToday ? '#F4415F' : 
                    shouldHighlight && selectedOutcome ? (selectedOutcome === 'next-period' ? '#F4415F' : '#FF8A9B') : 
                    phaseColor
                  }
                  opacity={shouldHighlight ? 1 : 0.7}
                  className={`transition-all duration-300`}
                  stroke={isToday ? "hsl(var(--background))" : (shouldHighlight ? "white" : "none")}
                  strokeWidth={isToday ? "1" : (shouldHighlight ? "1" : "0")}
                />
              </g>
            );
          })}
          
          {/* Center circle - clickable area */}
          <circle
            cx="100"
            cy="100"
            r="66"
            fill="hsl(var(--chart-center))"
            className="transition-colors duration-300 cursor-pointer hover:fill-[hsl(var(--chart-center)_/_0.9)]"
          />
          
          {/* "DNES" label on marker */}
          <text
            x={100 + 100 * Math.cos((currentAngle * Math.PI) / 180)}
            y={100 + 100 * Math.sin((currentAngle * Math.PI) / 180)}
            fontSize="14"
            fill="hsl(var(--foreground))"
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="700"
            className="rotate-90 transform-origin-center pointer-events-none"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            Dnes
          </text>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {selectedOutcome ? (
            <>
              <div className="text-sm text-center mb-1 font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                {selectedOutcome === 'next-period' ? 'Ďalšia perioda začne o' : 'Plodné dni'}
              </div>
              <div className="text-4xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                {(() => {
                  if (!cycleData?.lastPeriodStart) return '';
                  
                  if (selectedOutcome === 'next-period') {
                    const nextPeriod = getNextPeriodDate(cycleData.lastPeriodStart, cycleData.cycleLength);
                    const today = new Date();
                    const diffTime = nextPeriod.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays <= 0) return 'Dnes';
                    if (diffDays === 1) return 'Zajtra';
                    return diffDays;
                  } else {
                    // Fertile days calculation (ovulation is around day 14 in a 28-day cycle)
                    const ovulationDay = Math.round(cycleData.cycleLength * 0.5);
                    const fertileStart = ovulationDay - 5;
                    const fertileEnd = ovulationDay + 1;
                    
                    if (derivedState.currentDay >= fertileStart && derivedState.currentDay <= fertileEnd) {
                      return fertileEnd - derivedState.currentDay + 1;
                    } else if (derivedState.currentDay < fertileStart) {
                      return fertileStart - derivedState.currentDay;
                    } else {
                      const nextFertileStart = fertileStart + cycleData.cycleLength;
                      return nextFertileStart - derivedState.currentDay;
                    }
                  }
                })()}
              </div>
              <div className="text-sm text-center font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {(() => {
                  if (!cycleData?.lastPeriodStart) return '';
                  
                  if (selectedOutcome === 'next-period') {
                    const nextPeriod = getNextPeriodDate(cycleData.lastPeriodStart, cycleData.cycleLength);
                    const today = new Date();
                    const diffTime = nextPeriod.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays <= 0) return '';
                    if (diffDays === 1) return '';
                    return 'dní';
                  } else {
                    return 'dní';
                  }
                })()}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-center mb-1 font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                {currentPhase.name}
              </div>
              <div className="text-4xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                {currentDay}
              </div>
              <div className="text-sm text-center font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {UI_TEXT.day}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}