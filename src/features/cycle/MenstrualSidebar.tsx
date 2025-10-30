import React, { useState } from 'react';
import { Clock, FileText, TrendingUp, CalendarDays, Lightbulb, Share2, AlertCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import periodkaLogo from '@/assets/periodka-logo.png';
import { temporaryStorage } from '@/lib/temporaryStorage';
import { Button } from '@/components/ui/button';
import { NextDatesInfo } from './components/NextDatesInfo';
import { PeriodkaTour } from './PeriodkaTour';

interface MenstrualSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onEditClick: () => void;
  onSettingsClick: () => void;
  onShareClick?: () => void;
  accessCode?: string;
  lastPeriodStart?: string | null;
  cycleLength?: number;
  onPeriodStart?: (date: Date) => void;
  onPeriodEnd?: (startDate: Date, endDate: Date) => void;
  onUseCustomDatePicker?: () => void;
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
    id: 'calendar',
    title: 'Kalendárny prehľad',
    icon: CalendarDays,
  },
];

export function MenstrualSidebar({ 
  activeSection, 
  onSectionChange, 
  onEditClick, 
  onSettingsClick, 
  onShareClick, 
  accessCode, 
  lastPeriodStart, 
  cycleLength = 28,
  onPeriodStart,
  onPeriodEnd,
  onUseCustomDatePicker
}: MenstrualSidebarProps) {
  const navigate = useNavigate();
  const hasTemporaryData = temporaryStorage.isSessionActive() && temporaryStorage.hasTemporaryData();
  const [runTour, setRunTour] = useState(false);
  
  const startTour = () => {
    setRunTour(true);
  };
  
  return (
    <div className="w-80 border-r border-border/50 bg-background/95 backdrop-blur-sm" data-tour="sidebar">
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
                  data-tour={`${item.id}-section`}
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
                  <div className="mb-4 space-y-3" data-tour="calendar-actions">
                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={onSettingsClick}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-3xl bg-white border border-rose-200/20 hover:bg-gray-50 transition-all"
                        style={{ color: '#FF7782' }}
                      >
                        <Lightbulb className="w-3 h-3" />
                        Nastavenia
                      </button>
                      <div className="flex items-center">
                        <PeriodkaTour accessCode={accessCode} autoStart={false} activeSection={activeSection} onSectionChange={onSectionChange} />
                      </div>
                      {accessCode && onShareClick && (
                        <button
                          onClick={onShareClick}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-3xl bg-white border border-rose-200/20 hover:bg-gray-50 transition-all"
                          style={{ color: '#FF7782' }}
                        >
                          <Share2 className="w-3 h-3" />
                          Zdieľať kalendár
                        </button>
                      )}
                    </div>
                    
                    <NextDatesInfo 
                      lastPeriodStart={lastPeriodStart} 
                      cycleLength={cycleLength} 
                      onEditClick={onEditClick}
                      onPeriodStart={onPeriodStart}
                      onPeriodEnd={onPeriodEnd}
                      onUseCustomDatePicker={onUseCustomDatePicker}
                    />

                    {/* Temporary Data Indicator */}
                    {hasTemporaryData && !accessCode && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 space-y-2">
                            <div>
                              <p className="text-xs font-medium text-amber-800">
                                Dočasné údaje
                              </p>
                              <p className="text-xs text-amber-700 mt-1">
                                Pre uloženie údajov je potrebné 5 Eur predplatné
                              </p>
                            </div>
                            <Button
                              onClick={() => navigate('/checkout')}
                              size="sm"
                              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-1.5 h-auto"
                            >
                              Vytvoriť účet
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
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