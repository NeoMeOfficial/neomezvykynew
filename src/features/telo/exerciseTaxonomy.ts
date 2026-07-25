/**
 * Canonical taxonomy for the Cvičenia library (agreed with Gabi 2026-07-24).
 *
 * Videos have NO individual names and NO difficulty level. A video is fully
 * described by: duration band (15-min tréning / 5-min dopaľovačka) ×
 * focus (Celé telo / Core & brucho / Nohy & zadok) × equipment
 * (bez pomôcok / gumy / činky / pilates lopta) + diastasis-safe flag.
 * Within one series (band × focus × equipment) videos are numbered by
 * creation order — "Core & brucho č. 3" — so repeated content never needs
 * a new name. Difficulty guidance lives in the free-text description.
 *
 * Parsers are tolerant of the legacy DB spellings ('Core/Abs', 'S gumou')
 * so existing rows classify without a data migration.
 */

export type FocusKey = 'full' | 'core' | 'legs';
export type EquipKey = 'none' | 'bands' | 'dumbbells' | 'ball';
export type BandKey = '15' | '5';

export const FOCUS_ORDER: FocusKey[] = ['full', 'core', 'legs'];
export const EQUIP_ORDER: EquipKey[] = ['none', 'bands', 'dumbbells', 'ball'];

export const FOCUS_LABEL: Record<FocusKey, string> = {
  full: 'Celé telo',
  core: 'Core & brucho',
  legs: 'Nohy & zadok',
};

export const EQUIP_LABEL: Record<EquipKey, string> = {
  none: 'Bez pomôcok',
  bands: 'S gumami',
  dumbbells: 'S činkami',
  ball: 'S pilates loptou',
};

/** Lowercase variant for meta lines ("15 min · s gumami"). */
export const EQUIP_SHORT: Record<EquipKey, string> = {
  none: 'bez pomôcok',
  bands: 's gumami',
  dumbbells: 's činkami',
  ball: 's pilates loptou',
};

export const BAND_LABEL: Record<BandKey, string> = {
  '15': '15 min tréningy',
  '5': '5 min dopaľovačky',
};

export function parseFocus(body: string | null | undefined): FocusKey | null {
  const b = (body ?? '').toLowerCase();
  if (/cel[ée] telo/.test(b)) return 'full';
  if (/core|abs|brucho/.test(b)) return 'core';
  if (/noh|zadok/.test(b)) return 'legs';
  return null;
}

export function parseEquip(equip: string | null | undefined): EquipKey {
  const e = (equip ?? '').toLowerCase();
  if (/gum/.test(e)) return 'bands';
  if (/[čc]ink/.test(e)) return 'dumbbells';
  if (/lopt|ball/.test(e)) return 'ball';
  return 'none';
}

export function durationBand(minutes: number): BandKey {
  return minutes <= 10 ? '5' : '15';
}

// Action phrasing (Gabi 2026-07-25): a bare "Celé telo č. 3" reads like a
// label, not an invitation — exercises say "Posilni si…", stretches
// "Postrečuj si…". Kept separate from FOCUS_LABEL (filters/chips still
// use the noun form); mind the accusative case ("dolnú časť tela").
const EXERCISE_ACTION: Record<FocusKey, string> = {
  full: 'Posilni si celé telo',
  core: 'Posilni si core & brucho',
  legs: 'Posilni si nohy & zadok',
};

/** Generated display name: "Posilni si core & brucho č. 3". */
export function seriesTitle(focus: FocusKey, seq: number): string {
  return `${EXERCISE_ACTION[focus]} č. ${seq}`;
}

// ─── Strečingy ────────────────────────────────────────────────────────────────
// Same scheme, different axes (agreed with Gabi 2026-07-25): band
// (15 min strečingy / 5 min rýchla úľava) × focus (Celé telo /
// Vršok & stred tela / Dolná časť tela) × equipment (bez pomôcok /
// s gumou). No diastáza flag — stretches are inherently gentle.

export type StretchFocusKey = 'full' | 'upper' | 'lower';

export const STRETCH_FOCUS_ORDER: StretchFocusKey[] = ['full', 'upper', 'lower'];

export const STRETCH_FOCUS_LABEL: Record<StretchFocusKey, string> = {
  full: 'Celé telo',
  upper: 'Vršok & stred tela',
  lower: 'Dolná časť tela',
};

export const STRETCH_BAND_LABEL: Record<BandKey, string> = {
  '15': '15 min strečingy',
  '5': '5 min rýchla úľava',
};

/** Stretches use only these two; the shared parseEquip still applies. */
export const STRETCH_EQUIP_ORDER: EquipKey[] = ['none', 'bands'];

export function parseStretchFocus(body: string | null | undefined): StretchFocusKey | null {
  const b = (body ?? '').toLowerCase();
  if (/cel[ée] telo/.test(b)) return 'full';
  if (/vr[šs]ok|stred/.test(b)) return 'upper';
  if (/doln/.test(b)) return 'lower';
  return null;
}

const STRETCH_ACTION: Record<StretchFocusKey, string> = {
  full: 'Postrečuj si celé telo',
  upper: 'Postrečuj si vršok & stred tela',
  lower: 'Postrečuj si dolnú časť tela',
};

/** Generated display name: "Postrečuj si vršok & stred tela č. 2". */
export function stretchSeriesTitle(focus: StretchFocusKey, seq: number): string {
  return `${STRETCH_ACTION[focus]} č. ${seq}`;
}
