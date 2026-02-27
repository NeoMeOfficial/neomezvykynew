import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { AdminUser, AdminAnalytics, UserManagement, AdminNotification } from '../types/admin';

export function useAdmin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  // Check if current user has admin privileges
  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminUser(null);
      setLoading(false);
      return;
    }

    try {
      // For now, we'll use a simple email check
      // In production, you'd want a proper admin_users table
      const adminEmails = [
        'gabi@neome.com.au',
        'admin@neome.com.au',
        'sambot@gmail.com', // Your email for testing
        'admin@test.com', // Test admin account
        'samuelgrecner@gmail.com' // Sam's personal admin access
      ];

      const userIsAdmin = adminEmails.includes(user.email || '');
      setIsAdmin(userIsAdmin);

      if (userIsAdmin) {
        // Create admin user object
        const adminUserData: AdminUser = {
          id: user.id,
          email: user.email || '',
          role: user.email === 'gabi@neome.com.au' ? 'admin' : 'admin',
          permissions: [
            {
              resource: 'users',
              actions: ['read', 'create', 'update', 'delete']
            },
            {
              resource: 'referrals', 
              actions: ['read', 'create', 'update', 'delete']
            },
            {
              resource: 'content',
              actions: ['read', 'create', 'update', 'delete']
            },
            {
              resource: 'analytics',
              actions: ['read']
            }
          ],
          created_at: user.created_at || new Date().toISOString(),
          is_active: true
        };
        setAdminUser(adminUserData);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Load admin analytics
  const loadAnalytics = async () => {
    if (!isAdmin) return;

    try {
      // Fetch user statistics
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*');

      if (usersError) throw usersError;

      // Fetch referral statistics  
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('*');

      if (referralsError && referralsError.code !== 'PGRST116') {
        console.warn('Referrals table may not exist yet:', referralsError);
      }

      // Calculate analytics (mock data for now)
      const analyticsData: AdminAnalytics = {
        users: {
          total: users?.length || 0,
          active_subscriptions: Math.floor((users?.length || 0) * 0.6),
          trial_users: Math.floor((users?.length || 0) * 0.2),  
          churned_users: Math.floor((users?.length || 0) * 0.1),
          new_this_month: Math.floor((users?.length || 0) * 0.15)
        },
        referrals: {
          total_referrals: referrals?.length || 0,
          approved_referrals: referrals?.filter(r => r.status === 'approved').length || 0,
          pending_referrals: referrals?.filter(r => r.status === 'pending').length || 0,
          credits_distributed: (referrals?.filter(r => r.status === 'approved').length || 0) * 1400,
          conversion_rate: 0.25
        },
        content: {
          total_programs: 4, // Hardcoded for now
          published_programs: 4,
          total_recipes: 108,
          published_recipes: 108,
          avg_engagement: 0.78
        },
        revenue: {
          mrr: ((users?.length || 0) * 0.6) * 14.90, // Estimated MRR
          churn_rate: 0.05,
          ltv: 179.00, // Estimated LTV
          credits_applied: 0
        }
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  // Get all users for management
  const getUsers = async (): Promise<UserManagement[]> => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_credits(total_credits)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return profiles?.map(profile => ({
        id: profile.id,
        email: profile.email || 'N/A',
        full_name: profile.full_name,
        subscription_status: 'active', // Would come from subscription system
        created_at: profile.created_at,
        last_active: profile.last_sign_in_at,
        total_credits: profile.user_credits?.[0]?.total_credits || 0,
        referral_count: 0, // Would calculate from referrals table
        is_suspended: false
      })) || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Update user status
  const updateUserStatus = async (userId: string, updates: Partial<UserManagement>) => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Approve referral
  const approveReferral = async (referralId: string) => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      // This would use the approve_referral function from the database
      const { error } = await supabase.rpc('approve_referral', {
        referral_id: referralId
      });

      if (error) throw error;
      
      // Reload analytics after approval
      await loadAnalytics();
      return true;
    } catch (error) {
      console.error('Error approving referral:', error);
      throw error;
    }
  };

  // Load admin notifications
  const loadNotifications = async () => {
    if (!isAdmin) return;

    // Mock notifications for now
    const mockNotifications: AdminNotification[] = [
      {
        id: '1',
        type: 'info',
        title: 'Nový užívateľ',
        message: '5 nových registrácií za posledný týždeň',
        created_at: new Date().toISOString(),
        read: false,
        action_required: false
      },
      {
        id: '2', 
        type: 'warning',
        title: 'Čakajúce odporúčania',
        message: '3 odporúčania čakajú na schválenie',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        read: false,
        action_required: true,
        related_resource: 'referrals'
      }
    ];

    setNotifications(mockNotifications);
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadAnalytics();
      loadNotifications();
    }
  }, [isAdmin]);

  return {
    loading,
    isAdmin,
    adminUser,
    analytics,
    notifications,
    getUsers,
    updateUserStatus,
    approveReferral,
    loadAnalytics,
    loadNotifications
  };
}