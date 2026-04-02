import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Achievement, UserAchievement, CommunityActivity } from '../types/achievements';
import { ACHIEVEMENTS, COMMUNITY_RANKS, ACTIVITY_POINTS } from '../data/achievements';

export function useAchievements() {
  const { user } = useAuthContext();
  
  // Add demo mode logging
  console.log('🎯 Achievements: User check', { userId: user?.id, hasUser: !!user });
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [communityPoints, setCommunityPoints] = useState(0);
  const [communityRank, setCommunityRank] = useState(COMMUNITY_RANKS[0]);
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's achievements and points from localStorage
  useEffect(() => {
    if (!user?.id) {
      // Demo/guest mode - set demo data
      setUserAchievements([]);
      setCommunityPoints(125); // Demo points
      setCommunityRank(COMMUNITY_RANKS[1]); // Demo rank
      setActivities([]);
      return;
    }

    const achievementsKey = `neome_achievements_${user.id}`;
    const pointsKey = `neome_points_${user.id}`;
    const activitiesKey = `neome_activities_${user.id}`;

    const storedAchievements = localStorage.getItem(achievementsKey);
    const storedPoints = localStorage.getItem(pointsKey);
    const storedActivities = localStorage.getItem(activitiesKey);

    if (storedAchievements) {
      try {
        setUserAchievements(JSON.parse(storedAchievements));
      } catch (e) {
        console.error('Failed to parse achievements', e);
      }
    }

    if (storedPoints) {
      const points = parseInt(storedPoints);
      setCommunityPoints(points);
      
      // Determine rank based on points
      const rank = COMMUNITY_RANKS.find(r => 
        points >= r.minPoints && points <= r.maxPoints
      ) || COMMUNITY_RANKS[0];
      setCommunityRank(rank);
    }

    if (storedActivities) {
      try {
        setActivities(JSON.parse(storedActivities));
      } catch (e) {
        console.error('Failed to parse activities', e);
      }
    }
  }, [user?.id]);

  // Save data to localStorage
  const saveToStorage = useCallback((achievements: UserAchievement[], points: number, newActivities: CommunityActivity[]) => {
    if (!user?.id) return;

    const achievementsKey = `neome_achievements_${user.id}`;
    const pointsKey = `neome_points_${user.id}`;
    const activitiesKey = `neome_activities_${user.id}`;

    localStorage.setItem(achievementsKey, JSON.stringify(achievements));
    localStorage.setItem(pointsKey, points.toString());
    localStorage.setItem(activitiesKey, JSON.stringify(newActivities));
  }, [user?.id]);

  // Add community activity and award points
  const addActivity = useCallback(async (
    type: keyof typeof ACTIVITY_POINTS,
    metadata?: any
  ) => {
    if (isLoading) return;
    if (!user?.id) {
      // Demo mode - just update local state without persistence
      const points = ACTIVITY_POINTS[type] || 0;
      const newPoints = communityPoints + points;
      setCommunityPoints(newPoints);
      const newRank = COMMUNITY_RANKS.find(r => 
        newPoints >= r.minPoints && newPoints <= r.maxPoints
      ) || COMMUNITY_RANKS[0];
      setCommunityRank(newRank);
      return;
    }

    setIsLoading(true);

    const points = ACTIVITY_POINTS[type] || 0;
    const activity: CommunityActivity = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type,
      points,
      metadata,
      timestamp: new Date().toISOString()
    };

    const newActivities = [activity, ...activities];
    const newPoints = communityPoints + points;

    setActivities(newActivities);
    setCommunityPoints(newPoints);

    // Update rank if needed
    const newRank = COMMUNITY_RANKS.find(r => 
      newPoints >= r.minPoints && newPoints <= r.maxPoints
    ) || COMMUNITY_RANKS[0];
    setCommunityRank(newRank);

    // Check for new achievements
    await checkAchievements(newActivities, newPoints);

    saveToStorage(userAchievements, newPoints, newActivities);
    setIsLoading(false);
  }, [user?.id, isLoading, activities, communityPoints, userAchievements, saveToStorage]);

  // Check if user earned new achievements
  const checkAchievements = useCallback(async (
    currentActivities: CommunityActivity[],
    currentPoints: number
  ) => {
    if (!user?.id) return;

    const newAchievements: UserAchievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      // Skip if already earned
      if (userAchievements.some(ua => ua.achievementId === achievement.id)) {
        continue;
      }

      let earned = false;

      switch (achievement.requirements.type) {
        case 'count':
          if (achievement.requirements.condition) {
            const count = currentActivities.filter(a => 
              a.type === achievement.requirements.condition
            ).length;
            earned = count >= achievement.requirements.target;
          }
          break;

        case 'points':
          earned = currentPoints >= achievement.requirements.target;
          break;

        case 'streak':
          // TODO: Implement streak checking logic
          // For now, assume streaks are tracked elsewhere
          break;

        case 'specific':
          // TODO: Implement specific condition checking
          break;
      }

      if (earned) {
        const userAchievement: UserAchievement = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          achievementId: achievement.id,
          userId: user.id,
          earnedAt: new Date().toISOString()
        };
        newAchievements.push(userAchievement);

        // Award bonus points for achievement (except point-based achievements)
        if (achievement.requirements.type !== 'points' && achievement.points > 0) {
          currentPoints += achievement.points;
        }
      }
    }

    if (newAchievements.length > 0) {
      const updatedAchievements = [...userAchievements, ...newAchievements];
      setUserAchievements(updatedAchievements);
      
      if (currentPoints !== communityPoints) {
        setCommunityPoints(currentPoints);
        const newRank = COMMUNITY_RANKS.find(r => 
          currentPoints >= r.minPoints && currentPoints <= r.maxPoints
        ) || COMMUNITY_RANKS[0];
        setCommunityRank(newRank);
      }

      saveToStorage(updatedAchievements, currentPoints, currentActivities);

      // Return new achievements for notification
      return newAchievements.map(ua => 
        ACHIEVEMENTS.find(a => a.id === ua.achievementId)!
      );
    }

    return [];
  }, [user?.id, userAchievements, communityPoints, saveToStorage]);

  // Get earned achievements with full data
  const getEarnedAchievements = useCallback(() => {
    return userAchievements.map(ua => ({
      ...ua,
      achievement: ACHIEVEMENTS.find(a => a.id === ua.achievementId)!
    })).filter(ua => ua.achievement);
  }, [userAchievements]);

  // Get progress towards unearned achievements
  const getAchievementProgress = useCallback((achievementId: string) => {
    if (userAchievements.some(ua => ua.achievementId === achievementId)) {
      return 100; // Already earned
    }

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return 0;

    switch (achievement.requirements.type) {
      case 'count':
        if (achievement.requirements.condition) {
          const count = activities.filter(a => 
            a.type === achievement.requirements.condition
          ).length;
          return Math.min(100, (count / achievement.requirements.target) * 100);
        }
        break;

      case 'points':
        return Math.min(100, (communityPoints / achievement.requirements.target) * 100);

      default:
        return 0;
    }

    return 0;
  }, [userAchievements, activities, communityPoints]);

  return {
    // State
    userAchievements: getEarnedAchievements(),
    communityPoints,
    communityRank,
    activities,
    isLoading,

    // Actions  
    addActivity,
    checkAchievements,

    // Computed
    getAchievementProgress,
    
    // Stats
    stats: {
      totalAchievements: userAchievements.length,
      totalPoints: communityPoints,
      rank: communityRank.rank,
      rankColor: communityRank.color,
      nextRank: COMMUNITY_RANKS.find(r => r.minPoints > communityPoints),
      pointsToNextRank: COMMUNITY_RANKS.find(r => r.minPoints > communityPoints)?.minPoints ? 
        COMMUNITY_RANKS.find(r => r.minPoints > communityPoints)!.minPoints - communityPoints : 0
    }
  };
}