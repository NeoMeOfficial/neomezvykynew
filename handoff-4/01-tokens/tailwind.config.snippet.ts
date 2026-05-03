/**
 * NeoMe · Tailwind config additions
 *
 * HOW TO USE
 * Open your existing `tailwind.config.ts` and merge the `theme.extend` block
 * below into yours. Don't replace the whole config — the existing one already
 * has shadcn defaults, content paths, and plugins you need.
 *
 * Specifically: take the `colors`, `fontFamily`, `fontSize`, `borderRadius`,
 * `boxShadow`, and `transitionTimingFunction` blocks below and add them under
 * `theme.extend` in your config.
 *
 * The shadcn HSL-variable colors (background, primary, etc.) stay where they
 * are in your existing config — they read from the new index.css automatically.
 */

const neomeTokens = {
  colors: {
    // NeoMe pillar palette — addressable as bg-pillar-telo-500, text-pillar-mysel, etc.
    pillar: {
      telo:   { DEFAULT: '#C1856A', 100: '#EAD5C7', 300: '#D5AC95', 500: '#C1856A', 700: '#9C6148' },
      strava: { DEFAULT: '#8B9E88', 100: '#D8DFD7', 300: '#B2BFB0', 500: '#8B9E88', 700: '#6B7C68' },
      mysel:  { DEFAULT: '#A395AC', 100: '#E0D9E3', 300: '#C3B7CB', 500: '#A395AC', 700: '#7C6D88' },
      cyklus: { DEFAULT: '#B08A9A', 100: '#E8D8DF', 300: '#CFB0BC', 500: '#B08A9A', 700: '#8A6775' },
      myselCool: '#89B0BC',
    },
    // Surfaces — bg-cream, bg-cream-200, etc.
    cream: {
      DEFAULT: '#F8F5F0',
      50:  '#FBF9F5',
      100: '#F8F5F0',
      200: '#F1ECE3',
      300: '#EAE3D6',
    },
    // Ink — text-ink, bg-ink (for dark cards / paywall)
    ink: {
      DEFAULT: '#3D2921',
      500: '#8B6959',
      700: '#5F3E31',
    },
    // Plus tier marker — bg-gold, text-gold, etc.
    gold: {
      DEFAULT: '#B8965A',
      100: '#EEDFC2',
    },
    sandy: '#D4C4B0',
    success: '#6B8C5F',
    danger: '#B5544A',
  },

  fontFamily: {
    serif: ['Gilda Display', 'Didot', 'Bodoni 72', 'Georgia', 'serif'],
    sans:  ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
    // Existing shadcn maps to these names — keep them pointing here.
    display: ['Gilda Display', 'Didot', 'Bodoni 72', 'Georgia', 'serif'],
    body:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
  },

  // NeoMe type scale — text-display, text-hero, etc.
  fontSize: {
    'display': ['42px', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
    'hero':    ['34px', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
    'h1':      ['28px', { lineHeight: '1.15' }],
    'h2':      ['22px', { lineHeight: '1.15' }],
    'h3':      ['18px', { lineHeight: '1.45' }],
    'lg':      ['17px', { lineHeight: '1.55' }],
    'md':      ['15px', { lineHeight: '1.55' }],
    'sm':      ['13px', { lineHeight: '1.45' }],
    'xs':      ['11px', { lineHeight: '1.45', letterSpacing: '0.24em' }],
  },

  // NeoMe radii — rounded-card, rounded-hero, rounded-pill (the last
  // is already in Tailwind, just confirming).
  borderRadius: {
    'card': '20px',
    'hero': '28px',
    'sheet': '24px',
  },

  boxShadow: {
    'nm-xs': '0 1px 2px rgba(61, 41, 33, 0.04)',
    'nm-sm': '0 2px 8px rgba(61, 41, 33, 0.05)',
    'nm-md': '0 6px 24px rgba(61, 41, 33, 0.06)',
    'nm-lg': '0 20px 60px rgba(61, 41, 33, 0.10)',
  },

  transitionTimingFunction: {
    'nm':     'cubic-bezier(0.16, 1, 0.3, 1)',
    'nm-std': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  letterSpacing: {
    'eyebrow': '0.24em',
    'display': '-0.015em',
    'hero':    '-0.01em',
  },
};

export default neomeTokens;
