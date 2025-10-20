import { format, addDays } from 'date-fns';
import { sk } from 'date-fns/locale';

interface NextDatesInfoProps {
  lastPeriodStart: string | null;
  cycleLength: number;
}

export function NextDatesInfo({ lastPeriodStart, cycleLength }: NextDatesInfoProps) {
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
  );
}
