import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { CycleData, DerivedState, CustomSettings } from './types';
import { getDerivedState } from './utils';

const STORAGE_KEY = 'cycle_data';

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

export function useCycleData(accessCode?: string) {
  const [cycleData, setCycleData] = useState<CycleData>(defaultCycleData);
  const [loading, setLoading] = useState(true);
  const [derivedState, setDerivedState] = useState<DerivedState | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate storage key with access code
  const getStorageKey = useCallback(() => {
    return accessCode ? `${STORAGE_KEY}_${accessCode}` : STORAGE_KEY;
  }, [accessCode]);

  // Load data from storage
  const loadCycleData = useCallback(async () => {
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = {
          ...defaultCycleData,
          ...parsed,
          customSettings: {
            ...defaultCustomSettings,
            ...parsed.customSettings
          }
        };
        setCycleData(merged);
      }
    } catch (error) {
      console.error('Failed to load cycle data:', error);
    } finally {
      setLoading(false);
    }
  }, [getStorageKey]);

  // Save data to storage with debouncing
  const saveCycleData = useCallback((data: CycleData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(data));
        
        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(new CustomEvent('cycleDataChanged', {
          detail: { accessCode, data }
        }));
      } catch (error) {
        console.error('Failed to save cycle data:', error);
      }
    }, 500);
  }, [getStorageKey, accessCode]);

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

  // Listen for cross-tab changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey() && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setCycleData(parsed);
        } catch (error) {
          console.error('Failed to parse cycle data from storage event:', error);
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail.accessCode === accessCode) {
        setCycleData(e.detail.data);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cycleDataChanged', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cycleDataChanged', handleCustomEvent as EventListener);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [getStorageKey, accessCode]);

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