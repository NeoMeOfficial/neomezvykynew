import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Sparkles, ChefHat } from "lucide-react";
import { colors, glassCard } from "../../../theme/warmDusk";
import { SUBSCRIPTION_PLANS } from "../../../data/subscription";

interface MealPlannerBannerProps {
  onPurchase: () => void;
  className?: string;
}

export function MealPlannerBanner({ onPurchase, className = "" }: MealPlannerBannerProps) {
  return (
    <div 
      className={`p-6 mb-6 rounded-3xl ${className}`}
      style={{
        ...glassCard,
        background: `linear-gradient(135deg, ${colors.periodka}08, ${colors.accent}08)`,
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${colors.periodka}20` }}
        >
          <ChefHat size={24} style={{ color: colors.periodka }} />
        </div>

        <div className="flex-1">
          {/* Title */}
          <h3 
            className="text-lg font-semibold mb-1"
            style={{ color: colors.textPrimary }}
          >
            Personalizované jedálničky
          </h3>
          
          {/* Badge */}
          <Badge 
            className="px-3 py-1 text-xs font-medium border-0 mb-2"
            style={{ 
              backgroundColor: `${colors.periodka}20`,
              color: colors.periodka,
            }}
          >
            <Sparkles size={12} className="mr-1" />
            Prémiová funkcia
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p 
        className="text-sm mb-4 leading-relaxed"
        style={{ color: colors.textSecondary }}
      >
        Vytváraj si neobmedzené jedálničky prispôsobené tvojím cieľom, preferenciám a alergénam. 
        S predplatným máš prístup k všetkým funkciám NeoMe.
      </p>

      {/* Features list */}
      <ul className="text-xs mb-4 space-y-1" style={{ color: colors.textSecondary }}>
        <li>• Prispôsobené tvojím alergénam a diéte</li>
        <li>• 108+ overených receptov od výživových expertov</li>
        <li>• Kompletný nákupný zoznam</li>
        <li>• Kalórie a makroživiny pre každé jedlo</li>
      </ul>

      {/* CTA */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={onPurchase}
          className="flex-1 font-medium tracking-wide border-0 shadow-lg"
          style={{
            backgroundColor: colors.periodka,
            color: 'white',
            boxShadow: `0 4px 16px ${colors.periodka}30`,
          }}
        >
          <Sparkles size={16} className="mr-2" />
          Získať predplatné €14.90
        </Button>
        
        <div className="text-right">
          <div 
            className="text-xs font-medium"
            style={{ color: colors.textSecondary }}
          >
            mesačne
          </div>
          <div 
            className="text-xs"
            style={{ color: colors.textTertiary }}
          >
            neobmedzene
          </div>
        </div>
      </div>
    </div>
  );
}