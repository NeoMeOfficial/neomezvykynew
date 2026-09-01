import { PlusTag, NM } from './neome';

interface Props {
  thumbUrl?: string | null;
  title: string;
  titleParts?: { before: string; em: string; num: string } | null;
  meta: string;
  diastasisSafe?: boolean;
  locked: boolean;
  onOpen: () => void;
  divider?: boolean;
}

/**
 * Row card for one exercise/stretch — shared by the Telo listings and
 * Obľúbené so a favourited cvičenie looks exactly like it does in its section.
 */
export function ExerciseListRow({ thumbUrl, title, titleParts, meta, diastasisSafe, locked, onOpen, divider }: Props) {
  return (
    <button
      onClick={onOpen}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        width: '100%',
        gap: 14,
        padding: '12px 14px',
        alignItems: 'center',
        borderBottom: divider ? `1px solid ${NM.HAIR}` : 'none',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          flexShrink: 0,
          backgroundImage: thumbUrl ? `url(${thumbUrl})` : undefined,
          backgroundColor: thumbUrl ? undefined : NM.HAIR,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'rgba(42,26,20,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, borderRadius: 999, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
              <path d="M1 1v7l6-3.5L1 1z" fill={NM.DEEP} />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>
          {titleParts
            ? <>{titleParts.before}{' '}<strong style={{ color: '#B8864A', fontWeight: 700, fontSize: 16 }}>{titleParts.em}</strong><span style={{ fontFamily: NM.SANS, fontSize: 12, fontWeight: 600, color: '#B8864A', marginLeft: 3 }}>{titleParts.num}</span></>
            : title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
          <span style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, fontWeight: 400 }}>
            {meta}
          </span>
          {diastasisSafe && (
            <span style={{ fontFamily: NM.SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: NM.SAGE, background: `${NM.SAGE}1A`, padding: '2px 7px', borderRadius: 999 }}>
              ✓ diastáza
            </span>
          )}
        </div>
      </div>
      {locked ? <PlusTag /> : <div style={{ color: NM.TERTIARY, fontSize: 14 }}>›</div>}
    </button>
  );
}
