import React, { useState } from 'react';
import { CalendarDays, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareCalendarDialog } from '@/components/ShareCalendarDialog';
import { CalendarView } from '../CalendarView';
import { CycleData, DerivedState, PeriodIntensity } from '../types';
interface CalendarViewSectionProps {
  cycleData: CycleData;
  derivedState: DerivedState;
  onOutcomeSelect: (outcome: 'next-period' | 'fertile-days' | 'ovulation' | null) => void;
  selectedOutcome: 'next-period' | 'fertile-days' | 'ovulation' | null;
  onPeriodIntensityChange: (date: string, intensity: PeriodIntensity | null) => void;
  getPeriodIntensity: (date: string) => PeriodIntensity | undefined;
  accessCode?: string;
  onAccessCodeGenerated?: (code: string) => void;
}
export function CalendarViewSection({
  cycleData,
  derivedState,
  onOutcomeSelect,
  selectedOutcome,
  onPeriodIntensityChange,
  getPeriodIntensity,
  accessCode,
  onAccessCodeGenerated
}: CalendarViewSectionProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  return <>
      {/* Layered Glass - Multiple glass layers creating depth between header/content */}
      <div className="relative">
        {/* Background layer */}
        <div className="absolute inset-0 rounded-2xl z-0" style={{
        background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.3) 0%, rgba(253, 242, 248, 0.4) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transform: 'translate(2px, 2px)'
      }}></div>
        
        {/* Header with elevated glass layer */}
        <div className="relative px-4 py-5 sm:px-6 rounded-t-2xl z-10" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.95) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(149, 95, 106, 0.1)'
      }}>
          {/* Header glass accent */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent"></div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <CalendarDays className="w-5 h-5 flex-shrink-0" style={{
              color: '#FF7782'
            }} />
              <h3 className="text-lg font-medium truncate" style={{
              color: '#FF7782'
            }}>
                Kalendárny prehľad
              </h3>
            </div>
            
            {/* Share Calendar Button */}
            
          </div>
        </div>

        {/* Content with recessed glass layer */}
        <div className="px-4 py-6 sm:px-6 sm:py-8 rounded-b-2xl z-10 relative" style={{
        background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.75) 0%, rgba(253, 242, 248, 0.80) 100%)',
        boxShadow: 'inset 0 2px 8px rgba(149, 95, 106, 0.05)'
      }} data-tour="calendar-view">
          <CalendarView cycleData={cycleData} derivedState={derivedState} onOutcomeSelect={onOutcomeSelect} selectedOutcome={selectedOutcome} onPeriodIntensityChange={onPeriodIntensityChange} getPeriodIntensity={getPeriodIntensity} accessCode={accessCode} />
        </div>
      </div>
      
      {/* Share Calendar Dialog */}
      <ShareCalendarDialog open={showShareDialog} onOpenChange={setShowShareDialog} accessCode={accessCode} onAccessCodeGenerated={onAccessCodeGenerated} />
    </>;
}