import { Eye, NM } from './neome';
import FavoriteButton from './favorites/FavoriteButton';

const MAUVE_100 = '#EFE4E6';

interface Props {
  id?: string;
  eye: string;
  title: string;
  duration?: string;
  category?: string;
  done?: boolean;
  last?: boolean;
  onClick?: () => void;
}

/**
 * Row card for one meditation — shared by Myseľ and Obľúbené so a favourited
 * meditácia looks exactly like it does in its section.
 */
export function MeditationListRow({ id, eye, title, duration, category, done, last, onClick }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        background: '#FFFFFF',
        borderRadius: 18,
        border: `1px solid ${NM.HAIR}`,
        marginBottom: last ? 0 : 10,
        width: '100%',
        cursor: 'pointer',
        textAlign: 'left',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 999,
          background: MAUVE_100,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={NM.MAUVE}>
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Eye size={9.5}>{eye}</Eye>
        <div
          style={{
            marginTop: 4,
            fontFamily: NM.SERIF,
            fontSize: 16,
            color: NM.DEEP,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
      </div>
      {id && (
        <span onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0, display: 'inline-flex' }}>
          <FavoriteButton itemId={id} type="meditation" title={title} duration={duration} category={category} size="sm" />
        </span>
      )}
      {done && (
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            background: NM.SAGE,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
