import { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Gift, X } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

interface CelebratoryBannerProps {
  discountCode: string;
  discountValue: number;
  onClose: () => void;
  show: boolean;
}

export function CelebratoryBanner({ 
  discountCode, 
  discountValue, 
  onClose, 
  show 
}: CelebratoryBannerProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimate(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div 
        className={`relative max-w-sm w-full rounded-3xl p-6 shadow-2xl transform transition-all duration-500 ${
          animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(40px)',
          border: '2px solid rgba(107,76,59,0.2)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{
            backgroundColor: 'rgba(107,76,59,0.1)',
          }}
        >
          <X size={16} style={{ color: colors.textTertiary }} />
        </button>

        {/* Celebration Animation */}
        <div className="text-center relative">
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 relative animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
            }}
          >
            <CheckCircle size={32} className="text-white" />
            
            {/* Floating Sparkles */}
            <Sparkles 
              size={16} 
              className="absolute -top-2 -right-2 text-yellow-400 animate-bounce"
              style={{ animationDelay: '0s' }}
            />
            <Sparkles 
              size={12} 
              className="absolute -bottom-1 -left-2 text-yellow-400 animate-bounce"
              style={{ animationDelay: '0.5s' }}
            />
            <Gift 
              size={14} 
              className="absolute -top-1 -left-3 text-pink-400 animate-bounce"
              style={{ animationDelay: '1s' }}
            />
          </div>

          <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            🎉 Úžasne!
          </h3>
          
          <p className="text-base font-semibold mb-3" style={{ color: '#10B981' }}>
            Zľavový kód bol aplikovaný
          </p>

          <div 
            className="p-4 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.15))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div 
                className="px-4 py-2 rounded-xl font-mono font-bold text-lg tracking-wider"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#059669',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                }}
              >
                {discountCode}
              </div>
            </div>
            
            <p className="text-2xl font-black mb-1" style={{ color: '#059669' }}>
              -{discountValue}% ZĽAVA
            </p>
            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              Kód je aktívny a pripravený na použitie
            </p>
          </div>

          <div 
            className="px-6 py-3 rounded-2xl text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(107,76,59,0.1), rgba(107,76,59,0.15))',
              color: colors.telo,
            }}
          >
            Pokračuj v nákupe a ušetri! 💝
          </div>
        </div>

        {/* Celebratory Confetti Effect (CSS Animation) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][i % 5],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animation: `celebration-float 3s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes celebration-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-10px) rotate(90deg) scale(1.1); }
          50% { transform: translateY(-5px) rotate(180deg) scale(0.9); }
          75% { transform: translateY(-15px) rotate(270deg) scale(1.05); }
        }
      `}</style>
    </div>
  );
}