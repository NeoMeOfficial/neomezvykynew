import { Achievement } from '../../../types/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  earnedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  progress?: number;
  onClick?: () => void;
}

export default function AchievementBadge({
  achievement,
  earned = false,
  earnedAt,
  size = 'md',
  showProgress = false,
  progress = 0,
  onClick
}: AchievementBadgeProps) {
  const sizes = {
    sm: { container: 'w-12 h-12', icon: 'text-lg', title: 'text-xs', desc: 'text-xs' },
    md: { container: 'w-16 h-16', icon: 'text-2xl', title: 'text-sm', desc: 'text-xs' },
    lg: { container: 'w-20 h-20', icon: 'text-3xl', title: 'text-base', desc: 'text-sm' }
  };

  const badgeColors = {
    bronze: { bg: '#CD7F32', border: '#B8722D', shadow: '#CD7F32' },
    silver: { bg: '#C0C0C0', border: '#A8A8A8', shadow: '#C0C0C0' },
    gold: { bg: '#FFD700', border: '#E6C200', shadow: '#FFD700' },
    diamond: { bg: '#B9F2FF', border: '#A0E6F0', shadow: '#B9F2FF' },
    special: { bg: '#9B59B6', border: '#8E44AD', shadow: '#9B59B6' }
  };

  const rarityGlow = {
    common: 'none',
    rare: '0 0 10px rgba(255, 215, 0, 0.3)',
    epic: '0 0 15px rgba(155, 89, 182, 0.4)', 
    legendary: '0 0 20px rgba(255, 105, 180, 0.5)'
  };

  const badgeStyle = badgeColors[achievement.badgeType];
  const currentSize = sizes[size];

  return (
    <div
      className={`relative ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Badge Container */}
      <div
        className={`${currentSize.container} rounded-full flex items-center justify-center border-2 transition-all ${
          earned ? 'scale-100' : 'scale-90 opacity-60'
        } ${onClick ? 'hover:scale-105' : ''}`}
        style={{
          backgroundColor: earned ? badgeStyle.bg : '#E5D4C7',
          borderColor: earned ? badgeStyle.border : '#D1C0B3',
          boxShadow: earned 
            ? `0 4px 12px ${badgeStyle.shadow}40, ${rarityGlow[achievement.rarity]}`
            : '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* Icon */}
        <span
          className={`${currentSize.icon} ${earned ? 'grayscale-0' : 'grayscale'}`}
        >
          {achievement.icon}
        </span>

        {/* Progress Ring (if showing progress) */}
        {showProgress && !earned && progress > 0 && (
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 32 32"
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="#D1C0B3"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="#B8864A"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${87.96 * (progress / 100)} 87.96`}
              className="transition-all duration-500"
            />
          </svg>
        )}
      </div>

      {/* Rarity Indicator */}
      {earned && achievement.rarity !== 'common' && (
        <div className="absolute -top-1 -right-1">
          <div
            className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-xs"
            style={{
              backgroundColor: achievement.rarity === 'legendary' ? '#FF69B4' :
                              achievement.rarity === 'epic' ? '#9B59B6' :
                              '#FFD700'
            }}
          >
            {achievement.rarity === 'legendary' ? '⭐' :
             achievement.rarity === 'epic' ? '💎' : '✨'}
          </div>
        </div>
      )}

      {/* Tooltip/Info (for larger sizes) */}
      {size !== 'sm' && (
        <div className="mt-2 text-center">
          <h4 className={`font-semibold text-[#6B4C3B] ${currentSize.title}`}>
            {achievement.name}
          </h4>
          <p className={`text-[#8B7560] ${currentSize.desc} mt-1 max-w-[100px]`}>
            {achievement.description}
          </p>
          {earned && earnedAt && (
            <p className="text-[#A68B5B] text-xs mt-1">
              {new Date(earnedAt).toLocaleDateString('sk-SK')}
            </p>
          )}
          {showProgress && !earned && (
            <p className="text-[#A68B5B] text-xs mt-1">
              {Math.round(progress)}% hotovo
            </p>
          )}
        </div>
      )}

      {/* New Badge Indicator */}
      {earned && earnedAt && (
        new Date(earnedAt).getTime() > Date.now() - (24 * 60 * 60 * 1000)
      ) && (
        <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          Nový!
        </div>
      )}
    </div>
  );
}