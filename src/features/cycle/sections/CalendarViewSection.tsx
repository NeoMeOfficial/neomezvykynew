import React from 'react';
import { CalendarDays } from 'lucide-react';
import { CalendarView } from '../CalendarView';
import { CycleData, DerivedState } from '../types';

interface CalendarViewSectionProps {
  cycleData: CycleData;
  derivedState: DerivedState;
  onOutcomeSelect: (outcome: 'next-period' | 'fertile-days' | null) => void;
  selectedOutcome: 'next-period' | 'fertile-days' | null;
}

export function CalendarViewSection({
  cycleData,
  derivedState,
  onOutcomeSelect,
  selectedOutcome
}: CalendarViewSectionProps) {
  return (
    <>
      {/* Section Header: Kalendárny pohľad */}
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
          <CalendarDays className="w-5 h-5" style={{ color: '#FF7782' }} />
          <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
            Kalendárny pohľad
          </h3>
        </div>
      </div>

      <div className="w-full space-y-6 rounded-2xl p-6"
           style={{ backgroundColor: '#FBF8F9' }}>
        
        {/* Calendar View */}
        <div className="glass-container bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-md border border-rose-200/30 shadow-xl rounded-xl p-4"
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
          <CalendarView
            cycleData={cycleData}
            derivedState={derivedState}
            onOutcomeSelect={onOutcomeSelect}
            selectedOutcome={selectedOutcome}
          />
        </div>
      </div>
    </>
  );
}