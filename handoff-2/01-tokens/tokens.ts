/**
 * NeoMe · Design Tokens (TypeScript)
 *
 * DROP-IN REPLACEMENT for `src/theme/warmDusk.ts`.
 *
 * Strategy: keep the same export names so existing imports keep compiling.
 * Internal values are the new NeoMe system.
 *
 * Old name → new meaning:
 *   section.telo     → terracotta (Telo / Body / Movement)
 *   section.strava   → sage       (Strava / Výživa / Nutrition)
 *   section.mysel    → mauve      (Myseľ / Mind)
 *   section.periodka → dusty rose (Cyklus / Period)
 *   accent           → gold       (Plus tier marker)
 *
 * After porting this file, also update:
 *   - src/index.css  (HSL block — see ./index.css)
 *   - tailwind.config.ts (mappings — see ./tailwind.config.snippet.ts)
 */

// ── Pillar accents ─────────────────────────────────────────────────
export const section = {
  telo:     '#C1856A', // terracotta — Telo / Body
  strava:   '#8B9E88', // sage       — Strava / Výživa
  mysel:    '#A395AC', // mauve      — Myseľ / Mind
  periodka: '#B08A9A', // dusty rose — Cyklus / Period
} as const;

// Pillar tints — for backgrounds, chips, soft fills
export const pillar = {
  telo:     { 100: '#EAD5C7', 300: '#D5AC95', 500: '#C1856A', 700: '#9C6148' },
  strava:   { 100: '#D8DFD7', 300: '#B2BFB0', 500: '#8B9E88', 700: '#6B7C68' },
  mysel:    { 100: '#E0D9E3', 300: '#C3B7CB', 500: '#A395AC', 700: '#7C6D88' },
  cyklus:   { 100: '#E8D8DF', 300: '#CFB0BC', 500: '#B08A9A', 700: '#8A6775' },
  myselCool:'#89B0BC', // breath/meditation sub-accent for Myseľ
} as const;

// ── Surfaces / ink ─────────────────────────────────────────────────
export const surface = {
  cream:     '#F8F5F0', // primary background
  cream50:   '#FBF9F5', // softest cream
  cream100:  '#F8F5F0',
  cream200:  '#F1ECE3', // raised card on cream
  cream300:  '#EAE3D6', // pressed / inset
  white:     '#FFFFFF', // small cards over cream
  sandy:     '#D4C4B0', // warm neutral, dividers
} as const;

export const ink = {
  base:    '#3D2921', // warm dark brown — NEVER pure black
  ink700:  '#5F3E31',
  ink500:  '#8B6959',
} as const;

// ── Text hierarchy ─────────────────────────────────────────────────
export const text = {
  primary:   '#3D2921',           // ink
  secondary: 'rgba(61, 41, 33, 0.72)',
  tertiary:  'rgba(61, 41, 33, 0.56)',
  muted:     'rgba(61, 41, 33, 0.40)',
  onDark:    '#FFFFFF',
  onDark2:   'rgba(255, 255, 255, 0.72)',
  onDark3:   'rgba(255, 255, 255, 0.48)',
} as const;

// Backwards-compat aliases — keep old names from warmDusk.ts compiling.
export const textPrimary   = text.primary;
export const textSecondary = text.secondary;
export const textTertiary  = text.tertiary;

// ── Borders ────────────────────────────────────────────────────────
export const border = {
  hair:       'rgba(61, 41, 33, 0.08)', // 1px warm border
  hairStrong: 'rgba(61, 41, 33, 0.14)',
} as const;

// ── System accents ─────────────────────────────────────────────────
export const accent = '#B8965A'; // gold — Plus tier marker
export const gold = {
  500:  '#B8965A',
  100:  '#EEDFC2',
  soft: 'rgba(184, 150, 90, 0.12)',
} as const;

export const success = '#6B8C5F';
export const danger  = '#B5544A';

