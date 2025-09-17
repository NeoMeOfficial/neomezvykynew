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
    <div className={`animate-fade-in ${className}`}>
      <div className="space-y-4">
        {/* Energy Level Container */}
        <div className="symptom-glass rounded-xl p-4 space-y-3" style={{ backgroundColor: '#FBF8F9' }}>
          {/* Energy Level */}
          <div className="flex items-center justify-between">
            <span className="text-base font-medium" style={{ color: '#955F6A' }}>Energia</span>
            <span className="text-sm text-muted-foreground">{suggestion.energy}%</span>
          </div>
          
          {/* Mood Section */}
          <div className="flex items-center justify-between">
            <span className="text-base font-medium" style={{ color: '#955F6A' }}>Nálada</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMoodEmoji(suggestion.mood)}</span>
              <span className="text-sm text-muted-foreground">
                {suggestion.mood}/5.0
              </span>
            </div>
          </div>
        </div>

        {/* Symptom Tracker Container */}
        <div className="symptom-glass rounded-xl p-4" style={{ backgroundColor: '#FBF8F9' }}>
          <SymptomTracker 
            currentPhase={derivedState.currentPhase.key}
            currentDay={derivedState.currentDay}
            accessCode={accessCode}
          />
        </div>

      </div>
    </div>
  );
}