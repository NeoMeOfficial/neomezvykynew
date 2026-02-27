import { useState } from 'react';
import { ChefHat, ArrowRight, X, Sparkles } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

interface RecipePromoBannerProps {
  onDismiss: () => void;
  onViewMore: () => void;
}

export function RecipePromoBanner({ onDismiss, onViewMore }: RecipePromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-fadeIn">
      <div 
        className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 ease-out"
        style={{
          background: `linear-gradient(135deg, ${colors.strava}20, ${colors.accent}15)`,
          border: `2px solid ${colors.strava}40`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-3 right-12 animate-bounce delay-200">
            <Sparkles size={14} style={{ color: colors.accent }} />
          </div>
          <div className="absolute top-8 right-20 animate-bounce delay-500">
            <Sparkles size={10} style={{ color: colors.strava }} />
          </div>
          <div className="absolute top-6 left-16 animate-bounce delay-700">
            <Sparkles size={12} style={{ color: colors.mysel }} />
          </div>
        </div>

        {/* Header */}
        <div 
          className="p-4 pb-3"
          style={{
            background: `linear-gradient(135deg, ${colors.strava}, ${colors.strava}DD)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ChefHat size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white leading-tight">
                Objavuj nové chute!
              </h3>
              <p className="text-white/90 text-sm mt-0.5">
                Ešte viac receptov ťa čaká
              </p>
            </div>
            <button 
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-all"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-white/95 backdrop-blur-sm">
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-2xl font-black" style={{ color: colors.strava }}>108</div>
                <p className="text-xs text-gray-600">receptov</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black" style={{ color: colors.accent }}>15</div>
                <p className="text-xs text-gray-600">kategórií</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black" style={{ color: colors.mysel }}>✨</div>
                <p className="text-xs text-gray-600">pre alergikov</p>
              </div>
            </div>
            
            <p className="text-sm text-center font-medium" style={{ color: colors.textPrimary }}>
              Zdravé, chutné a jednoduché recepty pre každý deň. Nájdi svoje nové obľúbené jedlo!
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div 
              className="px-4 py-2.5 rounded-xl text-sm font-bold border-2 bg-white/80 backdrop-blur-sm text-center"
              style={{ 
                borderColor: `${colors.strava}60`,
                color: colors.strava,
              }}
            >
              Všetky recepty zadarmo
            </div>
            
            <button
              onClick={onViewMore}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-95"
              style={{ 
                background: `linear-gradient(135deg, ${colors.strava}, ${colors.strava}DD)`,
              }}
            >
              Prezri knižnicu
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}