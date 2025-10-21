import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCycleTips(currentDay: number) {
  return useQuery({
    queryKey: ['cycle-tips', currentDay],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycle_tips')
        .select('*')
        .eq('day', currentDay)
        .eq('is_approved', true);

      if (error) throw error;
      return data || [];
    },
    enabled: currentDay >= 1 && currentDay <= 28,
  });
}
