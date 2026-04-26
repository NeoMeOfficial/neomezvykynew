import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Paywall — R7 (three editorial variants)
 *
 * Mounted at /paywall. Variant via ?v=warm|dark|compare (default: dark).
 * The DESIGN_DECISIONS log keeps the A/B between warm and dark open
 * for post-launch testing — both ship; the canonical choice happens
 * after live data.
 *
 * Primary CTA always navigates to /checkout (the existing Stripe
 * surface). Secondary "Pokračovať zdarma" routes to /domov-new.
 */

function CloseButton({ dark = false, onClick }: { dark?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Zavrieť"
      style={{
        all: 'unset',
        cursor: 'pointer',
        width: 36,
        height: 36,
        borderRadius: 999,
        background: dark ? 'rgba(255,255,255,0.08)' : '#fff',
        border: dark ? '1px solid rgba(255,255,255,0.12)' : `1px solid ${NM.HAIR}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? '#fff' : NM.DEEP} strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

// ─── Variant A · Warm editorial ────────────────────────────────
function PaywallWarm({ onContinueFree, onClose, onActivate }: { onContinueFree: () => void; onClose: () => void; onActivate: () => void }) {
  const benefits = [
    { t: '4 programy na výber', d: 'Postpartum · BodyForming · Hormón · Pokoj v hlave' },
    { t: 'Cyklus s odporúčaniami', d: 'Fázy, nálady, potraviny, pohyb na mieru' },
    { t: 'Vlastné návyky a reflexia s históriou', d: 'Denník bez limitu, štatistiky, exporty' },
    { t: 'Prístup k celej knižnici', d: 'Stovky meditácií, cvičení, receptov' },
  ];
  return (
    <div style={{ background: NM.BG, minHeight: '100vh', position: 'relative', paddingBottom: 220, fontFamily: NM.SANS, color: NM.DEEP }}>
      <div style={{ padding: '60px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <CloseButton onClick={onClose} />
      </div>
      <div style={{ margin: '22px 22px 0', aspectRatio: '4/3', borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/r9/lifestyle-yoga-pose.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(42,26,20,0.8) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 22px' }}>
          <Eye color={NM.GOLD} size={10}>NeoMe Plus</Eye>
          <Ser size={32} color="#fff" style={{ marginTop: 8, lineHeight: 1.1, letterSpacing: '-0.015em' }}>
            Celá cesta,
            <br />
            <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>tvoja.</em>
          </Ser>
        </div>
      </div>
      <div style={{ padding: '24px 22px 0' }}>
        {benefits.map((b, i) => (
          <div key={b.t} style={{ padding: '14px 0', borderBottom: i < 3 ? `1px solid ${NM.HAIR}` : 'none', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: `${NM.GOLD}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NM.GOLD} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: NM.SERIF, fontSize: 16, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{b.t}</div>
              <Body size={12} style={{ marginTop: 3, fontWeight: 400 }}>{b.d}</Body>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '18px 22px 28px', background: 'linear-gradient(180deg, rgba(248,245,240,0) 0%, rgba(248,245,240,0.98) 30%, rgba(248,245,240,1) 100%)' }}>
        <div
          style={{
            padding: '14px 18px',
            background: '#fff',
            borderRadius: 18,
            border: `1px solid ${NM.HAIR}`,
            boxShadow: '0 8px 22px rgba(61,41,33,0.06)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Eye color={NM.GOLD} size={10.5}>Zvýhodnený prvý mesiac</Eye>
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: NM.SERIF, fontSize: 28, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.02em' }}>4,99 €</span>
              <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, fontWeight: 400 }}>prvý mesiac</span>
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, marginTop: 2, fontWeight: 400 }}>Potom 9,99 € / mesiac · zrušíš kedykoľvek</div>
          </div>
          <Eye color={NM.TERRA} size={9.5}>-50%</Eye>
        </div>
        <button
          onClick={onActivate}
          style={{
            width: '100%',
            padding: '16px',
            background: NM.DEEP,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
        >
          Začať s Plus
        </button>
        <button
          onClick={onContinueFree}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            textAlign: 'center',
            marginTop: 12,
            fontFamily: NM.SANS,
            fontSize: 12,
            color: NM.TERTIARY,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 400,
          }}
        >
          Pokračovať zdarma
        </button>
      </div>
    </div>
  );
}

