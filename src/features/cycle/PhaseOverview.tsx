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
  const insight = PHASE_INSIGHTS[currentPhase.key];
  
  return (
    <div className={`${className}`}>
      <div
        className="glass-surface rounded-xl p-4 transition-all duration-300 ring-2 ring-opacity-50"
        style={{
          boxShadow: `0 0 0 2px ${getPhaseColor(currentPhase.key)}`
        }}
      >
        <div className="flex items-center mb-3">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: getPhaseColor(currentPhase.key) }}
          />
          <h3 className="font-medium text-foreground">{currentPhase.name}</h3>
          <span className="ml-auto text-xs text-muted-foreground">
            {currentPhase.start}-{currentPhase.end}. deň
          </span>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-base font-medium text-foreground">
            {insight.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {insight.description}
          </p>
          
          <div className="pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Energia:</span>
              <span className="text-foreground">{insight.energy}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nálada:</span>
              <span className="text-foreground">{insight.mood}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <h5 className="text-sm font-medium text-foreground mb-2">Odporúčania:</h5>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.recommendations.join('. ')}. Pamätajte, že každá žena je jedinečná a je dôležité počúvať svoje telo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}