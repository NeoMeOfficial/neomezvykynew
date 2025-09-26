import React from 'react';
import { FileText } from 'lucide-react';
import { SymptomTracker } from '../SymptomTracker';
import { PhaseKey } from '../types';

interface TrackEssentialsSectionProps {
  currentPhase: PhaseKey;
  currentDay: number;
  accessCode?: string;
}

export function TrackEssentialsSection({
  currentPhase,
  currentDay,
  accessCode
}: TrackEssentialsSectionProps) {
  return (
    <>
      {/* Glass Separation - Different glass-morphism opacity for header vs content */}
      <div className="w-full glass-container backdrop-blur-md border border-rose-200/30 shadow-xl rounded-2xl overflow-hidden"
           style={{ 
             backdropFilter: 'blur(16px)',
             WebkitBackdropFilter: 'blur(16px)',
             boxShadow: '0 8px 32px rgba(149, 95, 106, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
             transform: 'translateY(0)',
             transition: 'transform 0.3s ease'
           }}
           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        
        {/* Header with higher opacity glass */}
        <div className="p-4" 
             style={{ 
               background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.95) 0%, rgba(253, 242, 248, 0.98) 100%)',
             }}>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" style={{ color: '#FF7782' }} />
            <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
              Zaznač si to podstatné
            </h3>
          </div>
        </div>

        {/* Content with lower opacity glass */}
        <div className="p-6 space-y-6"
             style={{ 
               background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.70) 0%, rgba(253, 242, 248, 0.75) 100%)',
             }}>
          <SymptomTracker
            currentPhase={currentPhase}
            currentDay={currentDay}
            accessCode={accessCode}
          />
        </div>
      </div>
    </>
  );
}