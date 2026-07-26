import { useNavigate } from 'react-router-dom';
import { useSmartBack } from '../../hooks/useSmartBack';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUniversalFavorites } from '@/hooks/useUniversalFavorites';

const DEEP     = '#3D2921';
const TERRA    = '#C1856A';
const HAIR     = 'rgba(61,41,33,0.08)';
const EYEBROW  = 'rgba(61,41,33,0.55)';
const MUTED    = 'rgba(61,41,33,0.72)';
const GOLD     = '#B8864A';
const GRADIENT = 'linear-gradient(180deg, rgba(42,26,20,0) 30%, rgba(42,26,20,0.85) 100%)';

const IMG = (name: string) => `/images/r9/${name}`;

interface Card {
  id: string;
  eyebrow: string;
  name: string;
  sub: string;
  count: (plus: boolean) => string;
  img: string;
  path: string;
  requiresPlus: boolean;
}

const CARDS: Card[] = [
  {
    id: 'programy',
    eyebrow: 'Telo · 01',
    name: 'Programy',
    sub: 'Niekoľkotýždenná cesta',
    count: (plus) => plus ? '4 programy' : '4 programy · Plus',
    img: 'program-body-forming.jpg',
    path: '/kniznica/telo/programy',
    requiresPlus: true,
  },
  {
    id: 'cvicenia',
    eyebrow: 'Telo · 02',
    name: 'Cvičenia',
    sub: 'Jednotlivé tréningy',
    count: () => 'Tréningy · 5–30 min',
    img: 'lifestyle-core-workout.jpg',
    path: '/kniznica/telo/extra',
    requiresPlus: false,
  },
  {
    id: 'strecing',
    eyebrow: 'Telo · 03',
    name: 'Strečing',
    sub: 'Uvoľnenie a mobilita',
    count: () => 'Zostavy · 5–20 min',
    img: 'lifestyle-yoga-pose.jpg',
    path: '/kniznica/telo/strecing',
    requiresPlus: false,
  },
];

export default function Telo() {
  const navigate = useNavigate();
  // Entered from a home pillar card → back returns home, not to Kniznica.
  // History-back covers every entry point (home, kniznica, periodka);
  // fallback only fires on cold deep links.
  const smartBack = useSmartBack('/kniznica');
  const { isPremium } = useSubscription();
  const { getFavoriteCounts } = useUniversalFavorites();
  const favWorkouts = getFavoriteCounts().workout;

  return (
    <div style={{ background: '#F8F5F0', minHeight: '100vh', paddingBottom: 120 }}>

      {/* Back header */}
      <div style={{ padding: '56px 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={smartBack}
            style={{
              width: 36, height: 36, borderRadius: 999,
              background: '#fff', border: `1px solid ${HAIR}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6"/>
            </svg>
          </button>
          <div style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: EYEBROW, fontWeight: 500 }}>
            Telo
          </div>
          <button
            onClick={() => navigate('/hladat')}
            style={{
              width: 36, height: 36, borderRadius: 999,
              background: '#fff', border: `1px solid ${HAIR}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Hero text */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 36, fontWeight: 500, color: DEEP, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          Pohyb a{' '}
          <em style={{ color: TERRA, fontStyle: 'italic', fontWeight: 500 }}>sila</em>.
        </div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: MUTED, fontWeight: 300, lineHeight: 1.55, marginTop: 10, maxWidth: 320 }}>
          Programy pre dlhodobú premenu, jednotlivé cvičenia pre dnešný deň a strečing na každú chvíľu.
        </div>
      </div>

      {/* Editorial photo cards */}
      <div style={{ margin: '30px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CARDS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => navigate(c.path)}
            style={{
              borderRadius: 22, overflow: 'hidden', position: 'relative',
              aspectRatio: '16 / 10', width: '100%',
              backgroundImage: `url(${IMG(c.img)})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              boxShadow: '0 12px 32px rgba(61,41,33,0.08)',
              border: 'none', cursor: 'pointer', display: 'block',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: GRADIENT }} />

            {/* Plus chip — Programy only, free tier */}
            {c.requiresPlus && !isPremium && (
              <div style={{ position: 'absolute', top: 14, right: 14 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '3px 8px', background: GOLD, color: '#fff',
                  borderRadius: 999, fontFamily: 'DM Sans', fontSize: 9,
                  fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase',
                }}>Plus</span>
              </div>
            )}

            <div style={{ position: 'absolute', bottom: 18, left: 20, right: 20, color: '#fff', textAlign: 'left' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>
                {c.eyebrow}
              </div>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 28, fontWeight: 500, marginTop: 5, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                {c.name}
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4, fontWeight: 400 }}>
                {c.sub}
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                {c.count(isPremium)}
              </div>
            </div>
          </button>
        ))}

        {/* Favourites shortcut — compact row under the editorial cards */}
        <button
          onClick={() => navigate('/oblubene?tab=workout')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderRadius: 18,
            background: '#fff',
            border: `1px solid ${HAIR}`,
            cursor: 'pointer',
            fontFamily: 'DM Sans',
            fontSize: 13,
            color: DEEP,
            fontWeight: 500,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={favWorkouts > 0 ? TERRA : 'none'} stroke={TERRA} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            Obľúbené cvičenia{favWorkouts ? ` · ${favWorkouts}` : ''}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TERRA} strokeWidth="2" strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
