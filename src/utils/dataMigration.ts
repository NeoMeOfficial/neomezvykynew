import { supabase } from '../lib/supabase';

interface LocalStorageData {
  habits?: any[];
  periodData?: any;
  favorites?: any[];
  userProgress?: any;
  userProfile?: any;
}

export async function migrateLocalStorageToSupabase(userId: string): Promise<boolean> {
  try {
    console.log('Starting data migration for user:', userId);

    // Check if migration already done
    const migrationKey = `migration_completed_${userId}`;
    if (localStorage.getItem(migrationKey)) {
      console.log('Migration already completed for this user');
      return true;
    }

    const localData = gatherLocalStorageData();
    
    if (Object.keys(localData).length === 0) {
      console.log('No local data to migrate');
      localStorage.setItem(migrationKey, 'true');
      return true;
    }

    // Migrate habits
    if (localData.habits && localData.habits.length > 0) {
      await migrateHabits(userId, localData.habits);
    }

    // Migrate period data
    if (localData.periodData) {
      await migratePeriodData(userId, localData.periodData);
    }

    // Migrate favorites
    if (localData.favorites && localData.favorites.length > 0) {
      await migrateFavorites(userId, localData.favorites);
    }

    // Migrate user progress
    if (localData.userProgress) {
      await migrateUserProgress(userId, localData.userProgress);
    }

    // Mark migration as complete
    localStorage.setItem(migrationKey, 'true');
    console.log('Migration completed successfully');
    return true;

  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

function gatherLocalStorageData(): LocalStorageData {
  const data: LocalStorageData = {};

  try {
    // Gather habits data
    const habitKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('habits_') || key.includes('water_intake') || key.includes('habit_')
    );
    
    if (habitKeys.length > 0) {
      data.habits = habitKeys.map(key => {
        try {
          return {
            key,
            value: JSON.parse(localStorage.getItem(key) || '{}'),
            date: extractDateFromKey(key)
          };
        } catch {
          return null;
        }
      }).filter(Boolean);
    }

    // Gather period data
    const periodKeys = Object.keys(localStorage).filter(key => 
      key.includes('period') || key.includes('menstrual') || key.includes('cycle')
    );
    
    if (periodKeys.length > 0) {
      const periodData: any = {};
      periodKeys.forEach(key => {
        try {
          periodData[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          // Skip invalid data
        }
      });
      data.periodData = periodData;
    }

    // Gather favorites
    const favoritesData = localStorage.getItem('user_favorites');
    if (favoritesData) {
      try {
        data.favorites = JSON.parse(favoritesData);
      } catch {
        // Skip invalid data
      }
    }

    // Gather user progress
    const progressKeys = Object.keys(localStorage).filter(key => 
      key.includes('progress') || key.includes('program_') || key.includes('streak')
    );
    
    if (progressKeys.length > 0) {
      const progressData: any = {};
      progressKeys.forEach(key => {
        try {
          progressData[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          // Skip invalid data
        }
      });
      data.userProgress = progressData;
    }

  } catch (error) {
    console.error('Error gathering localStorage data:', error);
  }

  return data;
}

async function migrateHabits(userId: string, habits: any[]) {
  try {
    const habitsToInsert = [];

    for (const habit of habits) {
      if (!habit.value || !habit.date) continue;

      // Convert localStorage habit format to Supabase format
      if (habit.value.glasses) {
        // Water intake habit
        habitsToInsert.push({
          user_id: userId,
          habit_type: 'water',
          habit_name: 'Pitný režim',
          target_count: 8,
          current_count: habit.value.glasses,
          date: habit.date,
          completed: habit.value.glasses >= 8
        });
      }

      if (habit.value.exercised) {
        // Exercise habit
        habitsToInsert.push({
          user_id: userId,
          habit_type: 'exercise',
          habit_name: 'Cvičenie',
          target_count: 1,
          current_count: habit.value.exercised ? 1 : 0,
          date: habit.date,
          completed: habit.value.exercised
        });
      }

      if (habit.value.meditation) {
        // Meditation habit
        habitsToInsert.push({
          user_id: userId,
          habit_type: 'meditation',
          habit_name: 'Meditácia',
          target_count: 1,
          current_count: habit.value.meditation ? 1 : 0,
          date: habit.date,
          completed: habit.value.meditation
        });
      }
    }

    if (habitsToInsert.length > 0) {
      const { error } = await supabase
        .from('user_habits')
        .insert(habitsToInsert);

      if (error) {
        console.error('Error migrating habits:', error);
      } else {
        console.log(`Migrated ${habitsToInsert.length} habits`);
      }
    }

  } catch (error) {
    console.error('Error in migrateHabits:', error);
  }
}

async function migratePeriodData(userId: string, periodData: any) {
  try {
    const periodsToInsert = [];

    Object.entries(periodData).forEach(([key, value]: [string, any]) => {
      if (value && value.startDate) {
        periodsToInsert.push({
          user_id: userId,
          cycle_start_date: value.startDate,
          cycle_length: value.cycleLength || 28,
          period_length: value.periodLength || 5,
          symptoms: value.symptoms || [],
          notes: value.notes || ''
        });
      }
    });

    if (periodsToInsert.length > 0) {
      const { error } = await supabase
        .from('period_tracking')
        .insert(periodsToInsert);

      if (error) {
        console.error('Error migrating period data:', error);
      } else {
        console.log(`Migrated ${periodsToInsert.length} period records`);
      }
    }

  } catch (error) {
    console.error('Error in migratePeriodData:', error);
  }
}

async function migrateFavorites(userId: string, favorites: any[]) {
  try {
    const favoritesToInsert = favorites
      .filter(fav => fav.type && fav.id)
      .map(fav => ({
        user_id: userId,
        item_type: fav.type,
        item_id: fav.id
      }));

    if (favoritesToInsert.length > 0) {
      const { error } = await supabase
        .from('user_favorites')
        .insert(favoritesToInsert);

      if (error) {
        console.error('Error migrating favorites:', error);
      } else {
        console.log(`Migrated ${favoritesToInsert.length} favorites`);
      }
    }

  } catch (error) {
    console.error('Error in migrateFavorites:', error);
  }
}

async function migrateUserProgress(userId: string, progressData: any) {
  try {
    const progressToInsert = [];

    Object.entries(progressData).forEach(([key, value]: [string, any]) => {
      if (value && (value.currentWeek || value.currentDay || value.completedExercises)) {
        progressToInsert.push({
          user_id: userId,
          program_id: extractProgramIdFromKey(key),
          current_week: value.currentWeek || 1,
          current_day: value.currentDay || 1,
          completed_exercises: value.completedExercises || [],
          streak_days: value.streakDays || 0
        });
      }
    });

    if (progressToInsert.length > 0) {
      const { error } = await supabase
        .from('user_progress')
        .insert(progressToInsert);

      if (error) {
        console.error('Error migrating user progress:', error);
      } else {
        console.log(`Migrated ${progressToInsert.length} progress records`);
      }
    }

  } catch (error) {
    console.error('Error in migrateUserProgress:', error);
  }
}

function extractDateFromKey(key: string): string {
  // Try to extract date from localStorage key
  const dateMatch = key.match(/\d{4}-\d{2}-\d{2}/);
  if (dateMatch) {
    return dateMatch[0];
  }
  
  // Default to today if no date found
  return new Date().toISOString().split('T')[0];
}

function extractProgramIdFromKey(key: string): string {
  // Try to extract program ID from localStorage key
  const programMatch = key.match(/program_(.+)_progress/);
  if (programMatch) {
    return programMatch[1];
  }
  
  return 'unknown';
}

export function clearLocalStorageAfterMigration() {
  try {
    // Only clear specific data that was migrated
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('habits_') || 
      key.includes('water_intake') ||
      key.includes('period') ||
      key.includes('menstrual') ||
      key.includes('cycle') ||
      key === 'user_favorites' ||
      key.includes('progress') ||
      key.includes('program_') ||
      key.includes('streak')
    );

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(`Cleared ${keysToRemove.length} localStorage items after migration`);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}