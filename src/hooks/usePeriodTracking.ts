import { useState, useEffect } from 'react';
import { supabase, PeriodTracking } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

export function usePeriodTracking() {
  const { user } = useSupabaseAuth();
  const [periods, setPeriods] = useState<PeriodTracking[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPeriods = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('period_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('cycle_start_date', { ascending: false });

      if (error) {
        console.error('Error loading periods:', error);
        // Fallback to localStorage
        await loadFromLocalStorage();
        return;
      }

      setPeriods(data || []);
    } catch (error) {
      console.error('Error loading periods:', error);
      await loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = async () => {
    if (!user) return;

    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.includes('period') || key.includes('menstrual') || key.includes('cycle')
      );

      const localPeriods: PeriodTracking[] = [];
      
      keys.forEach(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.startDate) {
            localPeriods.push({
              id: key,
              user_id: user.id,
              cycle_start_date: data.startDate,
              cycle_length: data.cycleLength || 28,
              period_length: data.periodLength || 5,
              symptoms: data.symptoms || [],
              notes: data.notes || '',
              created_at: data.createdAt || new Date().toISOString()
            });
          }
        } catch {
          // Skip invalid entries
        }
      });

      setPeriods(localPeriods.sort((a, b) => 
        new Date(b.cycle_start_date).getTime() - new Date(a.cycle_start_date).getTime()
      ));
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const addPeriod = async (periodData: Omit<PeriodTracking, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('period_tracking')
        .insert({
          user_id: user.id,
          ...periodData
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding period:', error);
        // Fallback to localStorage
        const fallbackId = `period_${Date.now()}`;
        const fallbackPeriod = {
          id: fallbackId,
          user_id: user.id,
          created_at: new Date().toISOString(),
          ...periodData
        };
        localStorage.setItem(fallbackId, JSON.stringify(fallbackPeriod));
        setPeriods(prev => [fallbackPeriod, ...prev]);
        return true;
      }

      setPeriods(prev => [data, ...prev]);
      return true;
    } catch (error) {
      console.error('Error adding period:', error);
      return false;
    }
  };

  const updatePeriod = async (id: string, updates: Partial<PeriodTracking>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('period_tracking')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating period:', error);
        // Fallback to localStorage
        const existing = localStorage.getItem(id);
        if (existing) {
          const updated = { ...JSON.parse(existing), ...updates };
          localStorage.setItem(id, JSON.stringify(updated));
          setPeriods(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
          return true;
        }
        return false;
      }

      setPeriods(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return true;
    } catch (error) {
      console.error('Error updating period:', error);
      return false;
    }
  };

  const deletePeriod = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('period_tracking')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting period:', error);
        // Fallback to localStorage
        localStorage.removeItem(id);
        setPeriods(prev => prev.filter(p => p.id !== id));
        return true;
      }

      setPeriods(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting period:', error);
      return false;
    }
  };

  // Utility functions
  const getCurrentCycle = () => {
    if (periods.length === 0) return null;
    
    const latestPeriod = periods[0];
    const cycleStartDate = new Date(latestPeriod.cycle_start_date);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      ...latestPeriod,
      daysSinceStart,
      currentPhase: getCyclePhase(daysSinceStart, latestPeriod.cycle_length, latestPeriod.period_length),
      daysUntilNext: Math.max(0, latestPeriod.cycle_length - daysSinceStart)
    };
  };

  const getCyclePhase = (daysSinceStart: number, cycleLength: number, periodLength: number): string => {
    if (daysSinceStart <= periodLength) {
      return 'menstrual';
    } else if (daysSinceStart <= periodLength + 7) {
      return 'follicular';
    } else if (daysSinceStart >= cycleLength - 7) {
      return 'luteal';
    } else {
      return 'ovulation';
    }
  };

  const getNextPeriodDate = () => {
    const currentCycle = getCurrentCycle();
    if (!currentCycle) return null;
    
    const nextDate = new Date(currentCycle.cycle_start_date);
    nextDate.setDate(nextDate.getDate() + currentCycle.cycle_length);
    return nextDate;
  };

  const isPeriodLate = () => {
    const nextPeriodDate = getNextPeriodDate();
    if (!nextPeriodDate) return false;
    
    const today = new Date();
    return today > nextPeriodDate;
  };

  useEffect(() => {
    if (user) {
      loadPeriods();
    }
  }, [user]);

  return {
    periods,
    loading,
    loadPeriods,
    addPeriod,
    updatePeriod,
    deletePeriod,
    getCurrentCycle,
    getNextPeriodDate,
    isPeriodLate
  };
}