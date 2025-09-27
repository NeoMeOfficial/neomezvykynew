import React from 'react';
import { Clock, FileText, TrendingUp, BarChart3, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import periodkaLogo from '@/assets/periodka-logo.png';

interface MenstrualSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  {
    id: 'estimate',
    title: 'Odhad na dnes',
    icon: Clock,
  },
  {
    id: 'track',
    title: 'Zaznač si to podstatné',
    icon: FileText,
  },
  {
    id: 'feel-better',
    title: 'Ako sa cítiť lepšie',
    icon: TrendingUp,
  },
  {
    id: 'data',
    title: 'Prehľad údajov',
    icon: BarChart3,
  },
  {
    id: 'calendar',
    title: 'Kalendárny prehľad',
    icon: CalendarDays,
  },
];

export function MenstrualSidebar({ activeSection, onSectionChange }: MenstrualSidebarProps) {
  return (
    <div className="w-80 border-r border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="p-6">
        <div className="relative p-4 rounded-t-2xl mb-6"
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.95) 100%)',
               boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(149, 95, 106, 0.1)'
             }}>
          {/* Header glass accent */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent"></div>
          <div className="flex items-center gap-3">
            <img 
              src={periodkaLogo} 
              alt="Periodka Logo" 
              className="w-6 h-6 flex-shrink-0"
            />
            <h2 className="text-xl font-caveat font-semibold" style={{ color: '#FF7782' }}>
              Periodka
            </h2>
          </div>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <div key={item.id}>
                <div
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full cursor-pointer transition-all duration-200 mb-2 p-4 rounded-xl relative
                    ${isActive 
                      ? 'shadow-lg' 
                      : 'hover:shadow-md'
                    }
                  `}
                  style={{ 
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.95) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(253, 242, 248, 0.75) 100%)',
                    boxShadow: isActive 
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(149, 95, 106, 0.15)'
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 1px 4px rgba(149, 95, 106, 0.08)'
                  }}
                >
                  {isActive && <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent"></div>}
                  <div className="flex items-center">
                    <Icon 
                      className="mr-3 h-4 w-4 flex-shrink-0" 
                      style={{ color: isActive ? '#FF7782' : '#955F6A' }}
                    />
                    <span 
                      className="text-sm font-medium"
                      style={{ color: isActive ? '#FF7782' : '#955F6A' }}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
                
                {/* Show next period info under Kalendárny prehľad */}
                {item.id === 'calendar' && (
                  <div className="ml-4 mb-4 p-3 rounded-lg" 
                       style={{ 
                         background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 242, 248, 0.65) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(149, 95, 106, 0.06)'
                       }}>
                    <div className="space-y-2">
                      <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
                        Ďalšia menštruácia: <span style={{ color: '#FF7782' }}>
                          7. 10. 2025
                        </span>
                      </p>
                      <p className="text-xs font-medium" style={{ color: '#955F6A' }}>
                        Ďalšie plodné dni: <span style={{ color: '#FF7782' }}>
                          23. 9. 2025 - 25. 9. 2025
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}