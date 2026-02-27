-- =============================================
-- NeoMe Referral System Database Setup
-- =============================================

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_credits INTEGER NOT NULL DEFAULT 0, -- in cents (1400 = €14.00)
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_applied INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create referral_codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(8) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code VARCHAR(8) NOT NULL,
  credit_amount INTEGER NOT NULL DEFAULT 1400, -- €14.00 in cents
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(referred_user_id) -- Each user can only be referred once
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'applied', 'expired')),
  amount INTEGER NOT NULL, -- positive for earned, negative for applied
  description TEXT NOT NULL,
  referral_id UUID REFERENCES referrals(id),
  subscription_id TEXT, -- external subscription ID
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES for performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);

-- =============================================
-- RLS POLICIES for security
-- =============================================

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- User credits policies
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Referral codes policies
CREATE POLICY "Users can view own referral codes" ON referral_codes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own referral codes" ON referral_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view referrals they made or received" ON referrals
  FOR SELECT USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

CREATE POLICY "Anyone can insert referrals" ON referrals
  FOR INSERT WITH CHECK (true);

-- Credit transactions policies
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS for credit management
-- =============================================

-- Function to add credits to user
CREATE OR REPLACE FUNCTION add_user_credits(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_credits (user_id, total_credits, total_earned)
  VALUES (p_user_id, p_amount, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_credits = user_credits.total_credits + p_amount,
    total_earned = user_credits.total_earned + p_amount,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to apply credits (subtract from total)
CREATE OR REPLACE FUNCTION apply_user_credits(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE user_credits
  SET 
    total_credits = total_credits - p_amount,
    total_applied = total_applied + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id
    AND total_credits >= p_amount; -- Ensure sufficient credits
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient credits or user not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user referral stats
CREATE OR REPLACE FUNCTION get_user_referral_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_referrals', COALESCE(COUNT(*), 0),
    'approved_referrals', COALESCE(COUNT(*) FILTER (WHERE status = 'approved'), 0),
    'pending_referrals', COALESCE(COUNT(*) FILTER (WHERE status = 'pending'), 0),
    'total_credits_earned', COALESCE(
      (SELECT total_earned FROM user_credits WHERE user_id = p_user_id), 0
    ),
    'available_credits', COALESCE(
      (SELECT total_credits FROM user_credits WHERE user_id = p_user_id), 0
    )
  )
  INTO stats
  FROM referrals
  WHERE referrer_user_id = p_user_id;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS for automatic updates
-- =============================================

-- Update user_credits updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits_updated_at();

-- =============================================
-- ADMIN FUNCTIONS (for admin panel)
-- =============================================

-- Admin: Get all referrals with user info (requires admin role)
CREATE OR REPLACE FUNCTION admin_get_all_referrals()
RETURNS TABLE (
  referral_id UUID,
  referrer_email TEXT,
  referred_email TEXT,
  referral_code VARCHAR(8),
  credit_amount INTEGER,
  status VARCHAR(20),
  created_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Check if user has admin role (you'll need to implement role checking)
  -- IF NOT is_admin(auth.uid()) THEN
  --   RAISE EXCEPTION 'Admin access required';
  -- END IF;
  
  RETURN QUERY
  SELECT 
    r.id as referral_id,
    referrer.email as referrer_email,
    referred.email as referred_email,
    r.referral_code,
    r.credit_amount,
    r.status,
    r.created_at,
    r.approved_at
  FROM referrals r
  LEFT JOIN auth.users referrer ON r.referrer_user_id = referrer.id
  LEFT JOIN auth.users referred ON r.referred_user_id = referred.id
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SAMPLE DATA (for testing)
-- =============================================

-- This would be uncommented for development/testing
/*
-- Insert sample referral code
INSERT INTO referral_codes (user_id, code) 
VALUES (
  (SELECT id FROM auth.users LIMIT 1), 
  'SAMPLE01'
) ON CONFLICT DO NOTHING;
*/