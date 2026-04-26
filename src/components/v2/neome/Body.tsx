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
 * Body copy — DM Sans. Default 13px / 300 weight, muted ink color.
 * Italic is NEVER allowed in body copy (reserve for editorial pull quotes).
 */
export function Body({ children, size = 13, color = NM.MUTED, weight = 300, style, className }: Props) {
  return (
    <div
      className={className}
      style={{
        fontFamily: NM.SANS,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1.55,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
