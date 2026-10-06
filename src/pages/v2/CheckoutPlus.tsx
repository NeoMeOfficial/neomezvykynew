import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Appearance } from '@stripe/stripe-js';
import { stripePromise, SUBSCRIPTION_PLANS, type SubscriptionTier } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';
import { NM } from '../../components/v2/neome';
import LoadingScreen from '../../components/v2/LoadingScreen';

/**
 * /checkout/plus?price=<priceId> — in-app checkout, ported from the
 * deployed website's checkout design (Sam 2026-10-06): order summary,
 * social-proof bar, Stripe Payment Element, Gabi's guarantee, expert
 * endorsements, testimonials and the payment FAQ. The website mocks a
 * payment-method chooser; here the Payment Element renders the real
 * one (card + Apple Pay/Google Pay appear natively once the domain is
 * registered per mode).
 *
 * Flow unchanged: create-subscription-intent mints a
 * default_incomplete subscription + client secret → confirmPayment →
 * /checkout/success polls until the webhook flips the subscription.
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

const eur = (n: number) => `${n.toFixed(2).replace('.', ',').replace(',00', '')} €`;

// Per-tier wording for the order row + renewal assurance + FAQ.
function tierWords(tier: SubscriptionTier | null) {
  switch (tier?.key) {
    case 'quarterly':
      return { order: '3 mesiace s NeoMe', period: '3 mesiacoch', renews: 'Po 3 mesiacoch predplatné pokračuje ďalej za rovnakú cenu.' };
    case 'yearly':
      return { order: 'Rok s NeoMe', period: 'roku', renews: 'Po roku predplatné pokračuje ďalej za rovnakú cenu.' };
    default:
      return { order: 'Mesiac s NeoMe', period: 'mesiaci', renews: 'Predplatné sa každý mesiac obnoví za rovnakú cenu.' };
  }
}

const card: React.CSSProperties = {
  background: '#FFFFFF',
  border: `1px solid ${NM.HAIR}`,
  borderRadius: 18,
  padding: '18px 18px',
  boxSizing: 'border-box',
};

function SectionEye({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: NM.SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: NM.EYEBROW }}>
      {children}
    </div>
  );
}

function ProofBar() {
  const items = [
    { b: '4 000+', s: 'slovenských žien' },
    { b: '★ 4,9', s: '230+ recenzií · Google' },
    { b: '7 dní', s: 'záruka vrátenia peňazí' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '14px 0 0' }}>
      {items.map((i) => (
        <div key={i.b} style={{ ...card, padding: '12px 8px', textAlign: 'center' }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 16, color: NM.DEEP }}>{i.b}</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.MUTED, marginTop: 3, lineHeight: 1.35 }}>{i.s}</div>
        </div>
      ))}
    </div>
  );
}

function Assurances({ renews }: { renews: string }) {
  const rows = [
    { b: 'Obnoví sa automaticky.', t: `${renews} Zrušiť môžeš kedykoľvek, jedným klikom v aplikácii.` },
    { b: '7-dňová záruka vrátenia peňazí.', t: 'Napíš nám do siedmich dní od aktivácie a vrátime ti celú sumu. Bez otázok.' },
    { b: 'Žiadne skryté poplatky.', t: 'Cena, ktorú vidíš, je cena, ktorú platíš.' },
  ];
  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
      {rows.map((r) => (
        <div key={r.b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ color: NM.GOLD, fontSize: 13, lineHeight: '20px', flexShrink: 0 }}>★</span>
          <span style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, lineHeight: 1.55 }}>
            <strong style={{ color: NM.DEEP, fontWeight: 600 }}>{r.b}</strong> {r.t}
          </span>
        </div>
      ))}
    </div>
  );
}

function GabiPromise() {
  return (
    <div style={{ ...card, marginTop: 26 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <img
          src="/images/founder-gabi.png"
          alt=""
          width={64}
          height={64}
          style={{ borderRadius: 999, objectFit: 'cover', flexShrink: 0 }}
        />
        <div>
          <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, lineHeight: 1.25 }}>
            Môj prísľub, pre všetky klientky
          </div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.EYEBROW, marginTop: 3 }}>
            Gabi · zakladateľka NeoMe
          </div>
        </div>
      </div>
      <p style={{ fontFamily: NM.SANS, fontSize: 13.5, color: NM.MUTED, lineHeight: 1.6, margin: '14px 0 12px' }}>
        Spokojnosť mojich klientiek je pre mňa to najdôležitejšie. Pokiaľ nebudeš z akéhokoľvek dôvodu
        počas prvých 7 dní spokojná, stačí mi napísať a bez otázok ti vrátim peniaze.
      </p>
      <div style={{ display: 'grid', gap: 7 }}>
        {['100 % garancia vrátenia peňazí', 'Bez zbytočných otázok', 'Klientska podpora na gabi@neome.com.au'].map((x) => (
          <div key={x} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: NM.SAGE, fontSize: 12 }}>✓</span>
            <span style={{ fontFamily: NM.SANS, fontSize: 12.5, color: NM.MUTED }}>{x}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Experts() {
  const items = [
    {
      disc: 'Fyzioterapeutka · Auramedica',
      name: 'PhDr. Magdaléna C.',
      q: '„Postpartum program je presne to, čo mamy po pôrode potrebujú — bezpečne, postupne, s rešpektom k ich telu.“',
    },
    {
      disc: 'Špecialistka na panvové dno',
      name: 'Mgr. Petra H.',
      q: '„Pohyb, výživa a myseľ — spolu. Presne taký prístup hľadajú moje pacientky.“',
    },
  ];
  return (
    <div style={{ marginTop: 26 }}>
      <SectionEye>Odporúčané odborníčkami</SectionEye>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {items.map((e) => (
          <div key={e.name} style={card}>
            <div style={{ fontFamily: NM.SANS, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: NM.EYEBROW }}>{e.disc}</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 600, color: NM.DEEP, marginTop: 4 }}>{e.name}</div>
            <p style={{ fontFamily: NM.SERIF, fontSize: 14, fontStyle: 'italic', color: NM.MUTED, lineHeight: 1.55, margin: '8px 0 0' }}>{e.q}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Testimonials() {
  const items = [
    {
      mono: 'IŠ',
      name: 'Ivana Štompfová',
      role: 'Topmodelka',
      q: '„Programy NeoMe mi pomohli po pôrode cítiť sa opäť skvele a pripraviť sa na kastingy. Odporúčam ho každej mamine.“',
    },
    {
      mono: 'SŠ',
      name: 'Silvia Škultéty',
      role: 'MiniDiamond Blog',
      q: '„Tých 15 minút bolo pre mňa doslova návykových. Okrem skvelých popôrodných cvičení mi program pomohol dať pravidelne sama sebe prioritu, čo je veľmi dôležité.“',
    },
  ];
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ fontFamily: NM.SERIF, fontSize: 19, color: NM.DEEP }}>
        Čo o nás povedali <em style={{ fontStyle: 'italic', color: NM.GOLD }}>známe tváre</em>
      </div>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {items.map((t) => (
          <figure key={t.name} style={{ ...card, margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 42, height: 42, borderRadius: 999, flexShrink: 0,
                background: 'rgba(184,134,74,0.14)', color: NM.GOLD,
                display: 'grid', placeItems: 'center',
                fontFamily: NM.SANS, fontSize: 13, fontWeight: 700,
              }}>{t.mono}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 600, color: NM.DEEP }}>{t.name}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.EYEBROW }}>{t.role}</div>
              </div>
              <span style={{ color: NM.GOLD, fontSize: 11, letterSpacing: 2, flexShrink: 0 }} aria-label="5 z 5">★★★★★</span>
            </div>
            <blockquote style={{ fontFamily: NM.SERIF, fontSize: 14, fontStyle: 'italic', color: NM.MUTED, lineHeight: 1.55, margin: '10px 0 0' }}>
              {t.q}
            </blockquote>
          </figure>
        ))}
      </div>
    </div>
  );
}

function Faq({ period }: { period: string }) {
  const items = [
    {
      q: 'Ako funguje 7-dňová záruka?',
      a: 'Máš 7 dní od aktivácie na vyskúšanie. Ak ti to nevyhovuje, napíšeš nám email a peniaze ti vrátime — celých 100 %. Bez otázok, bez vyplňania formulárov. Iba úprimná spätná väzba, ak chceš.',
    },
    {
      q: `Čo sa stane po ${period}?`,
      a: 'Nič sa nezatvorí. Predplatné sa automaticky obnoví za rovnakú cenu a ty pokračuješ tam, kde si skončila — programy, recepty, Periodka aj komunita ostávajú. Zrušiť môžeš kedykoľvek jedným klikom v aplikácii, aj deň pred obnovením.',
    },
    {
      q: 'Čo sa stane, keď zruším predplatné?',
      a: 'Prístup ti zostane do konca zaplateného obdobia — nič ti nevypneme skôr. Potom sa programy, recepty a Periodka uzamknú, ale tvoj denník, návyky a komunitné príspevky zostanú nedotknuté. Kedykoľvek sa môžeš vrátiť tam, kde si prestala.',
    },
    {
      q: 'Je v cene naozaj všetko?',
      a: 'Áno. Jedno predplatné, celá aplikácia — všetky programy, 120+ receptov, plná Periodka, meditácie aj komunita. Žiadne vyššie plány, žiadne doplatky, žiadne odomykanie funkcií za príplatok.',
    },
    {
      q: 'Aké platobné metódy akceptujete?',
      a: 'Apple Pay, Google Pay a všetky bežné platobné karty (Visa, Mastercard). Platby spracovávame cez Stripe — bezpečne, šifrovane, podľa európskych štandardov.',
    },
  ];
  return (
    <div style={{ marginTop: 26 }}>
      <SectionEye>Platba · časté otázky</SectionEye>
      <div style={{ fontFamily: NM.SERIF, fontSize: 19, color: NM.DEEP, marginTop: 8 }}>
        Možno sa <em style={{ fontStyle: 'italic', color: NM.GOLD }}>pýtaš…</em>
      </div>
      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        {items.map((f, i) => (
          <details key={f.q} open={i === 0} style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <summary style={{
              listStyle: 'none', cursor: 'pointer', padding: '14px 16px',
              fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 600, color: NM.DEEP,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
            }}>
              {f.q}
              <span style={{ color: NM.GOLD, fontSize: 16, fontWeight: 400, flexShrink: 0 }}>+</span>
            </summary>
            <div style={{ padding: '0 16px 14px', fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, lineHeight: 1.6 }}>
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function PayForm({ tier, amountCents }: { tier: SubscriptionTier | null; amountCents: number | null }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const price = amountCents != null ? amountCents / 100 : (tier?.price ?? SUBSCRIPTION_PLANS.premium.price);

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
    <section style={{ ...card, marginTop: 14 }} aria-label="Spôsob platby">
      <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, marginBottom: 14 }}>
        Spôsob platby
      </div>
      <PaymentElement options={{ layout: 'tabs' }} onReady={() => setReady(true)} />

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
        {submitting ? 'Spracúvam platbu…' : `Zaplatiť · ${eur(price)}`}
      </button>
      <p style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.TERTIARY, textAlign: 'center', lineHeight: 1.5, margin: '12px 0 0' }}>
        Číslo karty zadávaš priamo Stripu — na náš server sa nikdy nedostane.
      </p>
    </section>
  );
}

export default function CheckoutPlus() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const priceId = params.get('price') ?? SUBSCRIPTION_PLANS.premium.priceId;
  const tier = useMemo(() => tierForPrice(priceId), [priceId]);
  const words = tierWords(tier);
  const fallbackPrice = tier?.price ?? SUBSCRIPTION_PLANS.premium.price;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amountCents, setAmountCents] = useState<number | null>(null);
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
        if (typeof body.amount_cents === 'number') setAmountCents(body.amount_cents);
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
          padding: 'calc(env(safe-area-inset-top, 0px) + 14px) 20px calc(env(safe-area-inset-bottom, 0px) + 36px)',
        }}
      >
        {/* Top bar — brand + one way back, like the website's stripped checkout chrome. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 18, color: NM.DEEP }}>
            Neo<span style={{ color: NM.GOLD }}>Me</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}
          >
            ← Späť
          </button>
        </div>

        <SectionEye>Objednávka</SectionEye>
        <h1 style={{ fontFamily: NM.SERIF, fontSize: 30, fontWeight: 500, color: NM.DEEP, lineHeight: 1.1, letterSpacing: '-0.015em', margin: '10px 0 0' }}>
          Ešte jeden krok
          <br />
          <em style={{ fontStyle: 'italic', color: NM.GOLD }}>a začínaš.</em>
        </h1>

        {/* Order summary */}
        <div style={{ ...card, marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <div>
            <div style={{ fontFamily: NM.SANS, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: NM.EYEBROW }}>
              Tvoja objednávka
            </div>
            <div style={{ fontFamily: NM.SERIF, fontSize: 16, color: NM.DEEP, marginTop: 5 }}>{words.order}</div>
          </div>
          <div style={{ fontFamily: NM.SERIF, fontSize: 22, color: NM.DEEP, flexShrink: 0 }}>
            {eur(amountCents != null ? amountCents / 100 : fallbackPrice)}
          </div>
        </div>

        <ProofBar />

        {loadError ? (
          <div
            style={{
              marginTop: 14, borderRadius: 12, padding: '12px 14px',
              background: 'rgba(179,70,60,0.09)', border: '1px solid rgba(179,70,60,0.25)',
              fontFamily: NM.SANS, fontSize: 13, color: '#8E372F',
            }}
          >
            {loadError}
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance, fonts, locale: 'sk' }}>
            <PayForm tier={tier} amountCents={amountCents} />
          </Elements>
        ) : (
          <div style={{ marginTop: 14 }}>
            <LoadingScreen label="Pripravujem platbu…" fullScreen={false} />
          </div>
        )}

        <Assurances renews={words.renews} />

        <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.TERTIARY, textAlign: 'center', marginTop: 16 }}>
          Platba cez Stripe · Visa, Mastercard, Apple Pay
        </div>

        <GabiPromise />
        <Experts />
        <Testimonials />
        <Faq period={words.period} />
      </div>
    </div>
  );
}
