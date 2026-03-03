import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { ReferralCode, ReferralStats } from '../types/referral';

/**
 * Auto-detects demo mode: if no authenticated user or Supabase errors,
 * falls back to localStorage demo data transparently.
 */

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getDemoData() {
  const stored = localStorage.getItem('neome_referral');
  if (stored) return JSON.parse(stored);
  const code = generateCode();
  const data = {
    code,
    totalCredits: 2800,
    totalEarned: 4200,
    totalApplied: 1400,
    totalReferrals: 3,
    approvedReferrals: 2,
    pendingReferrals: 1,
  };
  localStorage.setItem('neome_referral', JSON.stringify(data));
  return data;
}

function useDemoFallback() {
  const data = getDemoData();
  return {
    referralCode: {
      id: 'demo-1',
      user_id: 'demo-user',
      code: data.code,
      created_at: new Date().toISOString(),
      is_active: true,
    } as ReferralCode,
    credits: {
      total_credits: data.totalCredits,
      total_earned: data.totalEarned,
      total_applied: data.totalApplied,
    },
    stats: {
      totalReferrals: data.totalReferrals,
      approvedReferrals: data.approvedReferrals,
      pendingReferrals: data.pendingReferrals,
      totalCreditsEarned: data.totalEarned,
      totalCreditsApplied: data.totalApplied,
      availableCredits: data.totalCredits,
    } as ReferralStats,
  };
}

export function useReferral() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [credits, setCredits] = useState<{ total_credits: number; total_earned: number; total_applied: number } | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);

  // Initialize — try Supabase, fall back to demo
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // No real user? Demo mode
      if (!user?.id || user.id === 'demo-user-id') {
        const demo = useDemoFallback();
        setReferralCode(demo.referralCode);
        setCredits(demo.credits);
        setStats(demo.stats);
        setIsDemo(true);
        setLoading(false);
        return;
      }

      try {
        // Try to load existing referral code
        const { data: existingCode, error: codeErr } = await supabase
          .from('referral_codes')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (codeErr && codeErr.code !== 'PGRST116') {
          // Table doesn't exist or permission error — demo fallback
          throw codeErr;
        }

        if (existingCode) {
          setReferralCode(existingCode);
        } else {
          // Generate new code
          let newCode = generateCode();
          const { data: createdCode, error: createErr } = await supabase
            .from('referral_codes')
            .insert({ user_id: user.id, code: newCode, is_active: true })
            .select()
            .single();

          if (createErr) throw createErr;
          setReferralCode(createdCode);
        }

        // Load credits
        const { data: creditData } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (creditData) {
          setCredits(creditData);
        } else {
          // Initialize credits row
          await supabase.from('user_credits').upsert({
            user_id: user.id,
            total_credits: 0,
            total_earned: 0,
            total_applied: 0,
          });
          setCredits({ total_credits: 0, total_earned: 0, total_applied: 0 });
        }

        // Load stats
        const { data: referrals } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_user_id', user.id);

        const refs = referrals || [];
        setStats({
          totalReferrals: refs.length,
          approvedReferrals: refs.filter(r => r.status === 'approved').length,
          pendingReferrals: refs.filter(r => r.status === 'pending').length,
          totalCreditsEarned: creditData?.total_earned || 0,
          totalCreditsApplied: creditData?.total_applied || 0,
          availableCredits: creditData?.total_credits || 0,
        });

        setIsDemo(false);
      } catch (err) {
        // Supabase unavailable — graceful demo fallback
        console.warn('Referral: falling back to demo mode', err);
        const demo = useDemoFallback();
        setReferralCode(demo.referralCode);
        setCredits(demo.credits);
        setStats(demo.stats);
        setIsDemo(true);
      }

      setLoading(false);
    };

    init();
  }, [user]);

  // Process referral (when new user signs up with code)
  const processReferral = useCallback(async (code: string, newUserId: string) => {
    if (isDemo) return null;
    try {
      const { data: codeData } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (!codeData) throw new Error('Invalid referral code');

      const { data: referral, error } = await supabase
        .from('referrals')
        .insert({
          referrer_user_id: codeData.user_id,
          referred_user_id: newUserId,
          referral_code: code,
          credit_amount: 1400,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return referral;
    } catch (err) {
      console.error('Error processing referral:', err);
      return null;
    }
  }, [isDemo]);

  // Approve referral (admin action)
  const approveReferral = useCallback(async (referralId: string) => {
    if (isDemo) return null;
    try {
      const { data: referral, error } = await supabase
        .from('referrals')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', referralId)
        .select()
        .single();

      if (error) throw error;

      // Add credits
      await supabase.rpc('add_user_credits', {
        p_user_id: referral.referrer_user_id,
        p_amount: referral.credit_amount,
      });

      // Log transaction
      await supabase.from('credit_transactions').insert({
        user_id: referral.referrer_user_id,
        type: 'earned',
        amount: referral.credit_amount,
        description: 'Referral bonus',
        referral_id: referralId,
      });

      return referral;
    } catch (err) {
      console.error('Error approving referral:', err);
      return null;
    }
  }, [isDemo]);

  // Apply credits to subscription
  const applyCredits = useCallback(async (amount: number, subscriptionId: string) => {
    if (isDemo || !user) return false;
    try {
      await supabase.rpc('apply_user_credits', { p_user_id: user.id, p_amount: amount });
      await supabase.from('credit_transactions').insert({
        user_id: user.id,
        type: 'applied',
        amount: -amount,
        description: 'Applied to subscription',
        subscription_id: subscriptionId,
      });
      return true;
    } catch (err) {
      console.error('Error applying credits:', err);
      return false;
    }
  }, [isDemo, user]);

  const getShareUrl = useCallback(() => {
    if (!referralCode) return null;
    return `${window.location.origin}/ref/${referralCode.code}`;
  }, [referralCode]);

  const getShareText = useCallback(() => {
    return `Pridaj sa k NeoMe - holistická wellness aplikácia pre ženy! 🌟 Použi môj kód ${referralCode?.code} a dostaneme obe zľavu. ${getShareUrl()}`;
  }, [referralCode, getShareUrl]);

  return {
    loading,
    isDemo,
    referralCode,
    credits,
    stats,
    initializeReferralCode: () => {},
    processReferral,
    approveReferral,
    applyCredits,
    getShareUrl,
    getShareText,
    loadCredits: () => {},
    loadStats: () => {},
  };
}
