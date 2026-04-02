import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

type AuthContextType = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Return demo fallback instead of throwing error
    console.log('🎯 Demo Mode: AuthContext not available, using demo fallback');
    return {
      user: null,
      profile: null,
      session: null,
      loading: false,
      isAdmin: false,
      isCoach: false,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      updateProfile: async () => ({ error: null }),
      resetPassword: async () => ({ error: null })
    };
  }
  return ctx;
}
