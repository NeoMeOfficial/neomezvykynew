import { CSSProperties, ReactNode } from 'react';
import { NM } from './tokens';

interface Props {
  children: ReactNode;
  /** Bottom padding clears the existing v2 BottomNav. */
  paddingBottom?: number;
  style?: CSSProperties;
}

/**
 * Outer wrapper for any redesign screen — sets the cream background,
 * default font, and bottom clearance for the existing v2 BottomNav.
 */
export function Page({ children, paddingBottom = 120, style }: Props) {
  return (
    <div
      style={{
        background: NM.BG,
        minHeight: '100vh',
        paddingBottom,
        fontFamily: NM.SANS,
        color: NM.DEEP,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
