import { useNavigate } from 'react-router-dom';
import { Crown, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { useAchievements } from '../../../hooks/useAchievements';

interface CommunityStatusWidgetProps {
  variant?: 'compact' | 'full';
}

export default function CommunityStatusWidget({ variant = 'compact' }: CommunityStatusWidgetProps) {
  const { stats, userAchievements } = useAchievements();
  const navigate = useNavigate();

  const recentBadges = userAchievements
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
    .slice(0, 3);

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
            <Crown className="w-4 h-4" style={{ color: '#B8864A' }} />
          </div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Ďakujeme, že si {stats.rank}</h3>
        </div>

        {/* Sub-header */}
        <div className="text-center mb-4">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            {stats.pointsToNextRank > 0 
              ? `${stats.pointsToNextRank} bodov do ďalšej úrovne` 
              : 'Maximálna úroveň dosiahnutá!'}
          </p>
        </div>

        {/* Stats Overview Button */}
        <button
          onClick={() => navigate('/profil?tab=achievements')}
          className="w-full flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-medium text-gray-800">{stats.totalPoints} bodov</p>
              <p className="text-xs text-gray-500">{stats.totalAchievements} odznakov</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${stats.rankColor}20` }}
          >
            <Crown size={24} style={{ color: stats.rankColor }} />
          </div>
          <div>
            <h3 className="text-[#6B4C3B] font-bold text-lg">{stats.rank}</h3>
            <p className="text-[#8B7560] text-sm">{stats.totalPoints} komunitných bodov</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/profil?tab=achievements')}
          className="text-[#B8864A] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Zobraziť všetko
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Progress to next rank */}
      {stats.nextRank && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B4C3B] font-medium">Pokrok do {stats.nextRank.rank}</span>
            <span className="text-[#8B7560]">{stats.pointsToNextRank} bodov zostáva</span>
          </div>
          <div className="w-full bg-[#E5D4C7] rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                backgroundColor: stats.rankColor,
                width: `${Math.max(5, (stats.totalPoints / (stats.nextRank.minPoints)) * 100)}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Recent achievements */}
      {recentBadges.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[#6B4C3B] font-semibold text-sm flex items-center gap-2">
            <Star size={16} />
            Najnovšie odznaky
          </h4>
          <div className="flex gap-3">
            {recentBadges.map((badge) => (
              <div key={badge.id} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-lg mb-1 relative">
                  {badge.achievement.icon}
                  {/* New badge indicator */}
                  {new Date(badge.earnedAt).getTime() > Date.now() - (24 * 60 * 60 * 1000) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-[#6B4C3B] text-xs font-medium max-w-[60px] leading-tight">
                  {badge.achievement.name}
                </p>
              </div>
            ))}
            {userAchievements.length > 3 && (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#B8864A]/30 flex items-center justify-center text-xs font-bold text-[#6B4C3B] mb-1">
                  +{userAchievements.length - 3}
                </div>
                <p className="text-[#8B7560] text-xs max-w-[60px] leading-tight">
                  ďalších
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/20">
        <div className="text-center">
          <div className="text-[#6B4C3B] font-bold text-lg">{stats.totalAchievements}</div>
          <div className="text-[#8B7560] text-xs">Odznaky</div>
        </div>
        <div className="text-center">
          <div className="text-[#6B4C3B] font-bold text-lg">{stats.totalPoints}</div>
          <div className="text-[#8B7560] text-xs">Body</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp size={16} style={{ color: stats.rankColor }} />
            <span className="text-[#6B4C3B] font-bold text-sm">{stats.rank}</span>
          </div>
          <div className="text-[#8B7560] text-xs">Úroveň</div>
        </div>
      </div>
    </div>
  );
}