export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  badgeType: 'bronze' | 'silver' | 'gold' | 'diamond' | 'special';
  category: 'habits' | 'workouts' | 'community' | 'streaks' | 'content' | 'wellness';
  requirements: {
    type: string; // 'count', 'streak', 'points', 'specific'
    target: number;
    condition?: string;
  };
  points: number; // community points awarded
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  achievementId: string;
  userId: string;
  earnedAt: string;
  progress?: number; // current progress towards achievement
}

export interface CommunityActivity {
  id: string;
  userId: string;
  type: 'workout_complete' | 'habit_streak' | 'recipe_try' | 'reflection_write' | 'help_member' | 'post_success' | 'receive_heart' | 'meditation_complete';
  points: number;
  metadata?: any;
  timestamp: string;
}

export interface CommunityRank {
  rank: 'Nováčik' | 'Podporovateľka' | 'Motivátorka' | 'Inšpirátorka' | 'Komunitná Hviezda';
  minPoints: number;
  maxPoints: number;
  color: string;
  benefits: string[];
}