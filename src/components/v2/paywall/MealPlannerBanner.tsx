import { ChefHat, Sparkles, Tag } from "lucide-react";
import { colors, glassCard } from "../../../theme/warmDusk";

interface MealPlannerBannerProps {
  onPurchase: () => void;
  className?: string;
}

export function MealPlannerBanner({ onPurchase, className = "" }: MealPlannerBannerProps) {
  return (
    <div
      className={`p-5 mb-4 rounded-3xl ${className}`}
      style={{
        ...glassCard,
        background: `linear-gradient(135deg, ${colors.periodka}08, ${colors.accent}08)`,
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${colors.periodka}20` }}
        >
          <ChefHat size={22} style={{ color: colors.periodka }} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-0.5" style={{ color: colors.textPrimary }}>
            Personalizovaný jedálniček
          </h3>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            7-dňový plán na mieru — jednorazový nákup
          </p>
        </div>
      </div>

      {/* Features */}
      <ul className="text-xs mb-4 space-y-1" style={{ color: colors.textSecondary }}>
        <li>• 7-dňový plán prispôsobený tvojim cieľom a alergénam</li>
        <li>• Porcie prepočítané na tvoje kalorické ciele</li>
        <li>• Denný prehľad makroživín (bielkoviny / sacharidy / tuky)</li>
        <li>• Zámiena jedál — 2 možnosti pre každý slot</li>
        <li>• Export do PDF na tlač / zdieľanie</li>
      </ul>

      {/* CTA */}
      <button
        onClick={onPurchase}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all active:scale-[0.98]"
        style={{
          backgroundColor: colors.periodka,
          color: 'white',
          boxShadow: `0 4px 16px ${colors.periodka}30`,
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <Sparkles size={15} />
          Získať jedálniček — €57
        </span>
      </button>
      <p className="text-center text-[10px] mt-2" style={{ color: colors.textTertiary }}>
        jednorazovo · zostáva ti navždy
      </p>
    </div>
  );
}
