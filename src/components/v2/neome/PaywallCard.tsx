import { useNavigate } from 'react-router-dom';
import { Eye } from './Eye';
import { Ser } from './Ser';
import { NM } from './tokens';

interface Props {
  /** Headline override; defaults to "Odomkni celú knižnicu." */
  headline?: { before: string; emphasis: string };
  /** CTA copy; default "Aktivovať Plus". */
  ctaLabel?: string;
  /** Where the CTA navigates. Default /checkout. */
  ctaTo?: string;
  /** Footer line under the CTA. Default "Prvý mesiac 4,99 €". */
  footnote?: string;
}

/**
 * The "Aktivovať Plus" editorial dark card surfaced to Free-tier
 * users on Knižnica, Domov, Telo, etc. Gold accent + soft radial glow.
 */
export function PaywallCard({
  headline = { before: 'Odomkni celú', emphasis: 'knižnicu.' },
  ctaLabel = 'Aktivovať Plus',
  ctaTo = '/checkout',
  footnote = 'Prvý mesiac 4,99 €',
}: Props) {
  const navigate = useNavigate();
  return (
    <div style={{ margin: '36px 20px 0' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${NM.DEEP_2} 0%, ${NM.DEEP} 100%)`,
          color: '#fff',
          padding: '24px 22px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 180,
            height: 180,
            borderRadius: 999,
            background: `radial-gradient(circle, ${NM.GOLD}48, transparent 70%)`,
          }}
        />
        <div style={{ position: 'relative' }}>
          <Eye color={NM.GOLD} size={10} style={{ marginBottom: 12 }}>NeoMe Plus</Eye>
          <Ser size={22} color="#fff" style={{ lineHeight: 1.15 }}>
            {headline.before}
            <br />
            <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>{headline.emphasis}</em>
          </Ser>
          <button
            onClick={() => navigate(ctaTo)}
            style={{
              marginTop: 18,
              width: '100%',
              padding: '13px 20px',
              background: NM.GOLD,
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              fontFamily: NM.SANS,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.02em',
              cursor: 'pointer',
            }}
          >
            {ctaLabel}
          </button>
          <div
            style={{
              textAlign: 'center',
              marginTop: 10,
              fontFamily: NM.SANS,
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {footnote}
          </div>
        </div>
      </div>
    </div>
  );
}
