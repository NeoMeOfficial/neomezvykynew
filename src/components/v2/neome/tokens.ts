/**
 * NeoMe redesign tokens (R9/R12 — "Final Review")
 *
 * Mirrors --neome-r9-* CSS vars defined in src/index.css and the
 * 'neome-r9' Tailwind palette in tailwind.config.ts.
 *
 * Use in JS where Tailwind classes don't reach (inline styles,
 * computed colors, conditional accents per pillar).
 */
export const NM = {
  // Backgrounds
  BG: '#F8F5F0',
  CREAM_2: '#F1ECE3',
  CREAM_3: '#EAE3D6',

  // Ink
  DEEP: '#3D2921',
  DEEP_2: '#2A1A14',

  // Pillar accents (locked, never mix)
  SAGE: '#8B9E88',  // Strava / Nutrition
  TERRA: '#C1856A', // Telo / Body
  DUSTY: '#89B0BC', // Myseľ alt
  MAUVE: '#A8848B', // Cyklus / Period
  SANDY: '#D4C4B0',
  GOLD: '#B8864A',  // Rewards / Plus

  // Type alphas of ink
  EYEBROW: 'rgba(61, 41, 33, 0.55)',
  MUTED: 'rgba(61, 41, 33, 0.72)',
  TERTIARY: 'rgba(61, 41, 33, 0.42)',
  HAIR: 'rgba(61, 41, 33, 0.08)',
  HAIR_2: 'rgba(61, 41, 33, 0.14)',

  // Type families
  SERIF: '"Gilda Display", Georgia, serif',
  SANS: '"DM Sans", system-ui, sans-serif',
} as const;

export type Pillar = 'telo' | 'strava' | 'mysel' | 'cyklus' | 'dennik' | 'komunita' | 'blog';

export const pillarAccent: Record<Pillar, string> = {
  telo: NM.TERRA,
  strava: NM.SAGE,
  mysel: NM.DUSTY,
  cyklus: NM.MAUVE,
  dennik: NM.DEEP,
  komunita: NM.GOLD,
  blog: NM.TERRA,
};
