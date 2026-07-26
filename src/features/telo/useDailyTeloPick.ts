/**
 * Daily Telo recommendation for the home pillar card — the phase formula
 * agreed with Gabi 2026-07-25:
 *
 *   1. Active program → the program's exercise of the day (handled by the
 *      caller via useUserProgram; this hook covers everyone else).
 *   2. Plus + cycle tracked → pick from the library by phase bucket:
 *        follicular + ovulation  → exercises, all focuses, all equipment
 *        luteal 1st half         → exercises, all focuses, NO equipment
 *        luteal 2nd half         → stretches + diastáza-safe exercises
 *        menstrual (or overdue)  → stretches only
 *   3. Plus without cycle → rotate the whole library, nudge to enable it.
 *   4. Free → rotate the free videos only.
 *   5. Streda + piatok = strečingové dni (Gabi 2026-07-26) — the pick is
 *      always a stretch, overriding the phase bucket for every tier.
 *
 * Rotation is deterministic per calendar day (same video for every woman
 * in the same bucket that day; advances daily, no repeats while the pool
 * has more than one item).
 */
import { useMemo } from 'react';
import { useExercises } from '@/hooks/useExercises';
import { useStretches } from '@/hooks/useStretches';
import { useCycle } from '@/hooks/use-cycle';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { EQUIP_SHORT, EQUIP_LABEL, FOCUS_LABEL, STRETCH_FOCUS_LABEL, seriesTitleParts, stretchSeriesTitleParts } from './exerciseTaxonomy';
import { catalogExercises, catalogStretches, CatalogExercise, CatalogStretch } from './libraryCatalog';

export type PhaseBucket = 'power' | 'earlyLuteal' | 'lateLuteal' | 'menstrual';

export interface DailyTeloPick {
  kind: 'exercise' | 'stretch';
  id: string;
  title: string;
  /** Title split for rich rendering — quiet verb + emphasized name + small number. */
  titleParts: { before: string; em: string; num: string } | null;
  /** e.g. "15 min · s gumami" */
  meta: string;
  /** Honest phase line, e.g. "pre folikulárnu fázu" — null without a cycle. */
  reason: string | null;
  thumb: string | null;
  href: string;
  /**
   * location.state payload for ExercisePlayer. `phasePick` gates the
   * "odporúčané podľa fázy" banner — false for stretch-day / no-cycle /
   * free picks, where that claim wouldn't be true.
   */
  playerState: { exercise: Record<string, unknown>; fromRecommendation: boolean; phasePick: boolean };
}

function bucketFor(view: {
  phaseKey: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  currentDay: number;
  isLate: boolean;
  phaseRanges: { key: string; start: number; end: number }[];
}): PhaseBucket {
  if (view.isLate) return 'menstrual';
  switch (view.phaseKey) {
    case 'menstrual':
      return 'menstrual';
    case 'follicular':
    case 'ovulation':
      return 'power';
    case 'luteal': {
      const luteal = view.phaseRanges.find((r) => r.key === 'luteal');
      const mid = luteal ? Math.floor((luteal.start + luteal.end) / 2) : view.currentDay;
      return view.currentDay <= mid ? 'earlyLuteal' : 'lateLuteal';
    }
  }
}

const BUCKET_REASON: Record<PhaseBucket, (phaseKey: string) => string> = {
  power: (k) => (k === 'ovulation' ? 'pre ovulačnú fázu' : 'pre folikulárnu fázu'),
  earlyLuteal: () => 'pre luteálnu fázu',
  lateLuteal: () => 'pre záver luteálnej fázy',
  menstrual: () => 'pre menštruačnú fázu',
};

type PoolItem =
  | { kind: 'exercise'; item: CatalogExercise }
  | { kind: 'stretch'; item: CatalogStretch };

