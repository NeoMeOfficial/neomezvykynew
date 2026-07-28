/**
 * Daily cycle headlines — the ONE copy source for the home Periodka card
 * and the tracker hero (they must always read identically).
 *
 * Honesty first (Gabi 2026-07-27): hormone dynamics are medically
 * well-established at SUB-PHASE granularity, not per exact day — so the
 * system maps each woman's own cycle (her length + period length) onto
 * nine physiological states. Within a state, headlines are assigned by
 * POSITION (1st day of the state → 1st headline, 2nd → 2nd, …), and each
 * state carries enough variants to cover its longest possible span, so a
 * woman never reads the same headline twice in one cycle (no rotation —
 * Gabi 2026-07-27). Content basis: standard clinical endocrinology of
 * the cycle (estrogen rise through the follicular phase peaking at
 * ovulation, LH surge, progesterone dominance with +0.3–0.5 °C core
 * temperature and higher energy needs in the luteal phase, hormone
 * withdrawal and PMS in the late luteal days, prostaglandin-driven
 * cramps in early menses).
 *
 * Deterministic: same woman, same day → same text on every screen.
 */
import { getPhaseRanges } from './utils';

export interface DailyHeadline {
  before: string;
  em: string;
  body: string;
}

export type HeadlineBucket =
  | 'menstrual_start'
  | 'menstrual_end'
  | 'follicular_early'
  | 'follicular_late'
  | 'ovulation'
  | 'luteal_early'
  | 'luteal_mid'
  | 'luteal_late'
  | 'late';

