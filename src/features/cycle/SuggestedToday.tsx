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

          {/* What to Expect Today */}
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
                  return `Môžete sa cítiť unavene a potrebovať viac odpočinku. Bolesť a kŕče sú normálne. Doprajte si pokoj, teplé nápoje a jemné pohyby.`;
                case "follicular":
                  return `Každým dňom sa budete cítiť energickejšie a optimistickejšie. Vaša motivácia rastie a je to ideálny čas na nové projekty a aktivity.`;
                case "ovulation":
                  return `Cítite sa na vrchole svojich síl! Ste sebavedomá, energická a sociálna. Využite tento čas na dôležité úlohy a stretnutia.`;
                case "luteal":
                  return `Môžete sa cítiť menej energicky a potrebovať viac času na odpočinok. Nálada môže kolísať, čo je úplne normálne.`;
                default:
                  return phaseInsights.dailyFocus[dailyFocusIndex];
              }
            })()}
            </p>
          </div>

          {/* Energy Expectations */}
          <div className="bg-gradient-to-r from-amber-50/60 to-yellow-50/60 border border-amber-200/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-2" style={{
            color: '#F4415F'
          }}>
              Vaša energia dnes ({suggestion.energy}%):
            </h4>
            <p className="text-sm leading-relaxed" style={{
            color: '#955F6A'
          }}>
              {(() => {
              switch (suggestion.phaseKey) {
                case "menstrual":
                  return `Nízka energia je normálna. Zamerajte sa na jemné aktivity, dostatok spánku a výživné jedlá. Vyhýbajte sa náročným cvičeniam.`;
                case "follicular":
                  return `Vaša energia rastie! Môžete postupne zvyšovať aktivitu. Ideálny čas na plánovanie a začínanie nových vecí.`;
                case "ovulation":
                  return `Máte maximum energie! Využite ju na náročné úlohy, intenzívne cvičenie a dôležité rozhodnutia.`;
                case "luteal":
                  return `Energia postupne klesá. Potrebujete pravidelné jedlá, viac odpočinku a menej náročné aktivity.`;
                default:
                  return `Energia je na úrovni ${suggestion.energy}%.`;
              }
            })()}
            </p>
          </div>

          {/* Mood & Emotional Expectations */}
          <div className="bg-gradient-to-r from-purple-50/60 to-violet-50/60 border border-purple-200/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-2" style={{
            color: '#F4415F'
          }}>
              Ako sa môžete cítiť:
            </h4>
            <p className="text-sm leading-relaxed" style={{
            color: '#955F6A'
          }}>
              {(() => {
              switch (suggestion.phaseKey) {
                case "menstrual":
                  return `Môžete byť emotívnejšia ako obvykle. Smútok alebo úzkosť sú normálne. Buďte k sebe zhovievavá a doprajte si čas na regeneráciu.`;
                case "follicular":
                  return `Vaša nálada sa zlepšuje! Cítite sa optimistickejšie, motivovanejšie a máte chuť na nové výzvy.`;
                case "ovulation":
                  return `Cítite sa fantasticky! Ste sebavedomá, atraktívna a máte chuť na spoločenské aktivity a nové kontakty.`;
                case "luteal":
                  return `Nálada môže kolísať. Môžete sa cítiť podráždenejšia alebo úzkostlivejšia. Je to normálne - buďte k sebe trpezlivá.`;
                default:
                  return `Nálada je na úrovni ${Math.round(suggestion.mood)}/5.`;
              }
            })()}
            </p>
          </div>

          {/* Timeline: Yesterday - Today - Tomorrow */}
          

          {/* Motivational Message */}
          

          {/* Current Energy & Mood Metrics */}
          
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