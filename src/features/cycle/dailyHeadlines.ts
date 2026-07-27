/**
 * Daily cycle headlines — the ONE copy source for the home Periodka card
 * and the tracker hero (they must always read identically).
 *
 * Honesty first (Gabi 2026-07-27): hormone dynamics are medically
 * well-established at SUB-PHASE granularity, not per exact day — so the
 * system maps each woman's own cycle (her length + period length) onto
 * nine physiological states, and rotates phrasings within a state so the
 * headline changes daily without ever claiming something her body isn't
 * doing. Content basis: standard clinical endocrinology of the cycle
 * (estrogen rise through the follicular phase peaking at ovulation, LH
 * surge, progesterone dominance and +0.3–0.5 °C core temperature with
 * higher energy needs in the luteal phase, hormone withdrawal and PMS in
 * the late luteal days, prostaglandin-driven cramps in early menses).
 *
 * Variant picking is deterministic: same woman, same day → same text on
 * every screen; consecutive days differ.
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
    { before: 'Dopraj si', em: 'pokoj.', body: 'Prvé dni menštruácie bývajú najnáročnejšie — kŕče a únava sú normálne. Oddych nie je lenivosť, je to regenerácia.' },
  ],
  // ── Menštruácia, deň 3+: krvácanie slabne, estrogén začína stúpať ──
  menstrual_end: [
    { before: 'Energia sa', em: 'pomaly vracia.', body: 'Krvácanie slabne a estrogén začína stúpať. Jemný pohyb ti dnes môže dobre padnúť.' },
    { before: 'Najťažšie je', em: 'za tebou.', body: 'Telo sa uvoľňuje a sily sa postupne vracajú. Nemusíš sa ponáhľať — choď vlastným tempom.' },
  ],
  // ── Skorá folikulárna: estrogén stúpa, energia a nálada rastú ──
  follicular_early: [
    { before: 'Nový', em: 'začiatok.', body: 'Estrogén stúpa a s ním energia aj chuť do života. Skvelý čas začať niečo nové.' },
    { before: 'Sila', em: 'rastie.', body: 'Telo teraz dobre zvláda záťaž a rýchlo regeneruje. Dopraj si tréning, na ktorý si trúfaš.' },
    { before: 'Rozbiehaš', em: 'sa.', body: 'Hladina energie deň za dňom rastie. Dobré obdobie na plány, ktoré si odkladala.' },
  ],
  // ── Neskorá folikulárna: estrogén sa blíži k vrcholu ──
  follicular_late: [
    { before: 'Si vo', em: 'forme.', body: 'Estrogén sa blíži k vrcholu — telo aj myseľ pracujú naplno. Využi tieto dni.' },
    { before: 'Energia je', em: 'na vzostupe.', body: 'Dni pred ovuláciou patria k najsilnejším v cykle. Náročnejší tréning dnes sadne.' },
  ],
  // ── Ovulačné okno: vrchol estrogénu, LH ──
  ovulation: [
    { before: 'Vrchol', em: 'sily.', body: 'Estrogén vrcholí — najvyššia energia a sebavedomie v cykle. Sociálny, kreatívny čas.' },
    { before: 'Tvoj', em: 'vrchol.', body: 'Okolo ovulácie býva energia aj nálada na maxime. Plánuj, tvor, stretávaj sa.' },
  ],
  // ── Skorá luteálna: progesterón stúpa, energia sa ustaľuje ──
  luteal_early: [
    { before: 'Pokojná', em: 'sila.', body: 'Progesterón stúpa a energia sa ustaľuje. Rovnomerné tempo ti dnes sadne viac než šprinty.' },
    { before: 'Stabilné', em: 'tempo.', body: 'Telo prechádza do pokojnejšieho režimu. Sústreď sa na pravidelnosť, nie na výkon.' },
  ],
  // ── Stredná luteálna: vrchol progesterónu, vyššia teplota aj výdaj ──
  luteal_mid: [
    { before: 'Počúvaj svoje', em: 'telo.', body: 'Progesterón vrcholí — telesná teplota je vyššia a telo spáli viac energie. Väčší hlad je normálny.' },
    { before: 'Spomaľ a', em: 'uzemni sa.', body: 'Telo sa pripravuje na ďalší cyklus. Buď k sebe jemnejšia.' },
  ],
  // ── Neskorá luteálna: hormóny klesajú, PMS okno ──
  luteal_late: [
    { before: 'Buď k sebe', em: 'jemná.', body: 'Hormóny klesajú a nálada môže kolísať — nie je to slabosť, je to biológia. Spánok a pokoj pomáhajú.' },
    { before: 'Dni pred', em: 'periódou.', body: 'Podráždenosť či chute k PMS patria. Jemný pohyb, teplo a dostatok spánku ich miernia.' },
    { before: 'Uvoľni', em: 'nároky.', body: 'Telo aj psychika sú pred periódou citlivejšie. Menej povinností dnes nie je prehra.' },
  ],
  // ── Cyklus predĺžený (meškanie) ──
  late: [
    { before: 'Cyklus je', em: 'predĺžený.', body: 'Ak ti menštruácia ešte nezačala, môže to byť normálne — cykly sa prirodzene menia. Keď príde, označ jej začiatok a všetko sa zarovná.' },
  ],
};

export function headlineBucket(day: number, cycleLength: number, periodLength: number): HeadlineBucket {
  if (day > cycleLength) return 'late';
  const ranges = getPhaseRanges(cycleLength, periodLength);
  const r = (key: string) => ranges.find((x) => x.key === key);
  const men = r('menstrual');
  const fol = r('follicular');
  const ovu = r('ovulation');
  const lut = r('luteal');

  if (men && day >= men.start && day <= men.end) {
    return day <= Math.min(men.start + 1, men.end) ? 'menstrual_start' : 'menstrual_end';
  }
  if (fol && day >= fol.start && day <= fol.end) {
    const mid = Math.floor((fol.start + fol.end) / 2);
    return day <= mid ? 'follicular_early' : 'follicular_late';
  }
  if (ovu && day >= ovu.start && day <= ovu.end) return 'ovulation';
  if (lut) {
    const span = lut.end - lut.start + 1;
    const t1 = lut.start + Math.ceil(span / 3) - 1;
    const t2 = lut.start + Math.ceil((2 * span) / 3) - 1;
    if (day <= t1) return 'luteal_early';
    if (day <= t2) return 'luteal_mid';
    return 'luteal_late';
  }
  return 'follicular_early';
}

/**
 * The headline for a given cycle day — identical everywhere it renders.
 * Deterministic: variant rotates with the cycle day, so it changes daily
 * but never mid-day and never differs between screens.
 */
export function getDailyHeadline(day: number, cycleLength: number, periodLength: number): DailyHeadline & { bucket: HeadlineBucket } {
  const bucket = headlineBucket(day, cycleLength, periodLength);
  const variants = HEADLINES[bucket];
  const v = variants[(Math.max(1, day) - 1) % variants.length];
  return { ...v, bucket };
}
