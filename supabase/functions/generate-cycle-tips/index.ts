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
    const { day, regenerate = false, cycleLength = 28, periodLength = 5 } = await req.json();

    console.log(`📍 Generating day ${day}, regenerate: ${regenerate}, cycleLength: ${cycleLength}, periodLength: ${periodLength}`);

    if (!day || day < 1 || day > cycleLength || cycleLength < 25 || cycleLength > 35) {
      throw new Error(`Invalid input. Day must be 1-${cycleLength}, cycle length must be 25-35.`);
    }

    if (periodLength < 2 || periodLength > 8) {
      throw new Error('Period length must be 2-8 days.');
    }

    // Universal segment splitter for dynamic subphase calculation
    function split_segment(
      len: number,
      pct: [number, number, number],
      min: [number, number, number],
      prefer: 'MID' | 'FIRST' = 'MID'
    ): [number, number, number] {
      let r1 = Math.floor(len * pct[0]);
      let r2 = Math.floor(len * pct[1]);
      let r3 = len - r1 - r2;

      let a1 = Math.max(r1, min[0]);
      let a2 = Math.max(r2, min[1]);
      let a3 = Math.max(r3, min[2]);

      let sum = a1 + a2 + a3;

      if (sum > len) {
        const order = prefer === 'MID' ? [1, 0, 2] : [0, 1, 2];
        let remaining = sum - len;
        
        for (const i of order) {
          const arr = [a1, a2, a3];
          const take = Math.min(remaining, arr[i] - min[i]);
          if (i === 0) a1 -= take;
          else if (i === 1) a2 -= take;
          else a3 -= take;
          remaining -= take;
          if (remaining === 0) break;
        }
      } else if (sum < len) {
        a2 += (len - sum);
      }

      return [a1, a2, a3];
    }

    // Dynamic phase calculation for different cycle lengths (25-35 days) and period lengths (2-8 days)
    const calculatePhaseRanges = (cycleLength: number, periodLength: number, lutealLength: number = 14) => {
      const ovulation_day = cycleLength - lutealLength;

      // Basic phases
      const M_start = 1;
      const M_end = periodLength;
      const F_disp_start = periodLength + 1;
      const F_disp_end = ovulation_day - 1;
      const O_day = ovulation_day;
      const L_start = ovulation_day + 1;
      const L_end = cycleLength;

      // Lengths
      const M_len = M_end - M_start + 1;
      const F_disp_len = Math.max(0, F_disp_end - F_disp_start + 1);
      const L_len = L_end - L_start + 1;

      // --- MENSTRUAL SUBPHASES ---
      let M_early = 0, M_mid = 0, M_late = 0;
      if (M_len >= 3) {
        [M_early, M_mid, M_late] = split_segment(M_len, [0.40, 0.35, 0.25], [2, 1, 1], 'MID');
      } else {
        M_early = M_len;
      }

      // --- FOLLICULAR SUBPHASES (displayed after menstruation) ---
      let F_trans = 0, F_mid = 0, F_late = 0;
      if (F_disp_len <= 0) {
        // No follicular display
      } else if (F_disp_len <= 8) {
        // 2 blocks: MID 70% | LATE 30%
        F_mid = Math.max(1, Math.floor(F_disp_len * 0.70));
        F_late = F_disp_len - F_mid;
        if (F_late === 0 && F_mid > 1) {
          F_mid -= 1;
          F_late += 1;
        }
      } else {
        // 3 blocks: TRANSITION 15% | MID 55% | LATE 30%
        F_trans = Math.max(1, Math.floor(F_disp_len * 0.15));
        F_mid = Math.max(3, Math.floor(F_disp_len * 0.55));
        F_late = F_disp_len - F_trans - F_mid;
        
        if (F_late < 2 && F_mid > 3) {
          const borrow = Math.min(2 - F_late, F_mid - 3);
          F_mid -= borrow;
          F_late += borrow;
        }
        if (F_late < 2 && F_trans > 1) {
          const borrow = Math.min(2 - F_late, F_trans - 1);
          F_trans -= borrow;
          F_late += borrow;
        }
      }

      // --- LUTEAL SUBPHASES ---
      const [L_early, L_mid, L_late] = split_segment(L_len, [0.35, 0.40, 0.25], [2, 2, 2], 'MID');

      // --- BUILD RANGES OBJECT ---
      const ranges: any = {
        menstrual: { start: M_start, end: M_end },
        ovulation: { start: O_day, end: O_day },
      };

      // Menstrual subphases
      let cursor = M_start;
      if (M_early > 0) {
        ranges.menstrualEarly = { start: cursor, end: cursor + M_early - 1 };
        cursor += M_early;
      }
      if (M_mid > 0) {
        ranges.menstrualMid = { start: cursor, end: cursor + M_mid - 1 };
        cursor += M_mid;
      }
      if (M_late > 0) {
        ranges.menstrualLate = { start: cursor, end: cursor + M_late - 1 };
      }

      // Follicular subphases (displayed after menstruation)
      if (F_disp_len > 0) {
        ranges.follicular = { start: F_disp_start, end: F_disp_end };
        cursor = F_disp_start;
        
        if (F_trans > 0) {
          ranges.follicularTransition = { start: cursor, end: cursor + F_trans - 1 };
          cursor += F_trans;
        }
        if (F_mid > 0) {
          ranges.follicularMid = { start: cursor, end: cursor + F_mid - 1 };
          cursor += F_mid;
        }
        if (F_late > 0) {
          ranges.follicularLate = { start: cursor, end: cursor + F_late - 1 };
        }
      }

      // Luteal subphases
      ranges.luteal = { start: L_start, end: L_end };
      cursor = L_start;
      ranges.lutealEarly = { start: cursor, end: cursor + L_early - 1 };
      cursor += L_early;
      ranges.lutealMid = { start: cursor, end: cursor + L_mid - 1 };
      cursor += L_mid;
      ranges.lutealLate = { start: cursor, end: cursor + L_late - 1 };

      return ranges;
    };

    // Get detailed context about a day's position within its phase
    interface PhaseContext {
      phase: string;
      subphase: string | null;
      dayInPhase: number;
      totalDaysInPhase: number;
      relativePosition: string;
      description: string;
      dayWithinSubphase: number; // VARIANT B: absolútny deň od dňa 1 cyklu
      totalDaysInSubphase: number;
      subfazaStart: number; // potrebné pre rotáciu variantov
    }

    const getPhaseContext = (day: number, cycleLength: number, periodLength: number): PhaseContext => {
      const ranges = calculatePhaseRanges(cycleLength, periodLength);
      
      let phase = '';
      let subphase: string | null = null;
      let phaseStart = 1;
      let phaseEnd = 1;
      let phaseNameSk = '';

      // Detect phase + subphase from ranges
      if (day >= ranges.menstrual.start && day <= ranges.menstrual.end) {
        phase = 'menstrual';
        if (ranges.menstrualEarly && day >= ranges.menstrualEarly.start && day <= ranges.menstrualEarly.end) {
          subphase = 'early';
          phaseStart = ranges.menstrualEarly.start;
          phaseEnd = ranges.menstrualEarly.end;
          phaseNameSk = 'začiatku menštruačnej';
        } else if (ranges.menstrualMid && day >= ranges.menstrualMid.start && day <= ranges.menstrualMid.end) {
          subphase = 'mid';
          phaseStart = ranges.menstrualMid.start;
          phaseEnd = ranges.menstrualMid.end;
          phaseNameSk = 'stredu menštruačnej';
        } else if (ranges.menstrualLate && day >= ranges.menstrualLate.start && day <= ranges.menstrualLate.end) {
          subphase = 'late';
          phaseStart = ranges.menstrualLate.start;
          phaseEnd = ranges.menstrualLate.end;
          phaseNameSk = 'konca menštruačnej';
        }
      } else if (ranges.follicular && day >= ranges.follicular.start && day <= ranges.follicular.end) {
        phase = 'follicular';
        if (ranges.follicularTransition && day >= ranges.follicularTransition.start && day <= ranges.follicularTransition.end) {
          subphase = 'transition';
          phaseStart = ranges.follicularTransition.start;
          phaseEnd = ranges.follicularTransition.end;
          phaseNameSk = 'stredu folikulárnej';
        } else if (ranges.follicularMid && day >= ranges.follicularMid.start && day <= ranges.follicularMid.end) {
          subphase = 'mid';
          phaseStart = ranges.follicularMid.start;
          phaseEnd = ranges.follicularMid.end;
          phaseNameSk = 'stredu folikulárnej';
        } else if (ranges.follicularLate && day >= ranges.follicularLate.start && day <= ranges.follicularLate.end) {
          subphase = 'late';
          phaseStart = ranges.follicularLate.start;
          phaseEnd = ranges.follicularLate.end;
          phaseNameSk = 'konca folikulárnej';
        }
      } else if (day === ranges.ovulation.start) {
        phase = 'ovulation';
        subphase = 'peak';
        phaseStart = ranges.ovulation.start;
        phaseEnd = ranges.ovulation.end;
        phaseNameSk = 'ovulácie';
      } else if (day >= ranges.lutealEarly.start && day <= ranges.lutealEarly.end) {
        phase = 'luteal';
        subphase = 'early';
        phaseStart = ranges.lutealEarly.start;
        phaseEnd = ranges.lutealEarly.end;
        phaseNameSk = 'začiatku luteálnej';
      } else if (day >= ranges.lutealMid.start && day <= ranges.lutealMid.end) {
        phase = 'luteal';
        subphase = 'mid';
        phaseStart = ranges.lutealMid.start;
        phaseEnd = ranges.lutealMid.end;
        phaseNameSk = 'stredu luteálnej';
      } else if (day >= ranges.lutealLate.start && day <= ranges.lutealLate.end) {
        phase = 'luteal';
        subphase = 'late';
        phaseStart = ranges.lutealLate.start;
        phaseEnd = ranges.lutealLate.end;
        phaseNameSk = 'konca luteálnej';
      }

      const dayInPhase = day - phaseStart + 1;
      const totalDaysInPhase = phaseEnd - phaseStart + 1;
      const relativePosition = subphase || 'peak';
      const description = phaseNameSk.charAt(0).toUpperCase() + phaseNameSk.slice(1) + ' fázy';

      return {
        phase,
        subphase,
        dayInPhase,
        totalDaysInPhase,
        relativePosition,
        description,
        dayWithinSubphase: day, // VARIANT B: absolútny deň od začiatku cyklu
        totalDaysInSubphase: totalDaysInPhase,
        subfazaStart: phaseStart // potrebné pre rotáciu variantov
      };
    };

    // Updated getPhaseInfo to accept cycle length and period length
    const getPhaseInfoDynamic = (d: number, cycleLength: number, periodLength: number) => {
      const ranges = calculatePhaseRanges(cycleLength, periodLength);
      
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
    const getCardioRecommendation = (day: number, cycleLength: number, periodLength: number): string | null => {
      const ranges = calculatePhaseRanges(cycleLength, periodLength);
      
      // Helper: get "every 3rd day" within a phase
      const isCardioDay = (day: number, phaseStart: number, phaseEnd: number, interval: number = 3): boolean => {
        const dayInPhase = day - phaseStart + 1;
        return dayInPhase % interval === 1; // 1st, 4th, 7th, etc.
      };
      
      // Follicular phase: every 3rd day (e.g., day 6, 9, 12 for 28-day cycle)
      if (day >= ranges.follicular.start && day <= ranges.follicular.end) {
        if (isCardioDay(day, ranges.follicular.start, ranges.follicular.end)) {
          return "Dnes by mal byť dobrý deň na 20-30 minút intervalového kardia (1 minútu rýchlo, 1 minúta voľne). Vyber si, čo ti vyhovuje - beh, bicykel, švihadlo alebo eliptický trenažér.";
        }
      }
      
      // Ovulation phase: the single ovulation day (to maintain 3-day gap from follicular)
      if (day === ranges.ovulation.start) {
        return "Dnes by mal byť ideálny deň pre intervalové kardio - skús 20-30 minút v pomere 2:1 alebo 4:3 (2 minúty naplno, 1 minúta vydychové tempo, alebo 4 minúty naplno, 3 minúty vydychové tempo). Vyber si beh, bicykel, švihadlo alebo eliptický trenažér.";
      }
      
      // Early Luteal phase: 3rd day after ovulation
      const earlyLutealCardioDay = ranges.ovulation.start + 3;
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

    const { phase, subphase } = getPhaseInfoDynamic(day, cycleLength, periodLength);
    const phaseContext = getPhaseContext(day, cycleLength, periodLength);

    // PHASE CONTEXT DESCRIPTIONS - replaces daySpecificExpectations[1-28]
    // These are base templates for each phase + relative position
    const phaseContextDescriptions: Record<string, Record<string, string>> = {
      menstrual: {
        začiatok: "V týchto dňoch sú tvoje hormóny pravdepodobne na najnižších úrovniach. Je bežné pociťovať kŕče, únavu a potrebu pokoja. Tvoje telo začína dôležitú obnovu a ak sa cítiš vyčerpaná, je to prirodzené.",
        stred: "Tvoje telo pravdepodobne intenzívne pracuje na obnovení a stráca krv aj minerály. Môžeš pociťovať väčšiu únavu a citlivosť. Dopraj si dostatok odpočinku a netlač sa do výkonu.",
        koniec: "Menštruácia sa ti pravdepodobne blíži ku koncu a estrogén začína pomaly stúpať. Môže to priniesť prvé náznaky energie a motivácie. Je to vhodný čas na plánovanie nasledujúcich dní a pomaly sa vrátiť k bežnému rytmu."
      },
      follicular: {
        začiatok: "Po ukončení menštruačnej fázy ti pravdepodobne hladina estrogénu naďalej stúpa a s ním často prichádza aj chuť tvoriť a byť aktívna. Telo sa prebúdza do ďalšej časti cyklu.",
        stred: "Toto je často jedna z najlepších fáz pre učenie a plánovanie. Telo v týchto dňoch zvyčajne rýchlejšie regeneruje a mozog môže byť viac zameraný na nové nápady a projekty.",
        koniec: "Telo sa v týchto dňoch pravdepodobne pripravuje na ovuláciu. Je možné pociťovať vysokú energiu, kreativitu a chuť spájať sa s ľuďmi. Toto je pre mnohé ženy vrchol produktivity v cykle."
      },
      ovulation: {
        stred: "Tvoj estrogén je pravdepodobne na svojom vrchole. Je možné, že budeš pociťovať zvýšenú energiu, charizmu a prirodzenú chuť komunikovať. Pre mnohé ženy je to ideálny čas na dôležité rozhovory, prezentácie alebo aktivity, ktoré vyžadujú sebavedomie."
      },
      lutealEarly: {
        začiatok: "V týchto dňoch tvoje telo pravdepodobne ukončuje ovuláciu. Progesterón ti bude v najbližších dňoch stúpať. Je možné cítiť prvé náznaky upokojenia – akoby sa tempo spomalilo. Zároveň v týchto dňoch často zostáva ešte dosť energie a sústredenia.",
        stred: "Stúpajúci progesterón môže prinášať pocit väčšej stability a pokoja. Je možné, že máš chuť dokončovať rozpracované veci alebo organizovať svoj priestor. Telo v týchto dňoch často ešte zvláda fungovať naplno.",
        koniec: "Toto je často obdobie harmónie. Energia môže byť stále dobrá, ale telo pravdepodobne prechádza do režimu pokoja a stability. Môžeš mať lepší spánok a pocit väčšej vyrovnanosti."
      },
      lutealMid: {
        začiatok: "V týchto dňoch môže byť energia stále na dobrej úrovni, ale telo často začína potrebovať viac pokoja a pravidelnosti. Je možné zaznamenať prvé náznaky spomalenia, čo je úplne prirodzené.",
        stred: "Progesterón je v týchto dňoch pravdepodobne na vrchole alebo sa k nemu blíži. Telo môže reagovať citlivejšie na stres, chaos či preťaženie. Je prirodzené, ak cítiš menší záujem o sociálny kontakt. Dopraj si pravidelnosť a jemnosť.",
        koniec: "Mozog je v týchto dňoch často menej orientovaný na rýchle reakcie a viac na vnútorný svet. Intuícia sa môže zlepšovať a telo pravdepodobne potrebuje viac priestoru. Pokoj v týchto dňoch má často prednosť pred výkonom."
      },
      lutealLate: {
        začiatok: "Progesterón môže spomaliť trávenie a spôsobiť nafukovanie. Tvoje telo v týchto dňoch pravdepodobne reaguje citlivejšie na chaotické podnety a potrebuje pravidelný rytmus a dostatok pokoja.",
        stred: "V týchto dňoch môže energia ubúdať rýchlejšie ako pred pár dňami. Je prirodzené cítiť väčšiu potrebu odpočinku a jasných hraníc. Telo v tomto období často potrebuje pravidelný rytmus a dostatok spánku.",
        koniec: "Tvoje hormóny sú pravdepodobne nízko a telo sa pripravuje na menštruáciu. Dopraj si kvalitný spánok a jemnosť. Čoskoro začína nový cyklus a telo sa opäť pripraví na ďalšiu obnovu."
      }
    };

    // Select the appropriate context description
    const getContextDescription = (phaseContext: PhaseContext): string => {
      const phaseKey = phaseContext.subphase 
        ? `${phaseContext.phase}${phaseContext.subphase.charAt(0).toUpperCase() + phaseContext.subphase.slice(1)}`
        : phaseContext.phase;
      
      const phaseDescriptions = phaseContextDescriptions[phaseKey];
      if (!phaseDescriptions) {
        // Fallback to menstrual if phase not found
        return phaseContextDescriptions.menstrual.začiatok;
      }

      return phaseDescriptions[phaseContext.relativePosition] || 
             phaseDescriptions.stred || 
             Object.values(phaseDescriptions)[0];
    };

    const selectedContextDescription = getContextDescription(phaseContext);

    // MASTER TEMPLATES - UPDATED with new content and softer language
    const masterTemplates: Record<string, any> = {
      'menstrual-early': {
        hormones: "Estrogén a progesterón sú na najnižšej úrovni",
        expectationVariants: [
          "Prvý deň menštruácie býva zvyčajne najnáročnejší – energia je nízka, môžeš pociťovať silnejšie kŕče a únavu. Telo teraz najviac potrebuje oddych a šetrný prístup. Je to úplne v poriadku nepodávať výkon, toto obdobie je o regenerácii a odpočinku.",
          
          "V týchto dňoch je prirodzené, že máš menej energie na sociálne kontakty. Ak ti vyhovuje menej rozhovorov a viac ticha, dopraj si to. Tvoje telo teraz pracuje na obnove a potrebuje šetriť sily.",
          
          "Môžeš pociťovať silnejšie kŕče v spodnej časti brucha alebo v drieku. Teplá fľaša, jemný strečing alebo teplý sprcha môžu pomôcť uvoľniť napätie. Počúvaj, čo ti teraz prináša úľavu."
        ],
        body: "začiatok krvácania, možné silné kŕče, únavnosť, citlivé brucho",
        emotional: "zvýšená citlivosť, introverzia, potreba pokoja",
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
            "Tvoje telo pracuje naplno, aj keď ty odpočívaš - dopraj mu pokoj.",
            "Ak sa cítiš preťažená, vyber si jednu vec, ktorú dnes neurobíš.",
            "Skús si večer dať teplý kúpeľ alebo sprchu - pomôže ti uvoľniť napätie v bruchu.",
            "Namiesto plánovania sa len pýtaj: čo teraz naozaj potrebujem?"
          ]
        },
        movement: {
          context: "Veľmi nízka energia, citlivé telo.",
          intensity: "Veľmi jemný strečing",
          neome: "Strečing pre panvu a spodný chrbát",
          walkBenefits: [
            "Prechádzka ti pomôže uvoľniť napätie, ktoré sa ti hromadilo celý deň.",
            "Znížiš stres, ktorý možno pociťuješ.",
            "Vyčistíš si hlavu od nekonečných myšlienok.",
            "Zlepšíš náladu vďaka prirodzenému dopamínu.",
            "Krátka chôdza ťa vráti späť \"do tela\", nie do úloh.",
            "Pomôže ti mať kvalitnejší spánok - aj keď máš milión vecí v hlave.",
            "Uvoľníš stuhnuté svaly.",
            "Vyrovnáš si hormóny a upokojíš nervový systém."
          ]
        }
      },
      'menstrual-mid': {
        hormones: "Estrogén a progesterón sú stále nízko",
        expectationVariants: [
          "Krvácanie pravdepodobne pokračuje, ale telo sa postupne ustáľuje. Kŕče môžu byť miernejšie ako prvý deň a energia sa môže mierne zlepšiť. Stále je dôležité si dopriať dostatok odpočinku a počúvať potreby tela.",
          
          "Ak sa cítiš trochu lepšie ako na začiatku menštruácie, je to dobrý signál. Niektoré ženy v týchto dňoch už zvládnu krátku prechádzku alebo jednoduchšie úlohy. Netlač sa ale do výkonu – telo ešte regeneruje.",
          
          "Môžeš si všimnúť, že si menej citlivá ako prvý deň. Nálada sa môže stabilizovať a hlava byť jasnejšia. To je prirodzený priebeh – hormóny sa postupne začínajú vyvažovať."
        ],
        body: "pokračujúce krvácanie, miernejšie kŕče, postupné ustálenie",
        emotional: "menšia citlivosť ako prvý deň, pokojnejšia nálada",
        nutrition: {
          needs: ["doplniť železo", "podporiť regeneráciu", "stabilizovať energiu"],
          keyNutrients: ["Železo", "Proteíny", "Omega-3", "Vitamín C"],
          foods: ["červená šošovica", "fazuľa", "špenát", "rukola", "červená repa", "orechy", "semienka",
                  "teplé polievky", "vývary", "vajcia", "tofu", "losos", "banány", "jahody", "čučoriedky"],
          tip: "Pokračuj v teplých jedlách a nápojoch. Telo stále regeneruje a potrebuje šetrný prístup v stravovaní."
        },
        mind: {
          practicalThoughts: [
            "Môžeš sa cítiť trochu lepšie ako prvý deň, ale stále si dopraj pohodu.",
            "Denník ti môže pomôcť spracovať pocity a pozorovania z týchto dní.",
            "Ak máš energiu na krátku prechádzku, skús to - pohyb môže pomôcť s náladou.",
            "Netlač sa do výkonu, telo ešte potrebuje čas na regeneráciu.",
            "Dopraj si chvíle ticha a pokoja, nie je nutné byť produktívna."
          ]
        },
        movement: {
          context: "Nízka až stredná energia, postupné zlepšenie.",
          intensity: "Jemný strečing alebo krátka prechádzka",
          neome: "Strečing celého tela",
          walkBenefits: [
            "Krátka prechádzka pomôže s cirkuláciou a náladou.",
            "Čerstvý vzduch zlepší tvoju energiu prirodzeným spôsobom.",
            "Pohyb môže zmierniť zostávajúce kŕče.",
            "Vyčistíš si hlavu a zlepšíš koncentráciu.",
            "Prirodzený dopamín ti pomôže cítiť sa lepšie.",
            "Uvoľníš napätie v tele.",
            "Spánok bude kvalitnejší.",
            "Vyrovnáš si hormóny jemným pohybom."
          ]
        }
      },
      'menstrual-late': {
        hormones: "Estrogén začína pomaly stúpať",
        expectationVariants: [
          "Menštruácia sa ti pravdepodobne blíži ku koncu a estrogén začína stúpať. Môže to priniesť prvé náznaky energie a lepšej nálady. Je to ideálny čas na pomaly sa vrátiť k bežným aktivitám a plánovať nasledujúce dni.",
          
          "V týchto dňoch sa môžeš cítiť optimistickejšia a motivovanejšia. Ak máš chuť začať niečo nové alebo sa vrátiť k odloženým veciam, je to prirodzený impulz rastúceho estrogénu.",
          
          "Telo už pravdepodobne nie je také citlivé a únava ustupuje. Ak ti vyhovuje, môžeš sa vrátiť k bežným aktivitám – stretnutiam, telefónátom alebo jednoduchším povinnostiam."
        ],
        body: "krvácanie ustupuje, energia sa vracia, miernejšie príznaky",
        emotional: "pocit úľavy, lepšia nálada, viac chuti do aktivity",
        nutrition: {
          needs: ["doplniť zásoby železa", "podporiť návrat energie", "pripraviť telo na aktívnejšie dni"],
          keyNutrients: ["Železo", "Vitamín C", "Proteíny", "Komplex B"],
          foods: ["listová zelenina", "strukoviny", "ovocie bohaté na vitamín C", "celozrnné produkty",
                  "zdravé tuky", "avokádo", "orechy", "vajcia", "losos", "tofu", "quinoa", "bataty"],
          tip: "Telo sa vracia do normálu. Môžeš si začať dopriať pestrejšiu stravu a väčšie porcie, ak cítiš chuť."
        },
        mind: {
          practicalThoughts: [
            "Môžeš cítiť prvé náznaky energie - využi to na plánovanie týždňa.",
            "Tento čas je vhodný na pomaly sa vrátiť k bežným aktivitám.",
            "Ranná rutina s kávou a denníkom ti môže pomôcť naštartovať deň.",
            "Netráp sa, ak ešte nie si na 100% - energia sa vracia postupne.",
            "Skús si zapísať, čo chceš tento týždeň dokázať."
          ]
        },
        movement: {
          context: "Stredná energia, telo sa prebúdza.",
          intensity: "Strečing, mobilita, prechádzka",
          neome: "Strečing a mobilita na prípravu",
          walkBenefits: [
            "Dlhšia prechádzka ti pomôže naštartovať energiu.",
            "Čerstvý vzduch zlepší náladu a koncentráciu.",
            "Pohyb podporí návrat do normálneho rytmu.",
            "Prirodzené endorfíny ťa naplnia optimizmom.",
            "Cirkulácia krvi sa zlepší.",
            "Pripravíš telo na aktívnejšie dni.",
            "Spánok bude kvalitnejší.",
            "Cítiš sa pripravená na nový začiatok."
          ]
        }
      },
      'follicular-transition': {
        hormones: "Estrogén naďalej stúpa",
        expectationVariants: [
          "Menštruácia ti už pravdepodobne skončila a hladina estrogénu ti naďalej stúpa. S tým prichádza prvý nárast energie a motivácie. Môžeš pociťovať pocit úľavy a prvé náznaky chuti do aktivity. Je to vhodný čas na pomaly sa vrátiť k bežným aktivitám.",
          
          "V týchto dňoch môžeš mať väčšiu chuť riešiť odložené veci alebo sa venovať veciam, ktoré ti prinášajú radosť. Telo sa prebúdza do novej fázy a energia postupne pribúda.",
          
          "Môžeš si všimnúť, že sa ti lepšie spí a ráno sa cítiš odpočinutejšia. To je prirodzený efekt stúpajúceho estrogénu – telo sa regeneruje rýchlejšie."
        ],
        body: "regenerácia sa zrýchľuje, telo sa prebúdza",
        emotional: "pocit úľavy, prvé náznaky motivácie, lepšia nálada",
        nutrition: {
          needs: ["podporiť návrat energie", "stabilizovať cukor v krvi", "pripraviť telo na aktívnejšie dni"],
          keyNutrients: ["Proteíny", "Vitamín C", "Vláknina", "B-komplex"],
          foods: ["zelenina bohatá na vitamíny", "brokolica", "paprika", "rukola", "celozrnné obilniny",
                  "chudé bielkoviny", "kurča", "ryby", "vajcia", "ovocie", "jahody", "jablká", "citrusy"],
          tip: "Telo sa vracia do normálu. Dopraj si pestrejšiu stravu a väčšie porcie, ak cítiš chuť do jedla."
        },
        mind: {
          practicalThoughts: [
            "Môžeš cítiť prvé náznaky energie - využi to na plánovanie týždňa.",
            "Ranná rutina s kávou a denníkom ti môže pomôcť naštartovať deň.",
            "Skús si zapísať, čo chceš tento týždeň dokázať.",
            "Tento čas je vhodný na pomaly sa vrátiť k bežným aktivitám.",
            "Netráp sa, ak ešte nie si na 100% - energia sa vracia postupne.",
            "Dopraj si chvíľu pokoja večer - napr. čítanie alebo teplý kúpeľ.",
            "Skús si krátku meditáciu s fokusem na novú energiu."
          ]
        },
        movement: {
          context: "Stredná energia, telo sa pripravuje.",
          intensity: "Strečing, mobilita, prechádzka",
          neome: "Strečing a mobilita na prípravu",
          walkBenefits: [
            "Prechádzka v prírode ti pomôže naštartovať energiu.",
            "Čerstvý vzduch zlepší náladu a koncentráciu.",
            "Pohyb podporí návrat do normálneho rytmu.",
            "Prirodzené endorfíny ťa naplnia optimizmom.",
            "Cirkulácia krvi sa zlepší.",
            "Pripravíš telo na aktívnejšie dni.",
            "Spánok bude kvalitnejší.",
            "Cítiš sa pripravená na nový začiatok."
          ]
        }
      },
      'follicular-mid': {
        hormones: "Estrogén výrazne stúpa",
        expectationVariants: [
          "Toto je často jedna z najlepších fáz v cykle. Energia je na vysokej úrovni, koncentrácia je vynikajúca a máš chuť tvoriť, učiť sa a plánovať. Telo v týchto dňoch zvyčajne rýchlejšie regeneruje a mozog môže byť viac zameraný na nové nápady a projekty.",
          
          "V týchto dňoch môžeš mať chuť viac komunikovať a byť v spoločnosti. To je prirodzený signál vysokej hladiny estrogénu – tvoje telo ti hovorí, že máš energiu na sociálne interakcie. Využi to na stretnutia, telefonáty alebo aktivity s deťmi.",
          
          "Tvoja pokožka môže byť čistejšia a vlasy jemnejšie – to je zásluha vysokej hladiny estrogénu. Mnohé ženy v týchto dňoch pociťujú, že vyzerajú lepšie. Nie je to náhoda, ale prirodzený efekt hormónov."
        ],
        body: "rýchla regenerácia, telo výborne znáša záťaž, energia na vysokej úrovni",
        emotional: "vysoká motivácia, kreativita, pozitívne naladenie, sebadôvera",
        nutrition: {
          needs: ["podpora vysokej energie", "stabilný cukor v krvi", "výživa pre svaly a hormóny"],
          keyNutrients: ["Proteíny", "Omega-3", "Vláknina", "B-komplex"],
          foods: ["zelenina všetkých farieb", "brokolica", "mrkva", "paprika", "rajčiny", "celozrnné obilniny",
                  "ovos", "quinoa", "hnedá ryža", "chudé bielkoviny", "kuracie mäso", "ryby", "tofu", "strukoviny",
                  "ovocie", "jahody", "čučoriedky", "banány"],
          tip: "Teraz môžeš experimentovať s novou stravou alebo receptami. Telo je silné a chutí ti to."
        },
        mind: {
          practicalThoughts: [
            "Plánovanie dôležitých projektov - teraz je na to ten pravý čas.",
            "Učenie sa nových vecí - mozog je aktívny a rýchlo sa učí.",
            "Denník - zápis nápadov, plánov a cieľov.",
            "Toto je tvoj čas na rozlet - využi túto fázu na dôležité úlohy.",
            "Využi energiu na veci, ktoré si dlhšie odkladala.",
            "Skús si dnes napísať jeden malý cieľ, ktorý ti spraví radosť.",
            "Tvoje telo zvláda viac - ale netreba ísť na maximum. Drž rovnováhu."
          ]
        },
        movement: {
          context: "Vysoká energia, telo zvláda záťaž.",
          intensity: "Silový tréning alebo intenzívny cardio",
          neome: "Silový tréning",
          walkBenefits: [
            "Dlhšia prechádzka, jemný beh - endorfíny, jasná myseľ, kreativita.",
            "Získaš nápady, ktoré v sede neprichádzajú.",
            "Zlepšíš náladu vďaka prirodzenému dopamínu.",
            "Dodáš telu energiu namiesto ďalšej kávy.",
            "Podporíš spaľovanie tukov aj bez cvičenia.",
            "Zlepšíš cirkuláciu krvi a kyslík v mozgu.",
            "Stabilizuješ si hladinu cukru v krvi po jedle.",
            "Cítiš sa viac pod kontrolou - aj keď je deň chaos."
          ]
        }
      },
      'follicular-late': {
        hormones: "Estrogén dosahuje vrchol pred ovuláciou",
        expectationVariants: [
          "Telo sa v týchto dňoch pravdepodobne pripravuje na ovuláciu. Energia môže byť stále vysoká, kreativita vrcholí a môžeš pociťovať chuť spájať sa s ľuďmi. Pre mnohé ženy je toto vrchol produktivity v cykle. Využi tento čas na dokončenie projektov a sociálne aktivity.",
          
          "Cervikálny hlien sa môže meniť – môže byť ťahavejší a priehľadnejší. To je úplne prirodzené a signalizuje, že sa blíži ovulácia. Ak to pozoruješ, je to dobrý znak, že tvoje telo pracuje správne.",
          
          "Niektoré ženy v týchto dňoch pociťujú vyššiu chuť na pohyb – telo ti signalizuje, že je v top forme. Môžeš si dovoliť intenzívnejší tréning alebo dlhšiu prechádzku. Tvoje svaly a kĺby sú teraz pripravené."
        ],
        body: "vrchol energie, telo je pripravené na ovuláciu, výborná regenerácia",
        emotional: "vysoká sebadôvera, kreativita, chuť do sociálnych aktivít, optimizmus",
        nutrition: {
          needs: ["podpora vrcholovej energie", "antioxidačná ochrana", "výživa pre výkon"],
          keyNutrients: ["Antioxidanty", "Omega-3", "Proteíny", "Vitamín C"],
          foods: ["zelenina bohatá na vlákninu", "brokolica", "kapusta", "špenát", "celozrnné produkty",
                  "zdravé tuky", "avokádo", "orechy", "olivový olej", "ovocie", "citrusy", "jahody"],
          tip: "Teraz je skvelý čas na pestré jedlá a nové recepty. Telo je silné a má vysoké nároky na energiu."
        },
        mind: {
          practicalThoughts: [
            "Dokončenie rozpracovaných projektov - koncentrácia je na vrchole.",
            "Sociálne aktivity - stretnutia, eventy, networking.",
            "Kreatívne projekty - písanie, maľovanie, tvorba.",
            "Využi tento vrchol energie na to, čo je pre teba dôležité.",
            "Telo aj myseľ sú v top forme.",
            "Dnes je ideálny deň na dôležité rozhovory alebo prezentácie.",
            "Skús dnes vyriešiť náročnejšie úlohy - mozog aj telo sú pripravené."
          ]
        },
        movement: {
          context: "Maximálna energia, telo na vrchole.",
          intensity: "Vysoká intenzita, silový aj kondičný tréning",
          neome: "Silový tréning alebo HIIT",
          walkBenefits: [
            "Aktívny pohyb - beh, tanec, šport s priateľmi.",
            "Načerpáš ešte viac energie na celý deň.",
            "Zlepšíš náladu, ktorá už aj tak je dobrá.",
            "Podporíš spaľovanie tukov.",
            "Vyčistíš si hlavu pred dôležitými úlohami.",
            "Stabilizuješ si hladinu cukru v krvi.",
            "Dodáš si mentálnu jasnosť na celý deň.",
            "Cítiš sa silnejšia a pripravená na čokoľvek."
          ]
        }
      },
      ovulation: {
        hormones: "Estrogén je na vrchole",
        expectation: "Estrogén je teraz na svojom vrchole, a tak môžeš pociťovať zvýšenú energiu, sebavedomie a prirodzenú chuť komunikovať a spájať sa s ľuďmi. Je to ideálny čas na dôležité rozhovory, prezentácie alebo aktivity, ktoré vyžadujú odvahu.",
        body: "silové aj kondičné výkony na maxime",
        emotional: "vysoká sebadôvera, empatia, najvyššia sociálna inteligencia",
        nutrition: {
          needs: ["podpora vysokého výkonu", "protizápalová strava", "antioxidačná ochrana"],
          keyNutrients: ["Antioxidanty", "Omega-3", "Bielkoviny", "Vitamín C", "Zinok"],
          foods: ["vajcia", "losos", "tofu", "cottage", "citrusy", "bobuľové", "kiwi",
                  "brokolica", "paprika", "rukola", "špenát", "ľan", "chia", "avokádo", 
                  "orechy", "olivový olej"],
          tip: "Dopraj si bielkoviny do každého jedla a kombinuj ich s čerstvou zeleninou na podporu optimálneho výkonu."
        },
        mind: {
          practicalThoughts: [
            "Dnes je ideálny deň na dôležité rozhovory alebo prezentácie.",
            "Využi sebavedomie a energiu na úlohy, ktoré si odkladala.",
            "Tvoja komunikácia je dnes na vrchole - využi to.",
            "Dnes môžeš skúsiť niečo nové, čo si dlhšie zvažovala.",
            "Ak cítiš chuť spojiť sa s ľuďmi, urob to - tvoje telo ti signalizuje správny čas.",
            "Nie vždy budeš mať takúto energiu - využi ju múdro.",
            "Skús dnes vyriešiť náročnejšie úlohy - mozog aj telo sú pripravené."
          ]
        },
        movement: {
          context: "Maximálna energia, telo na vrchole.",
          intensity: "Vysoká intenzita, silový aj kondičný tréning",
          neome: "Silový tréning alebo HIIT",
          walkBenefits: [
            "Načerpáš ešte viac energie na celý deň.",
            "Zlepšíš náladu, ktorá už aj tak je dobrá.",
            "Podporíš spaľovanie tukov.",
            "Vyčistíš si hlavu pred dôležitými úlohami.",
            "Stabilizuješ si hladinu cukru v krvi.",
            "Dodáš si mentálnu jasnosť na celý deň.",
            "Prechádzka ti pomôže lepšie myslieť a plánovať.",
            "Cítiš sa silnejšia a pripravená na čokoľvek."
          ]
        }
      },
      lutealEarly: {
        hormones: "Progesterón začína stúpať",
        expectationVariants: [
          "Progesterón v tvojom tele začína stúpať a s ním môže prísť pocit väčšej stability a pokoja. Energia môže byť stále dobrá, ale telo sa postupne upokojuje a prechádza do režimu regenerácie. Je to prirodzené – telo si žiada viac pokoja a pravidelnosti.",
          
          "V týchto dňoch sa môže zmeniť tvoja chuť do sociálnych aktivít. Ak ti vyhovuje menej stretnutí a viac času pre seba, je to úplne v poriadku. Progesterón ti pomáha spomaliť a sústrediť sa dovnútra.",
          
          "Môžeš si všimnúť, že sa ti lepšie pracuje na úlohách, ktoré vyžadujú sústredenosť a detaily. Progesterón podporuje dokončovanie vecí a organizáciu."
        ],
        body: "stále dobrá regenerácia, ale telo sa pomaly upokojuje",
        emotional: "stabilita, vnútorný pokoj, väčšia potreba pravidelnosti",
        nutrition: {
          needs: ["stabilizovať energiu", "podporiť tvorbu progesterónu", "udržať dobrú náladu"],
          keyNutrients: ["Magnézium", "B6", "Omega-3", "Komplex sacharidov"],
          foods: ["bataty", "ryža natural", "quinoa", "ovos", "banány", "tmavá čokoláda", "mandle",
                  "losos", "avokádo", "špenát", "brokolica", "kel", "vajcia", "cottage", "grécky jogurt"],
          tip: "Dopraj si pravidelné jedlá každé 3-4 hodiny a kombinuj sacharidy s proteínmi pre stabilnú energiu."
        },
        mind: {
          practicalThoughts: [
            "Skús si zapisovať, čo ti robí dobre a čo nie - pomôže ti to v budúcnosti.",
            "Ak cítiš chuť dokončiť rozpracované veci, je to prirodzené - tvoje telo preferuje teraz organizáciu.",
            "Dopraj si chvíľku pokoja večer - napr. čítanie alebo teplý kúpeľ.",
            "Ak máš pocit, že chceš menej sociálneho kontaktu, je to normálne - rešpektuj to.",
            "Urob si zoznam 3 vecí, ktoré musíš urobiť zajtra - uľahčíš si ráno.",
            "Skús si dopriať pravidelný rytmus - telo ti bude vďačné.",
            "Ak cítiš menšiu motiváciu ako pred pár dňami, nehovor si, že je to tvoja chyba - sú to len hormóny."
          ]
        },
        movement: {
          context: "Ešte dobrá energia, ale telo sa upokojuje.",
          intensity: "Silový tréning alebo joga",
          neome: "Silový tréning alebo pilates",
          walkBenefits: [
            "Zachováš si dobrú náladu vďaka endorfínom.",
            "Pomôžeš telu udržať si dobrú energiu.",
            "Zlepšíš spánok, ktorý môže byť teraz hlbší.",
            "Vyčistíš si myseľ od zbytočných myšlienok.",
            "Stabilizuješ si hormóny pohybom.",
            "Uvoľníš telo a myseľ.",
            "Prechádzka ti pomôže cítiť sa pokojnejšie.",
            "Krátka chôdza pred spaním ti pomôže lepšie zaspať."
          ]
        }
      },
      lutealMid: {
        hormones: "Progesterón je na vrchole",
        expectationVariants: [
          "Progesterón je teraz pravdepodobne na svojom vrchole. Telo môže reagovať citlivejšie na stres, chaos či preťaženie. Je prirodzené, ak cítiš menší záujem o sociálny kontakt a väčšiu potrebu priestoru pre seba. Dopraj si pravidelnosť, jemnosť a dostatok pokoja.",
          
          "V týchto dňoch môžeš pociťovať väčšiu potrebu odpočinku a menšiu chuť riešiť nové veci. To je úplne v poriadku – telo sa pripravuje na záverečnú časť cyklu a potrebuje šetriť energiu.",
          
          "Môžeš si všimnúť, že sa ti horšie koncentruje na viacero vecí naraz. Progesterón na vrchole môže spomaliť rýchlosť spracovania informácií. Skús sa sústrediť len na jednu vec v danom momente."
        ],
        body: "spomalené trávenie, možné nafukovanie, citlivosť na stres",
        emotional: "introspekcia, menší záujem o sociálny kontakt, vyššia citlivosť",
        nutrition: {
          needs: ["podporiť trávenie", "znížiť nafukovanie", "stabilizovať náladu"],
          keyNutrients: ["Magnézium", "Vláknina", "Probiótiká", "Komplex B"],
          foods: ["kvások", "kefír", "grécky jogurt", "banány", "ovsená kaša", "špenát", "kel",
                  "bataty", "quinoa", "ľan", "chia", "tmavá čokoláda", "mandle", "vlašské orechy"],
          tip: "Dopraj si menšie porcie, jedz pomaly a vyvaruj sa ťažkým jedlám večer. Teplé jedlá ti uľahčia trávenie."
        },
        mind: {
          practicalThoughts: [
            "Ak cítiš tlak, urob si 5 minút len pre seba - dýchaj a len si sadni.",
            "Dnes sa vyhni stresu a chaosu - tvoje telo reaguje citlivejšie.",
            "Ak máš pocit, že potrebuješ menej sociálneho kontaktu, je to normálne - rešpektuj to.",
            "Skús si večer urobiť ritual - napr. teplý kúpeľ alebo čítanie.",
            "Dopraj si pravidelný rytmus - telo ti bude vďačné.",
            "Ak cítiš menšiu motiváciu, nehovor si, že je to tvoja chyba - sú to len hormóny.",
            "Urob si zoznam 3 vecí, ktoré musíš urobiť zajtra - uľahčíš si ráno."
          ]
        },
        movement: {
          context: "Nižšia energia, citlivejšie telo.",
          intensity: "Jemný pilates alebo joga",
          neome: "Pilates alebo strečing",
          walkBenefits: [
            "Pomôžeš telu spracovať stres, ktorý si možno cítiš.",
            "Zlepšíš trávenie, ktoré môže byť pomalšie.",
            "Vyčistíš si hlavu od zbytočných myšlienok.",
            "Uvoľníš napätie v tele.",
            "Zlepšíš náladu vďaka endorfínom.",
            "Prechádzka ti pomôže cítiť sa pokojnejšie.",
            "Krátka chôdza pred spaním ti pomôže lepšie zaspať.",
            "Vyrovnáš si hormóny pohybom."
          ]
        }
      },
      lutealLate: {
        hormones: "Progesterón klesá, estrogén klesá",
        expectationVariants: [
          "Progesterón aj estrogén ti v týchto dňoch pravdepodobne klesajú a telo sa pripravuje na menštruáciu. Je možné pociťovať príznaky PMS – napätie, únavu, kŕče alebo nafukovanie. Je to čas spomaliť a dopriať si viac pokoja a jemnosti.",
          
          "V týchto dňoch môžeš byť citlivejšia na kritiku alebo stres. To nie je tvoja chyba – hormóny ovplyvňujú spracovanie emócií. Ak sa cítiš zraniteľnejšia, dopraj si viac pokoja a menej náročných situácií.",
          
          "Môžeš si všimnúť, že máš chuť na sladké alebo slanú stravu. To je prirodzená reakcia tela na klesajúce hormóny. Skús vybrať zdravšie alternatívy, ktoré ti pomôžu stabilizovať cukry."
        ],
        body: "možné príznaky PMS – kŕče, nafukovanie, únava, napätie",
        emotional: "citlivosť, podráždenie, nižšia tolerancia stresu",
        nutrition: {
          needs: ["znížiť PMS príznaky", "podporiť tvorbu serotonínu", "stabilizovať náladu"],
          keyNutrients: ["Magnézium", "Omega-3", "Vitamín B6", "Komplex sacharidov"],
          foods: ["tmavá čokoláda", "banány", "ovsená kaša", "mandle", "vlašské orechy", "losos",
                  "avokádo", "špenát", "kel", "bataty", "quinoa", "vajcia", "cottage", "grécky jogurt"],
          tip: "Dopraj si menšie porcie, jedz pomaly a vyhýbaj sa nadmernému kofeínu a alkoholu, ktoré môžu zhoršiť PMS príznaky."
        },
        mind: {
          practicalThoughts: [
            "Dnes si dovoľ urobiť menej. Aj ticho a oddych sú súčasť regenerácie.",
            "Ak sa cítiš unavená, vyber si jednu vec, ktorú dnes neurobíš.",
            "Pripomeň si, že nie všetky dni musia byť produktívne - dnes je deň pokoja.",
            "Skús si večer dát teplý kúpeľ alebo sprchu - pomôže ti uvoľniť napätie.",
            "Ak cítiš podráždenie, nie si zlá - len tvoje telo reaguje na hormóny.",
            "Dopraj si pravidelný rytmus a dostatok spánku.",
            "Ak máš pocit, že potrebuješ menej sociálneho kontaktu, je to normálne - rešpektuj to."
          ]
        },
        movement: {
          context: "Nízka energia, citlivé telo, možné PMS príznaky.",
          intensity: "Strečing alebo jemný pilates",
          neome: "Strečing alebo jemný pilates",
          walkBenefits: [
            "Prechádzka ti pomôže uvoľniť napätie, ktoré sa ti hromadilo celý deň.",
            "Znížiš stres, ktorý možno pociťuješ.",
            "Vyčistíš si hlavu od nekonečných myšlienok.",
            "Zlepšíš náladu vďaka prirodzenému dopamínu.",
            "Krátka chôdza ťa vráti späť \"do tela\", nie do úloh.",
            "Pomôže ti mať kvalitnejší spánok - aj keď máš milión vecí v hlave.",
            "Uvoľníš stuhnuté svaly.",
            "Vyrovnáš si hormóny a upokojíš nervový systém."
          ]
        }
      }
    };

    // Select master template based on phase and subphase
    let template;
    if (phaseContext.phase === 'menstrual') {
      template = masterTemplates[`menstrual-${phaseContext.subphase}`];
    } else if (phaseContext.phase === 'follicular') {
      if (phaseContext.subphase === 'transition') {
        template = masterTemplates['follicular-transition'];
      } else if (phaseContext.subphase === 'mid') {
        template = masterTemplates['follicular-mid'];
      } else if (phaseContext.subphase === 'late') {
        template = masterTemplates['follicular-late'];
      } else {
        // Fallback pre krátke folikulárne fázy bez transition
        template = masterTemplates['follicular-mid'];
      }
    } else if (phaseContext.phase === 'luteal') {
      template = masterTemplates[`luteal${phaseContext.subphase?.charAt(0).toUpperCase()}${phaseContext.subphase?.slice(1)}`];
    } else {
      // Ovulation - single template
      template = masterTemplates.ovulation;
    }

    // Rotate content for diversity across all cycle lengths
    const walkBenefitIndex = day % template.movement.walkBenefits.length;
    const thoughtIndex = day % template.mind.practicalThoughts.length;

    // Rotate expectation variants within subphase (VARIANT B)
    // Formula: (dayWithinSubphase - subfazaStart) % pocetVariantov
    // This ensures Variant 1 always appears on the first day of each subphase
    const expectationVariantIndex = (phaseContext.dayWithinSubphase - phaseContext.subfazaStart) % template.expectationVariants.length;
    const selectedExpectation = template.expectationVariants[expectationVariantIndex];

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

