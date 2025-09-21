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
export function SuggestedToday({
  derivedState,
  className = "",
  accessCode
}: SuggestedTodayProps) {
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
  return <div className={`animate-fade-in ${className}`}>
      <div className="space-y-4">
        {/* Phase Information */}
        <div className="symptom-glass rounded-xl p-4 space-y-3" style={{
        backgroundColor: '#FBF8F9'
      }}>
          <div className="space-y-3">
            
            
            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 rounded-xl p-3">
              <p className="text-sm font-medium text-center" style={{
              color: '#F4415F'
            }}>
                {getMotivationalMessage()}
              </p>
            </div>
            
            {/* Energy & Mood Labels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 rounded-xl">
                {/* Energia row with battery indicator */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium" style={{
                  color: '#955F6A'
                }}>Energia</p>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-4 border-2 rounded-sm" style={{
                      borderColor: '#F4415F'
                    }}>
                        <div className="h-full rounded-sm transition-all duration-700" style={{
                        width: `${suggestion.energy}%`,
                        backgroundColor: '#F4A6B8'
                      }} />
                      </div>
                      <div className="absolute -right-0.5 top-1/2 w-0.5 h-2 rounded-r-sm transform -translate-y-1/2" style={{
                      backgroundColor: '#F4415F'
                    }} />
                    </div>
                    <span className="text-xs font-bold" style={{
                    color: '#F4415F'
                  }}>
                      {suggestion.energy}%
                    </span>
                  </div>
                </div>
                {/* Description and additional context */}
                <p className="text-sm font-semibold text-center mb-1" style={{
                color: '#F4415F'
              }}>{phaseInsights.energy}</p>
                <p className="text-xs text-center" style={{
                color: '#955F6A'
              }}>
                  {suggestion.energy >= 70 ? 'Vysoká energia - využite ju na náročné úlohy' : suggestion.energy >= 50 ? 'Stredná energia - vhodná na bežné aktivity' : 'Nízka energia - zamerajte sa na odpočinok'}
                </p>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 rounded-xl">
                {/* Nálada row with emojis */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium" style={{
                  color: '#955F6A'
                }}>Nálada</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(level => <span key={level} className="text-xs transition-all duration-500" style={{
                    opacity: level <= Math.round(suggestion.mood) ? 1 : 0.3,
                    filter: level <= Math.round(suggestion.mood) ? 'none' : 'grayscale(100%)'
                  }}>
                        {level <= 1 ? '😞' : level <= 2 ? '😕' : level <= 3 ? '😐' : level <= 4 ? '🙂' : '🤩'}
                      </span>)}
                  </div>
                </div>
                {/* Description and additional context */}
                <p className="text-sm font-semibold text-center mb-1" style={{
                color: '#F4415F'
              }}>{phaseInsights.mood}</p>
                <p className="text-xs text-center" style={{
                color: '#955F6A'
              }}>
                  {Math.round(suggestion.mood) >= 4 ? 'Skvelá nálada - ideálny čas na sociálne aktivity' : Math.round(suggestion.mood) >= 3 ? 'Stabilná nálada - vyvážený deň' : 'Pokojná nálada - vhodný čas na relaxáciu'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Symptom Tracker Container */}
        <div className="symptom-glass rounded-xl p-4" style={{
        backgroundColor: '#FBF8F9'
      }}>
          <SymptomTracker currentPhase={derivedState.currentPhase.key} currentDay={derivedState.currentDay} accessCode={accessCode} />
        </div>

      </div>
    </div>;
}