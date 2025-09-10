import React, { useState, useCallback, useMemo, useRef } from 'react';
import { BookOpen, Lightbulb, Loader2, NotebookPen, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useReflectionData } from '../hooks/useReflectionData';
import { useTemporaryReflections } from '../hooks/useTemporaryReflections';
import { useAccessCode } from '../hooks/useAccessCode';
import DiaryView from './DiaryView';

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
  const { accessCode } = useAccessCode();
  const realReflectionData = useReflectionData();
  const tempReflectionData = useTemporaryReflections();
  
  // Use appropriate data source based on access code availability
  const { 
    reflections, 
    loading, 
    updateReflection, 
    getReflection, 
    isReflectionCompleted,
    getCompletionPercentage,
    formatDate,
    hasAccessCode 
  } = accessCode ? realReflectionData : tempReflectionData;
  
  
  const [wellDoneSaveStatus, setWellDoneSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [improveSaveStatus, setImproveSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const wellDoneTimeoutRef = useRef<NodeJS.Timeout>();
  const improveTimeoutRef = useRef<NodeJS.Timeout>();

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

  // Debounced save functions with refs to get current values
  const debouncedSaveWellDone = useCallback((value: string) => {
    if (wellDoneTimeoutRef.current) {
      clearTimeout(wellDoneTimeoutRef.current);
    }
    
    wellDoneTimeoutRef.current = setTimeout(async () => {
      const currentImprove = getReflection(selectedDate)?.improve || '';
      await updateReflection(selectedDate, value || null, currentImprove || null);
    }, 500);
  }, [selectedDate, updateReflection, getReflection]);

  const debouncedSaveImprove = useCallback((value: string) => {
    if (improveTimeoutRef.current) {
      clearTimeout(improveTimeoutRef.current);
    }
    
    improveTimeoutRef.current = setTimeout(async () => {
      const currentWellDone = getReflection(selectedDate)?.well_done || '';
      await updateReflection(selectedDate, currentWellDone || null, value || null);
    }, 500);
  }, [selectedDate, updateReflection, getReflection]);

  const handleWellDoneChange = useCallback((value: string) => {
    setWellDone(value);
    debouncedSaveWellDone(value);
    if (onFirstInteraction) {
      onFirstInteraction();
    }
  }, [debouncedSaveWellDone, onFirstInteraction]);

  const handleImproveChange = useCallback((value: string) => {
    setImprove(value);
    debouncedSaveImprove(value);
    if (onFirstInteraction) {
      onFirstInteraction();
    }
  }, [debouncedSaveImprove, onFirstInteraction]);

  const handleWellDoneSave = useCallback(async () => {
    setWellDoneSaveStatus('saving');
    try {
      await updateReflection(selectedDate, wellDone || null, improve || null);
      setWellDoneSaveStatus('saved');
      setTimeout(() => setWellDoneSaveStatus('idle'), 2000);
    } catch (error) {
      setWellDoneSaveStatus('idle');
    }
  }, [selectedDate, wellDone, improve, updateReflection]);

  const handleImproveSave = useCallback(async () => {
    setImproveSaveStatus('saving');
    try {
      await updateReflection(selectedDate, wellDone || null, improve || null);
      setImproveSaveStatus('saved');
      setTimeout(() => setImproveSaveStatus('idle'), 2000);
    } catch (error) {
      setImproveSaveStatus('idle');
    }
  }, [selectedDate, wellDone, improve, updateReflection]);

  const isCompleted = isReflectionCompleted(selectedDate);

  if (loading) {
    return (
      <div className="bg-widget-bg p-3 w-full overflow-hidden">
        <div className="w-full max-w-[600px] mx-auto space-y-2">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-widget-text-soft animate-spin" />
            <span className="ml-2 text-sm text-widget-text-soft">Načítavam reflexie...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1.5">

          {/* Motivational Quote */}
          <div className="text-left">
            <p className="text-lg md:text-xl text-widget-text italic font-medium">
              "{dailyQuote}"
            </p>
          </div>

          {/* Reflection Cards */}
          <div className="space-y-3">
            {/* What went well */}
            <div className="bg-gradient-success p-4 rounded-xl border border-reflection-border/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg text-reflection-text">Čo sa mi dnes darilo?</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs bg-white/50 border-reflection-border/50 text-reflection-text hover:bg-white/70"
                  onClick={handleWellDoneSave}
                  disabled={wellDoneSaveStatus === 'saving'}
                >
                  {wellDoneSaveStatus === 'saved' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : wellDoneSaveStatus === 'saving' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Uložiť'
                  )}
                </Button>
              </div>
              <Textarea
                value={wellDone}
                onChange={(e) => handleWellDoneChange(e.target.value)}
                placeholder="Napíš, čo sa ti dnes darilo, na čo si hrdá..."
                className="min-h-[80px] bg-white/80 backdrop-blur-sm border-0 shadow-sm placeholder:text-reflection-text-soft/70 text-reflection-text focus-visible:ring-2 focus-visible:ring-white/50 resize-none focus:bg-white/70 transition-colors text-base"
              />
            </div>

            {/* What to improve */}
            <div className="bg-gradient-improve p-4 rounded-xl border border-reflection-border/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg text-reflection-text">Čo môžem zlepšiť?</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs bg-white/50 border-reflection-border/50 text-reflection-text hover:bg-white/70"
                  onClick={handleImproveSave}
                  disabled={improveSaveStatus === 'saving'}
                >
                  {improveSaveStatus === 'saved' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : improveSaveStatus === 'saving' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Uložiť'
                  )}
                </Button>
              </div>
              <Textarea
                value={improve}
                onChange={(e) => handleImproveChange(e.target.value)}
                placeholder="Čo by si chcel/a zajtra urobiť lepšie alebo inak..."
                className="min-h-[80px] bg-white/90 backdrop-blur-sm border-0 shadow-sm placeholder:text-reflection-text-soft/70 text-reflection-text focus-visible:ring-2 focus-visible:ring-white/50 resize-none focus:bg-white/70 transition-colors text-base"
              />
            </div>
          </div>
        </div>

      </div>
  );
}