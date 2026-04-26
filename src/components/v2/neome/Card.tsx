import { CSSProperties, ReactNode } from 'react';
import { NM } from './tokens';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number | string;
  onClick?: () => void;
}

/**
 * White card with hairline ink border + ultra-soft shadow.
 * The default surface for any non-photo content block.
 */
export function Card({ children, style, padding = '18px 20px 20px', onClick }: Props) {
  const interactive = !!onClick;
  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      style={{
        background: '#fff',
        border: `1px solid ${NM.HAIR}`,
        borderRadius: 22,
        boxShadow: '0 10px 28px rgba(61,41,33,0.06)',
        padding,
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
