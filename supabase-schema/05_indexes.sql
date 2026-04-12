-- Performance indexes

-- Profiles indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_active ON public.subscriptions(active);

-- Meal planner tokens indexes
CREATE INDEX idx_meal_tokens_user_id ON public.meal_planner_tokens(user_id);

-- Habits indexes
CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habits_active ON public.habits(active);
CREATE INDEX idx_habits_start_date ON public.habits(start_date);

-- Habit completions indexes
CREATE INDEX idx_habit_completions_habit_id ON public.habit_completions(habit_id);
CREATE INDEX idx_habit_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX idx_habit_completions_date ON public.habit_completions(completion_date);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Content usage indexes
CREATE INDEX idx_content_usage_user_id ON public.content_usage(user_id);
CREATE INDEX idx_content_usage_type ON public.content_usage(content_type);
CREATE INDEX idx_content_usage_date ON public.content_usage(accessed_at);