import React from 'react';
import { Clock } from 'lucide-react';
import { WellnessDonutChart } from '../WellnessDonutChart';
import { SymptomTracker } from '../SymptomTracker';
import { CycleData, DerivedState, PhaseKey } from '../types';

interface TodaysEstimateSectionProps {
  derivedState: DerivedState;
  selectedOutcome: 'next-period' | 'fertile-days' | null;
  cycleData: CycleData;
  currentDay: number;
  currentPhase: { name: string; key: string };
  accessCode?: string;
  lastPeriodStart?: string | null;
}

export function TodaysEstimateSection({
  derivedState,
  selectedOutcome,
  cycleData,
  currentDay,
  currentPhase,
  accessCode,
  lastPeriodStart
}: TodaysEstimateSectionProps) {
  return (
    <>
      {/* Layered Glass - Multiple glass layers creating depth between header/content */}
      <div className="relative">
        {/* Background layer */}
        <div className="absolute inset-0 rounded-2xl z-0"
             style={{ 
               background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.3) 0%, rgba(253, 242, 248, 0.4) 100%)',
               backdropFilter: 'blur(8px)',
               WebkitBackdropFilter: 'blur(8px)',
               transform: 'translate(2px, 2px)'
             }}></div>
        
        {/* Header with elevated glass layer */}
        <div className="relative px-4 py-5 sm:px-6 rounded-t-2xl z-10"
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.95) 100%)',
               boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(149, 95, 106, 0.1)'
             }}>
          {/* Header glass accent */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent"></div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5" style={{ color: '#FF7782' }} />
            <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
              Odhad na dnes
            </h3>
          </div>
        </div>

        {/* Content with recessed glass layer */}
        <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-8 rounded-b-2xl z-10 relative"
             style={{ 
               background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.75) 0%, rgba(253, 242, 248, 0.80) 100%)',
               boxShadow: 'inset 0 2px 8px rgba(149, 95, 106, 0.05)'
             }}>
          {/* Cycle Chart */}
          <div className="mb-8">
            <WellnessDonutChart
              derivedState={derivedState}
              selectedOutcome={selectedOutcome}
              cycleData={cycleData}
              className="mb-6"
            />
          </div>
          
          {/* Current Phase Information */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-lg font-medium mb-3 leading-tight" style={{ color: '#955F6A' }}>
                Čo môžeš dnes očakávať:
              </h4>
              <p className="text-sm leading-relaxed opacity-90" style={{ color: '#955F6A' }}>
                Môžeš sa cítiť menej energicky (65%) a potrebovať viac času na odpočinok. 
                Energia postupne klesá, preto potrebuješ pravidelné jedlá a menej náročné aktivity. 
                Nálada môže kolísať - môžeš sa cítiť podráždenejšia alebo úzkostlivejšia. 
                Je to normálne, buď k sebe trpezlivá.
              </p>
            </div>
            
            {/* How do you feel today section */}
            <div className="space-y-3">
              <h5 className="text-base font-medium mb-3" style={{ color: '#955F6A' }}>
                Ako sa dnes cítiš:
              </h5>
              <SymptomTracker
                currentPhase={currentPhase.key as PhaseKey}
                currentDay={currentDay}
                accessCode={accessCode}
                lastPeriodStart={lastPeriodStart}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}