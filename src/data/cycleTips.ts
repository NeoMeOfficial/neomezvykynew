// Cycle tip library — 105 tips across 5 phases × 3 categories × 7 tips
// STATUS: Approved by Gabi. Last updated: April 2026.
// Source of truth: docs/content/cycle-tips-review.md

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'lutealEarly' | 'lutealLate';
export type TipCategory = 'strava' | 'pohyb' | 'mysel';

export interface CycleTip {
  id: string;
  phase: CyclePhase;
  category: TipCategory;
  text: string;
}

export const cycleTips: CycleTip[] = [
  // ─── MENŠTRUAČNÁ FÁZA ────────────────────────────────────────────────────

  // Strava
  { id: 'men-str-1', phase: 'menstrual', category: 'strava', text: 'Jedz potraviny bohaté na železo — šošovicu, špenát, červené mäso — aby si doplnila to, čo telo stráca počas krvácania. Pridaj k nim trochu vitamínu C (citrónovú šťavu), aby sa železo lepšie vstrebalo.' },
  { id: 'men-str-2', phase: 'menstrual', category: 'strava', text: 'Teplé a varené jedlá sú dnes tvojím priateľom — polievky, dusená zelenina a kaše upokojujú tráviaci systém aj kŕče.' },
  { id: 'men-str-3', phase: 'menstrual', category: 'strava', text: 'Obmedz kávu a alkohol — obe látky zhoršujú kŕče a dehydratáciu. Nahraď ich zázvorovým alebo škoricovým čajom, alebo teplou vodou s citrónom.' },
  { id: 'men-str-4', phase: 'menstrual', category: 'strava', text: 'Horčík pomáha zmierniť kŕče a únavu — nájdeš ho v tmavej čokoláde, mandliach, tekvicových semiačkach a banánoch.' },
  { id: 'men-str-5', phase: 'menstrual', category: 'strava', text: 'Vyhni sa vysoko slaným jedlám — soľ zadržiava vodu a zhoršuje nadúvanie, ktoré je dnes obzvlášť nepríjemné.' },
  { id: 'men-str-6', phase: 'menstrual', category: 'strava', text: 'Omega-3 mastné kyseliny majú protizápalový účinok a môžu zmierniť intenzitu kŕčov. Nájdeš ich v lososovi, vlašských orechoch a ľanových semienkach.' },
  { id: 'men-str-7', phase: 'menstrual', category: 'strava', text: 'Pi dostatok tekutín — dehydratácia zhoršuje bolesti hlavy a únavu. Harmančekový alebo medovkový čaj navyše upokojuje a zmierňuje kŕče.' },

  // Pohyb
  { id: 'men-poh-1', phase: 'menstrual', category: 'pohyb', text: 'Dovoľ si dnes pomalšie tempo — telo odvádza ťažkú prácu a zaslúži si rešpekt, nie trest za nečinnosť.' },
  { id: 'men-poh-2', phase: 'menstrual', category: 'pohyb', text: 'Jemná jóga alebo strečing môžu výrazne zmierniť kŕče — nezabudni počas nich na pomalé, hlboké dýchanie.' },
  { id: 'men-poh-3', phase: 'menstrual', category: 'pohyb', text: 'Krátka prechádzka na čerstvom vzduchu zlepší náladu a uvoľní endorfíny, bez zbytočného zaťaženia tela.' },
  { id: 'men-poh-4', phase: 'menstrual', category: 'pohyb', text: 'Hlboké bránicové dýchanie v ľahu — nádych na 4 doby, výdych na 6 — prirodzene uvoľňuje kŕče a upokojuje nervový systém.' },
  { id: 'men-poh-5', phase: 'menstrual', category: 'pohyb', text: 'Vyhni sa intenzívnemu silovému tréningu a HIIT — telo je teraz v regeneračnom móde a vysoká záťaž môže zhoršiť únavu.' },
  { id: 'men-poh-6', phase: 'menstrual', category: 'pohyb', text: 'Teplo na brucho — termofor alebo teplá sprcha — kombinované s hlbokým dýchaním je rovnako účinné ako ľahký pohyb.' },
  { id: 'men-poh-7', phase: 'menstrual', category: 'pohyb', text: 'Počúvaj svoje telo a zbytočne ho nenuť do fyzických aktivít, na ktoré dnes pravdepodobne nebude mať silu.' },

  // Myseľ
  { id: 'men-mys-1', phase: 'menstrual', category: 'mysel', text: 'Dnes si daj povolenie spomaliť — menštruačná fáza je prirodzený čas introvertnosti a regenerácie, nie slabosti.' },
  { id: 'men-mys-2', phase: 'menstrual', category: 'mysel', text: 'Teplo a pokoj sú tvojím liekom — teplý čaj, deka, sviečka. Malé rituály majú veľký vplyv na pohodu. Dopraj si ich aspoň na pár minút.' },
  { id: 'men-mys-3', phase: 'menstrual', category: 'mysel', text: 'Ak sa cítiš emotívnejšia než zvyčajne, je to normálne — hormóny sú na najnižšom bode. Netlač na seba.' },
  { id: 'men-mys-4', phase: 'menstrual', category: 'mysel', text: 'Skús si zapísať do denníka, ako sa cítiš — sledovanie svojich symptómov ti pomôže lepšie porozumieť vlastnému cyklu.' },
  { id: 'men-mys-5', phase: 'menstrual', category: 'mysel', text: 'Vyhni sa veľkým rozhodnutiam a náročným rozhovorom, ak môžeš — nálada sa v priebehu niekoľkých dní výrazne zlepší.' },
  { id: 'men-mys-6', phase: 'menstrual', category: 'mysel', text: 'Meditácia alebo hlboké dýchanie, čo i len na pár minút, môže znížiť vnímanie bolesti a stresu.' },
  { id: 'men-mys-7', phase: 'menstrual', category: 'mysel', text: 'Popros o pomoc — s deťmi, domácnosťou, prácou. Dnes nie je deň byť superhrdinkou.' },

  // ─── FOLIKULÁRNA FÁZA ────────────────────────────────────────────────────

  // Strava
  { id: 'fol-str-1', phase: 'follicular', category: 'strava', text: 'Estrogén stúpa a s ním aj energia — telo teraz dobre spracováva komplexné sacharidy ako quinoa, sladké zemiaky a ovsené vločky.' },
  { id: 'fol-str-2', phase: 'follicular', category: 'strava', text: 'Fermentované potraviny — kefír, jogurt, kyslá kapusta — podporujú črevný mikrobióm, ktorý hrá kľúčovú úlohu v regulácii hormónov.' },
  { id: 'fol-str-3', phase: 'follicular', category: 'strava', text: 'Ľahké a čerstvé jedlá ti budú chutiť viac než ťažké — toto je ideálny čas na šaláty, smoothie a pestrofarebné jedlá.' },
  { id: 'fol-str-4', phase: 'follicular', category: 'strava', text: 'Dostatok bielkovín — vajíčka, strukoviny, ryby — podporí rast folikulov a stabilizuje hladinu cukru v krvi.' },
  { id: 'fol-str-5', phase: 'follicular', category: 'strava', text: 'Zelená listová zelenina — špenát, rukola, kel — dodá kyselinu listovú, dôležitú pre zdravie buniek v tejto fáze.' },
  { id: 'fol-str-6', phase: 'follicular', category: 'strava', text: 'Voda s citrónom alebo uhorkou ráno pomáha detoxikácii pečene, ktorá spracováva estrogén.' },
  { id: 'fol-str-7', phase: 'follicular', category: 'strava', text: 'Jedz dostatok — telo teraz buduje a potrebuje živiny. Príliš málo jedla v tejto fáze môže narušiť ovuláciu.' },

  // Pohyb
  { id: 'fol-poh-1', phase: 'follicular', category: 'pohyb', text: 'Energia rastie — ideálny čas začať nový cvičebný plán alebo zvýšiť intenzitu tréningov.' },
  { id: 'fol-poh-2', phase: 'follicular', category: 'pohyb', text: 'Silový tréning je v tejto fáze obzvlášť účinný — estrogén podporuje budovanie svalov a rýchlejšiu regeneráciu.' },
  { id: 'fol-poh-3', phase: 'follicular', category: 'pohyb', text: 'Vyskúšaj niečo nové — tanec, nová trasa na beh, skupinová hodina. Folikulárna fáza ťa robí otvorenejšou voči výzvam.' },
  { id: 'fol-poh-4', phase: 'follicular', category: 'pohyb', text: 'Kardio tréning — beh, bicyklovanie, aerobik — ti pôjde ľahšie než pred menštruáciou. Uži si to.' },
  { id: 'fol-poh-5', phase: 'follicular', category: 'pohyb', text: 'Tréning vonku amplifikuje pozitívny vplyv pohybu na náladu — čerstvý vzduch a denné svetlo podporujú tvorbu serotonínu.' },
  { id: 'fol-poh-6', phase: 'follicular', category: 'pohyb', text: 'Ak si mala počas menštruácie pauzu, nezačínaj príliš intenzívne — jeden-dva dni rozcvičenia, potom naplno.' },
  { id: 'fol-poh-7', phase: 'follicular', category: 'pohyb', text: 'Strečing po tréningu je dôležitý — svaly sú síce silnejšie, ale flexibilita si stále vyžaduje pozornosť.' },

  // Myseľ
  { id: 'fol-mys-1', phase: 'follicular', category: 'mysel', text: 'Toto je najlepší čas na plánovanie a stanovovanie cieľov — myseľ je jasná a optimizmus prirodzene rastie.' },
  { id: 'fol-mys-2', phase: 'follicular', category: 'mysel', text: 'Sociálna energia sa vracia — ideálny čas na stretnutia s priateľkami, networking alebo nové zoznámenia.' },
  { id: 'fol-mys-3', phase: 'follicular', category: 'mysel', text: 'Kreativita je na vzostupe — zapíš si nápady, začni projekt, ktorý si odkladala. Teraz na to máš kapacitu.' },
  { id: 'fol-mys-4', phase: 'follicular', category: 'mysel', text: 'Nauč sa niečo nové — jazyk, zručnosť, kurz. Folikulárna fáza je prirodzená „štúdijná" fáza cyklu.' },
  { id: 'fol-mys-5', phase: 'follicular', category: 'mysel', text: 'Nastav si priority na nadchádzajúci týždeň — tvoja schopnosť strategicky myslieť je teraz najsilnejšia.' },
  { id: 'fol-mys-6', phase: 'follicular', category: 'mysel', text: 'Obklopuj sa ľuďmi, ktorí ťa inšpirujú — energia tejto fázy je nákazlivá a vzájomná.' },
  { id: 'fol-mys-7', phase: 'follicular', category: 'mysel', text: 'Osláv malé víťazstvá — pozitívne posilnenie v tejto fáze buduje momentum na celý zvyšok cyklu.' },

  // ─── OVULAČNÁ FÁZA ───────────────────────────────────────────────────────

  // Strava
  { id: 'ovu-str-1', phase: 'ovulatory', category: 'strava', text: 'Estrogén a testosterón sú na vrchole — ľahké, protizápalové jedlá ako losos, avokádo a čučoriedky udržia túto energiu stabilnú.' },
  { id: 'ovu-str-2', phase: 'ovulatory', category: 'strava', text: 'Zinok z tekvicových semiačok, mäsa a strukovín podporuje hormonálnu rovnováhu v ovulačnom okne.' },
  { id: 'ovu-str-3', phase: 'ovulatory', category: 'strava', text: 'Vláknina z ovocia a zeleniny pomáha pečeni odbúravať prebytočný estrogén — dôležité pre hladký priebeh ovulácie.' },
  { id: 'ovu-str-4', phase: 'ovulatory', category: 'strava', text: 'Vyhni sa prílišnému množstvu cukru — prudké výkyvy glukózy môžu narušiť luteinizačný hormón, ktorý spúšťa ovuláciu.' },
  { id: 'ovu-str-5', phase: 'ovulatory', category: 'strava', text: 'Hydratácia je kľúčová — pij pravidelne počas celého dňa, minimálne 1,5–2 litre vody.' },
  { id: 'ovu-str-6', phase: 'ovulatory', category: 'strava', text: 'Brokolica, karfiol a kapusta obsahujú látky, ktoré pomáhajú telu zdravo metabolizovať estrogén.' },
  { id: 'ovu-str-7', phase: 'ovulatory', category: 'strava', text: 'Ľahší obed a večera sú vhodnejšie než ťažké jedlá — trávenie je teraz rýchlejšie a ľahšie jedlá udržia energiu stabilnú.' },

  // Pohyb
  { id: 'ovu-poh-1', phase: 'ovulatory', category: 'pohyb', text: 'Toto sú tvoje vrcholné dni — telo zvládne najvyššiu intenzitu, najdlhší beh, najnáročnejší tréning.' },
  { id: 'ovu-poh-2', phase: 'ovulatory', category: 'pohyb', text: 'HIIT, spinning, skupinové hodiny — všetko, čo si možno odkladala, môžeš dnes skúsiť naplno.' },
  { id: 'ovu-poh-3', phase: 'ovulatory', category: 'pohyb', text: 'Tímové športy sú obzvlášť príjemné v tejto fáze — sociálna a fyzická energia sa krásne dopĺňajú.' },
  { id: 'ovu-poh-4', phase: 'ovulatory', category: 'pohyb', text: 'Ak robíš silový tréning, môžeš dnes zdvíhať ťažšie — regenerácia je v tejto fáze najrýchlejšia.' },
  { id: 'ovu-poh-5', phase: 'ovulatory', category: 'pohyb', text: 'Súťaživé aktivity alebo pohybové výzvy sú teraz prirodzené — testosterón podporuje chuť prekonávať hranice.' },
  { id: 'ovu-poh-6', phase: 'ovulatory', category: 'pohyb', text: 'Aj keď máš veľa energie, nezabudni na zahriatie a strečing — prevencia zranení je stále dôležitá.' },
  { id: 'ovu-poh-7', phase: 'ovulatory', category: 'pohyb', text: 'Užívaj si pohyb vonku — slnko, vzduch a pohyb spolu vytvárajú silný nástroj na celkovú pohodu.' },

  // Myseľ
  { id: 'ovu-mys-1', phase: 'ovulatory', category: 'mysel', text: 'Toto sú tvoje dni komunikácie — dôležité rozhovory, prezentácie, rokovania. Tvoja sebadôvera je prirodzene vyššia.' },
  { id: 'ovu-mys-2', phase: 'ovulatory', category: 'mysel', text: 'Veľké rozhodnutia rob teraz — myseľ je analytická aj empatická zároveň, čo je ideálna kombinácia.' },
  { id: 'ovu-mys-3', phase: 'ovulatory', category: 'mysel', text: 'Spoločenské aktivity ťa nabíjajú, nie vyčerpávajú — plánuj stretnutia, oslavy, spoločné aktivity s rodinou.' },
  { id: 'ovu-mys-4', phase: 'ovulatory', category: 'mysel', text: 'Empatia je teraz na vrchole — ideálny čas na náročné rozhovory, kde potrebuješ porozumenie aj asertivitu.' },
  { id: 'ovu-mys-5', phase: 'ovulatory', category: 'mysel', text: 'Zameraj sa na to, čo chceš dosiahnuť — pracovný projekt, osobný cieľ, tvorivý zámer. Teraz máš na to silu.' },
  { id: 'ovu-mys-6', phase: 'ovulatory', category: 'mysel', text: 'Dopraj si dostatok spánku, ak sa ti dá, aj napriek vysokej energii — telo v noci spracováva hormonálne zmeny a spánok je stále základ.' },
  { id: 'ovu-mys-7', phase: 'ovulatory', category: 'mysel', text: 'Naplánuj si najnáročnejšie úlohy týždňa práve na tieto dni — dôležité rozhovory, pracovné stretnutia, nové projekty. Tvoja prirodzená energia je teraz tvojím najsilnejším nástrojom.' },

  // ─── LUTEÁLNA FÁZA ───────────────────────────────────────────────────────

  // Strava
  { id: 'lut-str-1', phase: 'luteal', category: 'strava', text: 'Komplexné sacharidy — ovsené vločky, sladké zemiaky, quinoa — stabilizujú hladinu cukru a prirodzene zvyšujú serotonín, hormón dobrej nálady.' },
  { id: 'lut-str-2', phase: 'luteal', category: 'strava', text: 'Horčík znižuje príznaky PMS — nájdeš ho v tmavej čokoláde (min. 70 %), špenáte, mandliach a avokáde.' },
  { id: 'lut-str-3', phase: 'luteal', category: 'strava', text: 'Vápnik z mliečnych výrobkov alebo fortifikovaných rastlinných nápojov zmierňuje kŕče, nadúvanie a výkyvy nálad pred menštruáciou.' },
  { id: 'lut-str-4', phase: 'luteal', category: 'strava', text: 'Obmedz soľ, kávu a alkohol — všetky tri zhoršujú zadržiavanie vody, podráždenosť a úzkosť v luteálnej fáze.' },
  { id: 'lut-str-5', phase: 'luteal', category: 'strava', text: 'Malé, pravidelné jedlá udržia hladinu cukru stabilnú a zredukujú intenzívne chute na sladké.' },
  { id: 'lut-str-6', phase: 'luteal', category: 'strava', text: 'Tryptofán z morčacieho mäsa, vajíčok a orechov podporuje tvorbu serotonínu — prirodzeného stabilizátora nálady.' },
  { id: 'lut-str-7', phase: 'luteal', category: 'strava', text: 'Ak ťa premáhajú chute na čokoládu, daj si tmavú — telo žiada horčík, nie je to slabosť vôle.' },

  // Pohyb
  { id: 'lut-poh-1', phase: 'luteal', category: 'pohyb', text: 'Zníž intenzitu a uži si pohyb pre potešenie, nie výkon — jóga, pilates a prechádzky sú teraz ideálne.' },
  { id: 'lut-poh-2', phase: 'luteal', category: 'pohyb', text: 'Jóga alebo jemný pilates pomáhajú zmierniť napätie v tele a upokojujú nervový systém pred menštruáciou.' },
  { id: 'lut-poh-3', phase: 'luteal', category: 'pohyb', text: 'Krátka prechádzka po jedle pomáha stabilizovať hladinu cukru v krvi a zmierňuje nadúvanie, ktoré je v tejto fáze časté.' },
  { id: 'lut-poh-4', phase: 'luteal', category: 'pohyb', text: 'Ak sa necítiš na cvičenie, kratší a miernejší pohyb je stále lepší ako nič — 20-minútová prechádzka robí zázraky.' },
  { id: 'lut-poh-5', phase: 'luteal', category: 'pohyb', text: 'Beh alebo cyklistika v miernom tempe sú v poriadku — počúvaj telo a spomaľ, keď to vyžaduje.' },
  { id: 'lut-poh-6', phase: 'luteal', category: 'pohyb', text: 'Vyhni sa silovému tréningu s maximálnymi váhami — regenerácia je pomalšia a riziko zranenia vyššie.' },
  { id: 'lut-poh-7', phase: 'luteal', category: 'pohyb', text: 'Pohyb vonku v prírode znižuje kortizol, ktorý je v luteálnej fáze prirodzene vyšší — aj 15 minút venku pomôže.' },

  // Myseľ
  { id: 'lut-mys-1', phase: 'luteal', category: 'mysel', text: 'Luteálna fáza je čas introvertnosti — je normálne chcieť byť viac doma a menej medzi ľuďmi. Rešpektuj to bez viny.' },
  { id: 'lut-mys-2', phase: 'luteal', category: 'mysel', text: 'Emócie sú intenzívnejšie — to, čo cítiš, je reálne. Skús to pomenovať bez súdenia: „Som podráždená, pretože som unavená."' },
  { id: 'lut-mys-3', phase: 'luteal', category: 'mysel', text: 'Denník je najmocnejší nástroj tejto fázy — zapisuj si, čo ťa trápi, čo ti chýba, čo potrebuješ.' },
  { id: 'lut-mys-4', phase: 'luteal', category: 'mysel', text: 'Nastav hranice — povedz nie záväzkom, ktoré ťa vyčerpávajú. Toto nie je sebeckosť, je to starostlivosť o seba.' },
  { id: 'lut-mys-5', phase: 'luteal', category: 'mysel', text: 'Ak máš pocit, že toho je priveľa, skús si vytvoriť malý priestor len pre seba — čo i len päť minút ticha, keď idú deti spať.' },
  { id: 'lut-mys-6', phase: 'luteal', category: 'mysel', text: 'Ak cítiš úzkosť alebo smútok, pomôže malý rituál — čaj, kniha, hudba, krátka meditácia. Kotviaca rutina upokojuje. Dopraj si ju aspoň na pár minút pred spánkom.' },
  { id: 'lut-mys-7', phase: 'luteal', category: 'mysel', text: 'Pamätaj: o niekoľko dní sa všetko zmení. Luteálna nálada nie je trvalá pravda o tebe — je to fáza, ktorá prejde.' },

  // ─── SKORÁ LUTEÁLNA FÁZA — progesterón stúpa ────────────────────────────

  // Strava
  { id: 'lut-e-str-1', phase: 'lutealEarly', category: 'strava', text: 'Progesterón stúpa a s ním rastie aj chuť do jedla — je to normálne. Zaraď komplexné sacharidy ako bataty, quinoa a ovsené vločky, ktoré zasýtia a udržia energiu stabilnú.' },
  { id: 'lut-e-str-2', phase: 'lutealEarly', category: 'strava', text: 'Horčík je tvojím najlepším spojencom v tejto fáze — pomáha telu spracovať progesterón a znižuje prvé príznaky PMS. Nájdeš ho v mandliach, tmavej čokoláde a listovej zelenine.' },
  { id: 'lut-e-str-3', phase: 'lutealEarly', category: 'strava', text: 'Teplé, výdatné jedlá sa hodia viac než ľahké šaláty — telo sa prirodzene orientuje na zahriate a výživnejšie pokrmy. Polievky, dusené jedlá a pečená zelenina sú ideálne.' },
  { id: 'lut-e-str-4', phase: 'lutealEarly', category: 'strava', text: 'Dostatok bielkovín — vajcia, strukoviny, ryby — stabilizuje hladinu cukru v krvi a pomáha predísť intenzívnym chutiam na sladké neskôr v cykle.' },
  { id: 'lut-e-str-5', phase: 'lutealEarly', category: 'strava', text: 'Fermentované potraviny — kefír, jogurt, kyslá kapusta — podporujú črevný mikrobióm, ktorý hrá kľúčovú úlohu v regulácii progesterónu a nálady.' },
  { id: 'lut-e-str-6', phase: 'lutealEarly', category: 'strava', text: 'Obmedz nadmernú konzumáciu kofeínu — progesterón je prirodzene upokojujúci hormón a kofeín môže narúšať jeho efekt a zhoršovať spánok, ktorý je teraz dôležitejší.' },
  { id: 'lut-e-str-7', phase: 'lutealEarly', category: 'strava', text: 'Vitamín B6 z banánov, morčacieho mäsa a cíceru podporuje produkciu progesterónu a pomáha zvládať prvé výkyvy nálady.' },

  // Pohyb
  { id: 'lut-e-poh-1', phase: 'lutealEarly', category: 'pohyb', text: 'Energia ešte dovoľuje stredne intenzívny pohyb — využi to, ale nepretláčaj sa na maximum ako v ovulačnej fáze.' },
  { id: 'lut-e-poh-2', phase: 'lutealEarly', category: 'pohyb', text: 'Silový tréning s mierne nižšími váhami je stále vhodný — regenerácia sa spomaľuje, takže si daj viac času na oddych medzi sériami.' },
  { id: 'lut-e-poh-3', phase: 'lutealEarly', category: 'pohyb', text: 'Pilates a jóga sú v tejto fáze obzvlášť príjemné — spájajú silu s uvoľnením a odrážajú pomalšie tempo, ku ktorému sa telo prirodzene obracia.' },
  { id: 'lut-e-poh-4', phase: 'lutealEarly', category: 'pohyb', text: 'Ak si bežkyňa alebo cyklistka, pokračuj — ale tempo zníž o 10–15 %. Telo pracuje ťažšie pri rovnakej záťaži kvôli vyššej telesnej teplote a progesterónu.' },
  { id: 'lut-e-poh-5', phase: 'lutealEarly', category: 'pohyb', text: 'Aktivity v prírode — prechádzky v lese, pohyb pri vode — majú silný upokojujúci efekt a dobre ladia s introvertnou náladou tejto fázy.' },
  { id: 'lut-e-poh-6', phase: 'lutealEarly', category: 'pohyb', text: 'Dbaj na strečing a regeneráciu viac než inokedy — svaly sa zotavujú pomalšie a kvalitné zahriatie aj ochladenie predíde stuhnutosti a bolestiam.' },
  { id: 'lut-e-poh-7', phase: 'lutealEarly', category: 'pohyb', text: 'Počúvaj telo — ak sa ráno cítiš unavená, je to signál na ľahší deň. Jeden deň odpočinku teraz je múdrejší ako dva dni núteného výkonu.' },

  // Myseľ
  { id: 'lut-e-mys-1', phase: 'lutealEarly', category: 'mysel', text: 'Toto je prirodzený čas na spomalenie a zameranie sa na svoje vnútro — energia sa presúva z vonkajšieho sveta smerom k tebe samej. Nie je to problém, je to fáza.' },
  { id: 'lut-e-mys-2', phase: 'lutealEarly', category: 'mysel', text: 'Kreativita sa mení z generovania nových nápadov na dokončovanie a uzatváranie — ideálny čas na finišovanie projektov, nie na začínanie nových.' },
  { id: 'lut-e-mys-3', phase: 'lutealEarly', category: 'mysel', text: 'Ak si v predchádzajúcich fázach stanovila ciele, teraz je čas na realistické zhodnotenie — čo sa darí, čo nie, bez sebakritizy.' },
  { id: 'lut-e-mys-4', phase: 'lutealEarly', category: 'mysel', text: 'Sociálna energia klesá — je normálne preferovať menšie spoločnosti alebo čas sama. Nenuť sa na spoločenské akcie, ak na ne nemáš chuť.' },
  { id: 'lut-e-mys-5', phase: 'lutealEarly', category: 'mysel', text: 'Telesné vnemy sú intenzívnejšie — vnímaš viac detailov, citlivosť je vyššia. Využi to v práci, kde je dôležitá pozornosť a precíznosť.' },
  { id: 'lut-e-mys-6', phase: 'lutealEarly', category: 'mysel', text: 'Spánok je v tejto fáze kľúčový — progesterón ho prirodzene podporuje, ale môžeš zažiť živé sny. Vytvor si upokojujúcu večernú rutinu.' },
  { id: 'lut-e-mys-7', phase: 'lutealEarly', category: 'mysel', text: 'Naplánuj si čas len pre seba — nie na produktivitu, ale na nabitie. Kniha, kúpeľ, hudba. Telo a myseľ to budú potrebovať čoraz viac.' },

  // ─── NESKORÁ LUTEÁLNA FÁZA — všetky hormóny klesajú ────────────────────

  // Strava
  { id: 'lut-l-str-1', phase: 'lutealLate', category: 'strava', text: 'Komplexné sacharidy — ovsené vločky, sladké zemiaky, quinoa — stabilizujú hladinu cukru a prirodzene zvyšujú serotonín, hormón dobrej nálady, ktorého hladina teraz klesá.' },
  { id: 'lut-l-str-2', phase: 'lutealLate', category: 'strava', text: 'Horčík zmierňuje príznaky PMS — nájdeš ho v tmavej čokoláde (min. 70 %), špenáte, mandliach a avokáde. Väčšina žien ho má v tejto fáze prirodzene málo.' },
  { id: 'lut-l-str-3', phase: 'lutealLate', category: 'strava', text: 'Vápnik z mliečnych výrobkov alebo fortifikovaných rastlinných nápojov zmierňuje kŕče, nafukovanie a výkyvy nálad pred menštruáciou.' },
  { id: 'lut-l-str-4', phase: 'lutealLate', category: 'strava', text: 'Obmedz soľ, kávu a alkohol — všetky tri zhoršujú zadržiavanie vody, podráždenosť a úzkosť v tejto fáze výrazne.' },
  { id: 'lut-l-str-5', phase: 'lutealLate', category: 'strava', text: 'Malé, pravidelné jedlá udržia hladinu cukru stabilnú a zredukujú intenzívne chute na sladké — namiesto troch veľkých jedál skús päť menších.' },
  { id: 'lut-l-str-6', phase: 'lutealLate', category: 'strava', text: 'Tryptofán z morčacieho mäsa, vajíčok a orechov podporuje tvorbu serotonínu — prirodzeného stabilizátora nálady, ktorého hladina teraz klesá.' },
  { id: 'lut-l-str-7', phase: 'lutealLate', category: 'strava', text: 'Ak ťa premáhajú chute na čokoládu, daj si tmavú — telo žiada horčík, nie je to slabosť vôle.' },

  // Pohyb
  { id: 'lut-l-poh-1', phase: 'lutealLate', category: 'pohyb', text: 'Zníž intenzitu výrazne a uži si pohyb pre potešenie, nie výkon — jóga, pilates a prechádzky sú teraz ideálne.' },
  { id: 'lut-l-poh-2', phase: 'lutealLate', category: 'pohyb', text: 'Yin jóga alebo restoratívna jóga — kde polohy držíš dlhšie — sú výnimočne účinné na uvoľnenie napätia v panvovej oblasti.' },
  { id: 'lut-l-poh-3', phase: 'lutealLate', category: 'pohyb', text: 'Krátka prechádzka po jedle pomáha stabilizovať hladinu cukru v krvi a zmierňuje nafukovanie, ktoré je v tejto fáze časté.' },
  { id: 'lut-l-poh-4', phase: 'lutealLate', category: 'pohyb', text: 'Ak sa necítiš na cvičenie, kratší a miernejší pohyb je stále lepší ako nič — 20-minútová prechádzka robí skutočné zázraky.' },
  { id: 'lut-l-poh-5', phase: 'lutealLate', category: 'pohyb', text: 'Beh alebo cyklistika v miernom tempe sú v poriadku — počúvaj telo a spomaľ, keď to vyžaduje. Rytmický pohyb navyše pomáha regulovať náladu.' },
  { id: 'lut-l-poh-6', phase: 'lutealLate', category: 'pohyb', text: 'Vyhni sa silovému tréningu s maximálnymi váhami — regenerácia je pomalšia, zápal v tele je vyšší a riziko zranenia tiež.' },
  { id: 'lut-l-poh-7', phase: 'lutealLate', category: 'pohyb', text: 'Pohyb vonku v prírode znižuje kortizol, ktorý je v tejto fáze prirodzene vyšší — aj 15 minút vonku má preukázateľný vplyv na náladu.' },

  // Myseľ
  { id: 'lut-l-mys-1', phase: 'lutealLate', category: 'mysel', text: 'Je normálne chcieť byť viac doma a menej medzi ľuďmi — telo aj myseľ sa sťahujú dovnútra. Rešpektuj to bez viny.' },
  { id: 'lut-l-mys-2', phase: 'lutealLate', category: 'mysel', text: 'Emócie sú najintenzívnejšie v celom cykle — to, čo cítiš, je reálne. Skús to pomenovať bez súdenia: „Som podráždená, pretože som unavená."' },
  { id: 'lut-l-mys-3', phase: 'lutealLate', category: 'mysel', text: 'Denník je najmocnejší nástroj tejto fázy — zapisuj si, čo ťa trápi, čo ti chýba, čo potrebuješ. Uvidíš, ako sa vzorce opakujú každý mesiac.' },
  { id: 'lut-l-mys-4', phase: 'lutealLate', category: 'mysel', text: 'Nastav hranice — povedz nie záväzkom, ktoré ťa vyčerpávajú. Toto nie je sebeckosť, je to starostlivosť o seba.' },
  { id: 'lut-l-mys-5', phase: 'lutealLate', category: 'mysel', text: 'Ak máš pocit, že toho je priveľa, skús si vytvoriť malý priestor len pre seba — čo i len päť minút ticha, keď idú deti spať.' },
  { id: 'lut-l-mys-6', phase: 'lutealLate', category: 'mysel', text: 'Ak cítiš úzkosť alebo smútok, pomôže malý rituál — čaj, kniha, hudba, krátka meditácia. Kotviaca rutina upokojuje, dopraj si ju aspoň na pár minút pred spánkom.' },
  { id: 'lut-l-mys-7', phase: 'lutealLate', category: 'mysel', text: 'Pamätaj: o niekoľko dní sa všetko zmení. Nálada luteálnej fázy nie je trvalá pravda o tebe — je to fáza, ktorá prejde.' },
];

