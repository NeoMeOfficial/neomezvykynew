import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { NM, Eye, Ser } from '../../components/v2/neome';

/**
 * /checkout — landing page after Plus signup.
 *
 * Reads the priceId the user picked on /onboarding/plan (stored in
 * localStorage as `intended_price_id`), then kicks off Stripe Checkout.
 *
 * If `intended_price_id` is missing (private browsing cleared
 * localStorage, email-confirm opened in a different browser, etc.),
 * we redirect back to /onboarding/plan so the user picks an explicit
 * tier. Previously we silently fell back to monthly, which could
 * charge a user who intended yearly the wrong amount.
 *
 * Protected by RequireAuth — user must be signed in for Stripe to
 * attach the subscription to a customer.
 */

const INTENDED_PRICE_ID_KEY = 'intended_price_id';

export default function CheckoutLauncher() {
  const navigate = useNavigate();
  const { startCheckout } = useSubscription();
  const [error, setError] = useState<string | null>(null);
  // Guard against React StrictMode double-invocation in dev, which
  // would otherwise call startCheckout twice and open two Stripe tabs.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const priceId = localStorage.getItem(INTENDED_PRICE_ID_KEY);
    if (!priceId) {
      // No tier choice on this device — send the user back to pick.
      // Replace history so the back button doesn't loop them through
      // an empty /checkout.
      navigate('/onboarding/plan', { replace: true });
      return;
    }
    // Clear so a back-button visit doesn't silently re-trigger the
    // wrong checkout.
    localStorage.removeItem(INTENDED_PRICE_ID_KEY);

    startCheckout(priceId).catch((err) => {
      console.error('[checkout] failed', err);
      setError(err?.message || 'Nepodarilo sa otvoriť platbu.');
    });
  }, [startCheckout, navigate]);

  return (
    <div style={{ background: NM.BG, minHeight: '100vh', padding: '48px 22px', fontFamily: NM.SANS, color: NM.DEEP }}>
      <Eye color={NM.GOLD} size={10}>NeoMe Plus</Eye>
      <Ser size={28} style={{ marginTop: 10 }}>
        Otvárame <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>platbu</em>…
      </Ser>
      <div style={{ marginTop: 14, fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, fontWeight: 300 }}>
        Presmerujeme ťa na bezpečnú stránku Stripe. Trvá to len pár sekúnd.
      </div>

      {error && (
        <div style={{ marginTop: 28, padding: '14px 16px', background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}` }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>Niečo sa pokazilo</div>
          <div style={{ marginTop: 4, fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, fontWeight: 300 }}>{error}</div>
          <button
            onClick={() => navigate('/onboarding/plan')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              marginTop: 14,
              padding: '12px 18px',
              background: NM.DEEP,
              color: '#fff',
              borderRadius: 999,
              fontFamily: NM.SANS,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Späť na výber plánu
          </button>
        </div>
      )}
    </div>
  );
}
