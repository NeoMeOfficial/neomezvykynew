import { useState, useEffect, useCallback } from 'react';
import { persistentStorage } from '@/lib/persistentStorage';
import { useBiometricAuth } from './useBiometricAuth';

const ACCESS_CODE_KEY = 'habit_tracker_access_code';

export const useRobustAccessCode = () => {
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);
  
  // Always call biometric hook to maintain hook order
  const biometric = useBiometricAuth();
  const { 
    isEnrolled, 
    authenticateWithBiometric, 
    shouldOfferBiometric,
    isMobile 
  } = biometric;

  // Initialize access code on mount with retry logic and biometric auth
  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    const initializeWithRetry = async (attempt: number = 1) => {
      if (!isMounted) return;

      try {
        console.log(`Initializing access code (attempt ${attempt})`);
        
        // Try biometric authentication first on mobile if enrolled
        if (isMobile && isEnrolled && attempt === 1) {
          try {
            const biometricCode = await authenticateWithBiometric();
            if (biometricCode && isMounted) {
              setAccessCode(biometricCode);
              setLoading(false);
              setRetryCount(0);
              console.log('Biometric authentication successful');
              return;
            }
          } catch (biometricError) {
            console.log('Biometric authentication failed, falling back to persistent storage');
          }
        }
        
        // Fallback to persistent storage
        const retrievedCode = await persistentStorage.retrieve();
        
        if (isMounted) {
          setAccessCode(retrievedCode);
          setLoading(false);
          setRetryCount(0);
          
          if (retrievedCode) {
            console.log('Access code retrieved successfully:', retrievedCode);
          } else {
            console.log('No access code found');
          }
        }
      } catch (error) {
        console.error('Failed to retrieve access code:', error);
        
        if (isMounted && attempt < 3) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          
          retryTimeout = setTimeout(() => {
            setRetryCount(attempt);
            initializeWithRetry(attempt + 1);
          }, delay);
        } else if (isMounted) {
          // All retries failed, try localStorage as last resort
          try {
            const fallbackCode = localStorage.getItem(ACCESS_CODE_KEY);
            setAccessCode(fallbackCode);
            console.warn('Using localStorage fallback:', fallbackCode);
          } catch (fallbackError) {
            console.error('All storage methods failed:', fallbackError);
            setAccessCode(null);
          }
          setLoading(false);
          setRetryCount(attempt);
        }
      }
    };

    initializeWithRetry();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [isMobile, isEnrolled, authenticateWithBiometric]);

  // Periodic health check every 5 minutes
  useEffect(() => {
    if (!accessCode) return;

    const healthCheckInterval = setInterval(async () => {
      try {
        const health = await persistentStorage.healthCheck();
        const healthyMethods = Object.values(health).filter(Boolean).length;
        
        console.log(`Storage health check: ${healthyMethods}/4 methods working`);
        setLastHealthCheck(new Date());

        // If storage is degraded, try to restore
        if (healthyMethods < 2 && accessCode) {
          console.log('Storage degraded, attempting to restore...');
          await persistentStorage.store(accessCode);
        }
      } catch (error) {
        console.warn('Health check failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(healthCheckInterval);
  }, [accessCode]);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === ACCESS_CODE_KEY) {
        console.log('Access code changed in another tab');
        const newCode = event.newValue;
        setAccessCode(newCode);
        
        // Sync to other storage methods if we have a new code
        if (newCode) {
          await persistentStorage.store(newCode);
        }
      }
    };

    const handleAccessCodeChange = async (event: CustomEvent) => {
      const newCode = event.detail?.accessCode;
      console.log('Custom access code change event received:', newCode);
      setAccessCode(newCode);
      
      if (newCode) {
        await persistentStorage.store(newCode);
      } else {
        await persistentStorage.clear();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('accessCodeChanged', handleAccessCodeChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('accessCodeChanged', handleAccessCodeChange as EventListener);
    };
  }, []);

  const generateUniqueIdentifier = useCallback((): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }, []);

  const setCustomAccessCode = useCallback(async (customCode: string): Promise<string> => {
    const baseCode = customCode.toUpperCase().trim();
    const uniqueId = generateUniqueIdentifier();
    const finalCode = `${baseCode}-${uniqueId}`;
    
    try {
      const stored = await persistentStorage.store(finalCode);
      if (stored) {
        setAccessCode(finalCode);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('accessCodeChanged', { 
          detail: { accessCode: finalCode } 
        }));
        
        console.log('Custom access code created:', finalCode);
        return finalCode;
      } else {
        throw new Error('Failed to store access code');
      }
    } catch (error) {
      console.error('Failed to set custom access code:', error);
      throw error;
    }
  }, [generateUniqueIdentifier]);

  const enterAccessCode = useCallback(async (code: string): Promise<void> => {
    const formattedCode = code.toUpperCase().trim();
    
    try {
      const stored = await persistentStorage.store(formattedCode);
      if (stored) {
        setAccessCode(formattedCode);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('accessCodeChanged', { 
          detail: { accessCode: formattedCode } 
        }));
        
        console.log('Access code entered:', formattedCode);
      } else {
        throw new Error('Failed to store access code');
      }
    } catch (error) {
      console.error('Failed to enter access code:', error);
      throw error;
    }
  }, []);

  const clearAccessCode = useCallback(async (): Promise<void> => {
    try {
      await persistentStorage.clear();
      setAccessCode(null);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('accessCodeChanged', { 
        detail: { accessCode: null } 
      }));
      
      console.log('Access code cleared');
    } catch (error) {
      console.error('Failed to clear access code:', error);
      throw error;
    }
  }, []);

  const getRecentCodes = useCallback(() => {
    return persistentStorage.getRecentCodes();
  }, []);

  const reconnect = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const retrievedCode = await persistentStorage.retrieve();
      setAccessCode(retrievedCode);
      setLoading(false);
      
      if (retrievedCode) {
        console.log('Reconnected with code:', retrievedCode);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Reconnection failed:', error);
      setLoading(false);
      return false;
    }
  }, []);

  const generatePersonalLink = useCallback(() => {
    if (!accessCode) return '';
    return persistentStorage.generatePersonalLink(accessCode);
  }, [accessCode]);

  const isEmbedded = useCallback(() => {
    return persistentStorage.isEmbedded();
  }, []);

  // Biometric authentication method
  const authenticateWithBiometrics = useCallback(async (): Promise<string | null> => {
    if (!shouldOfferBiometric() || !isEnrolled) {
      throw new Error('Biometric authentication not available');
    }

    try {
      const biometricCode = await authenticateWithBiometric();
      if (biometricCode) {
        setAccessCode(biometricCode);
        console.log('Biometric authentication successful');
        return biometricCode;
      }
      return null;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      throw error;
    }
  }, [shouldOfferBiometric, isEnrolled, authenticateWithBiometric]);

  return {
    accessCode,
    loading,
    retryCount,
    lastHealthCheck,
    setCustomAccessCode,
    enterAccessCode,
    clearAccessCode,
    getRecentCodes,
    reconnect,
    generatePersonalLink,
    isEmbedded,
    // Biometric features
    shouldOfferBiometric,
    isEnrolled,
    isMobile,
    authenticateWithBiometrics
  };
};