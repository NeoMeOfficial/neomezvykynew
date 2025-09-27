import React from 'react';
import { Clock, FileText, TrendingUp, BarChart3, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    title: 'Kalendárny pohľad',
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
            <h2 className="text-lg font-medium" style={{ color: '#FF7782' }}>
              Navigácia
            </h2>
          </div>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full justify-start px-3 py-2 h-auto text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }
                `}
              >
                <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">{item.title}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}