import { format, addDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Lightbulb } from 'lucide-react';

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
  onEditClick
}: NextDatesInfoProps) {
  
  const formatDate = (date: Date) => {
    const formatted = format(date, 'd. M. yyyy', { locale: sk });
    return formatted;
  };

  // Calculate dates if lastPeriodStart exists
  const startDate = lastPeriodStart ? new Date(lastPeriodStart) : null;
  const nextPeriodDate = startDate ? addDays(startDate, cycleLength) : null;
  
  // Calculate fertile window (ovulation typically 14 days before next period)
  const ovulationDay = cycleLength - 14;
  const fertilityStartDay = ovulationDay - 2; // 3 days window
  const fertilityEndDay = ovulationDay;
  
  const fertilityStart = startDate ? addDays(startDate, fertilityStartDay) : null;
  const fertilityEnd = startDate ? addDays(startDate, fertilityEndDay) : null;

  return (
    <div className="space-y-2">
      {/* Last period start date */}
      <div className="p-3 rounded-lg" 
           style={{ 
             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
           }}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
            Posledná menštruácia: {lastPeriodStart ? (
              <span style={{ color: '#FF7782' }}>
                {formatDate(startDate!)}
              </span>
            ) : null}
          </p>
          {onEditClick && (
            <button
              onClick={onEditClick}
              className="px-2 py-1 text-xs font-medium rounded-lg bg-white/50 hover:bg-white/80 transition-colors flex-shrink-0"
              style={{ color: '#FF7782' }}
            >
              {lastPeriodStart ? 'Zmeniť' : 'Zadaj'}
            </button>
          )}
        </div>
      </div>

      {/* Predicted next period - only show if lastPeriodStart exists */}
      {lastPeriodStart && nextPeriodDate && (
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
      )}

      {/* Fertile window info - only show if lastPeriodStart exists */}
      {lastPeriodStart && fertilityStart && fertilityEnd && (
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
      )}

    </div>
  );
}
