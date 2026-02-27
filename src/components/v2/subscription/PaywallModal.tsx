import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Crown, Star, Heart, Calendar, BookOpen } from 'lucide-react';
import { colors } from '../../../theme/warmDusk';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'period_tracker' | 'daily_reflections' | 'habits';
  title?: string;
}

const FEATURE_CONFIG = {
  period_tracker: {
    icon: Calendar,
    title: 'Sledovanie cyklu',
    description: 'Ukladanie a sledovanie dát o tvojom menštruačnom cykle',
    benefits: [
      'Neobmedzené ukladanie symptómov',
      'Predikcie ďalšej menštruácie',
      'Personalizované odporúčania',
      'Historické analýzy a trendy'
    ]
  },
  daily_reflections: {
    icon: BookOpen,
    title: 'Denné reflexie',
    description: 'Ukladanie a sledovanie tvojich denných úvah a pocitov',
    benefits: [
      'Neobmedzené ukladanie reflexií',
      'Sledovanie nálad a pokroku',
      'Osobný denník a poznámky',
      'Motivačné pripomienky'
    ]
  },
  habits: {
    icon: Heart,
    title: 'Sledovanie návykov',
    description: 'Ukladanie a sledovanie tvojich zdravých návykov',
    benefits: [
      'Neobmedzené sledovanie návykov',
      'Pokroková štatistika',
      'Motivačné výzvy',
      'Personalizované ciele'
    ]
  }
} as const;

export default function PaywallModal({ isOpen, onClose, feature, title }: PaywallModalProps) {
  const navigate = useNavigate();
  const config = FEATURE_CONFIG[feature];
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/subscribe');
      onClose();
    }, 200);
  };

  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div 
        className={`bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl transform transition-transform ${
          isAnimating ? 'scale-95' : 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {title || config.title}
              </h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Prémiová funkcia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" style={{ color: colors.textTertiary }} />
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
            {config.description}
          </p>
          
          <div className="bg-gradient-to-r rounded-2xl p-4 text-center text-white mb-4"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Crown className="w-5 h-5" />
              <span className="text-sm font-bold">Len pre predplatiteľky</span>
            </div>
            <div className="text-xs opacity-90">
              Odomknúť všetky funkcie už za €14.90/mesiac
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h4 className="text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>
            Čo získaš s predplatným:
          </h4>
          <div className="space-y-2">
            {config.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center p-3 rounded-2xl border-2 border-gray-200">
            <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              €14.90
            </div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>
              mesačne
            </div>
          </div>
          <div className="text-center p-3 rounded-2xl border-2 border-yellow-300 bg-yellow-50">
            <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              €143
            </div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>
              ročne (-20%)
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-lg transition-transform active:scale-95"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}
          >
            Vyskúšať zadarmo (7 dní)
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-medium transition-colors"
            style={{ color: colors.textTertiary }}
          >
            Možno neskôr
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-center mt-4" style={{ color: colors.textTertiary }}>
          Zrušiteľné kedykoľvek. Žiadne poplatky počas skúšobnej doby.
        </p>
      </div>
    </div>
  );
}