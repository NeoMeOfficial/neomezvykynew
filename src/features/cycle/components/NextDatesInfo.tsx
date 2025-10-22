import { format, addDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Lightbulb } from 'lucide-react';

interface NextDatesInfoProps {
  lastPeriodStart: string | null;
  cycleLength: number;
  onEditClick?: () => void;
}

export function NextDatesInfo({ lastPeriodStart, cycleLength, onEditClick }: NextDatesInfoProps) {
  if (!lastPeriodStart) return null;

  const startDate = new Date(lastPeriodStart);
  const nextPeriodDate = addDays(startDate, cycleLength);
  
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

  return (
    <div className="space-y-2">
      <div className="p-3 rounded-lg" 
           style={{ 
             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
           }}>
        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
            Ďalšia menštruácia: <span style={{ color: '#FF7782' }}>
              {formatDate(nextPeriodDate)}
            </span>
          </p>
          <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
            Ďalšie plodné dni: <span style={{ color: '#FF7782' }}>
              {formatDate(fertilityStart)} - {formatDate(fertilityEnd)}
            </span>
          </p>
        </div>
      </div>
      
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
    </div>
  );
}
