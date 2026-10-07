// netlify/functions/_contentAccess.ts
//
// Server-side mirror of the client's "is this exercise/stretch free?"
// logic (src/features/telo/libraryCatalog.ts + exerciseTaxonomy.ts) and
// the metered free-quota evaluator (src/lib/entitlement.ts).
//
// Duplicated here ON PURPOSE: a Netlify function can't reliably bundle the
// `@/`-aliased client modules, and video-token must make this decision
// without trusting the client. KEEP IN SYNC with those two files — the
// free-sample rule is "first no-equipment 15-min video per focus, admin
// `free` column overrides", in created_at then id order.

// ── taxonomy parsers (mirror exerciseTaxonomy.ts) ──────────────
type FocusKey = 'full' | 'core' | 'legs';
type StretchFocusKey = 'full' | 'upper' | 'lower';
type EquipKey = 'bands' | 'dumbbells' | 'ball' | 'none';

function parseFocus(body: string | null | undefined): FocusKey | null {
  const b = (body ?? '').toLowerCase();
  if (/cel[ée] telo/.test(b)) return 'full';
  if (/core|abs|brucho/.test(b)) return 'core';
  if (/noh|zadok/.test(b)) return 'legs';
  return null;
}

function parseStretchFocus(body: string | null | undefined): StretchFocusKey | null {
  const b = (body ?? '').toLowerCase();
  if (/cel[ée] telo/.test(b)) return 'full';
  if (/vr[šs]ok|stred/.test(b)) return 'upper';
  if (/doln/.test(b)) return 'lower';
  return null;
}

function parseEquip(equip: string | null | undefined): EquipKey {
  const e = (equip ?? '').toLowerCase();
  if (/gum/.test(e)) return 'bands';
  if (/[čc]ink/.test(e)) return 'dumbbells';
  if (/lopt|ball/.test(e)) return 'ball';
  return 'none';
}

function durationBand(minutes: number): '5' | '15' {
  return minutes <= 10 ? '5' : '15';
}

function parseDurationMin(s: string | null): number {
  if (!s) return 15;
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 15;
}

/** Bunny GUID out of a bare value or an embed URL (mirror extractVideoId). */
export function extractGuid(videoUrl: string | null): string | null {
  if (!videoUrl) return null;
  const b = videoUrl.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/);
  return b ? b[1].toLowerCase() : null;
}

/** The raw exercises row shape this module needs (public.exercises). */
export interface RawRow {
  id: string;
  content_type: 'exercise' | 'stretch';
  body: string | null;
  equip: string | null;
  duration: string | null;
  level: number | null;
  video_url: string | null;
  free: boolean | null; // admin override column (Auto = null)
}

export interface ResolvedContent {
  id: string;
  contentType: 'exercise' | 'stretch';
  isFree: boolean;
}

// The client's initial heuristic before the focus rule (adapt() in
// useExercises.ts): free if low-level or one of two legacy slugs.
function initialFree(r: RawRow): boolean {
  return (r.level ?? 0) <= 1 || r.id.startsWith('ranne-prebudenie') || r.id.startsWith('jemny-core');
}

/**
 * Resolve a Bunny GUID to its content row + effective free flag, matching
 * what the client library shows. `rows` must be ALL active exercises
 * (content_type exercise + stretch), ordered created_at asc, id asc — the
 * same order the client catalogs in, because "first free per focus"
 * depends on it.
 */
export function resolveByGuid(rows: RawRow[], guid: string): ResolvedContent | null {
  const want = guid.toLowerCase();
  for (const contentType of ['exercise', 'stretch'] as const) {
    const group = rows.filter((r) => r.content_type === contentType);
    const freeSeen = new Set<string>();
    const skipPrefix = contentType === 'exercise' ? 'strength-' : 'stretch-';
    for (const r of group) {
      if (r.id.startsWith(skipPrefix)) continue;
      const focus = contentType === 'exercise'
        ? parseFocus(r.body)
        : parseStretchFocus(r.body);
      let isFree = initialFree(r);
      if (focus) {
        const equip = parseEquip(r.equip);
        const band = durationBand(parseDurationMin(r.duration));
        isFree = equip === 'none' && band === '15' && !freeSeen.has(focus);
        if (isFree) freeSeen.add(focus);
      }
      // Admin override wins over the heuristic.
      if (r.free === true) isFree = true;
      if (r.free === false) isFree = false;

      if (extractGuid(r.video_url) === want) {
        return { id: r.id, contentType, isFree };
      }
    }
  }
  return null;
}

// ── free-tier quota (mirror src/lib/entitlement.ts) ────────────
export const QUOTAS: Record<'exercise' | 'stretch', { limit: number; windowDays: number }> = {
  exercise: { limit: 2, windowDays: 7 },
  stretch: { limit: 2, windowDays: 7 },
};

export function windowStartISO(contentType: 'exercise' | 'stretch', now = Date.now()): string {
  return new Date(now - QUOTAS[contentType].windowDays * 86400000).toISOString();
}

/**
 * Given the user's in-window view rows and the candidate content id,
 * decide if a free user may view it. Re-viewing already-seen content is
 * always allowed and costs no credit.
 */
export function quotaAllows(
  contentType: 'exercise' | 'stretch',
  contentId: string,
  viewedIdsInWindow: string[],
): boolean {
  const unique = new Set(viewedIdsInWindow);
  if (unique.has(contentId)) return true;
  return unique.size + 1 <= QUOTAS[contentType].limit;
}
