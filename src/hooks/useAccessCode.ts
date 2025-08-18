import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ACCESS_CODE_KEY = 'habit_tracker_access_code';

export const useAccessCode = () => {
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing access code in localStorage
    const savedCode = localStorage.getItem(ACCESS_CODE_KEY);
    if (savedCode) {
      setAccessCode(savedCode);
    }
    setLoading(false);
  }, []);

  // Listen for access code changes from other components
  useEffect(() => {
    const handleAccessCodeChange = (event: CustomEvent) => {
      const newCode = event.detail?.accessCode;
      setAccessCode(newCode);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ACCESS_CODE_KEY) {
        setAccessCode(event.newValue);
      }
    };

    window.addEventListener('accessCodeChanged', handleAccessCodeChange as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('accessCodeChanged', handleAccessCodeChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const generateUniqueIdentifier = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const setCustomAccessCode = (customCode: string): string => {
    const baseCode = customCode.toUpperCase().trim();
    const uniqueId = generateUniqueIdentifier();
    const finalCode = `${baseCode}-${uniqueId}`;
    setAccessCode(finalCode);
    localStorage.setItem(ACCESS_CODE_KEY, finalCode);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('accessCodeChanged', { 
      detail: { accessCode: finalCode } 
    }));
    
    return finalCode;
  };

  const enterAccessCode = (code: string) => {
    const formattedCode = code.toUpperCase().trim();
    setAccessCode(formattedCode);
    localStorage.setItem(ACCESS_CODE_KEY, formattedCode);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('accessCodeChanged', { 
      detail: { accessCode: formattedCode } 
    }));
  };

  const clearAccessCode = () => {
    setAccessCode(null);
    localStorage.removeItem(ACCESS_CODE_KEY);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('accessCodeChanged', { 
      detail: { accessCode: null } 
    }));
  };

  return {
    accessCode,
    loading,
    setCustomAccessCode,
    enterAccessCode,
    clearAccessCode
  };
};