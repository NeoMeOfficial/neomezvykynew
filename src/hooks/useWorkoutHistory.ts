import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useAchievements } from './useAchievements';
import { WorkoutSession, WorkoutStreak, WorkoutStats, WorkoutCalendarDay } from '../types/workouts';

export function useWorkoutHistory() {
  const { user } = useAuthContext();
  const { addActivity } = useAchievements();
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [streak, setStreak] = useState<WorkoutStreak>({
    current: 0,
    longest: 0,
    lastWorkoutDate: null
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load workout history from localStorage
  useEffect(() => {
    if (!user?.id) {
      console.log('🎯 WorkoutHistory: No user ID, skipping load');
      return;
    }

    const historyKey = `neome_workout_history_${user.id}`;
    const streakKey = `neome_workout_streak_${user.id}`;

    const storedHistory = localStorage.getItem(historyKey);
    const storedStreak = localStorage.getItem(streakKey);

    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory);
        setWorkoutHistory(history);
      } catch (e) {
        console.error('Failed to parse workout history', e);
      }
    }

    if (storedStreak) {
      try {
        const streakData = JSON.parse(storedStreak);
        setStreak(streakData);
      } catch (e) {
        console.error('Failed to parse workout streak', e);
      }
    }
  }, [user?.id]);

  // Save data to localStorage
  const saveToStorage = useCallback((history: WorkoutSession[], streakData: WorkoutStreak) => {
    if (!user?.id) return;

    const historyKey = `neome_workout_history_${user.id}`;
    const streakKey = `neome_workout_streak_${user.id}`;

    localStorage.setItem(historyKey, JSON.stringify(history));
    localStorage.setItem(streakKey, JSON.stringify(streakData));
  }, [user?.id]);

  // Complete a workout
  const completeWorkout = useCallback(async (
    workoutId: string | number,
    workoutTitle: string,
    workoutType: string,
    duration: number,
    program?: string,
    metadata?: any
  ) => {
    if (!user?.id || isLoading) return;

    setIsLoading(true);

    const session: WorkoutSession = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      workoutId,
      workoutTitle,
      workoutType,
      program,
      duration,
      completedAt: new Date().toISOString(),
      metadata
    };

    const newHistory = [session, ...workoutHistory];
    
    // Update streak calculation
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let newStreak = { ...streak };
    
    // Check if user worked out today already
    const workedOutToday = workoutHistory.some(w => 
      w.completedAt.split('T')[0] === today
    );

    if (!workedOutToday) {
      // This is the first workout today
      if (streak.lastWorkoutDate === yesterday) {
        // Continue streak
        newStreak.current += 1;
        newStreak.longest = Math.max(newStreak.longest, newStreak.current);
      } else if (streak.lastWorkoutDate === today) {
        // Already worked out today, don't change streak
      } else {
        // Start new streak
        newStreak.current = 1;
        newStreak.longest = Math.max(newStreak.longest, 1);
      }
      newStreak.lastWorkoutDate = today;
    }

    setWorkoutHistory(newHistory);
    setStreak(newStreak);
    saveToStorage(newHistory, newStreak);

    // Award achievement points
    await addActivity('workout_complete', {
      workoutId,
      workoutTitle,
      workoutType,
      program,
      duration,
      streak: newStreak.current
    });

    setIsLoading(false);
    return session;
  }, [user?.id, isLoading, workoutHistory, streak, saveToStorage, addActivity]);

  // Get workout stats
  const getWorkoutStats = useCallback((): WorkoutStats => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeek = workoutHistory.filter(w => 
      new Date(w.completedAt) >= oneWeekAgo
    ).length;
    
    const thisMonth = workoutHistory.filter(w => 
      new Date(w.completedAt) >= oneMonthAgo
    ).length;

    const totalMinutes = workoutHistory.reduce((sum, w) => sum + w.duration, 0);
    
    // Calculate average workouts per week (over last 4 weeks)
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    const last4WeeksWorkouts = workoutHistory.filter(w => 
      new Date(w.completedAt) >= fourWeeksAgo
    ).length;
    const averageWorkoutsPerWeek = last4WeeksWorkouts / 4;

    // Group by type and program
    const workoutsByType: Record<string, number> = {};
    const workoutsByProgram: Record<string, number> = {};

    workoutHistory.forEach(w => {
      workoutsByType[w.workoutType] = (workoutsByType[w.workoutType] || 0) + 1;
      if (w.program) {
        workoutsByProgram[w.program] = (workoutsByProgram[w.program] || 0) + 1;
      }
    });

    const favoriteWorkoutType = Object.entries(workoutsByType)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'telo';

    return {
      totalWorkouts: workoutHistory.length,
      totalMinutes,
      averageWorkoutsPerWeek,
      favoriteWorkoutType,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      thisWeek,
      thisMonth,
      workoutsByType,
      workoutsByProgram,
      recentSessions: workoutHistory.slice(0, 10)
    };
  }, [workoutHistory, streak]);

  // Get calendar data for a specific month
  const getCalendarData = useCallback((year: number, month: number): WorkoutCalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const days: WorkoutCalendarDay[] = [];
    
    // Add previous month's trailing days
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date: dateStr,
        workouts: workoutHistory.filter(w => w.completedAt.split('T')[0] === dateStr),
        isToday: dateStr === todayStr,
        isCurrentMonth: false
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date: dateStr,
        workouts: workoutHistory.filter(w => w.completedAt.split('T')[0] === dateStr),
        isToday: dateStr === todayStr,
        isCurrentMonth: true
      });
    }
    
    // Add next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date: dateStr,
        workouts: workoutHistory.filter(w => w.completedAt.split('T')[0] === dateStr),
        isToday: dateStr === todayStr,
        isCurrentMonth: false
      });
    }
    
    return days;
  }, [workoutHistory]);

  return {
    // State
    workoutHistory,
    streak,
    isLoading,
    
    // Actions
    completeWorkout,
    
    // Computed
    stats: getWorkoutStats(),
    getCalendarData,
    
    // Utils
    getWorkoutsForDate: useCallback((date: string) => {
      return workoutHistory.filter(w => w.completedAt.split('T')[0] === date);
    }, [workoutHistory])
  };
}