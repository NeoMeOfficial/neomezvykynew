import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Appearance } from '@stripe/stripe-js';
import { stripePromise, SUBSCRIPTION_PLANS, type SubscriptionTier } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';
import { NM } from '../../components/v2/neome';
import LoadingScreen from '../../components/v2/LoadingScreen';

/**
 * /checkout/plus?price=<priceId> — in-app checkout in the NeoMe design
 * (Sam 2026-10-05: hosted Stripe Checkout looked foreign; only the card
 * fields remain Stripe's PCI iframe, themed to Warm Dusk via the
 * Appearance API).
 *
 * Flow: create-subscription-intent mints a default_incomplete
 * subscription + client secret → PaymentElement collects the payment →
 * confirmPayment redirects to /checkout/success, which polls until the
 * webhook flips subscriptions.active. Abandoned attempts expire in
 * Stripe on their own.
 */

const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: NM.GOLD,
    colorBackground: '#FFFFFF',
    colorText: NM.DEEP,
    colorTextSecondary: 'rgba(61,41,33,0.55)',
    colorTextPlaceholder: 'rgba(61,41,33,0.35)',
    colorDanger: '#B3463C',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    borderRadius: '12px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1px solid rgba(61,41,33,0.14)',
      boxShadow: 'none',
      padding: '12px 14px',
    },
    '.Input:focus': {
      border: `1px solid ${NM.GOLD}`,
      boxShadow: '0 0 0 3px rgba(184,134,74,0.15)',
    },
    '.Label': {
      color: 'rgba(61,41,33,0.55)',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
    '.Tab': { border: '1px solid rgba(61,41,33,0.14)', boxShadow: 'none' },
    '.Tab--selected': {
      border: `1px solid ${NM.GOLD}`,
      boxShadow: '0 0 0 3px rgba(184,134,74,0.15)',
    },
  },
};

