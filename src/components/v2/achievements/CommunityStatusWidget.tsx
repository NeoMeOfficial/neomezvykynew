import { useNavigate } from 'react-router-dom';
import { Crown, TrendingUp, Star, ChevronRight, Gift, Users, UserPlus } from 'lucide-react';
import { useAchievements } from '../../../hooks/useAchievements';
import { colors, glassCard } from '../../theme/warmDusk';

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
    // Calculate user's progress and available rewards
    const referralProgress = Math.floor(stats.totalPoints / 100); // 1 referral = 100 points = month free
    const communityLevel = Math.floor(stats.totalPoints / 250); // Every 250 points = new discount tier
    const nextReferralPoints = 100 - (stats.totalPoints % 100);
    const nextCommunityPoints = 250 - (stats.totalPoints % 250);

    return (
      <div className="space-y-3">
        {/* Header - Motivational */}
        <div className="text-center mb-3">
          <h3 className="text-[16px] font-bold mb-1" style={{ color: '#2E2218' }}>
            Získaj odmeny! 🎁
          </h3>
          <p className="text-[12px]" style={{ color: '#6B4C3B' }}>
            Pozvi kamarátky alebo buď aktívna v komunite
          </p>
        </div>

        {/* Reward Tracks */}
        <div className="space-y-3">
          {/* Referral Track */}
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-3 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(184, 134, 74, 0.2)' }}>
                  <UserPlus className="w-3 h-3" style={{ color: '#B8864A' }} />
                </div>
                <span className="text-[12px] font-semibold" style={{ color: '#2E2218' }}>
                  Mesiac zdarma
                </span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(184, 134, 74, 0.15)', color: '#6B4C3B' }}>
                {referralProgress} získaných
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] mb-2">
              <span style={{ color: '#6B4C3B' }}>Pozvi 1 kamarátku</span>
              <span style={{ color: '#8B7560' }}>{nextReferralPoints} bodov zostáva</span>
            </div>
            <div className="w-full bg-[#E5D4C7] rounded-full h-1.5 mb-2">
              <div 
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: '#B8864A',
                  width: `${Math.min(100, ((100 - nextReferralPoints) / 100) * 100)}%` 
                }}
              />
            </div>
            <button 
              onClick={() => navigate('/buddy-system', { state: { from: '/domov-new' } })}
              className="w-full text-[10px] text-white py-1.5 rounded-lg font-medium hover:opacity-90 transition-all"
              style={{ backgroundColor: '#B8864A' }}
            >
              Zdieľaj svoj kód
            </button>
          </div>

          {/* Community Track */}
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-3 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(168, 132, 139, 0.2)' }}>
                  <Gift className="w-3 h-3" style={{ color: '#A8848B' }} />
                </div>
                <span className="text-[12px] font-semibold" style={{ color: '#2E2218' }}>
                  Zľavy partnerov
                </span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(168, 132, 139, 0.15)', color: '#6B4C3B' }}>
                Level {communityLevel}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] mb-2">
              <span style={{ color: '#6B4C3B' }}>
                {communityLevel === 0 ? 'Komentuj, lajkuj, motivuj' : `Odomkni Level ${communityLevel + 1}`}
              </span>
              <span style={{ color: '#8B7560' }}>{nextCommunityPoints} bodov zostáva</span>
            </div>
            <div className="w-full bg-[#E5D4C7] rounded-full h-1.5 mb-2">
              <div 
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: '#A8848B',
                  width: `${Math.min(100, ((250 - nextCommunityPoints) / 250) * 100)}%` 
                }}
              />
            </div>
            <button 
              onClick={() => navigate('/komunita', { state: { from: '/domov-new', tab: 'discounts' } })}
              className="w-full text-[10px] text-white py-1.5 rounded-lg font-medium hover:opacity-90 transition-all"
              style={{ backgroundColor: '#A8848B' }}
            >
              {communityLevel === 0 ? 'Zapoj sa do komunity' : 'Pozri si zľavy'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/20">
          <div className="text-center">
            <div className="text-[#6B4C3B] font-bold text-sm">{stats.totalPoints}</div>
            <div className="text-[#8B7560] text-[10px]">Body celkom</div>
          </div>
          <div className="text-center">
            <div className="text-[#6B4C3B] font-bold text-sm">{stats.rank}</div>
            <div className="text-[#8B7560] text-[10px]">Tvoja úroveň</div>
          </div>
        </div>
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