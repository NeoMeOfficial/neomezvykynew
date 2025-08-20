import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DerivedState } from './types';
import { getPhaseColor } from './suggestions';
import { UI_TEXT } from './insights';

interface WellnessDonutChartProps {
  derivedState: DerivedState;
  onEditClick: () => void;
  className?: string;
}

export function WellnessDonutChart({ derivedState, onEditClick, className = "" }: WellnessDonutChartProps) {
  const { currentDay, phaseRanges, currentPhase } = derivedState;
  const cycleLength = phaseRanges[phaseRanges.length - 1].end;
  
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
    <div className={`glass-surface rounded-2xl p-6 ${className}`}>
      <div className="relative w-48 h-48 mx-auto">
        {/* SVG Donut Chart */}
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {phaseRanges.map((phase, index) => {
            const angle = phaseAngles[index];
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;
            
            const x1 = 50 + 35 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 35 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 35 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 35 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            cumulativeAngle = endAngle;
            
            return (
              <path
                key={phase.key}
                d={pathData}
                fill={getPhaseColor(phase.key)}
                opacity={phase.key === currentPhase.key ? 1 : 0.6}
                className="transition-opacity duration-300"
              />
            );
          })}
          
          {/* Center circle */}
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="hsl(var(--chartCenter))"
            className="transition-colors duration-300"
          />
          
          {/* Current day marker */}
          <circle
            cx={50 + 30 * Math.cos((currentAngle * Math.PI) / 180)}
            cy={50 + 30 * Math.sin((currentAngle * Math.PI) / 180)}
            r="2"
            fill="hsl(var(--peach))"
            className="animate-pulse"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs font-medium text-deepGreen mb-1">
            {UI_TEXT.today}
          </div>
          <div className="text-lg font-bold text-deepGreen">
            {currentDay}
          </div>
          <div className="text-xs text-deepGreen/70">
            {currentPhase.name}
          </div>
        </div>
        
        {/* Edit button at 6 o'clock */}
        <Button
          variant="glass"
          size="icon"
          onClick={onEditClick}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-8 h-8"
          aria-label={UI_TEXT.edit}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}