import { AlertCircle, Zap } from 'lucide-react';
import { colors } from '../theme/warmDusk';

interface DemoBannerProps {
  message?: string;
  type?: 'demo' | 'info' | 'success';
  className?: string;
}

export default function DemoBanner({ 
  message = "🎯 Demo Mode: Všetky funkcie sú funkčné, ale nebudú účtované žiadne poplatky",
  type = 'demo',
  className = ''
}: DemoBannerProps) {
  
  const typeStyles = {
    demo: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-100',
      icon: '🎯',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-800',
      titleClass: 'text-blue-900'
    },
    info: {
      bg: 'from-gray-50 to-slate-50', 
      border: 'border-gray-100',
      icon: AlertCircle,
      iconClass: 'text-gray-600',
      textClass: 'text-gray-700',
      titleClass: 'text-gray-900'
    },
    success: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-100', 
      icon: Zap,
      iconClass: 'text-green-600',
      textClass: 'text-green-700',
      titleClass: 'text-green-900'
    }
  };

  const style = typeStyles[type];
  const IconComponent = typeof style.icon === 'string' ? null : style.icon;

  return (
    <div className={`bg-gradient-to-br ${style.bg} rounded-2xl p-4 border ${style.border} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {IconComponent ? (
            <IconComponent className={`w-5 h-5 ${style.iconClass}`} />
          ) : (
            <span className="text-lg">{style.icon}</span>
          )}
        </div>
        <div className="flex-1">
          <p className={`text-sm ${style.textClass} leading-relaxed`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}