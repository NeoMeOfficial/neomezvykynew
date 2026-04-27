import { CSSProperties, ReactNode } from 'react';
import { NM } from './tokens';

interface Props {
  children: ReactNode;
  /**
   * Extra clearance above the BottomNav (in px). Defaults to 96 — adds to
   * `env(safe-area-inset-bottom)` so total bottom space adapts to home-
   * indicator devices.
   */
  paddingBottom?: number;
  style?: CSSProperties;
}

/**
 * Outer wrapper for any redesign screen — sets the cream background,
 * default font, and bottom clearance for the BottomNav. Bottom padding
 * uses safe-area-inset so iPhone home indicator devices get extra space
 * automatically.
 */
export function Page({ children, paddingBottom = 96, style }: Props) {
  return (
    <div
      style={{
        background: NM.BG,
        minHeight: '100vh',
        paddingBottom: `calc(env(safe-area-inset-bottom) + ${paddingBottom}px)`,
        fontFamily: NM.SANS,
        color: NM.DEEP,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
