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

/**
 * Number the exercise library (skips legacy 'strength-N' demo rows).
 * Numbering is unique per FOCUS across all durations and equipment
 * ("Posilni si celé telo #1…#8") — a number never repeats within a
 * focus, so two different videos can't share a title (Gabi 2026-07-25).
 * Duration + equipment live in the meta line, not the title.
 */
export function catalogExercises(exercises: DbExercise[]): CatalogExercise[] {
  const counters = new Map<string, number>();
  const freeSeen = new Set<string>();
  return exercises
    .filter((e) => !e.id.startsWith('strength-'))
    .map((e) => {
      const focus = parseFocus(e.body_target);
      const equip = parseEquip(e.equipment);
      const band = durationBand(e.duration_min);
      let seq: number | null = null;
      let isFree = e.free;
      if (focus) {
        seq = (counters.get(focus) ?? 0) + 1;
        counters.set(focus, seq);
        // Free = first no-equipment 15-min video of each focus (max 3),
        // regardless of its number in the focus-wide sequence.
        isFree = equip === 'none' && band === '15' && !freeSeen.has(focus);
        if (isFree) freeSeen.add(focus);
      }
      return {
        e,
        focus,
        equip,
        band,
        seq,
        title: focus && seq ? seriesTitle(focus, seq) : e.name,
        isFree,
      };
    });
}

/** Number the stretch library — same focus-wide scheme as exercises. */
export function catalogStretches(stretches: DbStretch[]): CatalogStretch[] {
  const counters = new Map<string, number>();
  const freeSeen = new Set<string>();
  return stretches
    .filter((s) => !s.id.startsWith('stretch-'))
    .map((s) => {
      const focus = parseStretchFocus(s.body_target);
      const equip = parseEquip(s.equipment);
      const band = durationBand(s.duration_min);
      let seq: number | null = null;
      let isFree = s.free;
      if (focus) {
        seq = (counters.get(focus) ?? 0) + 1;
        counters.set(focus, seq);
        isFree = equip === 'none' && band === '15' && !freeSeen.has(focus);
        if (isFree) freeSeen.add(focus);
      }
      return {
        s,
        focus,
        equip,
        band,
        seq,
        title: focus && seq ? stretchSeriesTitle(focus, seq) : s.name,
        isFree,
      };
    });
}
