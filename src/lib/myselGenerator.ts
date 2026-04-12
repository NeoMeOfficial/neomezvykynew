import { seededShuffle } from './cycleTipsGenerator';

// ─────────────────────────────────────────────────────────────────────────────
// MASTER_MYSEL — Mindset content per cycle subphase
//
// Subphase keys match getMasterKey() in cycleTipsGenerator.ts:
//   menstrualEarly | menstrualMid | menstrualLate
//   follicular | ovulation
//   lutealEarly | lutealMid | lutealLate
//
// Each subphase has 4 content pools — seeded shuffle ensures daily variety:
//   affirmations    — short mantras, permission statements
//   journalPrompts  — "Napíš o..." writing prompts
//   breathingSteps  — named breathing exercises with instructions
//   reframes        — cognitive reframes, mindset shifts
// ─────────────────────────────────────────────────────────────────────────────

export interface BreathingExercise {
  name: string;
  steps: string;
}

export interface MindsetContent {
  affirmation: string;
  journalPrompt: string;
  breathing: BreathingExercise;
  reframe: string;
}

export const MASTER_MYSEL: Record<string, {
  affirmations: string[];
  journalPrompts: string[];
  breathingExercises: BreathingExercise[];
  reframes: string[];
}> = {

  // ─── MENSTRUAL EARLY (Days 1–2): Heaviest flow, peak pain, deep withdrawal ───

  menstrualEarly: {
    affirmations: [
      "Moje telo vie, čo robí. Dôverujem mu.",
      "Odpočinok nie je lenivosť — je to múdrosť.",
      "Mám dovolenie byť dnes pomalá.",
      "Starám sa o seba bez výčitiek svedomia.",
      "Moje telo pracuje pre mňa, nie proti mne.",
      "Dnešný deň je pre ticho a starostlivosť.",
      "Som presne tam, kde mám byť.",
      "Spomaľujem a to je v poriadku.",
      "Každý cyklus mi prináša novú verziu seba.",
      "Mám právo na pokoj, keď ho potrebujem.",
      "Moje potreby sú dôležité a zaslúžia si pozornosť.",
      "Telo mi hovorí: zastav. Ja počúvam."
    ],
    journalPrompts: [
      "Napíš o tom, čo dnes tvoje telo potrebuje najviac.",
      "Čo by si si dnes dovolila pustiť? Čo ťa zaťažuje?",
      "Napíš list svojmu telu — čo mu chceš povedať?",
      "Aké emócie sa dnes vynárajú na povrch? Pomenuj ich bez hodnotenia.",
      "Čo by si dnes potrebovala od ostatných, ale ešte si o to nepožiadala?",
      "Napíš o jednej veci, za ktorú si dnes vďačná — hoci aj malej.",
      "Ako sa teraz cítiš vo svojom tele? Opíš to bez filtrov.",
      "Čo by ti povedala vaša najláskavejšia priateľka, keby ťa videla práve teraz?",
      "Aké myšlienky ti dnes bránia odpočívať? Napíš ich von.",
      "Napíš o momente z posledného mesiaca, kedy si sa cítila silná.",
      "Čoho sa dnes vzdávaš, aby si sa lepšie cítila?",
      "Napíš o tom, čo by v živote vyzeralo inak, keby si sa pravidelne zastavovala a načúvala svojmu telu."
    ],
    breathingExercises: [
      {
        name: "4-7-8 dych — úľava od kŕčov",
        steps: "Nadýchnite sa nosom na 4 doby. Zadržte dych na 7 dôb. Pomaly vydýchnite ústami na 8 dôb. Opakujte 4×. Spomaľuje nervový systém a zmierňuje kŕče."
      },
      {
        name: "Brušný dych — teplo a uvoľnenie",
        steps: "Položte ruky na brucho. Nadýchnite sa nosom tak, aby sa brucho zdvihlo (nie hrudník). Vydýchnite pomaly ústami. Opakujte 8–10×. Podporuje prekrvenie panvy."
      },
      {
        name: "Predĺžený výdych — pokoj",
        steps: "Nadýchnite sa nosom na 4 doby. Vydýchnite ústami na 8 dôb — dvakrát dlhšie ako nádych. Opakujte 5×. Aktivuje parasympatikus a prináša okamžitý pokoj."
      },
      {
        name: "Sighing dych — uvoľnenie napätia",
        steps: "Nadýchnite sa nosom naplno. Potom pridajte malý extra nádych na vrchole. Vydýchnite ústami ako dlhý vzdych. Opakujte 3–5×. Okamžite znižuje napätie v tele."
      },
      {
        name: "Box breathing — stabilita",
        steps: "Nadýchnite sa na 4 doby. Zadržte na 4. Vydýchnite na 4. Zadržte na 4. Opakujte 5–6 kôl. Uzemňuje a stabilizuje, keď sa emócie cítia príliš intenzívne."
      }
    ],
    reframes: [
      "Tvoje telo dnes robí obrovskú prácu. Únava je prirodzená odpoveď, nie slabosť.",
      "Zastavenie sa nie je vzdanie sa — je to priestor pre obnovu.",
      "Každý veľký stroj potrebuje restart. Ty si teraz v tom procese.",
      "Nemusíš byť produktívna každý deň. Dnes je deň na bytie, nie na robenie.",
      "Ak by tvoja priateľka cítila to, čo ty — povedala by si jej, nech si oddýchne. Urob to isté pre seba.",
      "Bolesť je správa od tela, nie trest. Povedz jej: počujem ťa.",
      "Spomalenie v tejto fáze ti dá viac energie v tej ďalšej. Je to investícia.",
      "Nejde o to, koľko toho zvládneš. Ide o to, ako sa o seba postaráš.",
      "Tvoje telo vytvára nový začiatok. To si zaslúži úctu, nie tlak.",
      "Cyklus tvojho tela je múdrosť miliónov rokov evolúcie. Dôveruj mu.",
      "To, čo dnes odpustíš sebe, ti zajtra vráti dvojnásobok energie.",
      "Zaobchádzaj so sebou dnes s rovnakou nežnosťou, akú by si dala malému dieťaťu."
    ]
  },

  // ─── MENSTRUAL MID (Days 3–4): Still low, peak introspection, slight clearing ───

  menstrualMid: {
    affirmations: [
      "Nežnosť voči sebe je sila, nie slabosť.",
      "Môžem byť pomalá a stále hodnotná.",
      "Moje emócie sú platné presne také, aké sú.",
      "Zaslúžim si rovnakú starostlivosť, akú dávam ostatným.",
      "Tento pocit je dočasný. Prechádza.",
      "Nachádzam krásu v tichých chvíľach.",
      "Dovolím si cítiť bez toho, aby som to riešila.",
      "Každý deň tohto cyklu má svoju hodnotu — aj tento.",
      "Počúvam svoje telo a rešpektujem jeho tempo.",
      "Moja citlivosť je dar, nie bremeno.",
      "Jsem presne dosť, práve teraz.",
      "V tichu nájdem to, čo hluk skrýva."
    ],
    journalPrompts: [
      "Čo ti tento cyklus priniesol? Čo si sa o sebe dozvedela?",
      "Aké emócie sú teraz v tvojom tele? Kde ich cítiš fyzicky?",
      "Napíš o vzťahu, situácii alebo myšlienke, ktorá ťa momentálne zaťažuje.",
      "Čo by si chcela od seba počuť práve teraz?",
      "Napíš o jednom spôsobe, ako si dnes preukázala láskavosť voči sebe.",
      "Čo si v poslednom mesiaci objavila o svojich potrebách?",
      "Ak by tvoje telo mohlo hovoriť, čo by ti povedalo?",
      "Aké hranice by si chcela nastaviť v nasledujúcom cykle?",
      "Napíš o troch veciach, ktoré ti v tomto cykle dávali silu.",
      "Čo chceš v ďalšom cykle robiť inak — a prečo?",
      "Aký moment z tohto mesiaca by si chcela zachovať v pamäti?",
      "Napíš o jednej veci, na ktorú si dnes hrdá."
    ],
    breathingExercises: [
      {
        name: "Striedavý nosný dych — rovnováha",
        steps: "Pravým palcom uzavrite pravú nosnú dierku. Nadýchnite sa ľavou na 4 doby. Uzavrite ľavou na 4. Vydýchnite pravou na 4. Opakujte 6×, striedajúc strany. Harmonizuje ľavú a pravú mozgovú hemisféru."
      },
      {
        name: "4-7-8 dych — emocionálna stabilita",
        steps: "Nadýchnite sa nosom na 4 doby. Zadržte na 7. Vydýchnite pomaly na 8. Opakujte 4×. Pomáha, keď sú emócie intenzívnejšie než zvyčajne."
      },
      {
        name: "Chladivý dych — upokojenie mysle",
        steps: "Jemne skrúťte jazyk do trubičky (alebo urobte mierny úsmev). Nadýchnite sa cez ústa chladným vzduchom. Vydýchnite nosom. Opakujte 8×. Ochladzuje nervový systém a upokojuje myseľ."
      },
      {
        name: "Uzemňujúci dych — prítomnosť",
        steps: "Nadýchnite sa pomaly nosom na 5 dôb. Vydýchnite na 5 dôb. Počas každého výdychu si predstavte, že pustíte jednu starosť dolu do zeme. Opakujte 6×."
      },
      {
        name: "Brušný dych — sebaúcta",
        steps: "Ľahnite si alebo si pohodlne sadnite. Položte ruku na srdce, druhú na brucho. Dýchajte hlboko — pri každom nádychu si v mysli hovorte 'som dosť', pri výdychu 'som v poriadku'. 10 nádychov."
      }
    ],
    reframes: [
      "Citlivosť, ktorú cítiš teraz, je tvoja superschopnosť — len v inom obal.",
      "Nič, čo cítiš, nie je zlé. Emócie sú informácie, nie súdenie.",
      "Nemusíš vyriešiť nič dnešný deň. Dovolíš si len byť.",
      "Tvoje telo pracuje v rytme, ktorý existoval dávno pred tebou. Si jeho súčasťou.",
      "Ťažkosť, ktorú nesieš, je dočasná. Energia sa vracia — vždy.",
      "Keby si dnes nebola ničím iným len jemná voči sebe, stačilo by to.",
      "Každé 'toto je príliš' je pozvánka: zober si priestor, ktorý potrebuješ.",
      "Odpočinutá matka, partnerka a žena je silnejšia než vyčerpaná hrdinka.",
      "Táto fáza ťa učí zastaviť. Čo by si videla, keby si sa zastavila?",
      "V tichosti tohto cyklu leží zrno tvojej budúcej sily.",
      "Tvoje pocity sú reálne a zaslúžia si priestor — bez omlúv.",
      "Zaobchádzaš so sebou tak, ako chceš, aby sa ostatní správali k tebe."
    ]
  },

  // ─── MENSTRUAL LATE (Days 5+): Energy lifting, anticipation, renewal ───

  menstrualLate: {
    affirmations: [
      "Cítim, ako sa energia začína vracať.",
      "Každý koniec je zároveň novým začiatkom.",
      "Prechádzam do novej kapitoly svojho cyklu.",
      "Som pripravená pomaly sa otvárať svetu znova.",
      "Dôverujem procesu môjho tela — vie, čo robí.",
      "Prešla som ťažkým, teraz si dovolím ľahšie.",
      "Obnova prichádza prirodzene, keď jej dovolím.",
      "Teším sa na nadchádzajúcu energiu a možnosti.",
      "Každý cyklus ma robí silnejšou a múdrejšou.",
      "Zaslúžim si to, čo prichádza — radosť, silu, ľahkosť.",
      "Nový začiatok je len za rohom.",
      "Prešla som cez to. Som pripravená na nový cyklus."
    ],
    journalPrompts: [
      "Napíš o troch veciach, na ktoré sa teraz tešíš.",
      "Čo si sa o sebe dozvedela počas tejto menštruácie?",
      "Aký jeden zámer si chceš stanoviť pre nový cyklus?",
      "Napíš o tom, čo chceš v nadchádzajúcich týždňoch vytvoriť alebo začať.",
      "Čo si v posledných dňoch pustila — a ako sa teraz cítiš bez toho?",
      "Aký dar ti prinieslo spomalenie počas menštruácie?",
      "Napíš o tom, kto alebo čo ťa cez tieto dni podporovalo.",
      "Ako chceš o seba pečovať v nasledujúcom cykle lepšie než minule?",
      "Aká verzia teba čaká na druhej strane tohto cyklu?",
      "Napíš si jedno mocné slovo pre nový cyklus — a čo pre teba znamená.",
      "Čo by si chcela nechať za sebou? Napíš to a potom to prečítaj nahlas.",
      "Napíš o tom, ako by vyzeral tvoj ideálny deň, keď príde plná energia."
    ],
    breathingExercises: [
      {
        name: "Trojdielny dych — prebúdzanie",
        steps: "Nadýchnite sa najprv do brucha (1. tretina), potom do hrudníka (2. tretina), potom pod kľúčne kosti (3. tretina). Vydýchnite pomaly v opačnom poradí. Opakujte 6×. Prebúdza telo k novej energii."
      },
      {
        name: "Energizujúci dych — nový začiatok",
        steps: "Seďte vzpriamene. Nadýchnite sa nosom na 3 doby, krátko. Vydýchnite silno ústami s tichým 'ha'. Opakujte 8×. Prebúdza energiu a pripravuje telo na aktívnejšiu fázu."
      },
      {
        name: "Kruhový dych — plynulosť",
        steps: "Dýchajte plynulo — bez pauzy medzi nádychom a výdychom, ako keby dych tvoril nepretržitý kruh. Pomalé, rytmické, 2 min. Symbolizuje plynulý prechod do novej fázy cyklu."
      },
      {
        name: "Dych vďačnosti — prijatie",
        steps: "Nadýchnite sa a v mysli si povedzte niečo, za čo ste vďačná. Vydýchnite a pustite to von do sveta. 8 nádychov — 8 vďačností. Naladí myseľ na pozitívne očakávanie."
      },
      {
        name: "Box breathing — sústredenie",
        steps: "Nadýchnite sa na 4 doby. Zadržte na 4. Vydýchnite na 4. Zadržte na 4. Opakujte 6 kôl. Sústredí myseľ a pomáha začleniť zámer pre nový cyklus."
      }
    ],
    reframes: [
      "Prešla si najnáročnejšou časťou — teraz sa otváraš. To si zaslúži oslávenie.",
      "Energia, ktorá sa vracia, je tvoja — nie cudzia. Čakala na teba.",
      "Každý cyklus, cez ktorý prejdeš, ťa robí odolnejšou a múdrejšou.",
      "Nový začiatok nie je vzdialený — začína každým nádychom.",
      "Nie si rovnaká, ako si bola pred menštruáciou. Niečo sa v tebe preformovalo.",
      "Čas, ktorý si si dala na odpočinok, nie je stratený — bol investovaný.",
      "Tvoje telo práve dokončilo niečo zázračné. Si silná.",
      "Otváranie sa svetu začína otvárať sa sebe. Si na dobrej ceste.",
      "Toto, čo prichádza — ľahkosť, energia, motivácia — je tvoje právo.",
      "Niesla si ťarchu s grácou. Teraz si dovoľ ju spustiť.",
      "Prechod, ktorý si zažila, má svoju hodnotu. Niesieš v sebe múdrosť cyklu.",
      "Každé ráno v tejto fáze ťa privíta o čosi viac teba samej."
    ]
  },

  // ─── FOLLICULAR: Rising energy, optimism, creativity, new projects ───

  follicular: {
    affirmations: [
      "Som pripravená na nový začiatok.",
      "Moja energia rastie a ja ju vitám.",
      "Verím v seba a vo svoje schopnosti.",
      "Toto je môj čas rásť a tvoriť.",
      "Mám odvahu začať niečo nové.",
      "Som otvorená možnostiam, ktoré prúdia do môjho života.",
      "Každý krok, aj malý, ma posúva vpred.",
      "Tvorím so zámerom a radosťou.",
      "Moje sny sú dosiahnuteľné — začínam dnes.",
      "Rastiem. Mením sa. A to je krásne.",
      "Som v správnom čase pre správny krok.",
      "Vitám príležitosti, ktoré táto fáza prináša."
    ],
    journalPrompts: [
      "Aký projekt alebo cieľ by si chcela v tomto cykle posunúť dopredu?",
      "Napíš o niečom, o čom dlho snívaš, ale ešte si nezačala. Čo ti stojí v ceste?",
      "Keby si nemohla zlyhať, čo by si skúsila?",
      "Aká verzia seba žiješ teraz — a aká verzia na teba čaká?",
      "Napíš o troch veciach, ktoré ťa teraz napĺňajú radosťou alebo nadšením.",
      "Čo by si sa chcela naučiť alebo objaviť v tomto cykle?",
      "Napíš o jednom malom kroku, ktorý môžeš urobiť dnes smerom k svojmu snu.",
      "Koho chceš byť o mesiac? Opíš ju konkrétne.",
      "Aké nové návyky alebo rutiny chceš vyskúšať?",
      "Napíš o oblasti svojho života, kde cítiš, že chceš rásť.",
      "Čo by si povedala žene, ktorá sa bojí začať? Napíš jej list.",
      "Aké sú tvoje tri najväčšie sily a ako ich môžeš tento cyklus využiť?"
    ],
    breathingExercises: [
      {
        name: "Kapalabhati — čistenie a energia",
        steps: "Seďte vzpriamene. Robte krátke, silné výdychy nosom (ako keby ste sfukovali sviečky rýchlo) — nádych nastane automaticky. Začnite pomalšie: 1 výdych za sekundu, 30 opakovaní. Silno prebúdza, čistí a energizuje."
      },
      {
        name: "Dych leva — odvaha a sebavyjadrenie",
        steps: "Nadýchnite sa hlboko nosom. Na výdychu otvorte ústa naplno, vyplazite jazyk a vydýchnite silno s tichým 'haaaa'. Uvoľňuje napätie v tvári a hrdle, podporuje sebavedomie. 5×."
      },
      {
        name: "Energizujúci 3-2-1 dych",
        steps: "Nadýchnite sa nosom na 3 doby. Zadržte na 2. Vydýchnite silno ústami na 1 dobu — razantne. Opakujte 8×. Rýchlo zvyšuje energiu a bdelosť."
      },
      {
        name: "Zámerný dych — vizualizácia",
        steps: "Nadýchnite sa na 5 dôb a predstavte si, ako vdychujete možnosti a príležitosti. Vydýchnite na 5 dôb a predstavte si, ako pustíte pochybnosti. 8 nádychov. Naladí myseľ na rast."
      },
      {
        name: "Striedavý nosný dych — kreativita",
        steps: "Striedajte ľavú a pravú nosnú dierku po 4 nádychy. 6 kôl. Harmonizuje obe mozgové hemisféry — analytickú aj kreatívnu — pre optimálny výkon."
      }
    ],
    reframes: [
      "Energia, ktorú cítiš, nie je náhoda — je to biologický dar tejto fázy. Využi ho.",
      "Začiatok je vždy najťažší, ale práve teraz je tvoje telo na to najlepšie pripravené.",
      "Nepotrebuješ dokonalý plán. Potrebuješ prvý krok.",
      "Kreativita, ktorá v tebe prúdi, chce byť vyjadrená — daj jej priestor.",
      "Táto fáza je ako jar: čo zasadíš teraz, budeš žať neskôr.",
      "Máš dovolenie byť ambiciózna, smelá, a snívať veľko.",
      "Optimizmus, ktorý cítiš, nie je naivita — je to hormonálna múdrosť tela.",
      "Čo by sa stalo, keby si tej energii dnes plne dôverovala?",
      "Každý veľký výsledok začal rovnako — malým rozhodnutím začať.",
      "Nové začiatky si nevyžadujú dokonalé okolnosti. Len rozhodnutie.",
      "Energia tejto fázy je obmedzená — nie vo večnosti, ale na týždeň-dva. Vitaj v nej.",
      "Tvorenie nie je luxus. Je to tvoja prirodzenosť."
    ]
  },

  // ─── OVULATION: Peak confidence, social, expressive, magnetic ───

  ovulation: {
    affirmations: [
      "Žiarim naplno a dovoľujem si to.",
      "Môj hlas má váhu a zaslúži si byť vypočutý.",
      "Som magnetická, sebavedomá a pripravená.",
      "Dôverujem sebe v každej situácii.",
      "Prináším hodnotu do každého priestoru, do ktorého vstupujem.",
      "Som v spojení so svojou silou a grácou.",
      "Môj vplyv je reálny a pozitívny.",
      "Teším sa zo spojenia s ľuďmi okolo mňa.",
      "Som viditeľná a to je v poriadku.",
      "Vyjadrím sa s istotou a jasnosťou.",
      "Moje dary patria svetu.",
      "Dnes som tou najlepšou verziou seba."
    ],
    journalPrompts: [
      "Aký pozitívny dopad chceš mať na ľudí okolo seba?",
      "Kto sú ľudia, s ktorými chceš byť viac v kontakte? Ako to urobíš?",
      "Napíš o chvíli, kedy si sa cítila naozaj sebavedomá a silná. Čo tomu predchádzalo?",
      "Aké rozhodnutia alebo konverzácie si odkladáš? Teraz je čas — napíš prvý krok.",
      "Čo chceš povedať svetu? Napíš to tu najprv.",
      "Aké sú tvoje najsilnejšie vlastnosti? Napíš o každej konkrétnu situáciu, kde sa prejavila.",
      "Napíš o svojom sne, akoby sa už stal. Čo vidíš, cítiš, počuješ?",
      "Koho inšpiruješ — aj keď o tom nevieš? Napíš im list.",
      "Čo by si urobila, keby si vedela, že uspeje?",
      "Napíš o jednej veci, na ktorú si skutočne hrdá.",
      "Ako vyzerá tvoj najodvážnejší krok teraz? Čo ti hovorí intuícia?",
      "Aké slová by si chcela, aby o tebe hovorili ostatní? Naplňuješ ich?"
    ],
    breathingExercises: [
      {
        name: "Ujjayi dych — sila a prítomnosť",
        steps: "Dýchajte nosom s jemným stlačením hrdla (ako zahmlievanie zrkadla, ale ústami zatvorenými). Zvuk pripomína tichý oceán. Nadýchnite sa 4 doby, vydýchnite 4 doby. 10 nádychov. Centruje, dodáva silu a prítomnosť."
      },
      {
        name: "Mocný dych — sebavedomie",
        steps: "Vstaňte, nohy na šírku ramien. Nadýchnite sa hlboko a zdvihnite ruky nad hlavu. Na výdychu nimi prudko švihnite dole a vydýchnite silno ústami. 8×. Aktivuje fyzické sebavedomie."
      },
      {
        name: "Dych pred výstupom — sústredenie",
        steps: "Nadýchnite sa nosom na 6 dôb. Zadržte na 2. Vydýchnite pomaly nosom na 6 dôb. Opakujte 5×. Ideálne pred dôležitou prezentáciou, stretnutím alebo rozhovorom."
      },
      {
        name: "4-7-8 dych — zakotvenie energie",
        steps: "Aj pri vrcholnej energii je zakotvenie dôležité. Nadýchnite sa na 4. Zadržte na 7. Vydýchnite na 8. 4 kolá. Usmerní energiu, aby pracovala pre vás, nie vás rozptyľovala."
      },
      {
        name: "Dych vďačnosti za silu",
        steps: "Seďte vzpriamene, ruka na srdci. Nadýchnite sa a myslite na niečo, za čo ste na seba hrdá. Vydýchnite to von — zdieľajte tú hrdosť so svetom. 6 nádychov."
      }
    ],
    reframes: [
      "Energie a sebavedomia, ktoré teraz cítiš, sú reálne — nie performatívne. Nech ťa vedú.",
      "Nie je egoistické žiariť. Tvoje svetlo ukazuje cestu aj ostatným.",
      "Ľudia okolo teba potrebujú teba v tvojej plnej forme — nie jej tieni.",
      "Táto fáza je ako hlavné javisko tvojho cyklu. Si pripravená naň vstúpiť.",
      "Hovoriť nahlas, keď niečo vieš, nie je trúfalosť — je to zodpovednosť.",
      "Sebadôvera nie je o tom, nemať pochybnosti. Je o tom, konať aj s nimi.",
      "Magnetizmus, ktorý cítiš, je biologický — telo sa pripravuje na spojenie. Využi ho.",
      "Čo robíš dnes, ovplyvní ľudí viac než inokedy. Ako tú energiu smeruješ?",
      "Keď sa prihlásíš, inšpiruješ tých, ktorí sa ešte báť prihlásiť.",
      "Tvoj hlas sa počíta. Tvoje nápady sa počítajú. Ty sa počítaš.",
      "Táto verzia teba existuje len pár dní v mesiaci. Využi ju naplno.",
      "Veľké veci sa dejú, keď najlepšia verzia teba povie áno."
    ]
  },

  // ─── LUTEAL EARLY: Turning inward, still energetic, completion focus ───

  lutealEarly: {
    affirmations: [
      "Spomaľujem s grácou a zámerom.",
      "Oceňujem všetko, čo som tento cyklus vytvorila.",
      "Spomaľovanie je múdrosť, nie neúspech.",
      "Som vďačná za energiu, ktorú mám, a rešpektujem jej zmeny.",
      "Dokončujem s dôstojnosťou a hrdosťou.",
      "Viem, kedy pridať, a viem, kedy zbaliť.",
      "Starám sa o seba aj v produktívnych dňoch.",
      "Môj pokoj má hodnotu rovnako ako moja aktivita.",
      "Zachovám energiu na to, čo je skutočne dôležité.",
      "Nachádzam krásu v uzatváraní vecí.",
      "Dokončenie je rovnako cenné ako začiatok.",
      "Prijímam zmeny, ktoré prichádzajú — s dôverou."
    ],
    journalPrompts: [
      "Čo všetko si v tomto cykle vytvorila alebo dokončila? Oslávte to na papieri.",
      "Na čo sú teraz tvoje energie — a na čo ich nechceš míňať?",
      "Aké tri veci chceš dokončiť predtým, než príde menštruácia?",
      "Napíš o vzťahu alebo situácii, na ktorú chceš venovať viac pozornosti.",
      "Ako vyzerá pre teba 'dosť'? Kde je tvoja hranica dnes?",
      "Napíš o jednej dobrej veci, ktorú si pre seba v tomto cykle urobila.",
      "Čo by sa stalo, keby si povedala nie jednému zaväzku, ktorý ťa vyčerpáva?",
      "Napíš o tom, ako ti slúžia (alebo neslúžia) tvoje aktuálne rutiny.",
      "Komu alebo čomu ste vďačná za podporu v tomto cykle?",
      "Čo chceš v nasledujúcom cykle robiť viac — a čo menej?",
      "Napíš o jednej lekcii, ktorú ti priniesol tento cyklus.",
      "Ako sa dnes staráš o svoju dušu, nielen o svoju produktivitu?"
    ],
    breathingExercises: [
      {
        name: "Striedavý nosný dych — rovnováha",
        steps: "Striedajte ľavú a pravú nosnú dierku po 4 doby. 8 kôl. Udržuje rovnováhu v čase, kedy hormóny začínajú meniť smer — harmonizuje nervový systém."
      },
      {
        name: "Predĺžený výdych — odpustenie záťaže",
        steps: "Nadýchnite sa na 4 doby. Vydýchnite na 8 dôb — dvakrát dlhšie. Opakujte 6×. Aktivuje parasympatikus, spomaľuje bez toho, aby zastavilo."
      },
      {
        name: "Kohérentný dych — srdcová harmónia",
        steps: "Dýchajte rovnomerne: 5 sekúnd nádych, 5 sekúnd výdych. Bez pauzy. 5 minút. Synchronizuje srdcovú variabilitu a prináša hlboký pokoj pri zachovaní bdelosti."
      },
      {
        name: "Zámerný výdych — prioritizácia",
        steps: "Nadýchnite sa a myslite na všetko, čo máte na tanieri. Na výdychu (pomaly, 6 dôb) si v mysli pustite jedno bremeno, ktoré nie je teraz prioritou. 8 nádychov."
      },
      {
        name: "Box breathing — jasnosť",
        steps: "4 doby nádych, 4 zadržanie, 4 výdych, 4 zadržanie. 6 kôl. Pomáha rozlíšiť, čo je dôležité a čo je len hluk."
      }
    ],
    reframes: [
      "Dokončovanie je rovnako hodnotné ako začínanie. Teraz si v žatve.",
      "Spomalenie teraz nie je ústup. Je to príprava na hlbší oddych.",
      "Energia, ktorú šetríš dnes, ti dá silu v dňoch, keď ju budeš potrebovať.",
      "Môžeš byť produktívna aj bez toho, aby si sa vyčerpala.",
      "Hranice, ktoré nastavíš teraz, chránia tvoju budúcu energiu.",
      "Kvalita tvojej pozornosti je teraz dôležitejšia než kvantita výkonu.",
      "Čo dokončíš dnes s láskou, bude mať trvalú hodnotu.",
      "Selektívnosť nie je lenivosť — je to múdrosť.",
      "Tvoja energia je vzácna. Zaslúži si byť investovaná dobre.",
      "Nie všetko musíš urobiť ty. A nie všetko musíš urobiť teraz.",
      "Dôveruješ sebe, že vieš, čo je dôležité. A vieš to.",
      "Graceful slowdown — to je umenie tejto fázy. A ty ho ovládaš."
    ]
  },

  // ─── LUTEAL MID: PMS beginning, emotional, sensitive, irritable ───

  lutealMid: {
    affirmations: [
      "Moje emócie sú platné a majú zmysel.",
      "Citlivosť je dar, aj keď sa tak nezdá.",
      "Mám dovolenie cítiť všetko, čo cítim.",
      "Dáva mi to, čo potrebujem, nie to, čo si myslím, že si zaslúžim.",
      "Môžem byť náročná a stále milovaná.",
      "To, čo cítim, je dočasné. Prechádza.",
      "Starám sa o seba s nežnosťou, keď to potrebujem najviac.",
      "Moje potreby sú legitímne — aj keď sa zdajú veľké.",
      "Dovoľujem si byť ľudská, nie dokonalá.",
      "Táto fáza mi ukazuje, čo skutočne potrebujem.",
      "Pohyblivé hormóny nepohybujú mojou hodnotou.",
      "Som viac než to, čo cítim dnes."
    ],
    journalPrompts: [
      "Čo ťa teraz dráždi viac než zvyčajne? Čo ti to hovorí o tvojich potrebách?",
      "Napíš o emócii, ktorú cítiš, bez toho, aby si ju súdila. Len ju opíš.",
      "Čoho ti momentálne chýba — a ako by si si to mohla dať sama sebe?",
      "Aké hranice potrebuješ nastaviť, aby si sa cítila lepšie?",
      "Napíš o jednom vzťahu alebo situácii, ktorá ťa teraz emocionálne zaťažuje.",
      "Čo by ti pomohlo cítiť sa bezpečnejšie práve teraz?",
      "Napíš o jednej veci, ktorú by si chcela od svojho partnera, rodiny alebo priateľov — a ešte si to nepovedala.",
      "Aké myšlienky ťa dnes prenasledujú? Napíš ich — sú len myšlienky, nie fakty.",
      "Čo robíš, keď sa cítiš preťažená? Pomáha ti to?",
      "Napíš o jednej malej veci, ktorá ti prinesie pokoj dnes.",
      "Čo ti hovorí tvoje telo, keď je emočne vyčerpané?",
      "Keby si sa k sebe správala ako k svojej najlepšej priateľke — čo by si teraz urobila?"
    ],
    breathingExercises: [
      {
        name: "4-7-8 dych — upokojenie nervovej sústavy",
        steps: "Nadýchnite sa nosom na 4 doby. Zadržte na 7. Vydýchnite ústami na 8 dôb. Opakujte 4–6×. Jeden z najúčinnejších dychov na rýchle upokojenie emócií a zníženie kortizolu."
      },
      {
        name: "Predĺžený výdych — zníženie úzkosti",
        steps: "Nadýchnite sa na 4 doby. Vydýchnite pomaly na 8–10 dôb. Opakujte 8×. Čím dlhší výdych, tým silnejšia aktivácia parasympatiku — a viac pokoja."
      },
      {
        name: "Zemský dych — zakotvenie",
        steps: "Seďte na zemi alebo na stoličke s nohami na podlahe. Sústreďte sa na kontakt nôh so zemou. Nadýchnite sa pomaly na 5 dôb, vydýchnite na 5. Pri každom výdychu si predstavte, ako sa zakoreňujete hlbšie. 8×."
      },
      {
        name: "Dych hmly — chladenie emócií",
        steps: "Jemne otvorte pery ako keby ste pili slamkou. Nadýchnite sa cez ústa chladným vzduchom. Vydýchnite nosom pomaly. 8×. Ochladzuje nervový systém a zmierňuje intenzívne emócie."
      },
      {
        name: "Striedavý nosný dych — rovnováha",
        steps: "Striedajte nosnú dierku každé 4 doby. 8 kôl. Harmonizuje obe hemisféry mozgu — logickú aj emocionálnu — a prináša pocit vyváženosti."
      }
    ],
    reframes: [
      "Zvýšená citlivosť v tejto fáze nie je chyba tvojho charakteru — je to hormonálna realita.",
      "To, čo ťa teraz dráždi, ukazuje ti, čo skutočne potrebuješ. Počúvaj.",
      "Emócie, ktoré cítiš, sú informácie — nie trest, nie slabosť.",
      "PMS ti nehovorí, aká si. Hovorí ti, čo potrebuješ.",
      "Môžeš cítiť a zároveň nedovoliť emóciám riadiť tvoje rozhodnutia.",
      "Najláskavejšia vec, ktorú môžeš dnes urobiť, je zaobchádzať so sebou jemne.",
      "Tí, ktorí ťa milujú, rozumejú, že prechádzaš ťažšou fázou — dovoľ im byť pri tebe.",
      "Nie si 'príliš citlivá'. Si presne dosť citlivá na to, čo potrebuješ vnímať.",
      "Táto fáza je obzvlášť dobrá pre sebapoznanie — čo ťa dráždi, keď si unavená?",
      "Dnes je deň na nežnosť, nie na výkon. Dovoľ si to.",
      "Emocionálna bolesť je reálna, aj keď nemá vonkajšiu príčinu. Zaslúži si pozornosť.",
      "Za každou intenzívnou emóciou je potreba. Ktorá je teraz tá tvoja?"
    ]
  },

  // ─── LUTEAL LATE: Peak PMS, introspective, irritable, preparing to shed ───

  lutealLate: {
    affirmations: [
      "Vzdávam sa toho, čo mi už neslúži.",
      "Skoro. Vydržím. Moje telo vie, čo robí.",
      "Dovolím si byť tam, kde som — bez tlakovania.",
      "Táto ťažkosť je dočasná. Prichádza uvoľnenie.",
      "Mám právo byť teraz pomalá, tichá a vnútorná.",
      "Moje telo sa pripravuje na obnovu. Dôverujem mu.",
      "Nemusím sa nikde ponáhľať.",
      "Súcit so sebou je dnes môj najdôležitejší výkon.",
      "Každé ukončenie nesie v sebe sľub nového začiatku.",
      "Dovolím si niesť táto posledné dni s grácou.",
      "Jsem oveľa viac, ako toto prechodné obdobie.",
      "Vzdávam sa kontroly a dôverujem procesu."
    ],
    journalPrompts: [
      "Čo chceš pustiť pred začiatkom nového cyklu? Napíš to — a potom si predstav, ako to odchádza.",
      "Čo ti tento cyklus vzal — a čo ti dal? Oboje je hodnotné.",
      "Napíš o emócii, ktorá sa objavuje dookola. Čo ti hovorí?",
      "Kde vo svojom živote sa cítiš vyčerpaná? Kde preháňaš?",
      "Čo by si potrebovala od seba samej, aby si sa cítila menej sama s tým, čo nesieš?",
      "Napíš o vzore alebo myšlienke, ktorú chceš zanechať za sebou.",
      "Čo ťa dnes drží vo vnútri — aký strach, aká starosť?",
      "Napíš list svojmu telu — povedz mu, čo si od neho naučila.",
      "Aká je jedna malá vec, vďaka ktorej by si sa dnes cítila trochu lepšie?",
      "Čo si zaslúžiš, čo si doteraz neodvažuješ dostať?",
      "Napíš o okamihu kedy si si myslela, že to nezvládneš — a predsa si to zvládla.",
      "Čo hovorí tvoje telo, keď si naozaj ticho?"
    ],
    breathingExercises: [
      {
        name: "Hlboký brušný dych — kapitulácia",
        steps: "Ľahnite si. Položte obe ruky na brucho. Dýchajte tak hlboko, aby sa ruky dvíhali s každým nádychom. Výdych nechajte dlhší než nádych (4 nádych, 6 výdych). 10 minút. Najhlbší relaxačný dych."
      },
      {
        name: "Vydychujúci vzdych — uvoľnenie",
        steps: "Nadýchnite sa a na vrchole nádychu pridajte ešte malý extra nádych. Vydýchnite s dlhým, úľavným vzdychom ústami. Opakujte 5×. Jeden z najrýchlejších spôsobov uvoľnenia fyzického a emočného napätia."
      },
      {
        name: "Dych vzdania sa — pustenie kontroly",
        steps: "Dýchajte úplne prirodzene — len sledujte dych bez jeho ovládania. Nechajte ho plynúť. 5 minút čistého pozorovania. Cvičí dôveru a vzdanie sa kontroly — presne to, čo táto fáza vyžaduje."
      },
      {
        name: "4-7-8 dych — spánok a hlboký pokoj",
        steps: "Nadýchnite sa nosom na 4 doby. Zadržte na 7. Vydýchnite ústami na 8. Robte toto ležmo pred spánkom — 4 kolá. Jeden z najúčinnejších prirodzených pomocníkov pri problémoch so spánkom pred menštruáciou."
      },
      {
        name: "Teplý brušný dych — sebaúteha",
        steps: "Položte ruku na brucho, druhu na srdce. Predstavte si, že každý nádych prináša teplé, zlaté svetlo do vašich rúk. Každý výdych je uvoľnenie. 8 pomaly nádychov. Hlboká sebaúteha zvnútra."
      }
    ],
    reframes: [
      "To, čím prechádzaš teraz, je posledná strana kapitoly — nie celá kniha.",
      "Tvoja únava je reálna a zaslúži si rešpekt — nie prekonávanie.",
      "Ťažkosť, ktorú cítiš, je telo, ako čistí a pripravuje sa na nový začiatok.",
      "Kapitulujúci sme mocnou, nie slabou. Vedieť, kedy pustiť, vyžaduje múdrosť.",
      "Najkrajšie veci v prírode prechádzajú cez zimno pred jarným kvetom.",
      "Nie si povinná byť šťastná každý deň. Dnes je deň na ticho.",
      "To, čím prechádzaš, je súčasť rytmu — nie zlyhanie.",
      "Záver cyklu je svätý priestor. Nečakaj, že budeš na vrchole.",
      "Čo pustiš teraz, urobí priestor pre to, čo príde.",
      "Tvoje telo je múdrejšie než tvoja myseľ si myslí. Dôveruj mu.",
      "Najtichšie momenty cyklu sú niekedy tie s najhlbšou múdrosťou.",
      "Za pár dní príde úľava. Dnes si dovolíš len byť."
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// generateMindset — returns one item from each content pool, varied by day
// Uses the same seededShuffle algorithm as nutrition/movement generators
// ─────────────────────────────────────────────────────────────────────────────

export function generateMindset(
  day: number,
  phase: string,
  subphase: string | null
): MindsetContent {
  // Resolve subphase key — mirrors getMasterKey() from cycleTipsGenerator
  let key: string;
  if (phase === 'menstrual') {
    if (subphase === 'early') key = 'menstrualEarly';
    else if (subphase === 'late') key = 'menstrualLate';
    else key = 'menstrualMid';
  } else if (phase === 'luteal') {
    if (subphase === 'early') key = 'lutealEarly';
    else if (subphase === 'mid') key = 'lutealMid';
    else key = 'lutealLate';
  } else if (phase === 'ovulation') {
    key = 'ovulation';
  } else {
    key = 'follicular';
  }

  const master = MASTER_MYSEL[key] ?? MASTER_MYSEL['follicular'];

  const affirmation = seededShuffle(master.affirmations, day)[0];
  const journalPrompt = seededShuffle(master.journalPrompts, day * 2)[0];
  const breathing = seededShuffle(master.breathingExercises, day * 3)[0];
  const reframe = seededShuffle(master.reframes, day * 4)[0];

  return { affirmation, journalPrompt, breathing, reframe };
}
