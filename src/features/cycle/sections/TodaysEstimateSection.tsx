import React from 'react';
import { Clock } from 'lucide-react';
import { WellnessDonutChart } from '../WellnessDonutChart';
import { CycleData, DerivedState } from '../types';

interface TodaysEstimateSectionProps {
  derivedState: DerivedState;
  selectedOutcome: 'next-period' | 'fertile-days' | null;
  cycleData: CycleData;
  currentDay: number;
  currentPhase: { name: string; key: string };
}

export function TodaysEstimateSection({
  derivedState,
  selectedOutcome,
  cycleData,
  currentDay,
  currentPhase
}: TodaysEstimateSectionProps) {
  return (
    <div className="w-full space-y-6 rounded-2xl p-6"
         style={{ backgroundColor: '#FBF8F9' }}>
      
      {/* Section Header: Odhad na dnes */}
      <div className="glass-container bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-md border border-rose-200/30 shadow-xl rounded-xl p-4 mb-4"
           style={{ 
             background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.85) 0%, rgba(253, 242, 248, 0.90) 100%)',
             backdropFilter: 'blur(16px)',
             WebkitBackdropFilter: 'blur(16px)',
             boxShadow: '0 8px 32px rgba(149, 95, 106, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
             transform: 'translateY(0)',
             transition: 'transform 0.3s ease'
           }}
           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5" style={{ color: '#FF7782' }} />
          <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
            Odhad na dnes
          </h3>
        </div>
      </div>
      
      {/* Cycle Chart */}
      <div className="glass-container bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-md border border-rose-200/30 shadow-xl rounded-xl p-4 mb-6"
           style={{ 
             background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.85) 0%, rgba(253, 242, 248, 0.90) 100%)',
             backdropFilter: 'blur(16px)',
             WebkitBackdropFilter: 'blur(16px)',
             boxShadow: '0 8px 32px rgba(149, 95, 106, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
             transform: 'translateY(0)',
             transition: 'transform 0.3s ease'
           }}
           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <WellnessDonutChart
          derivedState={derivedState}
          selectedOutcome={selectedOutcome}
          cycleData={cycleData}
          className="mb-6"
        />
      </div>
      
      {/* Current Phase Information */}
      <div className="space-y-3">
        <div>
          <h4 className="text-lg font-medium mb-2" style={{ color: '#955F6A' }}>
            {currentPhase.name} - Deň {currentDay}
          </h4>
          <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
            Energia postupne klesá, telo sa pripravuje na menštruáciu.
          </p>
        </div>
        
        <div>
          <h5 className="text-base font-medium mb-2" style={{ color: '#955F6A' }}>
            Čo môžete očakávať dnes:
          </h5>
          <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
            Môžeš sa cítiť menej energicky (65%) a potrebovať viac času na odpočinok. 
            Energia postupne klesá, preto potrebuješ pravidelné jedlá a menej náročné aktivity. 
            Nálada môže kolísať - môžeš sa cítiť podráždenejšia alebo úzkostlivejšia. 
            Je to normálne, buď k sebe trpezlivá.
          </p>
        </div>
      </div>
    </div>
  );
}