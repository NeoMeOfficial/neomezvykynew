import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Users, MessageCircle, User } from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';

const TABS = [
  { path: '/domov-new', icon: Home,          label: 'Domov' },
  { path: '/kniznica',  icon: BookOpen,       label: 'Knižnica' },
  { path: '/komunita',  icon: Users,          label: 'Komunita' },
  { path: '/spravy',    icon: MessageCircle,  label: 'Správy', badge: true },
  { path: '/profil',    icon: User,           label: 'Profil' },
] as const;

const DEEP   = '#3D2921';
const MUTED  = 'rgba(61,41,33,0.42)';
const HAIR   = 'rgba(61,41,33,0.08)';
const TERRA  = '#C1856A';
const CREAM  = '#F8F5F0';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useMessages();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingTop: 10,
        paddingBottom: `calc(env(safe-area-inset-bottom) + 10px)`,
        background: CREAM,
        borderTop: `1px solid ${HAIR}`,
      }}
    >
      {TABS.map((tab) => {
        const active = location.pathname.startsWith(tab.path);
        const Icon = tab.icon;
        const showBadge = 'badge' in tab && tab.badge && unreadCount > 0 && !active;
        return (
          <button
            key={tab.path}
            type="button"
            onClick={() => navigate(tab.path)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              position: 'relative',
              color: active ? DEEP : MUTED,
            }}
          >
            <Icon
              size={18}
              strokeWidth={active ? 2 : 1.5}
            />
            <span
              style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: '0.04em',
                fontWeight: active ? 500 : 400,
              }}
            >
              {tab.label}
            </span>
            {showBadge && (
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 4,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 999,
                  background: TERRA,
                  border: `2px solid ${CREAM}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1,
                  padding: '0 3px',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
