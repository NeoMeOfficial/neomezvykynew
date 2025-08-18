import React, { useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Utility functions
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const formatDisplayDate = (dateString: string): string => {
  const today = formatDate(new Date());
  const yesterday = getPreviousDate(today);
  
  if (dateString === today) {
    return 'Dnes';
  } else if (dateString === yesterday) {
    return 'Včera';
  } else {
    const date = new Date(dateString + 'T00:00:00');
    return `${date.getDate()}.${date.getMonth() + 1}`;
  }
};

const getPreviousDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  date.setDate(date.getDate() - 1);
  return formatDate(date);
};

const getNextDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  date.setDate(date.getDate() + 1);
  return formatDate(date);
};

interface DateNavigationHeaderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  isCompleted?: boolean;
  hasAccessCode: boolean;
  onSettingsClick: () => void;
}

export const DateNavigationHeader: React.FC<DateNavigationHeaderProps> = ({
  currentDate,
  onDateChange,
  isCompleted = false,
  hasAccessCode,
  onSettingsClick
}) => {
  const today = formatDate(new Date());
  const isToday = currentDate === today;
  const hasNextDay = currentDate < today;

  const goToPreviousDay = useCallback(() => {
    onDateChange(getPreviousDate(currentDate));
  }, [currentDate, onDateChange]);

  const goToNextDay = useCallback(() => {
    if (hasNextDay) {
      onDateChange(getNextDate(currentDate));
    }
  }, [currentDate, hasNextDay, onDateChange]);

  const goToToday = useCallback(() => {
    onDateChange(today);
  }, [today, onDateChange]);

  return (
    <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-reflection-border/30 shadow-sm my-0 mx-0 px-[26px] py-[3px]">
      
      {/* Left Navigation */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={goToPreviousDay} 
        className="flex items-center gap-2 text-reflection-text hover:bg-reflection-muted/50"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Predchádzajúci</span>
      </Button>
      
      {/* Center Date Display */}
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-reflection-text-soft" />
        <div className="text-center">
          <h1 className="text-lg font-semibold text-reflection-text">
            {formatDisplayDate(currentDate)}
          </h1>
          {isCompleted && (
            <div className="flex items-center justify-center gap-1 text-xs text-reflection-text-soft">
              <span>✓</span>
              <span>Dokončené</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Access Code Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSettingsClick}
          className="text-reflection-text hover:bg-reflection-muted/50"
        >
          {hasAccessCode ? (
            <Share className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
        
        {!isToday && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="text-reflection-text border-reflection-border hover:bg-reflection-muted/50"
          >
            Dnes
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={goToNextDay} 
          disabled={!hasNextDay}
          className="flex items-center gap-2 text-reflection-text hover:bg-reflection-muted/50 disabled:opacity-50"
        >
          <span className="hidden sm:inline">Nasledujúci</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};