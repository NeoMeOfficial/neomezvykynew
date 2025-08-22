import { useState, useCallback, useEffect } from 'react';
import { temporaryStorage, TempReflectionEntry } from '@/lib/temporaryStorage';

export function useTemporaryReflections() {
  const [reflections, setReflections] = useState<TempReflectionEntry[]>([]);
  const [loading] = useState(false);

  // Helper functions
  const formatDate = useCallback((date: Date): string => {
    return date.toISOString().split('T')[0];
  }, []);

  const startOfDay = useCallback((date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }, []);

  // Load temporary data on mount
  useEffect(() => {
    const tempData = temporaryStorage.getAllReflectionData();
    setReflections(tempData);
  }, []);

  const updateReflection = useCallback(async (date: Date, wellDone: string | null, improve: string | null) => {
    const dateStr = formatDate(startOfDay(date));
    
    // Start temporary session if not already active
    if (!temporaryStorage.isSessionActive()) {
      temporaryStorage.startSession();
    }
    
    // Store in temporary storage
    temporaryStorage.storeReflection(dateStr, wellDone, improve);
    
    // Update local state
    setReflections(prev => {
      const filtered = prev.filter(r => r.date !== dateStr);
      if (wellDone || improve) {
        filtered.push({ date: dateStr, well_done: wellDone, improve });
      }
      return filtered;
    });
  }, [formatDate, startOfDay]);

  const getReflection = useCallback((date: Date) => {
    const dateStr = formatDate(startOfDay(date));
    return temporaryStorage.getReflection(dateStr);
  }, [formatDate, startOfDay]);

  const isReflectionCompleted = useCallback((date: Date) => {
    const reflection = getReflection(date);
    return !!(reflection?.well_done || reflection?.improve);
  }, [getReflection]);

  const getCompletionPercentage = useCallback((date: Date) => {
    const reflection = getReflection(date);
    if (!reflection) return 0;
    
    let completed = 0;
    if (reflection.well_done) completed++;
    if (reflection.improve) completed++;
    
    return (completed / 2) * 100;
  }, [getReflection]);

  return {
    reflections,
    loading,
    updateReflection,
    getReflection,
    isReflectionCompleted,
    getCompletionPercentage,
    formatDate,
    hasAccessCode: false
  };
}