const HEADLINES: Record<HeadlineBucket, DailyHeadline[]> = {
  // ── Menštruácia, dni 1–2: hormóny na minime, prostaglandíny → kŕče ──
  menstrual_start: [
    { before: 'Telo sa', em: 'reštartuje.', body: 'Hormóny sú na minime a telo pracuje naplno, aj keď to tak necítiš. Teplo, pokoj a jemný pohyb sú dnes to najlepšie.' },
    { before: 'Dopraj si', em: 'pokoj.', body: 'Druhý deň býva ešte náročný — kŕče a únava sú normálne. Oddych nie je lenivosť, je to regenerácia.' },
  ],
  // ── Menštruácia, deň 3+: krvácanie slabne, estrogén začína stúpať ──
  menstrual_end: [
    { before: 'Energia sa', em: 'pomaly vracia.', body: 'Estrogén začína pomaly stúpať a s ním sa vracia energia. Jemný pohyb ti dnes môže dobre padnúť.' },
    { before: 'Najťažšie je', em: 'za tebou.', body: 'Telo sa uvoľňuje a sily sa postupne vracajú. Nemusíš sa ponáhľať — choď vlastným tempom.' },
    { before: 'Nadýchni sa', em: 'zľahka.', body: 'Telo dokončuje očistu a hladiny hormónov sa pomaly dvíhajú. Krátka prechádzka dnes urobí veľa.' },
    { before: 'Deň za dňom', em: 'ľahšie.', body: 'Estrogén rastie a s ním sa vracia aj chuť hýbať sa. Skús dnes o kúsok viac ako včera.' },
    { before: 'Telo sa', em: 'prebúdza.', body: 'Koniec menštruácie býva zlomový — únava ustupuje a myseľ sa čistí.' },
    { before: 'Pomaly', em: 'vpred.', body: 'Ak ešte cítiš únavu, je to v poriadku. Každá sme iná a telo si svoje tempo určí samo.' },
    { before: 'Svetlo na', em: 'konci.', body: 'Telo má za sebou veľký kus práce — poďakuj mu jemným pohybom a oddychom.' },
    { before: 'Nová kapitola', em: 'sa blíži.', body: 'Menštruačná fáza sa chýli ku koncu a pred tebou je najsilnejšia časť cyklu.' },
  ],
  // ── Skorá folikulárna: estrogén stúpa, energia a nálada rastú ──
  follicular_early: [
    { before: 'Nový', em: 'začiatok.', body: 'Estrogén stúpa a s ním energia aj chuť do života. Skvelý čas začať niečo nové.' },
    { before: 'Sila', em: 'rastie.', body: 'Telo teraz dobre zvláda záťaž a rýchlo regeneruje. Dopraj si tréning, na ktorý si trúfaš.' },
    { before: 'Rozbiehaš', em: 'sa.', body: 'Hladina energie deň za dňom rastie. Dobré obdobie na plány, ktoré si odkladala.' },
    { before: 'Jasná', em: 'myseľ.', body: 'Folikulárna fáza praje sústredeniu aj učeniu. Myseľ je bystrejšia než inokedy.' },
    { before: 'Stúpaš', em: 'vyššie.', body: 'Estrogén ďalej rastie a nálada s ním. Telo si pýta pohyb — vyhovej mu.' },
    { before: 'Chuť', em: 'tvoriť.', body: 'V tejto časti cyklu sa dobre rodia nápady. Zapíš si tie dnešné.' },
    { before: 'V plnom', em: 'prúde.', body: 'Energia je stabilná a regenerácia rýchla. Ideálne dni na silový tréning.' },
    { before: 'Buduješ', em: 'silu.', body: 'Telo je vo fáze rastu — tréning ti teraz prinesie viac než inokedy.' },
  ],
  // ── Neskorá folikulárna: estrogén sa blíži k vrcholu ──
  follicular_late: [
    { before: 'Si vo', em: 'forme.', body: 'Estrogén sa blíži k vrcholu — telo aj myseľ pracujú naplno. Využi tieto dni.' },
    { before: 'Energia je', em: 'na vzostupe.', body: 'Dni pred ovuláciou patria k najsilnejším v cykle. Náročnejší tréning dnes sadne.' },
    { before: 'Ideš si', em: 'po svoje.', body: 'Sebavedomie prirodzene rastie. Dobrý deň na rozhovor, ktorý odkladáš.' },
    { before: 'Naber', em: 'rýchlosť.', body: 'Telo je pripravené na výzvy — sila aj koordinácia sú na vysokej úrovni.' },
    { before: 'Tvoje dni', em: 'sily.', body: 'Vrchol folikulárnej fázy. Čokoľvek dnes začneš, pôjde ľahšie.' },
    { before: 'Všetko ide', em: 'hore.', body: 'Estrogén je takmer na maxime — energia, pleť aj nálada to zvyknú cítiť.' },
    { before: 'Využi', em: 'moment.', body: 'Pred ovuláciou býva výkonnosť najvyššia z celého cyklu.' },
    { before: 'Na', em: 'vrchole vlny.', body: 'Ešte deň-dva a estrogén dosiahne maximum. Telo aj myseľ idú naplno.' },
  ],
  // ── Ovulačné okno: vrchol estrogénu, LH ──
  ovulation: [
    { before: 'Vrchol', em: 'sily.', body: 'Estrogén vrcholí — najvyššia energia a sebavedomie v cykle. Sociálny, kreatívny čas.' },
    { before: 'Tvoj', em: 'vrchol.', body: 'Okolo ovulácie býva energia aj nálada na maxime. Plánuj, tvor, stretávaj sa.' },
    { before: 'Žiariš', em: 'naplno.', body: 'Ovulačné dni — telo je na vrchole cyklu. Uži si ich.' },
  ],
  // ── Skorá luteálna: progesterón stúpa, energia sa ustaľuje ──
  luteal_early: [
    { before: 'Pokojná', em: 'sila.', body: 'Progesterón stúpa a energia sa ustaľuje. Rovnomerné tempo ti dnes sadne viac než šprinty.' },
    { before: 'Stabilné', em: 'tempo.', body: 'Telo prechádza do pokojnejšieho režimu. Sústreď sa na pravidelnosť, nie na výkon.' },
    { before: 'Zotrvačnosť', em: 'pracuje.', body: 'Energia je stále dobrá, len pokojnejšia. Ideálny čas dokončiť rozbehnuté.' },
    { before: 'Dôsledná,', em: 'nie rýchla.', body: 'Progesterón mení rytmus tela — vytrvalosť dnes zvíťazí nad intenzitou.' },
    { before: 'Vnútorný', em: 'pokoj.', body: 'Luteálna fáza sa začína. Telo si pýta rutinu a poriadok — vyhovej mu.' },
  ],
  // ── Stredná luteálna: vrchol progesterónu, vyššia teplota aj výdaj ──
  luteal_mid: [
    { before: 'Počúvaj svoje', em: 'telo.', body: 'Progesterón vrcholí — telesná teplota je vyššia a telo spáli viac energie. Väčší hlad je normálny.' },
    { before: 'Spomaľ a', em: 'uzemni sa.', body: 'Telo sa pripravuje na ďalší cyklus. Buď k sebe jemnejšia.' },
    { before: 'Viac paliva,', em: 'viac pokoja.', body: 'V tejto fáze telo prirodzene spotrebuje viac energie. Dopraj si výdatné jedlo bez výčitiek.' },
    { before: 'Tvoje tempo', em: 'je správne.', body: 'Ak dnes vládzeš menej ako pred týždňom, je to biológia, nie výhovorka.' },
    { before: 'Teplo a', em: 'stabilita.', body: 'Vyššia telesná teplota môže zhoršiť spánok. Chladnejšia spálňa dnes pomôže.' },
  ],
  // ── Neskorá luteálna: hormóny klesajú, PMS okno ──
  luteal_late: [
    { before: 'Kolísanie je', em: 'normálne.', body: 'Hormóny klesajú a nálada môže kolísať — nie je to slabosť, je to biológia. Spánok a pokoj pomáhajú.' },
    { before: 'Dni pred', em: 'periódou.', body: 'Podráždenosť či chute k PMS patria. Jemný pohyb, teplo a dostatok spánku ich miernia.' },
    { before: 'Uvoľni', em: 'nároky.', body: 'Telo aj psychika sú pred periódou citlivejšie. Menej povinností dnes nie je prehra.' },
    { before: 'Dovoľ si', em: 'menej.', body: 'PMS dni si pýtajú jemnosť. Strečing a teplý čaj urobia viac než tvrdý tréning.' },
    { before: 'Už len', em: 'chvíľa.', body: 'Perióda sa blíži a hormóny sú najnižšie. Zajtrajšok môže byť ľahší, než čakáš.' },
  ],
  // ── Cyklus predĺžený (meškanie) — po treťom dni drží posledný titulok ──
  late: [
    { before: 'Cyklus je', em: 'predĺžený.', body: 'Ak ti menštruácia ešte nezačala, môže to byť normálne — cykly sa prirodzene menia. Keď príde, označ jej začiatok a všetko sa zarovná.' },
    { before: 'Telo má', em: 'vlastné tempo.', body: 'Meškanie o pár dní je bežné — stres, spánok či cestovanie vedia cyklus posunúť.' },
    { before: 'Ešte', em: 'trpezlivosť.', body: 'Keď perióda príde, zaznač jej začiatok. Ak mešká dlhšie, dopraj si pokoj a sleduj svoje telo.' },
  ],
};

