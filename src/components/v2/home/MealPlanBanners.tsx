import { ChefHat, ArrowRight, Sparkles, Heart, Target, Clock } from 'lucide-react';
import { colors } from '../../../theme/warmDusk';

interface MealPlanBannerProps {
  onPurchase: () => void;
  variant: 1 | 2 | 3 | 4;
}

// Variant 1: Macronutrient Balance Focus
function MealPlanBanner1({ onPurchase }: { onPurchase: () => void }) {
  return (
    <div 
      className="mt-3 rounded-3xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${colors.strava}15, ${colors.accent}10)`,
        border: `2px solid ${colors.strava}30`,
      }}
      onClick={onPurchase}
    >
      {/* Header */}
      <div 
        className="relative p-4 pb-3 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.strava}, ${colors.strava}DD)`,
        }}
      >
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              Holistický jedálny plán
            </h3>
            <p className="text-white/90 text-sm">
              Nie diéta • Výživovo bohaté jedlá
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/95 backdrop-blur-sm">
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: colors.strava }}>
              <span className="flex items-center justify-center h-full text-white text-xs font-bold">✓</span>
            </div>
            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Dostatočné množstvo proteínov denne</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: colors.accent }}>
              <span className="flex items-center justify-center h-full text-white text-xs font-bold">✓</span>
            </div>
            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Bohaté na zeleninu a ovocie</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: colors.mysel }}>
              <span className="flex items-center justify-center h-full text-white text-xs font-bold">✓</span>
            </div>
            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Prirodzená vláknina v každom jedle</span>
          </div>
        </div>
        
        <p className="text-xs mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>
          <strong>Ručne vybrané recepty</strong> prispôsobené tvojim preferenciám a alergénom.
        </p>
        
        <button
          className="w-full py-3 rounded-2xl text-white font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{ 
            background: `linear-gradient(135deg, ${colors.strava}, ${colors.strava}DD)`,
          }}
        >
          Vytvor si plán €47
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

// Variant 2: Personalization & Curation Focus
function MealPlanBanner2({ onPurchase }: { onPurchase: () => void }) {
  return (
    <div 
      className="mt-3 rounded-3xl p-5 cursor-pointer active:scale-[0.98] transition-all shadow-lg relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.accent}10, ${colors.periodka}15)`,
        border: `2px solid ${colors.periodka}40`,
      }}
      onClick={onPurchase}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ 
            background: `linear-gradient(135deg, ${colors.periodka}, ${colors.periodka}CC)`,
          }}
        >
          <Target size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#2E2218] mb-2">
            Kurátorovaný jedálny plán
          </h3>
          <p className="text-sm text-[#8B7560] mb-3 leading-relaxed">
            Zadaj svoje <strong>preferencie, alergie, počet jedál</strong> a obľúbené ingrediencie.
          </p>
          
          <div className="bg-white/60 rounded-xl p-3 mb-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span style={{ color: colors.strava }}>•</span>
                <span style={{ color: colors.textPrimary }} className="font-medium">Vyvážené makroživiny</span>
              </div>
              <div className="flex items-center gap-1">
                <span style={{ color: colors.accent }}>•</span>
                <span style={{ color: colors.textPrimary }} className="font-medium">Ručne vybrané recepty</span>
              </div>
              <div className="flex items-center gap-1">
                <span style={{ color: colors.periodka }}>•</span>
                <span style={{ color: colors.textPrimary }} className="font-medium">Dostatočné proteíny</span>
              </div>
              <div className="flex items-center gap-1">
                <span style={{ color: colors.mysel }}>•</span>
                <span style={{ color: colors.textPrimary }} className="font-medium">Prirodzená vláknina</span>
              </div>
            </div>
          </div>
          
          <button
            className="w-full py-3 rounded-2xl text-white font-bold shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${colors.periodka}, ${colors.periodka}DD)`,
            }}
          >
            Získať personalizovaný plán €47
          </button>
        </div>
      </div>
    </div>
  );
}

// Variant 3: Natural Nutrition Focus
function MealPlanBanner3({ onPurchase }: { onPurchase: () => void }) {
  return (
    <div 
      className="mt-3 rounded-3xl cursor-pointer active:scale-[0.98] transition-all shadow-lg overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
        border: '2px solid #bbf7d0',
      }}
      onClick={onPurchase}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
            <Heart size={20} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-green-900">
              Prirodzená výživa
            </h3>
            <p className="text-green-700 text-sm">
              Jedálny plán • Nie diéta
            </p>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl p-3 mb-4">
          <h4 className="text-sm font-bold text-green-800 mb-2">Tvoj proces:</h4>
          <div className="space-y-1 text-xs text-green-700">
            <div>1. Zadáš alergie a preferencie jedál</div>
            <div>2. Vyberieš obľúbené ingrediencie</div>
            <div>3. Dostaneš kurátorovaný výživový plán</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div>
            <div className="text-lg">🥗</div>
            <p className="text-xs font-medium text-green-700">Zelenina & ovocie</p>
          </div>
          <div>
            <div className="text-lg">🍖</div>
            <p className="text-xs font-medium text-green-700">Dostatočné proteíny</p>
          </div>
          <div>
            <div className="text-lg">🌾</div>
            <p className="text-xs font-medium text-green-700">Prirodzená vláknina</p>
          </div>
        </div>

        <button
          className="w-full py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95"
        >
          Začať plánovať €47
        </button>
      </div>
    </div>
  );
}

// Variant 4: Comprehensive Meal Plan Focus
function MealPlanBanner4({ onPurchase }: { onPurchase: () => void }) {
  return (
    <div 
      className="mt-3 bg-white rounded-3xl p-6 cursor-pointer active:scale-[0.98] transition-all shadow-xl border border-gray-100"
      onClick={onPurchase}
    >
      <div className="text-center">
        <div 
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${colors.strava}, ${colors.accent})` }}
        >
          <ChefHat size={28} className="text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-[#2E2218] mb-2">
          Komplexný jedálny plán
        </h3>
        <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>
          <strong>Nie diéta</strong> • Vyvážené jedlá prispôsobené tvojim potrebám
        </p>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-4">
          <div className="text-xs leading-relaxed" style={{ color: colors.textPrimary }}>
            Zadaj svoje <strong>alergie, počet jedál denne, preferencie ingrediencií</strong> a dostaneš personalizovaný plán s dostatočným množstvom proteínov, zeleniny, ovocia a prirodzenej vlákniny.
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-black" style={{ color: colors.strava }}>108</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>ručne vybraných receptov</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black" style={{ color: colors.accent }}>15</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>alergénov sledujeme</div>
          </div>
        </div>
        
        <button
          className="w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg transition-all active:scale-95"
          style={{ 
            background: `linear-gradient(135deg, ${colors.strava}, ${colors.accent})`,
          }}
        >
          Vytvoriť môj plán €47
        </button>
        
        <p className="text-xs mt-3" style={{ color: colors.textSecondary }}>
          🔒 30-dňová garancia vrátenia peňazí
        </p>
      </div>
    </div>
  );
}

export default function MealPlanBanners({ onPurchase, variant }: MealPlanBannerProps) {
  switch (variant) {
    case 1:
      return <MealPlanBanner1 onPurchase={onPurchase} />;
    case 2:
      return <MealPlanBanner2 onPurchase={onPurchase} />;
    case 3:
      return <MealPlanBanner3 onPurchase={onPurchase} />;
    case 4:
      return <MealPlanBanner4 onPurchase={onPurchase} />;
    default:
      return <MealPlanBanner1 onPurchase={onPurchase} />;
  }
}