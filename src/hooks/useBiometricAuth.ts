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

interface BiometricError {
  code: string;
  message: string;
  userMessage: string;
  debugging?: string;
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

  // Parse WebAuthn error into user-friendly message
  const parseWebAuthnError = useCallback((error: any): BiometricError => {
    console.log('WebAuthn Error Details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
      userAgent: navigator.userAgent,
      isSecure: window.location.protocol === 'https:',
      isLocalhost: window.location.hostname === 'localhost'
    });

    // User cancelled or timeout
    if (error.name === 'NotAllowedError' || error.message?.includes('cancel')) {
      return {
        code: 'USER_CANCELLED',
        message: error.message,
        userMessage: 'Prihlásenie bolo zrušené. Skúste to znovu.',
        debugging: 'User cancelled the biometric prompt or it timed out'
      };
    }

    // Not supported
    if (error.name === 'NotSupportedError') {
      return {
        code: 'NOT_SUPPORTED',
        message: error.message,
        userMessage: 'Face ID/Touch ID nie je na tomto zariadení podporované.',
        debugging: 'WebAuthn or platform authenticator not supported'
      };
    }

    // Security requirements not met
    if (error.name === 'SecurityError') {
      return {
        code: 'SECURITY_ERROR',
        message: error.message,
        userMessage: 'Bezpečnostný problém. Skúste aplikáciu otvoriť v bezpečnom pripojení (HTTPS).',
        debugging: 'Security requirements not met - likely HTTPS required'
      };
    }

    // Invalid state (already registered)
    if (error.name === 'InvalidStateError') {
      return {
        code: 'ALREADY_REGISTERED',
        message: error.message,
        userMessage: 'Face ID je už nastavené pre tento kód. Skúste zadať iný kód.',
        debugging: 'Credential already exists for this user'
      };
    }

    // Unknown error
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error',
      userMessage: 'Neočakávaná chyba. Skúste to znovu alebo použite iba prístupový kód.',
      debugging: `Unknown WebAuthn error: ${error.name || 'NoName'} - ${error.message || 'NoMessage'}`
    };
  }, []);

  // Register biometric credential
  const registerBiometric = useCallback(async (accessCode: string): Promise<boolean> => {
    console.log('Starting biometric registration for accessCode:', accessCode);
    console.log('Current capabilities:', { isSupported, isAvailable, isMobile });
    
    if (!isSupported || !isAvailable) {
      const error = new Error('Biometric authentication not available');
      console.error('Registration failed - not available:', { isSupported, isAvailable });
      throw error;
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      console.log('Creating WebAuthn credential with:', {
        rpId: window.location.hostname,
        userAgent: navigator.userAgent,
        protocol: window.location.protocol
      });

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

      console.error('Credential creation returned null');
      return false;
    } catch (error) {
      const parsedError = parseWebAuthnError(error);
      console.error('Failed to register biometric credential:', parsedError);
      throw parsedError;
    }
  }, [isSupported, isAvailable, parseWebAuthnError]);

  // Authenticate with biometrics
  const authenticateWithBiometric = useCallback(async (): Promise<string | null> => {
    if (!isEnrolled || !credential) {
      throw new Error('No biometric credential enrolled');
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      console.log('Starting biometric authentication');

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

      console.log('Biometric authentication returned null');
      return null;
    } catch (error) {
      const parsedError = parseWebAuthnError(error);
      console.error('Biometric authentication failed:', parsedError);
      throw parsedError;
    }
  }, [credential, isEnrolled, parseWebAuthnError]);

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