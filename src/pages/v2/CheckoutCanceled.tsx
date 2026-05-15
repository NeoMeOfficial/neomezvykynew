import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NM, Eye } from '../../components/v2/neome';

/**
 * Post-checkout cancellation — gentle "no harm done" screen.
 *
 * Stripe redirects here when the user closes the Checkout tab. Reads
 * ?type=subscription|meal to pick the right copy and CTAs:
 *   • Subscription cancel  → "Skúsiť znovu" → /profil/predplatne
 *   • Meal-plan cancel     → "Skúsiť znovu" → /jedalnicek-promo
 * Both flows offer a secondary "Späť na Domov" out.
 */

type CheckoutType = 'subscription' | 'meal';

export default function CheckoutCanceled() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const type: CheckoutType = useMemo(() => {
    const t = params.get('type');
    return t === 'meal' ? 'meal' : 'subscription';
  }, [params]);

  const retryHref = type === 'meal' ? '/jedalnicek-promo' : '/profil/predplatne';
  const eyebrow = type === 'meal' ? 'Jedálniček' : 'NeoMe Plus';
  const headline = 'Platba bola zrušená';
  const body =
    type === 'meal'
      ? 'Nič sme ti neúčtovali. Keď budeš pripravená, môžeš sa kedykoľvek vrátiť k jedálničku.'
      : 'Nič sme ti neúčtovali. Keď budeš pripravená, môžeš si NeoMe Plus aktivovať kedykoľvek.';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: NM.BG,
        fontFamily: NM.SANS,
        color: NM.DEEP,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 'calc(env(safe-area-inset-top) + 24px) 22px calc(env(safe-area-inset-bottom) + 28px)',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <CloseMark />
          <Eye color={NM.GOLD} size={10} style={{ marginTop: 28 }}>{eyebrow}</Eye>
          <div
            style={{
              marginTop: 14,
              fontFamily: NM.SERIF,
              fontSize: 34,
              lineHeight: 1.08,
              letterSpacing: '-0.015em',
            }}
          >
            {headline}
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: NM.SANS,
              fontSize: 15,
              color: NM.MUTED,
              fontWeight: 300,
              lineHeight: 1.55,
              maxWidth: 320,
            }}
          >
            {body}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => navigate(retryHref)} style={ctaPrimary}>
            Skúsiť znovu
          </button>
          <button onClick={() => navigate('/domov-new')} style={ctaText}>
            Späť na Domov
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseMark() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 999,
        background: '#FFFFFF',
        border: `1px solid ${NM.HAIR_2}`,
        display: 'grid',
        placeItems: 'center',
        boxShadow: '0 8px 24px rgba(61,41,33,0.08)',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={NM.MUTED} strokeWidth="2" strokeLinecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </div>
  );
}

const ctaPrimary: React.CSSProperties = {
  width: '100%',
  padding: '15px 22px',
  borderRadius: 999,
  background: NM.DEEP,
  color: '#fff',
  border: 0,
  cursor: 'pointer',
  fontFamily: NM.SANS,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: '0.02em',
};

const ctaText: React.CSSProperties = {
  background: 'transparent',
  border: 0,
  padding: '12px 6px',
  cursor: 'pointer',
  fontFamily: NM.SANS,
  fontSize: 13,
  color: NM.MUTED,
  fontWeight: 400,
  textDecoration: 'underline',
  textUnderlineOffset: 3,
};
