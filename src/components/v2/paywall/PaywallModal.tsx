import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { X, Crown, Sparkles } from "lucide-react";
import { colors, glassCard } from "../../../theme/warmDusk";
import { SUBSCRIPTION_PLANS } from "../../../data/subscription";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  limitType: 'content' | 'data_save' | 'meal_planner';
  onUpgrade: (tier: 'neome_plus' | 'program_bundle' | 'meal_planner_tokens') => void;
}

export function PaywallModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  limitType,
  onUpgrade 
}: PaywallModalProps) {
  
  const getUpgradeOptions = () => {
    switch (limitType) {
      case 'content':
      case 'data_save':
        return [
          {
            tier: 'neome_plus' as const,
            icon: Crown,
            name: 'NeoMe+',
            price: `€14.90/mesiac`,
            description: 'Neobmedzený obsah + ukladanie údajov',
            color: colors.accent,
            primary: true,
          },
          {
            tier: 'program_bundle' as const,
            icon: Sparkles,
            name: 'Program Bundle',
            price: `€143 ročne`,
            description: 'Všetko v NeoMe+ + programy + jedálničky',
            color: colors.mysel,
            primary: false,
          },
        ];
      
      case 'meal_planner':
        return [
          {
            tier: 'meal_planner_tokens' as const,
            icon: Sparkles,
            name: 'Jedálničky',
            price: `€14.90/mesiac`,
            description: '1 token = 1 personalizovaný jedálniček',
            color: colors.periodka,
            primary: true,
          },
          {
            tier: 'program_bundle' as const,
            icon: Crown,
            name: 'Program Bundle',
            price: `€143 ročne`,
            description: 'Všetko vrátane neobmedzených jedálničkov',
            color: colors.mysel,
            primary: false,
          },
        ];
    }
  };

  const options = getUpgradeOptions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md mx-auto p-0 border-0 shadow-none overflow-hidden"
        style={{
          ...glassCard,
          borderRadius: 24,
        }}
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle 
              className="text-xl font-semibold"
              style={{ color: colors.textPrimary }}
            >
              {title}
            </DialogTitle>
            <Button
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="p-2 h-auto hover:bg-transparent"
            >
              <X size={20} style={{ color: colors.textSecondary }} />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Message */}
          <p 
            className="text-sm mb-6 leading-relaxed"
            style={{ color: colors.textSecondary }}
          >
            {message}
          </p>

          {/* Upgrade options */}
          <div className="space-y-3">
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.tier}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    option.primary ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: `${option.color}08`,
                    border: `1px solid ${option.color}20`,
                    ...(option.primary && { ringColor: `${option.color}40` }),
                  }}
                  onClick={() => onUpgrade(option.tier)}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${option.color}20` }}
                    >
                      <IconComponent size={20} style={{ color: option.color }} />
                    </div>

                    <div className="flex-1">
                      {/* Name & Price */}
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="font-semibold text-sm"
                          style={{ color: colors.textPrimary }}
                        >
                          {option.name}
                        </span>
                        <Badge 
                          variant="outline"
                          className="px-2 py-0.5 text-xs border-0"
                          style={{ 
                            backgroundColor: `${option.color}15`,
                            color: option.color,
                          }}
                        >
                          {option.price}
                        </Badge>
                      </div>
                      
                      {/* Description */}
                      <p 
                        className="text-xs leading-tight"
                        style={{ color: colors.textSecondary }}
                      >
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}