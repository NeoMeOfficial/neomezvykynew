/**
 * Transfer temporary data to permanent storage when access code is created
 */

import { temporaryStorage } from './temporaryStorage';
import { supabase } from '@/integrations/supabase/client';

export async function transferTemporaryDataToPermanent(accessCode: string): Promise<boolean> {
  try {
    const summary = temporaryStorage.getDataSummary();
    
    // If no temporary data exists, nothing to transfer
    if (!temporaryStorage.hasTemporaryData()) {
      return true;
    }

    console.log('Transferring temporary data:', summary);

    // Transfer habit data
    const habitData = temporaryStorage.getAllHabitData();
    if (habitData.length > 0) {
      const habitEntries = habitData.map(entry => ({
        habit_id: entry.habitId,
        date: entry.date,
        value: entry.value,
        access_code: accessCode
      }));

      const { error: habitError } = await supabase
        .from('habit_entries')
        .upsert(habitEntries, {
          onConflict: 'habit_id,date,access_code'
        });

      if (habitError) {
        console.error('Failed to transfer habit data:', habitError);
        return false;
      }
    }

    // Transfer reflection data
    const reflectionData = temporaryStorage.getAllReflectionData();
    if (reflectionData.length > 0) {
      const reflectionEntries = reflectionData.map(entry => ({
        date: entry.date,
        well_done: entry.well_done,
        improve: entry.improve,
        access_code: accessCode
      }));

      const { error: reflectionError } = await supabase
        .from('reflections')
        .upsert(reflectionEntries, {
          onConflict: 'date,access_code'
        });

      if (reflectionError) {
        console.error('Failed to transfer reflection data:', reflectionError);
        return false;
      }
    }

    // Transfer cycle data (if exists)
    const cycleData = temporaryStorage.getCycleData();
    if (cycleData) {
      // The cycle data will be handled by the MenstrualCycleTracker component
      // when it detects the new access code
    }

    // Clear temporary data after successful transfer
    temporaryStorage.clearAll();
    
    console.log('Temporary data transferred successfully');
    return true;
  } catch (error) {
    console.error('Failed to transfer temporary data:', error);
    return false;
  }
}