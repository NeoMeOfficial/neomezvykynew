import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Define all phase/day combinations to generate
    const phaseDayRanges = [
      { phase: 'menstruation', dayRanges: ['1-2', '3-5'] },
      { phase: 'follicular', dayRanges: ['6-11', '12-13'] },
      { phase: 'ovulation', dayRanges: ['14'] },
      { phase: 'luteal', dayRanges: ['15-23', '24-28'] }
    ];

    const results = [];
    let totalGenerated = 0;
    let totalFailed = 0;

    // Generate for each phase/day combination
    for (const { phase, dayRanges } of phaseDayRanges) {
      for (const dayRange of dayRanges) {
        try {
          console.log(`Generating tips for ${phase} ${dayRange}...`);
          
          // Call the generate-cycle-tips function
          const { data, error } = await supabase.functions.invoke('generate-cycle-tips', {
            body: { phase, dayRange, regenerate: false }
          });

          if (error) throw error;
          
          if (data?.success) {
            totalGenerated += data.tips?.length || 0;
            results.push({
              phase,
              dayRange,
              success: true,
              tipsCount: data.tips?.length || 0
            });
            console.log(`✓ Generated ${data.tips?.length} tips for ${phase} ${dayRange}`);
          } else {
            throw new Error(data?.error || 'Unknown error');
          }

          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          totalFailed++;
          results.push({
            phase,
            dayRange,
            success: false,
            error: error.message
          });
          console.error(`✗ Failed for ${phase} ${dayRange}:`, error.message);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        summary: {
          totalGenerated,
          totalFailed,
          totalAttempts: phaseDayRanges.reduce((acc, p) => acc + p.dayRanges.length, 0)
        },
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in bulk-generate-tips:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
