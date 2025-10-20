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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { phase, dayRange, regenerate } = await req.json();

    // Define categories
    const categories = ['energy', 'mood', 'nutrition', 'activity', 'self_care'];

    // System prompt for AI
    const systemPrompt = `Si expertka na ženské zdravie a menštruačný cyklus. Tvoja úloha je vytvárať praktické, krátke a užitočné tipy pre busy maminy.

PRAVIDLÁ:
- Každý tip má max 2-3 vety
- Používaj "ty" formu (nie "vy")
- Buď konkrétna a praktická
- Zameraj sa na všedný deň busy maminy
- Tipy musia byť jednoducho realizovateľné
- Používaj slovenčinu
- Nepoužívaj odborné medicínske výrazy

ŠTRUKTÚRA ODPOVEDE:
Vráť PRESNE 5 tipov (jeden pre každú kategóriu) vo formáte JSON:
{
  "energy": "tip o energii",
  "mood": "tip o nálade", 
  "nutrition": "tip o výžive",
  "activity": "tip o aktivite",
  "self_care": "tip o self-care"
}`;

    // Phase-specific context
    const phaseContext = {
      menstruation: `Fáza: MENŠTRUÁCIA (${dayRange}. deň)
Žena je na menštruácii. Energia je nižšia, môže pociťovať únavu, kŕče, bolesti. Potrebuje viac odpočinku a pohody.`,
      follicular: `Fáza: FOLIKULÁRNA (${dayRange}. deň)
Energia postupne stúpa, žena sa cíti svieža a motivovaná. Telo sa pripravuje na ovuláciu.`,
      ovulation: `Fáza: OVULÁCIA (${dayRange}. deň)
Vrchol energie a nálady. Žena sa cíti sebavedomo, má veľa energie. Ideálny čas na náročné úlohy.`,
      luteal: `Fáza: LUTEÁLNA (${dayRange}. deň)
Energia postupne klesá, môžu sa objaviť PMS symptómy. Žena potrebuje viac trpezlivosti so sebou.`
    };

    const userPrompt = `${phaseContext[phase as keyof typeof phaseContext]}

Vytvor 5 praktických tipov (jeden pre každú kategóriu: energy, mood, nutrition, activity, self_care).
Pamätaj - busy mamina, krátke tipy (2-3 vety), konkrétne a jednoducho realizovateľné.`;

    // Call Lovable AI
    console.log("Calling AI for phase:", phase, "day:", dayRange);
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedTips = JSON.parse(aiData.choices[0].message.content);
    
    console.log("Generated tips:", generatedTips);

    // Store tips in database
    const tipsToInsert = categories.map(category => ({
      phase,
      day_range: dayRange,
      category,
      tip_text: generatedTips[category],
      is_approved: false,
      created_by: 'ai'
    }));

    // If regenerate, delete existing tips for this phase/day
    if (regenerate) {
      const { error: deleteError } = await supabase
        .from('cycle_tips')
        .delete()
        .eq('phase', phase)
        .eq('day_range', dayRange);
      
      if (deleteError) {
        console.error('Error deleting old tips:', deleteError);
      }
    }

    const { data: insertedTips, error: insertError } = await supabase
      .from('cycle_tips')
      .insert(tipsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting tips:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        tips: insertedTips,
        message: `Generated ${insertedTips.length} tips for ${phase} ${dayRange}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-cycle-tips:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