MEDICÍNSKA SPRÁVNOSŤ FÁZY CYKLU:
- Folikulárna fáza ZAČÍNA prvým dňom menštruácie (deň 1 cyklu)
- Menštruácia (dni 1-${periodLength}) je MENŠTRUAČNÁ ČASŤ folikulárnej fázy
- Po ukončení menštruácie (deň ${periodLength + 1}) pokračuje PROLIFERAČNÁ ČASŤ folikulárnej fázy
- V UI zobrazujeme "menštruáciu" a "folikulárnu fázu" oddelene pre prehľadnosť
- Pri generovaní obsahu NIKDY nepíš "začiatok folikulárnej fázy" pre deň ${periodLength + 1}
- Správne formulácie: "Po ukončení menštruačnej fázy", "hladina estrogénu naďalej stúpa"

PREPOJENIE SEKCIÍ:
- Všetky 4 sekcie musia byť logicky prepojené
- Ak v "Expectation" hovoríš o nízkej energii → v "Movement" odkazuj na tento kontext ("Vzhľadom na nízku energiu...")
- Zabezpeč konzistenciu energie, hormónov a emócií naprieč sekciami

FORMÁTOVANIE - BULLET POINTS:
- Sekcia STRAVA: Každá veta komunikujúca novú informáciu = nová odrážka (začni každú "- ")
  - Rozdeľ na 4-5 odrážok: (1) Potreby tela, (2) Konkrétne potraviny, (3) Živiny, (4) Praktický tip, (5) Doplnková informácia ak je
  - Každá odrážka musí byť samostatná veta s vlastnou pointou
  - Príklad: "- Tvoje telo potrebuje X.\n- Skús Y.\n- Dodajú ti Z.\n- Tip: kombinuj A s B."
  
