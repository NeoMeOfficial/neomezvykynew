import React from 'react';
import { 
  BarChart3, Calendar, Dumbbell, Utensils, Music, Flag, MessageSquare, Users, Gift, 
  FolderOpen, Shield, Settings, LogOut, ChevronRight, Bell
} from 'lucide-react';
import { colors } from '../../theme/warmDusk';

type Tab = 'overview' | 'content' | 'programs' | 'exercises' | 'recipes' | 'meditations' | 'community' | 'messages' | 'users' | 'referrals';

interface DesktopSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  badges?: Record<string, number>;
}

const navigationItems: { id: Tab; label: string; icon: any; description: string }[] = [
  { id: 'overview', label: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
  { id: 'content', label: 'Content Manager', icon: FolderOpen, description: 'Videos, Photos & Media' },
  { id: 'programs', label: 'Fitness Programs', icon: Calendar, description: 'Workout Scheduling' },
  { id: 'exercises', label: 'Exercise Library', icon: Dumbbell, description: 'Manage Workouts' },
  { id: 'recipes', label: 'Recipe Database', icon: Utensils, description: 'Nutrition Content' },
  { id: 'meditations', label: 'Meditations', icon: Music, description: 'Mindfulness Audio' },
  { id: 'community', label: 'Community', icon: Flag, description: 'Post Moderation' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, description: 'User Support' },
  { id: 'users', label: 'User Management', icon: Users, description: 'Account Administration' },
  { id: 'referrals', label: 'Referral System', icon: Gift, description: 'Reward Program' },
];

export default function DesktopSidebar({ activeTab, onTabChange, badges = {} }: DesktopSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.telo }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg" style={{ color: colors.textPrimary }}>NeoMe</h1>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          const hasBadge = badges[item.id] && badges[item.id] > 0;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group ${
                isActive ? 'bg-gradient-to-r shadow-lg' : 'hover:bg-white/20'
              }`}
              style={isActive ? { 
                background: `linear-gradient(135deg, ${colors.telo}, ${colors.strava})`,
                color: '#fff'
              } : {}}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} style={!isActive ? { color: colors.textSecondary } : {}} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${isActive ? 'text-white' : ''}`} style={!isActive ? { color: colors.textPrimary } : {}}>
                    {item.label}
                  </span>
                  {hasBadge && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white min-w-[18px] text-center">
                      {badges[item.id]}
                    </span>
                  )}
                </div>
                <p className={`text-xs truncate ${isActive ? 'text-white/80' : ''}`} style={!isActive ? { color: colors.textTertiary } : {}}>
                  {item.description}
                </p>
              </div>
              
              <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white/60' : 'text-transparent group-hover:text-gray-400'}`} />
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all">
          <Bell className="w-4 h-4" style={{ color: colors.textSecondary }} />
          <span className="text-sm" style={{ color: colors.textPrimary }}>Notifications</span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all">
          <Settings className="w-4 h-4" style={{ color: colors.textSecondary }} />
          <span className="text-sm" style={{ color: colors.textPrimary }}>Settings</span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all">
          <LogOut className="w-4 h-4" style={{ color: colors.periodka }} />
          <span className="text-sm" style={{ color: colors.periodka }}>Exit Admin</span>
        </button>
      </div>
    </div>
  );
}