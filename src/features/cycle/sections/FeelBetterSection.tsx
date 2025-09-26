import React from 'react';
import { TrendingUp } from 'lucide-react';
import { PhaseOverview } from '../PhaseOverview';

interface FeelBetterSectionProps {
  phaseRanges: any;
  currentPhase: any;
}

export function FeelBetterSection({
  phaseRanges,
  currentPhase
}: FeelBetterSectionProps) {
  return (
    <div className="w-full space-y-6 rounded-2xl p-6"
         style={{ backgroundColor: '#FBF8F9' }}>

      {/* Section Header: Ako sa cítiť lepšie */}
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-5 h-5" style={{ color: '#FF7782' }} />
        <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
          Ako sa cítiť lepšie
        </h3>
      </div>
      
      {/* Phase Overview */}
      <PhaseOverview
        phaseRanges={phaseRanges}
        currentPhase={currentPhase}
      />
    </div>
  );
}