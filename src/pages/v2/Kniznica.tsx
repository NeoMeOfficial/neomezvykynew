import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import {
  Page,
  Eye,
  Ser,
  SearchBar,
  PillarTile,
  PaywallCard,
  NM,
  type Pillar,
} from '../../components/v2/neome';

interface PillarItem {
  id: Pillar;
  name: string;
  sub: string;
  img: string;
  path: string;
}

const PILLARS: PillarItem[] = [
  { id: 'telo',     name: 'Telo',     sub: 'Pohyb a sila',         img: '/images/r9/section-body.jpg',        path: '/kniznica/telo' },
  { id: 'strava',   name: 'Strava',   sub: 'Jedálniček a recepty', img: '/images/r9/section-nutrition.jpg',   path: '/kniznica/strava' },
  { id: 'mysel',    name: 'Myseľ',    sub: 'Meditácie a dýchanie', img: '/images/r9/section-mind.jpg',        path: '/kniznica/mysel' },
  { id: 'cyklus',   name: 'Cyklus',   sub: 'Periodka a fázy',      img: '/images/r9/section-period.jpg',      path: '/kniznica/periodka' },
  { id: 'dennik',   name: 'Denník',   sub: 'Reflexia a nálady',    img: '/images/r9/section-diary.jpg',       path: '/kniznica/dennik' },
  { id: 'komunita', name: 'Komunita', sub: 'Ženy v pohybe',        img: '/images/r9/section-community.jpg',   path: '/komunita' },
  { id: 'blog',     name: 'Blog',     sub: 'Články od Gabi',       img: '/images/r9/blog-cycle-training.jpg', path: '/kniznica/blog' },
];

/**
 * Knižnica — R9 variant C ("equal tiles, all areas same size")
 *
 * 6 square pillar tiles in a 2-col grid + 1 wide Blog tile at the bottom.
 * Free users see a dark editorial paywall card under the grid.
 *
 * Wired to live useSubscription() — Plus eyebrow chip and paywall
 * visibility track real subscription state. Pillar route destinations
 * stay identical to the old design so navigation keeps working as we
 * port other pillars one-by-one.
 */
export default function Kniznica() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  // ?free=1 forces the free-tier preview regardless of real subscription state
  const forceFree = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('free');
  const showPlus = isPremium && !forceFree;

  const grid = PILLARS.slice(0, 6);
  const blog = PILLARS[6];

  return (
    <Page>
      <div style={{ padding: '60px 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eye>
            Knižnica
            {showPlus && <span style={{ margin: '0 8px', color: NM.TERTIARY }}>·</span>}
            {showPlus && <span style={{ color: NM.GOLD }}>Plus</span>}
          </Eye>
          <button
            aria-label="Filtre"
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: 999,
              background: '#fff',
              border: `1px solid ${NM.HAIR}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M6 12h12M10 18h4" />
            </svg>
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          <Ser size={34}>
            Všetko, čo{' '}
            <em style={{ color: NM.TERRA, fontWeight: 500, fontStyle: 'italic' }}>potrebuješ</em>.
          </Ser>
        </div>
      </div>

      <SearchBar onClick={() => navigate('/kniznica?search=1')} />

      <div style={{ margin: '34px 20px 14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Eye size={10}>Oblasti</Eye>
        <Eye size={10} color={NM.TERTIARY}>{PILLARS.length} celkom</Eye>
      </div>

      <div style={{ margin: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {grid.map((p, i) => (
          <PillarTile
            key={p.id}
            name={p.name}
            sub={p.sub}
            imgSrc={p.img}
            eyebrow={`Oblasť · 0${i + 1}`}
            onClick={() => navigate(p.path)}
          />
        ))}
      </div>

      <div style={{ margin: '10px 20px 0' }}>
        <PillarTile
          name={blog.name}
          sub={blog.sub}
          imgSrc={blog.img}
          eyebrow="Oblasť · 07"
          aspectRatio="2.1 / 1"
          onClick={() => navigate(blog.path)}
        />
      </div>

      {!showPlus && <PaywallCard />}
    </Page>
  );
}
