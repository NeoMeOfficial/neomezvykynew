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
    const { day, regenerate = false, cycleLength = 28 } = await req.json();

    console.log(`📍 Generating day ${day}, regenerate: ${regenerate}, cycleLength: ${cycleLength}`);

    if (!day || day < 1 || day > cycleLength || cycleLength < 25 || cycleLength > 35) {
      throw new Error(`Invalid input. Day must be 1-${cycleLength}, cycle length must be 25-35.`);
    }

    // Dynamic phase calculation for different cycle lengths (25-35 days)
    const calculatePhaseRanges = (cycleLength: number) => {
      // Menstrual phase: always days 1-5
      const menstrualEnd = 5;
      
      // Luteal phase: typically 12-14 days before next period
      const lutealLength = Math.round(cycleLength * 0.43); // ~43% of cycle (12-15 days for 28-35 day cycles)
      const lutealStart = cycleLength - lutealLength + 1;
      
      // Ovulation: typically 3 days in the middle
      const ovulationLength = 3;
      const ovulationStart = Math.round((menstrualEnd + lutealStart) / 2) - 1;
      const ovulationEnd = ovulationStart + ovulationLength - 1;
      
      // Follicular: from end of menstrual to start of ovulation
      const follicularStart = menstrualEnd + 1;
      const follicularEnd = ovulationStart - 1;
      
      // Luteal subphases
      const lutealEarlyEnd = lutealStart + Math.round(lutealLength * 0.31) - 1; // ~31% of luteal
      const lutealMidEnd = lutealStart + Math.round(lutealLength * 0.69) - 1;   // ~69% of luteal
      
      return {
        menstrual: { start: 1, end: menstrualEnd },
        follicular: { start: follicularStart, end: follicularEnd },
        ovulation: { start: ovulationStart, end: ovulationEnd },
        lutealEarly: { start: lutealStart, end: lutealEarlyEnd },
        lutealMid: { start: lutealEarlyEnd + 1, end: lutealMidEnd },
        lutealLate: { start: lutealMidEnd + 1, end: cycleLength }
      };
    };

    // Updated getPhaseInfo to accept cycle length
    const getPhaseInfoDynamic = (d: number, cycleLength: number) => {
      const ranges = calculatePhaseRanges(cycleLength);
      
      if (d >= ranges.menstrual.start && d <= ranges.menstrual.end) 
        return { phase: 'menstrual', subphase: null };
      if (d >= ranges.follicular.start && d <= ranges.follicular.end) 
        return { phase: 'follicular', subphase: null };
      if (d >= ranges.ovulation.start && d <= ranges.ovulation.end) 
        return { phase: 'ovulation', subphase: null };
      if (d >= ranges.lutealEarly.start && d <= ranges.lutealEarly.end) 
        return { phase: 'luteal', subphase: 'early' };
      if (d >= ranges.lutealMid.start && d <= ranges.lutealMid.end) 
        return { phase: 'luteal', subphase: 'mid' };
      if (d >= ranges.lutealLate.start && d <= ranges.lutealLate.end) 
        return { phase: 'luteal', subphase: 'late' };
        
      return { phase: 'menstrual', subphase: null }; // fallback
    };

    // Dynamic cardio recommendation based on cycle length
    const getCardioRecommendation = (day: number, cycleLength: number): string | null => {
      const ranges = calculatePhaseRanges(cycleLength);
      
      // Helper: get "every 3rd day" within a phase
      const isCardioDay = (day: number, phaseStart: number, phaseEnd: number, interval: number = 3): boolean => {
        const dayInPhase = day - phaseStart + 1;
        return dayInPhase % interval === 1; // 1st, 4th, 7th, etc.
      };
      
      // Follicular phase: every 3rd day (e.g., day 6, 9, 12 for 28-day cycle)
      if (day >= ranges.follicular.start && day <= ranges.follicular.end) {
        if (isCardioDay(day, ranges.follicular.start, ranges.follicular.end)) {
          return "Dnes by mal byť dobrý deň na 20-30 minút intervalového kardia (1 minútu rýchlo, 1 minútu voľne). Vyber si, čo ti vyhovuje - beh, bicykel, švihadlo alebo eliptický trenažér.";
        }
      }
      
      // Ovulation phase: last day of ovulation only (to maintain 3-day gap from follicular)
      if (day === ranges.ovulation.end) {
        return "Dnes by mal byť ideálny deň pre intervalové kardio - skús 20-30 minút v pomere 2:1 alebo 4:3 (2 minúty naplno, 1 minúta vydychové tempo, alebo 4 minúty naplno, 3 minúty vydychové tempo). Vyber si beh, bicykel, švihadlo alebo eliptický trenažér.";
      }
      
      // Early Luteal phase: 3rd day after ovulation end
      const earlyLutealCardioDay = ranges.ovulation.end + 3;
      if (day === earlyLutealCardioDay && day <= ranges.lutealEarly.end) {
        return "Môžeš ešte zaradiť intervalový tréning, ale počúvaj svoje telo - 20-30 minút v pomere 1:1. Skús beh, bicykel, švihadlo alebo eliptický trenažér.";
      }
      
      // Mid Luteal phase: every 3rd day (e.g., day 21, 24 for 28-day cycle)
      if (day >= ranges.lutealMid.start && day <= ranges.lutealMid.end) {
        if (isCardioDay(day, ranges.lutealMid.start, ranges.lutealMid.end)) {
          return "Dnes môžeš skúsiť 20-30 minút steady kardia v rovnakom tempe, bez intervalov. Vyber si beh, bicykel alebo eliptický trenažér.";
        }
      }
      
      return null; // no cardio for menstrual, late luteal, and non-cardio days
    };

    const { phase, subphase } = getPhaseInfoDynamic(day, cycleLength);

    // MASTER TEMPLATES - UPDATED with new content and softer language
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
          tip: "Dopraj si kombinovať železo s vitamínom C pre lepšiu vstrebateľnosť. Teplé jedlá ti uľahčia trávenie."
        },
        mind: {
          practicalThoughts: [
            "Dnes si dovoľ urobiť menej. Aj ticho a oddych sú súčasť regenerácie.",
            "Tvoje telo pracuje naplno, aj keď ty odpočívaš – dopraj mu pokoj.",
            "Ak sa cítiš preťažená, vyber si jednu vec, ktorú dnes neurobíš.",
            "Skús si večer dať teplý kúpeľ alebo sprchu – pomôže ti uvoľniť napätie v bruchu.",
            "Namiesto plánovania sa len pýtaj: čo teraz naozaj potrebujem?"
          ]
        },
        movement: {
          context: "Nízka energia, citlivé telo.",
          intensity: "Strečing alebo jemný pilates",
          neome: "Strečing pre panvu a spodný chrbát",
          walkBenefits: [
            "Prechádzka ti pomôže uvoľniť napätie, ktoré sa ti hromadilo celý deň.",
            "Znížiš stres, ktorý možno pociťuješ.",
            "Vyčistíš si hlavu od nekonečných myšlienok.",
            "Zlepšíš náladu vďaka prirodzenému dopamínu.",
            "Krátka chôdza ťa vráti späť „do tela", nie do úloh.",
            "Pomôže ti mať kvalitnejší spánok — aj keď máš milión vecí v hlave.",
            "Uvoľníš stuhnuté svaly.",
            "Vyrovnáš si hormóny a upokojíš nervový systém."
          ]
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
          tip: "Dopraj si dostatok bielkovin (25-30g) do každého jedla a jedz pravidelne každé 3-4 hodiny, aby si udržala stabilnú hladinu energie."
        },
        mind: {
          practicalThoughts: [
            "Využi energiu na veci, ktoré si dlhšie odkladala.",
            "Skús si dnes napísať jeden malý cieľ, ktorý ti spraví radosť – nie povinnosť.",
            "Počas tejto fázy sa učíš rýchlejšie – využi to, ak sa chceš niečo nové naučiť.",
            "Urob si priestor na plánovanie – napíš si, čo chceš tento mesiac skúsiť.",
            "Skús ísť von s kamarátkou alebo na krátku kávu – spoločnosť ti teraz robí dobre.",
            "Tvoje telo zvláda viac – ale netreba ísť na maximum. Drž rovnováhu.",
            "Ak cítiš chuť niečo zmeniť, začni drobnosťou – nový recept, nový tréning, nový playlist."
          ]
        },
        movement: {
          context: "Vysoká energia, telo zvláda záťaž.",
          intensity: "Silový tréning",
          neome: "Silový tréning",
          walkBenefits: [
            "Získaš nápady, ktoré v sede neprichádzajú.",
            "Zlepšíš náladu vďaka prirodzenému dopamínu.",
            "Dodáš telu energiu namiesto ďalšej kávy.",
            "Podporíš spaľovanie tukov aj bez cvičenia.",
            "Zlepšíš cirkuláciu krvi a kyslík v mozgu.",
            "Stabilizuješ si hladinu cukru v krvi po jedle.",
            "Krátka prechádzka mení náladu na celý deň.",
            "Cítiš sa viac pod kontrolou — aj keď je deň chaos."
          ]
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
          tip: "Dopraj si ľahšie jedlá pre vyššiu energiu. Pravidelné jedlá s dôrazom na bielkoviny (25-30g)."
        },
        mind: {
          practicalThoughts: [
            "Dnes sa ti bude dariť hovoriť jasne – využi to pri rozhovoroch či v práci.",
            "Skús niekomu úprimne poďakovať alebo niečo pekné povedať – vráti sa ti to.",
            "Si v najlepšej fáze na networking, prezentácie či ťažšie rozhovory – ver si.",
            "Ak máš veľa energie, dopraj si niečo, čo ťa nabíja – tanec, beh, pohyb s radosťou.",
            "Dnes si ľahšie všimneš, čo ti funguje – napíš si to, využiješ to neskôr.",
            "Ak cítiš tlak, spomaľ. Energia smeruje von, ale potrebuje aj priestor na doplnenie."
          ]
        },
        movement: {
          context: "Peak výkonnosť, maximálna sila.",
          intensity: "Silový tréning",
          neome: "Intenzívny silový tréning",
          walkBenefits: [
            "Získaš nápady, ktoré v sede neprichádzajú.",
            "Zlepšíš náladu vďaka prirodzenému dopamínu.",
            "Zlepšíš cirkuláciu krvi a kyslík v mozgu.",
            "Pomôže ti mať kvalitnejší spánok — aj keď máš milión vecí v hlave.",
            "Získaš chvíľu len pre seba.",
            "Nabiješ sa vitamínom D."
          ]
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
          tip: "Dopraj si pravidelné jedlá (hlavne raňajky). Bielkoviny + vláknina (25-30g fiber denne). Obmedziť kávu."
        },
        mind: {
          practicalThoughts: [
            "Ak cítiš podráždenie, nie si zlá – len tvoje telo potrebuje viac pokoja.",
            "Dnes si urči jasnú hranicu – napríklad „po ôsmej už neodpovedám na správy".",
            "Vyčisti si hlavu aj priestor – upratovanie pôsobí ako terapia.",
            "Ak sa cítiš unavená, vyber si najdôležitejšiu vec dňa a ostatné nechaj tak.",
            "Tvoje telo reaguje citlivejšie – skús si dopriať pokojnejšie prostredie."
          ]
        },
        movement: {
          context: "Dobrá energia, ale citlivejšie telo.",
          intensity: "Silový tréning",
          neome: "Silový tréning",
          walkBenefits: [
            "Prechádzka ti pomôže uvoľniť napätie, ktoré sa ti hromadilo celý deň.",
            "Znížiš stres, ktorý možno pociťuješ.",
            "Pomôže ti mať kvalitnejší spánok — aj keď máš milión vecí v hlave.",
            "Vyrovnáš si hormóny a upokojíš nervový systém.",
            "Po prechádzke máš viac trpezlivosti — pre seba aj pre deti."
          ]
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
          tip: "Dopraj si pravidelné jedlá, menej cukru, teplé tekutiny, zázvorový čaj."
        },
        mind: {
          practicalThoughts: [
            "Ak máš chuť všetko „zachraňovať", zastav sa – nie všetko je tvoja úloha.",
            "Skús si zapisovať, čo ti robí dobre a čo nie – pomôže ti to pri ďalšom cykle.",
            "Ak cítiš tlak, urob si 5 minút len pre seba – dýchaj pomaly a hlboko.",
            "Pripomeň si, že nie všetky dni musia byť produktívne. Niektoré majú byť pokojné.",
            "Ak cítiš podráždenie, nie si zlá – len tvoje telo potrebuje viac pokoja."
          ]
        },
        movement: {
          context: "Nižšia energia, citlivé telo.",
          intensity: "Pilates alebo mierny silový tréning",
          neome: "Pilates alebo mierny silový tréning",
          walkBenefits: [
            "Prechádzka ti pomôže uvoľniť napätie, ktoré sa ti hromadilo celý deň.",
            "Znížiš stres, ktorý možno pociťuješ.",
            "Znížiš chuť na sladké.",
            "Stabilizuješ si hladinu cukru v krvi po jedle.",
            "Vyrovnáš si hormóny a upokojíš nervový systém.",
            "Dostaneš sa do prítomnosti a spomalíš.",
            "Myseľ sa upokojí, keď sa pohne telo."
          ]
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
          tip: "Dopraj si teplé jedlá, pravidelné porcie, menej kofeínu a cukru, viac horčíka."
        },
        mind: {
          practicalThoughts: [
            "Dnes si dovoľ urobiť menej. Aj ticho a oddych sú súčasť regenerácie.",
            "Ak sa cítiš unavená, vyber si najdôležitejšiu vec dňa a ostatné nechaj tak.",
            "Deň na vďačnosť – napíš si tri veci, ktoré sa ti tento mesiac podarili, aj malé.",
            "Pripomeň si, že nie všetky dni musia byť produktívne. Niektoré majú byť pokojné.",
            "Ak cítiš tlak, urob si 5 minút len pre seba – dýchaj pomaly a hlboko."
          ]
        },
        movement: {
          context: "Nízka energia, PMS symptómy.",
          intensity: "Strečing alebo jemný pilates",
          neome: "Strečing alebo meditácia",
          walkBenefits: [
            "Prechádzka ti pomôže uvoľniť napätie, ktoré sa ti hromadilo celý deň.",
            "Znížiš stres, ktorý možno pociťuješ.",
            "Vyčistíš si hlavu od nekonečných myšlienok.",
            "Krátka chôdza ťa vráti späť „do tela", nie do úloh.",
            "Znížiš chuť na sladké.",
            "Uvoľníš stuhnuté svaly.",
            "Vyrovnáš si hormóny a upokojíš nervový systém.",
            "Po prechádzke máš viac trpezlivosti — pre seba aj pre deti."
          ]
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
    const thoughtIndex = day % template.mind.practicalThoughts.length;

    // System prompt - AI is FORMATTER with softer language and bullet points
    const systemPrompt = `Si expert na ženské zdravie a menštruačný cyklus. Tvorcom personalizovaných denných plánov pre ženy vo veku 25-45 rokov, väčšinou mamy.

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

KONDICIONÁLNY A SOFTER TÓN:
- Používaj: "by si mala", "pravdepodobne budeš", "môžeš pociťovať"
- NIE direktívne: "máš", "cítiš", "je"
- Soft odporúčania: "vyskúšaj si dopriať", "skús si", "môžeš skúsiť"
- NIE príkazy: "Odporúčame ti", "Zaraď", "Urob"
- Praktické tipy: "dopraj si" namiesto "Zaraď"

PREPOJENIE SEKCIÍ:
- Všetky 4 sekcie musia byť logicky prepojené
- Ak v "Expectation" hovoríš o nízkej energii → v "Movement" odkazuj na tento kontext ("Vzhľadom na nízku energiu...")
- Zabezpeč konzistenciu energie, hormónov a emócií naprieč sekciami

FORMÁTOVANIE - BULLET POINTS:
- Sekcia STRAVA: 4 odrážky (začni každú "- ")
  1. Potreby tela (prepojené s expectation)
  2. Konkrétne potraviny (6 vybraných)
  3. Živiny, ktoré dodávajú
  4. Praktický tip (začni: "Dopraj si...")
  
- Sekcia POHYB: 4-5 odrážok (začni každú "- ")
  1. Hormonálny kontext (prepojený s expectation)
  2. Odporúčanie typu cvičenia (BEZ časových údajov, použij: "vyskúšaj si dopriať")
  3. Neome tip: "Ak nemáš veľa času alebo chceš čas ušetriť, vyskúšaj 15min cvičenia od Neome."
  4. Kardio odporúčanie (ak je pre daný deň)
  5. Prechádzka: "Skús si aj dnes dopriať prechádzku. Dopraj si aspoň 30-60min na čerstvom vzduchu. [benefit]"

PRAVIDLÁ:
1. Použi PRESNÝ text z master template
2. Vyber z poskytnutých zoznamov (potraviny, benefity, myšlienky)
3. Žiadne vymýšľanie nových faktov alebo informácií
4. Len gramatické úpravy pre plynulosť

ZDROJE (overené):
- Dr. Mary Claire Haver (menopause & hormonal health)
- Dr. Vonda Wright (longevity & orthopaedics)  
- Dr. Natalie Crawford (fertility & cycle health)
- Dr. Stacy Sims (female physiology & performance)`;

    const cardioText = getCardioRecommendation(day, cycleLength);

    const userPrompt = `Vytvor obsah pre DEŇ ${day} v ${phase}${subphase ? ` (${subphase})` : ''} fáze (celková dĺžka cyklu: ${cycleLength} dní).

MASTER TEMPLATE - REFERENCIA (použij obsah, nie štruktúru):
Hormóny: ${template.hormones}
Očakávanie: ${template.expectation}
Telo: ${template.body}
Emócie: ${template.emotional}

STRAVA - REFERENCIA:
Potreby: ${template.nutrition.needs.join(', ')}
Kľúčové živiny: ${template.nutrition.keyNutrients.join(', ')}
Vyber 6 RÔZNYCH potravín z tohto zoznamu: ${template.nutrition.foods.join(', ')}
Tip: ${template.nutrition.tip}

MYSEĽ - REFERENCIA:
Praktická myšlienka (použi presne túto): ${template.mind.practicalThoughts[thoughtIndex]}

FORMÁT VÝSTUPU PRE MYSEĽ:
Len táto praktická myšlienka ako 1-2 plynulé odseky, bez doplnkov, bez dychových techník, bez afirmácií. Max 60 slov.

POHYB - REFERENCIA:
Hormonálny kontext (prepoj s expectation): ${template.movement.context}
Typ cvičenia: ${template.movement.intensity}
NeoMe odporúčanie: Ak nemáš veľa času alebo chceš čas ušetriť, vyskúšaj 15min cvičenia od Neome.
Kardio (ak je): ${cardioText || "Dnes nie je kardio deň"}
Prechádzka: Skús si aj dnes dopriať prechádzku. Dopraj si aspoň 30-60min na čerstvom vzduchu. ${template.movement.walkBenefits[walkBenefitIndex]}

FORMÁT VÝSTUPU PRE POHYB (SOFT jazyk, 4-5 odrážok):
❌ NIKDY: "S rastúcou hladinou estrogénu máš teraz vysokú energiu..."
✅ VŽDY: "S rastúcou hladinou estrogénu by si mala pociťovať teraz väčšiu energiu..."

❌ NIKDY: "Odporúčame ti silový tréning."
✅ VŽDY: "Vyskúšaj si dnes dopriať silový tréning."

Príklad výstupu:
- S rastúcou hladinou estrogénu by si mala pociťovať teraz väčšiu energiu a tvoje telo by malo lepšie zvládať fyzickú záťaž.
- Vyskúšaj si dnes dopriať silový tréning.
- Ak nemáš veľa času alebo chceš čas ušetriť, vyskúšaj 15min cvičenia od Neome.
- [Kardio odporúčanie - ak je]
- Skús si aj dnes dopriať prechádzku. Dopraj si aspoň 30-60min na čerstvom vzduchu. [benefit]

PRÍKLAD VÝSTUPU:
expectation: "V týchto dňoch by si mala cítiť nižšiu energiu a rýchlejšie vyčerpanie, pretože estrogén aj progesterón sú nízko."

nutrition (4 odrážky):
- Tvoje telo teraz potrebuje znížiť zápal, doplniť železo a podporiť trávenie teplými jedlami.
- Skús do jedálnička zaradiť vajcia, špenát, jahody, losos, quinoa a kurkumu.
- Tieto potraviny ti dodajú železo, vitamín C a omega-3 mastné kyseliny.
- Dopraj si kombinovať železo s vitamínom C pre lepšiu vstrebateľnosť. Teplé jedlá ti uľahčia trávenie.

mind (1-2 odseky):
"Dnes si dovoľ urobiť menej. Aj ticho a oddych sú súčasť regenerácie."

movement (4-5 odrážok):
- Vzhľadom na nízku energiu a citlivé telo by si sa mala dnes zamerať na jemný pohyb.
- Vyskúšaj si dopriať strečing alebo jemný pilates.
- Ak nemáš veľa času alebo chceš čas ušetriť, vyskúšaj 15min cvičenia od Neome.
- Skús si aj dnes dopriať prechádzku. Dopraj si aspoň 30-60min na čerstvom vzduchu. Uvoľníš stuhnuté svaly.`;

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
                  description: 'Čo môžem dnes očakávať? 1-2 vety v SOFTER tóne: "by si mala cítiť", "pravdepodobne budeš", "môžeš pociťovať". Prepoj s hormónmi ("pretože estrogén..."). Čistý text bez markdown.'
                },
                nutrition: {
                  type: 'string',
                  description: 'Strava ako 4 odrážky (začni každú "- "). SOFT jazyk: "Dopraj si...". Prepoj prvú odrážku s expectation. Odrážky: (1) potreby tela, (2) 6 potravín, (3) živiny, (4) praktický tip. Čistý text bez markdown.'
                },
                mind: {
                  type: 'string',
                  description: 'Myseľ ako 1-2 plynulé odseky s praktickou myšlienkou/habitom. Použi PRESNE text z practicalThoughts. Max 60 slov. Čistý text bez markdown.'
                },
                movement: {
                  type: 'string',
                  description: 'Pohyb ako 4-5 odrážok (začni každú "- "). SOFT jazyk: "by si mala pociťovať", "vyskúšaj si dopriať". Prepoj prvú odrážku s expectation. Odrážky: (1) hormonálny kontext, (2) typ cvičenia BEZ časov, (3) Neome tip, (4) kardio ak je, (5) prechádzka s benefitom. Čistý text bez markdown.'
                }
              },
              required: ['expectation', 'nutrition', 'mind', 'movement']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'generate_daily_plan' } }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ Lovable AI error:', aiResponse.status, errorText);
      throw new Error(`Lovable AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      console.error('❌ No tool call in response:', JSON.stringify(aiData, null, 2));
      throw new Error('No tool call returned from AI');
    }

    const generatedContent = JSON.parse(toolCall.function.arguments);

    console.log(`✨ Generated content for day ${day}:`, {
      expectation: generatedContent.expectation.substring(0, 50) + '...',
      nutrition: generatedContent.nutrition.substring(0, 50) + '...',
      mind: generatedContent.mind.substring(0, 50) + '...',
      movement: generatedContent.movement.substring(0, 50) + '...'
    });

    // Delete existing plan if regenerating
    if (regenerate) {
      console.log(`🗑️ Deleting existing plan for day ${day}...`);
      const { error: deleteError } = await supabase
        .from('cycle_tips')
        .delete()
        .eq('day', day)
        .eq('cycle_length', cycleLength)
        .eq('category', 'daily_plan');

      if (deleteError) {
        console.error('Delete error:', deleteError);
      } else {
        console.log(`✅ Old plan deleted for day ${day}`);
      }
    }

    // Insert the generated plan
    console.log(`💾 Inserting plan for day ${day} into database...`);
    const { error: insertError } = await supabase
      .from('cycle_tips')
      .insert({
        day,
        phase,
        subphase,
        cycle_length: cycleLength,
        expectation_text: generatedContent.expectation,
        nutrition_text: generatedContent.nutrition,
        mind_text: generatedContent.mind,
        movement_text: generatedContent.movement,
        category: 'daily_plan',
        tip_text: '', // legacy field
        is_approved: false,
        created_by: 'ai'
      });

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      throw insertError;
    }

    console.log(`✅ Day ${day} plan successfully saved to database`);

    return new Response(
      JSON.stringify({
        success: true,
        day,
        phase,
        subphase,
        cycleLength,
        content: generatedContent
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