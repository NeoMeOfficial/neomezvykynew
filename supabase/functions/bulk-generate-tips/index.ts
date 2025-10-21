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

    // Generate tips for all 28 days
    const days = Array.from({ length: 28 }, (_, i) => i + 1);

    const results = [];
    let totalGenerated = 0;
    let totalFailed = 0;

    // Generate tips for each day
    for (const day of days) {
      try {
        console.log(`Generating tips for day ${day}...`);
        
        const { data, error } = await supabase.functions.invoke('generate-cycle-tips', {
          body: { day, regenerate: true }
        });

        if (error) {
          console.error(`Failed for day ${day}:`, error);
          totalFailed++;
          results.push({ day, success: false, error: error.message });
        } else {
          console.log(`Success for day ${day}`);
          totalGenerated += data.tips?.length || 0;
          results.push({ day, success: true, tipsCount: data.tips?.length });
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Error for day ${day}:`, err);
        totalFailed++;
        results.push({ day, success: false, error: err.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        summary: {
          totalGenerated,
          totalFailed,
          totalAttempts: 28
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