// ─── Variant B · Dark elegant ──────────────────────────────────
function PaywallDark({ onContinueFree, onClose, onActivate }: { onContinueFree: () => void; onClose: () => void; onActivate: () => void }) {
  const tiles = [
    { t: '4 programy', s: 'Na výber' },
    { t: 'Cyklus', s: 'S odporúčaniami' },
    { t: 'Reflexia', s: 'S históriou' },
    { t: 'Návyky', s: 'Bez limitu' },
  ];
  return (
    <div style={{ background: NM.DEEP_2, minHeight: '100vh', position: 'relative', paddingBottom: 220, color: '#fff', fontFamily: NM.SANS }}>
      <div style={{ position: 'absolute', top: -80, right: -120, width: 320, height: 320, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}2e, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 280, left: -100, width: 280, height: 280, borderRadius: 999, background: `radial-gradient(circle, ${NM.TERRA}24, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ padding: '60px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <CloseButton dark onClick={onClose} />
        </div>
        <div style={{ padding: '40px 22px 0' }}>
          <Eye color={NM.GOLD} size={10}>NeoMe Plus</Eye>
          <Ser size={46} color="#fff" style={{ marginTop: 16, letterSpacing: '-0.025em', lineHeight: 1 }}>
            Všetko,
            <br />
            čo
            <br />
            <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>potrebuješ.</em>
          </Ser>
          <div style={{ marginTop: 18, fontFamily: NM.SERIF, fontSize: 15, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.5 }}>
            Štyri programy, živý cyklus, plná knižnica — tvoja cesta bez reklám a bez obmedzení.
          </div>
        </div>
        <div style={{ padding: '36px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {tiles.map((b) => (
            <div key={b.t} style={{ padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: '#fff', letterSpacing: '-0.01em' }}>{b.t}</div>
              <div style={{ fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2, fontWeight: 400 }}>{b.s}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '24px 22px 0' }}>
          <div style={{ padding: '18px 20px', borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: `1px solid ${NM.GOLD}44`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 14, right: 14, padding: '4px 10px', background: NM.GOLD, borderRadius: 999, fontFamily: NM.SANS, fontSize: 9, color: '#fff', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>Ponuka</div>
            <Eye color={NM.GOLD} size={10}>Prvý mesiac</Eye>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: NM.SERIF, fontSize: 38, fontWeight: 500, color: '#fff', letterSpacing: '-0.025em' }}>4,99 €</span>
              <span style={{ fontFamily: NM.SANS, fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', fontWeight: 400 }}>9,99 €</span>
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontWeight: 400 }}>Potom 9,99 € mesačne · zrušíš kedykoľvek</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '18px 22px 28px', background: 'linear-gradient(180deg, rgba(42,26,20,0) 0%, rgba(42,26,20,0.9) 40%, rgba(42,26,20,1) 100%)' }}>
        <button
          onClick={onActivate}
          style={{
            width: '100%',
            padding: '16px',
            background: NM.GOLD,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
        >
          Začať s Plus · 4,99 €
        </button>
        <button
          onClick={onContinueFree}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            textAlign: 'center',
            marginTop: 12,
            fontFamily: NM.SANS,
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 400,
          }}
        >
          Pokračovať zdarma
        </button>
      </div>
    </div>
  );
}

// ─── Variant C · Compare table ─────────────────────────────────
function PaywallCompare({ onContinueFree, onClose, onActivate }: { onContinueFree: () => void; onClose: () => void; onActivate: () => void }) {
  const features = [
    { f: 'Knižnica cvičení, receptov, meditácií', free: true, plus: true },
    { f: 'Reflexia a denník (7 dní histórie)', free: true, plus: true },
    { f: 'Predpoveď cyklu (náhľad)', free: true, plus: true },
    { f: '4 programy na výber', free: false, plus: true },
    { f: 'Cyklus s odporúčaniami', free: false, plus: true },
    { f: 'Vlastné návyky (bez limitu)', free: false, plus: true },
    { f: 'Reflexia s celou históriou', free: false, plus: true },
  ];
  return (
    <div style={{ background: NM.BG, minHeight: '100vh', position: 'relative', paddingBottom: 220, fontFamily: NM.SANS, color: NM.DEEP }}>
      <div style={{ padding: '60px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Eye>Vyber si</Eye>
        <CloseButton onClick={onClose} />
      </div>
      <div style={{ padding: '18px 22px 0' }}>
        <Ser size={32}>
          Tvoja cesta,
          <br />
          tvoj <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>režim.</em>
        </Ser>
      </div>
      <div style={{ padding: '24px 22px 0', display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, padding: '20px 16px', background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}` }}>
          <Eye size={10}>Free</Eye>
          <div style={{ fontFamily: NM.SERIF, fontSize: 26, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.02em', marginTop: 8 }}>0 €</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>navždy</div>
          <div style={{ marginTop: 14, padding: '10px 0', borderTop: `1px solid ${NM.HAIR}`, fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED, fontWeight: 400 }}>
            Knižnica · Reflexia s históriou 7 dní · Náhľad cyklu
          </div>
        </div>
        <div style={{ flex: 1, padding: '20px 16px', background: NM.DEEP_2, borderRadius: 20, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}40, transparent 70%)` }} />
          <div style={{ position: 'relative' }}>
            <Eye color={NM.GOLD} size={10}>Plus · odporúčané</Eye>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
              <span style={{ fontFamily: NM.SERIF, fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em' }}>4,99 €</span>
              <span style={{ fontFamily: NM.SANS, fontSize: 10, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', fontWeight: 400 }}>9,99 €</span>
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: 400 }}>prvý mesiac</div>
            <div style={{ marginTop: 14, padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)', fontFamily: NM.SANS, fontSize: 11.5, color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
              Všetko vo Free + 4 programy, plný cyklus, návyky bez limitu.
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 22px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Porovnanie</Eye>
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {features.map((row, i) => (
            <div key={row.f} style={{ padding: '12px 16px', borderBottom: i < features.length - 1 ? `1px solid ${NM.HAIR}` : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 12, color: NM.DEEP, fontWeight: 400 }}>{row.f}</div>
              <div style={{ width: 44, textAlign: 'center' }}>
                {row.free ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.SAGE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline' }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <span style={{ color: NM.TERTIARY, fontSize: 18, fontFamily: NM.SANS, fontWeight: 300 }}>–</span>
                )}
              </div>
              <div style={{ width: 44, textAlign: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.GOLD} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline' }}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '18px 22px 28px', background: 'linear-gradient(180deg, rgba(248,245,240,0) 0%, rgba(248,245,240,0.98) 30%, rgba(248,245,240,1) 100%)' }}>
        <button
          onClick={onActivate}
          style={{
            width: '100%',
            padding: '16px',
            background: NM.DEEP,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
        >
          Začať s Plus · 4,99 €
        </button>
        <button
          onClick={onContinueFree}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            textAlign: 'center',
            marginTop: 12,
            fontFamily: NM.SANS,
            fontSize: 12,
            color: NM.TERTIARY,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 400,
          }}
        >
          Pokračovať zdarma
        </button>
      </div>
    </div>
  );
}

export default function Paywall() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const variant = (params.get('v') ?? 'dark') as 'warm' | 'dark' | 'compare';

  const onActivate = () => navigate('/checkout');
  const onClose = () => navigate(-1);
  const onContinueFree = () => navigate('/domov-new');

  if (variant === 'warm') return <PaywallWarm onActivate={onActivate} onClose={onClose} onContinueFree={onContinueFree} />;
  if (variant === 'compare') return <PaywallCompare onActivate={onActivate} onClose={onClose} onContinueFree={onContinueFree} />;
  return <PaywallDark onActivate={onActivate} onClose={onClose} onContinueFree={onContinueFree} />;
}
