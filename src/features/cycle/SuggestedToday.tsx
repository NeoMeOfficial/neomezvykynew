import React from 'react';
import { DerivedState, Suggestion } from './types';
import { suggestForDay, getEnergyColor, getMoodEmoji } from './suggestions';
import { SymptomTracker } from './SymptomTracker';
import { PHASE_INSIGHTS } from './insights';

interface SuggestedTodayProps {
  derivedState: DerivedState;
  className?: string;
  accessCode?: string;
}

export function SuggestedToday({ derivedState, className = "", accessCode }: SuggestedTodayProps) {
  const suggestion = suggestForDay(derivedState.currentDay, derivedState.phaseRanges);
  const phaseInsights = PHASE_INSIGHTS[suggestion.phaseKey];
  
  // Get daily variation based on current day in phase
  const phaseDuration = derivedState.currentPhase.end - derivedState.currentPhase.start + 1;
  const dayInPhase = Math.floor(derivedState.currentDay % phaseDuration);
  const dailyFocusIndex = dayInPhase % phaseInsights.dailyFocus.length;
  
  return (
    <div className={`animate-fade-in ${className}`}>
      <div className="space-y-4">
        {/* Stage Information */}
        <div className="symptom-glass rounded-xl p-4 space-y-3" style={{ backgroundColor: '#FBF8F9' }}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              <h3 className="text-base font-medium" style={{ color: '#955F6A' }}>
                {phaseInsights.title}
              </h3>
            </div>
            <p className="text-sm" style={{ color: '#955F6A' }}>
              {phaseInsights.stageIntensity}
            </p>
            <div className="bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 rounded-xl p-3">
              <p className="text-sm font-medium" style={{ color: '#F4415F' }}>
                {phaseInsights.dailyFocus[dailyFocusIndex]}
              </p>
            </div>
          </div>
        </div>

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