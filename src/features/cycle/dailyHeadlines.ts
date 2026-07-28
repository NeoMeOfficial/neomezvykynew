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
    { before: 'Buduješ', em: 'silu.', body: 'Telo je vo fáze rastu — každý tréning sa teraz počíta dvojnásobne.' },
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
// One tip per category per state (Gabi 2026-07-28: "menej je viac") —
// short, concrete, doable on an ordinary day. The tip holds for the
// whole state while the headline above it changes daily.

export interface DailyTips {
  pohyb: string;
  strava: string;
  mysel: string;
}

const TIPS: Record<HeadlineBucket, DailyTips> = {
  menstrual_start: {
    pohyb: 'Kŕče? Teplý termofor na brucho a pár hlbokých nádychov — jednoduchá vec, ktorá naozaj funguje.',
    strava: 'Horčík pomáha pri kŕčoch — daj si banán, hrsť mandlí či kúsok tmavej čokolády.',
    mysel: 'Zo zoznamu úloh dnes jednu pokojne vyškrtni — svet sa nezrúti.',
  },
  menstrual_end: {
    pohyb: 'Vyjdi na 15 minút von — čerstvý vzduch spraví s náladou divy.',
    strava: 'Telo teraz potrebuje železo — daj si šošovicu, špenát či mäso a prikvapkni citrón, nech sa lepšie vstrebe.',
    mysel: 'Skús dnes zaliezť do postele o hodinu skôr — telo ti to vráti.',
  },
  follicular_early: {
    pohyb: 'Máš chuť si zacvičiť? Dnes je na to ideálny deň — telo zvládne aj poriadny tréning.',
    strava: 'Pridaj si k jedlu bielkoviny — vajíčka na raňajky či jogurt na desiatu urobia veľa.',
    mysel: 'Tá vec, čo ju stále odkladáš? Dnes je deň na prvý krok.',
  },
  follicular_late: {
    pohyb: 'Cítiš silu? Pokojne pridaj — ťažšie váhy či rýchlejšie tempo telo teraz hravo zvládne.',
    strava: 'Pridaj zelenú zeleninu — špenát, brokolica či rukola dodajú kyselinu listovú, ktorú telo pred ovuláciou využije.',
    mysel: 'Čaká ťa ťažký rozhovor či prezentácia? Naplánuj si ich na tieto dni — ide ti to teraz najlepšie.',
  },
  ovulation: {
    pohyb: 'Dnes môžeš ísť naplno — len nezabudni na poriadnu rozcvičku.',
    strava: 'Siahni po farebnom ovocí — čučoriedky, maliny či pomaranč dodajú vitamín C a antioxidanty.',
    mysel: 'Zavolaj kamarátke alebo si dohodni kávu — na ľudí máš dnes energie oveľa viac.',
  },
  luteal_early: {
    pohyb: 'Namiesto rekordov skús dnes pokojné tempo — dlhšia prechádzka alebo pohodový tréning sadnú viac.',
    strava: 'Komplexné sacharidy držia energiu aj náladu stabilnú — ovsené vločky, celozrnný chlieb či sladké zemiaky.',
    mysel: 'Dnes ti sadne dokončovanie — pozatváraj rozrobené veci, poteší ťa to.',
  },
  luteal_mid: {
    pohyb: 'Ak dnes vládzeš menej, je to normálne — telo míňa viac energie aj bez cvičenia. Stačí prechádzka.',
    strava: 'Väčší hlad? Úplne normálne — bielkoviny a vláknina zasýtia najdlhšie: vajcia, tvaroh, šošovica.',
    mysel: 'Spíš horšie? Skús ísť do postele o pol hodinky skôr a odlož mobil.',
  },
  luteal_late: {
    pohyb: 'Stačí 10 minút strečingu či prechádzky — napätie z tela krásne opadne.',
    strava: 'Chuť na sladké? Tmavá čokoláda či orechy dodajú horčík, ktorý pomáha.',
    mysel: 'Veľké rozhodnutia radšej odlož o pár dní — uvidíš ich potom úplne inak.',
  },
  late: {
    pohyb: 'Drž sa jemného pohybu — prechádzka či strečing telu teraz prospejú najviac.',
    strava: 'Jedz pravidelne a dopraj si teplé jedlá — telo má rado istotu.',
    mysel: 'Stres vie periódu ešte viac oddialiť — dopraj si dnes pokojný večer bez náhlenia.',
  },
};

/** Today's Pohyb/Strava/Myseľ tips — keyed to the same state as the headline. */
export function getDailyTips(day: number, cycleLength: number, periodLength: number): DailyTips & { bucket: HeadlineBucket } {
  const { bucket } = bucketInfo(day, cycleLength, periodLength);
  return { ...TIPS[bucket], bucket };
}
