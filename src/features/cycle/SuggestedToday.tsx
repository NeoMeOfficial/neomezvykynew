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
            
            
            {/* Enhanced Cycle Stage Explanation */}
            <div className="bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 rounded-xl p-4 space-y-3">
              {/* Current Phase Title */}
              <div className="text-center">
                <h3 className="text-lg font-bold mb-1" style={{
                color: '#F4415F'
              }}>
                  {phaseInsights.title} - Deň {dayInPhase + 1}
                </h3>
                <p className="text-sm font-medium" style={{
                color: '#955F6A'
              }}>
                  {phaseInsights.description}
                </p>
              </div>

              {/* What's Happening Now */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold" style={{
                color: '#F4415F'
              }}>
                  🔄 Čo sa práve deje vo vašom tele:
                </h4>
                <p className="text-sm leading-relaxed" style={{
                color: '#955F6A'
              }}>
                  {(() => {
                  const currentDescription = phaseInsights.dailyFocus[dailyFocusIndex];
                  switch (suggestion.phaseKey) {
                    case "menstrual":
                      return `Vaše telo sa zbavuje starej výstelky maternice. ${currentDescription} Hormóny estrogén a progesterón jsou na najnižšej úrovni, čo môže spôsobovať únavu a potrebu odpočinku.`;
                    case "follicular":
                      return `Vaše telo sa pripravuje na ovuláciu. ${currentDescription} Hladina estrogénu postupne stúpa, dodávajúc vám energiu a zlepšujúc náladu každým dňom.`;
                    case "ovulation":
                      return `Práve prebieha ovulácia! ${currentDescription} Estrogén je na vrchole a vaše telo je pripravené na možné počatie. Cítite sa energicky a atraktívne.`;
                    case "luteal":
                      return `Po ovulácii sa telo pripravuje buď na tehotenstvo alebo na menštruáciu. ${currentDescription} Progesterón postupne klesá a môžete pociťovať prvé príznaky PMS.`;
                    default:
                      return currentDescription;
                  }
                })()}
                </p>
              </div>

              {/* Yesterday vs Today */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/40 rounded-lg p-2">
                  <h5 className="text-xs font-semibold mb-1" style={{
                  color: '#F4415F'
                }}>
                    🕐 Včera
                  </h5>
                  <p className="text-xs" style={{
                  color: '#955F6A'
                }}>
                    {(() => {
                    const yesterdayDay = derivedState.currentDay - 1;
                    const yesterdaySuggestion = suggestForDay(yesterdayDay > 0 ? yesterdayDay : derivedState.phaseRanges.reduce((total, phase) => total + (phase.end - phase.start + 1), 0), derivedState.phaseRanges);
                    const energyChange = suggestion.energy - yesterdaySuggestion.energy;
                    return energyChange > 0 ? `Energia rástla (+${energyChange}%)` : energyChange < 0 ? `Energia klesala (${energyChange}%)` : 'Energia stabilná';
                  })()}
                  </p>
                </div>
                <div className="bg-white/40 rounded-lg p-2">
                  <h5 className="text-xs font-semibold mb-1" style={{
                  color: '#F4415F'
                }}>
                    ✨ Dnes
                  </h5>
                  <p className="text-xs" style={{
                  color: '#955F6A'
                }}>
                    {suggestion.energy >= 70 ? 'Vysoká energia!' : suggestion.energy >= 50 ? 'Stredná energia' : 'Pokojná energia'}
                  </p>
                </div>
              </div>

              {/* Tomorrow Teaser */}
              <div className="bg-gradient-to-r from-pink-50/60 to-rose-50/60 border border-pink-200/40 rounded-lg p-3">
                <h4 className="text-sm font-semibold mb-1" style={{
                color: '#F4415F'
              }}>
                  🔮 Čo vás čaká zajtra?
                </h4>
                <p className="text-sm" style={{
                color: '#955F6A'
              }}>
                  {(() => {
                  const tomorrowDay = derivedState.currentDay + 1;
                  const daysToNextPhase = derivedState.currentPhase.end - derivedState.currentDay;
                  if (daysToNextPhase <= 1) {
                    return `Zajtra začína nová fáza: ${nextPhaseInsights.title}! Pripravte sa na ${nextPhaseInsights.energy.toLowerCase()} a ${nextPhaseInsights.mood.toLowerCase()}.`;
                  } else {
                    const tomorrowSuggestion = suggestForDay(tomorrowDay, derivedState.phaseRanges);
                    const energyChange = tomorrowSuggestion.energy - suggestion.energy;
                    return energyChange > 0 ? `Energia bude rásť ešё viac! Perfektný čas na plánovanie náročnejších úloh.` : energyChange < 0 ? `Energia mierne poklesne. Ideálny čas na relaxačné aktivity a sebaopateru.` : `Energia zostane stabilná. Pokračujte v rovnakom tempe ako dnes.`;
                  }
                })()}
                </p>
              </div>

              {/* Motivational Message */}
              <div className="text-center pt-1">
                <p className="text-sm font-medium" style={{
                color: '#F4415F'
              }}>
                  {getMotivationalMessage()}
                </p>
              </div>
            </div>
            
            {/* Energy & Mood Labels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-200/30 rounded-xl">
                {/* Energia row with battery indicator */}
                <div className="flex items-center justify-between mb-2">
                  
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