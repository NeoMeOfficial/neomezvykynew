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

    const { day, regenerate } = await req.json();

    // Define categories (4 tips per day)
    const categories = ['energy', 'mood', 'nutrition', 'activity'];

    // System prompt for AI
    const systemPrompt = `Si expertka na ženské zdravie a menštruačný cyklus s hlbokým pochopením hormonálnych zmien počas 28-dňového cyklu.

PRAVIDLÁ:
- Každý tip je založený na FAKTOCH o hormonálnych zmenách v daný deň cyklu
- Používaj "ty" formu (nie "vy")
- Buď konkrétna, praktická a informatívna - nie len povšechná
- Vysvetľuj PREČO je tip relevantný (súvislosť s hormónmi/fázou)
- Tipy majú 2-4 vety - jednoduché, ale nie povrchné
- Používaj slovenčinu
- Nepoužívaj odborné medicínske výrazy, ale uvádzaj hormóny (estrogén, progesterón, testosterón)

ŠTRUKTÚRA ODPOVEDE:
Vráť PRESNE 4 tipy (jeden pre každú kategóriu) vo formáte JSON:
{
  "energy": "konkrétny tip o energii s vysvetlením prečo",
  "mood": "konkrétny tip o nálade/myslení s kontextom", 
  "nutrition": "konkrétny tip o výžive s vysvetlením benefitu",
  "activity": "konkrétny tip o pohybe/aktivite s dôvodom"
}`;

    // Day-specific context based on 28-day cycle
    const dayContext: Record<number, string> = {
      1: `DEŇ 1 – Menštruácia\nHormóny: Estrogén aj progesterón sú na minime – telo je citlivé a unaviteľné.\nZameranie: Nízka intenzita, protizápalová strava, jemnosť k sebe.`,
      2: `DEŇ 2 – Menštruácia\nHormóny: Únava môže pretrvávať, zápalové procesy sú mierne zvýšené.\nZameranie: Nízka intenzita, omega-3 a antioxidanty, dychové cvičenia.`,
      3: `DEŇ 3 – Menštruácia\nHormóny: Krvácanie môže byť silnejšie – energia je limitovaná.\nZameranie: Strečing, komplexné sacharidy, self-kindness.`,
      4: `DEŇ 4 – Menštruácia\nHormóny: Estrogén začína jemne stúpať – energia sa vracia.\nZameranie: Pilates stredná intenzita, regenerácia (železo, horčík, vápnik).`,
      5: `DEŇ 5 – Koniec menštruácie\nHormóny: Estrogén ďalej stúpa – myseľ sa prejasňuje.\nZameranie: Pilates, tvorba krvi (železo, horčík), sústredenie.`,
      6: `DEŇ 6 – Folikulárna fáza\nHormóny: Estrogén rastie – motivácia aj energia stúpajú.\nZameranie: Stredná intenzita, bielkoviny a sacharidy, prebúdzanie.`,
      7: `DEŇ 7 – Folikulárna fáza\nHormóny: Estrogén podporuje rýchlejšie regenerovanie.\nZameranie: Vyššia intenzita, svalová podpora, konanie.`,
      8: `DEŇ 8 – Folikulárna fáza\nHormóny: Telo je výkonnejšie a odolnejšie voči záťaži.\nZameranie: Vysoká intenzita, dlhšia energia, hranice.`,
      9: `DEŇ 9 – Folikulárna fáza\nHormóny: Estrogén ďalej rastie – nálada aj mozgová jasnosť sú vysoko.\nZameranie: Vysoká intenzita, regenerácia svalov, rast.`,
      10: `DEŇ 10 – Folikulárna fáza\nHormóny: Estrogén je na vrchole – peak performance.\nZameranie: Vysoká intenzita, stabilný cukor, využiť energiu.`,
      11: `DEŇ 11 – Folikulárna fáza\nHormóny: Mozog aj telo sú v najlepšej kondícii.\nZameranie: Vysoká intenzita, metabolizmus estrogénu (vláknina), smerovanie energie.`,
      12: `DEŇ 12 – Ovulácia (začiatok)\nHormóny: Estrogén a testosterón sú vysoko – sila a charizma stúpajú.\nZameranie: Vysoká intenzita, omega-3 a antioxidanty, flow.`,
      13: `DEŇ 13 – Ovulácia\nHormóny: Vrchol estrogénu – sebavedomie, komunikácia, energia.\nZameranie: Vysoká intenzita, detox estrogénu (vláknina), žiarenie.`,
      14: `DEŇ 14 – Ovulácia (peak)\nHormóny: Energia na maxime – telo zvládne najviac.\nZameranie: Vysoká intenzita, metabolizmus estrogénu, múdre využitie energie.`,
      15: `DEŇ 15 – Koniec ovulácie\nHormóny: Estrogén začína klesať – energia stále vysoká.\nZameranie: Stredná až vysoká intenzita, stabilita hormónov, ochrana energie.`,
      16: `DEŇ 16 – Luteálna fáza\nHormóny: Progesterón stúpa – telo sa spomaľuje.\nZameranie: Stredná intenzita, stabilný cukor, spomalenie.`,
      17: `DEŇ 17 – Luteálna fáza\nHormóny: Môže sa objaviť pokles motivácie.\nZameranie: Stredná intenzita, trávenie (vláknina, probiotiká), schopnosť.`,
      18: `DEŇ 18 – Luteálna fáza\nHormóny: Progesterón tlačí k pomalšiemu tempu.\nZameranie: Stredná intenzita, horčík pre spánok, dôvera v telo.`,
      19: `DEŇ 19 – Luteálna fáza\nHormóny: Začína sa zvyšovať emočná citlivosť.\nZameranie: Stredná intenzita, nervový systém (horčík, B6), láskavosť k sebe.`,
      20: `DEŇ 20 – Luteálna fáza\nHormóny: Zadržiavanie vody – pocit "ťažkosti".\nZameranie: Stredná intenzita, lymfa (draslík), zjednodušenie.`,
      21: `DEŇ 21 – Luteálna fáza\nHormóny: Energia pokračuje v poklese – šetrenie sily.\nZameranie: Stredná intenzita, nálada (B6, horčík, omega-3), pokoj.`,
      22: `DEŇ 22 – Luteálna fáza\nHormóny: Môže sa objaviť podráždenosť.\nZameranie: Nízka až stredná intenzita, trávenie a hormóny, ochrana energie.`,
      23: `DEŇ 23 – Luteálna fáza (PMS)\nHormóny: Progesterón klesá – výkyvy nálad.\nZameranie: Nízka intenzita, nervový systém (horčík, B6), emócie nie sú ja.`,
      24: `DEŜ 24 – Luteálna fáza (PMS)\nHormóny: Citlivosť a únava stúpajú.\nZameranie: Nízka intenzita, stabilný cukor, jemnosť.`,
      25: `DEŇ 25 – Luteálna fáza (PMS)\nHormóny: Progesterón prudko klesá – kolísanie nálad.\nZameranie: Nízka intenzita, nervový systém, emócie nedefinujú.`,
      26: `DEŇ 26 – Predmenštruačné dni\nHormóny: Únava a výkyvy sú bežné.\nZameranie: Nízka intenzita, omega-3 pre prípravu, hlboké dýchanie.`,
      27: `DEŇ 27 – Predmenštruačné dni\nHormóny: Príprava na nový cyklus – spomalenie.\nZameranie: Nízka intenzita, trávenie (vláknina, probiotiká), spolupráca s telom.`,
      28: `DEŇ 28 – Koniec cyklu\nHormóny: Minimum – začína sa nový cyklus.\nZameranie: Nízka intenzita, pokoj pred menštruáciou (horčík), nový začiatok.`
    };

    const userPrompt = `${dayContext[day]}

Vytvor 4 hlboké, faktami podložené tipy (jeden pre každú kategóriu: energy, mood, nutrition, activity).
DÔLEŽITÉ:
- Vysvetľuj súvislosť s hormónmi alebo fázou cyklu
- Uvádzaj konkrétne potraviny/aktivity, nie len všeobecnosti
- Každý tip má jasný benefit/dôvod
- 2-4 vety, jednoducho ale nie povrchne
- Pre busy maminy – jednoducho realizovateľné`;

    // Call Lovable AI
    console.log("Calling AI for day:", day);
    
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
      day: day,
      category,
      tip_text: generatedTips[category],
      is_approved: false,
      created_by: 'ai'
    }));

    // If regenerate, delete existing tips for this day
    if (regenerate) {
      const { error: deleteError } = await supabase
        .from('cycle_tips')
        .delete()
        .eq('day', day);
      
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
        message: `Generated ${insertedTips.length} tips for day ${day}`
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
