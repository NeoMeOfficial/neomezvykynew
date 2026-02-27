import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  language: string;
  role: 'user' | 'admin' | 'coach';
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isCoach: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    isAdmin: false,
    isCoach: false,
  });

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data as Profile | null;
  }, []);

  useEffect(() => {
    // Add timeout for auth initialization
    const authTimeout = setTimeout(() => {
      console.warn('Supabase auth timeout - continuing without auth');
      setState(prev => ({ ...prev, loading: false }));
    }, 3000); // Reduced to 3 second timeout

    // Get initial session with error handling
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.warn('Supabase auth error:', error.message);
        clearTimeout(authTimeout);
        setState(prev => ({ ...prev, loading: false }));
        return;
      }
      clearTimeout(authTimeout);
      const user = session?.user ?? null;
      let profile: Profile | null = null;
      if (user) {
        try {
          profile = await fetchProfile(user.id);
        } catch (error) {
          console.warn('Failed to fetch profile, continuing without it', error);
        }
      }
      setState({
        user,
        profile,
        session,
        loading: false,
        isAdmin: profile?.role === 'admin',
        isCoach: profile?.role === 'coach',
      });
    }).catch((error) => {
      console.error('Supabase auth initialization failed:', error);
      clearTimeout(authTimeout);
      setState(prev => ({ ...prev, loading: false }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        let profile: Profile | null = null;
        if (user) {
          try {
            profile = await fetchProfile(user.id);
          } catch (error) {
            console.warn('Failed to fetch profile in auth change, continuing without it', error);
          }
        }
        setState({
          user,
          profile,
          session,
          loading: false,
          isAdmin: profile?.role === 'admin',
          isCoach: profile?.role === 'coach',
        });
      }
    );

    return () => {
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) return { error: new Error('Not logged in') };
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id);
    if (!error) {
      setState((prev) => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null,
      }));
    }
    return { error };
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };
}
