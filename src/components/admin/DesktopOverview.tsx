import React from 'react';
import { 
  Users, Euro, Gift, Dumbbell, Clock, Flag, MessageSquare, TrendingUp, 
  Activity, Calendar, CheckCircle, Eye, AlertTriangle, ChevronRight,
  BarChart3, PieChart, Target, Zap
} from 'lucide-react';
import { colors } from '../../theme/warmDusk';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
);

const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }: {
  icon: any; title: string; value: string | number; subtitle: string; color: string; trend?: string;
}) => (
  <Card>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5" style={{ color }} />
          <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>{title}</span>
        </div>
        <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{value}</div>
        <div className="text-sm" style={{ color: colors.textTertiary }}>{subtitle}</div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" style={{ color: colors.strava }} />
            <span className="text-xs font-medium" style={{ color: colors.strava }}>{trend}</span>
          </div>
        )}
      </div>
    </div>
  </Card>
);

const QuickAction = ({ icon: Icon, title, description, color, onClick, badge }: {
  icon: any; title: string; description: string; color: string; onClick: () => void; badge?: number;
}) => (
  <button onClick={onClick} className="w-full p-4 rounded-xl bg-white/30 hover:bg-white/40 transition-all text-left group border border-white/20">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm" style={{ color: colors.textPrimary }}>{title}</span>
          {badge && badge > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
              {badge}
            </span>
          )}
        </div>
        <span className="text-xs" style={{ color: colors.textSecondary }}>{description}</span>
      </div>
      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.textTertiary }} />
    </div>
  </button>
);

interface DesktopOverviewProps {
  stats: {
    users: { total: number; active: number; trial: number };
    revenue: { mrr: number; growth: string };
    referrals: { total: number; pending: number };
    content: { exercises: number; recipes: number };
  };
  actions: {
    pendingReferrals: number;
    flaggedPosts: number;
    unreadMessages: number;
  };
  onNavigate: (tab: string) => void;
}

export default function DesktopOverview({ stats, actions, onNavigate }: DesktopOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Welcome back, Admin</h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Here's what's happening with NeoMe today</p>
        </div>
        <div className="text-xs" style={{ color: colors.textTertiary }}>
          Last updated: {new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Key Metrics - 4 Column Grid */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.users.total}
          subtitle={`${stats.users.active} active, ${stats.users.trial} trial`}
          color={colors.strava}
          trend="+12% this month"
        />
        <StatCard
          icon={Euro}
          title="Monthly Revenue"
          value={`€${stats.revenue.mrr}`}
          subtitle="MRR from subscriptions"
          color={colors.accent}
          trend={stats.revenue.growth}
        />
        <StatCard
          icon={Gift}
          title="Referrals"
          value={stats.referrals.total}
          subtitle={`${stats.referrals.pending} pending approval`}
          color={colors.periodka}
        />
        <StatCard
          icon={Dumbbell}
          title="Content Library"
          value={stats.content.exercises + stats.content.recipes}
          subtitle={`${stats.content.exercises} exercises, ${stats.content.recipes} recipes`}
          color={colors.telo}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="col-span-1">
          <Card>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <QuickAction
                icon={Clock}
                title="Approve Referrals"
                description={`${actions.pendingReferrals} waiting for approval`}
                color={colors.periodka}
                onClick={() => onNavigate('referrals')}
                badge={actions.pendingReferrals}
              />
              <QuickAction
                icon={Flag}
                title="Review Posts"
                description={`${actions.flaggedPosts} flagged posts`}
                color="#e53e3e"
                onClick={() => onNavigate('community')}
                badge={actions.flaggedPosts}
              />
              <QuickAction
                icon={MessageSquare}
                title="User Messages"
                description={`${actions.unreadMessages} unread messages`}
                color={colors.accent}
                onClick={() => onNavigate('messages')}
                badge={actions.unreadMessages}
              />
              <QuickAction
                icon={Dumbbell}
                title="Add Exercise"
                description="Create new workout content"
                color={colors.telo}
                onClick={() => onNavigate('exercises')}
              />
              <QuickAction
                icon={Users}
                title="User Management"
                description="Manage accounts & subscriptions"
                color={colors.strava}
                onClick={() => onNavigate('users')}
              />
            </div>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="col-span-1">
          <Card>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { icon: Users, text: "5 new user registrations", time: "2 hours ago", color: colors.strava },
                { icon: Gift, text: "3 referrals submitted", time: "4 hours ago", color: colors.periodka },
                { icon: MessageSquare, text: "New support ticket", time: "6 hours ago", color: colors.accent },
                { icon: CheckCircle, text: "Program updated: BodyForming", time: "8 hours ago", color: colors.telo },
                { icon: Eye, text: "108 recipe views today", time: "12 hours ago", color: colors.mysel }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/20 last:border-0">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: colors.textPrimary }}>{item.text}</p>
                    <p className="text-xs" style={{ color: colors.textTertiary }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Insights */}
        <div className="col-span-1">
          <Card>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Performance Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/20">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" style={{ color: colors.strava }} />
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>User Retention</span>
                </div>
                <span className="text-sm font-bold" style={{ color: colors.strava }}>78%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/20">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" style={{ color: colors.accent }} />
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Engagement Rate</span>
                </div>
                <span className="text-sm font-bold" style={{ color: colors.accent }}>85%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: colors.telo }} />
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Conversion Rate</span>
                </div>
                <span className="text-sm font-bold" style={{ color: colors.telo }}>23%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/20">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" style={{ color: colors.periodka }} />
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Content Views</span>
                </div>
                <span className="text-sm font-bold" style={{ color: colors.periodka }}>2.4k</span>
              </div>
              
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.strava}10` }}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4" style={{ color: colors.strava }} />
                  <span className="text-sm font-medium" style={{ color: colors.strava }}>Tip</span>
                </div>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  Consider adding more Level 1 exercises - 45% of users are beginners
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <Card>
        <div className="grid grid-cols-6 gap-6 text-center">
          <div>
            <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>2.4k</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>Total Sessions</div>
          </div>
          <div>
            <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>456</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>Workouts Completed</div>
          </div>
          <div>
            <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>89%</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>System Uptime</div>
          </div>
          <div>
            <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>1.2s</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>Avg Load Time</div>
          </div>
          <div>
            <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>€847</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>Credits Earned</div>
          </div>
          <div>
            <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>12</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>API Calls/min</div>
          </div>
        </div>
      </Card>
    </div>
  );
}