import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, BookOpen, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useReflectionData } from '../hooks/useReflectionData';
import { MonthlyCalendar } from './MonthlyCalendar';
import { ConnectionStatus } from './ConnectionStatus';

interface ReflectionWidgetProps {
  selectedDate: Date;
  onFirstInteraction?: () => void;
}

const motivationalQuotes = [
  "Každý deň je nová príležitosť na rast.",
  "Malé kroky vedú k veľkým zmenám.",
  "Reflexia je kľúčom k sebapoznaniu.",
  "Úspech sa rodí z každodenných návykov.",
  "Buď vďačný za to, čo máš, a pracuj na tom, čo chceš."
];

export default function ReflectionWidget({ selectedDate, onFirstInteraction }: ReflectionWidgetProps) {
  const { 
    reflections, 
    loading, 
    updateReflection, 
    getReflection, 
    isReflectionCompleted,
    getCompletionPercentage,
    formatDate,
    hasAccessCode 
  } = useReflectionData();
  
  const [showMonthlyCalendar, setShowMonthlyCalendar] = useState(false);
  const [monthlyCalendarDate, setMonthlyCalendarDate] = useState(new Date());

  const currentReflection = getReflection(selectedDate);
  const [wellDone, setWellDone] = useState(currentReflection?.well_done || '');
  const [improve, setImprove] = useState(currentReflection?.improve || '');
  
  // Update local state when selected date changes
  React.useEffect(() => {
    const reflection = getReflection(selectedDate);
    setWellDone(reflection?.well_done || '');
    setImprove(reflection?.improve || '');
  }, [selectedDate, getReflection]);

  const dailyQuote = useMemo(() => {
    const dateStr = formatDate(selectedDate);
    const hash = dateStr.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return motivationalQuotes[Math.abs(hash) % motivationalQuotes.length];
  }, [selectedDate, formatDate]);

  const handleWellDoneChange = useCallback((value: string) => {
    setWellDone(value);
    updateReflection(selectedDate, value || null, improve || null);
    if (onFirstInteraction) {
      onFirstInteraction();
    }
  }, [selectedDate, improve, updateReflection, onFirstInteraction]);

  const handleImproveChange = useCallback((value: string) => {
    setImprove(value);
    updateReflection(selectedDate, wellDone || null, value || null);
    if (onFirstInteraction) {
      onFirstInteraction();
    }
  }, [selectedDate, wellDone, updateReflection, onFirstInteraction]);

  const isCompleted = isReflectionCompleted(selectedDate);
  
  // Transform reflection data for MonthlyCalendar
  const reflectionHabitData = useMemo(() => {
    const habitData: Record<string, Record<string, number>> = {};
    const reflectionHabitId = 'reflection-daily';
    habitData[reflectionHabitId] = {};
    
    Object.values(reflections).forEach(reflection => {
      const completion = getCompletionPercentage(new Date(reflection.date + 'T00:00:00'));
      habitData[reflectionHabitId][reflection.date] = completion / 100; // Convert to 0-1 range
    });
    
    return habitData;
  }, [reflections, getCompletionPercentage]);

  const reflectionHabits = [
    {
      id: 'reflection-daily',
      name: 'Denná reflexia',
      emoji: '🤔',
      color: '#E5B050',
      target: 1,
      unit: 'reflexia'
    }
  ];

  if (loading) {
    return (
      <div className="bg-widget-bg p-3">
        <div className="max-w-[600px] mx-auto space-y-2">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-widget-text-soft animate-spin" />
            <span className="ml-2 text-sm text-widget-text-soft">Načítavam reflexie...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-widget-bg p-3">
      <div className="max-w-[600px] mx-auto space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-widget-text">Denná reflexia</h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-widget-text-soft">
                {isCompleted ? 'Dokončené' : 'Nedokončené'}
              </p>
              <Dialog open={showMonthlyCalendar} onOpenChange={setShowMonthlyCalendar}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-xl shadow-sm">
                    <Calendar size={20} className="text-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-fit">
                  <DialogHeader className="pb-0">
                    <DialogTitle className="text-lg">Mesačný pohľad - Reflexie</DialogTitle>
                  </DialogHeader>
                  <MonthlyCalendar
                    habitData={reflectionHabitData}
                    selectedMonth={monthlyCalendarDate}
                    onMonthChange={setMonthlyCalendarDate}
                    habits={reflectionHabits}
                    formatDate={formatDate}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="bg-gradient-widget p-4 rounded-xl border border-widget-border/30 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-reflection-accent" />
              <span className="text-xs font-medium text-widget-text-soft">Dnes sa inšpiruj</span>
            </div>
            <p className="text-sm text-widget-text italic">"{dailyQuote}"</p>
          </div>

          {/* Reflection Cards */}
          <div className="space-y-3">
            {/* What went well */}
            <div className="bg-gradient-success p-4 rounded-xl border border-reflection-border/30 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-reflection-text" />
                <h3 className="text-sm font-medium text-reflection-text">Čo sa mi dnes darilo?</h3>
              </div>
              <Textarea
                value={wellDone}
                onChange={(e) => handleWellDoneChange(e.target.value)}
                placeholder="Napíš, čo sa ti dnes darilo, na čo si hrdý/á..."
                className="min-h-[80px] bg-white/50 border-reflection-border/50 text-reflection-text placeholder:text-reflection-text-soft resize-none focus:bg-white/70 transition-colors"
              />
            </div>

            {/* What to improve */}
            <div className="bg-gradient-improve p-4 rounded-xl border border-reflection-border/30 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-reflection-text" />
                <h3 className="text-sm font-medium text-reflection-text">Čo môžem zlepšiť?</h3>
              </div>
              <Textarea
                value={improve}
                onChange={(e) => handleImproveChange(e.target.value)}
                placeholder="Čo by si chcel/a zajtra urobiť lepšie alebo inak..."
                className="min-h-[80px] bg-white/50 border-reflection-border/50 text-reflection-text placeholder:text-reflection-text-soft resize-none focus:bg-white/70 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <ConnectionStatus connected={hasAccessCode} />
        </div>
      </div>
    </div>
  );
}