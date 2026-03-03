import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight, X } from 'lucide-react';
import { colors } from '../../../theme/warmDusk';
import { useState } from 'react';

interface SubscriptionPromoBannerProps {
  variant?: 'compact' | 'full';
  dismissible?: boolean;
  onDismiss?: () => void;
}

export default function SubscriptionPromoBanner({ 
  variant = 'full', 
  dismissible = false,
  onDismiss 
}: SubscriptionPromoBannerProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleSubscribe = () => {
    navigate('/subscribe');
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/30 relative">
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 hover:bg-white/25 rounded-full"
          >
            <X className="w-4 h-4" style={{ color: colors.textTertiary }} />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}
          >
            <Star className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-bold text-sm" style={{ color: colors.textPrimary }}>
              Odomknúť všetky funkcie
            </h4>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              7-dňová bezplatná skúška
            </p>
          </div>
          
          <button
            onClick={handleSubscribe}
            className="px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md transition-transform active:scale-95"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}
          >
            Začať
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/30 relative">
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 hover:bg-white/25 rounded-full"
        >
          <X className="w-4 h-4" style={{ color: colors.textTertiary }} />
        </button>
      )}
      
      <div className="text-center">
        <div 
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}
        >
          <Star className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          Odomknúť plný potenciál NeoMe
        </h3>
        
        <p className="mb-4" style={{ color: colors.textSecondary }}>
          Získaj prístup k všetkým programom, jedálnym plánom a exkluzívnemu obsahu
        </p>

        <div className="bg-gradient-to-r rounded-2xl p-4 mb-6 text-white text-center"
          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}
        >
          <div className="text-2xl font-bold mb-1">€14.90/mesiac</div>
          <div className="text-sm opacity-90">7-dňová bezplatná skúška</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.strava }}></div>
            <span style={{ color: colors.textPrimary }}>Všetky cvičebné programy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            <span style={{ color: colors.textPrimary }}>Jedálne plány</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.periodka }}></div>
            <span style={{ color: colors.textPrimary }}>Sledovanie cyklu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.mysel }}></div>
            <span style={{ color: colors.textPrimary }}>Prístup do komunity</span>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          className="w-full py-3 rounded-2xl text-white font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}
        >
          Vyskúšať zadarmo
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs mt-3" style={{ color: colors.textTertiary }}>
          Zrušiteľné kedykoľvek. Žiadne poplatky počas skúšobnej doby.
        </p>
      </div>
    </div>
  );
}