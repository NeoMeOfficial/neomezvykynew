import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { cycleLength = 28, timeWindow = '1 hour' } = await req.json().catch(() => ({ 
      cycleLength: 28,
      timeWindow: '1 hour'
    }));

    console.log(`🔓 Approving all tips for ${cycleLength}-day cycle created within last ${timeWindow}...`);
    
    // Update all tips for the specified cycle length created within the time window
    const { data, error } = await supabase
      .from('cycle_tips')
      .update({ is_approved: true })
      .eq('cycle_length', cycleLength)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // last hour
      .select();

    if (error) {
      console.error('❌ Error approving tips:', error);
      throw error;
    }

    console.log(`✅ Successfully approved ${data?.length || 0} tips`);

    return new Response(
      JSON.stringify({
        success: true,
        approved_count: data?.length || 0,
        tips: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in approve-cycle-tips:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
