import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { NutritionProfile } from './types';
import { getBreastfeedingBonus } from './useNutritionProfile';

/**
 * localStorage key for save-for-later drafts. Stores a serialized
 * snapshot of every controlled input so the user can leave the flow
 * mid-way and resume from the same step + values. Cleared on
 * successful complete.
 */
const DRAFT_KEY = 'neome_nutrition_onboarding_draft';

interface DraftSnapshot {
  step: number;
  goal: string | null;
  age: string;
  weight: string;
  height: string;
  waist: string;
  breast: string;
  hip: string;
  regularDay: string | null;
  stepsRange: string | null;
  sports: string[];
  sportsOther: string;
  sportsFrequency: number | null;
  selectedMeals: string[];
  likedIngredients: string[];
  dislikedIngredients: string[];
  dietType: string;
  allergies: string[];
  customAllergies: string[];
  lifePhase: string | null;
  isBreastfeeding: boolean | null;
  bfFrequency: string;
  startDateISO: string | null;
  savedAt: string;
}

function loadDraft(): DraftSnapshot | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftSnapshot;
  } catch {
    return null;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

/* ─── Round 21 tokens ─── */
const T = {
  BG: '#F8F5F0',
  CARD: '#FFFFFF',
  CARD_2: '#F1ECE3',
  INK: '#3D2921',
  INK_2: '#2A1A14',
  FG_2: 'rgba(61,41,33,0.72)',
  FG_3: 'rgba(61,41,33,0.56)',
  FG_MUTED: 'rgba(61,41,33,0.40)',
  HAIR: 'rgba(61,41,33,0.08)',
  HAIR_2: 'rgba(61,41,33,0.14)',
  SAGE: '#8B9E88',
  SAGE_SOFT: 'rgba(139,158,136,0.14)',
  GOLD: '#B8965A',
  GOLD_SOFT: 'rgba(184,150,90,0.14)',
  TERRA: '#C1856A',
  MAUVE: '#A8848B',
  SERIF: "Gilda Display, Didot, 'Bodoni 72', Georgia, serif",
  SANS: "DM Sans, system-ui, -apple-system, sans-serif",
};

/* ─── types ─── */
type Goal = 'lose' | 'maintain' | 'gain';
type RegularDay = 'sedentary_work' | 'on_feet' | 'with_kids';
type StepsRange = '<5000' | '5000-10000' | '>10000';
type DietType = 'standard' | 'semi-vegetarian' | 'vegetarian' | 'vegan';
type FavMeal = 'ranajky' | 'obed' | 'vecera' | 'snack';
type Allergy =
  | 'gluten' | 'dairy' | 'eggs' | 'fish' | 'nuts'
  | 'peanuts' | 'soy' | 'celery' | 'mustard' | 'sesame';

/* ─── step → section mapping ─── */
// 12 internal steps mapping to 7 user-visible sections.
// Round 21's sticky shell uses a 7-dot indicator (one per section).
const TOTAL_STEPS = 12;
const STEP_META: { section: number; sectionLabel: string; partLabel?: string }[] = [
  { section: 1, sectionLabel: 'Cieľ' },
  { section: 2, sectionLabel: 'Fyzické parametre' },
  { section: 3, sectionLabel: 'Aktivita', partLabel: 'Časť 1 z 4 — Bežný deň' },
  { section: 3, sectionLabel: 'Aktivita', partLabel: 'Časť 2 z 4 — Kroky' },
  { section: 3, sectionLabel: 'Aktivita', partLabel: 'Časť 3 z 4 — Športová aktivita' },
  { section: 3, sectionLabel: 'Aktivita', partLabel: 'Časť 4 z 4 — Frekvencia' },
  { section: 4, sectionLabel: 'Stravovacie preferencie', partLabel: 'Časť 1 z 3 — Výber jedál' },
  { section: 4, sectionLabel: 'Stravovacie preferencie', partLabel: 'Časť 2 z 3 — Preferencie' },
  { section: 4, sectionLabel: 'Stravovacie preferencie', partLabel: 'Časť 3 z 3 — Typ jedálnička' },
  { section: 5, sectionLabel: 'Doplnkové údaje', partLabel: 'Životná fáza' },
  { section: 6, sectionLabel: 'Zhrnutie' },
  { section: 7, sectionLabel: 'Štart' },
];

/* ─── icon set ─── */
const ICONS = {
  Flame: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c1 4 5 5 5 10a5 5 0 11-10 0c0-3 2-4 2-7 2 1 3 2 3 4 1-2 1-4 0-7z" />
    </svg>
  ),
  Scale: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M12 4v3M6 7l-3 7a3 3 0 006 0L6 7zM18 7l-3 7a3 3 0 006 0l-3-7zM6 21h12" />
    </svg>
  ),
  Muscle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11c2-4 6-5 10-3 3 2 5 5 8 4M14 8c1 2 3 3 4 3M9 14a4 4 0 11-6 2" />
    </svg>
  ),
  Desk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="11" rx="1" />
      <path d="M2 19h20M8 16v3M16 16v3" />
    </svg>
  ),
  Walk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="4" r="2" />
      <path d="M8 21l3-7-2-4 4-1 3 4 3 2M11 14l-2 3" />
    </svg>
  ),
  Baby: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="15" cy="11" r="1" fill="currentColor" />
      <path d="M9 15c1 1 5 1 6 0" />
    </svg>
  ),
  Chair: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v9h12V4M4 13h16v4H4zM7 17v3M17 17v3" />
    </svg>
  ),
  Run: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="15" cy="4" r="2" />
      <path d="M4 21l4-5-1-4 4-3 3 4 4 1M8 12l-3 1" />
    </svg>
  ),
  Sun: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </svg>
  ),
  Apple: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7c2-2 5-3 7-1 2 3 1 8-2 12-1 1-3 1-5 0-2 1-4 1-5 0-3-4-4-9-2-12 2-2 5-1 7 1z" />
      <path d="M12 7V4M12 4c-1-1-1-2 0-3 1 1 1 2 0 3z" />
    </svg>
  ),
  Plate: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  ),
  Berry: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="14" r="3" />
      <circle cx="15" cy="14" r="3" />
      <circle cx="12" cy="9" r="3" />
      <path d="M12 6V3" />
    </svg>
  ),
  Moon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 13a8 8 0 11-10-10 6 6 0 0010 10z" />
    </svg>
  ),
  Chicken: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19l3-3M8 16c-3-1-4-5-2-8s7-3 10 0 3 8 0 10c-2 1-5 1-7 0M14 6l-1-2M11 6h-2" />
    </svg>
  ),
  Fish: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c4-6 11-6 15-2l5-3-2 5 2 5-5-3c-4 4-11 4-15-2z" />
      <circle cx="9" cy="11" r="0.6" fill="currentColor" />
    </svg>
  ),
  Egg: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c4 0 7 5 7 11a7 7 0 01-14 0c0-6 3-11 7-11z" />
    </svg>
  ),
  Cal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  Check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  ),
};

/* ─── constants ─── */
const SPORTS_OPTIONS = [
  'Pilates', 'Beh', 'Tanec', 'Posilňovňa / HIIT', 'Joga',
  'Bicykel', 'Plávanie', 'Turistika', 'Aerobik', 'Crossfit',
];

const MEAL_OPTIONS: { key: string; label: string; icon: ReactNode; pct: number }[] = [
  { key: 'ranajky', label: 'Raňajky', icon: ICONS.Sun, pct: 30 },
  { key: 'desiata', label: 'Desiata', icon: ICONS.Apple, pct: 10 },
  { key: 'obed', label: 'Obed', icon: ICONS.Plate, pct: 30 },
  { key: 'olovrant', label: 'Olovrant', icon: ICONS.Berry, pct: 10 },
  { key: 'vecera', label: 'Večera', icon: ICONS.Moon, pct: 20 },
];

