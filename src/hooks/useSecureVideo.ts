// Hook for managing secure video access
import { useState, useEffect } from 'react';
import { secureVideoService, SecureVideoAccess } from '../services/SecureVideoService';

interface UseSecureVideoProps {
  exerciseId: string;
  programId: string;
  autoLoad?: boolean;
}

export const useSecureVideo = ({ exerciseId, programId, autoLoad = false }: UseSecureVideoProps) => {
  const [videoAccess, setVideoAccess] = useState<SecureVideoAccess | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVideo = async () => {
    if (!exerciseId || !programId) {
      setError('Missing exercise or program ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, get these from auth context
      const access = await secureVideoService.requestVideoAccess({
        exerciseId,
        programId,
        userId: 'demo-user', // Replace with actual user ID from auth
        sessionToken: 'demo-session' // Replace with actual session token
      });

      if (access.success) {
        setVideoAccess(access);
      } else {
        setError(access.error || 'Failed to access video');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const revokeAccess = () => {
    if (videoAccess?.accessToken) {
      secureVideoService.revokeAccessToken(videoAccess.accessToken);
      setVideoAccess(null);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadVideo();
    }
  }, [exerciseId, programId, autoLoad]);

  return {
    videoAccess,
    isLoading,
    error,
    loadVideo,
    revokeAccess,
    hasAccess: videoAccess?.success || false
  };
};