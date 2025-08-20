import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from './use-mobile';

interface BiometricCapability {
  available: boolean;
  supported: boolean;
  enrolled: boolean;
}

interface BiometricCredential {
  id: string;
  publicKey: string;
  accessCode: string;
}

export const useBiometricAuth = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [credential, setCredential] = useState<BiometricCredential | null>(null);
  const isMobile = useIsMobile();

  // Check biometric capabilities
  const checkBiometricCapability = useCallback(async (): Promise<BiometricCapability> => {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        return { available: false, supported: false, enrolled: false };
      }

      // Check if platform authenticator is available (Face ID, Touch ID, etc.)
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      // Check if user has enrolled credentials
      const storedCredential = localStorage.getItem('biometric_credential');
      const enrolled = !!storedCredential;

      return {
        available,
        supported: true,
        enrolled
      };
    } catch (error) {
      console.error('Error checking biometric capability:', error);
      return { available: false, supported: false, enrolled: false };
    }
  }, []);

  // Initialize biometric status
  useEffect(() => {
    const initializeBiometric = async () => {
      setLoading(true);
      
      // Only check biometrics on mobile devices
      if (!isMobile) {
        setLoading(false);
        return;
      }

      const capability = await checkBiometricCapability();
      setIsSupported(capability.supported);
      setIsAvailable(capability.available);
      setIsEnrolled(capability.enrolled);

      if (capability.enrolled) {
        const storedCredential = localStorage.getItem('biometric_credential');
        if (storedCredential) {
          setCredential(JSON.parse(storedCredential));
        }
      }

      setLoading(false);
    };

    initializeBiometric();
  }, [isMobile, checkBiometricCapability]);

  // Register biometric credential
  const registerBiometric = useCallback(async (accessCode: string): Promise<boolean> => {
    if (!isSupported || !isAvailable) {
      throw new Error('Biometric authentication not available');
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'Habit Tracker',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(accessCode),
            name: accessCode,
            displayName: 'User',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'direct',
        },
      }) as PublicKeyCredential;

      if (credential) {
        const biometricCredential: BiometricCredential = {
          id: credential.id,
          publicKey: btoa(String.fromCharCode(...new Uint8Array((credential.response as any).publicKey))),
          accessCode,
        };

        localStorage.setItem('biometric_credential', JSON.stringify(biometricCredential));
        setCredential(biometricCredential);
        setIsEnrolled(true);

        console.log('Biometric credential registered successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to register biometric credential:', error);
      throw error;
    }
  }, [isSupported, isAvailable]);

  // Authenticate with biometrics
  const authenticateWithBiometric = useCallback(async (): Promise<string | null> => {
    if (!isEnrolled || !credential) {
      throw new Error('No biometric credential enrolled');
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{
            id: new TextEncoder().encode(credential.id),
            type: 'public-key',
          }],
          userVerification: 'required',
          timeout: 60000,
        },
      });

      if (assertion) {
        console.log('Biometric authentication successful');
        return credential.accessCode;
      }

      return null;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      throw error;
    }
  }, [credential, isEnrolled]);

  // Clear biometric credential
  const clearBiometric = useCallback(async (): Promise<void> => {
    localStorage.removeItem('biometric_credential');
    setCredential(null);
    setIsEnrolled(false);
    console.log('Biometric credential cleared');
  }, []);

  // Check if biometric auth should be primary option
  const shouldOfferBiometric = useCallback((): boolean => {
    return isMobile && isSupported && isAvailable;
  }, [isMobile, isSupported, isAvailable]);

  return {
    isSupported,
    isAvailable,
    isEnrolled,
    loading,
    credential,
    isMobile,
    registerBiometric,
    authenticateWithBiometric,
    clearBiometric,
    shouldOfferBiometric,
    checkBiometricCapability,
  };
};