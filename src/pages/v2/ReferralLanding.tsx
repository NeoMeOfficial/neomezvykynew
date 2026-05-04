import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DEEP   = '#3D2921';
const DEEP2  = '#2A1A14';
const TERRA  = '#C1856A';
const GOLD   = '#B8864A';
const CREAM  = '#F8F5F0';
const MUTED  = 'rgba(61,41,33,0.55)';
const HAIR   = 'rgba(61,41,33,0.08)';

const IMG = (n: string) => `/images/r9/${n}`;

const PILLARS = [
  { title: 'Pohyb',  img: 'section-body.jpg',      dot: TERRA },
  { title: 'Výživa', img: 'section-nutrition.jpg',  dot: '#8B9E88' },
  { title: 'Myseľ',  img: 'section-mind.jpg',       dot: '#A8848B' },
  { title: 'Cyklus', img: 'section-period.jpg',     dot: '#C27A6E' },
];

export default function ReferralLanding() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) localStorage.setItem('referralCode', code);
  }, [code]);

  const inviterName = 'Tvoja kamarátka';

  return (
    <div style={{ background: CREAM, minHeight: '100vh', paddingBottom: 100 }}>

      {/* Hero */}
      <div style={{ height: 300, position: 'relative', backgroundImage: `url(${IMG('hero-yoga.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(42,26,20,0.28) 0%, ${CREAM} 100%)` }} />

        {/* Inviter badge */}
        <div style={{ position: 'absolute', top: 64, left: 20, right: 20, display: 'flex', justifyContent: 'center' }}>
          <div style={{ padding: '6px 16px 6px 6px', background: 'rgba(255,255,255,0.96)', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 6px 20px rgba(61,41,33,0.18)' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 999, flexShrink: 0,
              background: `linear-gradient(135deg, ${TERRA}, ${GOLD})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'Gilda Display, serif', fontSize: 12, color: '#fff', fontStyle: 'italic' }}>G</span>
            </div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: DEEP, fontWeight: 500 }}>
              {inviterName} ťa pozvala
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20 }}>
          <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 42, fontWeight: 500, color: DEEP, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Vitaj<br />
            v{' '}<em style={{ color: TERRA, fontStyle: 'italic', fontWeight: 500 }}>NeoMe</em>.
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>

        {/* Sub-copy */}
        <div style={{ fontFamily: 'DM Sans', fontSize: 14.5, color: DEEP, fontWeight: 400, lineHeight: 1.6, maxWidth: 340, marginTop: 2 }}>
          Aplikácia od Gabi — pohyb, výživa, myseľ a cyklus. Jednoducho a ženskou rukou.
        </div>

        {/* Welcome bonus card */}
        <div style={{ marginTop: 24, padding: '20px 22px', background: `linear-gradient(135deg, ${DEEP2}, ${DEEP})`, borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -40, width: 170, height: 170, borderRadius: 999, background: `radial-gradient(circle, ${GOLD}55, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 9, color: GOLD, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>
              Uvítací dar
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 12 }}>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 54, color: GOLD, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>+100</div>
              <div style={{ paddingBottom: 6 }}>
                <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 18, fontWeight: 500, fontStyle: 'italic', color: '#fff', letterSpacing: '-0.005em' }}>bodov</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: 400 }}>na katalóg odmien</div>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.12)', fontFamily: 'DM Sans', fontSize: 11.5, color: 'rgba(255,255,255,0.7)', fontWeight: 400, lineHeight: 1.55 }}>
              Body sa pripia k tvojmu účtu po registrácii. Môžeš nimi platiť meditačné balíčky alebo ich nechať rásť.
            </div>
          </div>
        </div>

        {/* What's inside — 4 pillars */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: MUTED, fontWeight: 500, marginBottom: 14 }}>
            Čo ťa čaká
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PILLARS.map((p) => (
              <div
                key={p.title}
                style={{
                  height: 92, borderRadius: 14, position: 'relative', overflow: 'hidden',
                  backgroundImage: `url(${IMG(p.img)})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 35%, rgba(42,26,20,0.72))' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, background: p.dot, marginBottom: 5 }} />
                  <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 17, color: '#fff', fontWeight: 500, letterSpacing: '-0.005em' }}>
                    {p.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div style={{ marginTop: 24, padding: '16px 18px', background: '#fff', borderRadius: 16, border: `1px solid ${HAIR}`, display: 'flex', justifyContent: 'space-around' }}>
          {[['2 400+', 'žien'], ['105', 'receptov'], ['17', 'meditácií']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 22, color: DEEP, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: MUTED, marginTop: 4, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 28 }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              width: '100%', padding: '15px 20px',
              background: TERRA, color: '#fff', border: 'none', borderRadius: 999,
              fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
              cursor: 'pointer',
            }}
          >
            Vytvoriť si účet
          </button>
          <div style={{ marginTop: 14, textAlign: 'center', fontFamily: 'DM Sans', fontSize: 12, color: MUTED, fontWeight: 400 }}>
            Už mám účet ·{' '}
            <span
              onClick={() => navigate('/auth')}
              style={{ color: DEEP, fontWeight: 500, cursor: 'pointer' }}
            >
              Prihlásiť sa
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
