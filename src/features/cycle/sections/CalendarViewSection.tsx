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
        <div className="relative p-4 rounded-t-2xl z-10"
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.95) 100%)',
               boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(149, 95, 106, 0.1)'
             }}>
          {/* Header glass accent */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent"></div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5" style={{ color: '#FF7782' }} />
            <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
              Kalendárny pohľad
            </h3>
          </div>
        </div>

        {/* Content with recessed glass layer */}
        <div className="p-6 space-y-6 rounded-b-2xl z-10 relative"
             style={{ 
               background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.75) 0%, rgba(253, 242, 248, 0.80) 100%)',
               boxShadow: 'inset 0 2px 8px rgba(149, 95, 106, 0.05)'
             }}>
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