import { useState, useEffect, useCallback, useRef } from 'react';
import { format, differenceInDays } from 'date-fns';
import { CycleData, DerivedState, CustomSettings, PeriodIntensity, DailyPeriodData, PeriodLog } from './types';

// Calculate weighted average cycle length from history
// More recent cycles have higher weight for better predictions
export function calculateAverageCycleLength(history: PeriodLog[]): { average: number; cycleCount: number } | null {
  if (!history || history.length < 2) {
    return null;
  }

  // Sort history by date (newest first)
  const sortedHistory = [...history]
    .filter(entry => entry.startDate)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  if (sortedHistory.length < 2) {
    return null;
  }

  // Calculate cycle lengths between consecutive periods (max 6 cycles)
  const cycleLengths: number[] = [];
  const maxCycles = Math.min(sortedHistory.length - 1, 6);

  for (let i = 0; i < maxCycles; i++) {
    const currentStart = new Date(sortedHistory[i].startDate);
    const previousStart = new Date(sortedHistory[i + 1].startDate);
    const length = differenceInDays(currentStart, previousStart);

    // Only include reasonable cycle lengths (21-35 days)
    if (length >= 21 && length <= 35) {
      cycleLengths.push(length);
    }
  }

  if (cycleLengths.length === 0) {
    return null;
  }

  // Weighted average - more recent cycles have higher weight
  // Weights: most recent = 3, second = 2.5, third = 2, then 1.5, 1, 0.5
  const weights = [3, 2.5, 2, 1.5, 1, 0.5];
  let weightedSum = 0;
  let totalWeight = 0;

  cycleLengths.forEach((length, index) => {
    const weight = weights[index] || 0.5;
    weightedSum += length * weight;
    totalWeight += weight;
  });

  const average = Math.round(weightedSum / totalWeight);

  return {
    average: Math.max(21, Math.min(35, average)),
    cycleCount: cycleLengths.length
  };
}
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
  history: [],
  dailyPeriodData: []
};

export function useCycleData(accessCode?: string) {
  const [cycleData, setCycleData] = useState<CycleData>(defaultCycleData);
  const [loading, setLoading] = useState(false); // Changed to false for instant loading
  const [derivedState, setDerivedState] = useState<DerivedState | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate storage key with access code
  const getStorageKey = useCallback(() => {
    return accessCode ? `${STORAGE_KEY}_${accessCode}` : STORAGE_KEY;
  }, [accessCode]);

  // Load data from storage (instant, synchronous)
  const loadCycleData = useCallback(() => {
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
    }
    // No loading state - instant render
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
    updateCycleData({ cycleLength: Math.max(25, Math.min(35, length)) });
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

  // Set period intensity for a specific date
  const setPeriodIntensity = useCallback((date: string, intensity: PeriodIntensity | null) => {
    setCycleData(current => {
      const dailyPeriodData = current.dailyPeriodData || [];
      
      if (intensity === null) {
        // Remove the entry
        const updated = {
          ...current,
          dailyPeriodData: dailyPeriodData.filter(entry => entry.date !== date)
        };
        saveCycleData(updated);
        return updated;
      } else {
        // Add or update the entry
        const existingIndex = dailyPeriodData.findIndex(entry => entry.date === date);
        const newEntry: DailyPeriodData = { date, intensity };
        
        let updatedData;
        if (existingIndex >= 0) {
          updatedData = [...dailyPeriodData];
          updatedData[existingIndex] = newEntry;
        } else {
          updatedData = [...dailyPeriodData, newEntry];
        }
        
        const updated = {
          ...current,
          dailyPeriodData: updatedData.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        };
        saveCycleData(updated);
        return updated;
      }
    });
  }, [saveCycleData]);

  // Get period intensity for a specific date
  const getPeriodIntensity = useCallback((date: string): PeriodIntensity | undefined => {
    const dailyPeriodData = cycleData.dailyPeriodData || [];
    return dailyPeriodData.find(entry => entry.date === date)?.intensity;
  }, [cycleData.dailyPeriodData]);

  // Calculate derived state immediately when cycle data changes
  useEffect(() => {
    setDerivedState(getDerivedState(cycleData));
  }, [cycleData]);

  // Load data on mount and access code change (synchronous for instant loading)
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
    updateCycleData,
    setPeriodIntensity,
    getPeriodIntensity
  };
}