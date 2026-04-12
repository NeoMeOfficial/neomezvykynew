import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase, UserProfile } from '../lib/supabase';
import { migrateLocalStorageToSupabase } from '../utils/dataMigration';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.log('🎯 Demo Mode: Supabase not configured, using localStorage fallback');
      setLoading(false);
      return;
    }

    // Real Supabase auth initialization
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadUserProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      setProfile(data);

      // Run data migration from localStorage if needed
      setTimeout(() => {
        migrateLocalStorageToSupabase(userId).catch(err => {
          console.error('Migration failed:', err);
        });
      }, 1000); // Delay to avoid blocking UI

    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      if (!isSupabaseConfigured()) {
        // Demo mode fallback
        console.log('🎯 Demo signup for:', email);
        const mockUser = {
          id: 'demo_' + Date.now(),
          email,
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: { first_name: firstName, last_name: lastName },
          aud: 'authenticated',
          updated_at: new Date().toISOString()
        } as User;
        
        const mockProfile = {
          id: mockUser.id,
          email,
          first_name: firstName,
          last_name: lastName,
          subscription_status: 'free' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Store in localStorage for demo
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        localStorage.setItem('demo_profile', JSON.stringify(mockProfile));
        
        setUser(mockUser);
        setProfile(mockProfile);
        
        return { error: null };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured()) {
        // Demo mode fallback
        console.log('🎯 Demo signin for:', email);
        const demoUser = localStorage.getItem('demo_user');
        const demoProfile = localStorage.getItem('demo_profile');
        
        if (demoUser && demoProfile) {
          setUser(JSON.parse(demoUser));
          setProfile(JSON.parse(demoProfile));
          return { error: null };
        } else {
          // Create demo user on the fly
          return await signUp(email, password, 'Demo', 'User');
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      if (!isSupabaseConfigured()) {
        // Demo mode fallback
        console.log('🎯 Demo signout');
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_profile');
        setUser(null);
        setProfile(null);
        return { error: null };
      }

      const { error } = await supabase.auth.signOut();
      setProfile(null);
      return { error };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in' } };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      }

      // Reload profile
      await loadUserProfile(user.id);
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: error as AuthError };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return demo fallback instead of throwing error
    console.log('🎯 Demo Mode: SupabaseAuth not available, using demo fallback');
    const demoUserData = localStorage.getItem('demo_user');
    const demoSession = localStorage.getItem('demo_session');
    
    if (demoSession === 'active' && demoUserData) {
      const demoUser = JSON.parse(demoUserData);
      return {
        user: {
          id: demoUser.id,
          email: demoUser.email,
          created_at: demoUser.createdAt,
          updated_at: demoUser.createdAt,
          app_metadata: {},
          user_metadata: {},
          aud: 'demo',
          email_confirmed_at: demoUser.createdAt,
          confirmed_at: demoUser.createdAt,
          role: 'authenticated'
        },
        profile: {
          id: demoUser.id,
          email: demoUser.email,
          first_name: demoUser.firstName,
          last_name: demoUser.lastName,
          full_name: `${demoUser.firstName} ${demoUser.lastName}`,
          subscription_tier: 'premium' as const,
          subscription_status: 'active' as const,
          created_at: demoUser.createdAt,
          updated_at: demoUser.createdAt
        },
        session: null,
        loading: false,
        signUp: async () => ({ error: null }),
        signIn: async () => ({ error: null }),
        signOut: async () => ({ error: null }),
        updateProfile: async () => ({ error: null }),
        resetPassword: async () => ({ error: null })
      };
    }
    
    return {
      user: null,
      profile: null,
      session: null,
      loading: false,
      signUp: async () => ({ error: null }),
      signIn: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      updateProfile: async () => ({ error: null }),
      resetPassword: async () => ({ error: null })
    };
  }
  return context;
}

// Utility function to check if user has premium access
export function useIsPremiumUser() {
  const { profile } = useSupabaseAuth();
  
  if (!profile) return false;
  
  if (profile.subscription_status === 'premium') return true;
  
  if (profile.subscription_status === 'trial' && profile.trial_end_date) {
    const trialEndDate = new Date(profile.trial_end_date);
    return trialEndDate > new Date();
  }
  
  return false;
}