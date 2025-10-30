import { useState } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Lightbulb, Calendar, AlertCircle } from 'lucide-react';
import { PeriodConfirmationDialog } from './PeriodConfirmationDialog';

interface NextDatesInfoProps {
  lastPeriodStart: string | null;
  cycleLength: number;
  onEditClick?: () => void;
  onPeriodStart?: (date: Date) => void;
  onPeriodEnd?: (startDate: Date, endDate: Date) => void;
  onUseCustomDatePicker?: () => void;
}

export function NextDatesInfo({ 
  lastPeriodStart, 
  cycleLength, 
  onEditClick,
  onPeriodStart,
  onPeriodEnd,
  onUseCustomDatePicker
}: NextDatesInfoProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  if (!lastPeriodStart) return null;

  const startDate = new Date(lastPeriodStart);
  const nextPeriodDate = addDays(startDate, cycleLength);
  const today = new Date();
  const daysUntilPeriod = differenceInDays(nextPeriodDate, today);
  
  // Calculate fertile window (ovulation typically 14 days before next period)
  const ovulationDay = cycleLength - 14;
  const fertilityStartDay = ovulationDay - 2; // 3 days window
  const fertilityEndDay = ovulationDay;
  
  const fertilityStart = addDays(startDate, fertilityStartDay);
  const fertilityEnd = addDays(startDate, fertilityEndDay);

  const formatDate = (date: Date) => {
    const formatted = format(date, 'd. M. yyyy', { locale: sk });
    return formatted;
  };

  const handlePeriodStart = (date: Date) => {
    onPeriodStart?.(date);
  };

  const handlePeriodEnd = (startDate: Date, endDate: Date) => {
    onPeriodEnd?.(startDate, endDate);
  };

  // Determine UI state based on days until period
  const getUIState = () => {
    if (daysUntilPeriod > 6) return 'info';
    if (daysUntilPeriod >= 3) return 'approaching';
    if (daysUntilPeriod >= 0) return 'imminent';
    if (daysUntilPeriod >= -3) return 'overdue';
    return 'late';
  };

  const uiState = getUIState();

  return (
    <div className="space-y-2">
      {/* Predicted next period - always show */}
      <div className="p-3 rounded-lg" 
           style={{ 
             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
           }}>
        <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
          Odhadovaná ďalšia perióda: <span style={{ color: '#FF7782' }}>
            {formatDate(nextPeriodDate)}
          </span>
        </p>
      </div>

      {/* Fertile window info - always show */}
      <div className="p-3 rounded-lg"
           style={{ 
             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
           }}>
        <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
          Odhadované plodné dni: <span style={{ color: '#FF7782' }}>
            {formatDate(fertilityStart)} - {formatDate(fertilityEnd)}
          </span>
        </p>
      </div>

      {/* Smart period prediction button/info */}
      {uiState === 'info' && (
        <button
          onClick={() => setDialogOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium rounded-3xl bg-white border border-rose-200/20 hover:bg-rose-50 transition-all"
          style={{ color: '#FF7782' }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Ďalšia menštruácia by ti mala začať: {formatDate(nextPeriodDate)}</span>
          </div>
        </button>
      )}

      {uiState === 'approaching' && (
        <button
          onClick={() => setDialogOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium rounded-3xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all"
          style={{ color: '#d97706' }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>O {Math.abs(daysUntilPeriod)} {Math.abs(daysUntilPeriod) === 1 ? 'deň' : 'dni'} by mala začať menštruácia</span>
          </div>
          <span className="text-xs opacity-70">Klikni pre potvrdenie</span>
        </button>
      )}

      {uiState === 'imminent' && (
        <button
          onClick={() => setDialogOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium rounded-3xl bg-rose-50 border border-rose-300 hover:bg-rose-100 transition-all animate-pulse"
          style={{ color: '#FF7782' }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Menštruácia by mala začať {daysUntilPeriod === 0 ? 'dnes' : `o ${daysUntilPeriod} ${daysUntilPeriod === 1 ? 'deň' : 'dni'}`}</span>
          </div>
          <span className="text-xs font-bold">Už začala?</span>
        </button>
      )}

      {(uiState === 'overdue' || uiState === 'late') && (
        <button
          onClick={() => setDialogOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium rounded-3xl bg-red-50 border-2 border-red-400 hover:bg-red-100 transition-all"
          style={{ color: '#dc2626' }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Menštruácia mešká {Math.abs(daysUntilPeriod)} {Math.abs(daysUntilPeriod) === 1 ? 'deň' : 'dní'}</span>
          </div>
          <span className="text-xs font-bold">Potvrdiť začiatok</span>
        </button>
      )}
      
      {/* Edit period date button */}
      {onEditClick && (
        <button
          onClick={onEditClick}
          className="w-full flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-3xl bg-white border border-rose-200/20 hover:bg-gray-50 transition-all"
          style={{ color: '#FF7782' }}
        >
          <Lightbulb className="w-3 h-3" />
          Zmeniť dátum menštruácie
        </button>
      )}

      <PeriodConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        predictedDate={nextPeriodDate}
        onConfirmStart={handlePeriodStart}
        onConfirmEnd={handlePeriodEnd}
        onUseCustomDatePicker={onUseCustomDatePicker}
      />
    </div>
  );
}
