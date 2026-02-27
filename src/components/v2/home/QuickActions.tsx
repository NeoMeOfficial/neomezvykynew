import { Dumbbell, SmilePlus, UtensilsCrossed } from 'lucide-react';
import { colors } from '../../../theme/warmDusk';

const actions = [
  { icon: Dumbbell, label: 'Začať tréning', color: colors.telo },
  { icon: SmilePlus, label: 'Zaznamenať náladu', color: colors.accent },
  { icon: UtensilsCrossed, label: 'Dnešný recept', color: colors.strava },
];

export default function QuickActions() {
  return (
    <div className="flex gap-2">
      {actions.map((a) => (
        <button
          key={a.label}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl text-xs font-medium transition-all active:scale-95"
          style={{ background: `${a.color}12`, color: a.color }}
        >
          <a.icon className="w-3.5 h-3.5" strokeWidth={2} />
          <span className="truncate">{a.label}</span>
        </button>
      ))}
    </div>
  );
}