- Sekcia POHYB: Každá veta komunikujúca novú informáciu = nová odrážka (začni každú "- ")
  - Rozdeľ na 4-6 odrážok: (1) Kontext energie/tela, (2) Odporúčanie cvičenia, (3) Neome tip, (4) Kardio ak je, (5) Prechádzka, (6) Benefit prechádzky
  - Každá odrážka musí byť samostatná veta s vlastnou pointou
  - Neome tip: "- Ak nemáš veľa času alebo chceš čas ušetriť, vyskúšaj 15min cvičenia od Neome."
  - Prechádzka: "- Skús si aj dnes dopriať prechádzku. Dopraj si aspoň 30-60min na čerstvom vzduchu."
  - Benefit: "- [benefit]" ako samostatná odrážka

DIVERZITA A UNIKÁTNOSŤ:
- Každý deň v cykle musí mať SKUTOČNE ODLIŠNÝ obsah (nie len kozmetické zmeny)
- Využi progres vo fáze (X%) na jemné variácie v tóne a formuláciách:
  - 0-20%: "práve vstupuješ", "začína sa", "prvé náznaky"
  - 21-40%: "postupne", "pomaly", "čoraz viac"
  - 41-60%: "už si v strede", "telo pracuje naplno"
  - 61-80%: "blížiš sa do záverečnej časti", "postupne sa mení"
  - 81-100%: "končí sa", "pripravuje sa na ďalšiu fázu"
