import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PhaseKey } from '@/features/cycle/types';

export function useCycleTips(currentDay: number, phase: PhaseKey) {
  return useQuery({
    queryKey: ['cycle-tips', currentDay, phase],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycle_tips')
        .select('*')
        .eq('day', currentDay)
        .eq('phase', phase)
        .eq('is_approved', true)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        return {
          expectation: '',
          nutrition: '',
          mind: '',
          movement: ''
        };
      }
      
      return {
        expectation: data.expectation_text || '',
        nutrition: data.nutrition_text || '',
        mind: data.mind_text || '',
        movement: data.movement_text || ''
      };
    },
    enabled: currentDay >= 1 && currentDay <= 28,
  });
}
