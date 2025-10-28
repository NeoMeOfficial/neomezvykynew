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
    const { regenerate = false } = await req.json().catch(() => ({ regenerate: false }));

    console.log(`🚀 Starting bulk generation of 28-day cycle plans (regenerate: ${regenerate})...`);
    
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (let day = 1; day <= 28; day++) {
      try {
        console.log(`📅 [${day}/28] Generating plan for day ${day}...`);
        
        const { data, error } = await supabase.functions.invoke('generate-cycle-tips', {
          body: { day, regenerate }
        });

        if (error) {
          console.error(`❌ [${day}/28] Function invocation error:`, error);
          throw error;
        }

        results.push({
          day,
          success: true,
          phase: data.phase,
          subphase: data.subphase
        });
        successCount++;
        
        console.log(`✅ [${day}/28] Day ${day} completed (${data.phase}${data.subphase ? `/${data.subphase}` : ''})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ [${day}/28] Day ${day} failed:`, error);
        results.push({
          day,
          success: false,
          error: error.message
        });
        failureCount++;
      }
    }

    console.log(`🎉 Bulk generation complete: ${successCount} success, ${failureCount} failures`);

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total: 28,
          successful: successCount,
          failed: failureCount
        },
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in bulk-generate-tips:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});