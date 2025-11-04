import { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { MenstrualDashboardLayout } from "@/features/cycle/MenstrualDashboardLayout";
import HabitTracker from "@/components/HabitTracker";
import ReflectionWidget from "@/components/ReflectionWidget";
import HabitCompletionCount from "@/components/HabitCompletionCount";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, NotebookPen } from "lucide-react";
import { MonthlyCalendar } from "@/components/MonthlyCalendar";
import DiaryView from "@/components/DiaryView";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  // Use dashboard layout for desktop, mobile collapsible layout for mobile
  if (!isMobile) {
    return (
      <DashboardLayout
        accessCode={accessCode}
        selectedDate={selectedDate}
        onFirstInteraction={onFirstInteraction}
        habitData={habitData}
        habits={habits}
        formatDate={formatDate}
        reflections={reflections}
        monthlyCalendarDate={monthlyCalendarDate}
        setMonthlyCalendarDate={setMonthlyCalendarDate}
        showMonthlyCalendar={showMonthlyCalendar}
        setShowMonthlyCalendar={setShowMonthlyCalendar}
        showDiaryView={showDiaryView}
        setShowDiaryView={setShowDiaryView}
      />
    );
  }

  return (
    <>
      {/* Inline compact buttons for vertical layout */}
      <div className="flex flex-col gap-3 w-full px-4 mb-4">
        <button 
          onClick={() => toggleSection('cycle')}
          className="flex flex-col items-center justify-center gap-2 rounded-3xl symptom-glass transition-all hover:opacity-90 w-full aspect-square max-h-[26vh]"
          style={{ backgroundColor: '#FBF8F9' }}
        >
          <img 
            src={menstrualCalendarIcon} 
            alt="Menstrual Calendar"
            className="w-24 h-24 flex-shrink-0"
          />
          <span className="text-base font-medium" style={{ color: '#955F6A' }}>
            Periodka
          </span>
        </button>
        
        <button 
          onClick={() => toggleSection('habits')}
          className="flex flex-col items-center justify-center gap-2 rounded-3xl symptom-glass transition-all hover:opacity-90 w-full aspect-square max-h-[26vh]"
          style={{ backgroundColor: '#FBF8F9' }}
        >
          <img 
            src={habitsIcon} 
            alt="Habits"
            className="w-24 h-24 flex-shrink-0"
          />
          <span className="text-base font-medium" style={{ color: '#955F6A' }}>
            Moje návyky
          </span>
        </button>
        
        <button 
          onClick={() => toggleSection('reflection')}
          className="flex flex-col items-center justify-center gap-2 rounded-3xl symptom-glass transition-all hover:opacity-90 w-full aspect-square max-h-[26vh]"
          style={{ backgroundColor: '#FBF8F9' }}
        >
          <img 
            src={reflectionIcon} 
            alt="Daily Reflection"
            className="w-24 h-24 flex-shrink-0"
          />
          <span className="text-base font-medium" style={{ color: '#955F6A' }}>
            Denná reflexia
          </span>
        </button>
      </div>
      
      {/* Expanded sections - shown below the row */}
      {openSections.cycle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-2" onClick={() => toggleSection('cycle')}>
          <div className="backdrop-blur-md bg-white border border-white/40 rounded-2xl shadow-lg w-full max-w-[600px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <MenstrualDashboardLayout
              accessCode={accessCode}
              onFirstInteraction={onFirstInteraction}
            />
          </div>
        </div>
      )}
      
      {openSections.habits && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-2" onClick={() => toggleSection('habits')}>
          <div className="backdrop-blur-md bg-white border border-white/40 rounded-2xl p-4 shadow-lg w-full max-w-[600px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Dialog open={showMonthlyCalendar} onOpenChange={setShowMonthlyCalendar}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm">
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
                      accessCode={accessCode}
                    />
                  </div>
                  </DialogContent>
                </Dialog>
                <h2 className="text-lg font-semibold text-foreground">Prehľad úspechov</h2>
              </div>
            </div>
            <HabitCompletionCount selectedDate={selectedDate} />
            <HabitTracker 
              selectedDate={selectedDate} 
              onFirstInteraction={onFirstInteraction}
            />
          </div>
        </div>
      )}
      
      {openSections.reflection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-2" onClick={() => toggleSection('reflection')}>
          <div className="backdrop-blur-md bg-white border border-white/40 rounded-2xl p-4 shadow-lg w-full max-w-[600px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Denná reflexia</h2>
              <Dialog open={showDiaryView} onOpenChange={setShowDiaryView}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm">
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
            <ReflectionWidget 
              selectedDate={selectedDate}
              onFirstInteraction={onFirstInteraction}
            />
          </div>
        </div>
      )}
    </>
  );
};