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
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {phaseRanges.map((phase) => {
        const insight = PHASE_INSIGHTS[phase.key];
        const isActive = phase.key === currentPhase.key;
        
        return (
          <div
            key={phase.key}
            className={`glass-surface rounded-xl p-4 transition-all duration-300 ${
              isActive ? 'ring-2 ring-opacity-50' : 'opacity-75'
            }`}
            style={isActive ? {
              boxShadow: `0 0 0 2px ${getPhaseColor(phase.key)}`
            } : undefined}
          >
            <div className="flex items-center mb-3">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getPhaseColor(phase.key) }}
              />
              <h3 className="font-medium text-foreground">{phase.name}</h3>
              <span className="ml-auto text-xs text-muted-foreground">
                {phase.start}-{phase.end}. deň
              </span>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">
                {insight.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {insight.description}
              </p>
              
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Energia:</span>
                  <span className="text-foreground">{insight.energy}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Nálada:</span>
                  <span className="text-foreground">{insight.mood}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <h5 className="text-xs font-medium text-foreground mb-1">Odporúčania:</h5>
                <ul className="space-y-1">
                  {insight.recommendations.slice(0, 2).map((rec, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start">
                      <span className="mr-1 text-accent">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}