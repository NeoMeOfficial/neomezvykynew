import { Achievement, CommunityRank } from '../types/achievements';

// ── Community ranks (lifetime accumulated points) ─────────────────────────────
export const COMMUNITY_RANKS: CommunityRank[] = [
  {
    rank: 'Nováčik',
    minPoints: 0,
    maxPoints: 199,
    color: '#8B7560',
    benefits: ['Základné funkcie'],
  },
  {
    rank: 'Zvedavá',
    minPoints: 200,
    maxPoints: 599,
    color: '#B8864A',
    benefits: ['Základné funkcie', 'Prioritná podpora'],
  },
  {
    rank: 'Odhodlaná',
    minPoints: 600,
    maxPoints: 1199,
    color: '#7A9E78',
    benefits: ['Základné funkcie', 'Prioritná podpora', 'Špeciálne odznaky'],
  },
  {
    rank: 'Vytrvalá',
    minPoints: 1200,
    maxPoints: 2499,
    color: '#A8848B',
    benefits: ['Základné funkcie', 'Prioritná podpora', 'Špeciálne odznaky', 'Exkluzívny obsah'],
  },
  {
    rank: 'Inšpirátorka',
    minPoints: 2500,
    maxPoints: 4999,
    color: '#C27A6E',
    benefits: ['Všetky výhody', 'Beta funkcie', 'Osobná konzultácia'],
  },
  {
    rank: 'Komunitná Hviezda',
    minPoints: 5000,
    maxPoints: 999999,
    color: '#B8864A',
    benefits: ['Všetky výhody', 'Beta funkcie', 'Osobná konzultácia', 'VIP prístup'],
  },
];

// ── Workout-count shield tiers (cumulative, never resets) ─────────────────────
// Separate from rank — displayed in Komunita next to username.
// 🔥 recent-activity indicator shown if last_activity_at within 14 days.
export const SHIELD_TIERS = [
  { slug: 'diamond', label: 'Diamantový štít', minWorkouts: 100, color: '#A8C4D4' },
  { slug: 'gold',    label: 'Zlatý štít',      minWorkouts: 50,  color: '#B8864A' },
  { slug: 'silver',  label: 'Strieborný štít', minWorkouts: 25,  color: '#9AA5B1' },
  { slug: 'bronze',  label: 'Bronzový štít',   minWorkouts: 10,  color: '#C27A6E' },
] as const;

export type ShieldTier = typeof SHIELD_TIERS[number]['slug'] | null;

export function getShieldTier(workoutCount: number): ShieldTier {
  for (const tier of SHIELD_TIERS) {
    if (workoutCount >= tier.minWorkouts) return tier.slug;
  }
  return null;
}

export function getShieldInfo(slug: ShieldTier) {
  if (!slug) return null;
  return SHIELD_TIERS.find(t => t.slug === slug) ?? null;
}

// ── Point values per activity (daily, capped at 40 pts/day total) ─────────────
export const ACTIVITY_POINTS: Record<string, number> = {
  // Daily activity (small)
  workout_complete:      10,  // standalone workout (not part of programme)
  meditation_complete:   8,
  reflection_write:      6,
  cycle_log:             4,
  habit_checkin:         3,   // per habit per day; max 3 habits counted → 9 pts cap
  mood_track:            2,
  water_goal_met:        2,

  // Programme milestones (one-time per programme, larger)
  program_day1:          15,
  program_week1:         80,
  program_week2:         80,
  program_week3:         80,
  program_complete:      160, // week 4 / programme finished

  // Weekly streak bonuses (awarded once per qualifying week)
  weekly_streak_7:       50,  // 7 consecutive active days
  weekly_streak_30:      150, // 30 consecutive active days
  program_perfect_week:  60,  // all scheduled workouts done in a programme week

  // Community
  first_post:            20,
  receive_10_hearts:     10,  // once per post
  help_member:           20,

  // Referrals
  referral_signup:       50,   // referred user created account
  referral_subscribed:   300,  // referred user converted to paid (max 3/year)

  // Onboarding (one-time)
  onboarding_complete:   30,
  cycle_setup:           20,
  first_habit:           15,
};

// Daily cap — prevents alarm-clock gaming
export const DAILY_POINTS_CAP = 40;

