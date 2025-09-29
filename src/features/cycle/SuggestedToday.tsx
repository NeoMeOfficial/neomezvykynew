import React from 'react';
import { DerivedState, Suggestion } from './types';
import { suggestForDay, getEnergyColor, getMoodEmoji } from './suggestions';
import { SymptomTracker } from './SymptomTracker';
import { PHASE_INSIGHTS } from './insights';
interface SuggestedTodayProps {
  derivedState: DerivedState;
  className?: string;
  accessCode?: string;
  lastPeriodStart?: string | null;
}
export function SuggestedToday({
  derivedState,
  className = "",
  accessCode,
  lastPeriodStart
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
        {/* Main Phase Information */}
        <div className="symptom-glass rounded-xl p-4 space-y-4" style={{
        backgroundColor: '#FBF8F9'
      }}>
          
          {/* Phase Title & Description */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold" style={{
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

          {/* What to Expect Today - Combined */}
          <div className="bg-gradient-to-r from-rose-50/60 to-pink-50/60 border border-rose-200/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-2" style={{
            color: '#F4415F'
          }}>
              Čo môžete očakávať dnes:
            </h4>
            <p className="text-sm leading-relaxed" style={{
            color: '#955F6A'
          }}>
              {(() => {
              switch (suggestion.phaseKey) {
                case "menstrual":
                  return `Môžeš sa cítiť unavene a potrebovať viac odpočinku. Bolesť a kŕče sú normálne. Tvoja energia je nízka (${suggestion.energy}%), preto sa zameraj na jemné aktivity, teplé nápoje a dostatok spánku. Môžeš byť emotívnejšia ako obvykle - buď k sebe zhovievavá.`;
                case "follicular":
                  return `Každým dňom sa budeš cítiť energickejšie a optimistickejšie. Tvoja energia rastie na ${suggestion.energy}% a motivácia sa zvyšuje. Je to ideálny čas na nové projekty a aktívnejší pohyb. Nálada sa zlepšuje a cítiš sa stále pozitívnejšie.`;
                case "ovulation":
                  return `Cítiš sa na vrchole svojich síl! Tvoja energia je na maximum (${suggestion.energy}%) a si sebavedomá, energická a sociálna. Využi tento čas na dôležité úlohy, intenzívne aktivity a stretnutia. Nálada je vynikajúca a máš chuť na spoločenské aktivity.`;
                case "luteal":
                  return `Môžeš sa cítiť menej energicky (${suggestion.energy}%) a potrebovať viac času na odpočinok. Energia postupne klesá, preto potrebuješ pravidelné jedlá a menej náročné aktivity. Nálada môže kolísať - môžeš sa cítiť podráždenejšia alebo úzkostlivejšia. Je to normálne, buď k sebe trpezlivá.`;
                default:
                  return phaseInsights.dailyFocus[dailyFocusIndex];
              }
            })()}
            </p>
          </div>

          {/* Timeline: Yesterday - Today - Tomorrow */}
          

          {/* Motivational Message */}
          

          {/* Current Energy & Mood Metrics */}
          
        </div>

        {/* Symptom Tracker Container */}
        <div className="symptom-glass rounded-xl p-4 space-y-4" style={{
        backgroundColor: '#FBF8F9'
      }}>
          <h3 className="text-lg font-bold text-center" style={{
            color: '#F4415F'
          }}>
            Zaznač si to podstatné
          </h3>
          <SymptomTracker currentPhase={derivedState.currentPhase.key} currentDay={derivedState.currentDay} accessCode={accessCode} lastPeriodStart={lastPeriodStart} />
        </div>
      </div>
    </div>;
}