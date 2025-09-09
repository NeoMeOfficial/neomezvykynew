import React from 'react';
import { DerivedState, Suggestion } from './types';
import { suggestForDay, getEnergyColor, getMoodEmoji } from './suggestions';

interface SuggestedTodayProps {
  derivedState: DerivedState;
  className?: string;
}

export function SuggestedToday({ derivedState, className = "" }: SuggestedTodayProps) {
  const suggestion = suggestForDay(derivedState.currentDay, derivedState.phaseRanges);
  
  return (
    <div className={`glass-surface rounded-2xl p-6 animate-fade-in ${className}`}>
      <div className="space-y-4">
        {/* Energy Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-medium text-foreground">Energia</span>
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

        {/* Mood Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-medium text-foreground">Nálada</span>
            <span className="text-sm text-muted-foreground">{suggestion.mood}/5</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={`text-xl transition-opacity duration-300 ${
                    level <= Math.round(suggestion.mood) ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  {level === 1 && '😞'}
                  {level === 2 && '😕'}
                  {level === 3 && '🙂'}
                  {level === 4 && '😊'}
                  {level === 5 && '🤩'}
                </span>
              ))}
            </div>
            <div className="text-3xl">
              {getMoodEmoji(suggestion.mood)}
            </div>
          </div>
        </div>

        {/* Current Phase */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-foreground">
              {derivedState.currentPhase.name}
            </span>
            <span className="text-sm text-muted-foreground">
              {derivedState.currentDay}. deň cyklu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}