// ── Achievement badges ────────────────────────────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  // Habit
  {
    id: 'first_habit',
    name: 'Prvý krok',
    description: 'Založ si svoj prvý návyk',
    icon: '🌱',
    badgeType: 'bronze',
    category: 'habits',
    requirements: { type: 'count', target: 1 },
    points: 15,
    rarity: 'common',
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
    rarity: 'common',
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
    rarity: 'rare',
  },

  // Workouts
  {
    id: 'first_workout',
    name: 'Prvé cvičenie',
    description: 'Dokončiť prvé cvičenie',
    icon: '💪',
    badgeType: 'bronze',
    category: 'workouts',
    requirements: { type: 'count', target: 1, condition: 'workout_complete' },
    points: 15,
    rarity: 'common',
  },
  {
    id: 'workout_10',
    name: 'Bronzový štít',
    description: 'Dokončiť 10 cvičení',
    icon: '🛡️',
    badgeType: 'bronze',
    category: 'workouts',
    requirements: { type: 'count', target: 10, condition: 'workout_complete' },
    points: 50,
    rarity: 'common',
  },
  {
    id: 'workout_25',
    name: 'Strieborný štít',
    description: 'Dokončiť 25 cvičení',
    icon: '🛡️',
    badgeType: 'silver',
    category: 'workouts',
    requirements: { type: 'count', target: 25, condition: 'workout_complete' },
    points: 100,
    rarity: 'common',
  },
  {
    id: 'workout_50',
    name: 'Zlatý štít',
    description: 'Dokončiť 50 cvičení',
    icon: '🛡️',
    badgeType: 'gold',
    category: 'workouts',
    requirements: { type: 'count', target: 50, condition: 'workout_complete' },
    points: 200,
    rarity: 'rare',
  },
  {
    id: 'workout_100',
    name: 'Diamantový štít',
    description: 'Dokončiť 100 cvičení',
    icon: '💠',
    badgeType: 'diamond',
    category: 'workouts',
    requirements: { type: 'count', target: 100, condition: 'workout_complete' },
    points: 400,
    rarity: 'epic',
  },

  // Programme milestones
  {
    id: 'program_week1',
    name: 'Prvý týždeň za sebou',
    description: 'Dokončiť prvý týždeň programu',
    icon: '🏅',
    badgeType: 'bronze',
    category: 'workouts',
    requirements: { type: 'count', target: 1, condition: 'program_week1' },
    points: 0, // points awarded via ACTIVITY_POINTS directly
    rarity: 'common',
  },
  {
    id: 'program_complete',
    name: 'Programová šampiónka',
    description: 'Dokončiť celý program',
    icon: '🏆',
    badgeType: 'gold',
    category: 'workouts',
    requirements: { type: 'count', target: 1, condition: 'program_complete' },
    points: 0,
    rarity: 'rare',
  },
  {
    id: 'all_programs',
    name: 'Wellness bojovníčka',
    description: 'Dokončiť všetky 4 programy',
    icon: '🌟',
    badgeType: 'diamond',
    category: 'wellness',
    requirements: { type: 'specific', target: 4, condition: 'complete_all_programs' },
    points: 500,
    rarity: 'epic',
  },

  // Community
  {
    id: 'first_help',
    name: 'Pomocná ruka',
    description: 'Pomôž prvýkrát spolučlenke',
    icon: '🤝',
    badgeType: 'bronze',
    category: 'community',
    requirements: { type: 'count', target: 1, condition: 'help_member' },
    points: 25,
    rarity: 'common',
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
    rarity: 'common',
  },
  {
    id: 'community_champion',
    name: 'Šampiónka komunity',
    description: 'Dosiahni 1000+ komunitných bodov',
    icon: '👑',
    badgeType: 'diamond',
    category: 'community',
    requirements: { type: 'points', target: 1000 },
    points: 0,
    rarity: 'legendary',
  },

  // Content
  {
    id: 'recipe_explorer',
    name: 'Kuchárka',
    description: 'Vyskúšaj 20 receptov',
    icon: '👩‍🍳',
    badgeType: 'silver',
    category: 'content',
    requirements: { type: 'count', target: 20, condition: 'recipe_try' },
    points: 100,
    rarity: 'common',
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
    rarity: 'rare',
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
    rarity: 'common',
  },

  // Special
  {
    id: 'early_adopter',
    name: 'Priekopníčka',
    description: 'Jedna z prvých 100 používateliek',
    icon: '🚀',
    badgeType: 'special',
    category: 'wellness',
    requirements: { type: 'specific', target: 1, condition: 'early_member' },
    points: 100,
    rarity: 'legendary',
  },
];
