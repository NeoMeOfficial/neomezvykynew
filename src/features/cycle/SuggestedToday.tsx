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
            <div className="flex items-center gap-2">
              <div className="relative h-2 w-16 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${suggestion.energy}%`,
                    background: `linear-gradient(90deg, ${getEnergyColor(suggestion.energy)}, hsl(var(--peach)))`
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8">{suggestion.energy}%</span>
            </div>
          </div>
          
          {/* Mood Section */}
          <div className="flex items-center justify-between">
            <span className="text-base font-medium" style={{ color: '#955F6A' }}>Nálada</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`w-2 h-2 rounded-full transition-all ${
                      star <= Math.round(suggestion.mood) 
                        ? 'bg-yellow-400' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl">{getMoodEmoji(suggestion.mood)}</span>
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