import { Calendar, Droplets, Heart, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { format, addDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { CycleData } from './types';

interface CycleInfoSectionProps {
  cycleData: CycleData;
}

export function CycleInfoSection({ cycleData }: CycleInfoSectionProps) {
  if (!cycleData.lastPeriodStart) return null;
  
  const startDate = new Date(cycleData.lastPeriodStart);
  const endDate = addDays(startDate, cycleData.periodLength - 1);
  const nextPeriodDate = addDays(startDate, cycleData.cycleLength);
  
  // Výpočet fertilného okna (5 dní pred ovuláciou + 1 deň po ovulácii)
  const ovulationDay = cycleData.cycleLength - 14;
  const fertileStartDay = Math.max(1, ovulationDay - 5);
  const fertileEndDay = Math.min(cycleData.cycleLength, ovulationDay + 1);
  const fertileStartDate = addDays(startDate, fertileStartDay - 1);
  const fertileEndDate = addDays(startDate, fertileEndDay - 1);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/50">
      <h3 className="text-lg font-semibold mb-4 text-rose-900 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Menštruačný kalendár
      </h3>
      
      <div className="space-y-3">
        <InfoRow
          icon={<Droplets className="w-4 h-4 text-rose-500" />}
          label="Posledná menštruácia"
          value={format(startDate, 'PPP', { locale: sk })}
        />
        
        <InfoRow
          icon={<Droplets className="w-4 h-4 text-rose-400" />}
          label="Koniec menštruácie"
          value={format(endDate, 'PPP', { locale: sk })}
        />
        
        <InfoRow
          icon={<Calendar className="w-4 h-4 text-purple-500" />}
          label="Odhadovaná ďalšia perióda"
          value={format(nextPeriodDate, 'PPP', { locale: sk })}
        />
        
        <InfoRow
          icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
          label="Dĺžka cyklu"
          value={`${cycleData.cycleLength} dní (automaticky vypočítané)`}
        />
        
        <InfoRow
          icon={<Heart className="w-4 h-4 text-pink-500" />}
          label="Odhadované plodné dni"
          value={`${format(fertileStartDate, 'PPP', { locale: sk })} - ${format(fertileEndDate, 'PPP', { locale: sk })}`}
        />
      </div>
      
      <div className="mt-4 p-3 bg-rose-100/50 rounded-lg">
        <p className="text-xs text-rose-800">
          ℹ️ Tieto údaje sú orientačné a nie diagnostické. Použite ich len na informačné účely.
        </p>
      </div>
    </Card>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-rose-900">{label}</p>
        <p className="text-sm text-rose-700">{value}</p>
      </div>
    </div>
  );
}
