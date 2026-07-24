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

/** Generated display name: "Core & brucho č. 3". */
export function seriesTitle(focus: FocusKey, seq: number): string {
  return `${FOCUS_LABEL[focus]} č. ${seq}`;
}
