export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'moderator' | 'support';
  permissions: AdminPermission[];
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface AdminPermission {
  resource: string; // 'users', 'referrals', 'content', 'analytics', 'settings'
  actions: string[]; // 'read', 'create', 'update', 'delete'
}

export interface UserManagement {
  id: string;
  email: string;
  full_name?: string;
  subscription_status: 'active' | 'cancelled' | 'trial' | 'expired';
  subscription_plan?: string;
  created_at: string;
  last_active?: string;
  total_credits: number;
  referral_count: number;
  is_suspended: boolean;
}

export interface ContentManagement {
  programs: ProgramContent[];
  recipes: RecipeContent[];  
  blog_posts: BlogContent[];
}

export interface ProgramContent {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  exercises_count: number;
  enrolled_users: number;
}

export interface RecipeContent {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  allergens: string[];
  prep_time: number;
  favorites_count: number;
}

export interface BlogContent {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  created_at: string;
  published_at?: string;
  views: number;
}

export interface AdminAnalytics {
  users: {
    total: number;
    active_subscriptions: number;
    trial_users: number;
    churned_users: number;
    new_this_month: number;
  };
  referrals: {
    total_referrals: number;
    approved_referrals: number;
    pending_referrals: number;
    credits_distributed: number;
    conversion_rate: number;
  };
  content: {
    total_programs: number;
    published_programs: number;
    total_recipes: number;
    published_recipes: number;
    avg_engagement: number;
  };
  revenue: {
    mrr: number; // Monthly Recurring Revenue
    churn_rate: number;
    ltv: number; // Lifetime Value
    credits_applied: number;
  };
}

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  action_required: boolean;
  related_resource?: string;
  related_id?: string;
}