- Každý deň musí mať RÔZNE konkrétne príklady:
  - Iné kombinácie potravín z poskytnutého zoznamu (NIKDY tie isté 6 ako predošlý deň)
  - Iný benefit prechádzky z poskytnutého zoznamu (rotuj ho na základe progressPercent)
  - Iné praktické tipy
  - Iné formulácie pre expectation text (variuj slová, štruktúru viet)
- Seed slúži na prirodzenú variáciu - čím vyšší, tým iné príklady vyber
- NIKDY nekopíruj formulácie z predošlých dní, aj keď sú v tej istej subfáze
- Pre deň ${day}: použij pozíciu "${phaseContext.relativePosition}" v "${phaseContext.phase}" fáze
- KRITICKÉ: Generuj skutočne unikátny text pre túto pozíciu v cykle, nie generický šablónu
- DÔLEŽITÉ: NIKDY nespomínaj konkrétne čísla dní (napr. "v 6. dni", "deň 7 z 12")

PRAVIDLÁ:
1. Použi PRESNÝ text z master template alebo phaseContext ako základ
2. Vyber z poskytnutých zoznamov (potraviny, benefity, myšlienky)
3. Žiadne vymýšľanie nových faktov alebo informácií
4. Len gramatické úpravy pre plynulosť a unikátnosť pre daný deň
5. NIKDY nespomínaj konkrétne čísla dní v generovanom texte
   ❌ "v 6. dni folikulárnej fázy"
   ❌ "deň 7 z 12"
   ❌ "v siedmom dni"
   ✅ "pravdepodobne vstupuješ do folikulárnej fázy"
   ✅ "si na konci folikulárnej fázy"
   ✅ "tvoje telo sa pripravuje na ovuláciu"

