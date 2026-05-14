/**
 * UpsellBanner — dashed-border editorial banner used between DomovNew
 * sections to promote Plus tier upgrades or paid add-ons.
 *
 *   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
 *   │  PLUS · PROGRAMY                                          │
 *   │  Pridaj sa k programu                       ╭───────────╮ │
 *   │  8-týždňová cesta s Gabi · krok za krokom.  │ Pozrieť > │ │
 *   │                                             ╰───────────╯ │
 *   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
 */

const SERIF = "'Gilda Display', Georgia, serif";
const SANS = "'DM Sans', sans-serif";
const INK = '#3D2921';
const FG2 = 'rgba(61,41,33,0.55)';

interface Props {
  color: string;
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
  price?: string;
  onClick: () => void;
}

export default function UpsellBanner({ color, eyebrow, title, sub, cta, price, onClick }: Props) {
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <button
        onClick={onClick}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          width: '100%',
          boxSizing: 'border-box',
          padding: '14px 16px',
          borderRadius: 16,
          background: `${color}10`,
          border: `1px dashed ${color}66`,
          fontFamily: SANS,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color,
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 18,
              lineHeight: 1.2,
              color: INK,
              fontWeight: 500,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: FG2,
              fontWeight: 300,
              marginTop: 3,
              lineHeight: 1.4,
            }}
          >
            {sub}
          </div>
        </div>
        <div
          style={{
            background: color,
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {price ? `${cta} · ${price}` : cta}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      </button>
    </div>
  );
}
