import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { CycleData, DerivedState, CustomSettings } from './types';
import { getDerivedState } from './utils';

const defaultCustomSettings: CustomSettings = {
  notifications: true,
  symptomTracking: false,
  moodTracking: true,
  notes: ''
};

const defaultCycleData: CycleData = {
  lastPeriodStart: null,
  cycleLength: 28,
  periodLength: 5,
  customSettings: defaultCustomSettings,
  history: []
};

export function useSupabaseCycleData(accessCode?: string) {
  const [cycleData, setCycleData] = useState<CycleData>(defaultCycleData);
  const [loading, setLoading] = useState(true);
  const [derivedState, setDerivedState] = useState<DerivedState | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const realtimeChannelRef = useRef<any>();

  // Load data from Supabase
  const loadCycleData = useCallback(async () => {
    if (!accessCode) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cycle_data')
        .select('*')
        .eq('access_code', accessCode)
        .maybeSingle();

      if (error) {
        console.error('Failed to load cycle data:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const merged: CycleData = {
          lastPeriodStart: data.last_period_start,
          cycleLength: data.cycle_length,
          periodLength: data.period_length,
          customSettings: {
            ...defaultCustomSettings,
            ...(typeof data.custom_settings === 'object' && data.custom_settings ? data.custom_settings : {})
          },
          history: Array.isArray(data.history) ? data.history as any[] : []
        };
        setCycleData(merged);
      }
    } catch (error) {
      console.error('Failed to load cycle data:', error);
    } finally {
      setLoading(false);
    }
  }, [accessCode]);

  // Save data to Supabase with debouncing
  const saveCycleData = useCallback(async (data: CycleData) => {
    if (!accessCode) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const payload = {
          access_code: accessCode,
          last_period_start: data.lastPeriodStart,
          cycle_length: data.cycleLength,
          period_length: data.periodLength,
          custom_settings: data.customSettings as any,
          history: data.history as any || []
        };

        const { error } = await supabase
          .from('cycle_data')
          .upsert(payload, { onConflict: 'access_code' });

        if (error) {
          console.error('Failed to save cycle data:', error);
        }
      } catch (error) {
        console.error('Failed to save cycle data:', error);
      }
    }, 500);
  }, [accessCode]);

  // Update cycle data and save
  const updateCycleData = useCallback((updates: Partial<CycleData>) => {
    setCycleData(current => {
      const updated = { ...current, ...updates };
      saveCycleData(updated);
      return updated;
    });
  }, [saveCycleData]);

  // Set last period start date
  const setLastPeriodStart = useCallback((date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    updateCycleData({ lastPeriodStart: dateString });
  }, [updateCycleData]);

  // Set cycle length
  const setCycleLength = useCallback((length: number) => {
    updateCycleData({ cycleLength: Math.max(21, Math.min(45, length)) });
  }, [updateCycleData]);

  // Set period length
  const setPeriodLength = useCallback((length: number) => {
    updateCycleData({ periodLength: Math.max(2, Math.min(10, length)) });
  }, [updateCycleData]);

  // Add period to history
  const addPeriodToHistory = useCallback((startDate: string, endDate?: string) => {
    setCycleData(current => {
      const history = current.history || [];
      const newEntry = { startDate, endDate };
      const updated = {
        ...current,
        history: [...history, newEntry].sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )
      };
      saveCycleData(updated);
      return updated;
    });
  }, [saveCycleData]);

  // Update custom settings
  const updateCustomSettings = useCallback((settings: Partial<CustomSettings>) => {
    updateCycleData({
      customSettings: {
        ...cycleData.customSettings,
        ...settings
      }
    });
  }, [updateCycleData, cycleData.customSettings]);

  // Set up real-time subscription
  useEffect(() => {
    if (!accessCode) return;

    const channel = supabase
      .channel(`cycle_data_${accessCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cycle_data',
          filter: `access_code=eq.${accessCode}`,
        },
        (payload) => {
          console.log('Real-time cycle data update:', payload);
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const data = payload.new;
            const merged: CycleData = {
              lastPeriodStart: data.last_period_start,
              cycleLength: data.cycle_length,
              periodLength: data.period_length,
              customSettings: {
                ...defaultCustomSettings,
                ...(typeof data.custom_settings === 'object' && data.custom_settings ? data.custom_settings : {})
              },
              history: Array.isArray(data.history) ? data.history as any[] : []
            };
            setCycleData(merged);
          }
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [accessCode]);

  // Calculate derived state when cycle data changes
  useEffect(() => {
    if (!loading) {
      setDerivedState(getDerivedState(cycleData));
    }
  }, [cycleData, loading]);

  // Load data on mount and access code change
  useEffect(() => {
    loadCycleData();
  }, [loadCycleData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    cycleData,
    derivedState,
    loading,
    setLastPeriodStart,
    setCycleLength,
    setPeriodLength,
    addPeriodToHistory,
    updateCustomSettings,
    updateCycleData
  };
}