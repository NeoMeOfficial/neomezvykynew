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
    <>
      {/* Option 2: Connected Design - Header */}
      <div className="glass-container bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-md border border-rose-200/30 shadow-xl rounded-t-xl p-4"
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
          <TrendingUp className="w-5 h-5" style={{ color: '#FF7782' }} />
          <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
            Ako sa cítiť lepšie
          </h3>
        </div>
      </div>

      {/* Option 2: Connected Design - Content */}
      <div className="w-full space-y-6 glass-container bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-md border border-rose-200/30 border-t-0 shadow-xl rounded-b-xl p-6"
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
        
        {/* Phase Overview */}
        <PhaseOverview
          phaseRanges={phaseRanges}
          currentPhase={currentPhase}
        />
      </div>
    </>
  );
}