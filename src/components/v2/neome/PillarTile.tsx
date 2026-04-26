import { Eye } from './Eye';
import { NM } from './tokens';

interface Props {
  /** Visible pillar name, e.g. "Telo". */
  name: string;
  /** One-line subtitle under the name. */
  sub: string;
  /** Path under public/, e.g. "/images/r9/section-body.jpg". */
  imgSrc: string;
  /** Eyebrow prefix label, e.g. "Oblasť · 01" or "Telo · 03". */
  eyebrow?: string;
  /** Aspect ratio CSS string. Default 1/1.05 for square-ish grid tiles. */
  aspectRatio?: string;
  onClick?: () => void;
}

/**
 * Editorial photo tile with dark gradient overlay + white text block.
 * The atom that powers Knižnica grid, Telo hub, Strava areas, etc.
 */
export function PillarTile({ name, sub, imgSrc, eyebrow, aspectRatio = '1 / 1.05', onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: onClick ? 'pointer' : 'default',
        display: 'block',
        width: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        aspectRatio,
        backgroundImage: `url(${imgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0) 35%, rgba(42,26,20,0.82) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, color: '#fff' }}>
        {eyebrow && <Eye color="rgba(255,255,255,0.72)" size={9}>{eyebrow}</Eye>}
        <div style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 500, marginTop: 4, letterSpacing: '-0.005em' }}>{name}</div>
        <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: 'rgba(255,255,255,0.7)', marginTop: 3, fontWeight: 400 }}>{sub}</div>
      </div>
    </button>
  );
}