interface BucketInfo {
  bucket: HeadlineBucket;
  /** First cycle day of the bucket — position within it picks the headline. */
  start: number;
}

function bucketInfo(day: number, cycleLength: number, periodLength: number): BucketInfo {
  if (day > cycleLength) return { bucket: 'late', start: cycleLength + 1 };
  const ranges = getPhaseRanges(cycleLength, periodLength);
  const r = (key: string) => ranges.find((x) => x.key === key);
  const men = r('menstrual');
  const fol = r('follicular');
  const ovu = r('ovulation');
  const lut = r('luteal');

  if (men && day >= men.start && day <= men.end) {
    const startEnd = Math.min(men.start + 1, men.end);
    return day <= startEnd
      ? { bucket: 'menstrual_start', start: men.start }
      : { bucket: 'menstrual_end', start: startEnd + 1 };
  }
  if (fol && day >= fol.start && day <= fol.end) {
    const mid = Math.floor((fol.start + fol.end) / 2);
    return day <= mid
      ? { bucket: 'follicular_early', start: fol.start }
      : { bucket: 'follicular_late', start: mid + 1 };
  }
  if (ovu && day >= ovu.start && day <= ovu.end) return { bucket: 'ovulation', start: ovu.start };
  if (lut) {
    const span = lut.end - lut.start + 1;
    const t1 = lut.start + Math.ceil(span / 3) - 1;
    const t2 = lut.start + Math.ceil((2 * span) / 3) - 1;
    if (day <= t1) return { bucket: 'luteal_early', start: lut.start };
    if (day <= t2) return { bucket: 'luteal_mid', start: t1 + 1 };
    return { bucket: 'luteal_late', start: t2 + 1 };
  }
  return { bucket: 'follicular_early', start: day };
}

