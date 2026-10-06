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

// The website links with a friendly plan name (?plan=12tyzdnov) rather
// than a raw Stripe price id (Sam 2026-10-06). Accept both; plan wins.
function priceIdFromParams(params: URLSearchParams): string {
  const plan = (params.get('plan') ?? '').toLowerCase();
  const T = SUBSCRIPTION_PLANS.premium.tiers;
  const map: Record<string, string> = {
    monthly: T.monthly.priceId, mesacne: T.monthly.priceId, month: T.monthly.priceId,
    quarterly: T.quarterly.priceId, '12tyzdnov': T.quarterly.priceId, '12weeks': T.quarterly.priceId, '3mesiace': T.quarterly.priceId,
    yearly: T.yearly.priceId, rocne: T.yearly.priceId, year: T.yearly.priceId,
  };
  if (plan && map[plan]) return map[plan];
  return params.get('price') ?? SUBSCRIPTION_PLANS.premium.tiers.quarterly.priceId;
}

const eur = (n: number) => `${n.toFixed(2).replace('.', ',').replace(',00', '')} €`;

// Per-tier wording for the order row + renewal assurance + FAQ.
function tierWords(tier: SubscriptionTier | null) {
  switch (tier?.key) {
    case 'quarterly':
      return { order: '12 týždňov s NeoMe', period: '12 týždňoch', renews: 'Po 12 týždňoch predplatné pokračuje ďalej za rovnakú cenu.' };
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
  // Two facts, one card (the guarantee lives in Gabi's promise now).
  return (
    <div style={{ ...card, marginTop: 14, padding: '16px 14px', background: 'rgba(184,134,74,0.06)', border: '1px solid rgba(184,134,74,0.22)', display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 24, color: NM.DEEP, letterSpacing: '-0.01em' }}>4 000+</div>
        <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, marginTop: 3 }}>slovenských žien</div>
      </div>
      <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(184,134,74,0.25)' }} />
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
          <span style={{ color: NM.GOLD, fontSize: 13, letterSpacing: 2 }}>★★★★★</span>
          <span style={{ fontFamily: NM.SERIF, fontSize: 24, color: NM.DEEP }}>4,9</span>
        </div>
        <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, marginTop: 3 }}>230+ recenzií · Google</div>
      </div>
    </div>
  );
}


function GabiPromise() {
  // Deliberately the one dark-brown section on the page (Sam
  // 2026-10-06): the promise is personal, so it wears Gabi's colour —
  // and it carries EVERY payment assurance (guarantee, renewal, no
  // hidden fees) in one place. Gold radial glow mirrors the paywall
  // pricing card.
  return (
    <div style={{ ...card, marginTop: 22, background: NM.DEEP, border: `1px solid ${NM.GOLD}44`, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', top: -70, right: -70, width: 240, height: 240, borderRadius: 999, background: 'radial-gradient(circle, rgba(184,134,74,0.32), transparent 62%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: -90, left: -80, width: 220, height: 220, borderRadius: 999, background: 'radial-gradient(circle, rgba(184,134,74,0.16), transparent 62%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <img
          src="/images/founder-gabi.png"
          alt="Gabi, zakladateľka NeoMe"
          width={72}
          height={72}
          style={{ borderRadius: 999, objectFit: 'cover', flexShrink: 0 }}
        />
        <div>
          <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: '#fff', lineHeight: 1.25 }}>
            Môj prísľub, pre všetky klientky
          </div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.GOLD, marginTop: 3 }}>
            Gabi · zakladateľka NeoMe
          </div>
        </div>
      </div>
      <p style={{ fontFamily: NM.SANS, fontSize: 13.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: '14px 0 12px' }}>
        Spokojnosť mojich klientiek je pre mňa to najdôležitejšie. Pokiaľ nebudeš z akéhokoľvek dôvodu
        počas prvých 7 dní spokojná, stačí mi napísať a bez otázok ti vrátim peniaze.
      </p>
      <div style={{ display: 'grid', gap: 9 }}>
        {[
          'Predplatné pokračuje automaticky, kým ho nezrušíš — zrušiť ho môžeš kedykoľvek, jedným klikom v aplikácii',
          'Žiadne skryté poplatky — cena, ktorú vidíš, je cena, ktorú platíš',
          'Klientska podpora na gabi@neome.com.au',
        ].map((x) => (
          <div key={x} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ color: NM.GOLD, fontSize: 12, lineHeight: '18px' }}>✓</span>
            <span style={{ fontFamily: NM.SANS, fontSize: 12.5, color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}>{x}</span>
          </div>
        ))}
      </div>
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
      <div style={{ fontFamily: NM.SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: NM.SAGE }}>
        Odporúčané odborníčkami
      </div>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {items.map((e) => (
          <div key={e.name} style={{ ...card, borderLeft: `3px solid ${NM.SAGE}` }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: NM.SAGE }}>{e.disc}</div>
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
          <figure key={t.name} style={{ ...card, margin: 0, background: 'rgba(184,134,74,0.07)', border: '1px solid rgba(184,134,74,0.22)' }}>
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
        Zaplatením súhlasíš s Podmienkami používania a Zásadami ochrany osobných údajov.
      </p>
    </section>
  );
}

