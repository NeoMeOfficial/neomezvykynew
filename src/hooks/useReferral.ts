import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { UserCredits, ReferralCode, Referral, CreditTransaction, ReferralStats } from '../types/referral';

export function useReferral() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);

  // Generate unique referral code
  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Initialize user's referral code
  const initializeReferralCode = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Check if user already has a referral code
      const { data: existingCode } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (existingCode) {
        setReferralCode(existingCode);
        return;
      }

      // Generate new code
      let newCode = generateReferralCode();
      let isUnique = false;
      
      // Ensure code is unique
      while (!isUnique) {
        const { data: existing } = await supabase
          .from('referral_codes')
          .select('code')
          .eq('code', newCode)
          .single();
        
        if (!existing) {
          isUnique = true;
        } else {
          newCode = generateReferralCode();
        }
      }

      // Create referral code
      const { data: createdCode, error } = await supabase
        .from('referral_codes')
        .insert({
          user_id: user.id,
          code: newCode,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      setReferralCode(createdCode);

      // Initialize user credits
      const { error: creditsError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: user.id,
          total_credits: 0,
          total_earned: 0,
          total_applied: 0
        });

      if (creditsError) console.warn('Credits initialization warning:', creditsError);

    } catch (error) {
      console.error('Error initializing referral code:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load user credits
  const loadCredits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCredits(data);
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  };

  // Load referral stats
  const loadStats = async () => {
    if (!user) return;

    try {
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_user_id', user.id);

      if (error) throw error;

      const stats: ReferralStats = {
        totalReferrals: referrals.length,
        approvedReferrals: referrals.filter(r => r.status === 'approved').length,
        pendingReferrals: referrals.filter(r => r.status === 'pending').length,
        totalCreditsEarned: credits?.total_earned || 0,
        totalCreditsApplied: credits?.total_applied || 0,
        availableCredits: credits?.total_credits || 0
      };

      setStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Process referral (when new user signs up with code)
  const processReferral = async (referralCode: string, newUserId: string) => {
    try {
      // Find referral code
      const { data: codeData, error: codeError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', referralCode)
        .eq('is_active', true)
        .single();

      if (codeError || !codeData) {
        throw new Error('Invalid referral code');
      }

      // Check if this user was already referred
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('*')
        .eq('referred_user_id', newUserId)
        .single();

      if (existingReferral) {
        throw new Error('User already referred');
      }

      // Create referral record
      const creditAmount = 1400; // €14.00 in cents
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_user_id: codeData.user_id,
          referred_user_id: newUserId,
          referral_code: referralCode,
          credit_amount: creditAmount,
          status: 'pending' // Will be approved after referred user subscribes
        })
        .select()
        .single();

      if (referralError) throw referralError;

      return referral;
    } catch (error) {
      console.error('Error processing referral:', error);
      throw error;
    }
  };

  // Approve referral (when referred user subscribes)
  const approveReferral = async (referralId: string) => {
    try {
      // Update referral status
      const { data: referral, error: updateError } = await supabase
        .from('referrals')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', referralId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Add credits to referrer
      const { error: creditsError } = await supabase
        .rpc('add_user_credits', {
          p_user_id: referral.referrer_user_id,
          p_amount: referral.credit_amount
        });

      if (creditsError) throw creditsError;

      // Create credit transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: referral.referrer_user_id,
          type: 'earned',
          amount: referral.credit_amount,
          description: 'Referral bonus',
          referral_id: referralId
        });

      return referral;
    } catch (error) {
      console.error('Error approving referral:', error);
      throw error;
    }
  };

  // Apply credits to subscription
  const applyCredits = async (amount: number, subscriptionId: string) => {
    if (!user || !credits) return;

    try {
      if (amount > credits.total_credits) {
        throw new Error('Insufficient credits');
      }

      // Deduct credits
      const { error: creditsError } = await supabase
        .rpc('apply_user_credits', {
          p_user_id: user.id,
          p_amount: amount
        });

      if (creditsError) throw creditsError;

      // Create transaction record
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          type: 'applied',
          amount: -amount,
          description: 'Applied to subscription',
          subscription_id: subscriptionId
        });

      // Reload credits
      await loadCredits();

      return true;
    } catch (error) {
      console.error('Error applying credits:', error);
      throw error;
    }
  };

  // Get share URL
  const getShareUrl = () => {
    if (!referralCode) return null;
    return `${window.location.origin}/ref/${referralCode.code}`;
  };

  // Get share text
  const getShareText = () => {
    return `Pridaj sa k NeoMe - holistická wellness aplikácia pre ženy! 🌟 Použi môj kód ${referralCode?.code} a dostaneme obe zľavu. ${getShareUrl()}`;
  };

  useEffect(() => {
    if (user) {
      initializeReferralCode();
      loadCredits();
    }
  }, [user]);

  useEffect(() => {
    if (user && credits) {
      loadStats();
    }
  }, [user, credits]);

  return {
    loading,
    referralCode,
    credits,
    stats,
    initializeReferralCode,
    processReferral,
    approveReferral,
    applyCredits,
    getShareUrl,
    getShareText,
    loadCredits,
    loadStats
  };
}