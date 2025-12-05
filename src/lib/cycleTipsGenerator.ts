import { PhaseRange } from '@/features/cycle/types';

// Seeded shuffle algorithm for deterministic randomization
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed;
  
  const random = () => {
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
    return currentSeed / 0x7fffffff;
  };
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

// NEW MASTER STRAVA - nutrition data per phase with nutrient-to-food mapping
export const MASTER_STRAVA: Record<string, {
  nutrients: Record<string, string[]>;  // nutrient → list of foods
  benefits: string[];
  reasonTemplate: string;
}> = {
  menstrual: {
    nutrients: {
      "železo": ["šošovica", "cícer", "čierna fazuľa", "hovädzie mäso", "morčacie mäso", "špenát", "tofu", "vajcia"],
      "vitamín C": ["jahody", "pomaranč", "kiwi", "granátové jablko", "červená paprika", "brokolica", "citrusy", "maliny"],
      "folát (B9)": ["špenát", "šošovica", "cícer", "brokolica", "rukola", "kel", "avokádo", "špargľa"],
      "vitamín B12": ["vajcia", "hovädzie mäso", "morčacie mäso", "losos", "sardinky", "mliečne výrobky", "tofu fortifikované", "tempeh"],
      "omega-3": ["losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "morské riasy"],
      "kurkumín": ["kurkuma", "zázvor", "čierne korenie", "curry", "zlaté mlieko", "kurkumový čaj", "kurkumová pasta"],
      "antioxidanty": ["čučoriedky", "jahody", "granátové jablko", "červená repa", "tmavá čokoláda", "zelený čaj", "brusnice", "acai"],
      "horčík": ["tmavá čokoláda 85%", "mandle", "tekvicové semienka", "špenát", "banán", "avokádo", "čierna fazuľa", "hnedá ryža"],
      "vitamín B6": ["banán", "kuracie mäso", "morčacie mäso", "losos", "zemiaky", "cícer", "avokádo", "slnečnicové semienka"],
      "draslík": ["banán", "avokádo", "zemiaky", "bataty", "špenát", "melón", "pomaranč", "kokosová voda"]
    },
    benefits: [
      "znížiš zápal a bolestivosť",
      "doplníš železo stratené krvácaním",
      "podporíš tvorbu nových červených krviniek",
      "stabilizuješ energiu počas náročného obdobia",
      "zlepšíš trávenie, ktoré je počas menštruácie citlivejšie",
      "znížiš kŕče a napätie v bruchu",
      "podporíš imunitu, ktorá môže byť oslabená",
      "udržíš stabilnú hladinu cukru v krvi",
      "zlepšíš náladu a znížiš únavu",
      "podporíš regeneráciu tela"
    ],
    reasonTemplate: "aby podporilo krvotvorbu, znížilo zápal a udržalo energiu stabilnú počas krvácania"
  },

  follicular: {
    nutrients: {
      "proteíny": ["vajcia", "losos", "kuracie mäso", "morčacie mäso", "tofu", "tempeh", "grécky jogurt", "cottage cheese"],
      "omega-3": ["losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo"],
      "vláknina": ["ovsené vločky", "quinoa", "šošovica", "cícer", "brokolica", "jablká", "hrušky", "maliny"],
      "B-komplex": ["vajcia", "losos", "kuracie mäso", "avokádo", "celozrnné pečivo", "špenát", "banán", "šošovica"],
      "zinok": ["tekvicové semienka", "hovädzie mäso", "cícer", "kešu orechy", "šošovica", "tofu", "quinoa", "sezamové semienka"],
      "vitamín E": ["mandle", "slnečnicové semienka", "avokádo", "olivový olej", "špargľa", "červená paprika", "mango", "kiwi"],
      "zdravé tuky": ["avokádo", "olivový olej", "mandle", "vlašské orechy", "losos", "chia semienka", "kokosový olej", "mandľové maslo"],
      "vitamín D": ["losos", "sardinky", "vajcia", "hríby shiitake", "fortifikované mlieko", "tofu fortifikované", "makrela", "tuniak"]
    },
    benefits: [
      "podporíš rastúcu energiu a vitalitu",
      "zlepšíš koncentráciu a jasné myslenie",
      "posilníš imunitu v aktívnej fáze",
      "podporíš zdravú pleť a vlasy",
      "stabilizuješ hladinu cukru v krvi",
      "zlepšíš regeneráciu po cvičení",
      "podporíš hormonálnu rovnováhu",
      "zvýšiš kreativitu a motiváciu",
      "pripravíš telo na ovuláciu",
      "posilníš svaly a kosti"
    ],
    reasonTemplate: "podporia rastúcu energiu, hormonálnu rovnováhu a jasnú myseľ, ktorá je typická pre túto fázu"
  },

  ovulation: {
    nutrients: {
      "folát (B9)": ["špenát", "šošovica", "cícer", "brokolica", "rukola", "kel", "avokádo", "špargľa"],
      "zinok": ["tekvicové semienka", "hovädzie mäso", "cícer", "kešu orechy", "vajcia", "tofu", "quinoa", "sezamové semienka"],
      "selén": ["para orechy", "vajcia", "losos", "sardinky", "slnečnicové semienka", "hovädzie mäso", "hnedá ryža", "šampiňóny"],
      "omega-3": ["losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo"],
      "antioxidanty": ["čučoriedky", "jahody", "granátové jablko", "červená paprika", "mrkva", "tmavá čokoláda", "zelený čaj", "rajčiny"],
      "vitamín E": ["mandle", "slnečnicové semienka", "avokádo", "olivový olej", "špargľa", "kiwi", "mango", "papája"]
    },
    benefits: [
      "podporíš zdravú ovuláciu a hormonálnu rovnováhu",
      "zlepšíš energiu počas náročného dňa",
      "pomôžeš telu vyrovnať zápal okolo ovulácie",
      "podporíš 'glow' pleti",
      "znížiš stres a napätie",
      "udržíš stabilnú hladinu energie",
      "posilníš imunitu",
      "podporíš plodnosť a zdravie vajíčka",
      "podporíš lepší spánok počas hormonálne aktívneho obdobia"
    ],
    reasonTemplate: "podporia hormonálnu rovnováhu, znížia možný zápal okolo ovulácie a dodajú čistú, stabilnú energiu"
  },

  lutealEarly: {
    nutrients: {
      "draslík": ["banán", "avokádo", "zemiaky", "bataty", "špenát", "melón", "kiwi", "kokosová voda"],
      "horčík": ["tmavá čokoláda 85%", "mandle", "tekvicové semienka", "špenát", "avokádo", "čierna fazuľa", "hnedá ryža", "banán"],
      "vitamín B6": ["banán", "morčacie mäso", "losos", "zemiaky", "cícer", "avokádo", "slnečnicové semienka", "pistácie"],
      "omega-3": ["losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo"],
      "bielkoviny": ["vajcia", "grécky jogurt", "cottage cheese", "tofu", "morčacie mäso", "losos", "tempeh", "quinoa"],
      "komplexné sacharidy": ["bataty", "quinoa", "ovsené vločky", "hnedá ryža", "celozrnný chlieb", "pohánka", "cícer", "šošovica"],
      "vláknina": ["brokolica", "cuketa", "ovsené vločky", "jablká", "hrušky", "šošovica", "cícer", "maliny"],
      "tryptofán": ["morčacie mäso", "vajcia", "losos", "tekvicové semienka", "tofu", "syr", "banán", "mlieko"]
    },
    benefits: [
      "pomôžeš stabilizovať náladu pri zvyšujúcom sa progesteróne",
      "znížiš zadržiavanie vody",
      "udržíš stabilnú energiu bez cravingov",
      "podporíš trávenie, ktoré sa začína spomaľovať",
      "predídeš PMS podráždenosti"
    ],
    reasonTemplate: "stabilizujú tekutiny, podporia energiu a pripravia telo na najdlhšiu fázu cyklu"
  },

  lutealMid: {
    nutrients: {
      "horčík": ["tmavá čokoláda 85%", "mandle", "tekvicové semienka", "špenát", "avokádo", "čierna fazuľa", "hnedá ryža", "banán"],
      "vitamín B6": ["banán", "morčacie mäso", "losos", "zemiaky", "cícer", "avokádo", "slnečnicové semienka", "pistácie"],
      "omega-3": ["losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo"],
      "probiotiká": ["kefír", "grécky jogurt", "kyslá kapusta", "kimchi", "tempeh", "miso", "kombucha", "acidofilné mlieko"],
      "prebiotiká": ["cesnak", "cibuľa", "špargľa", "banán", "jablká", "ovsené vločky", "pór", "artičoky"],
      "vláknina": ["brokolica", "cuketa", "ovsené vločky", "šošovica", "cícer", "maliny", "hrušky", "fazuľa"],
      "draslík": ["banán", "avokádo", "zemiaky", "bataty", "špenát", "melón", "kiwi", "kokosová voda"],
      "zinok": ["tekvicové semienka", "hovädzie mäso", "cícer", "kešu orechy", "vajcia", "tofu", "quinoa", "sezamové semienka"],
      "komplexné sacharidy": ["bataty", "quinoa", "ovsené vločky", "hnedá ryža", "pohánka", "cícer", "šošovica", "celozrnný chlieb"],
      "bielkoviny": ["vajcia", "grécky jogurt", "cottage cheese", "tofu", "morčacie mäso", "losos", "tempeh", "quinoa"]
    },
    benefits: [
      "znížiš nafukovanie a tlak v bruchu",
      "stabilizuješ náladu počas hormonálnych výkyvov",
      "znížiš cravingy na sladké",
      "upokojíš nervový systém",
      "podporíš kvalitný spánok pri vysokom progesteróne"
    ],
    reasonTemplate: "podporia trávenie, znížia nafukovanie a stabilizujú náladu počas vysokého progesterónu"
  },

  lutealLate: {
    nutrients: {
      "horčík": ["tmavá čokoláda 85%", "mandle", "tekvicové semienka", "špenát", "avokádo", "čierna fazuľa", "hnedá ryža", "banán"],
      "vitamín B6": ["banán", "morčacie mäso", "losos", "zemiaky", "cícer", "avokádo", "slnečnicové semienka", "pistácie"],
      "omega-3": ["losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo"],
      "vitamín E": ["mandle", "slnečnicové semienka", "avokádo", "olivový olej", "špargľa", "kiwi", "mango", "papája"],
      "antioxidanty": ["čučoriedky", "jahody", "maliny", "granátové jablko", "tmavá čokoláda", "zelený čaj", "brusnice", "acai"],
      "kurkumín": ["kurkuma", "zázvor", "čierne korenie", "curry", "zlaté mlieko", "kurkumový čaj", "zázvorový čaj"],
      "vláknina": ["ovsené vločky", "šošovica", "cícer", "jablká", "hrušky", "brokolica", "maliny", "fazuľa"],
      "bielkoviny": ["vajcia", "grécky jogurt", "tofu", "cottage cheese", "losos", "morčacie mäso", "tempeh", "quinoa"]
    },
    benefits: [
      "znížiš podráždenosť a PMS",
      "zlepšíš spánok",
      "podporíš uvoľnenie napätých svalov",
      "znížiš zápal a bolesť",
      "stabilizuješ energiu v najcitlivejšej časti cyklu"
    ],
    reasonTemplate: "upokojiť telo pred menštruáciou, znížiť zápal a podporiť stabilnú energiu"
  }
};

// MASTER POHYB - movement data per phase
export const MASTER_POHYB: Record<string, {
  primaryExercise: string[];
  neome: string;
  cardioWithCardio: string[];
  cardioNoCardio: string[];
  walkBenefits: string[];
}> = {
  menstrual: {
    primaryExercise: [
      "Skús si dopriať pár minút jemného strečingu, ktorý uvoľní napätie v panve a krížoch.",
      "Dnes ti môže pomôcť pomalý strečing — uvoľní brucho, zlepší cirkuláciu a zníži kŕče.",
      "Zvoľ si jemný pohyb, ktorý ti prinesie úľavu — napríklad pár jednoduchých strečových pozícií.",
      "Skús pár hlbokých nádychov a ľahký strečing, ktorý podporí prekrvenie a zníži bolestivosť.",
      "Dnes telu padne najlepšie vedomé spomalenie — jemná joga ti môže uľahčiť celý deň.",
      "Skús pár minút nenáročného strečingu, ktorý uvoľní spodný chrbát a zmierni tlak v bruchu.",
      "Pomalý pohyb je dnes tvoj najlepší priateľ — pár strečových pozícií ti pomôže uvoľniť celé telo.",
      "Ak cítiš napätie, jemný strečing ti prinesie okamžitú úľavu.",
      "Dopraj si pár minút príjemného strečingu — pomalé natiahnutie bokov a panvy môže urobiť veľký rozdiel.",
      "Jemný strečing dnes podporí cirkuláciu, uvoľní kŕče a dodá ti príjemný pocit ľahkosti."
    ],
    neome: "Ak nemáš veľa času a chceš čas ušetriť, vyskúšaj 15-min cvičenia od Neome.",
    cardioWithCardio: [],
    cardioNoCardio: [
      "Dnes tvojmu telu najviac prospeje, ak si dáš pauzu od intenzívneho kardia a necháš ho ďalej regenerovať.",
      "Telo je teraz v režime obnovy, preto mu padne lepšie pokojnejší pohyb než intenzívne kardio.",
      "Skús si dnes dopriať deň bez náročného kardia — tvoje telo energiu potrebuje na regeneráciu.",
      "V tejto fáze môže byť intenzívne kardio pre telo náročné, jemnejší pohyb ti dnes padne lepšie.",
      "Tvoje telo sa teraz zotavuje, preto môže byť príjemnejšie vynechať intenzívne kardio a zvoliť niečo ľahšie.",
      "Dnes je ideálny čas zvoliť jemnejší pohyb a nechať si intenzívne kardio na obdobie s väčšou energiou.",
      "Aby sa telo mohlo naplno obnoviť, môže mu dnes pomôcť, ak si dáš pauzu od intenzívneho kardia.",
      "Tvoje hormóny sú teraz nastavené na regeneráciu, preto ľahší pohyb urobí väčšiu službu než intenzívne kardio.",
      "Skús dnes uprednostniť pokojnejší pohyb — intenzívne kardio si nechaj na dni, keď bude energia vyššia.",
      "Regenerácia je teraz prioritou, a preto môže byť fajn dať si dnes prestávku od náročného kardia."
    ],
    walkBenefits: [
      "jemne uvoľniť panvové svaly a znížiť menštruačné kŕče.",
      "podporiť prirodzený tok krvi a zmierni pocit ťažoby v podbrušku.",
      "dodať viac kyslíka a energie bez toho, aby ťa unavila.",
      "zvýšiť hladinu endorfínov a prinesie úľavu od bolesti.",
      "podporiť lepší spánok tým, že upokojí nervový systém.",
      "zmierniť nafúknutie tým, že rozhýbe trávenie a lymfu.",
      "stabilizovať náladu a pomôže znížiť podráždenosť.",
      "znížiť zápal v tele a prinesie viac fyzickej pohody.",
      "uvoľniť napätie v krížoch a spodnej časti chrbta.",
      "vyrovnať hladinu stresových hormónov a prinesie pocit pokoja."
    ]
  },

  follicular: {
    primaryExercise: [
      "Tvoje telo má teraz viac energie — môžeš využiť túto fázu na o niečo intenzívnejší silový tréning.",
      "Ak to dnes cítiš, silový tréning vo vyššej intenzite ti môže veľmi dobre sadnúť.",
      "Rastúca energia z tejto fázy je ideálna na silový tréning, ktorý je o krok intenzívnejší než bežne.",
      "Dnes môže tvoje telo zvládnuť aj o niečo náročnejší silový tréning — využime túto silnú fázu.",
      "Je to skvelý deň na progres — intenzívnejší silový tréning ti môže priniesť výborný pocit aj výsledky.",
      "Ak cítiš chuť zabrať, toto je obdobie, kedy ti vyššia intenzita silového tréningu pôjde ľahšie.",
      "Skús dnes zaradiť o niečo silnejší tréning — telo má v tejto fáze najlepšie podmienky na rast.",
      "Energia je teraz prirodzene vyššia, takže intenzívnejší silový tréning môže byť pre teba perfektnou voľbou.",
      "Tvoje svaly sú v tejto fáze pripravené na väčšiu záťaž — môžeš si dopriať intenzívnejší silový tréning.",
      "Ak chceš spraviť krok dopredu, práve teraz je ideálne obdobie zaradiť silový tréning vo vyššej intenzite."
    ],
    neome: "Ak nemáš veľa času a chceš čas ušetriť, vyskúšaj 15-min cvičenia od Neome.",
    cardioWithCardio: [
      "Ak máš dnes energiu navyše, môžeš skúsiť 15-min intervalové kardio — beh, bicykel alebo švihadlo v rytme 2 min rýchlo / 1 min voľne.",
      "Toto je skvelý deň aj na ľahké 15-min intervalové kardio. Skús beh či bicykel: 2 min v tempe, 1 min voľnejšie.",
      "Ak ti to telo dovolí, môžeš pridať krátke 15-min intervalové kardio — 2 min rýchlo, 1 min oddychovejšie.",
      "Dnešná fáza zvláda aj kardio. Skús 15 min: napr. švihadlo alebo rýchlu chôdzu do kopca v intervale 2:1.",
      "Ak cítiš drive, 15-min intervalové kardio (beh/bike) v pomere 2:1 ti môže pekne zdvihnúť tep aj náladu.",
      "Môžeš zaradiť aj 15-min intervalové kardio. Napr. 2 min svižného tempa pri behu či bicykli, potom 1 min voľnejšie.",
      "Ak máš chuť, dopraj si 15-min intervalové kardio: 2 min rýchle tempo + 1 min odpočinkového.",
      "Dnešné telo dobre reaguje aj na 15-min kardio – 2 min rýchlo, 1 min pomalšie. Môžeš skúsiť beh, bicykel alebo švihadlo.",
      "Ak chceš pridať niečo navyše, skvelou voľbou je intervalové kardio: 2 min choď naplno, 1 min choď voľnejšie, 15 min spolu.",
      "Dnes môžeš zaradiť aj 15-min intervalové kardio. Beh, bicykel či švihadlo v rytme 2:1, 2 min naplno, 1 min voľnejšie. Krásne podporia energiu."
    ],
    cardioNoCardio: [
      "Dnes nechaj kardio bokom a sústreď sa skôr na silu a prechádzku — telo si stále buduje energiu.",
      "Kardio dnes nemusíš riešiť. Stačí silový tréning a príjemná prechádzka.",
      "Dnes nie je potrebné zaradiť intervalové kardio — zvoľ radšej silu a nechaj energiu rásť prirodzene.",
      "Kardio dnes nemusíš riešiť. Silový tréning a svižná chôdza úplne postačia.",
      "Intervalové kardio dnes nie je potrebné — vhodnejšie je sústrediť sa na silu a prechádzku.",
      "Dnes si môžeš dať pauzu od kardia. Telo bude lepšie reagovať na silový tréning a dlhšiu prechádzku.",
      "Kardio dnes vynechaj a daj prednosť silovému tréningu — podporíš rast svalov aj energiu.",
      "Dnes si daj oddych od kardia. Skús radšej silu a príjemnú prechádzku.",
      "Tvoje telo dnes nepotrebuje intervalové kardio. Stačí silový tréning a 30-min chôdze.",
      "Dnešok nech je bez kardia — zameraj sa na silu, techniku a stabilitu, ktoré folikulárna fáza skvele podporuje."
    ],
    walkBenefits: [
      "využiť rastúcu energiu a jemne podporí hormonálnu rovnováhu.",
      "zvýšiť prietok krvi do svalov, čo urýchľuje regeneráciu a pripravuje telo na silnejšie tréningy.",
      "podporiť mozgovú činnosť — v tejto fáze sa ti prirodzene lepšie myslí.",
      "stabilizovať hladinu cukru, aby si predišla energetickým výkyvom počas dňa.",
      "podporiť tvorbu serotonínu, vďaka čomu sa zlepší nálada aj motivácia.",
      "podporiť trávenie, ktoré v tejto fáze pracuje efektívnejšie.",
      "rozhýbať lymfu a pomôže telu zbavovať sa toxínov po menštruácii.",
      "rozbehnúť metabolizmus a podporí prirodzené spaľovanie energie.",
      "mať jasnejšiu myseľ — folikulárna fáza je ideálna na plánovanie a kreatívne myslenie.",
      "podporiť stabilnú náladu, aby si túto 'najľahšiu' fázu cyklu využila naplno."
    ]
  },

  ovulation: {
    primaryExercise: [
      "Dnes môžeš skúsiť pridať na intenzite — tvoje telo je v období najväčšej sily.",
      "Ak máš chuť, ovulačné dni sú ideálne na intenzívnejší tréning, telo to zvláda najlepšie.",
      "Dnes môžeš cítiť maximum energie — využi to pri silovejšom alebo dynamickejšom tréningu.",
      "Toto je tvoja power fáza. Ak chceš, dopraj si intenzívnejší tréning, telo krásne reaguje.",
      "Ovulačné dni sú skvelé na výkon. Skús tréning, kde trošku prekročíš svoje bežné tempo.",
      "Ak to cítiš, dnes je ideálny čas na náročnejší tréning — sila aj výdrž sú na vrchole.",
      "Tvoje telo dnes zvláda vyššiu záťaž. Skús pridať váhu, tempo alebo počet opakovaní.",
      "Môžeš si dovoliť ísť o kúsok intenzívnejšie — ovulácia ti prirodzene zvyšuje silu aj vitalitu.",
      "Ak máš energiu, dnes si môžeš dopriať dynamickejší alebo o niečo náročnejší tréning.",
      "Tvoje telo má dnes najväčší výkonový potenciál — ak chceš, môžeš to využiť pri intenzívnejšom cvičení."
    ],
    neome: "Ak nemáš veľa času a chceš čas ušetriť, vyskúšaj 15-min cvičenia od Neome.",
    cardioWithCardio: [
      "Ovulačné dni sú ako stvorené na krátke intervalové kardio — napríklad 15 min behu, bicykla alebo švihadla. Skús rytmus 2 min rýchlo a 1 min voľne.",
      "Ak máš energiu, dnes môžeš pridať 15-min intervalové kardio. Beh, bicykel či švihadlo v pomere 2:1 krásne využijú tvoju zvýšenú výkonnosť.",
      "Tvoj výkon je teraz na maxime — ak chceš, skús 15-min intervalové kardio (2 min rýchlo, 1 min voľne). Beh, bicykel alebo švihadlo sú skvelé možnosti.",
      "Dnes môže tvoje telo zvládnuť intenzívnejšie intervaly. Môžeš vyskúšať 15 min behu, bicykla alebo švihadla v pomere 2 min náporu a 1 min oddychu.",
      "Ak to cítiš, skús zaradiť 15-min intervalové kardio. Beh, bicykel či švihadlo so striedaním 2 min rýchlo a 1 min voľne ti dodajú príjemnú dávku endorfínov."
    ],
    cardioNoCardio: [],
    walkBenefits: [
      "využiť prirodzene najvyššiu energiu a uvoľniť napätie z intenzívnejších dní.",
      "podporiť prekrvenie panvy, čo zlepšuje cirkuláciu a znižuje nepríjemné pnutie okolo ovulácie.",
      "stabilizovať nervový systém, ktorý môže byť v tejto fáze citlivejší na stres.",
      "vyrovnať hormonálny 'peak', aby si sa necítila preťažená alebo nervózna.",
      "podporiť dýchanie a rozšírenie kapacity pľúc — ideálne, keď telo prirodzene túži po pohybe.",
      "znižovať zápal, ktorý môže sprevádzať ovulačnú bolesť.",
      "zvýšiť tvorbu endorfínov, aby si si udržala vysokú náladu, ktorá je pre ovuláciu typická.",
      "zlepšiť sústredenie, ktoré môže byť v tento deň veľmi silné.",
      "využiť vysoký metabolický výkon tela jemným, podporujúcim spôsobom.",
      "ukotviť energiu, ktorú máš dnes najviac z celého cyklu."
    ]
  },

  lutealEarly: {
    primaryExercise: [
      "Dnes si ešte môžeš dopriať silový tréning — tvoje telo má stále dobrú energiu a stabilitu.",
      "Skús si dať silový tréning, ranná luteálna fáza ho zvláda veľmi dobre.",
      "Ak máš chuť, dopraj si dnes silový tréning. Progesterón síce stúpa, ale výkon býva stále fajn.",
      "Dnes je vhodný deň na silový tréning — stabilné tempo ti pomôže udržať energiu aj náladu.",
      "Skús dnes siahnuť po silovom tréningu v strednej intenzite. Ranná luteálna fáza reaguje na takýto typ pohybu výborne.",
      "Tvoje telo ešte zvládne silový tréning, no drž sa skôr kontrolovaného a technického tempa.",
      "Ak to cítiš, dopraj si dnes silový tréning. Strední intenzita podporí stabilitu aj hormóny.",
      "Dnes je ešte priestor pre silový tréning — zvoľ si však radšej stabilné tempo bez extrémov.",
      "Silový tréning je v tejto časti luteálnej fázy stále vhodný. Skús pracovať s kontrolou a kvalitnou technikou.",
      "Ak chceš, sprav si dnes silový tréning v strednom tempe. Telo v tejto fáze ocení silu bez preťaženia."
    ],
    neome: "Ak nemáš veľa času a chceš čas ušetriť, vyskúšaj 15-min cvičenia od Neome.",
    cardioWithCardio: [
      "Ak máš energiu, skús 15–20 minút kardia v rovnom tempe — beh, bicykel alebo eliptický trenažér sú skvelé voľby.",
      "Dnes môžeš zaradiť 15-20 min steady kardio bez intervalov, napríklad plynulý beh, bicykel či rýchlu chôdzu do kopca.",
      "Skús si dopriať 15–20 minút jedného tempa — či už na bicykli, eliptickom trenažéri alebo pri pomalom behu.",
      "Ak ti to sedí, dopraj si dnes 15-20 min steady kardio: beh, bicykel alebo eliptický trenažér v plynulom, miernom tempe.",
      "Dnes môže byť fajn zaradiť 15-20 min kardia bez prerušenia — napríklad rovnomerný beh, bicykel alebo eliptický trenažér."
    ],
    cardioNoCardio: [
      "Dnes kardio vynechaj — tvoje telo prirodzene spomaľuje a viac ocení pokojnejší pohyb.",
      "Kardio si dnes nechaj bokom, nervový systém potrebuje trochu oddychu.",
      "Dnes sa zameraj len na mierny pohyb bez kardia — tvoje telo pracuje vo vnútri viac ako zvonku.",
      "Kardio dnes netreba, jemnejší pohyb bude pre hormóny ten najlepší výber.",
      "Dnes je vhodné vynechať kardio a zvoliť pokojnejšie tempo — telo tak ľahšie zvládne hormonálne zmeny.",
      "Kardio si dnes neplánuj, stačí pilates, strečing alebo ľahký pohyb, ktorý ti urobí dobre.",
      "Tvoje telo dnes potrebuje viac upokojiť než zrýchliť — preto kardio vynechaj.",
      "Kardio dnes nepridávaj, jemný pohyb pomôže lepšie stabilizovať energiu aj náladu.",
      "Dnes je ideálny deň zostať pri jemnom tempe bez kardia — hormóny si pýtajú viac pokoja.",
      "Kardio dnes neodporúčam, telo má nižšiu toleranciu na intenzitu a viac mu prospeje uvoľnenie."
    ],
    walkBenefits: [
      "udržať stabilnú energiu, kým progesterón začína stúpať.",
      "podporiť trávenie, ktoré sa v tejto fáze môže mierne spomaľovať.",
      "znížiť napätie v prsníkoch, ktoré sa môže objaviť pri zvýšenom progesteróne.",
      "udržať dobrú náladu, ktorá sa začína meniť vplyvom hormonálnych výkyvov.",
      "predchádzať únavovým návalom v druhej polovici dňa.",
      "podporiť lymfatický systém a zníži pocit 'ťažkých nôh'.",
      "zvládať stres, ktorý telo v tejto fáze prirodzene vníma intenzívnejšie.",
      "udržať metabolizmus aktívny, aby sa predišlo pocitu spomalenia.",
      "podporiť stabilnú hladinu cukru, čo zníži cravings na sladké.",
      "udržať jasnú myseľ, keď sa začne objavovať mierna mentálna hmla."
    ]
  },

  lutealMid: {
    primaryExercise: [
      "Dnes skús pilates alebo mierny silový tréning — telo prirodzene spomaľuje a jemnejší pohyb mu urobí najlepšie.",
      "Tvoje telo teraz reaguje lepšie na pilates a kontrolovaný pohyb. Skús si zvoliť tréning v jemnom tempe.",
      "V tejto fáze ti najviac prospeje pilates alebo mierny silový tréning, ktorý podporí stabilitu aj pohodlie.",
      "Dnes je ideálny deň na pilates alebo jemné posilňovanie — nervový systém ocení pokojnejší rytmus.",
      "Skús si dopriať pilates alebo mierny silový tréning, telo teraz preferuje pomalšie, kontrolované pohyby.",
      "Tvoja energia môže byť o niečo nižšia, preto je dnes vhodný pilates alebo silový tréning v jemnom tempe.",
      "Vyber si dnes pilates alebo mierny silový tréning. Pomôže ti to udržať stabilitu bez preťaženia tela.",
      "Dnes bude najpríjemnejší pilates alebo ľahší silový tréning — tento typ pohybu podporí aj hormonálnu rovnováhu.",
      "Skús dnes voliť pilates alebo jemné posilňovanie. Telo sa prirodzene upokojuje a reaguje lepšie na miernu intenzitu.",
      "V tejto fáze sú najvhodnejšie pilates a mierny silový tréning — pomôžu ti uvoľniť napätie a zároveň si udržať silu."
    ],
    neome: "Ak nemáš veľa času a chceš čas ušetriť, vyskúšaj 15-min cvičenia od Neome.",
    cardioWithCardio: [],
    cardioNoCardio: [
      "Dnes kardio vynechaj — tvoje telo prirodzene spomaľuje a viac ocení pokojnejší pohyb.",
      "Kardio si dnes nechaj bokom, nervový systém potrebuje trochu oddychu.",
      "Dnes sa zameraj len na mierny pohyb bez kardia — tvoje telo pracuje vo vnútri viac ako zvonku.",
      "Kardio dnes netreba, jemnejší pohyb bude pre hormóny ten najlepší výber.",
      "Dnes je vhodné vynechať kardio a zvoliť pokojnejšie tempo — telo tak ľahšie zvládne hormonálne zmeny.",
      "Kardio si dnes neplánuj, stačí pilates, strečing alebo ľahký pohyb, ktorý ti urobí dobre.",
      "Tvoje telo dnes potrebuje viac upokojiť než zrýchliť — preto kardio vynechaj.",
      "Kardio dnes nepridávaj, jemný pohyb pomôže lepšie stabilizovať energiu aj náladu.",
      "Dnes je ideálny deň zostať pri jemnom tempe bez kardia — hormóny si pýtajú viac pokoja.",
      "Kardio dnes neodporúčam, telo má nižšiu toleranciu na intenzitu a viac mu prospeje uvoľnenie."
    ],
    walkBenefits: [
      "zmierniť predmenštruačné napätie a pocit 'plnosti'.",
      "podporiť lymfu a znížiť zadržiavanie vody.",
      "podporiť tvorbu serotonínu, ktorý prirodzene klesá.",
      "znížiť podráždenosť a zlepšuje toleranciu na stres.",
      "uľahčiť trávenie, ktoré môže byť v tejto fáze pomalšie.",
      "udržať energiu bez toho, aby telo preťažovala.",
      "znížiť bolesť krížov a napätie v panve.",
      "uľaviť od únavy spôsobenej vysokým progesterónom.",
      "zníži pocit 'brain fog'.",
      "zmierniť pocit nafukovania a ťažoby."
    ]
  },

  lutealLate: {
    primaryExercise: [
      "Dnes skús zvoliť jemný strečing alebo ľahký pilates — tvoje telo si pýta uvoľnenie, nie tlak.",
      "Tvoje telo je citlivejšie, preto dnes najlepšie padne strečing alebo pomalý pilates.",
      "Dnes si dopraj len jemný pohyb — strečing alebo pilates v úplnom pokoji ti môže výrazne uľaviť.",
      "Skús sa dnes zamerať na strečing alebo jemný pilates. Pomôžu ti uvoľniť napätie a zmierniť PMS.",
      "Toto je ideálny deň na strečing alebo pilates v pomalom tempe. Telo sa pripravuje na menštruáciu a potrebuje jemnosť.",
      "Dnes je vhodné zvoliť len strečing alebo ľahký pilates — podporíš tým nervový systém aj uvoľnenie svalov.",
      "Tvoju energiu môže ovplyvňovať PMS, preto skús strečing alebo jemný pilates, ktorý telo upokojí.",
      "Dnes si dopraj strečing alebo pomalý pilates. Je to pohyb, ktorý ti teraz najviac pomôže fyzicky aj mentálne.",
      "V tejto fáze ti najlepšie padne strečing alebo jemný pilates — minimálna záťaž, maximálna úľava.",
      "Skús dnes urobiť krátky strečing alebo jemný pilates. Telo sa pripravuje na nový cyklus a reaguje lepšie na mäkký pohyb."
    ],
    neome: "Ak nemáš veľa času a chceš čas ušetriť, vyskúšaj 15-min cvičenia od Neome.",
    cardioWithCardio: [],
    cardioNoCardio: [
      "Dnes kardio vynechaj — tvoje telo prirodzene spomaľuje a viac ocení pokojnejší pohyb.",
      "Kardio si dnes nechaj bokom, nervový systém potrebuje trochu oddychu.",
      "Dnes sa zameraj len na mierny pohyb bez kardia — tvoje telo pracuje vo vnútri viac ako zvonku.",
      "Kardio dnes netreba, jemnejší pohyb bude pre hormóny ten najlepší výber.",
      "Dnes je vhodné vynechať kardio a zvoliť pokojnejšie tempo — telo tak ľahšie zvládne hormonálne zmeny.",
      "Kardio si dnes neplánuj, stačí pilates, strečing alebo ľahký pohyb, ktorý ti urobí dobre.",
      "Tvoje telo dnes potrebuje viac upokojiť než zrýchliť — preto kardio vynechaj.",
      "Kardio dnes nepridávaj, jemný pohyb pomôže lepšie stabilizovať energiu aj náladu.",
      "Dnes je ideálny deň zostať pri jemnom tempe bez kardia — hormóny si pýtajú viac pokoja.",
      "Kardio dnes neodporúčam, telo má nižšiu toleranciu na intenzitu a viac mu prospeje uvoľnenie."
    ],
    walkBenefits: [
      "uvoľniť napätie v tele a zníži podráždenosť typickú pre PMS.",
      "podporiť prirodzené uvoľnenie endorfínov, ktoré zmiernia úzkosť a tlak.",
      "zlepšiť prekrvenie panvy, čo zmierni kŕče a bolesť v podbrušku.",
      "zmierniť nafukovanie podporením lymfy.",
      "znížiť túžbu po sladkom tým, že stabilizuje cukor v krvi.",
      "podporiť spánok, ktorý býva v tejto fáze nekvalitný.",
      "uvoľniť napätie v ramenách a chrbte, ktoré sa zvyšuje pred menzesom.",
      "zlepšiť náladu počas dňa, keď hladiny serotonínu klesajú.",
      "zmierniť PMS bolesti hlavy jemným prekrvením.",
      "podporiť pocit kontroly nad telom, keď hormóny môžu pôsobiť chaoticky."
    ]
  }
};

// Get master key from phase + subphase
export function getMasterKey(phase: string, subphase: string | null): string {
  if (phase === 'ovulation') return 'ovulation';
  if (phase === 'menstrual') return 'menstrual';
  if (phase === 'follicular') return 'follicular';
  if (phase === 'luteal') {
    if (subphase === 'early') return 'lutealEarly';
    if (subphase === 'mid') return 'lutealMid';
    if (subphase === 'late') return 'lutealLate';
    return 'lutealMid'; // fallback
  }
  return 'menstrual'; // fallback
}

// Generate nutrition text from MASTER_STRAVA with proper nutrient-food pairing
export function generateNutrition(day: number, phase: string, subphase: string | null): string {
  const masterKey = getMasterKey(phase, subphase);
  const master = MASTER_STRAVA[masterKey];
  
  if (!master) return '';
  
  const nutrientNames = Object.keys(master.nutrients);
  
  // Select 4 nutrients using seeded shuffle (deterministic based on day)
  const shuffledNutrients = seededShuffle(nutrientNames, day);
  const selectedNutrients = shuffledNutrients.slice(0, 4);
  
  // For each nutrient, select foods from its own food list
  // First 2 nutrients get 2 foods each, last 2 get 1 food each = 6 foods total
  const foods: string[] = [];
  selectedNutrients.forEach((nutrient, index) => {
    const nutrientFoods = master.nutrients[nutrient];
    const shuffledFoods = seededShuffle(nutrientFoods, day * (index + 2));
    const foodCount = index < 2 ? 2 : 1; // 2+2+1+1 = 6 foods
    foods.push(...shuffledFoods.slice(0, foodCount));
  });
  
  // Select benefit
  const shuffledBenefits = seededShuffle(master.benefits, day * 3);
  const selectedBenefit = shuffledBenefits[0];
  
  // Format: 3 sentences
  const nutrientsStr = selectedNutrients.join(', ');
  const foodsStr = foods.join(', ');
  
  return `Tvoje telo dnes potrebuje ${nutrientsStr} — ${master.reasonTemplate}.\n\nNájdeš ich v potravinách ako ${foodsStr}.\n\nTento výber ti dnes pomôže ${selectedBenefit}.`;
}

// Determine if today is a cardio day based on phase and day position
function isCardioDay(day: number, phase: string, subphase: string | null, phaseRanges: PhaseRange[]): boolean {
  // Menstrual: never cardio
  if (phase === 'menstrual') return false;
  
  // Luteal mid and late: never cardio
  if (phase === 'luteal' && (subphase === 'mid' || subphase === 'late')) return false;
  
  // Ovulation: always cardio
  if (phase === 'ovulation') return true;
  
  // Follicular and luteal early: every 3rd day
  const currentPhaseRange = phaseRanges.find(r => r.key === phase);
  if (!currentPhaseRange) return false;
  
  const dayInPhase = day - currentPhaseRange.start + 1;
  return dayInPhase % 3 === 1; // 1st, 4th, 7th day in phase
}

// Generate movement text from MASTER_POHYB
export function generateMovement(
  day: number, 
  phase: string, 
  subphase: string | null, 
  phaseRanges: PhaseRange[]
): string {
  const masterKey = getMasterKey(phase, subphase);
  const master = MASTER_POHYB[masterKey];
  
  if (!master) return '';
  
  // Use seeded shuffle
  const shuffledPrimary = seededShuffle(master.primaryExercise, day);
  const shuffledWalkBenefits = seededShuffle(master.walkBenefits, day * 3);
  
  const isCardio = isCardioDay(day, phase, subphase, phaseRanges);
  
  // Select cardio text
  let cardioText = '';
  if (isCardio && master.cardioWithCardio.length > 0) {
    const shuffledCardio = seededShuffle(master.cardioWithCardio, day * 2);
    cardioText = shuffledCardio[0];
  } else if (master.cardioNoCardio.length > 0) {
    const shuffledNoCardio = seededShuffle(master.cardioNoCardio, day * 2);
    cardioText = shuffledNoCardio[0];
  }
  
  // Build 4 bullet points
  const lines = [
    `- ${shuffledPrimary[0]}`,
    `- ${master.neome}`,
    `- ${cardioText}`,
    `- Skús si aj dnes dopriať aspoň 30-min na čerstvom vzduchu. Prechádzka ti pomôže ${shuffledWalkBenefits[0]}`
  ];
  
  return lines.join('\n');
}
