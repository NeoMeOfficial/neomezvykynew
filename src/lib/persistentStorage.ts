/**
 * Multi-layer persistent storage system for access codes
 * Provides maximum reliability with IndexedDB primary, multiple fallbacks, and auto-recovery
 */

const ACCESS_CODE_KEY = 'habit_tracker_access_code';
const RECENT_CODES_KEY = 'habit_tracker_recent_codes';
const DB_NAME = 'HabitTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'accessCodes';

interface StorageResult {
  success: boolean;
  value?: string | null;
  error?: string;
}

interface RecentCode {
  code: string;
  timestamp: number;
  lastUsed: number;
}

class PersistentStorage {
  private db: IDBDatabase | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Request persistent storage permission
      if ('storage' in navigator && 'persist' in navigator.storage) {
        const granted = await navigator.storage.persist();
        console.log('Persistent storage granted:', granted);
      }

      // Initialize IndexedDB
      await this.initializeIndexedDB();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize persistent storage:', error);
      this.isInitialized = false;
    }
  }

  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  /**
   * Store access code in IndexedDB (primary storage)
   */
  private async storeInIndexedDB(code: string): Promise<StorageResult> {
    try {
      await this.ensureInitialized();
      
      if (!this.db) {
        return { success: false, error: 'IndexedDB not available' };
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise((resolve, reject) => {
        const request = store.put({
          key: ACCESS_CODE_KEY,
          value: code,
          timestamp: Date.now()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return { success: true, value: code };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Retrieve access code from IndexedDB
   */
  private async getFromIndexedDB(): Promise<StorageResult> {
    try {
      await this.ensureInitialized();
      
      if (!this.db) {
        return { success: false, error: 'IndexedDB not available' };
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const result = await new Promise<any>((resolve, reject) => {
        const request = store.get(ACCESS_CODE_KEY);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return { success: true, value: result?.value || null };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Store access code in localStorage (backup storage)
   */
  private storeInLocalStorage(code: string): StorageResult {
    try {
      localStorage.setItem(ACCESS_CODE_KEY, code);
      return { success: true, value: code };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Retrieve access code from localStorage
   */
  private getFromLocalStorage(): StorageResult {
    try {
      const value = localStorage.getItem(ACCESS_CODE_KEY);
      return { success: true, value };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Store access code in cookie (secondary backup)
   */
  private storeInCookie(code: string): StorageResult {
    try {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 2); // 2 years
      document.cookie = `${ACCESS_CODE_KEY}=${encodeURIComponent(code)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      return { success: true, value: code };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Retrieve access code from cookie
   */
  private getFromCookie(): StorageResult {
    try {
      const cookies = document.cookie.split(';');
      const cookie = cookies.find(c => c.trim().startsWith(`${ACCESS_CODE_KEY}=`));
      const value = cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
      return { success: true, value };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Store access code in URL hash (session backup)
   */
  private storeInUrlHash(code: string): StorageResult {
    try {
      const hashData = { accessCode: code, timestamp: Date.now() };
      window.location.hash = `#data=${encodeURIComponent(btoa(JSON.stringify(hashData)))}`;
      return { success: true, value: code };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Retrieve access code from URL hash
   */
  private getFromUrlHash(): StorageResult {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#data=')) {
        const encodedData = hash.substring(6);
        const decodedData = JSON.parse(atob(decodeURIComponent(encodedData)));
        // Only use if less than 24 hours old
        if (Date.now() - decodedData.timestamp < 24 * 60 * 60 * 1000) {
          return { success: true, value: decodedData.accessCode };
        }
      }
      return { success: true, value: null };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Add code to recent codes list
   */
  private updateRecentCodes(code: string): void {
    try {
      const recentCodes: RecentCode[] = JSON.parse(localStorage.getItem(RECENT_CODES_KEY) || '[]');
      const now = Date.now();
      
      // Remove existing entry if present
      const filtered = recentCodes.filter(rc => rc.code !== code);
      
      // Add new entry at the beginning
      filtered.unshift({ code, timestamp: now, lastUsed: now });
      
      // Keep only last 5 codes
      const trimmed = filtered.slice(0, 5);
      
      localStorage.setItem(RECENT_CODES_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to update recent codes:', error);
    }
  }

  /**
   * Get recent access codes
   */
  getRecentCodes(): RecentCode[] {
    try {
      const recentCodes: RecentCode[] = JSON.parse(localStorage.getItem(RECENT_CODES_KEY) || '[]');
      return recentCodes.sort((a, b) => b.lastUsed - a.lastUsed);
    } catch (error) {
      console.warn('Failed to get recent codes:', error);
      return [];
    }
  }

  /**
   * Pin access code to URL query parameter for maximum persistence
   */
  private pinToUrl(code: string): StorageResult {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('access_code', code);
      window.history.replaceState({}, '', url.toString());
      return { success: true, value: code };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Retrieve access code from URL parameters
   */
  private getFromUrlParam(): StorageResult {
    try {
      const params = new URLSearchParams(window.location.search);
      const value = params.get('access_code') || params.get('code');
      return { success: true, value };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Store access code using all available methods
   */
  async store(code: string): Promise<boolean> {
    const results = await Promise.allSettled([
      this.storeInIndexedDB(code),
      Promise.resolve(this.storeInLocalStorage(code)),
      Promise.resolve(this.storeInCookie(code)),
      Promise.resolve(this.storeInUrlHash(code)),
      Promise.resolve(this.pinToUrl(code))
    ]);

    // Update recent codes
    this.updateRecentCodes(code);

    // Consider successful if at least one method worked
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    console.log(`Access code stored using ${successCount}/5 methods`);
    
    return successCount > 0;
  }

  /**
   * Retrieve access code with automatic fallback
   */
  async retrieve(): Promise<string | null> {
    // Prefer URL param first, then the most reliable methods for embedded browsers
    const methods = [
      () => Promise.resolve(this.getFromUrlParam()),
      () => Promise.resolve(this.getFromLocalStorage()),
      () => Promise.resolve(this.getFromCookie()),
      () => Promise.resolve(this.getFromUrlHash()),
      () => this.getFromIndexedDB(),
    ];

    for (const method of methods) {
      try {
        const result = await method();
        if (result.success && result.value) {
          console.log('Access code retrieved successfully');
          // Promote the code to all storage methods to ensure persistence
          await this.store(result.value);
          // Update recent codes when successfully retrieved
          this.updateRecentCodes(result.value);
          return result.value;
        }
      } catch (error) {
        console.warn('Storage method failed:', error);
      }
    }

    console.warn('No access code found in any storage method');
    return null;
  }

  /**
   * Clear access code from all storage methods
   */
  async clear(): Promise<boolean> {
    const results = await Promise.allSettled([
      this.clearFromIndexedDB(),
      Promise.resolve(this.clearFromLocalStorage()),
      Promise.resolve(this.clearFromCookie()),
      Promise.resolve(this.clearFromUrlHash()),
      Promise.resolve(this.clearUrlParam())
    ]);

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    console.log(`Access code cleared from ${successCount}/5 storage methods`);
    
    return successCount > 0;
  }

  /**
   * Clear access code from URL parameters
   */
  private clearUrlParam(): boolean {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('access_code');
      url.searchParams.delete('code');
      window.history.replaceState({}, '', url.toString());
      return true;
    } catch (error) {
      return false;
    }
  }

  private async clearFromIndexedDB(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      if (!this.db) return false;

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise((resolve, reject) => {
        const request = store.delete(ACCESS_CODE_KEY);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  private clearFromLocalStorage(): boolean {
    try {
      localStorage.removeItem(ACCESS_CODE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  private clearFromCookie(): boolean {
    try {
      document.cookie = `${ACCESS_CODE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      return true;
    } catch (error) {
      return false;
    }
  }

  private clearFromUrlHash(): boolean {
    try {
      if (window.location.hash.startsWith('#data=')) {
        window.location.hash = '';
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Health check for all storage methods
   */
  async healthCheck(): Promise<{ [key: string]: boolean }> {
    const testValue = 'test_' + Date.now();
    const results = {
      indexedDB: false,
      localStorage: false,
      cookie: false,
      urlHash: false
    };

    try {
      const idbResult = await this.storeInIndexedDB(testValue);
      results.indexedDB = idbResult.success;
      if (idbResult.success) {
        await this.clearFromIndexedDB();
      }
    } catch (error) {
      console.warn('IndexedDB health check failed:', error);
    }

    try {
      const lsResult = this.storeInLocalStorage(testValue);
      results.localStorage = lsResult.success;
      if (lsResult.success) {
        this.clearFromLocalStorage();
      }
    } catch (error) {
      console.warn('localStorage health check failed:', error);
    }

    try {
      const cookieResult = this.storeInCookie(testValue);
      results.cookie = cookieResult.success;
      if (cookieResult.success) {
        this.clearFromCookie();
      }
    } catch (error) {
      console.warn('Cookie health check failed:', error);
    }

    try {
      const hashResult = this.storeInUrlHash(testValue);
      results.urlHash = hashResult.success;
      if (hashResult.success) {
        this.clearFromUrlHash();
      }
    } catch (error) {
      console.warn('URL hash health check failed:', error);
    }

    return results;
  }

  /**
   * Generate a personal link with the access code
   */
  generatePersonalLink(code: string): string {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('access_code', code);
    return url.toString();
  }

  /**
   * Check if we're in an ephemeral browser context
   */
  isEphemeralContext(): boolean {
    try {
      // Check if storage is heavily restricted
      const testKey = '_test_storage_' + Date.now();
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      // If we can't access basic storage features, we're likely in an ephemeral context
      return !window.navigator.storage || !window.indexedDB;
    } catch {
      return true;
    }
  }
}

// Singleton instance
export const persistentStorage = new PersistentStorage();
