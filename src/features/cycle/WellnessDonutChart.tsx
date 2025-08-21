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
      <div className="relative w-full max-w-[200px] h-[200px] mx-auto">
        {/* SVG Donut Chart - 200x200px viewBox */}
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
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
          
          {/* Phase rings */}
          {phaseRanges.map((phase, index) => {
            const angle = phaseAngles[index];
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;
            
            // Convert angles to radians and calculate path
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = 100 + 74 * Math.cos(startAngleRad);
            const y1 = 100 + 74 * Math.sin(startAngleRad);
            const x2 = 100 + 74 * Math.cos(endAngleRad);
            const y2 = 100 + 74 * Math.sin(endAngleRad);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${x1} ${y1}`,
              `A 74 74 0 ${largeArcFlag} 1 ${x2} ${y2}`
            ].join(' ');
            
            cumulativeAngle = endAngle;
            
            return (
              <path
                key={phase.key}
                d={pathData}
                fill="none"
                stroke={getPhaseColor(phase.key)}
                strokeWidth="12"
                strokeLinecap="round"
                opacity={phase.key === currentPhase.key ? 1 : 0.7}
                className="transition-opacity duration-300"
              />
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
          
          {/* Today marker */}
          <circle
            cx={100 + 74 * Math.cos((currentAngle * Math.PI) / 180)}
            cy={100 + 74 * Math.sin((currentAngle * Math.PI) / 180)}
            r="4"
            fill="hsl(var(--peach))"
            stroke="hsl(var(--foreground) / 0.6)"
            strokeWidth="1"
            className="animate-pulse"
          />
          
          {/* "DNES" label on marker */}
          <text
            x={100 + 90 * Math.cos((currentAngle * Math.PI) / 180)}
            y={100 + 90 * Math.sin((currentAngle * Math.PI) / 180)}
            fontSize="10"
            fill="hsl(var(--foreground))"
            textAnchor="middle"
            dominantBaseline="middle"
            className="rotate-90 transform-origin-center pointer-events-none"
          >
            {UI_TEXT.today}
          </text>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xs text-center mb-1" style={{ color: 'hsl(var(--foreground))' }}>
            {currentPhase.name}
          </div>
          <div className="text-2xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
            {currentDay}
          </div>
          <div className="text-[10px] text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {UI_TEXT.day}
          </div>
        </div>
        
        {/* Glass-style edit button at top right */}
        <Button
          variant="glass"
          size="icon"
          onClick={onEditClick}
          className="absolute top-[-12px] right-[-12px] w-8 h-8 backdrop-blur-[14px] bg-white/50 border border-white/20 shadow-elegant"
          aria-label={UI_TEXT.edit}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}