const ALLERGY_LABELS: { key: Allergy; label: string }[] = [
  { key: 'gluten', label: 'Lepok (pšenica, raž, jačmeň)' },
  { key: 'dairy', label: 'Mlieko / laktóza' },
  { key: 'eggs', label: 'Vajcia' },
  { key: 'fish', label: 'Ryby' },
  { key: 'nuts', label: 'Orechy (mandle, vlašské...)' },
  { key: 'peanuts', label: 'Arašidy' },
  { key: 'soy', label: 'Sója' },
  { key: 'celery', label: 'Zeler' },
  { key: 'mustard', label: 'Horčica' },
  { key: 'sesame', label: 'Sezam' },
];

const INGREDIENT_SUGGESTIONS = [
  'Kuracie prsia', 'Kuracie stehná', 'Hovädzie mäso', 'Mleté kuracie mäso', 'Losos', 'Tuniak', 'Treska', 'Krevety',
  'Vajcia', 'Tofu', 'Tempeh', 'Cícer', 'Šošovica', 'Červená šošovica', 'Čierne fazule', 'Edamame',
  'Grécky jogurt', 'Tvaroh', 'Cottage cheese', 'Feta', 'Mozzarella',
  'Ovsené vločky', 'Ryža', 'Celozrnná ryža', 'Quinoa', 'Celozrnný chlieb', 'Celozrnná pasta', 'Batáty', 'Zemiaky',
  'Avokádo', 'Brokolica', 'Špenát', 'Kel', 'Cuketa', 'Paprika', 'Paradajky', 'Uhorka', 'Mrkva',
  'Cibuľa', 'Cesnak', 'Červená cibuľa', 'Šampiňóny', 'Karfiol', 'Ružičkový kel',
  'Banán', 'Jablko', 'Jahody', 'Čučoriedky', 'Maliny', 'Pomaranč', 'Mango',
  'Olivový olej', 'Mandle', 'Vlašské orechy', 'Kešu', 'Arašidové maslo', 'Mandľové maslo',
  'Hummus', 'Tahini',
];

/* ─── calc helpers (unchanged from previous revision) ─── */
function deriveActivityLevel(
  regularDay: RegularDay | null,
  stepsRange: StepsRange | null,
  sportsCount: number,
  frequency: number,
): 'sedentary' | 'light' | 'moderate' | 'active' {
  let score = 0;
  if (regularDay === 'on_feet') score += 2;
  else if (regularDay === 'with_kids') score += 1;
  if (stepsRange === '5000-10000') score += 1;
  else if (stepsRange === '>10000') score += 2;
  if (sportsCount > 0) {
    if (frequency >= 5) score += 3;
    else if (frequency >= 3) score += 2;
    else if (frequency >= 1) score += 1;
  }
  if (score <= 1) return 'sedentary';
  if (score <= 3) return 'light';
  if (score <= 5) return 'moderate';
  return 'active';
}

const ACTIVITY_MULTIPLIER = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
const MIN_CALORIES_DEFAULT = 1500;
const MIN_CALORIES_BREASTFEEDING = 1800;

const RANGE_ADJ: Record<Goal, { low: number; high: number }> = {
  lose:     { low: -400, high: -100 },
  maintain: { low: -100, high:  100 },
  gain:     { low:  150, high:  400 },
};

function calcNutrition(
  w: number,
  h: number,
  age: number,
  activity: string,
  goal: Goal,
  isBreastfeeding: boolean,
  bfFrequency?: number,
) {
  const bmr = 10 * w + 6.25 * h - 5 * age - 161;
  const tdeeRaw = Math.round(bmr * (ACTIVITY_MULTIPLIER[activity as keyof typeof ACTIVITY_MULTIPLIER] ?? 1.2));
  const bfBonus = getBreastfeedingBonus(isBreastfeeding, bfFrequency);
  const floor = isBreastfeeding ? MIN_CALORIES_BREASTFEEDING : MIN_CALORIES_DEFAULT;
  const adj = RANGE_ADJ[goal];
  const lowCal = Math.max(floor, Math.round(tdeeRaw + adj.low + bfBonus));
  const highCal = Math.max(lowCal + 100, Math.round(tdeeRaw + adj.high + bfBonus));
  const targetCal = Math.round((lowCal + highCal) / 2);
  const proteinPerKg = age >= 38 ? 2.2 : 1.8;
  const proteinG = Math.round(w * proteinPerKg);
  const fatCal = Math.round(targetCal * 0.27);
  const fatG = Math.round(fatCal / 9);
  const carbCal = Math.max(0, targetCal - proteinG * 4 - fatCal);
  const carbG = Math.round(carbCal / 4);
  const fiberG = age >= 38 ? 30 : 25;
  const proteinPct = Math.round((proteinG * 4 / targetCal) * 100);
  const carbPct = Math.round((carbCal / targetCal) * 100);
  return {
    tdee: tdeeRaw, targetCal, lowCal, highCal,
    proteinG, carbG, fatG, fiberG,
    proteinPerKg, proteinPct, carbPct,
    bfBonus, goalAdjLow: adj.low, goalAdjHigh: adj.high,
  };
}

function getWaistRisk(cm: number): { label: string; color: string; desc: string } {
  if (cm < 80) return { label: 'Nízke riziko', color: T.SAGE, desc: 'Obvod pása je v zdravom rozmedzí.' };
  if (cm <= 88) return { label: 'Zvýšené riziko', color: T.GOLD, desc: 'Zvýšené riziko kardiovaskulárnych ochorení. Viscerálny tuk môže ovplyvňovať hormóny a metabolizmus.' };
  return { label: 'Vysoké riziko', color: T.TERRA, desc: 'Vysoká hladina viscerálneho tuku zvyšuje riziko cukrovky 2. typu a hormonálnej nerovnováhy.' };
}

function getNextMondays(count: number): Date[] {
  const mondays: Date[] = [];
  const d = new Date();
  const daysUntilMonday = d.getDay() === 0 ? 1 : d.getDay() === 1 ? 7 : 8 - d.getDay();
  const nextMon = new Date(d);
  nextMon.setDate(d.getDate() + daysUntilMonday);
  nextMon.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const m = new Date(nextMon);
    m.setDate(nextMon.getDate() + i * 7);
    mondays.push(m);
  }
  return mondays;
}

function formatDate(d: Date): string {
  const days = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
  const months = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
  return `${days[d.getDay()]} ${d.getDate()}. ${months[d.getMonth()]}`;
}

function relativeDateLabel(m: Date): string {
  const diffDays = Math.ceil((m.getTime() - Date.now()) / 86400000);
  if (diffDays <= 7) return 'Tento pondelok';
  return `O ${diffDays} dní`;
}

/* ─── primitive atoms ─── */
function Eye({ children, color = T.FG_3, size = 10, style }: { children: ReactNode; color?: string; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: T.SANS, fontSize: size, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, color, ...style }}>
      {children}
    </div>
  );
}

function Body({ children, size = 13, color = T.FG_2, style }: { children: ReactNode; size?: number; color?: string; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: T.SANS, fontSize: size, color, fontWeight: 300, lineHeight: 1.55, ...style }}>
      {children}
    </div>
  );
}

function Question({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: T.SERIF, fontSize: 22, color: T.INK, lineHeight: 1.2, letterSpacing: '-0.005em' }}>
      {children}
    </div>
  );
}

