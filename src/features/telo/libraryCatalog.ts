/**
 * Shared enrichment of the raw exercises/stretches tables into the
 * taxonomy shape: parsed focus/equipment/band + per-series numbering
 * ("Core & brucho č. 3") + the free-tier flag.
 *
 * TeloExtra, TeloStrecing AND the daily phase recommendation all number
 * videos through these two functions, so a video has the same title and
 * free status everywhere.
 */
import { DbExercise } from '@/hooks/useExercises';
import { DbStretch } from '@/hooks/useStretches';
import {
  FocusKey, StretchFocusKey, EquipKey, BandKey,
  parseFocus, parseStretchFocus, parseEquip, durationBand,
  seriesTitle, stretchSeriesTitle,
} from './exerciseTaxonomy';

export interface CatalogExercise {
  e: DbExercise;
  focus: FocusKey | null;
  equip: EquipKey;
  band: BandKey;
  seq: number | null;
  title: string;
  isFree: boolean;
}

export interface CatalogStretch {
  s: DbStretch;
  focus: StretchFocusKey | null;
  equip: EquipKey;
  band: BandKey;
  seq: number | null;
  title: string;
  isFree: boolean;
}

/** Series-number the exercise library (skips legacy 'strength-N' demo rows). */
export function catalogExercises(exercises: DbExercise[]): CatalogExercise[] {
  const counters = new Map<string, number>();
  return exercises
    .filter((e) => !e.id.startsWith('strength-'))
    .map((e) => {
      const focus = parseFocus(e.body_target);
      const equip = parseEquip(e.equipment);
      const band = durationBand(e.duration_min);
      let seq: number | null = null;
      if (focus) {
        const key = `${band}|${focus}|${equip}`;
        seq = (counters.get(key) ?? 0) + 1;
        counters.set(key, seq);
      }
      return {
        e,
        focus,
        equip,
        band,
        seq,
        title: focus && seq ? seriesTitle(focus, seq) : e.name,
        // Free = first no-equipment 15-min video of each focus (max 3).
        isFree: focus ? seq === 1 && equip === 'none' && band === '15' : e.free,
      };
    });
}

/** Series-number the stretch library (skips legacy 'stretch-N' demo rows). */
export function catalogStretches(stretches: DbStretch[]): CatalogStretch[] {
  const counters = new Map<string, number>();
  return stretches
    .filter((s) => !s.id.startsWith('stretch-'))
    .map((s) => {
      const focus = parseStretchFocus(s.body_target);
      const equip = parseEquip(s.equipment);
      const band = durationBand(s.duration_min);
      let seq: number | null = null;
      if (focus) {
        const key = `${band}|${focus}|${equip}`;
        seq = (counters.get(key) ?? 0) + 1;
        counters.set(key, seq);
      }
      return {
        s,
        focus,
        equip,
        band,
        seq,
        title: focus && seq ? stretchSeriesTitle(focus, seq) : s.name,
        isFree: focus ? seq === 1 && equip === 'none' && band === '15' : s.free,
      };
    });
}