ZDROJE (overené):
- Dr. Mary Claire Haver (menopause & hormonal health)
- Dr. Vonda Wright (longevity & orthopaedics)  
- Dr. Natalie Crawford (fertility & cycle health)
- Dr. Stacy Sims (female physiology & performance)`;

    const cardioText = getCardioRecommendation(day, cycleLength, periodLength);
    
    const progressPercent = Math.round((phaseContext.dayInPhase / phaseContext.totalDaysInPhase) * 100);
    const diversitySeed = day + (cycleLength * 100) + (phaseContext.dayInPhase * 10);

    const userPrompt = `Vytvor obsah pre DEŇ ${day} v ${phase}${subphase ? ` (${subphase})` : ''} fáze (celková dĺžka cyklu: ${cycleLength} dní, menštruácia: ${periodLength} dní).

RELATÍVNY KONTEXT:
${phaseContext.description}
Fáza: ${phaseContext.phase}${phaseContext.subphase ? ` (${phaseContext.subphase})` : ''}
Pozícia v rámci fázy: ${phaseContext.relativePosition}
Progres vo fáze: ${phaseContext.dayInPhase}/${phaseContext.totalDaysInPhase} dní (${progressPercent}%)
Seed pre diverzitu: ${diversitySeed}

KRITICKÉ PRE UNIKÁTNOSŤ:
- Tento deň ${day} je ${phaseContext.dayInPhase}. deň z ${phaseContext.totalDaysInPhase} dní tejto fázy
- Si na ${progressPercent}% progresu tejto fázy
- Obsah sa MUSÍ líšiť od dňa ${day > 1 ? day - 1 : cycleLength} aj od dňa ${day < cycleLength ? day + 1 : 1}
- Použi rozdielne príklady potravín z poskytnutého zoznamu (min 6 odlišných než predošlý deň)
- Použi rozdielny benefit prechádzky z poskytnutého zoznamu

