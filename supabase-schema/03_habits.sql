-- Habits table
CREATE TABLE public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 21,
  unit TEXT NOT NULL DEFAULT 'krát',
  target_per_day INTEGER NOT NULL DEFAULT 1,
  start_date DATE DEFAULT CURRENT_DATE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit completions table (daily tracking)
CREATE TABLE public.habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  completion_date DATE NOT NULL,
  count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(habit_id, completion_date) -- One record per habit per day
);

-- User preferences/settings table
CREATE TABLE public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  onboarding_data JSONB DEFAULT '{}',
  nutrition_goals JSONB DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  dietary_preferences TEXT[] DEFAULT '{}',
  cycle_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id) -- One preferences record per user
);

-- Content usage tracking (for free tier limits)
CREATE TABLE public.content_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL, -- 'recipes', 'exercises', 'meditations', 'stretches'
  content_id TEXT NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, content_type, content_id) -- Track unique access per user per content
);

-- Enable RLS
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_usage ENABLE ROW LEVEL SECURITY;

-- Habits policies
CREATE POLICY "Users can manage own habits" ON public.habits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own habit completions" ON public.habit_completions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own content usage" ON public.content_usage
  FOR ALL USING (auth.uid() = user_id);

-- Function to create default user preferences
CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create preferences on profile creation
CREATE TRIGGER on_profile_created_preferences
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_preferences();