export function headlineBucket(day: number, cycleLength: number, periodLength: number): HeadlineBucket {
  return bucketInfo(day, cycleLength, periodLength).bucket;
}

/**
 * The headline for a given cycle day — identical everywhere it renders.
 * Position within the bucket picks the variant (no rotation), so every
 * day of the cycle reads differently; if a bucket ever runs longer than
 * its variants (extreme cycle lengths), the last variant holds.
 */
export function getDailyHeadline(day: number, cycleLength: number, periodLength: number): DailyHeadline & { bucket: HeadlineBucket } {
  const { bucket, start } = bucketInfo(day, cycleLength, periodLength);
  const variants = HEADLINES[bucket];
  const idx = Math.min(Math.max(0, day - start), variants.length - 1);
  return { ...variants[idx], bucket };
}

// ─── "Čo by ti mohlo dnes pomôcť?" ───────────────────────────────────────────
// Tips follow the same position-in-state rule as headlines (Gabi
// 2026-07-28): 1st day of the state → 1st tip set, 2nd → 2nd, … with
// enough sets per state that nothing repeats within one cycle. Voice:
// everyday speech, immediately doable; strava names the nutrient + the
// exact foods.

export interface DailyTips {
  pohyb: string;
  strava: string;
  mysel: string;
}

