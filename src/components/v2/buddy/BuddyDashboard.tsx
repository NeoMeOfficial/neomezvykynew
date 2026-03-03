import { useState } from 'react';
import { Users, Clock, Check, X, Bell, Heart, Dumbbell, Flame, Droplets } from 'lucide-react';
import { useBuddySystem } from '../../../hooks/useBuddySystem';
import { colors, glassCard } from '../../theme/warmDusk';

export default function BuddyDashboard() {
  const { 
    buddyConnections, 
    pendingRequests, 
    buddyNotifications,
    acceptBuddyRequest,
    rejectBuddyRequest,
    markNotificationsSeen,
    getUnreadCount
  } = useBuddySystem();

  const [activeTab, setActiveTab] = useState<'buddies' | 'requests' | 'notifications'>('buddies');
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      await acceptBuddyRequest(requestId);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
    setProcessingRequest(null);
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      await rejectBuddyRequest(requestId);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
    setProcessingRequest(null);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'workout_complete': return Dumbbell;
      case 'achievement_earned': return Heart;
      case 'streak_milestone': return Flame;
      case 'water_goal': return Droplets;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'workout_complete': return 'text-[#7A9E78]';
      case 'achievement_earned': return 'text-[#A8848B]';
      case 'streak_milestone': return 'text-[#C27A6E]';
      case 'water_goal': return 'text-[#6B9BD9]';
      default: return 'text-[#B8864A]';
    }
  };

  const handleMarkAllSeen = () => {
    const unreadIds = buddyNotifications.filter(n => !n.seen).map(n => n.id);
    if (unreadIds.length > 0) {
      markNotificationsSeen(unreadIds);
    }
  };

  if (buddyConnections.length === 0 && pendingRequests.length === 0) {
    return (
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-white/20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
          <Users size={32} style={{ color: '#7A9E78' }} />
        </div>
        <h3 className="font-semibold text-lg mb-2" style={{ color: '#2E2218' }}>
          Zatiaľ nemáš žiadnych buddy
        </h3>
        <p className="text-sm max-w-sm mx-auto" style={{ color: '#6B4C3B' }}>
          Pripoj sa s kamarátkami pomocou buddy kódov a motivujte sa navzájom!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
          <Users className="w-4 h-4" style={{ color: '#7A9E78' }} />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Moje buddy</h3>
          <p className="text-sm" style={{ color: '#6B4C3B' }}>
            {buddyConnections.length} {buddyConnections.length === 1 ? 'spojenie' : 'spojení'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/20 rounded-xl p-1">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setActiveTab('buddies')}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'buddies'
                ? 'bg-[#7A9E78] text-white'
                : 'text-gray-600 hover:bg-white/25'
            }`}
          >
            Buddy ({buddyConnections.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === 'requests'
                ? 'bg-[#7A9E78] text-white'
                : 'text-gray-600 hover:bg-white/25'
            }`}
          >
            Žiadosti ({pendingRequests.length})
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === 'notifications'
                ? 'bg-[#7A9E78] text-white'
                : 'text-gray-600 hover:bg-white/25'
            }`}
          >
            Aktivity
            {getUnreadCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-3">
        {/* Buddies Tab */}
        {activeTab === 'buddies' && (
          <>
            {buddyConnections.map((connection) => (
              <div key={connection.id} className="bg-white/20 rounded-xl p-4 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
                    <span className="font-bold text-sm" style={{ color: '#2E2218' }}>
                      {(connection.user1Name || connection.user2Name)?.[0]?.toUpperCase() || 'B'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm" style={{ color: '#2E2218' }}>
                      {connection.user1Name === 'Používateľ' ? connection.user2Name : connection.user1Name}
                    </h4>
                    <p className="text-xs" style={{ color: '#6B4C3B' }}>
                      Spojení od {new Date(connection.connectedAt).toLocaleDateString('sk-SK')}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-green-600" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
                  <Clock size={20} style={{ color: '#B8864A' }} />
                </div>
                <p className="text-sm" style={{ color: '#6B4C3B' }}>Žiadne čakajúce žiadosti</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="bg-white/20 rounded-xl p-4 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
                      <span className="font-bold text-sm" style={{ color: '#2E2218' }}>
                        {request.requesterName[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" style={{ color: '#2E2218' }}>
                        {request.requesterName}
                      </h4>
                      <p className="text-xs" style={{ color: '#6B4C3B' }}>
                        Chce sa s tebou spojiť • {new Date(request.createdAt).toLocaleDateString('sk-SK')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={processingRequest === request.id}
                      className="flex-1 bg-[#7A9E78] text-white rounded-lg py-2 px-3 text-sm font-medium hover:bg-[#6B8B68] transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <Check size={14} />
                      Prijať
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      disabled={processingRequest === request.id}
                      className="flex-1 bg-[#8B7560]/30 text-[#6B4C3B] rounded-lg py-2 px-3 text-sm font-medium hover:bg-[#8B7560]/40 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <X size={14} />
                      Odmietnuť
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <>
            {getUnreadCount() > 0 && (
              <button
                onClick={handleMarkAllSeen}
                className="w-full bg-orange-100 rounded-lg py-2 px-3 text-sm font-medium hover:bg-orange-200 transition-all"
                style={{ color: '#B8864A' }}
              >
                Označiť všetky ako prečítané
              </button>
            )}
            
            {buddyNotifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `rgba(168, 132, 139, 0.14)` }}>
                  <Bell size={20} style={{ color: '#A8848B' }} />
                </div>
                <p className="text-sm" style={{ color: '#6B4C3B' }}>Zatiaľ žiadne aktivity od buddy</p>
              </div>
            ) : (
              buddyNotifications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10)
                .map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  const iconColor = getNotificationColor(notification.type);
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`bg-white/20 rounded-xl p-4 border-l-4 hover:shadow-sm transition-all ${
                        !notification.seen ? 'bg-orange-50 border-l-[#B8864A]' : 'border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm ${iconColor}`}>
                          <IconComponent size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: '#2E2218' }}>
                            {notification.fromUserName}
                          </p>
                          <p className="text-sm mt-1" style={{ color: '#6B4C3B' }}>
                            {notification.message}
                          </p>
                          <p className="text-xs mt-1" style={{ color: '#6B4C3B' }}>
                            {new Date(notification.timestamp).toLocaleString('sk-SK')}
                          </p>
                        </div>
                        {!notification.seen && (
                          <div className="w-2 h-2 bg-[#B8864A] rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </>
        )}
      </div>
    </div>
  );
}