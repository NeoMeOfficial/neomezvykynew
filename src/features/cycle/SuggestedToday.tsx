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
  
  // Calculate next phase and motivation messages
  const currentPhaseIndex = derivedState.phaseRanges.findIndex(p => p.key === suggestion.phaseKey);
  const nextPhase = derivedState.phaseRanges[(currentPhaseIndex + 1) % derivedState.phaseRanges.length];
  const nextPhaseInsights = PHASE_INSIGHTS[nextPhase.key];
  
  const getMotivationalMessage = () => {
    const daysToNextPhase = derivedState.currentPhase.end - derivedState.currentDay + 1;
    
    switch (suggestion.phaseKey) {
      case "menstrual":
        return `Za ${daysToNextPhase} dní sa začnete cítiť lepšie a energia sa bude zvyšovať! 💪`;
      case "follicular":
        if (suggestion.energy >= 70) {
          return `Využite túto rastúcu energiu naplno - o ${daysToNextPhase} dní budete na vrchole! 🌟`;
        }
        return `Vaša energia rastie každým dňom - lepšie časy prichádzajú! ✨`;
      case "ovulation":
        return `Ste na vrchole energie! Využite tento čas, pretože o ${daysToNextPhase} dní energia začne klesať. 🔥`;
      case "luteal":
        if (suggestion.energy <= 50) {
          return `Už čoskoro (o ${Math.abs(derivedState.phaseRanges[0].start - derivedState.currentDay)} dní) príde odpočinok a potom nová energia! 🌱`;
        }
        return `Energia postupne klesá, ale je to prirodzené. Pripravte sa na relaxáciu. 🌸`;
      default:
        return "";
    }
  };
  
  return (
    <div className={`animate-fade-in ${className}`}>
      <div className="space-y-4">
        {/* Phase Information */}
        <div className="symptom-glass rounded-xl p-4 space-y-3" style={{ backgroundColor: '#FBF8F9' }}>
          <div className="space-y-3">
            <p className="text-sm" style={{ color: '#955F6A' }}>
              {phaseDuration} dní • {phaseInsights.description}
            </p>
            
            {/* Energy & Mood Labels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 rounded-xl">
                <p className="text-xs font-medium mb-1" style={{ color: '#955F6A' }}>Energia</p>
                <p className="text-sm font-semibold" style={{ color: '#F4415F' }}>{phaseInsights.energy}</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 rounded-xl">
                <p className="text-xs font-medium mb-1" style={{ color: '#955F6A' }}>Nálada</p>
                <p className="text-sm font-semibold" style={{ color: '#F4415F' }}>{phaseInsights.mood}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Level Container with Indicators */}
        <div className="symptom-glass rounded-xl p-4 space-y-3" style={{ backgroundColor: '#FBF8F9' }}>
          {/* Energy Level with Visual Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium" style={{ color: '#955F6A' }}>Energia</span>
              <span className="text-lg font-bold" style={{ color: getEnergyColor(suggestion.energy) }}>
                {suggestion.energy}%
              </span>
            </div>
            <div className="relative h-3 w-full bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-full overflow-hidden border border-rose-200/30">
              <div 
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{
                  width: `${suggestion.energy}%`,
                  background: `linear-gradient(90deg, ${getEnergyColor(suggestion.energy)}, ${getEnergyColor(suggestion.energy)}80)`
                }}
              />
              <div 
                className="absolute top-0 h-full w-1 bg-white/60 rounded-full shadow-sm transition-all duration-700"
                style={{ left: `${suggestion.energy}%` }}
              />
            </div>
          </div>
          
          {/* Mood Section with Visual Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium" style={{ color: '#955F6A' }}>Nálada</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getMoodEmoji(suggestion.mood)}</span>
                <span className="text-lg font-bold" style={{ color: '#955F6A' }}>
                  {suggestion.mood}/5
                </span>
              </div>
            </div>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-3 w-6 rounded-full transition-all duration-500 ${
                    level <= Math.round(suggestion.mood) 
                      ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 shadow-sm' 
                      : 'bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 rounded-xl p-3 mt-3">
            <p className="text-sm font-medium text-center" style={{ color: '#F4415F' }}>
              {getMotivationalMessage()}
            </p>
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