const TIPS: Record<HeadlineBucket, DailyTips[]> = {
  menstrual_start: [
    {
      pohyb: 'Kŕče? Teplý termofor na brucho a pár hlbokých nádychov — jednoduchá vec, ktorá naozaj funguje.',
      strava: 'Horčík pomáha pri kŕčoch — daj si banán, hrsť mandlí či kúsok tmavej čokolády.',
      mysel: 'Zo zoznamu úloh dnes jednu pokojne vyškrtni — svet sa nezrúti.',
    },
    {
      pohyb: 'Teplá sprcha a pomalé pretiahnutie chrbta v ľahu — viac dnes telo nepýta.',
      strava: 'Zázvorový alebo harmančekový čaj — teplé pitie uvoľňuje kŕče lepšie než studená voda.',
      mysel: 'Ak sa dá, presuň dnešné náročné stretnutie — o pár dní ho zvládneš ľavou zadnou.',
    },
  ],
  menstrual_end: [
    {
      pohyb: 'Vyjdi na 15 minút von — čerstvý vzduch spraví s náladou divy.',
      strava: 'Telo teraz potrebuje železo — daj si šošovicu, špenát či mäso a prikvapkni citrón, nech sa lepšie vstrebe.',
      mysel: 'Skús dnes zaliezť do postele o hodinu skôr — telo ti to vráti.',
    },
    {
      pohyb: 'Päť minút strečingu hneď ráno — jemne naštartuje celý deň.',
      strava: 'Vitamín C pomáha vstrebať železo — pomaranč či paprika k obedu stačia.',
      mysel: 'Napíš si tri veci, ktoré ťa dnes potešili — aj maličkosti sa počítajú.',
    },
    {
      pohyb: 'Krátka joga alebo pomalý bicykel — pohyb, pri ktorom sa dá rozprávať.',
      strava: 'Vitamín B12 podporuje tvorbu krvi — vajcia, syr či ryba ho dodajú.',
      mysel: 'Hodina bez mobilu pred spaním — spánok bude hlbší.',
    },
    {
      pohyb: 'Prechádzka s podcastom či hudbou — telo sa hýbe a hlava oddychuje.',
      strava: 'Pi viac vody než zvyčajne — únava je často len smäd v prestrojení.',
      mysel: 'Rozplánuj si týždeň — energia sa vracia a s ňou aj chuť organizovať.',
    },
    {
      pohyb: 'Skús dnes schody namiesto výťahu — malé kroky vracajú kondíciu.',
      strava: 'Omega-3 tlmia zápal — vlašské orechy, ľanové semienka či losos.',
      mysel: 'Pusti si obľúbenú hudbu pri rannej rutine — nálada sa zdvihne sama.',
    },
    {
      pohyb: 'Vyskúšaj 10-minútovú rozcvičku doma — telo si už pýta pohyb.',
      strava: 'Jogurt či kefír podporia trávenie — probiotiká po náročných dňoch sadnú.',
      mysel: 'Zavolaj niekomu blízkemu — chuť na ľudí sa pomaly vracia.',
    },
    {
      pohyb: 'Dlhšia prechádzka rezkým tempom — otestuj, koľko energie sa už vrátilo.',
      strava: 'Ovsená kaša či celozrnné pečivo — stabilná energia na celé dopoludnie.',
      mysel: 'Sprav si malý plán na najbližšie silné dni — čo chceš stihnúť?',
    },
    {
      pohyb: 'Zajtra začína najsilnejšia časť cyklu — dnes pokojne ľahšie, nech máš z čoho brať.',
      strava: 'Zinok podporuje regeneráciu — tekvicové semienka, syr či hovädzie.',
      mysel: 'Večer si dopraj kúpeľ alebo teplú sprchu — zajtra štartuješ do novej fázy.',
    },
  ],
  follicular_early: [
    {
      pohyb: 'Máš chuť si zacvičiť? Dnes je na to ideálny deň — telo zvládne aj poriadny tréning.',
      strava: 'Pridaj si k jedlu bielkoviny — vajíčka na raňajky či jogurt na desiatu urobia veľa.',
      mysel: 'Tá vec, čo ju stále odkladáš? Dnes je deň na prvý krok.',
    },
    {
      pohyb: 'Skús nový typ tréningu — telo je otvorené výzvam a rýchlo sa učí.',
      strava: 'Zelenina ku každému jedlu — vláknina drží energiu aj trávenie v pohode.',
      mysel: 'Zapíš si nápady, ktoré ti dnes napadnú — hlava teraz dobre tvorí.',
    },
    {
      pohyb: 'Silovému tréningu sa teraz darí — svaly regenerujú rýchlejšie než inokedy.',
      strava: 'Komplexné sacharidy pred tréningom — ovsená kaša či banán dodajú palivo.',
      mysel: 'Nauč sa dnes niečo nové, hoci len 10 minút — pamäť teraz pracuje výborne.',
    },
    {
      pohyb: 'Pridaj k tréningu 10 minút navyše — telo to zvládne ľahko.',
      strava: 'Bielkoviny po tréningu — tvaroh, skyr či proteínové smoothie pomôžu svalom.',
      mysel: 'Naplánuj si väčší cieľ na tento mesiac — teraz máš energiu ho rozbehnúť.',
    },
    {
      pohyb: 'Beh, tanec či bicykel — kardio ide teraz ľahšie, vyskúšaj.',
      strava: 'Fermentované potraviny — kefír, jogurt či kyslá kapusta podporia trávenie aj imunitu.',
      mysel: 'Uprac jeden kút, čo ťa hnevá — akčná energia sa dnes dobre míňa.',
    },
    {
      pohyb: 'Zober kamarátku na spoločný tréning či prechádzku — spolu to odsýpa.',
      strava: 'Orechy a semienka ako desiata — zdravé tuky pre hormóny aj mozog.',
      mysel: 'Povedz nahlas, čo chceš — dnes sa ti dobre formulujú myšlienky.',
    },
    {
      pohyb: 'Vydrž v planku či drepe o kúsok dlhšie než minule — posúvaš sa.',
      strava: 'Pestrý tanier — čím viac druhov zeleniny za deň, tým lepšie pre trávenie.',
      mysel: 'Dohodni si stretnutie či telefonát, na ktorý potrebuješ odvahu.',
    },
    {
      pohyb: 'Dnes pokojne dva pohyby — ranná rozcvička a večerná prechádzka.',
      strava: 'Dopraj si poriadne raňajky — telo v raste potrebuje palivo od rána.',
      mysel: 'Sprav si zoznam, čo chceš stihnúť v najbližších silných dňoch.',
    },
  ],
  follicular_late: [
    {
      pohyb: 'Cítiš silu? Pokojne pridaj — ťažšie váhy či rýchlejšie tempo telo teraz hravo zvládne.',
      strava: 'Pridaj zelenú zeleninu — špenát, brokolica či rukola dodajú kyselinu listovú, ktorú telo pred ovuláciou využije.',
      mysel: 'Čaká ťa ťažký rozhovor či prezentácia? Naplánuj si ich na tieto dni — ide ti to teraz najlepšie.',
    },
    {
      pohyb: 'Dnes je deň na osobný rekord — dlhší beh, ťažší drep či rýchlejšie tempo.',
      strava: 'Ľahší obed — šalát s kuracím či tuniakom — nech ťa popoludní nič nebrzdí.',
      mysel: 'Vybav dnes ten telefonát či mail, čo odkladáš — sebavedomie je na tvojej strane.',
    },
    {
      pohyb: 'Skupinová hodina alebo tréning vo dvojici — energie máš aj na rozdávanie.',
      strava: 'Vajcia, ryba či tofu — kvalitné bielkoviny podporia telo na vrchole formy.',
      mysel: 'Ozvi sa, pýtaj si, čo potrebuješ — teraz to ide samo.',
    },
    {
      pohyb: 'Intervalový tréning — krátke šprinty a pauzy — dnes sadne perfektne.',
      strava: 'Pri vyššom výkone pi o pohár-dva vody viac než zvyčajne.',
      mysel: 'Rozhodnutie, ktoré dlho zvažuješ? Dnes máš na hlavu aj odvahu.',
    },
    {
      pohyb: 'Vyskúšaj niečo odvážne — box, lezecká stena či nová trasa.',
      strava: 'Avokádo či olivový olej — zdravé tuky podporujú tvorbu hormónov.',
      mysel: 'Poď medzi ľudí — energia z teba dnes prirodzene vyžaruje.',
    },
    {
      pohyb: 'Tréning ráno namiesto večera — naštartuješ deň na plné obrátky.',
      strava: 'Bobuľové ovocie k raňajkám — antioxidanty pre telo v plnom nasadení.',
      mysel: 'Napíš si, čo sa ti tento týždeň podarilo — je toho viac, než si myslíš.',
    },
    {
      pohyb: 'Zacvič si vonku, ak sa dá — pohyb aj svetlo zdvihnú náladu ešte vyššie.',
      strava: 'Celozrnná príloha k obedu — energia vydrží až do večera.',
      mysel: 'Skvelý deň požiadať o to, čo chceš — v práci aj doma.',
    },
    {
      pohyb: 'Vrchol formy — dopraj si tréning, na ktorý budeš hrdá.',
      strava: 'Pestré jedlo s bielkovinami aj zeleninou — telo pred ovuláciou ocení všetko.',
      mysel: 'Poznač si, ako sa tieto dni cítiš — nabudúce ich využiješ ešte lepšie.',
    },
  ],
  ovulation: [
    {
      pohyb: 'Dnes môžeš ísť naplno — len nezabudni na poriadnu rozcvičku.',
      strava: 'Siahni po farebnom ovocí — čučoriedky, maliny či pomaranč dodajú vitamín C a antioxidanty.',
      mysel: 'Zavolaj kamarátke alebo si dohodni kávu — na ľudí máš dnes energie oveľa viac.',
    },
    {
      pohyb: 'Skvelý deň na výkon — len pri doskokoch a výpadoch buď opatrnejšia, kĺby sú teraz voľnejšie.',
      strava: 'Vláknina pomáha telu spracovať estrogén — celozrnné obilniny, strukoviny, zelenina.',
      mysel: 'Naplánuj dôležité veci na dnes — komunikuje sa ti najľahšie z celého cyklu.',
    },
    {
      pohyb: 'Tanec, beh či čokoľvek, čo miluješ — dnes si pohyb užiješ najviac.',
      strava: 'Ľahké jedlá s bielkovinami — telo je aktívne a ocení kvalitné palivo.',
      mysel: 'Sprav si dnes poznámku či fotku — na vrchole cyklu sa vidíš najlepšie.',
    },
  ],
  luteal_early: [
    {
      pohyb: 'Namiesto rekordov skús dnes pokojné tempo — dlhšia prechádzka alebo pohodový tréning sadnú viac.',
      strava: 'Komplexné sacharidy držia energiu aj náladu stabilnú — ovsené vločky, celozrnný chlieb či sladké zemiaky.',
      mysel: 'Dnes ti sadne dokončovanie — pozatváraj rozrobené veci, poteší ťa to.',
    },
    {
      pohyb: 'Vytrvalostný pohyb — svižná chôdza, plávanie či bicykel v stálom tempe.',
      strava: 'Nevynechávaj jedlá — pravidelnosť teraz drží náladu stabilnú.',
      mysel: 'Rutina je tvoja kamarátka — rovnaký čas vstávania aj jedla telu sadne.',
    },
    {
      pohyb: 'Pilates alebo silový tréning v pokojnom tempe — kvalita pred rýchlosťou.',
      strava: 'Vápnik môže zmierniť PMS — jogurt, syr či mak si doraj každý deň.',
      mysel: 'Urob si poriadok v drobnostiach — hlava sa ti poďakuje.',
    },
    {
      pohyb: 'Dlhšia prechádzka po večeri — pomôže tráveniu aj spánku.',
      strava: 'Horčík priebežne — orechy, semienka, tmavá čokoláda — telo ho v tejto fáze míňa viac.',
      mysel: 'Menej multitaskingu — jedna vec poriadne ti dnes urobí lepšie.',
    },
    {
      pohyb: 'Strečing či joga navečer — telo prechádza do pokojnejšieho režimu.',
      strava: 'Bielkoviny v každom jedle — pomáhajú držať chute na uzde.',
      mysel: 'Naplánuj si na tento týždeň menej večerných akcií — energia sa začne stišovať.',
    },
  ],
  luteal_mid: [
    {
      pohyb: 'Ak dnes vládzeš menej, je to normálne — telo míňa viac energie aj bez cvičenia. Stačí prechádzka.',
      strava: 'Väčší hlad? Úplne normálne — bielkoviny a vláknina zasýtia najdlhšie: vajcia, tvaroh, šošovica.',
      mysel: 'Spíš horšie? Skús ísť do postele o pol hodinky skôr a odlož mobil.',
    },
    {
      pohyb: 'Pokojný silový tréning či pilates — bez tlaku na výkon.',
      strava: 'Dopraj si výdatný obed — telo teraz reálne spáli viac, nie je to výhovorka.',
      mysel: 'Podvečer si dopraj chvíľu len pre seba — kniha, čaj, ticho.',
    },
    {
      pohyb: 'Plávanie alebo joga — pohyb, ktorý telo zregeneruje, nie vyčerpá.',
      strava: 'Menšie porcie častejšie — stabilný cukor v krvi drží náladu aj energiu.',
      mysel: 'Vyvetraj spálňu — pri vyššej telesnej teplote sa lepšie spí v chlade.',
    },
    {
      pohyb: 'Prechádzka na dennom svetle — pomáha spánku aj nálade.',
      strava: 'Dopraj si teplé jedlo — polievka či dusená zelenina padnú lepšie ako studený šalát.',
      mysel: 'Ak ti dnes niečo lezie na nervy viac než inokedy, počkaj s reakciou do zajtra.',
    },
    {
      pohyb: 'Krátky pohyb po každom dlhom sedení — telo sa nezasekne.',
      strava: 'Omega-3 proti zápalu — losos, vlašské orechy či ľanové semienka.',
      mysel: 'Poďakuj si za to, čo si tento týždeň zvládla — pokojne aj nahlas.',
    },
  ],
  luteal_late: [
    {
      pohyb: 'Stačí 10 minút strečingu či prechádzky — napätie z tela krásne opadne.',
      strava: 'Chuť na sladké? Tmavá čokoláda či orechy dodajú horčík, ktorý pomáha.',
      mysel: 'Veľké rozhodnutia radšej odlož o pár dní — uvidíš ich potom úplne inak.',
    },
    {
      pohyb: 'Jemná joga pred spaním — uvoľní telo aj hlavu.',
      strava: 'Menej soli dnes — slané jedlá zhoršujú nafukovanie a zadržiavanie vody.',
      mysel: 'Nafúknutá či precitlivená? O pár dní to prejde — nie si to ty, sú to hormóny.',
    },
    {
      pohyb: 'Prechádzka namiesto tréningu je dnes úplne v poriadku.',
      strava: 'Vápnik môže zmierniť PMS náladu — jogurt, tvaroh či syr.',
      mysel: 'Povedz doma, že máš náročnejšie dni — nemusíš to zvládať sama.',
    },
    {
      pohyb: 'Teplý kúpeľ alebo sprcha namiesto cvičenia — regenerácia je tiež tréning.',
      strava: 'Obmedz dnes kávu a alkohol — obe vedia PMS zosilniť.',
      mysel: 'Skorší spánok je teraz najlepší liek — dopraj si ho bez výčitiek.',
    },
    {
      pohyb: 'Pretiahni si chrbát a boky — pár minút na podložke uľaví celému telu.',
      strava: 'Teplý čaj namiesto ďalšej kávy — nervový systém sa ti poďakuje.',
      mysel: 'Perióda je za rohom — priprav si veci a choď spať s pokojom.',
    },
  ],
  late: [
    {
      pohyb: 'Drž sa jemného pohybu — prechádzka či strečing telu teraz prospejú najviac.',
      strava: 'Jedz pravidelne a dopraj si teplé jedlá — telo má rado istotu.',
      mysel: 'Stres vie periódu ešte viac oddialiť — dopraj si dnes pokojný večer bez náhlenia.',
    },
    {
      pohyb: 'Krátka prechádzka každý deň — jemný pohyb cyklu pomáha.',
      strava: 'Jedz dostatočne — prísne diéty a hladovanie vedia periódu oddialiť.',
      mysel: 'Meškanie vie potrápiť hlavu — rozptýlenie funguje: film, kniha, kamarátka.',
    },
    {
      pohyb: 'Ostaň pri ľahkom pohybe, kým perióda nepríde — telo si povie samo.',
      strava: 'Teplé jedlá a dostatok spánku — telo potrebuje pokoj, nie reštrikcie.',
      mysel: 'Ak mešká dlhšie a nie je to u teba bežné, pokojne sa poraď s lekárkou — istota upokojí.',
    },
  ],
};

/**
 * Today's Pohyb/Strava/Myseľ tips — same state AND same position rule as
 * the headline, so tips also change every day and never repeat within a
 * cycle (last set holds on extreme cycle lengths, like headlines).
 */
export function getDailyTips(day: number, cycleLength: number, periodLength: number): DailyTips & { bucket: HeadlineBucket } {
  const { bucket, start } = bucketInfo(day, cycleLength, periodLength);
  const sets = TIPS[bucket];
  const idx = Math.min(Math.max(0, day - start), sets.length - 1);
  return { ...sets[idx], bucket };
}