export default function CheckoutPlus() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const priceId = priceIdFromParams(params);
  const tier = useMemo(() => tierForPrice(priceId), [priceId]);
  const words = tierWords(tier);
  const fallbackPrice = tier?.price ?? SUBSCRIPTION_PLANS.premium.price;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amountCents, setAmountCents] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Pay-first flow (Sam 2026-10-06): no account needed to reach this
  // page. Guests give an email; the account is created silently at
  // payment time and claimed with a password on the success screen.
  const [guest, setGuest] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [preparing, setPreparing] = useState(false);
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setGuest(true);
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

  const startGuestCheckout = async () => {
    if (preparing) return;
    setPreparing(true);
    setLoadError(null);
    try {
      const res = await fetch('/.netlify/functions/create-subscription-intent-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          email: guestEmail.trim(),
          ref: (() => { try { return localStorage.getItem('neome_affiliate_ref') || undefined; } catch { return undefined; } })(),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Platbu sa nepodarilo pripraviť.');
      setClientSecret(body.clientSecret);
      if (typeof body.amount_cents === 'number') setAmountCents(body.amount_cents);
    } catch (err: any) {
      setLoadError(err.message ?? 'Platbu sa nepodarilo pripraviť.');
    } finally {
      setPreparing(false);
    }
  };

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

        {guest && !clientSecret && (
          <section style={{ ...card, marginTop: 14 }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, marginBottom: 6 }}>
              Tvoj e-mail
            </div>
            <p style={{ fontFamily: NM.SANS, fontSize: 12.5, color: NM.MUTED, lineHeight: 1.5, margin: '0 0 12px' }}>
              Naň ti pošleme potvrdenie platby. Účet a heslo si nastavíš hneď po zaplatení.
            </p>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') startGuestCheckout(); }}
              placeholder="tvoj@email.sk"
              autoComplete="email"
              inputMode="email"
              style={{
                display: 'block', width: '100%', boxSizing: 'border-box',
                padding: '13px 14px', borderRadius: 12, border: '1px solid rgba(61,41,33,0.14)',
                fontFamily: NM.SANS, fontSize: 15, color: NM.DEEP, outline: 'none', background: '#fff',
              }}
            />
            <button
              onClick={startGuestCheckout}
              disabled={preparing || !guestEmail.includes('@')}
              style={{
                all: 'unset', boxSizing: 'border-box', display: 'block', width: '100%',
                textAlign: 'center', marginTop: 12, background: NM.DEEP, color: '#fff',
                borderRadius: 999, padding: '14px 0', fontFamily: NM.SANS, fontSize: 14,
                fontWeight: 600, cursor: preparing || !guestEmail.includes('@') ? 'default' : 'pointer',
                opacity: preparing || !guestEmail.includes('@') ? 0.55 : 1,
              }}
            >
              {preparing ? 'Moment…' : 'Pokračovať k platbe'}
            </button>
            <p style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, textAlign: 'center', margin: '10px 0 0' }}>
              Už máš účet?{' '}
              <button onClick={() => navigate('/auth')} style={{ all: 'unset', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2, color: NM.MUTED }}>
                Prihlás sa
              </button>
            </p>
          </section>
        )}

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
        ) : guest ? null : (
          <div style={{ marginTop: 14 }}>
            <LoadingScreen label="Pripravujem platbu…" fullScreen={false} />
          </div>
        )}

        <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.TERTIARY, textAlign: 'center', marginTop: 16 }}>
          Platba cez Stripe · Visa, Mastercard, Apple Pay
        </div>

        <GabiPromise />

        <ProofBar />
        <Experts />
        <Testimonials />
        <Faq period={words.period} />
      </div>
    </div>
  );
}
