/**
 * useAchievements — achievement badge tracking + shield tier + rank display.
 *
 * Deliberately does NOT write to points_ledger (that is usePointsLedger's job).
 * This hook owns:
 *   - Achievement badge logic (localStorage, per-user key)
 *   - Workout-count shield tier (reads from profiles.workout_count)
 *   - Recent-activity flag (reads from profiles.last_activity_at)
 *   - Community rank derived from the points balance supplied by usePointsLedger
 *
 * Pages that complete an activity call BOTH hooks:
 *   addEntry(...)     ← usePointsLedger (writes points_ledger, updates balance)
 *   addActivity(...)  ← useAchievements (updates workout_count, checks badges)
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Achievement, UserAchievement, CommunityActivity } from '../types/achievements';
import {
  ACHIEVEMENTS, COMMUNITY_RANKS, ACTIVITY_POINTS,
  getShieldTier, ShieldTier,
} from '../data/achievements';
import { supabase } from '../lib/supabase';

export interface AchievementsStats {
  totalAchievements: number;
  totalPoints: number;
  rank: string;
  rankColor: string;
  nextRank: typeof COMMUNITY_RANKS[number] | undefined;
  pointsToNextRank: number;
  workoutCount: number;
  shieldTier: ShieldTier;
  isRecentlyActive: boolean; // last_activity_at within 14 days
}

export function useAchievements(externalPoints?: number) {
  const { user } = useAuthContext();

  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [lastActivityAt, setLastActivityAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Points balance: caller can inject from usePointsLedger; otherwise fall back to localStorage
  const [localPoints, setLocalPoints] = useState(0);
  const points = externalPoints ?? localPoints;

  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    if (!user?.id) {
      setWorkoutCount(3);
      setLocalPoints(125);
      return;
    }

    loadProfile(user.id);
    loadAchievements(user.id);

    // Seed localPoints from localStorage so the home-page counter matches
    const raw = localStorage.getItem(`neome_points_${user.id}`);
    if (raw) setLocalPoints(parseInt(raw, 10));
  }, [user?.id]);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('workout_count, last_activity_at')
      .eq('id', userId)
      .maybeSingle();
    if (data) {
      setWorkoutCount(data.workout_count ?? 0);
      setLastActivityAt(data.last_activity_at ?? null);
    }
  }

  function loadAchievements(userId: string) {
    const raw = localStorage.getItem(`neome_achievements_${userId}`);
    if (!raw) return;
    try { setUserAchievements(JSON.parse(raw)); } catch { /* ignore */ }
  }

  // ── addActivity ────────────────────────────────────────────────────────────
  // Call this alongside usePointsLedger.addEntry when an activity completes.
  // This hook updates workout_count, last_activity_at, and checks achievements.
  // It does NOT write to points_ledger.
  const addActivity = useCallback(async (
    type: string,
    metadata?: Record<string, unknown>,
  ) => {
    const now = new Date().toISOString();
    const userId = user?.id;
    const pts = ACTIVITY_POINTS[type] ?? 0;

    // Track activity locally for achievement progress
    const activity: CommunityActivity = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      userId: userId ?? 'demo',
      type,
      points: pts,
      metadata,
      timestamp: now,
    };
    setActivities(prev => [activity, ...prev]);
    setLastActivityAt(now);

    // Update workout count for shield tier
    const isWorkout = type === 'workout_complete' || type === 'program_complete';
    let newWorkoutCount = workoutCount;
    if (isWorkout) {
      newWorkoutCount = workoutCount + 1;
      setWorkoutCount(newWorkoutCount);
    }

    // Persist profile fields to Supabase (best-effort)
    if (userId) {
      supabase.from('profiles').update({
        last_activity_at: now,
        ...(isWorkout ? { workout_count: newWorkoutCount } : {}),
      }).eq('id', userId).then(({ error }) => {
        if (error) console.warn('useAchievements: profile update failed', error.message);
      });
    }

    // Check achievements against updated activity list + current points
    checkAndAward(type, points, userId);
  }, [user?.id, workoutCount, activities, points, userAchievements]);

  function checkAndAward(type: string, currentPoints: number, userId?: string) {
    const newlyEarned: UserAchievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (userAchievements.some(ua => ua.achievementId === achievement.id)) continue;

      let earned = false;
      switch (achievement.requirements.type) {
        case 'count':
          if (achievement.requirements.condition === type) {
            const count = activities.filter(a => a.type === type).length + 1;
            earned = count >= achievement.requirements.target;
          }
          break;
        case 'points':
          earned = currentPoints >= achievement.requirements.target;
          break;
      }

      if (earned) {
        newlyEarned.push({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          achievementId: achievement.id,
          userId: userId ?? 'demo',
          earnedAt: new Date().toISOString(),
        });
      }
    }

    if (newlyEarned.length > 0) {
      const updated = [...userAchievements, ...newlyEarned];
      setUserAchievements(updated);
      if (userId) {
        localStorage.setItem(`neome_achievements_${userId}`, JSON.stringify(updated));
      }
    }
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const rank = COMMUNITY_RANKS.find(
    r => points >= r.minPoints && points <= r.maxPoints
  ) ?? COMMUNITY_RANKS[0];

  const nextRank = COMMUNITY_RANKS.find(r => r.minPoints > points);
  const shieldTier = getShieldTier(workoutCount);
  const isRecentlyActive = lastActivityAt
    ? (Date.now() - new Date(lastActivityAt).getTime()) < 14 * 24 * 60 * 60 * 1000
    : false;

  const stats: AchievementsStats = {
    totalAchievements: userAchievements.length,
    totalPoints: points,
    rank: rank.rank,
    rankColor: rank.color,
    nextRank,
    pointsToNextRank: nextRank ? nextRank.minPoints - points : 0,
    workoutCount,
    shieldTier,
    isRecentlyActive,
  };

  return {
    userAchievements: userAchievements
      .map(ua => ({ ...ua, achievement: ACHIEVEMENTS.find(a => a.id === ua.achievementId)! }))
      .filter(ua => ua.achievement),
    communityPoints: points,
    communityRank: rank,
    activities,
    isLoading,
    addActivity,
    stats,
    getAchievementProgress: (achievementId: string) => {
      if (userAchievements.some(ua => ua.achievementId === achievementId)) return 100;
      const a = ACHIEVEMENTS.find(x => x.id === achievementId);
      if (!a) return 0;
      if (a.requirements.type === 'points')
        return Math.min(100, (points / a.requirements.target) * 100);
      if (a.requirements.type === 'count' && a.requirements.condition) {
        const count = activities.filter(x => x.type === a.requirements.condition).length;
        return Math.min(100, (count / a.requirements.target) * 100);
      }
      return 0;
    },
  };
}
