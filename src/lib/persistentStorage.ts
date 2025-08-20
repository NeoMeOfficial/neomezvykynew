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
  private postMessageSetup = false;
  private parentCodeRequestPromise: Promise<string | null> | null = null;

  constructor() {
    this.initPromise = this.initialize();
    this.setupPostMessageProtocol();
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

  // Normalize and sanitize access codes coming from various sources (URL, user input)
  private sanitizeCode(code: string | null | undefined): string | null {
    if (!code) return null;
    // Trim spaces and zero-width chars, strip trailing non-word/hyphen chars, uppercase
    const cleaned = code.toString().replace(/[\u200B\uFEFF]/g, '').trim();
    const strippedTrailing = cleaned.replace(/[^\w-]+$/g, '');
    return strippedTrailing.toUpperCase();
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
      document.cookie = `${ACCESS_CODE_KEY}=${encodeURIComponent(code)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
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
   * Store access code using all available methods
   */
  async store(code: string): Promise<boolean> {
    const normalized = this.sanitizeCode(code);
    if (!normalized) return false;

    const results = await Promise.allSettled([
      this.storeInIndexedDB(normalized),
      Promise.resolve(this.storeInLocalStorage(normalized)),
      Promise.resolve(this.storeInCookie(normalized))
    ]);

    // Update recent codes
    this.updateRecentCodes(normalized);

    // Notify parent of the code change if embedded
    this.notifyParentOfCodeChanges(normalized);

    // Consider successful if at least one method worked
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    console.log(`Access code stored using ${successCount}/3 methods`);
    
    return successCount > 0;
  }

  /**
   * Retrieve access code with automatic fallback and parent request
   */
  async retrieve(): Promise<string | null> {
    const methods = [
      () => this.getFromIndexedDB(),
      () => Promise.resolve(this.getFromLocalStorage()),
      () => Promise.resolve(this.getFromCookie())
    ];

    for (const method of methods) {
      try {
        const result = await method();
        if (result.success && result.value) {
          const normalized = this.sanitizeCode(result.value);
          if (!normalized) continue;
          console.log('Access code retrieved successfully');
          // Update recent codes when successfully retrieved
          this.updateRecentCodes(normalized);
          
          return normalized;
        }
      } catch (error) {
        console.warn('Storage method failed:', error);
      }
    }

    // If no local code found and we're embedded, try requesting from parent
    if (this.isEmbedded()) {
      const parentCode = await this.requestAccessCodeFromParent();
      if (parentCode) {
        console.log('Access code received from parent');
        return parentCode;
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
      Promise.resolve(this.clearFromCookie())
    ]);

    // Notify parent of the clearing if embedded
    this.notifyParentOfCodeChanges(null);

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    console.log(`Access code cleared from ${successCount}/3 storage methods`);
    
    return successCount > 0;
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


  /**
   * Health check for all storage methods
   */
  async healthCheck(): Promise<{ [key: string]: boolean }> {
    const testValue = 'test_' + Date.now();
    const results = {
      indexedDB: false,
      localStorage: false,
      cookie: false
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


    return results;
  }

  /**
   * Generate a personal link with the access code
   */
  generatePersonalLink(accessCode: string): string {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?access_code=${encodeURIComponent(accessCode)}`;
  }

  /**
   * Check if running in an embedded context (iframe)
   */
  isEmbedded(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true; // If we can't access window.top, we're likely embedded
    }
  }

  /**
   * Setup PostMessage protocol for parent-widget communication
   */
  private setupPostMessageProtocol(): void {
    if (this.postMessageSetup || !this.isEmbedded()) return;
    
    this.postMessageSetup = true;
    
    window.addEventListener('message', (event) => {
      // Only accept messages from parent
      if (event.source !== window.parent) return;
      
      const { type, payload } = event.data;
      
      switch (type) {
        case 'WIDGET_RECEIVE_ACCESS_CODE':
          if (payload?.accessCode) {
            console.log('Received access code from parent:', payload.accessCode);
            this.handleParentCode(payload.accessCode);
          }
          break;
      }
    });
  }

  /**
   * Request access code from parent application
   */
  async requestAccessCodeFromParent(): Promise<string | null> {
    if (!this.isEmbedded()) return null;
    
    // Return existing promise if already requesting
    if (this.parentCodeRequestPromise) {
      return this.parentCodeRequestPromise;
    }
    
    this.parentCodeRequestPromise = new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log('Parent code request timed out');
        resolve(null);
      }, 3000); // 3 second timeout
      
      // Listen for response
      const handleResponse = (event: MessageEvent) => {
        if (event.source !== window.parent) return;
        
        const { type, payload } = event.data;
        if (type === 'WIDGET_RECEIVE_ACCESS_CODE' && payload?.accessCode) {
          clearTimeout(timeout);
          window.removeEventListener('message', handleResponse);
          resolve(payload.accessCode);
        }
      };
      
      window.addEventListener('message', handleResponse);
      
      // Request code from parent
      console.log('Requesting access code from parent');
      window.parent.postMessage({ type: 'WIDGET_REQUEST_ACCESS_CODE' }, '*');
    });
    
    return this.parentCodeRequestPromise;
  }

  /**
   * Handle access code received from parent
   */
  private async handleParentCode(accessCode: string): Promise<void> {
    try {
      // Store the code locally for offline use
      await this.store(accessCode);
      console.log('Parent access code stored locally');
    } catch (error) {
      console.error('Failed to store parent access code:', error);
    }
  }

  /**
   * Notify parent of access code changes
   */
  notifyParentOfCodeChanges(accessCode: string | null): void {
    if (!this.isEmbedded()) return;
    
    try {
      window.parent.postMessage({
        type: 'WIDGET_ACCESS_CODE_UPDATED',
        payload: { accessCode }
      }, '*');
      console.log('Notified parent of access code change:', accessCode);
    } catch (error) {
      console.warn('Failed to notify parent of code change:', error);
    }
  }
}

// Singleton instance
export const persistentStorage = new PersistentStorage();
