import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Users, MessageCircle, User } from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';

const TABS = [
  { path: '/domov-new', icon: Home,          label: 'Domov'    },
  { path: '/kniznica',  icon: BookOpen,       label: 'Knižnica' },
  { path: '/komunita',  icon: Users,          label: 'Komunita' },
  { path: '/spravy',    icon: MessageCircle,  label: 'Správy',  badge: true },
  { path: '/profil',    icon: User,           label: 'Profil'   },
] as const;

const DEEP  = '#3D2921';
const MUTED = 'rgba(255,255,255,0.50)';
const TERRA = '#C1856A';
const WHITE = '#FFFFFF';
const ACTIVE = '#FFFFFF';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useMessages();

  return (
    // Opaque full-width dock: content visually ENDS at its top edge
    // instead of sliding behind a floating pill (Gabi 2026-07-26).
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingTop: 10,
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)',
        background: 'rgba(248,245,240,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderTop: '1px solid rgba(61,41,33,0.08)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
    <nav
      style={{
        width: 'calc(100% - 32px)',
        maxWidth: 420,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '10px 6px',
        background: '#2A1A14',
        borderRadius: 28,
        boxShadow: 'none',
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
              gap: 3,
              padding: '4px 12px',
              borderRadius: 20,
              position: 'relative',
              color: active ? ACTIVE : MUTED,
              transition: 'color 0.15s ease',
            }}
          >
            <Icon size={18} strokeWidth={active ? 2 : 1.5} />
            <span
              style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: '0.03em',
                fontWeight: active ? 600 : 400,
              }}
            >
              {tab.label}
            </span>
            {showBadge && (
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 6,
                  minWidth: 15,
                  height: 15,
                  borderRadius: 999,
                  background: TERRA,
                  border: '2px solid #2A1A14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  fontSize: 8,
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1,
                  padding: '0 2px',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
    </div>
  );
}
