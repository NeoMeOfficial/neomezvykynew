import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { BottomNav } from '@/components/v2/bottom-nav';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SlidersHorizontal } from 'lucide-react';

const DEEP     = '#3D2921';
const CREAM2   = '#F1ECE3';
const DEEP2    = '#2A1A14';
const GOLD     = '#B8864A';
const HAIR     = 'rgba(61,41,33,0.08)';
const TERTIARY = 'rgba(61,41,33,0.42)';
const MUTED    = 'rgba(61,41,33,0.72)';

const IMG = (name: string) => `/images/r9/${name}`;

interface Pillar {
  id: string;
  name: string;
  sub: string;
  img: string;
  path: string;
}

const PILLARS: Pillar[] = [
  { id: 'telo',     name: 'Telo',     sub: 'Pohyb a sila',          img: 'section-body.jpg',      path: '/kniznica/telo'      },
  { id: 'strava',   name: 'Strava',   sub: 'Jedálniček a recepty',  img: 'section-nutrition.jpg', path: '/kniznica/strava'    },
  { id: 'mysel',    name: 'Myseľ',    sub: 'Meditácie a dýchanie',  img: 'section-mind.jpg',      path: '/kniznica/mysel'     },
  { id: 'periodka', name: 'Periodka', sub: 'Periodka a fázy',       img: 'section-period.jpg',    path: '/kniznica/periodka'  },
  { id: 'dennik',   name: 'Denník',   sub: 'Reflexia a nálady',     img: 'section-diary.jpg',     path: '/kniznica/dennik'    },
  { id: 'komunita', name: 'Komunita', sub: 'Ženy v pohybe',         img: 'section-community.jpg', path: '/komunita'           },
];

const BLOG: Pillar = {
  id: 'blog', name: 'Blog', sub: 'Články od Gabi',
  img: 'blog-cycle-training.jpg', path: '/kniznica/blog',
};

const GRADIENT = 'linear-gradient(180deg, rgba(42,26,20,0) 35%, rgba(42,26,20,0.82) 100%)';

export default function Kniznica() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();

  return (
    <div style={{ background: '#F8F5F0', minHeight: '100vh', paddingBottom: 120 }}>

      {/* Header */}
      <div style={{ padding: '60px 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(61,41,33,0.55)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            Knižnica
            {isPremium && <>
              <span style={{ color: TERTIARY }}>·</span>
              <span style={{ color: GOLD }}>Plus</span>
            </>}
          </div>
          <button
            style={{ width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => {}}
          >
            <SlidersHorizontal size={15} color={DEEP} strokeWidth={1.8} />
          </button>
        </div>
        <div style={{ marginTop: 8, fontFamily: 'Gilda Display, serif', fontSize: 34, fontWeight: 500, color: DEEP, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          Všetko, čo{' '}
          <em style={{ color: '#C1856A', fontStyle: 'italic', fontWeight: 500 }}>potrebuješ</em>.
        </div>
      </div>

      {/* Search bar */}
      <div style={{ margin: '0 20px 0' }}>
        <button
          onClick={() => navigate('/search')}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
            padding: '13px 16px', background: '#fff', borderRadius: 999,
            border: `1px solid ${HAIR}`, boxShadow: '0 2px 12px rgba(61,41,33,0.04)', cursor: 'text',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
          </svg>
          <span style={{ flex: 1, fontFamily: 'DM Sans, system-ui', fontSize: 13, color: TERTIARY, fontWeight: 400 }}>
            Hľadaj v knižnici…
          </span>
        </button>
      </div>

      {/* Oblasti label */}
      <div style={{ margin: '34px 20px 14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(61,41,33,0.55)', fontWeight: 500 }}>Oblasti</div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: TERTIARY, fontWeight: 500 }}>7 celkom</div>
      </div>

      {/* 2-col photo grid */}
      <div style={{ margin: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {PILLARS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => navigate(p.path)}
            style={{
              borderRadius: 18, overflow: 'hidden', position: 'relative',
              aspectRatio: '1 / 1.05',
              backgroundImage: `url(${IMG(p.img)})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: 'none', cursor: 'pointer', display: 'block',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: GRADIENT }} />
            <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, color: '#fff', textAlign: 'left' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)', fontWeight: 500, marginBottom: 4 }}>
                Oblasť · 0{i + 1}
              </div>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1.1 }}>{p.name}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, color: 'rgba(255,255,255,0.7)', marginTop: 3, fontWeight: 400 }}>{p.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Blog — full-width wide tile */}
      <div style={{ margin: '10px 20px 0' }}>
        <button
          onClick={() => navigate(BLOG.path)}
          style={{
            borderRadius: 18, overflow: 'hidden', position: 'relative',
            aspectRatio: '2.1 / 1', width: '100%',
            backgroundImage: `url(${IMG(BLOG.img)})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            border: 'none', cursor: 'pointer', display: 'block',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: GRADIENT }} />
          <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18, color: '#fff', textAlign: 'left' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)', fontWeight: 500, marginBottom: 4 }}>
              Oblasť · 07
            </div>
            <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.005em' }}>{BLOG.name}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, color: 'rgba(255,255,255,0.7)', marginTop: 3, fontWeight: 400 }}>{BLOG.sub}</div>
          </div>
        </button>
      </div>

      {/* Upgrade banner — free only */}
      {!isPremium && (
        <div style={{ margin: '36px 20px 0' }}>
          <div style={{
            position: 'relative', borderRadius: 24, overflow: 'hidden',
            background: `linear-gradient(135deg, ${DEEP2} 0%, ${DEEP} 100%)`,
            color: '#fff', padding: '24px 22px',
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 180, height: 180,
              borderRadius: 999, background: `radial-gradient(circle, ${GOLD}48, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 12 }}>NeoMe Plus</div>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 22, fontWeight: 500, color: '#fff', lineHeight: 1.15 }}>
                Odomkni celú<br />
                <em style={{ color: GOLD, fontStyle: 'italic', fontWeight: 500 }}>knižnicu.</em>
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: 'rgba(255,255,255,0.72)', marginTop: 12, lineHeight: 1.55 }}>
                Všetky programy, celý jedálniček, pokročilý cyklus a plný archív meditácií.
              </div>
              <button
                onClick={() => navigate('/paywall')}
                style={{
                  marginTop: 18, width: '100%', padding: '13px 20px',
                  background: GOLD, color: '#fff', border: 'none', borderRadius: 999,
                  fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', cursor: 'pointer',
                }}
              >
                Aktivovať Plus
              </button>
              <div style={{ textAlign: 'center', marginTop: 10, fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                7 dní zadarmo
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="kniznica" />
    </div>
  );
}
