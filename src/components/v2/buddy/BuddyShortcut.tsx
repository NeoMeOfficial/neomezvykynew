import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Bell, ChevronRight } from 'lucide-react';
import { useBuddySystem } from '../../../hooks/useBuddySystem';
import { colors, glassCard } from '../../theme/warmDusk';

export default function BuddyShortcut() {
  const navigate = useNavigate();
  const { stats, hasBuddies, buddyConnections, getUnreadCount } = useBuddySystem();

  // Don't show if user has no buddies and no pending requests
  if (!hasBuddies && stats.pendingRequestsCount === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
            <UserPlus className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>
            Buddy System • Pripoj sa s kamarátkami a motivujte sa
          </h3>
        </div>

        {/* CTA Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Debug: Buddy button clicked!');
            console.log('Debug: Navigating to buddy-system page...');
            navigate('/buddy-system');
          }}
          className="w-full flex items-center justify-between p-4 rounded-2xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
          style={{ 
            background: '#6B4C3B',
            cursor: 'pointer'
          }}
        >
          <div className="flex items-center gap-3">
            <UserPlus className="w-5 h-5" />
            <div className="text-left">
              <p className="text-sm font-semibold">Nájdi svoju buddy</p>
              <p className="text-xs opacity-90">Motivujte sa spolu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChevronRight size={16} className="opacity-70" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
          <Users className="w-4 h-4" style={{ color: '#B8864A' }} />
        </div>
        <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Buddy System</h3>
        {getUnreadCount() > 0 && (
          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
            {getUnreadCount()}
          </span>
        )}
        {stats.pendingRequestsCount > 0 && (
          <span className="text-xs bg-[#B8864A] text-white px-2 py-0.5 rounded-full font-medium">
            {stats.pendingRequestsCount}
          </span>
        )}
      </div>

      {/* Sub-header */}
      <div className="text-center mb-4">
        <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
          Pripoj sa s kamarátkami a motivujte sa
        </p>
      </div>

      {/* Buddy Overview Button */}
      <button
        onClick={() => navigate('/buddy-system')}
        className="w-full flex items-center justify-between p-3 bg-white/30 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-medium text-gray-800">Moje buddy</p>
            <p className="text-xs text-gray-500">{stats.totalBuddies} {stats.totalBuddies === 1 ? 'buddy' : 'buddy'} pripojených</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Buddy avatars preview */}
          {buddyConnections.slice(0, 3).map((buddy, index) => (
            <div
              key={buddy.id}
              className="w-6 h-6 rounded-full bg-[#B8864A]/20 flex items-center justify-center text-[#6B4C3B] text-xs font-bold border-2 border-white"
              style={{ marginLeft: index > 0 ? '-8px' : '0' }}
            >
              {(buddy.user1Name || buddy.user2Name)?.[0]?.toUpperCase() || 'B'}
            </div>
          ))}
          
          {stats.totalBuddies > 3 && (
            <div className="w-6 h-6 rounded-full bg-[#B8864A]/30 flex items-center justify-center text-[#6B4C3B] text-xs font-bold border-2 border-white -ml-2">
              +{stats.totalBuddies - 3}
            </div>
          )}

          {/* Status indicators */}
          {getUnreadCount() > 0 && (
            <Bell size={14} className="text-red-500 ml-2" />
          )}
          
          <ChevronRight size={16} className="text-gray-400 ml-1" />
        </div>
      </button>
    </div>
  );
}