MASTER TEMPLATE - REFERENCIA (použij obsah, nie štruktúru):
Hormóny: ${template.hormones}
Základný text pre očakávanie (prispôsob pre ${phaseContext.relativePosition} ${phaseContext.phase} fázy): ${selectedExpectation}
Telo: ${template.body}
Emócie: ${template.emotional}

INŠTRUKCIA PRE OČAKÁVANIE:
Vytvor unikátny text pre túto pozíciu v cykle, ktorý:
- Reflektuje pozíciu ženy v ${phaseContext.relativePosition} ${phaseContext.phase} fázy
- Používa mäkký, kondicionálny jazyk ("pravdepodobne", "môžeš pociťovať")
- Je všeobecný a nevyužíva konkrétne čísla dní (NIKDY nepíš "v X. dni" alebo "deň Y z Z")
- Nie je kópiou iných dní v tomto cykle
- Prispôsobuje obsah základného textu tak, aby bol jedinečný
- Používa formulácie ako "vstupuješ do fázy", "si na konci", "telo sa pripravuje"

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

nutrition (4-5 odrážok, každá veta = nová odrážka):
- Tvoje telo teraz potrebuje znížiť zápal, doplniť železo a podporiť trávenie teplými jedlami.
- Skús kombinovať vajcia, špenát, jahody, losos, quinoa a kurkumu.
- Tieto potraviny dodajú železo, vitamín C a omega-3 mastné kyseliny.
- Tip: Kombinuj železo s vitamínom C pre lepšiu vstrebateľnosť, napríklad špenát s jahodami.
- Teplé jedlá, ako vývary alebo polievky, uľahčujú trávenie a pomáhajú stabilizovať hladinu cukru v krvi.

