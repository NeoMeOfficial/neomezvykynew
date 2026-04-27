import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Users, MessageCircle, User } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

const tabs = [
  { path: '/domov-new', icon: Home, label: 'Domov' },
  { path: '/kniznica', icon: BookOpen, label: 'Knižnica' },
  { path: '/komunita', icon: Users, label: 'Komunita' },
  { path: '/spravy', icon: MessageCircle, label: 'Správy', badge: true },
  { path: '/profil', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-8 py-3 rounded-full"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom) + 8px)',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(48px)',
        WebkitBackdropFilter: 'blur(48px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
    >
      {tabs.map((tab) => {
        const active = location.pathname.startsWith(tab.path);
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="relative flex items-center justify-center rounded-full transition-all duration-300"
            style={active ? {
              width: 44, height: 44,
              background: `linear-gradient(135deg, ${colors.telo}, #4A3428)`,
              color: '#FFF',
              boxShadow: `0 4px 14px ${colors.telo}40`,
            } : {
              width: 36, height: 36,
              color: colors.textSecondary,
            }}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            {tab.badge && !active && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                style={{ background: colors.periodka }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