function IconSquare({ icon, accent = T.SAGE }: { icon: ReactNode; accent?: string }) {
  return (
    <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}22`, color: accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      {icon}
    </div>
  );
}

function OptionCard({
  icon, title, sub, selected, accent = T.SAGE, onClick, last,
}: {
  icon?: ReactNode;
  title: string;
  sub?: string;
  selected?: boolean;
  accent?: string;
  onClick?: () => void;
  last?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        background: T.CARD,
        borderRadius: 16,
        border: `1px solid ${selected ? accent : T.HAIR}`,
        boxShadow: selected ? `inset 0 0 0 1px ${accent}` : 'none',
        marginBottom: last ? 0 : 10,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {icon && <IconSquare icon={icon} accent={accent} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.SANS, fontSize: 14, color: T.INK, fontWeight: 500 }}>{title}</div>
        {sub && <Body size={11.5} style={{ marginTop: 3 }}>{sub}</Body>}
      </div>
      {selected && (
        <div style={{ width: 22, height: 22, borderRadius: 999, background: accent, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

function Chip({
  children, active, onClick, accent = T.SAGE,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        padding: '9px 14px',
        borderRadius: 999,
        background: active ? accent : T.CARD,
        color: active ? '#fff' : T.INK,
        border: `1px solid ${active ? accent : T.HAIR_2}`,
        fontFamily: T.SANS,
        fontSize: 12.5,
        fontWeight: active ? 500 : 400,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

function FreqChip({ n, active, onClick }: { n: number; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        width: 52,
        height: 52,
        borderRadius: 999,
        background: active ? T.SAGE : T.CARD,
        color: active ? '#fff' : T.INK,
        border: `1px solid ${active ? T.SAGE : T.HAIR_2}`,
        fontFamily: T.SANS,
        fontSize: 13,
        fontWeight: 500,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {n}×
    </button>
  );
}

function TextInput({
  label, value, onChange, placeholder, type = 'text', helper, inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  helper?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'email';
}) {
  return (
    <div>
      <div style={{ fontFamily: T.SANS, fontSize: 11.5, color: T.FG_3, fontWeight: 400 }}>{label}</div>
      <div style={{ paddingTop: 6, paddingBottom: 8, borderBottom: `1px solid ${T.HAIR_2}` }}>
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            background: 'transparent',
            border: 0,
            outline: 'none',
            fontFamily: T.SERIF,
            fontSize: 20,
            color: value ? T.INK : T.FG_MUTED,
            letterSpacing: '-0.005em',
            padding: 0,
          }}
        />
      </div>
      {helper && (
        <div style={{ fontFamily: T.SANS, fontSize: 10.5, color: T.FG_3, marginTop: 6, lineHeight: 1.55, fontWeight: 400 }}>
          {helper}
        </div>
      )}
    </div>
  );
}

/* ─── component ─── */
export default function NutritionOnboarding({
  onComplete,
  onCancel,
}: {
  onComplete: (profile: NutritionProfile, startDate: Date) => void;
  onCancel?: () => void;
}) {
  // Lazy-init from a saved draft if one exists. Falls back to fresh
  // defaults otherwise. The draft survives logout/login and tab close.
  const initialDraft = useRef<DraftSnapshot | null>(loadDraft()).current;

  const [step, setStep] = useState(initialDraft?.step ?? 1);

  // S1 — Goal
  const [goal, setGoal] = useState<Goal | null>((initialDraft?.goal as Goal | null) ?? null);

  // S2 — Physical params
  const [age, setAge] = useState(initialDraft?.age ?? '');
  const [weight, setWeight] = useState(initialDraft?.weight ?? '');
  const [height, setHeight] = useState(initialDraft?.height ?? '');
  const [waist, setWaist] = useState(initialDraft?.waist ?? '');
  const [breast, setBreast] = useState(initialDraft?.breast ?? '');
  const [hip, setHip] = useState(initialDraft?.hip ?? '');

  // S3 — Activity (4 parts)
  const [regularDay, setRegularDay] = useState<RegularDay | null>(
    (initialDraft?.regularDay as RegularDay | null) ?? null,
  );
  const [stepsRange, setStepsRange] = useState<StepsRange | null>(
    (initialDraft?.stepsRange as StepsRange | null) ?? null,
  );
  const [sports, setSports] = useState<string[]>(initialDraft?.sports ?? []);
  const [sportsOther, setSportsOther] = useState(initialDraft?.sportsOther ?? '');
  const [sportsFrequency, setSportsFrequency] = useState<number | null>(initialDraft?.sportsFrequency ?? null);

  // S4 — Meal prefs (3 parts)
  const [selectedMeals, setSelectedMeals] = useState<string[]>(initialDraft?.selectedMeals ?? []);
  const [likedIngredients, setLikedIngredients] = useState<string[]>(initialDraft?.likedIngredients ?? []);
  const [dislikedIngredients, setDislikedIngredients] = useState<string[]>(initialDraft?.dislikedIngredients ?? []);
  const [likedInput, setLikedInput] = useState('');
  const [dislikedInput, setDislikedInput] = useState('');
  const [dietType, setDietType] = useState<DietType>((initialDraft?.dietType as DietType) ?? 'standard');
  const [allergies, setAllergies] = useState<Set<Allergy>>(
    () => new Set((initialDraft?.allergies as Allergy[]) ?? []),
  );
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [customAllergies, setCustomAllergies] = useState<string[]>(initialDraft?.customAllergies ?? []);

  // S5 — Life phase
  type LifePhase = 'regular' | 'postpartum' | 'pregnant';
  const [lifePhase, setLifePhase] = useState<LifePhase | null>(
    (initialDraft?.lifePhase as LifePhase | null) ?? null,
  );
  const [isBreastfeeding, setIsBreastfeeding] = useState<boolean | null>(initialDraft?.isBreastfeeding ?? null);
  const [bfFrequency, setBfFrequency] = useState(initialDraft?.bfFrequency ?? '');

  // S7 — Start date
  const [startDate, setStartDate] = useState<Date | null>(
    initialDraft?.startDateISO ? new Date(initialDraft.startDateISO) : null,
  );
  const mondays = getNextMondays(4);

  const [savedNotice, setSavedNotice] = useState(false);
  const saveDraft = () => {
    const snapshot: DraftSnapshot = {
      step,
      goal,
      age, weight, height, waist, breast, hip,
      regularDay, stepsRange, sports, sportsOther, sportsFrequency,
      selectedMeals, likedIngredients, dislikedIngredients,
      dietType, allergies: Array.from(allergies), customAllergies,
      lifePhase, isBreastfeeding, bfFrequency,
      startDateISO: startDate ? startDate.toISOString() : null,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));
    } catch {
      // quota / private mode — ignore
    }
  };
  const handleSaveForLater = () => {
    saveDraft();
    setSavedNotice(true);
    // Give the toast a beat so the user sees it, then close.
    window.setTimeout(() => {
      onCancel?.();
    }, 700);
  };

  /* ─── helpers ─── */
  const toggleSport = (s: string) => setSports((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const toggleMeal = (key: string) => setSelectedMeals((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  const toggleAllergy = (a: Allergy) => setAllergies((prev) => {
    const n = new Set(prev);
    if (n.has(a)) n.delete(a); else n.add(a);
    return n;
  });
  const addIngredient = (list: string[], setList: (v: string[]) => void, val: string, setInput: (v: string) => void) => {
    const v = val.trim().replace(/,+$/, '');
    if (v && !list.includes(v)) setList([...list, v]);
    setInput('');
  };

  const getNutrition = () => {
    const w = parseFloat(weight) || 60;
    const h = parseFloat(height) || 165;
    const a = parseInt(age) || 25;
    const allSports = sportsOther.trim() ? [...sports, sportsOther.trim()] : sports;
    const activity = deriveActivityLevel(regularDay, stepsRange, allSports.length, sportsFrequency ?? 0);
    const bfFreq = bfFrequency ? parseInt(bfFrequency) : undefined;
    return calcNutrition(w, h, a, activity, goal ?? 'maintain', isBreastfeeding === true, bfFreq);
  };

  const canNext = (): boolean => {
    switch (step) {
      case 1: return goal !== null;
      case 2: return age !== '' && weight !== '' && height !== '';
      case 3: return regularDay !== null;
      case 4: return stepsRange !== null;
      case 5: return true;
      case 6: return sports.length === 0 || sportsFrequency !== null;
      case 7: return selectedMeals.length >= 1;
      case 8: return true;
      // Vegan is a visible but honest dead-end: the recipe library has too
      // few purely plant-based meals for a quality plan (4 mains as of the
      // 1. séria import), so we point vegans to a nutritionist instead of
      // selling them a plan we can't deliver.
      case 9: return dietType !== 'vegan';
      case 10:
        if (lifePhase === null) return false;
        if (lifePhase === 'postpartum') return isBreastfeeding !== null;
        return true;
      case 11: return true;
      case 12: return startDate !== null;
      default: return false;
    }
  };

  const handleComplete = () => {
    const n = getNutrition();
    const a = parseInt(age) || 25;
    const allSports = sportsOther.trim() ? [...sports, sportsOther.trim()] : sports;
    const activity = deriveActivityLevel(regularDay, stepsRange, allSports.length, sportsFrequency ?? 0);
    const mealsPerDay = Math.min(5, Math.max(3, selectedMeals.length)) as 3 | 4 | 5;
    const favMeal: FavMeal = selectedMeals.includes('obed') ? 'obed' : (selectedMeals[0] as FavMeal) || 'obed';
    onComplete({
      goal: goal!,
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: a,
      waistCm: waist ? parseFloat(waist) : undefined,
      breastCm: breast ? parseFloat(breast) : undefined,
      hipCm: hip ? parseFloat(hip) : undefined,
      regularDay: regularDay ?? undefined,
      dailyStepsRange: stepsRange ?? undefined,
      sports: allSports,
      sportsFrequency: sportsFrequency ?? undefined,
      activityLevel: activity,
      mealsPerDay,
      selectedMeals,
      dietType: dietType === 'standard' ? 'standard' : dietType,
      allergies: [...Array.from(allergies), ...customAllergies],
      likedIngredients,
      dislikedIngredients,
      favouriteMealOfDay: favMeal,
      lifePhase: lifePhase ?? 'regular',
      isBreastfeeding: lifePhase === 'postpartum' ? (isBreastfeeding ?? false) : false,
      breastfeedingFrequency: bfFrequency ? parseInt(bfFrequency) : undefined,
      isPregnant: lifePhase === 'pregnant',
      dailyCalories: n.targetCal,
      dailyCaloriesMin: n.lowCal,
      dailyCaloriesMax: n.highCal,
      dailyProtein: n.proteinG,
      dailyCarbs: n.carbG,
      dailyFat: n.fatG,
      dailyFiber: n.fiberG,
      proteinPerKg: n.proteinPerKg,
    }, startDate!);
    // Completed — wipe the draft so a future entry starts fresh.
    clearDraft();
  };

  // Auto-clear the toast after a short window so it doesn't linger
  // if the user happens to stay on the screen.
  useEffect(() => {
    if (!savedNotice) return;
    const id = window.setTimeout(() => setSavedNotice(false), 1800);
    return () => window.clearTimeout(id);
  }, [savedNotice]);

  const meta = STEP_META[step - 1];
  const goBack = () => {
    if (step > 1) setStep((p) => p - 1);
    else onCancel?.();
  };
  const goNext = () => {
    if (step < TOTAL_STEPS) setStep((p) => p + 1);
    else handleComplete();
  };

  const ctaLabel = step === TOTAL_STEPS ? 'Vygenerovať jedálniček' : 'Ďalej';
  const ctaPrimary = step === TOTAL_STEPS ? T.SAGE : T.INK;
  const ctaEnabled = canNext();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: T.BG,
        fontFamily: T.SANS,
        color: T.INK,
        display: 'flex',
        flexDirection: 'column',
        // Above the layout BottomNav (z-50) so the focus flow is
        // visually exclusive — no nav chrome poking through.
        zIndex: 100,
      }}
    >
      {/* Sticky top — progress + label + CTA */}
      <div
        style={{
          background: T.BG,
          paddingTop: 'calc(env(safe-area-inset-top) + 14px)',
          borderBottom: `1px solid ${T.HAIR}`,
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '8px 20px 12px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={goBack}
            aria-label="Späť"
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 7-section dot bar */}
            <div style={{ display: 'flex', gap: 5 }}>
              {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => {
                const active = n === meta.section;
                const past = n < meta.section;
                return (
                  <div
                    key={n}
                    style={{
                      height: 5,
                      borderRadius: 999,
                      width: active ? 22 : 5,
                      background: active || past ? T.SAGE : T.HAIR_2,
                      transition: 'width .2s, background .2s',
                    }}
                  />
                );
              })}
            </div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <Eye color={T.SAGE} size={10}>{meta.sectionLabel}</Eye>
              {meta.partLabel && (
                <Body size={10.5} color={T.FG_3} style={{ fontWeight: 400 }}>
                  {meta.partLabel}
                </Body>
              )}
            </div>
          </div>
          {/* Save-for-later — persists all current state to localStorage
              then exits. On re-entry the form rehydrates from the draft. */}
          <button
            onClick={handleSaveForLater}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 999,
              background: T.CARD,
              border: `1px solid ${T.HAIR_2}`,
              fontFamily: T.SANS,
              fontSize: 11.5,
              color: T.FG_2,
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            Uložiť
          </button>
        </div>
        {savedNotice && (
          <div
            role="status"
            style={{
              margin: '0 18px 8px',
              padding: '8px 12px',
              background: T.SAGE_SOFT,
              border: `1px solid ${T.SAGE}30`,
              borderRadius: 10,
              fontFamily: T.SANS,
              fontSize: 11.5,
              color: T.SAGE,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Uložené — môžeš sa kedykoľvek vrátiť.
          </div>
        )}
        <div style={{ padding: '0 18px 14px' }}>
          <button
            onClick={goNext}
            disabled={!ctaEnabled}
            style={{
              width: '100%',
              padding: '15px 18px',
              borderRadius: 999,
              border: 0,
              background: ctaEnabled ? ctaPrimary : T.HAIR_2,
              color: ctaEnabled ? '#fff' : T.FG_MUTED,
              fontFamily: T.SANS,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.02em',
              cursor: ctaEnabled ? 'pointer' : 'not-allowed',
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      {/* Scroll body — generous bottom padding so the last card on
          long-form steps (Step 11 summary, Step 8 prefs) clears the
          underlying layout BottomNav even if the z-index override
          isn't honored on a given browser. */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '18px 20px calc(env(safe-area-inset-bottom) + 110px)',
        }}
      >
        {step === 1 && <Step1Goal goal={goal} setGoal={setGoal} />}
        {step === 2 && (
          <Step2Body
            age={age} setAge={setAge}
            weight={weight} setWeight={setWeight}
            height={height} setHeight={setHeight}
            waist={waist} setWaist={setWaist}
            breast={breast} setBreast={setBreast}
            hip={hip} setHip={setHip}
          />
        )}
        {step === 3 && <Step3RegularDay value={regularDay} setValue={setRegularDay} />}
        {step === 4 && <Step4Steps value={stepsRange} setValue={setStepsRange} />}
        {step === 5 && (
          <Step5Sports
            sports={sports} toggleSport={toggleSport}
            other={sportsOther} setOther={setSportsOther}
          />
        )}
        {step === 6 && (
          <Step6Frequency
            sports={sports} other={sportsOther}
            value={sportsFrequency} setValue={setSportsFrequency}
          />
        )}
        {step === 7 && <Step7Meals selected={selectedMeals} toggle={toggleMeal} />}
        {step === 8 && (
          <Step8Prefs
            likedIngredients={likedIngredients} setLikedIngredients={setLikedIngredients}
            dislikedIngredients={dislikedIngredients} setDislikedIngredients={setDislikedIngredients}
            likedInput={likedInput} setLikedInput={setLikedInput}
            dislikedInput={dislikedInput} setDislikedInput={setDislikedInput}
            allergies={allergies} toggleAllergy={toggleAllergy}
            customAllergies={customAllergies} setCustomAllergies={setCustomAllergies}
            customAllergyInput={customAllergyInput} setCustomAllergyInput={setCustomAllergyInput}
            addIngredient={addIngredient}
          />
        )}
        {step === 9 && <Step9Diet value={dietType} setValue={setDietType} />}
        {step === 10 && (
          <Step10Phase
            lifePhase={lifePhase} setLifePhase={setLifePhase}
            isBreastfeeding={isBreastfeeding} setIsBreastfeeding={setIsBreastfeeding}
            bfFrequency={bfFrequency} setBfFrequency={setBfFrequency}
          />
        )}
        {step === 11 && <Step11Summary nutrition={getNutrition()} goal={goal} isBreastfeeding={isBreastfeeding === true} />}
        {step === 12 && <Step12Start mondays={mondays} startDate={startDate} setStartDate={setStartDate} />}
      </div>
    </div>
  );
}

/* ─── step components ─── */

function Step1Goal({ goal, setGoal }: { goal: Goal | null; setGoal: (g: Goal) => void }) {
  const items = [
    { key: 'lose' as const, icon: ICONS.Flame, title: 'Chudnutie', sub: 'Zdravé zníženie hmotnosti a telesného tuku' },
    { key: 'maintain' as const, icon: ICONS.Scale, title: 'Udržanie váhy', sub: 'Udržať aktuálnu hmotnosť a zlepšiť skladbu tela' },
    { key: 'gain' as const, icon: ICONS.Muscle, title: 'Naberanie svalov', sub: 'Budovanie svalovej hmoty a sily' },
  ];
  return (
    <>
      <Question>Aký je tvoj cieľ?</Question>
      <div style={{ marginTop: 22 }}>
        {items.map((o, i) => (
          <OptionCard
            key={o.key}
            icon={o.icon}
            title={o.title}
            sub={o.sub}
            selected={goal === o.key}
            onClick={() => setGoal(o.key)}
            last={i === items.length - 1}
          />
        ))}
      </div>
    </>
  );
}

function Step2Body({
  age, setAge, weight, setWeight, height, setHeight,
  waist, setWaist, breast, setBreast, hip, setHip,
}: {
  age: string; setAge: (v: string) => void;
  weight: string; setWeight: (v: string) => void;
  height: string; setHeight: (v: string) => void;
  waist: string; setWaist: (v: string) => void;
  breast: string; setBreast: (v: string) => void;
  hip: string; setHip: (v: string) => void;
}) {
  const waistNum = parseFloat(waist);
  const waistRisk = waist && waistNum > 0 ? getWaistRisk(waistNum) : null;
  return (
    <>
      <Question>Pár čísel o tebe</Question>
      <Body size={12} style={{ marginTop: 8 }}>Pomôžu nám vypočítať tvoje denné kalórie.</Body>

      <div style={{ marginTop: 22, padding: 18, background: T.CARD, borderRadius: 18, border: `1px solid ${T.HAIR}` }}>
        <TextInput label="Vek *" value={age} onChange={setAge} placeholder="28" type="number" inputMode="numeric" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18 }}>
          <TextInput label="Váha (kg) *" value={weight} onChange={setWeight} placeholder="65" type="number" inputMode="decimal" />
          <TextInput label="Výška (cm) *" value={height} onChange={setHeight} placeholder="168" type="number" inputMode="decimal" />
        </div>
      </div>

      <div style={{ marginTop: 14, padding: 18, background: T.CARD, borderRadius: 18, border: `1px solid ${T.HAIR}` }}>
        <div style={{ fontFamily: T.SANS, fontSize: 13, color: T.INK, fontWeight: 500 }}>Telesné obvody</div>
        <Body size={11.5} style={{ marginTop: 4 }}>
          Slúžia ako vstupný údaj. Po ukončení plánu ti pošleme porovnanie zmien.
        </Body>
        <div style={{ marginTop: 14 }}>
          <TextInput label="Obvod pásu (cm) — odporúčame" value={waist} onChange={setWaist} placeholder="napr. 78" type="number" inputMode="decimal" />
          {waistRisk && (
            <div
              style={{
                marginTop: 10,
                padding: '10px 12px',
                borderRadius: 10,
                background: `${waistRisk.color}14`,
                border: `1px solid ${waistRisk.color}30`,
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: 999, background: waistRisk.color }} />
                <span style={{ fontFamily: T.SANS, fontSize: 11.5, fontWeight: 500, color: waistRisk.color, letterSpacing: '0.04em' }}>
                  {waistRisk.label}
                </span>
              </div>
              <Body size={11} style={{ lineHeight: 1.5 }}>{waistRisk.desc}</Body>
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 16 }}>
          <TextInput label="Obvod prs (cm)" value={breast} onChange={setBreast} placeholder="napr. 95" type="number" inputMode="decimal" />
          <TextInput label="Obvod bokov (cm)" value={hip} onChange={setHip} placeholder="napr. 100" type="number" inputMode="decimal" />
        </div>
      </div>
    </>
  );
}

function Step3RegularDay({ value, setValue }: { value: RegularDay | null; setValue: (v: RegularDay) => void }) {
  const items = [
    { key: 'sedentary_work' as const, icon: ICONS.Desk, title: 'Sedavá práca', sub: 'Väčšinu dňa sedím — kancelária, home office, auto.' },
    { key: 'on_feet' as const, icon: ICONS.Walk, title: 'Stále na nohách', sub: 'Práca v stoji, predajňa, zdravotníctvo, škola…' },
    { key: 'with_kids' as const, icon: ICONS.Baby, title: 'Okolo detí', sub: 'Materská / rodičovská, aktívny deň s deťmi.' },
  ];
  return (
    <>
      <Question>Aký je tvoj bežný deň?</Question>
      <div style={{ marginTop: 22 }}>
        {items.map((o, i) => (
          <OptionCard
            key={o.key}
            icon={o.icon}
            title={o.title}
            sub={o.sub}
            selected={value === o.key}
            onClick={() => setValue(o.key)}
            last={i === items.length - 1}
          />
        ))}
      </div>
    </>
  );
}

function Step4Steps({ value, setValue }: { value: StepsRange | null; setValue: (v: StepsRange) => void }) {
  const items = [
    { key: '<5000' as const, icon: ICONS.Chair, title: 'Menej ako 5 000 krokov' },
    { key: '5000-10000' as const, icon: ICONS.Walk, title: '5 000 – 10 000 krokov' },
    { key: '>10000' as const, icon: ICONS.Run, title: 'Viac ako 10 000 krokov' },
  ];
  return (
    <>
      <Question>Koľko krokov denne prejdeš?</Question>
      <Body size={12} style={{ marginTop: 8 }}>Ak nevieš presne, odhadni priemer.</Body>
      <div style={{ marginTop: 22 }}>
        {items.map((o, i) => (
          <OptionCard
            key={o.key}
            icon={o.icon}
            title={o.title}
            selected={value === o.key}
            onClick={() => setValue(o.key)}
            last={i === items.length - 1}
          />
        ))}
      </div>
    </>
  );
}

function Step5Sports({
  sports, toggleSport, other, setOther,
}: {
  sports: string[];
  toggleSport: (s: string) => void;
  other: string;
  setOther: (s: string) => void;
}) {
  return (
    <>
      <Question>Akej športovej aktivite sa venuješ?</Question>
      <Body size={12} style={{ marginTop: 8 }}>Môžeš vybrať viac možností. Ak necvičíš, prejdi ďalej.</Body>
      <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {SPORTS_OPTIONS.map((s) => (
          <Chip key={s} active={sports.includes(s)} onClick={() => toggleSport(s)}>
            {s}
          </Chip>
        ))}
      </div>
      <div style={{ marginTop: 26 }}>
        <div style={{ fontFamily: T.SANS, fontSize: 11.5, color: T.FG_3 }}>Iné (vlastný text)</div>
        <div style={{ paddingTop: 8, paddingBottom: 8, borderBottom: `1px solid ${T.HAIR_2}` }}>
          <input
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="napr. Korčuľovanie, Lukostreľba…"
            style={{
              width: '100%', background: 'transparent', border: 0, outline: 'none',
              fontFamily: T.SANS, fontSize: 14, color: other ? T.INK : T.FG_MUTED, padding: 0,
            }}
          />
        </div>
      </div>
    </>
  );
}

function Step6Frequency({
  sports, other, value, setValue,
}: {
  sports: string[];
  other: string;
  value: number | null;
  setValue: (n: number) => void;
}) {
  if (sports.length === 0 && !other.trim()) {
    return (
      <>
        <Question>Frekvencia cvičenia</Question>
        <div
          style={{
            marginTop: 22,
            padding: '22px 20px',
            background: T.CARD,
            borderRadius: 18,
            border: `1px solid ${T.HAIR}`,
            textAlign: 'center',
          }}
        >
          <Body size={13}>
            Nevybrala si žiadnu aktivitu — žiadny problém! Jedálniček prispôsobíme tvojmu tempu.
          </Body>
        </div>
      </>
    );
  }
  return (
    <>
      <Question>Koľkokrát týždenne cvičíš?</Question>
      <Body size={12} style={{ marginTop: 8 }}>
        Celkový počet tréningov týždenne — bez ohľadu na typ aktivity. Napr. beh 3× + posilňovňa 2× = 5×/týždeň.
      </Body>
      <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <FreqChip key={n} n={n} active={value === n} onClick={() => setValue(n)} />
        ))}
      </div>
      {value !== null && (
        <Body size={11.5} color={T.SAGE} style={{ marginTop: 18, fontWeight: 500 }}>
          {value <= 2 ? 'Skvelý základ — konzistencia je základ.' : value <= 4 ? 'Výborné — pravidelné cvičenie.' : 'Veľmi aktívna — plán bude tomu zodpovedať.'}
        </Body>
      )}
    </>
  );
}

function Step7Meals({ selected, toggle }: { selected: string[]; toggle: (k: string) => void }) {
  return (
    <>
      <Question>Aké jedlá chceš mať v pláne?</Question>
      <div style={{ marginTop: 22 }}>
        {MEAL_OPTIONS.map((m, i) => (
          <OptionCard
            key={m.key}
            icon={m.icon}
            title={m.label}
            sub={`~${m.pct}% denných kalórií`}
            selected={selected.includes(m.key)}
            onClick={() => toggle(m.key)}
            last={i === MEAL_OPTIONS.length - 1}
          />
        ))}
      </div>
    </>
  );
}

function Step8Prefs({
  likedIngredients, setLikedIngredients,
  dislikedIngredients, setDislikedIngredients,
  likedInput, setLikedInput,
  dislikedInput, setDislikedInput,
  allergies, toggleAllergy,
  customAllergies, setCustomAllergies,
  customAllergyInput, setCustomAllergyInput,
  addIngredient,
}: {
  likedIngredients: string[];
  setLikedIngredients: (v: string[]) => void;
  dislikedIngredients: string[];
  setDislikedIngredients: (v: string[]) => void;
  likedInput: string;
  setLikedInput: (v: string) => void;
  dislikedInput: string;
  setDislikedInput: (v: string) => void;
  allergies: Set<Allergy>;
  toggleAllergy: (a: Allergy) => void;
  customAllergies: string[];
  setCustomAllergies: (v: string[]) => void;
  customAllergyInput: string;
  setCustomAllergyInput: (v: string) => void;
  addIngredient: (list: string[], setList: (v: string[]) => void, val: string, setInput: (v: string) => void) => void;
}) {
  const likedMatches = likedInput.trim().length >= 1
    ? INGREDIENT_SUGGESTIONS.filter((s) => s.toLowerCase().startsWith(likedInput.toLowerCase()) && !likedIngredients.includes(s)).slice(0, 5)
    : [];
  const dislikedMatches = dislikedInput.trim().length >= 1
    ? INGREDIENT_SUGGESTIONS.filter((s) => s.toLowerCase().startsWith(dislikedInput.toLowerCase()) && !dislikedIngredients.includes(s)).slice(0, 5)
    : [];

  return (
    <>
      <Question>Tvoje preferencie</Question>

      <div style={{ marginTop: 20 }}>
        <Body size={12} color={T.FG_3}>Čo ti chutí? (voliteľné)</Body>
        {likedIngredients.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {likedIngredients.map((item) => (
              <Chip key={item} active onClick={() => setLikedIngredients(likedIngredients.filter((x) => x !== item))}>
                {item} ×
              </Chip>
            ))}
          </div>
        )}
        <div style={{ position: 'relative', marginTop: 10 }}>
          <div style={{ paddingTop: 8, paddingBottom: 10, borderBottom: `1px solid ${T.HAIR_2}` }}>
            <input
              value={likedInput}
              onChange={(e) => setLikedInput(e.target.value)}
              placeholder="Začni písať… napr. Kura"
              style={{
                width: '100%', background: 'transparent', border: 0, outline: 'none',
                fontFamily: T.SANS, fontSize: 14, color: likedInput ? T.INK : T.FG_MUTED, padding: 0,
              }}
            />
          </div>
          {likedMatches.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: T.CARD, borderRadius: 10, boxShadow: '0 8px 24px rgba(61,41,33,0.10)', zIndex: 10, overflow: 'hidden', marginTop: 4 }}>
              {likedMatches.map((match) => (
                <button
                  key={match}
                  onClick={() => addIngredient(likedIngredients, setLikedIngredients, match, setLikedInput)}
                  style={{
                    all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
                    textAlign: 'left', padding: '10px 14px', fontFamily: T.SANS, fontSize: 13, color: T.INK,
                    borderBottom: `1px solid ${T.HAIR}`, boxSizing: 'border-box',
                  }}
                >
                  {match}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <Body size={12} color={T.FG_3}>Čo ti nechutí / čo vynechať? (voliteľné)</Body>
        {dislikedIngredients.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {dislikedIngredients.map((item) => (
              <Chip key={item} active accent={T.GOLD} onClick={() => setDislikedIngredients(dislikedIngredients.filter((x) => x !== item))}>
                {item} ×
              </Chip>
            ))}
          </div>
        )}
        <div style={{ position: 'relative', marginTop: 10 }}>
          <div style={{ paddingTop: 8, paddingBottom: 10, borderBottom: `1px solid ${T.HAIR_2}` }}>
            <input
              value={dislikedInput}
              onChange={(e) => setDislikedInput(e.target.value)}
              placeholder="Začni písať… napr. Cibuľa"
              style={{
                width: '100%', background: 'transparent', border: 0, outline: 'none',
                fontFamily: T.SANS, fontSize: 14, color: dislikedInput ? T.INK : T.FG_MUTED, padding: 0,
              }}
            />
          </div>
          {dislikedMatches.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: T.CARD, borderRadius: 10, boxShadow: '0 8px 24px rgba(61,41,33,0.10)', zIndex: 10, overflow: 'hidden', marginTop: 4 }}>
              {dislikedMatches.map((match) => (
                <button
                  key={match}
                  onClick={() => addIngredient(dislikedIngredients, setDislikedIngredients, match, setDislikedInput)}
                  style={{
                    all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
                    textAlign: 'left', padding: '10px 14px', fontFamily: T.SANS, fontSize: 13, color: T.INK,
                    borderBottom: `1px solid ${T.HAIR}`, boxSizing: 'border-box',
                  }}
                >
                  {match}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 26 }}>
        <div style={{ fontFamily: T.SANS, fontSize: 13, color: T.INK, fontWeight: 500 }}>Alergie a intolerancie</div>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALLERGY_LABELS.map((a) => (
            <Chip key={a.key} active={allergies.has(a.key)} onClick={() => toggleAllergy(a.key)}>
              {a.label}
            </Chip>
          ))}
        </div>
        {customAllergies.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {customAllergies.map((item) => (
              <Chip key={item} active accent={T.TERRA} onClick={() => setCustomAllergies(customAllergies.filter((x) => x !== item))}>
                {item} ×
              </Chip>
            ))}
          </div>
        )}
        <div style={{ marginTop: 12, paddingTop: 8, paddingBottom: 10, borderBottom: `1px solid ${T.HAIR_2}` }}>
          <input
            value={customAllergyInput}
            onChange={(e) => setCustomAllergyInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ',') && customAllergyInput.trim()) {
                e.preventDefault();
                const val = customAllergyInput.trim();
                if (!customAllergies.includes(val)) setCustomAllergies([...customAllergies, val]);
                setCustomAllergyInput('');
              }
            }}
            placeholder="Iná alergia — napíš a stlač Enter"
            style={{
              width: '100%', background: 'transparent', border: 0, outline: 'none',
              fontFamily: T.SANS, fontSize: 14, color: customAllergyInput ? T.INK : T.FG_MUTED, padding: 0,
            }}
          />
        </div>
      </div>
    </>
  );
}

function Step9Diet({ value, setValue }: { value: DietType; setValue: (v: DietType) => void }) {
  const items = [
    { key: 'standard' as const, icon: ICONS.Chicken, title: 'Univerzálny', sub: 'Všetky potraviny vrátane mäsa a rýb.' },
    { key: 'semi-vegetarian' as const, icon: ICONS.Fish, title: 'Semi-vegetariánsky', sub: 'Prevažne rastlinná strava a ryby. Chudé mäso cca 3× týždenne.' },
    { key: 'vegetarian' as const, icon: ICONS.Egg, title: 'Vegetariánsky', sub: 'Bez mäsa a rýb, vajcia a mliečne produkty sú OK.' },
    { key: 'vegan' as const, icon: ICONS.Apple, title: 'Vegánsky', sub: 'Čisto rastlinná strava — bez mäsa, vajec a mliečnych produktov.' },
  ];
  return (
    <>
      <Question>Typ jedálnička</Question>
      <div style={{ marginTop: 22 }}>
        {items.map((o, i) => (
          <OptionCard
            key={o.key}
            icon={o.icon}
            title={o.title}
            sub={o.sub}
            selected={value === o.key}
            onClick={() => setValue(o.key)}
            last={i === items.length - 1}
          />
        ))}
      </div>

      {value === 'vegan' && (
        <div
          style={{
            marginTop: 16,
            padding: '14px 16px',
            background: T.GOLD_SOFT,
            border: `1px solid ${T.GOLD}30`,
            borderRadius: 14,
            fontFamily: T.SANS,
            fontSize: 12,
            color: T.GOLD,
            lineHeight: 1.55,
          }}
        >
          Naša knižnica receptov zatiaľ neobsahuje dosť čisto rastlinných jedál na to,
          aby sme ti vedeli zostaviť kvalitný vegánsky jedálniček — a nechceme ti predať
          niečo polovičaté. Odporúčame ti konzultáciu s výživovým poradcom. Ak ti
          vyhovujú vajcia a mliečne produkty, vyber si vegetariánsky typ.
        </div>
      )}
    </>
  );
}

type LifePhase = 'regular' | 'postpartum' | 'pregnant';

function Step10Phase({
  lifePhase, setLifePhase, isBreastfeeding, setIsBreastfeeding, bfFrequency, setBfFrequency,
}: {
  lifePhase: LifePhase | null;
  setLifePhase: (v: LifePhase) => void;
  isBreastfeeding: boolean | null;
  setIsBreastfeeding: (v: boolean | null) => void;
  bfFrequency: string;
  setBfFrequency: (v: string) => void;
}) {
  const items = [
    { key: 'regular' as const, title: 'Mám pravidelný cyklus', sub: 'Menštruácia, ovulácia, luteálna fáza.' },
    { key: 'postpartum' as const, title: 'Som po pôrode', sub: 'Postpartum — prvé týždne aj mesiace.' },
    { key: 'pregnant' as const, title: 'Som tehotná', sub: 'Aktuálne tehotenstvo.' },
  ];
  return (
    <>
      <Question>Životná fáza</Question>
      <Body size={12} style={{ marginTop: 8 }}>
        Pomôže nám prispôsobiť tvoj plán — kojace mamičky a tehotné majú iné nutričné potreby.
      </Body>
      <div style={{ marginTop: 22 }}>
        {items.map((o, i) => (
          <OptionCard
            key={o.key}
            title={o.title}
            sub={o.sub}
            selected={lifePhase === o.key}
            onClick={() => {
              setLifePhase(o.key);
              if (o.key !== 'postpartum') {
                setIsBreastfeeding(null);
                setBfFrequency('');
              }
            }}
            last={i === items.length - 1}
          />
        ))}
      </div>

      {lifePhase === 'postpartum' && (
        <div style={{ marginTop: 14, padding: 18, background: T.CARD, borderRadius: 18, border: `1px solid ${T.HAIR}` }}>
          <div style={{ fontFamily: T.SANS, fontSize: 13, color: T.INK, fontWeight: 500, marginBottom: 12 }}>Kojíš?</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setIsBreastfeeding(true)}
              style={pillStyle(isBreastfeeding === true)}
            >
              Áno
            </button>
            <button
              onClick={() => setIsBreastfeeding(false)}
              style={pillStyle(isBreastfeeding === false)}
            >
              Nie
            </button>
          </div>
          {isBreastfeeding === true && (
            <div style={{ marginTop: 16 }}>
              <TextInput
                label="Koľkokrát za 24 hodín?"
                value={bfFrequency}
                onChange={setBfFrequency}
                placeholder="napr. 6"
                type="number"
                inputMode="numeric"
                helper="Podľa počtu kŕmení ti pridáme +250 až +500 kcal. Ak nevyplníš, použijeme +300 kcal."
              />
            </div>
          )}
        </div>
      )}

      {lifePhase === 'pregnant' && (
        <div
          style={{
            marginTop: 14,
            padding: '14px 16px',
            background: T.GOLD_SOFT,
            border: `1px solid ${T.GOLD}30`,
            borderRadius: 14,
            fontFamily: T.SANS,
            fontSize: 12,
            color: T.GOLD,
            lineHeight: 1.55,
          }}
        >
          Počas tehotenstva odporúčame konzultovať výživový plán so svojím gynekológom alebo pôrodníkom.
        </div>
      )}

      <Body size={11.5} style={{ marginTop: 16 }}>
        Ak máš zdravotnú diagnózu (cukrovka, PCOS, hypotyreóza a pod.), odporúčame ti konzultáciu s dietológom.
      </Body>
    </>
  );
}

function pillStyle(active: boolean): CSSProperties {
  return {
    all: 'unset',
    cursor: 'pointer',
    flex: 1,
    textAlign: 'center',
    padding: '10px 14px',
    borderRadius: 999,
    background: active ? T.SAGE : T.CARD,
    color: active ? '#fff' : T.INK,
    border: `1px solid ${active ? T.SAGE : T.HAIR_2}`,
    fontFamily: T.SANS,
    fontSize: 13,
    fontWeight: active ? 500 : 400,
  };
}

function Step11Summary({
  nutrition, goal, isBreastfeeding,
}: {
  nutrition: ReturnType<typeof calcNutrition>;
  goal: Goal | null;
  isBreastfeeding: boolean;
}) {
  const fmt = (n: number) => n.toLocaleString('sk-SK').replace(/,/g, ' ');
  const n = nutrition;
  const goalAdjLabel = goal === 'lose'
    ? { name: 'Mierny deficit na chudnutie', sub: 'Udržateľné chudnutie bez hladovania', range: `${n.goalAdjLow} až ${n.goalAdjHigh} kcal`, color: T.TERRA }
    : goal === 'gain'
    ? { name: 'Mierny prebytok na naberanie', sub: 'Pre zdravý rast svalovej hmoty', range: `+${n.goalAdjLow} až +${n.goalAdjHigh} kcal`, color: T.SAGE }
    : { name: 'Udržanie váhy', sub: 'Rozmedzie okolo tvojich potrieb', range: `${n.goalAdjLow} až +${n.goalAdjHigh} kcal`, color: T.INK };
  const tail = goal === 'lose' ? ', cieľa schudnúť' : goal === 'gain' ? ', cieľa nabrať' : '';
  return (
    <>
      <Question>Tvoj výživový plán</Question>

      {/* Hero range card */}
      <div
        style={{
          marginTop: 18,
          padding: '22px 20px',
          background: T.CARD,
          borderRadius: 20,
          border: `1px solid ${T.HAIR}`,
          textAlign: 'center',
        }}
      >
        <Eye color={T.FG_3} size={10}>Tvoje denné rozmedzie</Eye>
        <div style={{ marginTop: 14, fontFamily: T.SERIF, fontSize: 44, color: T.INK, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {fmt(n.lowCal)} <span style={{ color: T.FG_3 }}>—</span> {fmt(n.highCal)}
        </div>
        <Body size={12.5} style={{ marginTop: 8 }}>kcal za deň</Body>
        <Body size={11.5} style={{ marginTop: 14, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
          Tvoje telo dnes potrebuje niekde medzi týmito hodnotami — podľa tvojich aktivít{tail}{isBreastfeeding ? ' a kojenia' : ''}.
        </Body>
      </div>

      {/* How to read */}
      <div style={{ marginTop: 14, padding: 20, background: T.CARD, borderRadius: 18, border: `1px solid ${T.HAIR}` }}>
        <div style={{ fontFamily: T.SANS, fontSize: 13, color: T.INK, fontWeight: 500, marginBottom: 14 }}>Ako čítať toto rozmedzie</div>
        <SummaryRow big={fmt(n.highCal)} head="Aktívny deň" body="keď máš tréning, dlhú prechádzku alebo náročný režim, siahni po hornej hranici." />
        <SummaryRow big={fmt(n.lowCal)} head="Ľahší deň" body="keď oddychuješ alebo máš pokojný režim, postačí dolná hranica." />
      </div>

      {/* How we got here */}
      <div style={{ marginTop: 14, padding: 20, background: T.CARD, borderRadius: 18, border: `1px solid ${T.HAIR}` }}>
        <div style={{ fontFamily: T.SANS, fontSize: 13, color: T.INK, fontWeight: 500, marginBottom: 14 }}>Ako sme sa k tomuto rozmedziu dostali</div>
        <SummaryStep head="Základné potreby tvojho tela" sub="Koľko kalórií spáliš za deň podľa tvojich aktivít" value={`${fmt(n.tdee)} kcal`} />
        <SummaryStep head={goalAdjLabel.name} sub={goalAdjLabel.sub} value={goalAdjLabel.range} valueColor={goalAdjLabel.color} />
        {isBreastfeeding && n.bfBonus > 0 && (
          <SummaryStep head="Kojenie" sub="Extra energia pre tvoje dieťatko (vždy + k obom hraniciam)" value={`+${n.bfBonus} kcal`} valueColor={T.SAGE} />
        )}
        <div style={{ height: 1, background: T.HAIR, margin: '12px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: T.SANS, fontSize: 13, color: T.INK, fontWeight: 500 }}>Tvoje rozmedzie</div>
          <div style={{ fontFamily: T.SERIF, fontSize: 19, color: T.GOLD, letterSpacing: '-0.005em' }}>{fmt(n.lowCal)} — {fmt(n.highCal)} kcal</div>
        </div>
        {n.lowCal === 1500 && !isBreastfeeding && goal === 'lose' && (
          <div style={{ marginTop: 12, padding: '10px 12px', background: T.GOLD_SOFT, borderRadius: 10, fontFamily: T.SANS, fontSize: 11.5, color: T.GOLD, fontWeight: 400, lineHeight: 1.5 }}>
            Dolná hranica upravená na minimálny odporúčaný príjem pre ženy (1500 kcal).
          </div>
        )}
        {n.lowCal === 1800 && isBreastfeeding && (
          <div style={{ marginTop: 12, padding: '10px 12px', background: T.GOLD_SOFT, borderRadius: 10, fontFamily: T.SANS, fontSize: 11.5, color: T.GOLD, fontWeight: 400, lineHeight: 1.5 }}>
            Dolná hranica upravená na minimálny odporúčaný príjem pre kojace ženy (1800 kcal).
          </div>
        )}
      </div>

      {/* Macros */}
      <div style={{ marginTop: 14, padding: 20, background: T.CARD, borderRadius: 18, border: `1px solid ${T.HAIR}` }}>
        <div style={{ fontFamily: T.SANS, fontSize: 13, color: T.INK, fontWeight: 500, marginBottom: 14 }}>Makronutrienty</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { l: 'Proteín', v: n.proteinG, sub: `${n.proteinPct}% kalórií` },
            { l: 'Sacharidy', v: n.carbG, sub: `${n.carbPct}% kalórií` },
            { l: 'Tuky', v: n.fatG, sub: '27% kalórií' },
          ].map((m) => (
            <div key={m.l} style={{ padding: '12px 10px', background: T.CARD_2, borderRadius: 12 }}>
              <Eye color={T.FG_3} size={9}>{m.l}</Eye>
              <div style={{ marginTop: 6, fontFamily: T.SERIF, fontSize: 22, color: T.INK }}>
                {m.v}<span style={{ fontSize: 13, color: T.FG_3 }}>g</span>
              </div>
              <Body size={10} style={{ marginTop: 3 }}>{m.sub}</Body>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 10,
            padding: '12px 14px',
            background: T.SAGE_SOFT,
            border: `1px solid ${T.SAGE}30`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Eye color={T.SAGE} size={9}>Vláknina</Eye>
            <div style={{ marginTop: 4, fontFamily: T.SERIF, fontSize: 18, color: T.INK }}>
              {n.fiberG}<span style={{ fontSize: 12, color: T.FG_3 }}>g denne</span>
            </div>
          </div>
          <Body size={10.5} color={T.FG_3}>Črevný mikrobióm · stabilita glukózy</Body>
        </div>
      </div>
    </>
  );
}

function SummaryRow({ big, head, body }: { big: string; head: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: 14, paddingTop: 8, paddingBottom: 8 }}>
      <div style={{ fontFamily: T.SERIF, fontSize: 16, color: T.SAGE, width: 64, flexShrink: 0, letterSpacing: '-0.005em' }}>{big}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.SANS, fontSize: 12.5, color: T.INK, fontWeight: 500 }}>{head}</div>
        <Body size={11.5} style={{ marginTop: 3 }}>{body}</Body>
      </div>
    </div>
  );
}

function SummaryStep({ head, sub, value, valueColor }: { head: string; sub: string; value: string; valueColor?: string }) {
  return (
    <div style={{ paddingTop: 8, paddingBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontFamily: T.SANS, fontSize: 12.5, color: T.INK, fontWeight: 500 }}>{head}</div>
        <div style={{ fontFamily: T.SANS, fontSize: 12, fontWeight: 500, color: valueColor || T.INK, whiteSpace: 'nowrap' }}>{value}</div>
      </div>
      <Body size={11.5} style={{ marginTop: 3 }}>{sub}</Body>
    </div>
  );
}

function Step12Start({
  mondays, startDate, setStartDate,
}: {
  mondays: Date[];
  startDate: Date | null;
  setStartDate: (d: Date) => void;
}) {
  return (
    <>
      <Question>Kedy chceš začať?</Question>
      <Body size={12} style={{ marginTop: 8 }}>Jedálniček vždy začína v pondelok.</Body>
      <div style={{ marginTop: 22 }}>
        {mondays.map((m, i) => (
          <OptionCard
            key={m.toISOString()}
            icon={ICONS.Cal}
            title={formatDate(m)}
            sub={relativeDateLabel(m)}
            selected={startDate?.toISOString() === m.toISOString()}
            onClick={() => setStartDate(m)}
            last={i === mondays.length - 1}
          />
        ))}
      </div>
    </>
  );
}
