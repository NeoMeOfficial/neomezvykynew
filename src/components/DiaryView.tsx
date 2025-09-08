import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { BookOpen, Lightbulb } from 'lucide-react';

interface ReflectionEntry {
  id: string;
  date: string;
  well_done: string | null;
  improve: string | null;
  access_code: string;
}

interface DiaryViewProps {
  reflections: Record<string, ReflectionEntry>;
  formatDate: (date: Date) => string;
}

export default function DiaryView({ reflections, formatDate }: DiaryViewProps) {
  // Sort reflections by date (newest first)
  const sortedReflections = Object.values(reflections)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return format(date, 'EEEE, d. MMMM yyyy', { locale: sk });
    } catch {
      return dateString;
    }
  };

  if (sortedReflections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-widget-text-soft mb-4" />
        <h3 className="text-mobile-2xl md:text-xl font-heading font-semibold text-widget-text mb-2">
          Tvoj denník je prázdny
        </h3>
        <p className="text-mobile-base md:text-base text-widget-text-soft">
          Začni písať svoje prvé reflexie a vybuduj si návyk každodenného zamýšľania.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="space-y-6 p-4">
        {sortedReflections.map((reflection) => {
          const hasContent = reflection.well_done || reflection.improve;
          
          return (
            <div key={reflection.id} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-widget-border/30">
                <BookOpen className="h-4 w-4 text-reflection-accent" />
                <h3 className="text-mobile-lg md:text-lg font-heading font-semibold text-widget-text capitalize">
                  {formatDisplayDate(reflection.date)}
                </h3>
              </div>

              {hasContent ? (
                <div className="space-y-3">
                  {/* What went well */}
                  {reflection.well_done && (
                    <div className="bg-gradient-success p-4 rounded-xl border border-reflection-border/30">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-3 w-3 text-reflection-text" />
                        <span className="text-mobile-sm md:text-sm font-medium text-reflection-text">Čo sa mi darilo</span>
                      </div>
                      <p className="text-mobile-base md:text-base text-reflection-text leading-relaxed">
                        {reflection.well_done}
                      </p>
                    </div>
                  )}

                  {/* What to improve */}
                  {reflection.improve && (
                    <div className="bg-gradient-improve p-4 rounded-xl border border-reflection-border/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-3 w-3 text-reflection-text" />
                        <span className="text-mobile-sm md:text-sm font-medium text-reflection-text">Čo môžem zlepšiť</span>
                      </div>
                      <p className="text-mobile-base md:text-base text-reflection-text leading-relaxed">
                        {reflection.improve}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-widget-bg-soft p-4 rounded-xl border border-widget-border/20">
                  <p className="text-mobile-base md:text-base text-widget-text-soft italic text-center">
                    Žiadna reflexia k tomuto dňu
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}