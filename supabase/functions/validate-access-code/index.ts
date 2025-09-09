import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { code } = await req.json();

    if (!code || code.length !== 6) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Kód musí mať presne 6 znakov' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if code exists
    const { data: accessCode, error: fetchError } = await supabase
      .from('access_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (fetchError || !accessCode) {
      console.log('Code validation failed:', fetchError);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Neplatný prístupový kód' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if it's the test code - allow unlimited use
    const isTestCode = code.toUpperCase() === 'ABCD12';

    // For non-test codes, check if already used
    if (!isTestCode && accessCode.is_used) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Tento kód už bol použitý' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Mark code as used (except for test codes)
    if (!isTestCode) {
      const { error: updateError } = await supabase
        .from('access_codes')
        .update({ 
          is_used: true, 
          used_at: new Date().toISOString()
        })
        .eq('id', accessCode.id);

      if (updateError) {
        console.error('Error marking code as used:', updateError);
        return new Response(
          JSON.stringify({ 
            valid: false, 
            message: 'Chyba pri overovaní kódu' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        valid: true, 
        code: accessCode.code,
        message: 'Prístupový kód úspešne overený' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in validate-access-code function:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        message: 'Interná chyba servera' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});