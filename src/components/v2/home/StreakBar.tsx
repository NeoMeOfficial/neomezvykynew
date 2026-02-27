import { Flame, CheckCircle2, Calendar } from 'lucide-react';
import GlassCard from '../GlassCard';
import { colors } from '../../../theme/warmDusk';

const stats = [
  { icon: Flame, label: 'Tréningy', value: '4', color: colors.telo },
  { icon: CheckCircle2, label: 'Návyky', value: '85%', color: colors.strava },
  { icon: Calendar, label: 'Aktívne dni', value: '5/7', color: colors.accent },
];

export default function StreakBar() {
  return (
    <GlassCard className="!p-3">
      <div className="flex justify-between">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2 flex-1 justify-center">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
              <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none" style={{ color: colors.textPrimary }}>{s.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: colors.textTertiary }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
