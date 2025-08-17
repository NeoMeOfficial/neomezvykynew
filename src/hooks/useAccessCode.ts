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

  const generateNewCode = async (): Promise<string> => {
    try {
      const { data, error } = await supabase.rpc('generate_access_code');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating access code:', error);
      // Fallback to client-side generation if DB function fails
      return generateClientSideCode();
    }
  };

  const generateClientSideCode = (): string => {
    const words = ['apple', 'beach', 'chair', 'dance', 'eagle', 'flame', 'grape', 'house', 'island', 'jungle'];
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${word1.toUpperCase()}-${word2.toUpperCase()}-${number}`;
  };

  const setNewAccessCode = async (): Promise<string> => {
    const newCode = await generateNewCode();
    setAccessCode(newCode);
    localStorage.setItem(ACCESS_CODE_KEY, newCode);
    return newCode;
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
    setNewAccessCode,
    enterAccessCode,
    clearAccessCode
  };
};