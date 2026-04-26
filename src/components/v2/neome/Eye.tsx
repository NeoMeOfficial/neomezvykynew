import { CSSProperties, ReactNode } from 'react';
import { NM } from './tokens';

interface Props {
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

/**
 * Eyebrow label — uppercase, wide-tracked DM Sans.
 * Used everywhere a section/pillar name needs to read as quiet metadata.
 */
export function Eye({ children, color = NM.EYEBROW, size = 11, style, className }: Props) {
  return (
    <div
      className={className}
      style={{
        fontFamily: NM.SANS,
        fontSize: size,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color,
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
