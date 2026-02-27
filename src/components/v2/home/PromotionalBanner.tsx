import { Sparkles, ArrowRight } from 'lucide-react';
import { colors, glassCard } from '../../../theme/warmDusk';

interface PromotionalBannerProps {
  title: string;
  description: string;
  discountCode: string;
  discountValue: number;
  onClaim: () => void;
  type: 'program' | 'meal-planner';
}

export function PromotionalBanner({ 
  title, 
  description, 
  discountCode, 
  discountValue, 
  onClaim, 
  type 
}: PromotionalBannerProps) {
  const color = type === 'program' ? colors.telo : colors.periodka;
  
  return (
    <div 
      className="mt-3 rounded-2xl cursor-pointer active:scale-[0.98] transition-all overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}25)`,
        border: `2px solid ${color}40`,
        boxShadow: `0 8px 32px ${color}30`,
      }}
      onClick={onClaim}
    >
      {/* Header with better contrast */}
      <div 
        className="p-4 pb-2"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}DD)`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white leading-tight">
              {title}
            </h4>
            {discountValue > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/90 text-sm font-medium">Zľava</span>
                <div 
                  className="px-2.5 py-0.5 rounded-full text-xs font-black text-white shadow-sm"
                  style={{ 
                    background: 'rgba(255,107,107,0.9)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  -{discountValue}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content with better readability */}
      <div className="p-4 bg-white/95 backdrop-blur-sm">
        <p className="text-sm leading-relaxed font-medium mb-4" style={{ color: colors.textPrimary }}>
          {description}
        </p>
        
        <div className="flex items-center justify-between gap-3">
          {type === 'program' ? (
            <>
              <div 
                className="px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide border-2 bg-white/80 backdrop-blur-sm"
                style={{ 
                  borderColor: `${color}60`,
                  color: color,
                }}
              >
                Kód: {discountCode}
              </div>
              
              <div 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-95"
                style={{ 
                  background: `linear-gradient(135deg, ${color}, ${color}DD)`,
                }}
              >
                Použiť zľavu
                <ArrowRight size={16} />
              </div>
            </>
          ) : (
            <>
              <div 
                className="px-4 py-2.5 rounded-xl text-sm font-bold border-2 bg-white/80 backdrop-blur-sm"
                style={{ 
                  borderColor: `${color}60`,
                  color: color,
                }}
              >
                €47 / mesiac
              </div>
              
              <div 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-95"
                style={{ 
                  background: `linear-gradient(135deg, ${color}, ${color}DD)`,
                }}
              >
                Kúpiť teraz
                <ArrowRight size={16} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}