import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

// Database table types
export type UserProfile = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  subscription_status: 'free' | 'premium' | 'trial'
  subscription_id?: string
  trial_end_date?: string
  created_at: string
  updated_at: string
}

export type UserProgress = {
  id: string
  user_id: string
  program_id?: string
  current_week: number
  current_day: number
  completed_exercises: string[]
  streak_days: number
  last_activity_date: string
  created_at: string
}

export type UserHabits = {
  id: string
  user_id: string
  habit_type: 'water' | 'exercise' | 'meditation' | 'custom'
  habit_name: string
  target_count: number
  current_count: number
  date: string
  completed: boolean
  created_at: string
}

export type PeriodTracking = {
  id: string
  user_id: string
  cycle_start_date: string
  cycle_length: number
  period_length: number
  symptoms: string[]
  notes?: string
  created_at: string
}

export type UserFavorites = {
  id: string
  user_id: string
  item_type: 'recipe' | 'exercise' | 'meditation' | 'program'
  item_id: string
  created_at: string
}

export type CommunityPosts = {
  id: string
  user_id: string
  content: string
  image_url?: string
  likes_count: number
  comments_count: number
  created_at: string
}

export type BuddyConnections = {
  id: string
  user_id: string
  buddy_id: string
  buddy_code: string
  status: 'pending' | 'active' | 'inactive'
  created_at: string
}