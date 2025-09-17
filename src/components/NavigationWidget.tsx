import { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import MenstrualCycleTracker from "@/features/cycle/MenstrualCycleTracker";
import HabitTracker from "@/components/HabitTracker";
import ReflectionWidget from "@/components/ReflectionWidget";
import HabitCompletionCount from "@/components/HabitCompletionCount";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, NotebookPen } from "lucide-react";
import { MonthlyCalendar } from "@/components/MonthlyCalendar";
import DiaryView from "@/components/DiaryView";

// Import the uploaded icons
import menstrualCalendarIcon from "@/assets/menstrual-calendar-icon.png";
import habitsIcon from "@/assets/habits-icon.png";
import reflectionIcon from "@/assets/dennik-icon.png";

interface NavigationWidgetProps {
  accessCode?: string;
  selectedDate: Date;
  onFirstInteraction: () => void;
  habitData: any;
  habits: any[];
  formatDate: (date: Date) => string;
  reflections: Record<string, any>;
  monthlyCalendarDate: Date;
  setMonthlyCalendarDate: (date: Date) => void;
  showMonthlyCalendar: boolean;
  setShowMonthlyCalendar: (show: boolean) => void;
  showDiaryView: boolean;
  setShowDiaryView: (show: boolean) => void;
}

export const NavigationWidget = ({
  accessCode,
  selectedDate,
  onFirstInteraction,
  habitData,
  habits,
  formatDate,
  reflections,
  monthlyCalendarDate,
  setMonthlyCalendarDate,
  showMonthlyCalendar,
  setShowMonthlyCalendar,
  showDiaryView,
  setShowDiaryView,
}: NavigationWidgetProps) => {
  const [openSections, setOpenSections] = useState<{
    cycle: boolean;
    habits: boolean;
    reflection: boolean;
  }>({
    cycle: false,
    habits: false,
    reflection: false,
  });

  const toggleSection = (section: 'cycle' | 'habits' | 'reflection') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getIconSize = (isOpen: boolean) => isOpen ? 'w-16 h-16' : 'w-28 h-28';

  return (
    <div className="w-full max-w-[600px] mx-auto space-y-2">
      {/* Menstrual Cycle Section */}
      <Collapsible 
        open={openSections.cycle} 
        onOpenChange={() => toggleSection('cycle')}
      >
        <div className={`backdrop-blur-md bg-white border border-white/40 rounded-2xl p-4 shadow-lg transition-all duration-300`}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex flex-col items-center gap-1 p-0 mb-1 text-center focus:outline-none rounded-lg">
              <img 
                src={menstrualCalendarIcon} 
                alt="Menstrual Calendar"
                className={`${getIconSize(openSections.cycle)} transition-all duration-300 flex-shrink-0`}
              />
              <h2 className="text-mobile-lg md:text-lg font-semibold text-foreground">
                Menštruačný kalendár
              </h2>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="animate-accordion-down pb-1">
            <MenstrualCycleTracker
              accessCode={accessCode}
              onFirstInteraction={onFirstInteraction}
            />
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Habits Section */}
      <Collapsible 
        open={openSections.habits} 
        onOpenChange={() => toggleSection('habits')}
      >
        <div className={`backdrop-blur-md bg-white border border-white/40 rounded-2xl p-4 shadow-lg transition-all duration-300`}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex flex-col items-center p-0 mb-1 text-center focus:outline-none rounded-lg">
              <img 
                src={habitsIcon} 
                alt="Habits"
                className={`${getIconSize(openSections.habits)} transition-all duration-300 flex-shrink-0`}
              />
              <div className="flex items-center justify-between w-full mt-1">
                <h2 className="text-mobile-lg md:text-lg font-semibold text-foreground flex-1">
                  Moje návyky
                </h2>
                {openSections.habits && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <HabitCompletionCount selectedDate={selectedDate} />
                    </div>
                    <Dialog open={showMonthlyCalendar} onOpenChange={setShowMonthlyCalendar}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Calendar size={20} className="text-foreground" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent 
                        className="glass-container border-0 backdrop-blur-xl shadow-2xl max-w-none top-0 left-1/2 -translate-x-1/2 translate-y-0 w-[calc(100vw-8px)] max-h-[85vh] overflow-y-auto mt-2 sm:max-w-4xl md:max-w-5xl lg:max-w-6xl sm:top-1/2 sm:-translate-y-1/2"
                        aria-describedby={undefined}
                      >
                        <DialogHeader className="pb-1 flex-shrink-0">
                          <div className="flex items-center justify-between">
                            <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                              <div className="p-1 rounded-md bg-primary/10">
                                <Calendar size={14} className="text-primary" />
                              </div>
                              Mesačný pohľad
                            </DialogTitle>
                            <span className="text-sm text-muted-foreground">Zatvoriť</span>
                          </div>
                        </DialogHeader>
                        <div className="overflow-y-auto flex-1 min-h-0">
                          <MonthlyCalendar
                            habitData={habitData}
                            selectedMonth={monthlyCalendarDate}
                            onMonthChange={setMonthlyCalendarDate}
                            habits={habits}
                            formatDate={formatDate}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="animate-accordion-down pb-1">
            <div className="glass-container mt-3">
              <HabitTracker 
                selectedDate={selectedDate} 
                onFirstInteraction={onFirstInteraction}
              />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Reflection Section */}
      <Collapsible 
        open={openSections.reflection} 
        onOpenChange={() => toggleSection('reflection')}
      >
        <div className={`backdrop-blur-md bg-white border border-white/40 rounded-2xl p-4 shadow-lg transition-all duration-300`}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex flex-col items-center p-0 mb-1 text-center focus:outline-none rounded-lg">
              <img 
                src={reflectionIcon} 
                alt="Daily Reflection"
                className={`${getIconSize(openSections.reflection)} transition-all duration-300 flex-shrink-0`}
              />
              <div className="flex items-center justify-between w-full mt-1">
                <h2 className="text-mobile-lg md:text-lg font-semibold text-foreground flex-1">
                  Denná reflexia
                </h2>
                {openSections.reflection && (
                  <div className="flex items-center gap-2">
                    <p className="text-mobile-sm md:text-sm text-muted-foreground">
                      Tvoj diár
                    </p>
                    <Dialog open={showDiaryView} onOpenChange={setShowDiaryView}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <NotebookPen size={20} className="text-foreground" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader className="pb-0">
                          <DialogTitle className="text-lg font-heading">Môj denník reflexií</DialogTitle>
                        </DialogHeader>
                         <DiaryView
                           reflections={accessCode ? reflections : {}}
                           formatDate={formatDate}
                         />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="animate-accordion-down pb-1">
            <div className="glass-container mt-3">
              <ReflectionWidget 
                selectedDate={selectedDate}
                onFirstInteraction={onFirstInteraction}
              />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};