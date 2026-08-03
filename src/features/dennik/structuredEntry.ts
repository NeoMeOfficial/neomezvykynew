/**
 * Structured diary entries (Gabi 2026-07-30).
 *
 * A day's entry = čo sa podarilo (line) + energiu dalo / zobralo
 * (chips — deliberately, so patterns are counted facts, not text
 * guesses) + reflexia (free text, neutral prompt so hard days belong
 * here too).
 *
 * Storage: serialized as JSON INTO the existing diary_entries.text
 * column with a version marker — zero schema migration, old plain-text
 * entries keep working, RLS untouched. parseStructured() returns null
 * for plain entries.
 *
 * Phase 2 (agreed, not built): cross patterns with cycle phase
 * ("v luteálnej fáze ti energiu berie práca").
 */

export interface StructuredDiaryEntry {
  v: 1;
  /** Čo sa ti dnes podarilo? */
  win: string;
  /** Čo ti dnes dalo energiu? — chip labels */
  gave: string[];
  /** Čo ti dnes zobralo energiu? — chip labels */
  took: string[];
  /** Reflexia dňa — free text */
  reflection: string;
}

export const ENERGY_CHIPS = [
  'Spánok',
  'Pohyb',
  'Čas pre seba',
  'Deti',
  'Partner',
  'Priatelia',
  'Práca',
  'Jedlo',
  'Príroda',
];

const CUSTOM_CHIPS_KEY = 'neome_dennik_custom_chips_v1';

export function readCustomChips(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CHIPS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

export function addCustomChip(label: string): string[] {
  const clean = label.trim();
  const existing = readCustomChips();
  if (!clean || existing.includes(clean) || ENERGY_CHIPS.includes(clean)) return existing;
  const next = [...existing, clean].slice(-12);
  try { localStorage.setItem(CUSTOM_CHIPS_KEY, JSON.stringify(next)); } catch { /* full */ }
  return next;
}

export function removeCustomChip(label: string): string[] {
  const next = readCustomChips().filter((c) => c !== label);
  try { localStorage.setItem(CUSTOM_CHIPS_KEY, JSON.stringify(next)); } catch { /* full */ }
  return next;
}

// Long-press deletion works for preset chips too — they aren't removed
// from code, just hidden per device.
const HIDDEN_CHIPS_KEY = 'neome_dennik_hidden_chips_v1';

export function readHiddenChips(): string[] {
  try {
    const raw = localStorage.getItem(HIDDEN_CHIPS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

export function hideDefaultChip(label: string): string[] {
  const cur = readHiddenChips();
  if (cur.includes(label)) return cur;
  const next = [...cur, label];
  try { localStorage.setItem(HIDDEN_CHIPS_KEY, JSON.stringify(next)); } catch { /* full */ }
  return next;
}

export function serializeStructured(e: Omit<StructuredDiaryEntry, 'v'>): string {
  return JSON.stringify({ v: 1, ...e });
}

export function parseStructured(text: string): StructuredDiaryEntry | null {
  if (!text.startsWith('{"v":1')) return null;
  try {
    const parsed = JSON.parse(text);
    if (parsed && parsed.v === 1) {
      return {
        v: 1,
        win: typeof parsed.win === 'string' ? parsed.win : '',
        gave: Array.isArray(parsed.gave) ? parsed.gave : [],
        took: Array.isArray(parsed.took) ? parsed.took : [],
        reflection: typeof parsed.reflection === 'string' ? parsed.reflection : '',
      };
    }
    return null;
  } catch { return null; }
}

export interface EnergyPatterns {
  /** [label, count] sorted desc */
  gave: [string, number][];
  took: [string, number][];
  structuredCount: number;
  windowDays: number;
}

/**
 * Tally energy chips over the last `windowDays` of structured entries.
 * Counted facts — every tally comes from the user's own taps.
 */
export function computeEnergyPatterns(
  entries: { text: string; date: string }[],
  windowDays = 7,
): EnergyPatterns {
  const since = new Date();
  since.setDate(since.getDate() - windowDays);
  const sinceISO = `${since.getFullYear()}-${String(since.getMonth() + 1).padStart(2, '0')}-${String(since.getDate()).padStart(2, '0')}`;
  const gave = new Map<string, number>();
  const took = new Map<string, number>();
  let structuredCount = 0;
  for (const e of entries) {
    if (e.date < sinceISO) continue;
    const s = parseStructured(e.text);
    if (!s) continue;
    structuredCount += 1;
    for (const g of s.gave) gave.set(g, (gave.get(g) ?? 0) + 1);
    for (const t of s.took) took.set(t, (took.get(t) ?? 0) + 1);
  }
  const sortDesc = (m: Map<string, number>): [string, number][] =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  return { gave: sortDesc(gave), took: sortDesc(took), structuredCount, windowDays };
}
