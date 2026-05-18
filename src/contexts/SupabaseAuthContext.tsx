import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, UserProfile } from '../lib/supabase';
import { CONSENT_POLICY_VERSION, ConsentType } from '../lib/consents';

const PENDING_CONSENTS_KEY = 'pending_consents_v1';

/**
 * Drain any consent decisions captured at signup (before the user had an
 * authed session — e.g. email-confirm or OAuth redirect) and write them
 * to consent_events via the record_consent RPC. Idempotent: clears the
 * localStorage key after a successful write so it can't double-fire.
 */
async function drainPendingConsents(): Promise<void> {
  if (typeof window === 'undefined') return;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PENDING_CONSENTS_KEY);
  } catch {
    return;
  }
  if (!raw) return;
  let parsed: {
    decisions?: Partial<Record<ConsentType, boolean>>;
    policy_version?: string;
    source?: 'signup' | 'app' | 'settings';
  } | null = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    localStorage.removeItem(PENDING_CONSENTS_KEY);
    return;
  }
  if (!parsed?.decisions) {
    localStorage.removeItem(PENDING_CONSENTS_KEY);
    return;
  }
  // Use the stashed policy_version (the one the user actually saw at
  // signup), not the current constant — important if the policy gets
  // bumped between the user clicking signup and their email confirm.
  const version = parsed.policy_version || CONSENT_POLICY_VERSION;
  const source = parsed.source || 'signup';
  const entries = Object.entries(parsed.decisions) as [ConsentType, boolean][];
  for (const [type, granted] of entries) {
    const { error } = await supabase.rpc('record_consent', {
      p_consent_type: type,
      p_granted: granted,
      p_policy_version: version,
      p_source: source,
      p_user_agent: navigator.userAgent.slice(0, 500),
    });
    if (error) {
      // Leave the stash in place so we retry on next session; bail out.
      console.warn('[consents] drain failed:', error.message);
      return;
    }
  }
  localStorage.removeItem(PENDING_CONSENTS_KEY);
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, gdprConsent?: boolean) => Promise<{ error: AuthError | null }>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
        setAdminRoleIfBootstrap();
        drainPendingConsents();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
        setAdminRoleIfBootstrap();
        drainPendingConsents();
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Calls the `set-admin-role` Edge Function. If the user is in the bootstrap
   * email list and doesn't yet have `app_metadata.role='admin'`, the function
   * sets it. We then refresh the session so the new JWT (with the role claim)
   * is picked up by RLS-protected queries.
   *
   * Safe to call on every session change — the Edge Function is idempotent.
   */
  const setAdminRoleIfBootstrap = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('set-admin-role', {});
      if (error) {
        console.warn('set-admin-role failed (non-fatal):', error.message);
        return;
      }
      if (data?.justSet) {
        // Force JWT refresh to pick up the new role claim
        await supabase.auth.refreshSession();
      }
    } catch (err) {
      console.warn('set-admin-role threw (non-fatal):', err);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      setProfile(data);

      // Process pending referral code (set during landing page visit)
      const pendingReferralCode = localStorage.getItem('referralCode');
      if (pendingReferralCode) {
        processReferralOnSignup(pendingReferralCode, userId);
      }

    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const processReferralOnSignup = async (code: string, newUserId: string) => {
    try {
      // Look up the referral code
      const { data: codeData, error: codeErr } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (codeErr || !codeData) {
        console.warn('[referral] Invalid or inactive code:', code);
        localStorage.removeItem('referralCode');
        return;
      }

      // Don't self-refer
      if (codeData.user_id === newUserId) {
        localStorage.removeItem('referralCode');
        return;
      }

      // Check not already referred
      const { data: existing } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_user_id', newUserId)
        .maybeSingle();

      if (existing) {
        localStorage.removeItem('referralCode');
        return;
      }

      // Create referral record (pending — admin approves to release credits)
      await supabase.from('referrals').insert({
        referrer_user_id: codeData.user_id,
        referred_user_id: newUserId,
        referral_code: code.toUpperCase(),
        credit_amount: 1400, // €14 credit
        status: 'pending',
      });

      localStorage.removeItem('referralCode');
      console.log('[referral] Referral recorded for code:', code);
    } catch (err) {
      console.warn('[referral] Failed to process referral:', err);
      localStorage.removeItem('referralCode');
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, gdprConsent = false) => {
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
          // After clicking the confirmation email, land on /auth so the
          // user explicitly logs in with the credentials they just set.
          // Without this, Supabase redirects to the Site URL root which
          // is the marketing Welcome screen — visually confusing.
          emailRedirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/auth`
              : undefined,
          data: {
            first_name: firstName,
            last_name: lastName,
            gdpr_consent: gdprConsent,
            gdpr_consent_at: gdprConsent ? new Date().toISOString() : null,
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
        .from('profiles')
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
    throw new Error('useSupabaseAuth must be used inside <SupabaseAuthProvider>');
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