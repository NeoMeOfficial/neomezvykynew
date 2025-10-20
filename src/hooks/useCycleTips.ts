import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCycleTips(phase: string, currentDay: number) {
  return useQuery({
    queryKey: ['cycle-tips', phase, currentDay],
    queryFn: async () => {
      // Determine day range based on current day
      let dayRange = '';
      if (currentDay >= 1 && currentDay <= 3) dayRange = '1-3';
      else if (currentDay >= 4 && currentDay <= 7) dayRange = '4-7';
      else if (currentDay >= 8 && currentDay <= 14) dayRange = '8-14';
      else if (currentDay >= 15 && currentDay <= 21) dayRange = '15-21';
      else dayRange = '22-28';

      const { data, error } = await supabase
        .from('cycle_tips')
        .select('*')
        .eq('phase', phase)
        .eq('day_range', dayRange)
        .eq('is_approved', true);

      if (error) throw error;
      return data || [];
    },
    enabled: !!phase,
  });
}
