-- NeoMe Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user profiles table
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'trial')),
    subscription_id TEXT,
    trial_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create user progress table
CREATE TABLE user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    program_id TEXT,
    current_week INTEGER DEFAULT 1,
    current_day INTEGER DEFAULT 1,
    completed_exercises TEXT[] DEFAULT '{}',
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user habits table
CREATE TABLE user_habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    habit_type TEXT NOT NULL CHECK (habit_type IN ('water', 'exercise', 'meditation', 'custom')),
    habit_name TEXT NOT NULL,
    target_count INTEGER DEFAULT 1,
    current_count INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, habit_type, date)
);

-- Create period tracking table
CREATE TABLE period_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    cycle_start_date DATE NOT NULL,
    cycle_length INTEGER DEFAULT 28,
    period_length INTEGER DEFAULT 5,
    symptoms TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user favorites table
CREATE TABLE user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('recipe', 'exercise', 'meditation', 'program')),
    item_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- Create community posts table
CREATE TABLE community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create buddy connections table
CREATE TABLE buddy_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    buddy_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    buddy_code TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, buddy_id)
);

-- Create community post likes table
CREATE TABLE community_post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Row Level Security Policies

-- User profiles: users can only see/edit their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User progress: users can only see/edit their own progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

-- User habits: users can only see/edit their own habits
ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own habits" ON user_habits
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own habits" ON user_habits
    FOR ALL USING (auth.uid() = user_id);

-- Period tracking: users can only see/edit their own data
ALTER TABLE period_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own period data" ON period_tracking
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own period data" ON period_tracking
    FOR ALL USING (auth.uid() = user_id);

-- User favorites: users can only see/edit their own favorites
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON user_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Community posts: everyone can read, users can manage their own
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view community posts" ON community_posts
    FOR SELECT USING (true);
CREATE POLICY "Users can manage own posts" ON community_posts
    FOR ALL USING (auth.uid() = user_id);

-- Community post likes: everyone can read, users can manage their own
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view post likes" ON community_post_likes
    FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON community_post_likes
    FOR ALL USING (auth.uid() = user_id);

-- Buddy connections: users can see connections involving them
ALTER TABLE buddy_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own buddy connections" ON buddy_connections
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = buddy_id);
CREATE POLICY "Users can manage own buddy connections" ON buddy_connections
    FOR ALL USING (auth.uid() = user_id);

-- Functions

-- Function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, first_name, last_name)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update post likes count
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update likes count automatically
CREATE TRIGGER on_post_like_change
    AFTER INSERT OR DELETE ON community_post_likes
    FOR EACH ROW EXECUTE PROCEDURE public.update_post_likes_count();