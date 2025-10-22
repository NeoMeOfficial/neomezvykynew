import { useState } from "react";
import { MenstrualDashboardLayout } from "@/features/cycle/MenstrualDashboardLayout";
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

type WidgetType = 'periodka' | 'navyky' | 'reflexia';

interface DashboardLayoutProps {
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

export const DashboardLayout = ({
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
}: DashboardLayoutProps) => {
  const [activeWidget, setActiveWidget] = useState<WidgetType>('periodka');

  const widgets = [
    { id: 'periodka' as WidgetType, name: 'Periodka', icon: menstrualCalendarIcon },
    { id: 'navyky' as WidgetType, name: 'Moje návyky', icon: habitsIcon },
    { id: 'reflexia' as WidgetType, name: 'Denná reflexia', icon: reflectionIcon },
  ];

  return (
    <div className="w-full max-w-none mx-auto">
      {/* Widget Selector for Desktop */}
      <div className="hidden lg:flex justify-end mb-6 gap-3">
        {widgets.map((widget) => (
          <button
            key={widget.id}
            onClick={() => setActiveWidget(widget.id)}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300
              ${activeWidget === widget.id 
                ? 'bg-primary/10 border-primary shadow-lg scale-105' 
                : 'bg-white/60 border-white/40 hover:bg-white/80 hover:scale-102'
              }
            `}
          >
            <img 
              src={widget.icon} 
              alt={widget.name}
              className={`w-8 h-8 transition-transform duration-300 ${
                activeWidget === widget.id ? 'scale-110' : ''
              }`}
            />
            <span className={`text-sm font-medium transition-colors ${
              activeWidget === widget.id ? 'text-primary' : 'text-foreground/70'
            }`}>
              {widget.name}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile Grid - Show all widgets */}
      <div className="grid grid-cols-1 lg:hidden gap-6">
        
        {/* Menstrual Cycle Panel */}
        <div className="lg:col-span-2 xl:col-span-2">
          <div className="backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-lg h-full">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={menstrualCalendarIcon} 
                alt="Menstrual Calendar"
                className="w-12 h-12 flex-shrink-0"
              />
              <h2 className="text-2xl font-semibold text-foreground">
                Periodka
              </h2>
            </div>
            <MenstrualDashboardLayout
              accessCode={accessCode}
              onFirstInteraction={onFirstInteraction}
              compact={false}
            />
          </div>
        </div>

        {/* Habits Panel */}
        <div className="xl:col-span-1">
          <div className="backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-lg h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={habitsIcon} 
                  alt="Habits"
                  className="w-12 h-12 flex-shrink-0"
                />
                <h2 className="text-2xl font-semibold text-foreground">
                  Moje návyky
                </h2>
              </div>
              <Dialog open={showMonthlyCalendar} onOpenChange={setShowMonthlyCalendar}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm"
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
                      accessCode={accessCode}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <HabitCompletionCount selectedDate={selectedDate} />
            </div>
            
            <HabitTracker 
              selectedDate={selectedDate} 
              onFirstInteraction={onFirstInteraction}
            />
          </div>
        </div>

        {/* Daily Reflection Panel */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-lg h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={reflectionIcon} 
                  alt="Daily Reflection"
                  className="w-12 h-12 flex-shrink-0"
                />
                <h2 className="text-2xl font-semibold text-foreground">
                  Denná reflexia
                </h2>
              </div>
              <Dialog open={showDiaryView} onOpenChange={setShowDiaryView}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm"
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
            
            <ReflectionWidget 
              selectedDate={selectedDate}
              onFirstInteraction={onFirstInteraction}
            />
          </div>
        </div>
      </div>

      {/* Desktop Single Widget View with Transitions */}
      <div className="hidden lg:block">
        {/* Periodka Widget */}
        <div className={`
          transition-all duration-500 ease-in-out
          ${activeWidget === 'periodka' ? 'opacity-100 scale-100 block animate-fade-in' : 'opacity-0 scale-95 hidden'}
        `}>
          <div className="backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={menstrualCalendarIcon} 
                alt="Menstrual Calendar"
                className="w-12 h-12 flex-shrink-0"
              />
              <h2 className="text-2xl font-semibold text-foreground">
                Periodka
              </h2>
            </div>
            <MenstrualDashboardLayout
              accessCode={accessCode}
              onFirstInteraction={onFirstInteraction}
              compact={false}
            />
          </div>
        </div>

        {/* Moje návyky Widget */}
        <div className={`
          transition-all duration-500 ease-in-out
          ${activeWidget === 'navyky' ? 'opacity-100 scale-100 block animate-fade-in' : 'opacity-0 scale-95 hidden'}
        `}>
          <div className="backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={habitsIcon} 
                  alt="Habits"
                  className="w-12 h-12 flex-shrink-0"
                />
                <h2 className="text-2xl font-semibold text-foreground">
                  Moje návyky
                </h2>
              </div>
              <Dialog open={showMonthlyCalendar} onOpenChange={setShowMonthlyCalendar}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm"
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
                      accessCode={accessCode}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <HabitCompletionCount selectedDate={selectedDate} />
            </div>
            
            <HabitTracker 
              selectedDate={selectedDate} 
              onFirstInteraction={onFirstInteraction}
            />
          </div>
        </div>

        {/* Denná reflexia Widget */}
        <div className={`
          transition-all duration-500 ease-in-out
          ${activeWidget === 'reflexia' ? 'opacity-100 scale-100 block animate-fade-in' : 'opacity-0 scale-95 hidden'}
        `}>
          <div className="backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={reflectionIcon} 
                  alt="Daily Reflection"
                  className="w-12 h-12 flex-shrink-0"
                />
                <h2 className="text-2xl font-semibold text-foreground">
                  Denná reflexia
                </h2>
              </div>
              <Dialog open={showDiaryView} onOpenChange={setShowDiaryView}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm"
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
            
            <ReflectionWidget 
              selectedDate={selectedDate}
              onFirstInteraction={onFirstInteraction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};