import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Heart, Users, User } from 'lucide-react';

/**
 * BottomNav — five-tab primary navigation.
 *
 * Reads active tab from the current route. Each tab navigates to its base path.
 * Sits at the bottom of all primary surfaces (Home, Knižnica, Cyklus, Komunita,
 * Profil). NOT shown on detail / drill-down screens.
 *
 * <BottomNav />
 */
// User-facing pillar name stays "Periodka" — see plan decision 4.
type TabId = 'domov' | 'kniznica' | 'periodka' | 'komunita' | 'profil';

interface Tab {
  id: TabId;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'domov',    label: 'Domov',    path: '/domov-new',          icon: <Home strokeWidth={1.6} /> },
  { id: 'kniznica', label: 'Knižnica', path: '/kniznica',           icon: <BookOpen strokeWidth={1.6} /> },
  { id: 'periodka', label: 'Periodka', path: '/kniznica/periodka',  icon: <Heart strokeWidth={1.6} /> },
  { id: 'komunita', label: 'Komunita', path: '/komunita',           icon: <Users strokeWidth={1.6} /> },
  { id: 'profil',   label: 'Profil',   path: '/profil',             icon: <User strokeWidth={1.6} /> },
];

const matchesTab = (pathname: string, tab: Tab) => {
  if (tab.path === '/') return pathname === '/';
  return pathname.startsWith(tab.path);
};

export interface BottomNavProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: TabId;
}

export const BottomNav = React.forwardRef<HTMLDivElement, BottomNavProps>(
  ({ className, active, ...props }, ref) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-x-0 bottom-0 z-20 px-2 pt-3 pb-[max(env(safe-area-inset-bottom),20px)]',
          'bg-cream border-t border-ink/[0.08]',
          'flex justify-around items-start',
          className
        )}
        {...props}
      >
        {TABS.map((tab) => {
          const isActive = active ? active === tab.id : matchesTab(location.pathname, tab);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-col items-center gap-1 px-2.5 py-1 bg-transparent border-0 cursor-pointer',
                'transition-colors duration-150',
                isActive ? 'text-ink' : 'text-ink/40 hover:text-ink/72'
              )}
            >
              <span className="[&_svg]:size-[18px]">{tab.icon}</span>
              <span
                className={cn(
                  'font-sans text-[10px] tracking-wider',
                  isActive ? 'font-medium' : 'font-normal'
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);
BottomNav.displayName = 'BottomNav';
