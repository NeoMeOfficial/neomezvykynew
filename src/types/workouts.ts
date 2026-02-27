export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string | number;
  workoutTitle: string;
  workoutType: string; // 'telo', 'strava', 'mysel'
  program?: string; // 'Postpartum', 'BodyForming', etc.
  duration: number; // in minutes
  completedAt: string; // ISO timestamp
  metadata?: {
    exerciseCount?: number;
    difficulty?: string;
    instructor?: string;
    notes?: string;
  };
}

export interface WorkoutStreak {
  current: number;
  longest: number;
  lastWorkoutDate: string | null;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  averageWorkoutsPerWeek: number;
  favoriteWorkoutType: string;
  currentStreak: number;
  longestStreak: number;
  thisWeek: number;
  thisMonth: number;
  workoutsByType: Record<string, number>;
  workoutsByProgram: Record<string, number>;
  recentSessions: WorkoutSession[];
}

export interface WorkoutCalendarDay {
  date: string;
  workouts: WorkoutSession[];
  isToday: boolean;
  isCurrentMonth: boolean;
}