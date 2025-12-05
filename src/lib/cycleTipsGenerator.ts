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
// All foods are commonly available in SK/CZ, no pork, no exotic ingredients
// Each nutrient has 20+ foods for better rotation
export const MASTER_STRAVA: Record<string, {
  nutrients: Record<string, string[]>;  // nutrient → list of foods
  benefits: string[];
  reasonTemplate: string;
  nutrientReasons: Record<string, string>;  // nutrient → reason for this phase
}> = {
  menstrual: {
    nutrients: {
      "železo": [
        "šošovica", "cícer", "čierna fazuľa", "hovädzie mäso", "morčacie mäso", "špenát", "tofu", "vajcia",
        "červená šošovica", "tekvicové semienka", "quinoa", "tahini", "celozrnný chlieb", "pohánka", 
        "kuracie mäso", "sušené marhule", "sezamové semienka", "mandle", "kešu orechy", "brokolica",
        "kel", "červená fazuľa", "hrášok", "ovsené vločky", "hnedá ryža"
      ],
      "vitamín C": [
        "jahody", "pomaranč", "kiwi", "granátové jablko", "červená paprika", "brokolica", "citróny", "maliny",
        "mango", "ananás", "zelená paprika", "žltá paprika", "karfiol", "kapusta", "černice", "ríbezle",
        "grepfrút", "limetka", "petržlen", "rajčiny", "rukola", "kel", "mandarínky", "melón"
      ],
      "folát (B9)": [
        "kel", "rukola", "šošovica", "cícer", "brokolica", "avokádo", "špargľa", "rímsky šalát",
        "červená fazuľa", "čierna fazuľa", "hrášok", "kapusta", "karfiol", "zelený šalát",
        "cvikla", "pomaranč", "banán", "vajcia", "žitný chlieb", "ovsené vločky", "quinoa"
      ],
      "vitamín B12": [
        "vajcia", "hovädzie mäso", "morčacie mäso", "losos", "sardinky", "mliečne výrobky", "tempeh", "tuniak z konzervy",
        "kuracie mäso", "tuniak", "makrela", "grécky jogurt", "cottage cheese", "mozzarella",
        "ementál", "parmezán", "kefír", "tvaroh", "fortifikované rastlinné mlieko"
      ],
      "omega-3": [
        "losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka",
        "tuniak", "edamame", "vajcia obohatené omega-3", "sójové bôby", "tuniak z konzervy",
        "ľanový olej", "repkový olej", "avokádo", "mandle", "pekanové orechy", "zelená listová zelenina"
      ],
      "kurkumín": [
        "kurkuma", "zázvor", "čierne korenie", "curry", "zlaté mlieko", "kurkumový čaj", "kurkumová pasta",
        "zázvorový čaj", "korenie garam masala", "kurkumový prášok", "čerstvý zázvor", "sušený zázvor"
      ],
      "antioxidanty": [
        "čučoriedky", "jahody", "granátové jablko", "červená repa", "tmavá čokoláda", "zelený čaj", "brusnice",
        "maliny", "černice", "čerešne", "slivky", "červené hrozno", "červená kapusta", "mrkva",
        "paradajky", "špargľa", "brokolica", "špenát", "kel", "cvikla", "kakao", "orechy"
      ],
      "horčík": [
        "tmavá čokoláda 85%", "mandle", "tekvicové semienka", "špenát", "banán", "avokádo", "čierna fazuľa", "hnedá ryža",
        "kešu orechy", "lieskové orechy", "vlašské orechy", "ovsené vločky", "quinoa", "tofu", "šošovica",
        "cícer", "celozrnný chlieb", "pohánka", "sezamové semienka", "slnečnicové semienka", "edamame"
      ],
      "vitamín B6": [
        "banán", "kuracie mäso", "morčacie mäso", "losos", "zemiaky", "cícer", "avokádo", "slnečnicové semienka",
        "tuniak", "hovädzie mäso", "bataty", "špenát", "paprika", "brokolica", "mrkva",
        "melón", "sušené slivky", "pistácie", "vlašské orechy", "ovsené vločky", "hnedá ryža"
      ],
      "draslík": [
        "banán", "avokádo", "zemiaky", "bataty", "špenát", "melón", "pomaranč", "kokosová voda",
        "paradajky", "cvikla", "šošovica", "fazuľa", "hrášok", "hrozienka", "sušené marhule",
        "grécky jogurt", "mlieko", "losos", "morčacie mäso", "mandle", "arašidy"
      ],
      "kolagén-podpora": [
        "kuracie mäso", "hovädzie mäso", "vajcia", "losos", "sardinky", "kostný vývar", "slepačí vývar",
        "paprika", "jahody", "citrusy", "kiwi", "brokolica", "paradajky", "cesnak", "mrkva",
        "tekvicové semienka", "mandle", "kešu orechy", "špenát", "avokádo", "zelený čaj"
      ]
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
    reasonTemplate: "aby podporilo krvotvorbu, znížilo zápal a udržalo energiu stabilnú počas krvácania",
    nutrientReasons: {
      "železo": "dopĺňa zásoby strácané počas krvácania",
      "vitamín C": "podporuje vstrebávanie železa",
      "folát (B9)": "podporuje tvorbu nových červených krviniek",
      "vitamín B12": "pomáha udržať energiu a predísť únave",
      "omega-3": "zmierňujú zápal a menštruačné kŕče",
      "kurkumín": "má silné protizápalové účinky",
      "antioxidanty": "chránia bunky a znižujú oxidatívny stres",
      "horčík": "uvoľňuje svalové kŕče a napätie",
      "vitamín B6": "stabilizuje náladu a zmierňuje PMS príznaky",
      "draslík": "reguluje tekutiny a predchádza opuchom",
      "kolagén-podpora": "podporuje regeneráciu tkanív"
    }
  },

  follicular: {
    nutrients: {
      "proteíny": [
        "vajcia", "losos", "kuracie mäso", "morčacie mäso", "tofu", "tempeh", "grécky jogurt", "cottage cheese",
        "hovädzie mäso", "tuniak", "sardinky", "tvaroh", "quinoa", "šošovica", "cícer",
        "fazuľa", "edamame", "syr", "mozzarella", "ricotta", "kefír", "skyr"
      ],
      "omega-3": [
        "losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo",
        "tuniak", "pstruh", "sleď", "vajcia obohatené omega-3", "tofu", "edamame",
        "ľanový olej", "repkový olej", "mandle", "pekanové orechy", "zelená listová zelenina", "brokolica"
      ],
      "vláknina": [
        "ovsené vločky", "quinoa", "šošovica", "cícer", "brokolica", "jablká", "hrušky", "maliny",
        "celozrnný chlieb", "hnedá ryža", "pohánka", "fazuľa", "hrášok", "mrkva", "cvikla",
        "kapusta", "karfiol", "zeler", "uhorka", "rajčiny", "banán", "slivky"
      ],
      "B-komplex": [
        "vajcia", "losos", "kuracie mäso", "avokádo", "celozrnné pečivo", "špenát", "banán", "šošovica",
        "hovädzie mäso", "morčacie mäso", "tuniak", "sardinky", "grécky jogurt", "mlieko", "syr",
        "ovsené vločky", "quinoa", "slnečnicové semienka", "mandle", "arašidy", "hrášok"
      ],
      "zinok": [
        "tekvicové semienka", "hovädzie mäso", "cícer", "kešu orechy", "šošovica", "tofu", "quinoa", "sezamové semienka",
        "kuracie mäso", "morčacie mäso", "vajcia", "syr", "jogurt", "mlieko", "ovsené vločky",
        "celozrnný chlieb", "fazuľa", "hrášok", "mandle", "arašidy", "slnečnicové semienka"
      ],
      "vitamín E": [
        "mandle", "slnečnicové semienka", "avokádo", "olivový olej", "špargľa", "červená paprika", "mango", "kiwi",
        "lieskové orechy", "arašidy", "kel", "brokolica", "rajčiny", "mrkva", "bataty",
        "tekvicové semienka", "vlašské orechy", "žitný chlieb", "vajcia", "ryby"
      ],
      "zdravé tuky": [
        "avokádo", "olivový olej", "mandle", "vlašské orechy", "losos", "chia semienka", "kokosový olej", "mandľové maslo",
        "arašidové maslo", "kešu orechy", "lieskové orechy", "pekanové orechy", "makadamové orechy",
        "ľanové semienka", "konopné semienka", "sardinky", "makrela", "vajcia", "edamame", "tmavá čokoláda"
      ],
      "vitamín D": [
        "losos", "sardinky", "vajcia", "fortifikované mlieko", "makrela", "tuniak", "fortifikovaný jogurt",
        "fortifikované rastlinné mlieko", "maslo", "syr", "vaječný žĺtok", "hovädzia pečeň", "rybie oleje"
      ],
      "kolagén-podpora": [
        "kuracie mäso", "hovädzie mäso", "vajcia", "losos", "sardinky", "kostný vývar", "slepačí vývar",
        "paprika", "jahody", "citrusy", "kiwi", "brokolica", "paradajky", "cesnak", "mrkva",
        "tekvicové semienka", "mandle", "kešu orechy", "špenát", "avokádo", "zelený čaj"
      ]
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
    reasonTemplate: "podporia rastúcu energiu, hormonálnu rovnováhu a jasnú myseľ, ktorá je typická pre túto fázu",
    nutrientReasons: {
      "proteíny": "podporujú rast a obnovu tkanív v aktívnej fáze",
      "omega-3": "živia mozog a podporujú hormonálnu produkciu",
      "vláknina": "podporuje trávenie a detoxikáciu estrogénu",
      "B-komplex": "podporuje energetický metabolizmus a vitalitu",
      "zinok": "podporuje hormonálnu rovnováhu a imunitu",
      "vitamín E": "chráni bunky pred oxidatívnym stresom",
      "zdravé tuky": "podporujú produkciu hormónov",
      "vitamín D": "posilňuje kosti a imunitný systém",
      "kolagén-podpora": "podporuje zdravú pleť a vlasy"
    }
  },

  ovulation: {
    nutrients: {
      "folát (B9)": [
        "rímsky šalát", "kapusta", "šošovica", "cícer", "brokolica", "rukola", "avokádo", "špargľa",
        "červená fazuľa", "čierna fazuľa", "hrášok", "kel", "karfiol", "zelený šalát",
        "cvikla", "pomaranč", "banán", "vajcia", "grahamové pečivo", "ovsené vločky", "quinoa"
      ],
      "zinok": [
        "tekvicové semienka", "hovädzie mäso", "cícer", "kešu orechy", "vajcia", "tofu", "quinoa", "sezamové semienka",
        "kuracie mäso", "morčacie mäso", "šošovica", "syr", "jogurt", "mlieko", "ovsené vločky",
        "celozrnný chlieb", "fazuľa", "hrášok", "mandle", "arašidy", "slnečnicové semienka"
      ],
      "selén": [
        "para orechy", "vajcia", "losos", "sardinky", "slnečnicové semienka", "hovädzie mäso", "hnedá ryža", "šampiňóny",
        "kuracie mäso", "morčacie mäso", "tuniak", "tvaroh", "jogurt", "mlieko", "cottage cheese",
        "grahamové pečivo", "ovsené vločky", "cesnak", "cibuľa", "brokolica", "kel"
      ],
      "omega-3": [
        "losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo",
        "tuniak", "pstruh", "sleď", "vajcia obohatené omega-3", "tofu", "edamame",
        "ľanový olej", "repkový olej", "mandle", "pekanové orechy", "zelená listová zelenina", "brokolica"
      ],
      "antioxidanty": [
        "čučoriedky", "jahody", "granátové jablko", "červená paprika", "mrkva", "tmavá čokoláda", "zelený čaj", "rajčiny",
        "maliny", "černice", "čerešne", "slivky", "červené hrozno", "červená kapusta", "brokolica",
        "špenát", "kel", "cvikla", "kakao", "orechy", "avokádo", "pomaranč"
      ],
      "vitamín E": [
        "mandle", "slnečnicové semienka", "avokádo", "olivový olej", "špargľa", "kiwi", "mango", "papája",
        "lieskové orechy", "arašidy", "špenát", "brokolica", "rajčiny", "mrkva", "bataty",
        "tekvicové semienka", "vlašské orechy", "celozrnný chlieb", "vajcia", "ryby"
      ]
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
    reasonTemplate: "podporia hormonálnu rovnováhu, znížia možný zápal okolo ovulácie a dodajú čistú, stabilnú energiu",
    nutrientReasons: {
      "folát (B9)": "podporuje zdravie vajíčka a bunkové delenie",
      "zinok": "je kľúčový pre plodnosť a hormonálnu rovnováhu",
      "selén": "chráni bunky a podporuje funkciu štítnej žľazy",
      "omega-3": "znižujú zápal okolo ovulácie",
      "antioxidanty": "chránia vajíčko a podporujú plodnosť",
      "vitamín E": "chráni vajíčko pred oxidatívnym poškodením"
    }
  },

  lutealEarly: {
    nutrients: {
      "draslík": [
        "banán", "avokádo", "zemiaky", "bataty", "špenát", "melón", "kiwi", "kokosová voda",
        "paradajky", "cvikla", "šošovica", "fazuľa", "hrášok", "hrozienka", "sušené marhule",
        "grécky jogurt", "mlieko", "losos", "kuracie mäso", "mandle", "arašidy"
      ],
      "horčík": [
        "tmavá čokoláda 85%", "mandle", "tekvicové semienka", "špenát", "avokádo", "čierna fazuľa", "hnedá ryža", "banán",
        "kešu orechy", "lieskové orechy", "vlašské orechy", "ovsené vločky", "quinoa", "tofu", "šošovica",
        "cícer", "celozrnný chlieb", "pohánka", "sezamové semienka", "slnečnicové semienka", "edamame"
      ],
      "vitamín B6": [
        "banán", "morčacie mäso", "losos", "zemiaky", "cícer", "avokádo", "slnečnicové semienka", "pistácie",
        "kuracie mäso", "tuniak", "hovädzie mäso", "bataty", "špenát", "paprika", "brokolica",
        "mrkva", "melón", "sušené slivky", "vlašské orechy", "ovsené vločky", "hnedá ryža"
      ],
      "omega-3": [
        "losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo",
        "tuniak", "pstruh", "sleď", "vajcia obohatené omega-3", "tofu", "edamame",
        "ľanový olej", "repkový olej", "mandle", "pekanové orechy", "zelená listová zelenina", "brokolica"
      ],
      "bielkoviny": [
        "vajcia", "grécky jogurt", "cottage cheese", "tofu", "morčacie mäso", "losos", "tempeh", "quinoa",
        "kuracie mäso", "hovädzie mäso", "tuniak", "sardinky", "tvaroh", "šošovica", "cícer",
        "fazuľa", "edamame", "syr", "mozzarella", "ricotta", "kefír", "skyr"
      ],
      "komplexné sacharidy": [
        "bataty", "quinoa", "ovsené vločky", "hnedá ryža", "žitný chlieb", "pohánka", "cícer", "šošovica",
        "zemiaky", "fazuľa", "hrášok", "kukurica", "celozrnné cestoviny", "jačmeň", "proso",
        "bulgur", "kuskus celozrnný", "ryžové rezance", "celozrnné pečivo", "müsli"
      ],
      "vláknina": [
        "brokolica", "cuketa", "ovsené vločky", "jablká", "hrušky", "šošovica", "cícer", "maliny",
        "celozrnný chlieb", "hnedá ryža", "pohánka", "fazuľa", "hrášok", "mrkva", "cvikla",
        "kapusta", "karfiol", "zeler", "uhorka", "rajčiny", "banán", "slivky"
      ],
      "tryptofán": [
        "morčacie mäso", "vajcia", "losos", "tekvicové semienka", "edamame", "syr", "banán", "mlieko",
        "kuracie mäso", "tuniak", "tvaroh", "grécky jogurt", "ovsené vločky", "quinoa", "orechy",
        "slnečnicové semienka", "sezamové semienka", "čokoláda", "arašidy", "tofu"
      ]
    },
    benefits: [
      "pomôžeš stabilizovať náladu pri zvyšujúcom sa progesteróne",
      "znížiš zadržiavanie vody",
      "udržíš stabilnú energiu bez cravingov",
      "podporíš trávenie, ktoré sa začína spomaľovať",
      "predídeš PMS podráždenosti"
    ],
    reasonTemplate: "stabilizujú tekutiny, podporia energiu a pripravia telo na najdlhšiu fázu cyklu",
    nutrientReasons: {
      "draslík": "reguluje tekutiny a predchádza opuchom",
      "horčík": "uvoľňuje napätie a podporuje kvalitný spánok",
      "vitamín B6": "zmierňuje PMS príznaky a podporuje náladu",
      "omega-3": "znižujú zápal a podporujú mozgovú funkciu",
      "bielkoviny": "stabilizujú hladinu cukru a sýtia",
      "komplexné sacharidy": "udržiavajú stabilnú energiu bez cravingov",
      "vláknina": "podporuje trávenie, ktoré sa spomaľuje",
      "tryptofán": "podporuje tvorbu serotonínu a lepšiu náladu"
    }
  },

  lutealMid: {
    nutrients: {
      "horčík": [
        "tmavá čokoláda 85%", "mandle", "tekvicové semienka", "špenát", "avokádo", "čierna fazuľa", "hnedá ryža", "banán",
        "kešu orechy", "lieskové orechy", "vlašské orechy", "ovsené vločky", "quinoa", "tofu", "šošovica",
        "cícer", "celozrnný chlieb", "pohánka", "sezamové semienka", "slnečnicové semienka", "edamame"
      ],
      "vitamín B6": [
        "banán", "morčacie mäso", "losos", "zemiaky", "cícer", "avokádo", "slnečnicové semienka", "pistácie",
        "kuracie mäso", "tuniak", "hovädzie mäso", "bataty", "špenát", "paprika", "brokolica",
        "mrkva", "melón", "sušené slivky", "vlašské orechy", "ovsené vločky", "hnedá ryža"
      ],
      "omega-3": [
        "losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo",
        "tuniak", "pstruh", "sleď", "vajcia obohatené omega-3", "tofu", "edamame",
        "ľanový olej", "repkový olej", "mandle", "pekanové orechy", "zelená listová zelenina", "brokolica"
      ],
      "probiotiká": [
        "kefír", "grécky jogurt", "kyslá kapusta", "tempeh", "kombucha", "acidofilné mlieko",
        "jogurt s živými kultúrami", "tvaroh", "biely jogurt", "probiotické nápoje", "fermentovaná zelenina",
        "cottage cheese", "acidofilný jogurt", "kvasená repa", "domáca kyslá uhorka"
      ],
      "prebiotiká": [
        "cesnak", "cibuľa", "špargľa", "banán", "jablká", "ovsené vločky", "pór",
        "čakanka", "celozrnný chlieb", "jačmeň", "šošovica", "cícer", "fazuľa",
        "hrášok", "mrkva", "cvikla", "kapusta", "brokolica", "slivky", "hrozienka"
      ],
      "vláknina": [
        "brokolica", "cuketa", "ovsené vločky", "šošovica", "cícer", "maliny", "hrušky", "fazuľa",
        "celozrnný chlieb", "hnedá ryža", "pohánka", "hrášok", "mrkva", "cvikla",
        "kapusta", "karfiol", "zeler", "uhorka", "rajčiny", "banán", "slivky", "jablká"
      ],
      "draslík": [
        "banán", "avokádo", "zemiaky", "bataty", "špenát", "melón", "kiwi", "kokosová voda",
        "paradajky", "cvikla", "šošovica", "fazuľa", "hrášok", "hrozienka", "sušené marhule",
        "grécky jogurt", "mlieko", "losos", "kuracie mäso", "mandle", "arašidy"
      ],
      "zinok": [
        "tekvicové semienka", "hovädzie mäso", "cícer", "kešu orechy", "vajcia", "tofu", "quinoa", "sezamové semienka",
        "kuracie mäso", "morčacie mäso", "šošovica", "syr", "jogurt", "mlieko", "ovsené vločky",
        "celozrnný chlieb", "fazuľa", "hrášok", "mandle", "arašidy", "slnečnicové semienka"
      ],
      "komplexné sacharidy": [
        "bataty", "quinoa", "ovsené vločky", "hnedá ryža", "pohánka", "cícer", "šošovica", "grahamové pečivo",
        "zemiaky", "fazuľa", "hrášok", "kukurica", "celozrnné cestoviny", "jačmeň", "proso",
        "bulgur", "kuskus celozrnný", "ryžové rezance", "celozrnné pečivo", "müsli"
      ],
      "bielkoviny": [
        "vajcia", "grécky jogurt", "cottage cheese", "tempeh", "morčacie mäso", "losos", "edamame", "quinoa",
        "kuracie mäso", "hovädzie mäso", "tuniak", "sardinky", "tvaroh", "šošovica", "cícer",
        "fazuľa", "skyr", "syr", "mozzarella", "ricotta", "kefír", "tuniak z konzervy"
      ]
    },
    benefits: [
      "znížiš nafukovanie a tlak v bruchu",
      "stabilizuješ náladu počas hormonálnych výkyvov",
      "znížiš cravingy na sladké",
      "upokojíš nervový systém",
      "podporíš kvalitný spánok pri vysokom progesteróne"
    ],
    reasonTemplate: "podporia trávenie, znížia nafukovanie a stabilizujú náladu počas vysokého progesterónu",
    nutrientReasons: {
      "horčík": "zmierňuje nafukovanie a podporuje relaxáciu",
      "vitamín B6": "reguluje náladu a znižuje podráždenosť",
      "omega-3": "znižujú zápal a podporujú mozgovú funkciu",
      "probiotiká": "podporujú trávenie a črevnú mikroflóru",
      "prebiotiká": "živia prospešné baktérie v črevách",
      "vláknina": "podporuje spomalené trávenie",
      "draslík": "reguluje tekutiny a znižuje opuchy",
      "zinok": "podporuje imunitu a hormonálnu rovnováhu",
      "komplexné sacharidy": "udržiavajú stabilnú energiu počas vysokého progesterónu",
      "bielkoviny": "stabilizujú hladinu cukru a predchádzajú cravingom"
    }
  },

  lutealLate: {
    nutrients: {
      "horčík": [
        "tmavá čokoláda 85%", "mandle", "tekvicové semienka", "špenát", "avokádo", "čierna fazuľa", "hnedá ryža", "banán",
        "kešu orechy", "lieskové orechy", "vlašské orechy", "ovsené vločky", "quinoa", "tofu", "šošovica",
        "cícer", "grahamové pečivo", "pohánka", "sezamové semienka", "slnečnicové semienka", "edamame"
      ],
      "vitamín B6": [
        "banán", "morčacie mäso", "losos", "zemiaky", "cícer", "avokádo", "slnečnicové semienka", "pistácie",
        "kuracie mäso", "tuniak", "hovädzie mäso", "bataty", "špenát", "paprika", "brokolica",
        "mrkva", "melón", "sušené slivky", "vlašské orechy", "ovsené vločky", "hnedá ryža"
      ],
      "omega-3": [
        "losos", "sardinky", "makrela", "chia semienka", "ľanové semienka", "vlašské orechy", "konopné semienka", "avokádo",
        "tuniak", "pstruh", "sleď", "vajcia obohatené omega-3", "tofu", "edamame",
        "ľanový olej", "repkový olej", "mandle", "pekanové orechy", "zelená listová zelenina", "brokolica"
      ],
      "vitamín E": [
        "mandle", "slnečnicové semienka", "avokádo", "olivový olej", "špargľa", "kiwi", "mango", "papája",
        "lieskové orechy", "arašidy", "rukola", "brokolica", "rajčiny", "mrkva", "bataty",
        "tekvicové semienka", "vlašské orechy", "žitný chlieb", "vajcia", "ryby"
      ],
      "antioxidanty": [
        "čučoriedky", "jahody", "maliny", "granátové jablko", "tmavá čokoláda", "zelený čaj", "brusnice",
        "černice", "čerešne", "slivky", "červené hrozno", "červená kapusta", "mrkva", "brokolica",
        "špenát", "kel", "cvikla", "kakao", "orechy", "avokádo", "pomaranč", "rajčiny"
      ],
      "kurkumín": [
        "kurkuma", "zázvor", "čierne korenie", "curry", "zlaté mlieko", "kurkumový čaj", "zázvorový čaj",
        "korenie garam masala", "kurkumový prášok", "čerstvý zázvor", "sušený zázvor", "kurkumová pasta"
      ],
      "vláknina": [
        "ovsené vločky", "šošovica", "cícer", "jablká", "hrušky", "brokolica", "maliny", "fazuľa",
        "celozrnný chlieb", "hnedá ryža", "pohánka", "hrášok", "mrkva", "cvikla",
        "kapusta", "karfiol", "zeler", "uhorka", "rajčiny", "banán", "slivky"
      ],
      "bielkoviny": [
        "vajcia", "grécky jogurt", "tempeh", "cottage cheese", "losos", "morčacie mäso", "edamame", "quinoa",
        "kuracie mäso", "hovädzie mäso", "tuniak", "sardinky", "tvaroh", "šošovica", "cícer",
        "fazuľa", "tuniak z konzervy", "syr", "mozzarella", "ricotta", "kefír", "skyr"
      ],
      "kolagén-podpora": [
        "kuracie mäso", "hovädzie mäso", "vajcia", "losos", "sardinky", "kostný vývar", "slepačí vývar",
        "paprika", "jahody", "citrusy", "kiwi", "brokolica", "paradajky", "cesnak", "mrkva",
        "tekvicové semienka", "mandle", "kešu orechy", "špenát", "avokádo", "zelený čaj"
      ]
    },
    benefits: [
      "znížiš podráždenosť a PMS",
      "zlepšíš spánok",
      "podporíš uvoľnenie napätých svalov",
      "znížiš zápal a bolesť",
      "stabilizuješ energiu v najcitlivejšej časti cyklu"
    ],
    reasonTemplate: "upokojiť telo pred menštruáciou, znížiť zápal a podporiť stabilnú energiu",
    nutrientReasons: {
      "horčík": "uvoľňuje kŕče a pripravuje telo na menštruáciu",
      "vitamín B6": "zmierňuje PMS príznaky a stabilizuje náladu",
      "omega-3": "znižujú zápal a menštruačné bolesti",
      "vitamín E": "chráni bunky a zmierňuje citlivosť",
      "antioxidanty": "znižujú zápal pred menštruáciou",
      "kurkumín": "má protizápalové účinky a zmierňuje bolesť",
      "vláknina": "podporuje pravidelné trávenie",
      "bielkoviny": "udržiavajú stabilnú energiu",
      "kolagén-podpora": "podporuje regeneráciu tkanív"
    }
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
  
  // Format: 3 sentences with dynamic reasons based on first 2 nutrients
  const nutrientsStr = selectedNutrients.join(', ');
  const foodsStr = foods.join(', ');
  
  // Build dynamic reason from first 2 selected nutrients
  const reason1 = master.nutrientReasons?.[selectedNutrients[0]] || '';
  const reason2 = master.nutrientReasons?.[selectedNutrients[1]] || '';
  const dynamicReason = reason1 && reason2 
    ? `${selectedNutrients[0]} ${reason1} a ${selectedNutrients[1]} ${reason2}`
    : master.reasonTemplate;
  
  return `Tvoje telo dnes potrebuje ${nutrientsStr} — ${dynamicReason}.\n\nNájdeš ich v potravinách ako ${foodsStr}.\n\nTento výber ti dnes pomôže ${selectedBenefit}.`;
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
