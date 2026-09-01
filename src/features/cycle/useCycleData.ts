import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { format, differenceInDays } from 'date-fns';
import { CycleData, CustomSettings, PeriodIntensity, DailyPeriodData, PeriodLog } from './types';
import { useSubscription } from '@/contexts/SubscriptionContext';

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

    // Only include reasonable cycle lengths (21-45 days, supports irregular/PCOS cycles)
    if (length >= 21 && length <= 45) {
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
    average: Math.max(21, Math.min(45, average)),
    cycleCount: cycleLengths.length
  };
}
import { getDerivedState } from './utils';
import { loadCycleData as loadFromStore, saveCycleData as saveToStore } from './cycleDataStore';

const STORAGE_KEY = 'cycle_data';

// In-memory copy of the latest saved state, shared by every hook instance
// in this tab. Two jobs: (1) free tier never touches localStorage (BC-4
// preview-only), yet each page mounts its own useCycleData — without this,
// entering data and navigating to another page silently lost the preview;
// (2) it lets a freshly mounted instance see data whose debounced
// localStorage write hasn't landed yet.
let sessionCycleData: CycleData | null = null;

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
  // Persistence is the Plus perk (BC-4 "Náhľad bez ukladania"): free
  // users get the full live UI, but entries stay in-memory only and
  // vanish on reload. Plus members persist to localStorage + cycle_data.
  const { isPremium } = useSubscription();
  const [cycleData, setCycleData] = useState<CycleData>(defaultCycleData);
  const [loading, setLoading] = useState(false); // Changed to false for instant loading
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Derived state is pure — recompute on every cycleData change, no extra
  // render cycle. (Previously a useState+useEffect that flashed null first.)
  const derivedState = useMemo(() => getDerivedState(cycleData), [cycleData]);

  // Generate storage key with access code
  const getStorageKey = useCallback(() => {
    return accessCode ? `${STORAGE_KEY}_${accessCode}` : STORAGE_KEY;
  }, [accessCode]);

  // Load data from storage — instant from localStorage, then hydrate from Supabase if available
  const loadCycleData = useCallback(() => {
    // Step 1: load localStorage immediately for instant render
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = {
          ...defaultCycleData,
          ...parsed,
          customSettings: { ...defaultCustomSettings, ...parsed.customSettings }
        };
        setCycleData(merged);
      } else if (sessionCycleData) {
        // Nothing persisted, but another instance saved in-memory this
        // session (free-tier preview, or a debounced write still pending).
        setCycleData(sessionCycleData);
      }
    } catch (error) {
      console.error('Failed to load cycle data from localStorage:', error);
    }

    // Step 2: hydrate from the canonical cycle_data table in the background.
    // The table (or the lazily-migrated legacy blob) is authoritative — it
    // wins over localStorage when it has a recorded period start.
    loadFromStore().then(remoteData => {
      if (!remoteData) return;
      const merged = {
        ...defaultCycleData,
        ...remoteData,
        customSettings: { ...defaultCustomSettings, ...remoteData.customSettings }
      };
      setCycleData(current => {
        const remoteHistoryLen = merged.history?.length ?? 0;
        const localHistoryLen = current.history?.length ?? 0;
        if (merged.lastPeriodStart && remoteHistoryLen >= localHistoryLen) {
          // Same cycle, remote missing the recorded period end (older schema
          // or a failed remote write) — keep the local record instead of
          // silently reverting the correction.
          const final = (
            !merged.currentPeriodEnd
            && current.currentPeriodEnd
            && current.lastPeriodStart === merged.lastPeriodStart
          )
            ? { ...merged, currentPeriodEnd: current.currentPeriodEnd, bleedLengths: current.bleedLengths ?? merged.bleedLengths }
            : merged;
          try {
            localStorage.setItem(getStorageKey(), JSON.stringify(final));
          } catch (_) { /* ignore */ }
          return final;
        }
        return current;
      });
    }).catch(err => console.warn('Failed to hydrate cycle data:', err));
  }, [getStorageKey]);

  // Save data to storage with debouncing. The pending write is FLUSHED on
  // unmount, never dropped — the old clearTimeout-only cleanup cancelled
  // the save whenever a component navigated away within the debounce
  // window (the first-setup flow always did: save → navigate immediately),
  // so the entered period silently never persisted.
  const pendingSaveRef = useRef<CycleData | null>(null);

  const flushSave = useCallback(() => {
    const data = pendingSaveRef.current;
    if (!data) return;
    pendingSaveRef.current = null;
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(data));

      // Dispatch custom event for cross-tab sync
      window.dispatchEvent(new CustomEvent('cycleDataChanged', {
        detail: { accessCode, data }
      }));

      // Persist to the canonical cycle_data table (fire-and-forget).
      saveToStore(data);
    } catch (error) {
      console.error('Failed to save cycle data:', error);
    }
  }, [getStorageKey, accessCode]);

  const saveCycleData = useCallback((data: CycleData) => {
    sessionCycleData = data;

    if (!isPremium) {
      // Free tier: preview only, nothing persists. sessionCycleData keeps
      // the preview alive across route changes; the (debounced) event just
      // syncs instances mounted right now.
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cycleDataChanged', {
          detail: { accessCode, data }
        }));
      }, 0);
      return;
    }

    pendingSaveRef.current = data;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(flushSave, 500);
  }, [accessCode, isPremium, flushSave]);

  // Update cycle data and save
  const updateCycleData = useCallback((updates: Partial<CycleData>) => {
    setCycleData(current => {
      const updated = { ...current, ...updates };
      saveCycleData(updated);
      return updated;
    });
  }, [saveCycleData]);

  // Set last period start date — a new period invalidates the previous
  // "period ended" marker.
  const setLastPeriodStart = useCallback((date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    updateCycleData({ lastPeriodStart: dateString, currentPeriodEnd: null });
  }, [updateCycleData]);

  // Mark the current period as ended ("Skončila dnes"). Records the actual
  // bleed length and — after 3 recorded periods — auto-calibrates
  // periodLength the same way cycle length learns from history.
  const markPeriodEnded = useCallback((date: Date) => {
    setCycleData(current => {
      if (!current.lastPeriodStart) return current;
      const start = new Date(current.lastPeriodStart + 'T00:00:00');
      const actualLength = differenceInDays(date, start) + 1;
      if (actualLength < 1) return current;

      const bleedLengths = [...(current.bleedLengths ?? []), Math.min(actualLength, 14)].slice(-6);
      let learnedPeriodLength = current.periodLength;
      if (bleedLengths.length >= 3) {
        const avg = Math.round(bleedLengths.reduce((s, n) => s + n, 0) / bleedLengths.length);
        learnedPeriodLength = Math.max(2, Math.min(10, avg));
      }

      const updated = {
        ...current,
        currentPeriodEnd: format(date, 'yyyy-MM-dd'),
        bleedLengths,
        periodLength: learnedPeriodLength,
      };
      saveCycleData(updated);
      return updated;
    });
  }, [saveCycleData]);

  // Correct the recorded end of the CURRENT period after the fact
  // (Gabi 2026-08-17: ended it a day late and had nowhere to fix it).
  // Unlike markPeriodEnded, a re-correction REPLACES the bleed length
  // learned for this period instead of appending a second one.
  const correctPeriodEnd = useCallback((date: Date) => {
    setCycleData(current => {
      if (!current.lastPeriodStart) return current;
      const start = new Date(current.lastPeriodStart + 'T00:00:00');
      const actualLength = differenceInDays(date, start) + 1;
      if (actualLength < 1) return current;

      const hadEnd = !!current.currentPeriodEnd && current.currentPeriodEnd >= current.lastPeriodStart;
      const base = current.bleedLengths ?? [];
      const bleedLengths = [...(hadEnd ? base.slice(0, -1) : base), Math.min(actualLength, 14)].slice(-6);
      let learnedPeriodLength = current.periodLength;
      if (bleedLengths.length >= 3) {
        const avg = Math.round(bleedLengths.reduce((s, n) => s + n, 0) / bleedLengths.length);
        learnedPeriodLength = Math.max(2, Math.min(10, avg));
      }

      const updated = {
        ...current,
        currentPeriodEnd: format(date, 'yyyy-MM-dd'),
        bleedLengths,
        periodLength: learnedPeriodLength,
      };
      saveCycleData(updated);
      return updated;
    });
  }, [saveCycleData]);

  // Correct BOTH dates of the last period at once (the ✎ editor in the
  // "Tvoj cyklus" section). Atomic — a start-then-end pair of updates would
  // race the debounced save and clear currentPeriodEnd in between.
  // end === null means "ešte trvá": the end marker is cleared.
  const correctPeriod = useCallback((start: Date, end: Date | null) => {
    setCycleData(current => {
      const startStr = format(start, 'yyyy-MM-dd');
      if (!end) {
        const updated = { ...current, lastPeriodStart: startStr, currentPeriodEnd: null };
        saveCycleData(updated);
        return updated;
      }
      const actualLength = differenceInDays(end, start) + 1;
      if (actualLength < 1) return current;

      const hadEnd = !!current.currentPeriodEnd && !!current.lastPeriodStart
        && current.currentPeriodEnd >= current.lastPeriodStart;
      const base = current.bleedLengths ?? [];
      const bleedLengths = [...(hadEnd ? base.slice(0, -1) : base), Math.min(actualLength, 14)].slice(-6);
      let learnedPeriodLength = current.periodLength;
      if (bleedLengths.length >= 3) {
        const avg = Math.round(bleedLengths.reduce((s, n) => s + n, 0) / bleedLengths.length);
        learnedPeriodLength = Math.max(2, Math.min(10, avg));
      }

      const updated = {
        ...current,
        lastPeriodStart: startStr,
        currentPeriodEnd: format(end, 'yyyy-MM-dd'),
        bleedLengths,
        periodLength: learnedPeriodLength,
      };
      saveCycleData(updated);
      return updated;
    });
  }, [saveCycleData]);

  // Set cycle length
  const setCycleLength = useCallback((length: number) => {
    updateCycleData({ cycleLength: Math.max(21, Math.min(45, length)) });
  }, [updateCycleData]);

  // Set period length
  const setPeriodLength = useCallback((length: number) => {
    updateCycleData({ periodLength: Math.max(2, Math.min(10, length)) });
  }, [updateCycleData]);

  // Add period to history + silently apply learned cycle length after ≥3 cycles
  const addPeriodToHistory = useCallback((startDate: string, endDate?: string) => {
    setCycleData(current => {
      const history = current.history || [];
      const newEntry = { startDate, endDate };
      const updatedHistory = [...history, newEntry].sort((a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      // Auto-calibrate cycle length from learned history (≥3 complete cycles)
      const avgResult = calculateAverageCycleLength(updatedHistory);
      const learnedCycleLength = (avgResult && avgResult.cycleCount >= 3)
        ? avgResult.average
        : current.cycleLength;

      const updated = {
        ...current,
        history: updatedHistory,
        cycleLength: learnedCycleLength
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

  // Load data on mount and access code change (synchronous for instant loading)
  useEffect(() => {
    loadCycleData();
  }, [loadCycleData]);

  // A PWA gets killed without unmounting — flush the debounced write the
  // moment the app goes to background so closing it can't lose the change.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') flushSave();
    };
    window.addEventListener('pagehide', flushSave);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', flushSave);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [flushSave]);

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
      // Unmounting mid-debounce must not lose the write.
      flushSave();
    };
  }, [getStorageKey, accessCode, flushSave]);

  return {
    cycleData,
    derivedState,
    loading,
    setLastPeriodStart,
    setCycleLength,
    setPeriodLength,
    markPeriodEnded,
    correctPeriodEnd,
    correctPeriod,
    addPeriodToHistory,
    updateCustomSettings,
    updateCycleData,
    setPeriodIntensity,
    getPeriodIntensity
  };
}