-- Function to get user subscription with limits
CREATE OR REPLACE FUNCTION public.get_user_subscription_limits(user_uuid UUID)
RETURNS TABLE (
  tier subscription_tier,
  active BOOLEAN,
  max_recipes INTEGER,
  max_exercises INTEGER,
  max_meditations INTEGER,
  max_stretches INTEGER,
  can_save_data BOOLEAN,
  has_programs BOOLEAN,
  has_meal_planner BOOLEAN,
  meal_planner_tokens INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.tier,
    s.active,
    CASE s.tier
      WHEN 'free' THEN 10
      ELSE -1 -- unlimited
    END as max_recipes,
    CASE s.tier
      WHEN 'free' THEN 10
      ELSE -1 -- unlimited
    END as max_exercises,
    CASE s.tier
      WHEN 'free' THEN 10
      ELSE -1 -- unlimited
    END as max_meditations,
    CASE s.tier
      WHEN 'free' THEN 10
      ELSE -1 -- unlimited
    END as max_stretches,
    CASE s.tier
      WHEN 'free' THEN FALSE
      ELSE TRUE
    END as can_save_data,
    CASE s.tier
      WHEN 'free' THEN FALSE
      ELSE TRUE
    END as has_programs,
    CASE s.tier
      WHEN 'program_bundle' THEN TRUE
      ELSE (COALESCE(mpt.tokens_remaining, 0) > 0)
    END as has_meal_planner,
    COALESCE(mpt.tokens_remaining, 0) as meal_planner_tokens
  FROM public.subscriptions s
  LEFT JOIN public.meal_planner_tokens mpt ON mpt.user_id = s.user_id
  WHERE s.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check content access for free users
CREATE OR REPLACE FUNCTION public.check_content_access(
  user_uuid UUID,
  content_type_param TEXT
)
RETURNS TABLE (
  can_access BOOLEAN,
  used_count INTEGER,
  limit_count INTEGER
) AS $$
DECLARE
  user_tier subscription_tier;
  content_limit INTEGER;
  used_content INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT tier INTO user_tier
  FROM public.subscriptions
  WHERE user_id = user_uuid;
  
  -- If not free tier, unlimited access
  IF user_tier != 'free' THEN
    RETURN QUERY SELECT TRUE, 0, -1;
    RETURN;
  END IF;
  
  -- Get content limit for free tier
  content_limit := 10;
  
  -- Count used content
  SELECT COUNT(*)::INTEGER INTO used_content
  FROM public.content_usage
  WHERE user_id = user_uuid AND content_type = content_type_param;
  
  RETURN QUERY SELECT 
    (used_content < content_limit) as can_access,
    used_content,
    content_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track content usage
CREATE OR REPLACE FUNCTION public.track_content_usage(
  user_uuid UUID,
  content_type_param TEXT,
  content_id_param TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO public.content_usage (user_id, content_type, content_id)
  VALUES (user_uuid, content_type_param, content_id_param)
  ON CONFLICT (user_id, content_type, content_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get habit streak
CREATE OR REPLACE FUNCTION public.get_habit_streak(
  habit_uuid UUID,
  target_per_day_param INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  current_date_check DATE := CURRENT_DATE;
  completion_count INTEGER;
BEGIN
  -- Check consecutive days backwards from today
  LOOP
    SELECT COALESCE(count, 0) INTO completion_count
    FROM public.habit_completions
    WHERE habit_id = habit_uuid AND completion_date = current_date_check;
    
    -- If this day meets the target, increment streak
    IF completion_count >= target_per_day_param THEN
      streak_count := streak_count + 1;
      current_date_check := current_date_check - INTERVAL '1 day';
    ELSE
      -- Streak broken, but check if today hasn't been done yet
      IF current_date_check = CURRENT_DATE AND streak_count = 0 THEN
        current_date_check := current_date_check - INTERVAL '1 day';
        CONTINUE;
      END IF;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;