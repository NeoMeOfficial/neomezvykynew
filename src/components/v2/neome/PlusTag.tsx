import { CSSProperties } from 'react';
import { NM } from './tokens';

interface Props {
  style?: CSSProperties;
}

/**
 * Gold "Plus" chip used to mark Plus-only content while keeping Free
 * users aware of what they'd unlock. Pillar-cross-cutting (gold accent).
 */
export function PlusTag({ style }: Props) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        background: NM.GOLD,
        color: '#fff',
        borderRadius: 999,
        fontFamily: NM.SANS,
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      Plus
    </span>
  );
}
