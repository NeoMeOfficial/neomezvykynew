/**
 * NeoMe — Warm Dusk Design System
 * Single source of truth for all design tokens.
 * Fonts align with NeoMe-WEB: Bodoni Moda (display) + DM Sans (body).
 */

/** Font families — mirror NeoMe website */
export const fonts = {
  display: '"Bodoni Moda", Georgia, serif',
  sans: '"DM Sans", system-ui, sans-serif',
} as const;

export const colors = {
  // Section accent colors
  telo: '#6B4C3B',       // dark frost brown
  strava: '#7A9E78',     // sage green
  mysel: '#A8848B',      // dusty mauve
  periodka: '#C27A6E',   // soft terracotta
  accent: '#B8864A',     // copper — primary accent

  // Text hierarchy
  textPrimary: '#2E2218',   // warm black — headings, names
  textSecondary: '#8B7560', // warm mid — sublines, section labels
  textTertiary: '#A0907E',  // muted — descriptions, placeholders

  // Backgrounds
  bgGradient: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)',
  bgFlat: '#FAF7F2',       // fallback flat bg

  // Phase colors (period tracker)
  phaseMenstrual: '#C27A6E',
  phaseFollicular: '#7A9E78',
  phaseOvulation: '#A8848B',
  phaseLuteal: '#B8864A',
} as const;

/** Frosted glass card — matches NeoMe website glass recipe */
export const glassCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.22)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.30)',
  borderRadius: 20,
  boxShadow: '0 4px 24px rgba(46,34,24,0.07), 0 1px 4px rgba(46,34,24,0.04), inset 0 1px 0 rgba(255,255,255,0.45)',
};

/** Inner frosted element (cards within cards) */
export const innerGlass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.35)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(255,255,255,0.4)',
  borderRadius: 16,
  boxShadow: '0 2px 10px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)',
};

/** Glass button style */
export const glassButton: React.CSSProperties = {
  background: 'rgba(255,255,255,0.3)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.4)',
  borderRadius: 16,
  boxShadow: '0 2px 10px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)',
};

/** Generate icon container style for a given section color */
export function iconContainer(sectionColor: string): React.CSSProperties {
  return {
    background: `${sectionColor}14`,
    border: `1px solid ${sectionColor}20`,
    borderRadius: 12,
    boxShadow: `0 4px 12px ${sectionColor}10`,
  };
}

/** CTA / primary button gradient */
export const primaryButton: React.CSSProperties = {
  background: `linear-gradient(135deg, ${colors.accent}, #96703C)`,
  color: '#FFF',
  borderRadius: 16,
  boxShadow: `0 4px 14px rgba(184,134,74,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`,
  border: 'none',
};

/** Section label style — matches subline color */
export const sectionLabel: React.CSSProperties = {
  color: colors.textSecondary,
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
};