const fonts = [
  { cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap' },
];

function tierForPrice(priceId: string): SubscriptionTier | null {
  const tiers = Object.values(SUBSCRIPTION_PLANS.premium.tiers) as SubscriptionTier[];
  return tiers.find((t) => t.priceId === priceId) ?? null;
}

const eur = (n: number) =>
  `${n.toFixed(2).replace('.', ',').replace(',00', '')} €`;

function PlanCard({ tier }: { tier: SubscriptionTier | null }) {
  const periodLabel = tier
    ? tier.intervalCount === 1 && tier.interval === 'month'
      ? 'mesačne'
      : tier.intervalCount === 3
        ? 'každé 3 mesiace'
        : 'ročne'
    : 'mesačne';
  const price = tier?.price ?? SUBSCRIPTION_PLANS.premium.price;
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        border: `1px solid ${NM.HAIR}`,
        borderRadius: 18,
        padding: '18px 20px',
        marginBottom: 18,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 19, color: NM.DEEP }}>NeoMe Plus</div>
        {tier && (
          <span
            style={{
              fontFamily: NM.SANS, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: NM.GOLD, background: 'rgba(184,134,74,0.12)',
              borderRadius: 999, padding: '3px 9px',
            }}
          >
            {tier.label}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <span style={{ fontFamily: NM.SERIF, fontSize: 26, color: NM.DEEP }}>{eur(price)}</span>
        <span style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}>{periodLabel}</span>
      </div>
      {tier && tier.savingsPct ? (
        <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, marginTop: 2 }}>
          {eur(tier.perMonth)} mesačne · ušetríš {tier.savingsPct} %
        </div>
      ) : null}
      <div style={{ height: 1, background: NM.HAIR, margin: '14px 0' }} />
      <div style={{ display: 'grid', gap: 6 }}>
        {SUBSCRIPTION_PLANS.premium.features.slice(0, 3).map((f) => (
          <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: NM.GOLD, fontSize: 12 }}>✓</span>
            <span style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayForm({ tier }: { tier: SubscriptionTier | null }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const price = tier?.price ?? SUBSCRIPTION_PLANS.premium.price;

  const onPay = async () => {
    if (!stripe || !elements || submitting) return;
    setSubmitting(true);
    setError(null);
    const { error: err } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?type=subscription`,
      },
    });
    // Only reached when confirmation failed (success navigates away).
    setError(err?.message ?? 'Platba zlyhala. Skús to prosím znova.');
    setSubmitting(false);
  };

  return (
    <>
      <div
        style={{
          background: '#FFFFFF',
          border: `1px solid ${NM.HAIR}`,
          borderRadius: 18,
          padding: '18px 16px',
        }}
      >
        <PaymentElement options={{ layout: 'tabs' }} onReady={() => setReady(true)} />
      </div>

      {error && (
        <div
          style={{
            marginTop: 12, borderRadius: 12, padding: '10px 14px',
            background: 'rgba(179,70,60,0.09)', border: '1px solid rgba(179,70,60,0.25)',
            fontFamily: NM.SANS, fontSize: 13, color: '#8E372F',
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={onPay}
        disabled={!ready || submitting}
        style={{
          all: 'unset', boxSizing: 'border-box', cursor: ready && !submitting ? 'pointer' : 'default',
          display: 'block', width: '100%', textAlign: 'center', marginTop: 16,
          background: NM.DEEP, color: '#fff', borderRadius: 999, padding: '15px 0',
          fontFamily: NM.SANS, fontSize: 15, fontWeight: 600, letterSpacing: '0.01em',
          opacity: !ready || submitting ? 0.55 : 1,
        }}
      >
        {submitting ? 'Spracúvam platbu…' : `Zaplatiť ${eur(price)}`}
      </button>

      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginTop: 14, fontFamily: NM.SANS, fontSize: 11.5, color: NM.TERTIARY,
        }}
      >
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
          <rect x="1" y="5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        Platbu bezpečne spracúva Stripe
      </div>
      <p
        style={{
          fontFamily: NM.SANS, fontSize: 11.5, color: NM.TERTIARY, textAlign: 'center',
          lineHeight: 1.5, margin: '10px 0 0',
        }}
      >
        Predplatné sa automaticky obnovuje. Zrušiť ho môžeš kedykoľvek v aplikácii v časti Profil → Predplatné.
      </p>
    </>
  );
}

export default function CheckoutPlus() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const priceId = params.get('price') ?? SUBSCRIPTION_PLANS.premium.priceId;
  const tier = useMemo(() => tierForPrice(priceId), [priceId]);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth', { replace: true });
          return;
        }
        const res = await fetch('/.netlify/functions/create-subscription-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ priceId }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Platbu sa nepodarilo pripraviť.');
        setClientSecret(body.clientSecret);
      } catch (err: any) {
        setLoadError(err.message ?? 'Platbu sa nepodarilo pripraviť.');
      }
    })();
  }, [priceId, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: NM.BG }}>
      <div
        style={{
          maxWidth: 440, margin: '0 auto',
          padding: 'calc(env(safe-area-inset-top, 0px) + 18px) 20px calc(env(safe-area-inset-bottom, 0px) + 32px)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Späť"
          style={{
            all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.7)', border: `1px solid ${NM.HAIR}`,
            color: NM.DEEP, marginBottom: 18,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M9.5 3 5 7.5 9.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          style={{
            fontFamily: NM.SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: NM.EYEBROW, marginBottom: 6,
          }}
        >
          NeoMe Plus
        </div>
        <h1 style={{ fontFamily: NM.SERIF, fontSize: 25, fontWeight: 500, color: NM.DEEP, margin: '0 0 18px' }}>
          Dokončiť objednávku
        </h1>

        <PlanCard tier={tier} />

        {loadError ? (
          <div
            style={{
              borderRadius: 12, padding: '12px 14px',
              background: 'rgba(179,70,60,0.09)', border: '1px solid rgba(179,70,60,0.25)',
              fontFamily: NM.SANS, fontSize: 13, color: '#8E372F',
            }}
          >
            {loadError}
          </div>
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance, fonts, locale: 'sk' }}
          >
            <PayForm tier={tier} />
          </Elements>
        ) : (
          <LoadingScreen label="Pripravujem platbu…" fullScreen={false} />
        )}
      </div>
    </div>
  );
}
