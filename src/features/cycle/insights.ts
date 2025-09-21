import { PhaseKey } from './types';

export const PHASE_LABELS: Record<PhaseKey, string> = {
  menstrual: "Menštruácia",
  follicular: "Folikulárna", 
  ovulation: "Ovulácia",
  luteal: "Luteálna",
};

export const PHASE_INSIGHTS: Record<PhaseKey, {
  title: string;
  description: string;
  stageIntensity: string;
  dailyFocus: string[];
  strava: string[][];
  pohyb: string[][];
  mysel: string[][];
  energy: string;
  mood: string;
}> = {
  menstrual: {
    title: "Čas na oddych",
    description: "Telo sa regeneruje a pripravuje na nový cyklus.",
    stageIntensity: "V tejto fáze je dôležité počúvať svoje telo a dopriať si potrebný odpočinok.",
    dailyFocus: [
      "Dnes si dovoľte ísť svojím tempom a nečakajte od seba výkonnosť",
      "Vaše telo pracuje na obnove - buďte k sebe jemná",
      "Hormóny sú najnižšie, preto je prirodzené cítiť sa pokojnejšie",
      "Toto je čas na introspekciu a plánovanie do budúcnosti"
    ],
    strava: [
      ["Pite teplé bylinkové čaje ako rumanček alebo lipový kvet", "Jedzte železom bohaté potraviny ako špenát a červené mäso", "Vyhýbajte sa nadmernému kofeínu, ktorý môže zhoršiť kŕče"],
      ["Konzumujte tmavú čokoládu s vysokým obsahom kakaa na prirodzené endorfíny", "Pridajte do jedál zázvor proti zápalom", "Jedzte banány bohaté na draslík proti kŕčom"],
      ["Pite dostatok teplej vody s citrónom na detoxikáciu", "Jedzte avokádo bohaté na zdravé tuky", "Konzumujte orechy a semienka ako zdroj horčíka"],
      ["Pripravte si výživné polievky a ragú pre pocit pohodlia", "Jedzte sladké zemiaky bohaté na vitamín A", "Pridajte kurkumu do jedál pre jej protizápalové účinky"]
    ],
    pohyb: [
      ["Skúste jemnú jógu s dôrazom na dychové cvičenia", "Urobte si pomalú precházku na čerstvom vzduchu", "Vykonajte ľahké napínanie na uvoľnenie napätia"],
      ["Cvičte restoratívnu jógu s vankúšmi a dekami", "Absolvujte krátku meditačnú precházku", "Urobte si kúpeľ s epsom soľou na uvoľnenie svalov"],
      ["Praktizujte yin jógu pre hlboké uvoľnenie", "Vyskúšajte ľahkú aqua aerobiku ak máte prístup", "Robte jemné kruhové pohyby bedier na úľavu"],
      ["Venujte sa stretingu a mobilite", "Urobte si relaxačnú precházku v prírode", "Cvičte dychové techniky na zníženie stresu"]
    ],
    mysel: [
      ["Veďte si denník pocitov a myšlienok", "Praktizujte meditáciu súcitu k sebe", "Čítajte inšpiratívne knihy alebo články"],
      ["Venujte sa kreatívnym aktivitám ako maľovanie", "Vypočujte si upokojujúcu hudbu", "Praktizujte vďačnosť - napíšte si 3 veci za ktoré ste vďačná"],
      ["Robte vizualizačné cvičenia pre budúce ciele", "Organizujte si priestor okolo seba", "Venujte čas samote a sebareflexii"],
      ["Plánujte aktivity na nasledujúce týždne", "Praktizujte mindfulness pri každodenných činnostiach", "Spojte sa s blízkymi cez telefón alebo správy"]
    ],
    energy: "Nižšia energia",
    mood: "Introspektívna nálada"
  },
  follicular: {
    title: "Rastúca energia",
    description: "Hormóny sa zvyšujú, cítite sa čoraz lepšie.",
    stageIntensity: "Vaša energia a optimizmus rastú každým dňom, využite túto pozitívnu vlnu.",
    dailyFocus: [
      "Cítite návrat energie - začnite plánovať nové výzvy",
      "Vaša kreativita a motivácia sa prebúdzajú",
      "Hormóny vám dodávajú väčšiu odvahu a optimizmus", 
      "Toto je ideálny čas na začatie nových projektov"
    ],
    strava: [
      ["Pridajte do stravy čerstvé zelené šaláty s rôznorodou zeleninou", "Jedzte quinoa a hnedú ryžu pre dlhotrvajúcu energiu", "Konzumujte citrusové plody bohaté na vitamín C"],
      ["Pripravte si smoothie s čerstvým ovocím a zeleninou", "Jedzte ryby bohaté na omega-3 mastné kyseliny", "Pridajte do jedál čerstvé bylinky ako petržlen a bazalka"],
      ["Konzumujte baklažány a cukety pre ľahkú stravu", "Jedzte jogurt s probiótikami pre zdravé črevo", "Pridajte do stravy chia semienka pre omega-3"],
      ["Pripravte si farebnú zeleninu na pare", "Jedzte cottage cheese alebo grécky jogurt pre proteíny", "Konzumujte brusnice pre podporu močových ciest"]
    ],
    pohyb: [
      ["Začnite s ľahkým kardiom ako rýchla chôdza", "Vyskúšajte tanečnú lekciu alebo pustite hudbu doma", "Robte bodyweight cvičenia s vlastnou váhou"],
      ["Pridajte intervalový tréning s krátkymi sériami", "Vyskúšajte bicyklovanie alebo spinning", "Cvičte pilates pre posilnenie core svalov"],
      ["Absolvujte energickú jógu ako vinyasa flow", "Choďte na dlhšie turistické výlety", "Vyskúšajte nové športové aktivity"],
      ["Kombinujte kardio s posilňovaním", "Urobte si intenzívnejšiu precházku s kamarátkou", "Cvičte funkčný tréning s rôznymi pohybmi"]
    ],
    mysel: [
      ["Stanovte si nové ciele a napíšte si akčný plán", "Brainstormujte nové nápady a projekty", "Čítajte motivačné knihy alebo podcasty"],
      ["Spojte sa s priateľmi a naplánujte spoločné aktivity", "Venujte sa novému hobby alebo zručnosti", "Zapisujte si svoje vízie a sny"],
      ["Riešte úlohy ktoré ste odkladali", "Organizujte svoj priestor a vytvorte inšpirujúce prostredie", "Učte sa niečo nové online alebo z kníh"],
      ["Pracujte na osobnom rozvoji", "Plánujte cestovanie alebo výlety", "Venujte sa kreatívnemu písaniu alebo umeniu"]
    ],
    energy: "Rastúca energia",
    mood: "Optimistická nálada"
  },
  ovulation: {
    title: "Vrchol cyklu",
    description: "Najvyššia energia a sebavedomie.",
    stageIntensity: "Nachádzate sa na vrchole svojej energie a charizmy - využite túto silu naplno.",
    dailyFocus: [
      "Máte maximálnu energiu - je čas na najväčšie výzvy",
      "Vaše charisma a sebavedomie sú na vrchole",
      "Komunikačné schopnosti sú výnimočné - využite ich",
      "Ideálny čas na dôležité rozhodnutia a prezentácie"
    ],
    strava: [
      ["Jedzte antioxidantmi bohaté ovocie ako čučoriedky", "Konzumujte listovú zeleninu pre folát a železo", "Pridajte do stravy ľanové semienka pre hormóny"],
      ["Pripravte si proteínovo bohaté jedlá s kuracím mäsom", "Jedzte červenú fazuľu a šošovicu pre energию", "Konzumujte tmavé listy ako kel a špenát"],
      ["Pridajte granátové jablko pre antioxidanty", "Jedzte mandle a vlašské orechy pre zdravé tuky", "Konzumujte kvašenú zeleninu pre probiótiká"],
      ["Pripravte si energetické misky s quinoa a zeleninou", "Jedzte sardínky alebo losos pre omega-3", "Pridajte kurkumu a čierne korenie pre vstrebávanie"]
    ],
    pohyb: [
      ["Vyskúšajte high-intensity interval training (HIIT)", "Choďte na náročný beh alebo cyklistiku", "Cvičte silový tréning s ťažšími váhami"],
      ["Absolvujte intenzívnu tanečnú lekciu", "Vyskúšajte kickbox alebo bojové umenia", "Robte plyometrické cvičenia pre explozívnosť"],
      ["Choďte na dlhý a náročný trek do hôr", "Cvičte crossfit alebo funkčný tréning", "Vyskúšajte nové športy ako squash alebo tenis"],
      ["Kombinujte kardio s vysokou intenzitou", "Absolvujte bootcamp tréning", "Cvičte na čerstvom vzduchu s plnou energiou"]
    ],
    mysel: [
      ["Absolvujte dôležité pracovné stretnutia", "Prezentujte svoje nápady a projekty", "Vyjednávajte dôležité zmluvy alebo dohody"],
      ["Spojte sa s novými ľuďmi a budujte siete", "Venujte sa public speaking alebo prezentáciám", "Riešte komplexné problémy a úlohy"],
      ["Plánujte budúcnosť a veľké projekty", "Učte sa náročné témy alebo zručnosti", "Venujte sa líderskym aktivitám"],
      ["Robte strategické rozhodnutia", "Pracujte na kariérnom raste", "Venujte sa tímovej spolupráci a vedeniu projektov"]
    ],
    energy: "Maximálna energia",
    mood: "Sebavedomá nálada"
  },
  luteal: {
    title: "Príprava na odpočinok",
    description: "Energia postupne klesá, telo sa pripravuje na menštruáciu.",
    stageIntensity: "Energia sa mení - využite túto fázu na dokončovanie a organizovanie.",
    dailyFocus: [
      "Dokončujte rozpracované projekty a úlohy",
      "Organuzujte a upratujte svoj priestor a myšlienky",
      "Pripravte sa fyzicky aj mentálne na nadchádzajúci odpočinok",
      "Zamerajte sa na výživu ktorá vás udrží v energii"
    ],
    strava: [
      ["Jedzte komplexné sacharidy ako ovos a quinoa - poskytujú stabilnú energiu bez prudkých výkyvov cukru v krvi, čo pomáha udržať vyrovnanú náladu", "Konzumujte tmavú čokoládu pre serotonín - obsahuje tryptofán a magnesium, ktoré prirodzene zvyšujú hladinu hormónu šťastia a znižujú stres", "Pridajte do stravy tekvicové semienka pre horčík - tento minerál uvoľňuje svaly, znižuje úzkosť a zlepšuje kvalitu spánku"],
      ["Pripravte si výdatné polievky s luštěninami - bohaté na proteíny a vlákninu, ktoré udržujú pocit sýtosti a stabilizujú hladinu cukru v krvi", "Jedzte sladké zemiaky pre stabilnú energiu - obsahujú komplexné sacharidy a beta-karotén, ktorý podporuje imunitný systém", "Konzumujte zelené listy pre vitamíny skupiny B - podporujú nervový systém a pomáhajú telu zvládať stres počas PMS"],
      ["Pridajte do jedál avokádo pre zdravé tuky - obsahuje omega-3 mastné kyseliny, ktoré znižujú zápal a podporujú hormonálnu rovnováhu", "Jedzte ryby pre omega-3 a protein - tieto mastné kyseliny zmierňujú bolesti a zlepšujú náladu, protein udržuje stabilnú energiu", "Pite bylinkové čaje ako medovka proti napätiu - má prirodzené upokojujúce účinky a pomáha relaxovať svaly"],
      ["Konzumujte orechy a semienka pred menštruáciou - bohaté na magnesium a zdravé tuky, ktoré zmierňujú kŕče a podporujú hormonálnu produkciu", "Jedzte červené mäso pre železo - pomáha predchádzať únave a anémii, ktoré môžu vzniknúť počas menštruácie", "Pridajte škoricu pre reguláciu cukru v krvi - pomáha stabilizovať hladinu glukózy a znižuje chute na sladké"]
    ],
    pohyb: [
      ["Cvičte pilates pre posilnenie a flexibilitu", "Urobte si miernu precházku s kamarátkou", "Venujte sa gentle flow jóge"],
      ["Absolvujte aqua fitness alebo plávanie", "Cvičte tai chi pre relaxáciu a rovnováhu", "Robte ľahké posilňovanie s malými váhami"],
      ["Vyskúšajte barre cvičenie pre tónus", "Choďte na relaxačnú precházku v prírode", "Cvičte restoratívnu jógu s rekvizitami"],
      ["Venujte sa stretching rutine", "Absolvujte ľahký cycling alebo eliptický", "Praktizujte breathwork a meditáciu v pohybe"]
    ],
    mysel: [
      ["Dokončite projekty a uzavrite nedokončené úlohy", "Organizujte svoj domov a pracovný priestor", "Plánujte si nadchádzajúci mesiac"],
      ["Venujte sa journaling a spracovaniu emócií", "Praktizujte relaxačné techniky", "Pripravte sa na pomalší rytmus"],
      ["Robte digitálny detox a obmedzte sociálne siete", "Čítajte upokojujúce knihy", "Venujte sa handmade aktivitám ako pletenie"],
      ["Pripravte si relaxačné prostredie doma", "Praktizujte vďačnosť a pozitívne myslenie", "Plánujte self-care aktivity na menštruáciu"]
    ],
    energy: "Klesajúca energia",
    mood: "Pokojnejšia nálada"
  }
};

export const UI_TEXT = {
  welcome: "Vitaj! Začnime nastavením tvojho cyklu",
  energyMood: "Energia a nálada – odhad na dnes",
  lastPeriod: "Posledná menštruácia",
  cycleLength: "Dĺžka cyklu",
  periodLength: "Dĺžka menštruácie", 
  expectedPeriod: "Očakávaná menštruácia",
  newPeriod: "Nová menštruácia",
  todayEstimate: "Odhad na dnes",
  whatToDo: "Čo s tým",
  save: "Uložiť",
  cancel: "Zrušiť",
  edit: "Upraviť",
  day: "deň",
  days: "dni",
  today: "DNES",
  setup: "Nastavenie",
  history: "História",
  settings: "Nastavenia",
  selectDate: "Vybrať dátum"
};