import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { Achievement } from '../../../types/achievements';
import AchievementBadge from './AchievementBadge';

interface AchievementToastProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function AchievementToast({
  achievement,
  isVisible,
  onClose,
  autoHideDuration = 5000
}: AchievementToastProps) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onClose, 300); // Wait for animation
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
      <div
        className={`
          bg-white/95 backdrop-blur-[20px] border border-white/60 rounded-2xl p-4 shadow-lg
          transition-all duration-300 transform
          ${isShowing ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-95'}
        `}
        style={{
          boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 1px 8px rgba(0,0,0,0.05)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            <span className="text-[#6B4C3B] font-semibold text-sm">Nový odznak!</span>
          </div>
          <button
            onClick={() => {
              setIsShowing(false);
              setTimeout(onClose, 300);
            }}
            className="text-[#8B7560] hover:text-[#6B4C3B] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Achievement Content */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <AchievementBadge
              achievement={achievement}
              earned={true}
              size="md"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-[#6B4C3B] font-bold text-base mb-1">
              {achievement.name}
            </h3>
            <p className="text-[#8B7560] text-sm leading-tight">
              {achievement.description}
            </p>
            
            {achievement.points > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs bg-[#B8864A] text-white px-2 py-0.5 rounded-full font-medium">
                  +{achievement.points} bodov
                </span>
                {achievement.rarity !== 'common' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    achievement.rarity === 'legendary' ? 'bg-purple-500 text-white' :
                    achievement.rarity === 'epic' ? 'bg-purple-400 text-white' :
                    'bg-yellow-400 text-gray-800'
                  }`}>
                    {achievement.rarity === 'legendary' ? 'Legendárny' :
                     achievement.rarity === 'epic' ? 'Epický' :
                     'Vzácny'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Subtle animation glow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div 
            className="absolute inset-0 rounded-2xl opacity-20 animate-pulse"
            style={{
              background: `radial-gradient(circle at center, ${
                achievement.rarity === 'legendary' ? '#9B59B6' :
                achievement.rarity === 'epic' ? '#E74C3C' :
                achievement.rarity === 'rare' ? '#F39C12' :
                '#27AE60'
              }, transparent 70%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}