import React, { useState } from 'react';
import { Calendar, Heart, Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { sk } from 'date-fns/locale';
import { DerivedState, CycleData } from './types';
import { isPeriodDate, isFertilityDate } from './utils';

type OutcomeType = 'next-period' | 'fertile-days';

interface CalendarViewProps {
  cycleData: CycleData;
  derivedState: DerivedState;
  onOutcomeSelect: (outcome: OutcomeType | null) => void;
  selectedOutcome: OutcomeType | null;
}

export function CalendarView({ 
  cycleData, 
  derivedState, 
  onOutcomeSelect, 
  selectedOutcome 
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the days for the calendar grid (including padding)
  const startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1; // Convert Sunday = 0 to Monday = 0
  const daysInCalendar = [];
  
  // Add empty cells for the days before the month starts
  for (let i = 0; i < startDay; i++) {
    daysInCalendar.push(null);
  }
  
  // Add all days of the month
  monthDays.forEach(day => {
    daysInCalendar.push(day);
  });

  const getDayInfo = (date: Date) => {
    if (!cycleData.lastPeriodStart) return { isPeriod: false, isFertile: false };
    
    const lastPeriodDate = typeof cycleData.lastPeriodStart === 'string' 
      ? new Date(cycleData.lastPeriodStart) 
      : cycleData.lastPeriodStart;
    
    const isPeriod = isPeriodDate(date, lastPeriodDate.toISOString().split('T')[0], cycleData.cycleLength, cycleData.periodLength);
    const isFertile = isFertilityDate(date, lastPeriodDate.toISOString().split('T')[0], cycleData.cycleLength);
    
    return { isPeriod, isFertile };
  };

  const getCurrentDayPhase = (date: Date) => {
    if (!cycleData.lastPeriodStart) return null;
    
    const lastPeriodDate = typeof cycleData.lastPeriodStart === 'string' 
      ? new Date(cycleData.lastPeriodStart) 
      : cycleData.lastPeriodStart;
    
    const daysSinceStart = Math.floor((date.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = ((daysSinceStart % cycleData.cycleLength) + cycleData.cycleLength) % cycleData.cycleLength + 1;
    
    // Find which phase this day belongs to
    return derivedState.phaseRanges.find(phase => cycleDay >= phase.start && cycleDay <= phase.end);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  return (
    <div className="space-y-4">
      {/* Header with Filter Buttons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium" style={{ color: '#955F6A' }}>
            Kalendárny prehľad
          </h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedOutcome === 'next-period' ? 'default' : 'outline'}
              onClick={() => onOutcomeSelect(selectedOutcome === 'next-period' ? null : 'next-period')}
              className="flex items-center gap-1.5 text-xs"
            >
              <Droplets className="w-3 h-3" />
              Ďalšia perioda
            </Button>
            <Button
              size="sm"
              variant={selectedOutcome === 'fertile-days' ? 'default' : 'outline'}
              onClick={() => onOutcomeSelect(selectedOutcome === 'fertile-days' ? null : 'fertile-days')}
              className="flex items-center gap-1.5 text-xs"
            >
              <Heart className="w-3 h-3" />
              Plodné dni
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <span style={{ color: '#955F6A' }}>Menštruácia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-pink-300"></div>
            <span style={{ color: '#955F6A' }}>Plodné dni</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border-2 border-rose-400"></div>
            <span style={{ color: '#955F6A' }}>Dnes</span>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h4 className="text-lg font-medium" style={{ color: '#955F6A' }}>
          {format(currentMonth, 'LLLL yyyy', { locale: sk })}
        </h4>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium py-2"
              style={{ color: '#955F6A' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {daysInCalendar.map((date, index) => {
            if (!date) {
              return <div key={index} className="aspect-square"></div>;
            }

            const dayInfo = getDayInfo(date);
            const isCurrentDay = isToday(date);
            const phase = getCurrentDayPhase(date);
            
            let dayClasses = "aspect-square flex items-center justify-center text-sm rounded-lg transition-all cursor-pointer relative";
            let dayStyle: React.CSSProperties = { color: '#955F6A' };
            
            // Highlight based on selected outcome
            if (selectedOutcome === 'next-period' && dayInfo.isPeriod) {
              dayClasses += " bg-rose-400 text-white hover:bg-rose-500";
              dayStyle = { color: 'white' };
            } else if (selectedOutcome === 'fertile-days' && dayInfo.isFertile) {
              dayClasses += " bg-pink-300 text-white hover:bg-pink-400";
              dayStyle = { color: 'white' };
            } else if (!selectedOutcome) {
              // Show normal phase colors when no filter is active
              if (dayInfo.isPeriod) {
                dayClasses += " bg-rose-100 border border-rose-300";
              } else if (dayInfo.isFertile) {
                dayClasses += " bg-pink-50 border border-pink-200";
              } else {
                dayClasses += " hover:bg-white/80";
              }
            } else {
              dayClasses += " hover:bg-white/80";
            }

            // Today's border
            if (isCurrentDay) {
              dayClasses += " ring-2 ring-rose-400 ring-offset-2";
            }

            return (
              <div
                key={date.getTime()}
                className={dayClasses}
                style={dayStyle}
              >
                <span className="relative z-10">
                  {format(date, 'd')}
                </span>
                
                {/* Today indicator */}
                {isCurrentDay && !selectedOutcome && (
                  <div className="absolute inset-0 rounded-lg bg-rose-400/20"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Selection Info */}
      {selectedOutcome && (
        <div className="mt-4 p-3 bg-white/80 rounded-lg border border-rose-200/50">
          <div className="flex items-center gap-2 mb-2">
            {selectedOutcome === 'next-period' ? (
              <Droplets className="w-4 h-4 text-rose-400" />
            ) : (
              <Heart className="w-4 h-4 text-pink-400" />
            )}
            <span className="font-medium text-sm" style={{ color: '#955F6A' }}>
              {selectedOutcome === 'next-period' ? 'Perioda' : 'Plodné dni'}
            </span>
          </div>
          <p className="text-xs" style={{ color: '#955F6A' }}>
            {selectedOutcome === 'next-period' 
              ? 'Červené dni označujú očakávanú menštruáciu na základe vášho cyklu.'
              : 'Ružové dni označujú plodné dni, kedy je najväčšia pravdepodobnosť otehotnenia.'
            }
          </p>
        </div>
      )}
    </div>
  );
}