import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PhaseRange } from '@/features/cycle/types';
import { getSubphase } from '@/features/cycle/utils';
import { generateNutrition, generateMovement } from '@/lib/cycleTipsGenerator';

export function useCycleTips(
  currentDay: number, 
  cycleLength: number,
  periodLength: number,
  phaseRanges: PhaseRange[]
) {
  // Calculate phase and subphase dynamically
  const { phase, subphase } = getSubphase(currentDay, cycleLength, periodLength);
  
  return useQuery({
    queryKey: ['phase-tips', phase, subphase, currentDay],
    queryFn: async () => {
      // Fetch generic texts from phase_tips table
      let query = supabase
        .from('phase_tips')
        .select('*')
        .eq('phase', phase)
        .eq('is_approved', true);
      
      // Handle subphase - for ovulation it's 'peak', for others it varies
      if (subphase) {
        query = query.eq('subphase', subphase);
      } else {
        query = query.is('subphase', null);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching phase tips:', error);
      }
      
      // Generate dynamic content on client using MASTER documents
      const nutrition = generateNutrition(currentDay, phase, subphase);
      const movement = generateMovement(currentDay, phase, subphase, phaseRanges);
      
      return {
        expectation: data?.expectation_text || '',
        mind: data?.mind_text || '',
        nutrition,
        movement
      };
    },
    enabled: currentDay >= 1,
  });
}
