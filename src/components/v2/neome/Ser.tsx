import { CSSProperties, ReactNode } from 'react';
import { NM } from './tokens';

interface Props {
  children: ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: CSSProperties;
  className?: string;
}

/**
 * Serif heading — Gilda Display. Reserved for structural titles,
 * hero headlines, editorial pull quotes. NEVER for body copy.
 */
export function Ser({ children, size = 28, color = NM.DEEP, weight = 500, style, className }: Props) {
  return (
    <div
      className={className}
      style={{
        fontFamily: NM.SERIF,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
