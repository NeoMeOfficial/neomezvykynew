-- Subscription tiers enum
CREATE TYPE subscription_tier AS ENUM ('free', 'neome_plus', 'program_bundle');

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tier subscription_tier DEFAULT 'free' NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id) -- One subscription per user
);

-- Meal planner tokens table
CREATE TABLE public.meal_planner_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tokens_remaining INTEGER DEFAULT 0 NOT NULL,
  tokens_purchased INTEGER DEFAULT 0 NOT NULL,
  last_purchase_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id) -- One token record per user
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_planner_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for meal planner tokens
CREATE POLICY "Users can view own tokens" ON public.meal_planner_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON public.meal_planner_tokens
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to create default subscription and tokens on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default free subscription
  INSERT INTO public.subscriptions (user_id, tier)
  VALUES (NEW.id, 'free');
  
  -- Create default meal planner tokens (0 tokens)
  INSERT INTO public.meal_planner_tokens (user_id, tokens_remaining)
  VALUES (NEW.id, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create subscription on profile creation
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();