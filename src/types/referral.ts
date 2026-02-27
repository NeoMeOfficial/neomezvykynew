export interface UserCredits {
  user_id: string;
  total_credits: number; // in EUR cents (e.g., 1400 = €14.00)
  total_earned: number;
  total_applied: number;
  created_at: string;
  updated_at: string;
}

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string; // Unique 8-character code
  created_at: string;
  is_active: boolean;
}

export interface Referral {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  referral_code: string;
  credit_amount: number; // in cents
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  created_at: string;
  approved_at?: string;
  notes?: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: 'earned' | 'applied' | 'expired';
  amount: number; // in cents
  description: string;
  referral_id?: string;
  subscription_id?: string;
  created_at: string;
}

export interface ReferralStats {
  totalReferrals: number;
  approvedReferrals: number;
  pendingReferrals: number;
  totalCreditsEarned: number;
  totalCreditsApplied: number;
  availableCredits: number;
}