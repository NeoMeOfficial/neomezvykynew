import { useNavigate } from 'react-router-dom';

const DEEP  = '#3D2921';
const DEEP2 = '#2A1A14';
const GOLD  = '#B8864A';

const PILLARS = [
  { n: '01', t: 'Telo',     d: 'Cvičenia od postpartum po silu' },
  { n: '02', t: 'Strava',   d: 'Recepty, plány, cyklová výživa' },
  { n: '03', t: 'Myseľ',    d: 'Meditácie, denník, reflexia' },
  { n: '04', t: 'Periodka', d: 'Fázy, nálady, intuitívne odporúčania' },
  { n: '05', t: 'Komunita', d: 'Príspevky, otázky, podpora od žien' },
];

export default function Welcome() {
  const navigate = useNavigate();

  const enterDemo = () => {
    localStorage.setItem('demo_session', 'active');
    localStorage.setItem('demo_user', JSON.stringify({ id: 'demo', email: 'demo@test.com', firstName: 'Hosť', lastName: '' }));
    navigate('/domov-new');
  };

  return (
    <div
      style={{
        minHeight: '100vh', position: 'relative',
        backgroundImage: 'linear-gradient(180deg, rgba(42,26,20,0.18) 0%, rgba(42,26,20,0.62) 52%, #2A1A14 100%), url(/images/r9/welcome-hero.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center 25%',
        color: '#fff', paddingBottom: 0,
      }}
    >

      {/* NeoMe wordmark */}
      <div style={{ padding: '68px 22px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'Gilda Display, serif', fontSize: 18, fontStyle: 'italic', fontWeight: 500, color: '#fff', letterSpacing: '-0.01em' }}>
          NeoMe
        </span>
      </div>

      {/* Hero copy — bottom-anchored */}
      <div style={{ position: 'absolute', bottom: 180, left: 0, right: 0, padding: '0 22px' }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginBottom: 12 }}>
          Vitaj v NeoMe
        </div>

        <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 40, fontWeight: 500, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          Tvoja cesta<br />
          <em style={{ color: GOLD, fontStyle: 'italic', fontWeight: 500 }}>späť k sebe.</em>
        </div>

        {/* Pillar list */}
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PILLARS.map(p => (
            <div key={p.n} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 12, color: GOLD, fontStyle: 'italic', width: 18, fontWeight: 400, flexShrink: 0 }}>
                {p.n}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 15, fontWeight: 500, color: '#fff', letterSpacing: '-0.005em' }}>
                  {p.t}
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,0.52)', marginTop: 1, fontWeight: 300 }}>
                  {p.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed CTA panel */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '18px 22px 36px', background: `linear-gradient(to top, ${DEEP2} 60%, transparent)` }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            width: '100%', padding: '16px',
            background: '#fff', color: DEEP,
            border: 'none', borderRadius: 999,
            fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
        >
          Začať cestu
        </button>
        <div style={{ textAlign: 'center', marginTop: 14, fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(255,255,255,0.62)', fontWeight: 400 }}>
          Už máš účet?{' '}
          <span
            onClick={() => navigate('/auth')}
            style={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
          >
            Prihlás sa
          </span>
          {' '}·{' '}
          <span
            onClick={enterDemo}
            style={{ color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
          >
            Demo
          </span>
        </div>
      </div>
    </div>
  );
}
