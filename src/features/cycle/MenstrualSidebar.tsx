import React from 'react';
import { Clock, FileText, TrendingUp, CalendarDays, Lightbulb } from 'lucide-react';
import periodkaLogo from '@/assets/periodka-logo.png';

interface MenstrualSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onEditClick: () => void;
  onSettingsClick: () => void;
}

const menuItems = [
  {
    id: 'estimate',
    title: 'Odhad na dnes',
    icon: Clock,
  },
  {
    id: 'feel-better',
    title: 'Ako sa cítiť lepšie',
    icon: TrendingUp,
  },
  {
    id: 'track',
    title: 'Zaznač si to podstatné',
    icon: FileText,
  },
  {
    id: 'calendar',
    title: 'Kalendárny prehľad',
    icon: CalendarDays,
  },
];

export function MenstrualSidebar({ activeSection, onSectionChange, onEditClick, onSettingsClick }: MenstrualSidebarProps) {
  return (
    <div className="w-80 border-r border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-start gap-3 mb-6">
          <img 
            src={periodkaLogo} 
            alt="Periodka Logo" 
            className="w-10 h-10 flex-shrink-0"
          />
          <h2 className="text-3xl font-caveat font-semibold" style={{ color: '#FF7782' }}>
            Periodka
          </h2>
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
                      ? 'shadow-lg border border-rose-200/50' 
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
                  {/* Active dot indicator */}
                  {isActive && <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-[#FF7782]"></div>}
                  <div className="flex items-center">
                    <Icon 
                      className="mr-3 h-4 w-4 flex-shrink-0" 
                      style={{ color: '#FF7782' }}
                    />
                    <span 
                      className="text-sm font-medium"
                      style={{ color: '#FF7782' }}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
                
                {/* Show buttons and next period info under Kalendárny prehľad */}
                {item.id === 'calendar' && (
                  <div className="mb-4 space-y-3">
                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={onEditClick}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-3xl bg-gradient-to-r from-rose-50/40 to-pink-50/40 border border-rose-200/20 hover:from-rose-50/60 hover:to-pink-50/60 transition-all"
                        style={{ color: '#FF7782' }}
                      >
                        <Lightbulb className="w-3 h-3" />
                        Zmeniť dátum menštruácie
                      </button>
                      <button
                        onClick={onSettingsClick}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-3xl bg-gradient-to-r from-rose-50/40 to-pink-50/40 border border-rose-200/20 hover:from-rose-50/60 hover:to-pink-50/60 transition-all"
                        style={{ color: '#FF7782' }}
                      >
                        <Lightbulb className="w-3 h-3" />
                        Nastavenia
                      </button>
                    </div>
                    
                    <div className="p-3 rounded-lg" 
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