/**
 * SectionEyebrow — colored bullet + uppercase tracked label above each section.
 *
 *   • TELO · RÝCHLY ŠTART NA DNES
 *
 * Used on DomovNew to label each pillar section (Telo / Výživa / Myseľ /
 * Periodka / Návyky / Denník / Vybrala Gabi). The bullet color matches the
 * section accent so the page reads as a sequence of color-coded chapters.
 */

const SANS = "'DM Sans', sans-serif";
const INK = '#3D2921';

interface Props {
  color: string;
  children: React.ReactNode;
}

export default function SectionEyebrow({ color, children }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 22px',
        margin: '28px 0 12px',
        fontFamily: SANS,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 10.5,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 500,
          color: INK,
          lineHeight: 1,
        }}
      >
        {children}
      </span>
    </div>
  );
}