// Pre-set symptom list (awaiting Gabi confirmation)
export const presetSymptoms: string[] = [
  'Bolesti brucha / kŕče',
  'Bolesť hlavy',
  'Únava',
  'Nadúvanie',
  'Citlivé prsia',
  'Nevoľnosť',
  'Podráždenosť',
  'Výkyvy nálad',
  'Akné / zmeny pleti',
  'Bolesti chrbta',
  'Nespavosť',
  'Zvýšená chuť do jedla',
  'Chute na sladké',
  'Hnačka alebo zápcha',
  'Úzkosť',
  'Smútok / depresívna nálada',
  'Nízka energia',
  'Opuchy / zadržiavanie vody',
  'Zvýšená citlivosť na bolesť',
  'Ťažkosti so sústredením',
];

// Helper: resolve phase+subphase from cycle utils to CyclePhase key
export function resolveCyclePhase(phase: string, subphase: string | null): CyclePhase {
  if (phase === 'menstrual') return 'menstrual';
  if (phase === 'follicular') return 'follicular';
  if (phase === 'ovulation') return 'ovulatory';
  if (phase === 'luteal') {
    return subphase === 'late' ? 'lutealLate' : 'lutealEarly';
  }
  return 'menstrual';
}

// Helper: get tip for phase+subphase+category based on day-in-phase (rotates through 7 tips)
export function getCycleTipByDay(
  phase: string,
  subphase: string | null,
  category: TipCategory,
  dayInPhase: number
): string {
  const cyclePhase = resolveCyclePhase(phase, subphase);
  const tips = cycleTips.filter((t) => t.phase === cyclePhase && t.category === category);
  if (tips.length === 0) return '';
  const index = Math.max(0, (dayInPhase - 1) % tips.length);
  return tips[index].text;
}

// Helper: get tips for a given phase and category
export function getTipsForPhaseAndCategory(
  phase: CyclePhase,
  category: TipCategory
): CycleTip[] {
  return cycleTips.filter((t) => t.phase === phase && t.category === category);
}

// Helper: get today's tip using a date + user seed (deterministic, no repeats within 7 days)
export function getTodaysTip(
  phase: CyclePhase,
  category: TipCategory,
  userId: string,
  date: string // YYYY-MM-DD
): CycleTip | null {
  const tips = getTipsForPhaseAndCategory(phase, category);
  if (tips.length === 0) return null;

  const dateSeed = date.split('-').reduce((acc, p) => acc + parseInt(p, 10), 0);
  const userSeed = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const index = (dateSeed + userSeed) % tips.length;
  return tips[index];
}
