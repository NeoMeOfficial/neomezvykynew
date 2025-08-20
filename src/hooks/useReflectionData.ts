import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAccessCode } from './useAccessCode';

export interface ReflectionEntry {
  id: string;
  date: string;
  well_done: string | null;
  improve: string | null;
  access_code: string;
  created_at: string;
  updated_at: string;
}

export const useReflectionData = () => {
  const { accessCode } = useAccessCode();
  const [reflections, setReflections] = useState<Record<string, ReflectionEntry>>({});
  const [loading, setLoading] = useState(true);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  // Load reflections when access code is available
  useEffect(() => {
    if (!accessCode) {
      console.log('No access code for reflections, clearing data');
      setReflections({});
      setLoading(false);
      return;
    }

    console.log('Loading reflections for access code:', accessCode);

    const loadReflections = async () => {
      setLoading(true);
      
      try {
        const { data: entries, error } = await supabase
          .from('reflections')
          .select('*')
          .eq('access_code', accessCode);

        if (error) {
          console.error('Error loading reflections:', error);
          throw error;
        }

        console.log('Reflections loaded:', entries?.length || 0);

        if (entries) {
          const formattedReflections: Record<string, ReflectionEntry> = {};
          
          entries.forEach(entry => {
            formattedReflections[entry.date] = {
              id: entry.id,
              date: entry.date,
              well_done: entry.well_done,
              improve: entry.improve,
              access_code: entry.access_code,
              created_at: entry.created_at,
              updated_at: entry.updated_at
            };
          });

          setReflections(formattedReflections);
        }
      } catch (error) {
        console.error('Error loading reflections:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReflections();
  }, [accessCode]);

  // Listen for access code changes
  useEffect(() => {
    const handleAccessCodeChange = (event: CustomEvent) => {
      console.log('Access code changed event received in reflections:', event.detail);
      const newAccessCode = event.detail?.accessCode;
      
      if (!newAccessCode) {
        setReflections({});
        setLoading(false);
      }
    };

    window.addEventListener('accessCodeChanged', handleAccessCodeChange as EventListener);
    return () => window.removeEventListener('accessCodeChanged', handleAccessCodeChange as EventListener);
  }, []);

  const updateReflection = useCallback(async (date: Date, wellDone: string | null, improve: string | null) => {
    const dateStr = formatDate(startOfDay(date));
    
    console.log('Updating reflection:', {
      dateStr,
      wellDone,
      improve,
      accessCode
    });
    
    // Update local state immediately
    setReflections(prev => ({
      ...prev,
      [dateStr]: {
        id: prev[dateStr]?.id || '',
        date: dateStr,
        well_done: wellDone,
        improve: improve,
        access_code: accessCode || '',
        created_at: prev[dateStr]?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }));

    // Update database if we have an access code
    if (accessCode) {
      try {
        const { data, error } = await supabase
          .from('reflections')
          .upsert({
            date: dateStr,
            well_done: wellDone,
            improve: improve,
            access_code: accessCode,
          }, {
            onConflict: 'date,access_code'
          })
          .select();

        if (error) {
          console.error('Database upsert error:', error);
          throw error;
        }
        
        console.log('Database upsert successful:', data);
        
        // Update local state with the returned data
        if (data && data[0]) {
          setReflections(prev => ({
            ...prev,
            [dateStr]: {
              id: data[0].id,
              date: dateStr,
              well_done: data[0].well_done,
              improve: data[0].improve,
              access_code: data[0].access_code,
              created_at: data[0].created_at,
              updated_at: data[0].updated_at
            }
          }));
        }
      } catch (error) {
        console.error('Error updating reflection:', error);
        // Don't revert local state - let the user see their changes even if DB fails
      }
    } else {
      console.log('No access code available, skipping database save');
    }
  }, [accessCode]);

  const getReflection = useCallback((date: Date): ReflectionEntry | null => {
    const dateStr = formatDate(startOfDay(date));
    return reflections[dateStr] || null;
  }, [reflections]);

  const isReflectionCompleted = useCallback((date: Date): boolean => {
    const reflection = getReflection(date);
    return !!(reflection && (reflection.well_done || reflection.improve));
  }, [getReflection]);

  const getCompletionPercentage = useCallback((date: Date): number => {
    const reflection = getReflection(date);
    if (!reflection) return 0;
    
    const wellDoneCompleted = !!(reflection.well_done && reflection.well_done.trim());
    const improveCompleted = !!(reflection.improve && reflection.improve.trim());
    
    if (wellDoneCompleted && improveCompleted) return 100;
    if (wellDoneCompleted || improveCompleted) return 50;
    return 0;
  }, [getReflection]);

  return {
    reflections,
    loading,
    updateReflection,
    getReflection,
    isReflectionCompleted,
    getCompletionPercentage,
    formatDate,
    startOfDay,
    hasAccessCode: !!accessCode
  };
};