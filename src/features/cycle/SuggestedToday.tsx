import React from 'react';
import { DerivedState, Suggestion } from './types';
import { suggestForDay, getEnergyColor, getMoodEmoji } from './suggestions';
import { SymptomTracker } from './SymptomTracker';

interface SuggestedTodayProps {
  derivedState: DerivedState;
  className?: string;
  accessCode?: string;
}

export function SuggestedToday({ derivedState, className = "", accessCode }: SuggestedTodayProps) {
  const suggestion = suggestForDay(derivedState.currentDay, derivedState.phaseRanges);
  
  return (
    <div className={`pl-0 pr-0 pt-0 pb-6 animate-fade-in symptom-glass rounded-xl p-4 ${className}`} style={{ backgroundColor: '#FBF8F9' }}>
      <div className="space-y-4">
        {/* Energy Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-medium" style={{ color: '#955F6A' }}>Energia</span>
            <span className="text-sm text-muted-foreground">{suggestion.energy}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
              style={{
                width: `${suggestion.energy}%`,
                background: `linear-gradient(90deg, ${getEnergyColor(suggestion.energy)}, hsl(var(--peach)))`
              }}
            />
            {/* End marker */}
            <div 
              className="absolute top-0 w-1 h-full bg-peach"
              style={{ left: `${suggestion.energy}%` }}
            />
          </div>
        </div>

        {/* Symptom Tracker */}
        <SymptomTracker 
          currentPhase={derivedState.currentPhase.key}
          currentDay={derivedState.currentDay}
          accessCode={accessCode}
        />

        {/* Mood Section */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium" style={{ color: '#955F6A' }}>Nálada</span>
            <span className="text-sm text-muted-foreground">
              {derivedState.currentDay}. deň cyklu
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl">{getMoodEmoji(suggestion.mood)}</span>
            <span className="text-sm text-muted-foreground">
              {suggestion.mood}/5.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}