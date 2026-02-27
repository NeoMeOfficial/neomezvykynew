export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number; // in EUR
  price_yearly?: number; // in EUR
  currency: 'EUR';
  features: string[];
  popular?: boolean;
  trial_days?: number;
}

export type SubscriptionTier = 'free' | 'monthly' | 'yearly';

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  cancelled_at?: string;
}

export interface SubscriptionFeature {
  id: string;
  category: 'programs' | 'nutrition' | 'wellness' | 'community' | 'tracking';
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  included_in: string[]; // plan IDs
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  verified: boolean;
  program?: string; // which program they used
  image_url?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'pricing' | 'features' | 'support' | 'technical';
  order: number;
}

export interface OnboardingStep {
  id: string;
  step: number;
  title: string;
  description: string;
  component: 'welcome' | 'goals' | 'preferences' | 'payment' | 'confirmation';
  optional?: boolean;
}

export interface UserOnboarding {
  current_step: number;
  completed_steps: string[];
  goals: string[];
  preferences: {
    fitness_level?: 'beginner' | 'intermediate' | 'advanced';
    primary_goal?: 'weight_loss' | 'muscle_gain' | 'general_fitness' | 'postpartum_recovery';
    time_availability?: '15-30min' | '30-45min' | '45-60min' | '60min+';
    preferred_workout_types?: string[];
  };
  created_at: string;
  completed_at?: string;
}

export interface SubscriptionLimits {
  programs_access: boolean;
  meal_plans_access: boolean;
  community_access: boolean;
  period_tracking: boolean;
  max_recipes: number;
  priority_support: boolean;
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    programs_access: false,
    meal_plans_access: false,
    community_access: false,
    period_tracking: true,
    max_recipes: 10,
    priority_support: false
  },
  monthly: {
    programs_access: true,
    meal_plans_access: true,
    community_access: true,
    period_tracking: true,
    max_recipes: -1, // unlimited
    priority_support: false
  },
  yearly: {
    programs_access: true,
    meal_plans_access: true,
    community_access: true,
    period_tracking: true,
    max_recipes: -1, // unlimited
    priority_support: true
  }
};