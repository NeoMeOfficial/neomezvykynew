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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { day, regenerate } = await req.json();

    if (!day || day < 1 || day > 28) {
      throw new Error('Invalid day. Must be between 1 and 28.');
    }

    // Determine phase and subphase based on day
    const getPhaseInfo = (d: number) => {
      if (d >= 1 && d <= 5) return { phase: 'menstrual', subphase: null };
      if (d >= 6 && d <= 12) return { phase: 'follicular', subphase: null };
      if (d >= 13 && d <= 15) return { phase: 'ovulation', subphase: null };
      // Luteal: 16-28 (13 days total)
      const lutealDay = d - 15;
      if (lutealDay <= 4) return { phase: 'luteal', subphase: 'early' }; // 16-19
      if (lutealDay <= 9) return { phase: 'luteal', subphase: 'mid' };   // 20-24
      return { phase: 'luteal', subphase: 'late' }; // 25-28
    };

    const { phase, subphase } = getPhaseInfo(day);

    // MASTER TEMPLATES - Direct from PDF (SOURCE OF TRUTH)
    const masterTemplates: Record<string, any> = {
      menstrual: {
        hormones: "Estrogén aj progesterón sú nízko",
        expectation: "môžeš cítiť nižšiu energiu a rýchlejšie vyčerpanie",
        body: "mierny zápalový proces v maternici, možné kŕče, napätie v bruchu, citlivý chrbát",
        emotional: "nižšia tolerancia stresu, emočná citlivosť",
        nutrition: {
          needs: ["znižiť zápal", "doplniť železo", "podporiť trávenie teplými jedlami", "stabilizovať cukry"],
          keyNutrients: ["Železo", "Vitamín C", "Omega-3", "Antioxidanty"],
          foods: ["vajcia", "tofu", "cícer", "šošovica", "hovädzie mäso", "jahody", "pomaranč", "kiwi", 
                  "granátové jablko", "špenát", "kel", "brokolica", "červená repa", "losos", "sardinky", 
                  "chia", "ľan", "kurkuma", "zázvor", "vývary", "polievky", "ovsená kaša", "quinoa"],
          tip: "Kombinuj železo + vitamín C pre lepšiu vstrebateľnosť. Teplé jedlá uľahčujú trávenie."
        },
        mind: {
          insight: "Dnes je prirodzená citlivosť a potreba pokoja.",
          techniques: [
            "Predĺžený výdych (nádych 4, výdych 6) upokojí nervový systém.",
            "Journaling: Čo viem dnes zjednodušiť?"
          ],
          benefit: "Pomôže ti to upokоjiť nervový systém a znížiť tlak.",
          thoughts: [
            "Som v bezpečí. Nemusím dnes veľa dávať.",
            "Moje telo potrebuje oddych – a to je v poriadku.",
            "Dnes si dovolím spomalit."
          ]
        },
        movement: {
          context: "Nízka energia, citlivé telo.",
          intensity: "Strečing / jemný pilates (5-15 min)",
          neome: "5-min strečing pre panvu a spodný chrbát",
          cardio: "",
          walkBenefits: ["uvoľní kŕče", "zníži úzkosť", "zlepší náladu cez endorfíny"]
        }
      },
      follicular: {
        hormones: "Estrogén postupne stúpa",
        expectation: "energia, motivácia a výkonnosť sa zlepšujú",
        body: "regenerácia je rýchlejšia, telo lepšie znáša fyzickú záťaž",
        emotional: "rast energie, motivácia, kreativita, pozitívne naladenie",
        nutrition: {
          needs: ["podpora rastúcej energie", "stabilný cukor v krvi", "výživa pre svaly a hormóny"],
          keyNutrients: ["Proteíny", "Omega-3", "Vláknina", "B-komplex"],
          foods: ["vajcia", "losos", "tofu", "tempeh", "grécky jogurt", "fazuľa", "bobuľové ovocie", 
                  "mango", "jablko", "hrozno", "špenát", "kel", "paprika", "brokolica", "cuketa",
                  "quinoa", "ovos", "bataty", "ryža natural", "chia", "ľan", "avokádo", "olivy", "orechy"],
          tip: "Bielkoviny v každom jedle (25-30g). Pravidelné jedlá každé 3-4 hodiny."
        },
        mind: {
          insight: "Dnes cítiš rast energie a kreativitu.",
          techniques: [
            "Energizujúci nádych nosom + rýchly výdych ústami (3×).",
            "Journaling: Čo chcem tento týždeň posunúť?"
          ],
          benefit: "Naštartuje tvoj deň a zlepší koncentráciu.",
          thoughts: [
            "Mám energiu na nové veci.",
            "Som pripravená rásť.",
            "Dnes je dobrý deň na výzvy."
          ]
        },
        movement: {
          context: "Vysoká energia, telo zvláda záťaž.",
          intensity: "Silový tréning (15-30 min)",
          neome: "5-15 min silový tréning",
          cardio: "Voliteľné 2-3× týždenne, intervalové 15 min (1:1 = 1 min rýchlo / 1 min voľne)",
          walkBenefits: ["podporuje kreativitu", "zvyšuje motiváciu", "zlepšuje metabolizmus"]
        }
      },
      ovulation: {
        hormones: "Estrogén je na vrchole",
        expectation: "viac energie, sebavedomia a spoločenskej otvorenosti",
        body: "silové aj kondičné výkony na maxime",
        emotional: "vysoká sebadôvera, empatia, najvyššia sociálna inteligencia",
        nutrition: {
          needs: ["podpora vysokého výkonu", "protizápalová strava", "antioxidačná ochrana"],
          keyNutrients: ["Antioxidanty", "Omega-3", "Bielkoviny", "Vitamín C", "Zinok"],
          foods: ["vajcia", "losos", "tofu", "cottage", "citrusy", "bobuľové", "kiwi",
                  "brokolica", "paprika", "rukola", "špenát", "ľan", "chia", "avokádo", 
                  "orechy", "olivový olej"],
          tip: "Ľahšie jedlá pre vyššiu energiu. Pravidelné jedlá s dôrazom na bielkoviny (25-30g)."
        },
        mind: {
          insight: "Dnes cítiš sebadôveru a sociálnu energiu.",
          techniques: [
            "4-6 dých pre emocionálne uvoľnenie (nádych 4, výdych 6).",
            "Journaling: Kde chcem dať viac hlas môjmu názoru?"
          ],
          benefit: "Posilní tvoju sebadôveru a jasnosť.",
          thoughts: [
            "Som silná a žiarivá.",
            "Môj hlas má hodnotu.",
            "Dnes je deň pre spojenie a blízkosť."
          ]
        },
        movement: {
          context: "Peak výkonnosť, maximálna sila.",
          intensity: "Silový tréning (15-30 min)",
          neome: "15 min intenzívne silové + 5-min dopáľovačky",
          cardio: "Najlepšie dni v mesiaci na intervalové kardio (2:1 alebo 4:3)",
          walkBenefits: ["zvyšuje kreativitu", "zlepšuje koncentráciu", "podporuje dobrý spánok"]
        }
      },
      lutealEarly: {
        hormones: "Progesterón stúpa",
        expectation: "ešte dobrá energia, ale začína spomaľovať",
        body: "telo začína byť citlivejšie na intenzitu",
        emotional: "emočná citlivosť sa zvyšuje, potreba systému",
        nutrition: {
          needs: ["stabilizácia cukru v krvi", "upokojenie nervového systému", "prevencia PMS"],
          keyNutrients: ["Horčík", "Vitamín B6", "Vláknina", "Proteíny"],
          foods: ["vajcia", "morčacie mäso", "tofu", "strukoviny", "banán", "bobuľové", "hruška",
                  "brokolica", "kapusta", "špenát", "bataty", "orechy", "avokádo", "semienka",
                  "ovos", "quinoa", "škorica", "zázvor"],
          tip: "Pravidelné jedlá (hlavne raňajky). Bielkoviny + vláknina (25-30g fiber denne). Obmedziť kávu."
        },
        mind: {
          insight: "Dnes cítiš väčšiu emočnú citlivosť.",
          techniques: [
            "4-7-8 breathing (nádych 4, zadrž 7, výdych 8) upokojí nervový systém.",
            "Journaling: Čo môžem delegovať alebo zjednodušiť?"
          ],
          benefit: "Pomôže ti to nastaviť hranice a chrániť energiu.",
          thoughts: [
            "Moje emócie sú signály, nie problémy.",
            "Môžem počkať s veľkými rozhodnutiami.",
            "Dnes si nastavujem hranice."
          ]
        },
        movement: {
          context: "Dobrá energia, ale citlivejšie telo.",
          intensity: "Silový tréning",
          neome: "5-15 min silový tréning",
          cardio: "Steady kardio 20-30 min (žiadne intervaly)",
          walkBenefits: ["znižuje podráždenosť", "podporuje spánok", "znižuje stresový kortizol"]
        }
      },
      lutealMid: {
        hormones: "Progesterón vysoký",
        expectation: "energia klesá, potreba pokoja",
        body: "nižšia tolerancia na intenzitu a teplo, trávenie citlivejšie",
        emotional: "citlivosť na stres, silnejšie chute",
        nutrition: {
          needs: ["stabilizácia cukru", "upokojenie nervov", "podpora trávenia"],
          keyNutrients: ["Horčík", "Vitamín B6", "Vláknina", "Proteíny"],
          foods: ["vajcia", "morčacie mäso", "tofu", "strukoviny", "banán", "bobuľové",
                  "brokolica", "kapusta", "bataty", "orechy", "avokádo", "ovos", "quinoa"],
          tip: "Pravidelné jedlá, menej cukru, teplé tekutiny, zázvorový čaj."
        },
        mind: {
          insight: "Dnes je prirodzená citlivosť na stres.",
          techniques: [
            "4-7-8 breathing upokojí nervový systém.",
            "Journaling: Čo viem dnes odložiť?"
          ],
          benefit: "Pomôže ti to chrániť energiu a kľud.",
          thoughts: [
            "Moje emócie sú signály, nie problémy.",
            "Nemusím dnes všetko riešiť.",
            "Dnes si nastavujem hranice."
          ]
        },
        movement: {
          context: "Nižšia energia, citlivé telo.",
          intensity: "Pilates / mierny silový tréning",
          neome: "5-15 min pilates alebo mierny silový",
          cardio: "Steady kardio 20-30 min (žiadne intervaly) alebo žiadne",
          walkBenefits: ["znižuje PMS", "stabilizuje náladu", "uvoľňuje napätie"]
        }
      },
      lutealLate: {
        hormones: "Progesterón klesá",
        expectation: "nízka energia, vyčerpanie",
        body: "PMS, kŕče, nafukovanie, bolesti hlavy",
        emotional: "podráždenosť, úzkosť, citlivosť na maximum",
        nutrition: {
          needs: ["znižiť zápal", "doplniť horčík", "stabilizovať cukry"],
          keyNutrients: ["Horčík", "Vitamín B6", "Omega-3", "Antioxidanty"],
          foods: ["banán", "brokolica", "špenát", "bataty", "orechy", "avokádo", "temná čokoláda",
                  "zázvor", "kurkuma", "teplé polievky"],
          tip: "Teplé jedlá, pravidelné porcie, menej kofeínu a cukru, viac horčíka."
        },
        mind: {
          insight: "Dnes je prirodzená emočná záťaž (PMS).",
          techniques: [
            "Predĺžený výdych (4 nádych / 6 výdych) upokojí nervový systém.",
            "Journaling: Čo môžem pustiť?"
          ],
          benefit: "Pomôže ti to uvoľniť tlak a nájsť pokoj.",
          thoughts: [
            "Som v bezpečí, nemusím dnes veľa dávať.",
            "Moje telo potrebuje odpočinok.",
            "Dnes si dovolím spomalit."
          ]
        },
        movement: {
          context: "Nízka energia, PMS symptómy.",
          intensity: "Strečing / jemný pilates",
          neome: "5-15 min strečing alebo meditácia",
          cardio: "Žiadne, iba prechádzka",
          walkBenefits: ["zmierni PMS", "zníži kŕče", "zlepší náladu"]
        }
      }
    };

    // Determine which template to use
    let template = masterTemplates.menstrual;
    if (phase === 'follicular') template = masterTemplates.follicular;
    if (phase === 'ovulation') template = masterTemplates.ovulation;
    if (phase === 'luteal' && subphase === 'early') template = masterTemplates.lutealEarly;
    if (phase === 'luteal' && subphase === 'mid') template = masterTemplates.lutealMid;
    if (phase === 'luteal' && subphase === 'late') template = masterTemplates.lutealLate;

    // Rotate content for diversity
    const walkBenefitIndex = day % template.movement.walkBenefits.length;
    const thoughtIndex = day % (template.mind.thoughts?.length || 1);
    const techniqueIndex = day % template.mind.techniques.length;

    // System prompt - AI is FORMATTER, not CREATOR
    const systemPrompt = `Si expert na ženské zdravie a menštruačný cyklus. Tvorcou personalizovaných denných plánov pre ženy vo veku 25-45 rokov, väčšinou mamy.

AUDIENCE:
- Zaneprázdnené ženy a mamy (1-3 deti) s málo času, nízkou energiou
- Problémy: únava, PMS, bolesti, pribratie, ochabnuté svaly, boľavé telo
- Potrebujú: jednoduchosť, praktickosť, empatický prístup, mikropokroky

TÓN KOMUNIKÁCIE:
- 60% praktický, 40% nežný
- Ženský, teplý, empatický, stručný
- PREDIKTÍVNY, NIE DOGMATICKÝ → "pravdepodobne", "môžeš cítiť", NIE "ovuluješ dnes"
- Realistický pre mamy → 3-15 minúty namiesto hodiny
- Žiadne klišé, žiadne "si bohyňa svetla"
- Používaj: "môžeš", "skús", "pomôže ti" (NIE "musíš")

PRAVIDLÁ:
1. Použi PRESNÝ text z master template
2. Vyber z poskytnutých zoznamov (potraviny, benefity, techniky)
3. Žiadne vymýšľanie nových faktov alebo informácií
4. Len gramatické úpravy pre plynulosť

ZDROJE (overené):
- Dr. Mary Claire Haver (menopause & hormonal health)
- Dr. Vonda Wright (longevity & orthopaedics)  
- Dr. Natalie Crawford (fertility & cycle health)
- Dr. Stacy Sims (female physiology & performance)`;

    const userPrompt = `Vytvor obsah pre DEŇ ${day} v ${phase}${subphase ? ` (${subphase})` : ''} fáze.

MASTER TEMPLATE (SOURCE OF TRUTH):
Hormóny: ${template.hormones}
Očakávanie: ${template.expectation}
Telo: ${template.body}
Emócie: ${template.emotional}

STRAVA:
Potreby: ${template.nutrition.needs.join(', ')}
Kľúčové živiny: ${template.nutrition.keyNutrients.join(', ')}
Vyber 6 RÔZNYCH potravín z tohto zoznamu: ${template.nutrition.foods.join(', ')}
Tip: ${template.nutrition.tip}

MYSEĽ:
Insight: ${template.mind.insight}
Technika (použi túto): ${template.mind.techniques[techniqueIndex]}
Benefit: ${template.mind.benefit}
Myšlienka dňa (použi túto): ${template.mind.thoughts?.[thoughtIndex] || template.mind.thoughts?.[0]}

POHYB:
Kontext: ${template.movement.context}
Intenzita: ${template.movement.intensity}
NeoMe: ${template.movement.neome}
Kardio: ${template.movement.cardio || "Žiadne"}
Prechádzka benefit (použi tento): ${template.movement.walkBenefits[walkBenefitIndex]}

ÚLOHA:
Formátuj do 4 sekcií pomocou presného textu z master template. Žiadne nové fakty!`;

    // Call Lovable AI with tool calling for structured output
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
        tools: [{
          type: 'function',
          function: {
            name: 'generate_daily_plan',
            description: 'Vygeneruje personalizovaný denný plán pre jeden deň cyklu',
            parameters: {
              type: 'object',
              properties: {
                expectation: {
                  type: 'string',
                  description: 'Čo môžem dnes očakávať? (1-2 vety, hormonálny kontext)'
                },
                nutrition: {
                  type: 'string',
                  description: 'Strava: 3 odseky (živiny, potraviny, tip)'
                },
                mind: {
                  type: 'string',
                  description: 'Myseľ: 4 odseky (insight, návyk, benefit, myšlienka) max 90 slov'
                },
                movement: {
                  type: 'string',
                  description: 'Pohyb: 5 odsekov (hormonálny kontext, intenzita, NeoMe, kardio, prechádzka)'
                }
              },
              required: ['expectation', 'nutrition', 'mind', 'movement']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'generate_daily_plan' } },
        temperature: 0.7
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call received from AI');
    }

    const generatedContent = JSON.parse(toolCall.function.arguments);
    console.log(`Generated tips for day ${day}:`, generatedContent);

    // Delete existing tips if regenerate = true
    if (regenerate) {
      const { error: deleteError } = await supabase
        .from('cycle_tips')
        .delete()
        .eq('day', day);
      
      if (deleteError) {
        console.error('Error deleting old tips:', deleteError);
      }
    }

    // Insert new tip into database
    const { data: insertData, error: insertError } = await supabase
      .from('cycle_tips')
      .insert({
        day,
        phase,
        subphase,
        expectation_text: generatedContent.expectation,
        nutrition_text: generatedContent.nutrition,
        mind_text: generatedContent.mind,
        movement_text: generatedContent.movement,
        category: 'daily_plan',
        tip_text: `Day ${day} plan`,
        is_approved: false,
        created_by: 'ai'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting tips:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        day,
        phase,
        subphase,
        tips: insertData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-cycle-tips:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});