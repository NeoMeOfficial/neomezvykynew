/**
 * Temporary storage system for widget data before access code creation
 * Stores data in memory and localStorage with clear temporary indicators
 */

const TEMP_HABIT_DATA_KEY = 'temp_habit_data';
const TEMP_REFLECTION_DATA_KEY = 'temp_reflection_data';
const TEMP_CYCLE_DATA_KEY = 'temp_cycle_data';
const TEMP_SESSION_KEY = 'temp_session_active';

export interface TempHabitEntry {
  habitId: string;
  date: string;
  value: number;
}

export interface TempReflectionEntry {
  date: string;
  well_done: string | null;
  improve: string | null;
}

export interface TempCycleData {
  lastPeriodStart: string | null;
  cycleLength: number;
  periodLength: number;
  history: Array<{ start: string; end?: string }>;
}

class TemporaryStorage {
  private habitData: Map<string, number> = new Map();
  private reflectionData: Map<string, TempReflectionEntry> = new Map();
  private cycleData: TempCycleData | null = null;
  private sessionActive = false;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Load temporary data from localStorage
   */
  private loadFromStorage(): void {
    try {
      // Check if temporary session is active
      this.sessionActive = localStorage.getItem(TEMP_SESSION_KEY) === 'true';

      if (this.sessionActive) {
        // Load habit data
        const tempHabits = localStorage.getItem(TEMP_HABIT_DATA_KEY);
        if (tempHabits) {
          const habitEntries: TempHabitEntry[] = JSON.parse(tempHabits);
          habitEntries.forEach(entry => {
            const key = `${entry.habitId}_${entry.date}`;
            this.habitData.set(key, entry.value);
          });
        }

        // Load reflection data
        const tempReflections = localStorage.getItem(TEMP_REFLECTION_DATA_KEY);
        if (tempReflections) {
          const reflectionEntries: TempReflectionEntry[] = JSON.parse(tempReflections);
          reflectionEntries.forEach(entry => {
            this.reflectionData.set(entry.date, entry);
          });
        }

        // Load cycle data
        const tempCycle = localStorage.getItem(TEMP_CYCLE_DATA_KEY);
        if (tempCycle) {
          this.cycleData = JSON.parse(tempCycle);
        }
      }
    } catch (error) {
      console.warn('Failed to load temporary data:', error);
    }
  }

  /**
   * Save habit data to temporary storage
   */
  private saveToStorage(): void {
    try {
      // Save session state
      localStorage.setItem(TEMP_SESSION_KEY, 'true');

      // Save habit data
      const habitEntries: TempHabitEntry[] = [];
      this.habitData.forEach((value, key) => {
        const [habitId, date] = key.split('_');
        habitEntries.push({ habitId, date, value });
      });
      localStorage.setItem(TEMP_HABIT_DATA_KEY, JSON.stringify(habitEntries));

      // Save reflection data
      const reflectionEntries: TempReflectionEntry[] = Array.from(this.reflectionData.values());
      localStorage.setItem(TEMP_REFLECTION_DATA_KEY, JSON.stringify(reflectionEntries));

      // Save cycle data
      if (this.cycleData) {
        localStorage.setItem(TEMP_CYCLE_DATA_KEY, JSON.stringify(this.cycleData));
      }
    } catch (error) {
      console.warn('Failed to save temporary data:', error);
    }
  }

  /**
   * Start a temporary session
   */
  startSession(): void {
    this.sessionActive = true;
    this.saveToStorage();
  }

  /**
   * Check if temporary session is active
   */
  isSessionActive(): boolean {
    return this.sessionActive;
  }

  /**
   * Check if there's any temporary data
   */
  hasTemporaryData(): boolean {
    return this.habitData.size > 0 || 
           this.reflectionData.size > 0 || 
           this.cycleData !== null;
  }

  /**
   * Store habit progress temporarily
   */
  storeHabitProgress(habitId: string, date: string, value: number): void {
    const key = `${habitId}_${date}`;
    this.habitData.set(key, value);
    this.saveToStorage();
  }

  /**
   * Get habit progress from temporary storage
   */
  getHabitProgress(habitId: string, date: string): number {
    const key = `${habitId}_${date}`;
    return this.habitData.get(key) || 0;
  }

  /**
   * Get all habit data for transfer
   */
  getAllHabitData(): TempHabitEntry[] {
    const entries: TempHabitEntry[] = [];
    this.habitData.forEach((value, key) => {
      const [habitId, date] = key.split('_');
      entries.push({ habitId, date, value });
    });
    return entries;
  }

  /**
   * Store reflection data temporarily
   */
  storeReflection(date: string, wellDone: string | null, improve: string | null): void {
    this.reflectionData.set(date, { date, well_done: wellDone, improve });
    this.saveToStorage();
  }

  /**
   * Get reflection from temporary storage
   */
  getReflection(date: string): TempReflectionEntry | null {
    return this.reflectionData.get(date) || null;
  }

  /**
   * Get all reflection data for transfer
   */
  getAllReflectionData(): TempReflectionEntry[] {
    return Array.from(this.reflectionData.values());
  }

  /**
   * Store cycle data temporarily
   */
  storeCycleData(data: TempCycleData): void {
    this.cycleData = { ...data };
    this.saveToStorage();
  }

  /**
   * Get cycle data from temporary storage
   */
  getCycleData(): TempCycleData | null {
    return this.cycleData;
  }

  /**
   * Clear all temporary data
   */
  clearAll(): void {
    this.habitData.clear();
    this.reflectionData.clear();
    this.cycleData = null;
    this.sessionActive = false;

    // Clear from localStorage
    localStorage.removeItem(TEMP_HABIT_DATA_KEY);
    localStorage.removeItem(TEMP_REFLECTION_DATA_KEY);
    localStorage.removeItem(TEMP_CYCLE_DATA_KEY);
    localStorage.removeItem(TEMP_SESSION_KEY);
  }

  /**
   * Get summary of temporary data for display
   */
  getDataSummary(): {
    habitEntries: number;
    reflectionEntries: number;
    hasCycleData: boolean;
  } {
    return {
      habitEntries: this.habitData.size,
      reflectionEntries: this.reflectionData.size,
      hasCycleData: this.cycleData !== null
    };
  }
}

// Create singleton instance
export const temporaryStorage = new TemporaryStorage();