function toPick(p: PoolItem, reason: string | null): DailyTeloPick {
  if (p.kind === 'exercise') {
    const { e } = p.item;
    return {
      kind: 'exercise',
      id: e.id,
      title: p.item.title,
      titleParts: p.item.focus && p.item.seq ? seriesTitleParts(p.item.focus, p.item.seq) : null,
      meta: `${e.duration_min} min · ${EQUIP_SHORT[p.item.equip]}`,
      reason,
      thumb: e.thumb_url,
      href: `/exercise/extra/${e.id}`,
      playerState: {
        fromRecommendation: true,
        phasePick: reason !== null,
        exercise: {
          id: e.id,
          name: p.item.title,
          duration: `${e.duration_min} min`,
          category: p.item.band === '5' ? 'dopalovacka' : '15min',
          body: p.item.focus ? FOCUS_LABEL[p.item.focus] : e.body_target,
          equip: EQUIP_LABEL[p.item.equip],
          videoUrl: e.video_id,
          thumb: e.thumb_url,
          description: e.description,
          diastasisSafe: e.diastasis_safe,
        },
      },
    };
  }
  const { s } = p.item;
  return {
    kind: 'stretch',
    id: s.id,
    title: p.item.title,
    titleParts: p.item.focus && p.item.seq ? stretchSeriesTitleParts(p.item.focus, p.item.seq) : null,
    meta: `${s.duration_min} min · ${EQUIP_SHORT[p.item.equip]}`,
    reason,
    thumb: s.thumb_url,
    href: `/stretch/${s.id}`,
    playerState: {
      fromRecommendation: true,
      phasePick: reason !== null,
      exercise: {
        id: s.id,
        name: p.item.title,
        duration: `${s.duration_min} min`,
        category: 'stretch',
        body: p.item.focus ? STRETCH_FOCUS_LABEL[p.item.focus] : s.body_target,
        equip: EQUIP_LABEL[p.item.equip],
        videoUrl: s.video_id,
        thumb: s.thumb_url,
        description: s.description,
      },
    },
  };
}

export function useDailyTeloPick(): { pick: DailyTeloPick | null; loading: boolean; hasCycle: boolean } {
  const { exercises, loading: exLoading } = useExercises();
  const { stretches, loading: stLoading } = useStretches();
  const { isPremium } = useSubscription();
  const cycle = useCycle();

  return useMemo(() => {
    const loading = exLoading || stLoading;
    const hasCycle = cycle.hasData;
    if (loading) return { pick: null, loading, hasCycle };

    const exs = catalogExercises(exercises).filter((c) => c.focus !== null);
    const sts = catalogStretches(stretches).filter((c) => c.focus !== null);
    const allExs: PoolItem[] = exs.map((item) => ({ kind: 'exercise' as const, item }));
    const allSts: PoolItem[] = sts.map((item) => ({ kind: 'stretch' as const, item }));

    let pool: PoolItem[];
    let reason: string | null = null;

    // Streda + piatok sú strečingové dni (Gabi 2026-07-26): the featured
    // pick is always a stretch, whatever the phase says.
    const dow = new Date().getDay();
    const stretchDay = dow === 3 || dow === 5;

    if (!isPremium) {
      // Free tier rotates its free videos.
      pool = [...allExs, ...allSts].filter((p) => p.item.isFree);
      if (stretchDay) {
        const freeStretches = pool.filter((p) => p.kind === 'stretch');
        if (freeStretches.length > 0) pool = freeStretches;
      }
    } else if (!hasCycle) {
      // Plus without a tracked cycle — whole library, no phase claim.
      pool = stretchDay && allSts.length > 0 ? allSts : [...allExs, ...allSts];
    } else if (stretchDay && allSts.length > 0) {
      // Stretch day overrides the phase bucket — no phase claim either.
      pool = allSts;
    } else {
      const bucket = bucketFor(cycle);
      reason = BUCKET_REASON[bucket](cycle.phaseKey);
      switch (bucket) {
        case 'power':
          pool = allExs;
          break;
        case 'earlyLuteal':
          pool = allExs.filter((p) => p.item.equip === 'none');
          break;
        case 'lateLuteal':
          pool = [
            ...allSts,
            ...allExs.filter((p) => (p.item as CatalogExercise).e.diastasis_safe),
          ];
          break;
        case 'menstrual':
          pool = allSts;
          break;
      }
    }

    if (pool.length === 0) return { pick: null, loading, hasCycle };

    // Deterministic daily rotation over a stable ordering.
    const sorted = [...pool].sort((a, b) =>
      (a.kind === 'exercise' ? a.item.e.id : a.item.s.id).localeCompare(
        b.kind === 'exercise' ? b.item.e.id : b.item.s.id,
      ),
    );
    const dayStamp = Math.floor(Date.now() / 86_400_000);
    const chosen = sorted[dayStamp % sorted.length];
    return { pick: toPick(chosen, reason), loading, hasCycle };
  }, [exercises, stretches, exLoading, stLoading, isPremium, cycle]);
}
