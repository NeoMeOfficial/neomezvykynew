import { useState, useEffect } from 'react';
import { Check, Sparkles, X, Gift } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

interface DiscountAppliedBannerProps {
  discountCode: string;
  discountValue: number;
  originalPrice: number;
  onDismiss?: () => void;
  autoHide?: number; // Auto hide after X seconds
}

export function DiscountAppliedBanner({ 
  discountCode, 
  discountValue, 
  originalPrice,
  onDismiss,
  autoHide = 5000
}: DiscountAppliedBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const discountAmount = Math.round((originalPrice * discountValue) / 100);
  const finalPrice = originalPrice - discountAmount;

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHide);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide]);

  useEffect(() => {
    // Animation entrance
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
        isAnimating ? 'translate-y-[-100px] opacity-0' : 'translate-y-0 opacity-100'
      } ${!isVisible ? 'translate-y-[-100px] opacity-0' : ''}`}
    >
      <div 
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${colors.telo}25, ${colors.accent}20)`,
          border: `2px solid ${colors.telo}40`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Animated sparkles background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-2 right-8 animate-bounce delay-100">
            <Sparkles size={16} style={{ color: colors.accent }} />
          </div>
          <div className="absolute top-6 right-16 animate-bounce delay-300">
            <Sparkles size={12} style={{ color: colors.telo }} />
          </div>
          <div className="absolute top-8 left-12 animate-bounce delay-500">
            <Sparkles size={14} style={{ color: colors.mysel }} />
          </div>
        </div>

        {/* Main content */}
        <div className="relative p-4">
          <div className="flex items-center gap-4">
            {/* Success icon */}
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${colors.telo}, ${colors.telo}DD)`,
              }}
            >
              <div className="relative">
                <Check size={24} className="text-white" strokeWidth={3} />
                <Gift size={12} className="absolute -top-1 -right-1 text-white/80" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Zľava aplikovaná!
                </h3>
                <div 
                  className="px-2.5 py-1 rounded-full text-xs font-black text-white animate-pulse"
                  style={{ 
                    background: `linear-gradient(135deg, #FF6B6B, #FF5252)`,
                  }}
                >
                  -{discountValue}%
                </div>
              </div>
              
              <p className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Kód <span className="font-bold" style={{ color: colors.telo }}>{discountCode}</span> bol úspešne použitý!
              </p>
              
              {/* Price breakdown */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="line-through text-gray-500">€{originalPrice}</span>
                  <span className="text-2xl font-black" style={{ color: colors.telo }}>€{finalPrice}</span>
                </div>
                <div 
                  className="px-2 py-1 rounded-md text-xs font-bold text-white"
                  style={{ background: colors.strava }}
                >
                  Ušetrených €{discountAmount}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button 
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-all"
            >
              <X size={16} style={{ color: colors.textSecondary }} />
            </button>
          </div>

          {/* Celebration message */}
          <div className="mt-3 p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30">
            <p className="text-center text-sm font-bold" style={{ color: colors.textPrimary }}>
              🎉 Skvelá voľba! Ušetriť sa oplatí.
            </p>
          </div>
        </div>

        {/* Progress bar for auto-hide */}
        {autoHide && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              className="h-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
              style={{
                animation: `shrink ${autoHide}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}