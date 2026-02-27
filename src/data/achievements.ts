import { Achievement, CommunityRank } from '../types/achievements';

export const COMMUNITY_RANKS: CommunityRank[] = [
  {
    rank: 'Nováčik',
    minPoints: 0,
    maxPoints: 99,
    color: '#8B7560',
    benefits: ['Základné funkcie']
  },
  {
    rank: 'Podporovateľka', 
    minPoints: 100,
    maxPoints: 299,
    color: '#B8864A',
    benefits: ['Základné funkcie', 'Prioritná podpora']
  },
  {
    rank: 'Motivátorka',
    minPoints: 300,
    maxPoints: 599, 
    color: '#7A9E78',
    benefits: ['Základné funkcie', 'Prioritná podpora', 'Špeciálne odznaky']
  },
  {
    rank: 'Inšpirátorka',
    minPoints: 600,
    maxPoints: 999,
    color: '#A8848B',
    benefits: ['Základné funkcie', 'Prioritná podpora', 'Špeciálne odznaky', 'Exkluzívny obsah']
  },
  {
    rank: 'Komunitná Hviezda',
    minPoints: 1000,
    maxPoints: 9999,
    color: '#C27A6E', 
    benefits: ['Všetky výhody', 'Beta funkcie', 'Osobná konzultácia']
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  // Habit Achievements
  {
    id: 'first_habit',
    name: 'Prvý krok',
    description: 'Založ si svoj prvý návyk',
    icon: '🌱',
    badgeType: 'bronze',
    category: 'habits',
    requirements: { type: 'count', target: 1 },
    points: 10,
    rarity: 'common'
  },
  {
    id: 'habit_week',
    name: 'Týždeň úspechov',
    description: 'Udržuj návyk 7 dní v rade',
    icon: '🔥',
    badgeType: 'silver',
    category: 'streaks',
    requirements: { type: 'streak', target: 7, condition: 'habit' },
    points: 50,
    rarity: 'common'
  },
  {
    id: 'habit_month',
    name: 'Mesačná vytrvalosť', 
    description: 'Udržuj návyk 30 dní v rade',
    icon: '💎',
    badgeType: 'gold',
    category: 'streaks',
    requirements: { type: 'streak', target: 30, condition: 'habit' },
    points: 200,
    rarity: 'rare'
  },

  // Workout Achievements
  {
    id: 'first_workout',
    name: 'Prvé cvičenie',
    description: 'Dokončiť prvé cvičenie',
    icon: '🏋️‍♀️',
    badgeType: 'bronze',
    category: 'workouts',
    requirements: { type: 'count', target: 1, condition: 'workout_complete' },
    points: 15,
    rarity: 'common'
  },
  {
    id: 'workout_10',
    name: 'Gymnastka',
    description: 'Dokončiť 10 cvičení',
    icon: '💪',
    badgeType: 'silver',
    category: 'workouts',
    requirements: { type: 'count', target: 10, condition: 'workout_complete' },
    points: 100,
    rarity: 'common'
  },
  {
    id: 'workout_50',
    name: 'Fitness nadšenkyňa',
    description: 'Dokončiť 50 cvičení',
    icon: '🏆',
    badgeType: 'gold',
    category: 'workouts',
    requirements: { type: 'count', target: 50, condition: 'workout_complete' },
    points: 300,
    rarity: 'rare'
  },

  // Community Achievements
  {
    id: 'first_help',
    name: 'Pomocná ruka',
    description: 'Pomôž prvýkrát spolučlenke',
    icon: '🤝',
    badgeType: 'bronze',
    category: 'community',
    requirements: { type: 'count', target: 1, condition: 'help_member' },
    points: 25,
    rarity: 'common'
  },
  {
    id: 'hearts_100',
    name: 'Obľúbená',
    description: 'Získaj 100 srdiečok na príspevkoch',
    icon: '💕',
    badgeType: 'silver',
    category: 'community',
    requirements: { type: 'count', target: 100, condition: 'receive_heart' },
    points: 150,
    rarity: 'common'
  },
  {
    id: 'community_champion',
    name: 'Šampiónka komunity',
    description: 'Dosiahni 1000+ komunitných bodov',
    icon: '👑',
    badgeType: 'diamond',
    category: 'community',
    requirements: { type: 'points', target: 1000 },
    points: 0, // Special achievement
    rarity: 'legendary'
  },

  // Content Achievements
  {
    id: 'recipe_explorer',
    name: 'Kuchárka',
    description: 'Vyskúšaj 20 receptov',
    icon: '👩‍🍳',
    badgeType: 'silver',
    category: 'content',
    requirements: { type: 'count', target: 20, condition: 'recipe_try' },
    points: 100,
    rarity: 'common'
  },
  {
    id: 'meditation_zen',
    name: 'Zenová majsterka',
    description: 'Dokončiť 30 meditácií',
    icon: '🧘‍♀️',
    badgeType: 'gold',
    category: 'content',
    requirements: { type: 'count', target: 30, condition: 'meditation_complete' },
    points: 200,
    rarity: 'rare'
  },
  {
    id: 'reflection_writer',
    name: 'Reflexívna duša',
    description: 'Napíš 50 denných reflexií',
    icon: '📝',
    badgeType: 'silver', 
    category: 'content',
    requirements: { type: 'count', target: 50, condition: 'reflection_write' },
    points: 150,
    rarity: 'common'
  },

  // Special Achievements
  {
    id: 'wellness_warrior',
    name: 'Wellness bojovníčka',
    description: 'Dokončiť všetky 4 programy',
    icon: '🌟',
    badgeType: 'diamond',
    category: 'wellness',
    requirements: { type: 'specific', target: 4, condition: 'complete_all_programs' },
    points: 500,
    rarity: 'epic'
  },
  {
    id: 'early_adopter',
    name: 'Priekopníčka',
    description: 'Jedna z prvých 100 používateliek',
    icon: '🚀',
    badgeType: 'special',
    category: 'wellness',
    requirements: { type: 'specific', target: 1, condition: 'early_member' },
    points: 100,
    rarity: 'legendary'
  }
];

// Point values for different activities
export const ACTIVITY_POINTS = {
  workout_complete: 15,
  habit_streak: 5, // per day in streak
  recipe_try: 10,
  reflection_write: 8,
  meditation_complete: 12,
  help_member: 25,
  post_success: 10,
  receive_heart: 3,
  weekly_checkin: 30,
  water_goal_met: 5,
  mood_track: 3
};