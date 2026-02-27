import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Sparkles, Lock, Crown, Zap } from "lucide-react";
import { colors, glassCard } from "../../../theme/warmDusk";
import { PRICING } from "../../../types/subscription";

interface PaywallCardProps {
  title: string;
  description: string;
  feature: 'content' | 'data_save' | 'programs' | 'meal_planner';
  onUpgrade: (tier: 'neome_plus' | 'program_bundle' | 'meal_planner_tokens') => void;
}

export function PaywallCard({ title, description, feature, onUpgrade }: PaywallCardProps) {
  const getFeatureConfig = () => {
    switch (feature) {
      case 'content':
        return {
          icon: Lock,
          color: colors.accent,
          cta: 'Odomknúť všetok obsah',
          price: `€${PRICING.neome_plus_monthly.price}/mesiac`,
          action: () => onUpgrade('neome_plus'),
        };
      case 'data_save':
        return {
          icon: Zap,
          color: colors.strava,
          cta: 'Uložiť svoje údaje',
          price: `€${PRICING.neome_plus_monthly.price}/mesiac`,
          action: () => onUpgrade('neome_plus'),
        };
      case 'programs':
        return {
          icon: Crown,
          color: colors.mysel,
          cta: 'Získať programy',
          price: `€${PRICING.program_bundle_onetime.price} jednorazovo`,
          action: () => onUpgrade('program_bundle'),
        };
      case 'meal_planner':
        return {
          icon: Sparkles,
          color: colors.periodka,
          cta: 'Kúpiť jedálničky',
          price: `€${PRICING.meal_planner_tokens.price}`,
          action: () => onUpgrade('meal_planner_tokens'),
        };
    }
  };

  const config = getFeatureConfig();
  const IconComponent = config.icon;

  return (
    <Card className="border-0 shadow-none" style={glassCard}>
      <CardContent className="p-6 text-center">
        {/* Icon */}
        <div 
          className="mx-auto mb-4 w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <IconComponent 
            size={24} 
            style={{ color: config.color }}
          />
        </div>

        {/* Title */}
        <h3 
          className="text-lg font-semibold mb-2"
          style={{ color: colors.textPrimary }}
        >
          {title}
        </h3>

        {/* Description */}
        <p 
          className="text-sm mb-4 leading-relaxed"
          style={{ color: colors.textSecondary }}
        >
          {description}
        </p>

        {/* Price badge */}
        <Badge 
          variant="outline" 
          className="mb-4 px-3 py-1 text-xs font-medium border-0"
          style={{ 
            backgroundColor: `${config.color}15`,
            color: config.color,
          }}
        >
          {config.price}
        </Badge>

        {/* CTA Button */}
        <Button 
          onClick={config.action}
          className="w-full font-medium tracking-wide border-0 shadow-lg"
          style={{
            backgroundColor: config.color,
            color: 'white',
            boxShadow: `0 4px 16px ${config.color}30`,
          }}
        >
          {config.cta}
        </Button>
      </CardContent>
    </Card>
  );
}