mind (1-2 odseky):
"Dnes si dovoľ urobiť menej. Aj ticho a oddych sú súčasť regenerácie."

movement (4-6 odrážok, každá veta = nová odrážka):
- S nízkou energiou a citlivým telom je dnes ideálny čas na jemnejšie pohyby.
- Namiesto intenzívneho cvičenia skús strečing alebo jemný pilates, ktorý sa zameriava na panvu a spodný chrbát, aby uvoľnil prípadné napätie.
- Ak nemáš veľa času alebo chceš čas ušetriť, vyskúšaj 15min cvičenia od Neome.
- Dnes sa vyhni kardiu.
- Namiesto toho, krátka prechádzka ti pomôže znížiť úzkosť a zlepší náladu.`;


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
                  description: 'Čo môžem dnes očakávať? Vytvor unikátny text pre tento konkrétny deň na základe relatívneho kontextu. Čistý text bez markdown.'
                },
                nutrition: {
                  type: 'string',
                  description: 'Strava ako 4-5 odrážok (začni každú "- "). KAŽDÁ VETA = NOVÁ ODRÁŽKA. SOFT jazyk: "Dopraj si...". Prepoj prvú odrážku s expectation. Rozdeľ informácie: (1) potreby tela, (2) konkrétne potraviny, (3) živiny, (4) praktický tip, (5) doplnková info. Každá odrážka má jednu samostatnú pointu. Čistý text bez markdown.'
                },
                mind: {
                  type: 'string',
                  description: 'Myseľ ako 1-2 plynulé odseky s praktickou myšlienkou/habitom. Použi PRESNE text z practicalThoughts. Max 60 slov. Čistý text bez markdown.'
                },
                movement: {
                  type: 'string',
                  description: 'Pohyb ako 4-6 odrážok (začni každú "- "). KAŽDÁ VETA = NOVÁ ODRÁŽKA. SOFT jazyk: "by si mala pociťovať", "vyskúšaj si dopriať". Prepoj prvú odrážku s expectation. Rozdeľ na samostatné odrážky: (1) kontext energie/tela, (2) odporúčanie cvičenia, (3) Neome tip, (4) kardio ak je, (5) prechádzka, (6) benefit prechádzky. Každá odrážka má jednu samostatnú pointu. Čistý text bez markdown.'
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
        periodLength,
        phaseContext,
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
