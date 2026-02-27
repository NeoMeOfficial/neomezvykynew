import { useState } from 'react';
import { X, Sparkles, Moon, Droplets, Heart } from 'lucide-react';
import GlassCard from '../GlassCard';
import { colors } from '../../../theme/warmDusk';

const nudges = [
  {
    icon: Moon,
    title: 'Luteálna fáza — dopraj si odpočinok',
    text: 'Tvoje telo regeneruje. Vyskúšaj dnes jemnejší tréning alebo jogu.',
    color: colors.accent,
    bg: `linear-gradient(135deg, ${colors.accent}18, ${colors.telo}0C)`,
  },
  {
    icon: Droplets,
    title: 'Nezabudni na hydratáciu',
    text: 'Vypila si zatiaľ 3 z 8 pohárov. Daj si ďalší! 💧',
    color: colors.strava,
    bg: `linear-gradient(135deg, ${colors.strava}18, ${colors.accent}0C)`,
  },
  {
    icon: Heart,
    title: 'Katka a 12 ďalších žien dnes cvičili',
    text: 'Pridaj sa k nim — tréning na 20 minút ťa čaká.',
    color: colors.periodka,
    bg: `linear-gradient(135deg, ${colors.periodka}18, ${colors.accent}0C)`,
  },
];

export default function SmartNudge() {
  const [dismissed, setDismissed] = useState(false);
  const [idx] = useState(() => Math.floor(Math.random() * nudges.length));

  if (dismissed) return null;
  const n = nudges[idx];
  const Icon = n.icon;

  return (
    <GlassCard className="!p-4 relative" style={{ background: n.bg }}>
      <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5">
        <X className="w-3.5 h-3.5" style={{ color: colors.textTertiary }} />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${n.color}20` }}>
          <Icon className="w-4 h-4" style={{ color: n.color }} strokeWidth={1.5} />
        </div>
        <div className="pr-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3" style={{ color: colors.accent }} />
            <p className="text-xs font-semibold" style={{ color: colors.textPrimary }}>{n.title}</p>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>{n.text}</p>
        </div>
      </div>
    </GlassCard>
  );
}
