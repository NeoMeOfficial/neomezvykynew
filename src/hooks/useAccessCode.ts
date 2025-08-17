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

  const generateUniqueIdentifier = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const setCustomAccessCode = (customCode: string): string => {
    const baseCode = customCode.toUpperCase().trim();
    const uniqueId = generateUniqueIdentifier();
    const finalCode = `${baseCode}-${uniqueId}`;
    setAccessCode(finalCode);
    localStorage.setItem(ACCESS_CODE_KEY, finalCode);
    return finalCode;
  };

  const enterAccessCode = (code: string) => {
    const formattedCode = code.toUpperCase().trim();
    setAccessCode(formattedCode);
    localStorage.setItem(ACCESS_CODE_KEY, formattedCode);
  };

  const clearAccessCode = () => {
    setAccessCode(null);
    localStorage.removeItem(ACCESS_CODE_KEY);
  };

  return {
    accessCode,
    loading,
    setCustomAccessCode,
    enterAccessCode,
    clearAccessCode
  };
};