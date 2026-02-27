import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import type { Subscription, SubscriptionTier, SubscriptionLimits } from '../types/subscription';
import { SUBSCRIPTION_LIMITS } from '../types/subscription';

interface SupabaseSubscriptionData {
  tier: SubscriptionTier;
  active: boolean;
  max_recipes: number;
  max_exercises: number;
  max_meditations: number;
  max_stretches: number;
  can_save_data: boolean;
  has_programs: boolean;
  has_meal_planner: boolean;
  meal_planner_tokens: number;
}

export function useSupabaseSubscription() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription>({
    tier: 'free',
    active: true,
    mealPlannerTokens: 0,
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      // Use the database function to get subscription with limits
      const { data, error } = await supabase.rpc('get_user_subscription_limits', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching subscription:', error);
        // Fall back to free tier on error
        setSubscription({
          tier: 'free',
          active: true,
          mealPlannerTokens: 0,
        });
      } else if (data && data.length > 0) {
        const subData: SupabaseSubscriptionData = data[0];
        setSubscription({
          tier: subData.tier,
          active: subData.active,
          mealPlannerTokens: subData.meal_planner_tokens,
        });
      }
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
      // Fall back to free tier
      setSubscription({
        tier: 'free',
        active: true,
        mealPlannerTokens: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkContentAccess = async (contentType: 'recipes' | 'exercises' | 'meditations' | 'stretches'): Promise<{
    canAccess: boolean;
    usedCount: number;
    limitCount: number;
  }> => {
    if (!user || subscription.tier !== 'free') {
      return { canAccess: true, usedCount: 0, limitCount: -1 };
    }

    try {
      const { data, error } = await supabase.rpc('check_content_access', {
        user_uuid: user.id,
        content_type_param: contentType
      });

      if (error) {
        console.error('Error checking content access:', error);
        return { canAccess: false, usedCount: 0, limitCount: 10 };
      }

      if (data && data.length > 0) {
        const result = data[0];
        return {
          canAccess: result.can_access,
          usedCount: result.used_count,
          limitCount: result.limit_count,
        };
      }
    } catch (error) {
      console.error('Error in checkContentAccess:', error);
    }

    return { canAccess: false, usedCount: 0, limitCount: 10 };
  };

  const trackContentUsage = async (contentType: string, contentId: string): Promise<boolean> => {
    if (!user || subscription.tier !== 'free') {
      return true; // Don't track for premium users
    }

    try {
      const { error } = await supabase.rpc('track_content_usage', {
        user_uuid: user.id,
        content_type_param: contentType,
        content_id_param: contentId
      });

      if (error) {
        console.error('Error tracking content usage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in trackContentUsage:', error);
      return false;
    }
  };

  const refreshSubscription = () => {
    fetchSubscription();
  };

  return {
    subscription,
    loading,
    limits: SUBSCRIPTION_LIMITS[subscription.tier],
    checkContentAccess,
    trackContentUsage,
    refreshSubscription,
  };
}