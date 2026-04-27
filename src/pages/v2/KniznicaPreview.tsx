import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';

const R9 = {
  BG: '#F8F5F0',
  DEEP: '#3D2921',
  DEEP_2: '#2A1A14',
  SAGE: '#8B9E88',
  TERRA: '#C1856A',
  DUSTY: '#89B0BC',
  MAUVE: '#A8848B',
  GOLD: '#B8864A',
  EYEBROW: 'rgba(61,41,33,0.55)',
  MUTED: 'rgba(61,41,33,0.72)',
  TERTIARY: 'rgba(61,41,33,0.42)',
  HAIR: 'rgba(61,41,33,0.08)',
};

const ASSETS = '/images/r9';

const PILLARS = [
  { id: 'telo',     name: 'Telo',     sub: 'Pohyb a sila',         accent: R9.TERRA, img: 'section-body.jpg',        path: '/kniznica/telo' },
  { id: 'strava',   name: 'Strava',   sub: 'Jedálniček a recepty', accent: R9.SAGE,  img: 'section-nutrition.jpg',   path: '/kniznica/strava' },
  { id: 'mysel',    name: 'Myseľ',    sub: 'Meditácie a dýchanie', accent: R9.DUSTY, img: 'section-mind.jpg',        path: '/kniznica/mysel' },
  { id: 'cyklus',   name: 'Cyklus',   sub: 'Periodka a fázy',      accent: R9.MAUVE, img: 'section-period.jpg',      path: '/kniznica/periodka' },
  { id: 'dennik',   name: 'Denník',   sub: 'Reflexia a nálady',    accent: R9.DEEP,  img: 'section-diary.jpg',       path: '/kniznica/dennik' },
  { id: 'komunita', name: 'Komunita', sub: 'Ženy v pohybe',        accent: R9.GOLD,  img: 'section-community.jpg',   path: '/komunita' },
  { id: 'blog',     name: 'Blog',     sub: 'Články od Gabi',       accent: R9.TERRA, img: 'blog-cycle-training.jpg', path: '/kniznica/blog' },
];

const Eye = ({ children, color = R9.EYEBROW, size = 11, style }: { children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }) => (
  <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: size, letterSpacing: '0.24em', textTransform: 'uppercase', color, fontWeight: 500, ...style }}>{children}</div>
);

const Ser = ({ children, size = 28, color = R9.DEEP, style }: { children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }) => (
  <div style={{ fontFamily: '"Gilda Display", Georgia, serif', fontSize: size, fontWeight: 500, color, lineHeight: 1.1, letterSpacing: '-0.01em', ...style }}>{children}</div>
);

export default function KniznicaPreview() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  // ?free=1 forces the free-tier preview regardless of real subscription state
  const forceFree = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('free');
  const showPlus = isPremium && !forceFree;

  return (
    <div style={{ background: R9.BG, minHeight: '100vh', paddingBottom: 120, fontFamily: 'DM Sans, system-ui' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Gilda+Display&display=swap"
        rel="stylesheet"
      />

      <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 18px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eye>
            Knižnica
            {showPlus && <span style={{ margin: '0 8px', color: R9.TERTIARY }}>·</span>}
            {showPlus && <span style={{ color: R9.GOLD }}>Plus</span>}
          </Eye>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${R9.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={R9.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M6 12h12M10 18h4" />
            </svg>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Ser size={34}>
            Všetko, čo{' '}
            <em style={{ color: R9.TERRA, fontWeight: 500, fontStyle: 'italic' }}>potrebuješ</em>.
          </Ser>
        </div>
      </div>

      <div style={{ margin: '0 20px', padding: '13px 16px', background: '#fff', borderRadius: 999, border: `1px solid ${R9.HAIR}`, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(61,41,33,0.04)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={R9.MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <div style={{ flex: 1, fontSize: 13, color: R9.TERTIARY, fontWeight: 400 }}>Hľadaj v knižnici…</div>
      </div>

      <div style={{ margin: '34px 20px 14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Eye size={10}>Oblasti</Eye>
        <Eye size={10} color={R9.TERTIARY}>7 celkom</Eye>
      </div>

      <div style={{ margin: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {PILLARS.slice(0, 6).map((p, i) => (
          <button
            key={p.id}
            onClick={() => navigate(p.path)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              borderRadius: 18,
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '1 / 1.05',
              backgroundImage: `url(${ASSETS}/${p.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0) 35%, rgba(42,26,20,0.82) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, color: '#fff' }}>
              <Eye color="rgba(255,255,255,0.72)" size={9}>Oblasť · 0{i + 1}</Eye>
              <div style={{ fontFamily: '"Gilda Display", Georgia, serif', fontSize: 22, fontWeight: 500, marginTop: 4, letterSpacing: '-0.005em' }}>{p.name}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.7)', marginTop: 3, fontWeight: 400 }}>{p.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {(() => {
        const p = PILLARS[6];
        return (
          <div style={{ margin: '10px 20px 0' }}>
            <button
              onClick={() => navigate(p.path)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'block',
                borderRadius: 18,
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '2.1 / 1',
                width: '100%',
                backgroundImage: `url(${ASSETS}/${p.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0) 35%, rgba(42,26,20,0.82) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18, color: '#fff' }}>
                <Eye color="rgba(255,255,255,0.72)" size={9}>Oblasť · 07</Eye>
                <div style={{ fontFamily: '"Gilda Display", Georgia, serif', fontSize: 22, fontWeight: 500, marginTop: 4, letterSpacing: '-0.005em' }}>{p.name}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.7)', marginTop: 3, fontWeight: 400 }}>{p.sub}</div>
              </div>
            </button>
          </div>
        );
      })()}

      {!showPlus && (
        <div style={{ margin: '36px 20px 0' }}>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: `linear-gradient(135deg, ${R9.DEEP_2} 0%, ${R9.DEEP} 100%)`, color: '#fff', padding: '24px 22px' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: 999, background: `radial-gradient(circle, ${R9.GOLD}48, transparent 70%)` }} />
            <div style={{ position: 'relative' }}>
              <Eye color={R9.GOLD} size={10} style={{ marginBottom: 12 }}>NeoMe Plus</Eye>
              <Ser size={22} color="#fff" style={{ lineHeight: 1.15 }}>
                Odomkni celú<br />
                <em style={{ color: R9.GOLD, fontStyle: 'italic', fontWeight: 500 }}>knižnicu.</em>
              </Ser>
              <button
                onClick={() => navigate('/checkout')}
                style={{ marginTop: 18, width: '100%', padding: '13px 20px', background: R9.GOLD, color: '#fff', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', cursor: 'pointer' }}
              >
                Aktivovať Plus
              </button>
              <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Prvý mesiac 4,99 €</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