// ── Cycle phases ───────────────────────────────────────────────────
// (Used by Cyklus screens — phase-tinted backgrounds.)
export const cyclePhase = {
  menstruation: '#B08A9A', // dusty rose
  follicular:   '#A395AC', // mauve
  ovulation:    '#C1856A', // terracotta
  luteal:       '#8B9E88', // sage
} as const;

// ── Typography ─────────────────────────────────────────────────────
export const fonts = {
  display: "'Gilda Display', 'Didot', 'Bodoni 72', Georgia, serif",
  body:    "'DM Sans', system-ui, -apple-system, sans-serif",
} as const;

export const fontSize = {
  display: '42px', // onboarding hero
  hero:    '34px', // screen headers
  h1:      '28px', // section headers
  h2:      '22px', // card headers
  h3:      '18px', // sub-headers
  lg:      '17px', // lead body
  md:      '15px', // body
  sm:      '13px', // meta / caption
  xs:      '11px', // pill labels only
} as const;

export const lineHeight = {
  tight:  1.05,
  snug:   1.15,
  normal: 1.45,
  body:   1.55,
  loose:  1.72,
} as const;

export const letterSpacing = {
  eyebrow: '0.24em',
  display: '-0.015em',
  hero:    '-0.01em',
} as const;

// ── Radii ──────────────────────────────────────────────────────────
export const radius = {
  xs:   '8px',
  sm:   '12px',
  md:   '16px',
  lg:   '20px',  // card default
  xl:   '28px',  // hero card
  '2xl':'36px',
  pill: '9999px',
} as const;

// ── Spacing (8pt) ──────────────────────────────────────────────────
export const space = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10:'40px',
  12:'48px',
  16:'64px',
} as const;

// ── Shadows ────────────────────────────────────────────────────────
export const shadow = {
  xs: '0 1px 2px rgba(61, 41, 33, 0.04)',
  sm: '0 2px 8px rgba(61, 41, 33, 0.05)',
  md: '0 6px 24px rgba(61, 41, 33, 0.06)',
  lg: '0 20px 60px rgba(61, 41, 33, 0.10)',
} as const;

// ── Motion ─────────────────────────────────────────────────────────
export const motion = {
  ease:     'cubic-bezier(0.16, 1, 0.3, 1)',
  easeStd:  'cubic-bezier(0.4, 0, 0.2, 1)',
  durFast:  '180ms',
  durMed:   '300ms',
  durSlow:  '600ms',
} as const;

// ── Pre-built CSS objects (kept for backwards compatibility) ───────
// New code should prefer Tailwind classes over these; they exist so
// existing screens that import { glassCard } etc. keep rendering.

import type { CSSProperties } from 'react';

export const glassCard: CSSProperties = {
  background: surface.white,
  borderRadius: radius.lg,
  border: `1px solid ${border.hair}`,
  boxShadow: shadow.sm,
};

export const innerGlass: CSSProperties = {
  background: surface.cream100,
  borderRadius: radius.md,
  border: `1px solid ${border.hair}`,
};

export const glassButton: CSSProperties = {
  background: surface.white,
  borderRadius: radius.pill,
  border: `1px solid ${border.hair}`,
  color: text.primary,
  fontFamily: fonts.body,
};

export const primaryButton: CSSProperties = {
  background: ink.base,
  color: text.onDark,
  borderRadius: radius.pill,
  border: 'none',
  fontFamily: fonts.body,
  fontWeight: 500,
};

// ── Helper ─────────────────────────────────────────────────────────
export type PillarKey = 'telo' | 'strava' | 'mysel' | 'cyklus';

export const pillarColor = (key: PillarKey, shade: 100 | 300 | 500 | 700 = 500) => {
  const map = pillar[key as Exclude<PillarKey, 'cyklus'>] ?? pillar.cyklus;
  return map[shade];
};

// ── Default export — the whole theme as one object ─────────────────
const theme = {
  section,
  pillar,
  surface,
  ink,
  text,
  border,
  accent,
  gold,
  success,
  danger,
  cyclePhase,
  fonts,
  fontSize,
  lineHeight,
  letterSpacing,
  radius,
  space,
  shadow,
  motion,
};

export default theme;
