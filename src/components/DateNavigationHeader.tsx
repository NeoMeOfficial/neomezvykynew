import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DateNavigationHeaderProps {
  currentDate: string; // YYYY-MM-DD format
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onSettingsClick: () => void;
  hasAccessCode: boolean;
  isCompleted?: boolean;
  hasNextDay?: boolean;
}

export const DateNavigationHeader: React.FC<DateNavigationHeaderProps> = ({
  currentDate,
  onPreviousDay,
  onNextDay,
  onToday,
  onSettingsClick,
  hasAccessCode,
  isCompleted = false,
  hasNextDay = true
}) => {
  const formatDate = (dateString: string): string => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateString === todayStr) return 'Dnes';
    else if (dateString === yesterdayStr) return 'Včera';
    else {
      const date = new Date(dateString + 'T00:00:00');
      return `${date.getDate()}.${date.getMonth() + 1}`;
    }
  };

  const formatDisplayDate = (dateString: string): string => {
    return formatDate(dateString);
  };

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return currentDate === today;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-reflection-border/30 shadow-sm my-0 mx-0 px-[26px] py-[3px]">
      {/* Left Navigation Button */}
      <Button variant="ghost" size="sm" onClick={onPreviousDay} className="flex items-center gap-2 text-reflection-text hover:bg-reflection-muted/50">
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
            <div className="flex items-center justify-center gap-1 text-xs text-green-600">
              <span>✓</span>
              <span>Dokončené</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Access Code Button */}
        <Button variant="ghost" size="sm" onClick={onSettingsClick} className="text-reflection-text hover:bg-reflection-muted/50">
          {hasAccessCode ? (
            <Share className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>

        {/* "Dnes" Button - Only show when not viewing today */}
        {!isToday() && (
          <Button variant="ghost" size="sm" onClick={onToday} className="text-reflection-text hover:bg-reflection-muted/50">
            Dnes
          </Button>
        )}

        {/* Next Day Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onNextDay}
          disabled={!hasNextDay}
          className="text-reflection-text hover:bg-reflection-muted/50"
        >
          <span className="hidden sm:inline">Nasledujúci</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};