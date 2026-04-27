import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';

/**
 * Telo · Strečing — R9 sectioned list (same pattern as Cvičenia)
 *
 * Different filter chips (Ráno / Po tréningu / Pred spaním / etc.).
 *
 * FEATURE-NEEDED-TELO-STRECING-CATALOG: Supabase-backed strečing
 * catalog. Currently 7 hardcoded entries.
 *
 * Old version: TeloStrecing.old.tsx.
 */

const FILTERS = ['Všetko', 'Ráno', 'Po tréningu', 'Pred spaním', 'Sed', 'Krk a plecia'] as const;

interface Item {
  id: string;
  title: string;
  meta: string;
  img: string;
  locked: boolean;
}

interface Section {
  eye: string;
  items: Item[];
}

const SECTIONS: Section[] = [
  {
    eye: 'Krátke · do 10 min',
    items: [
      { id: 'ranny-prebudzac', title: 'Ranný prebúdzač', meta: '5 min · jemné', img: 'lifestyle-yoga-pose.jpg', locked: false },
      { id: 'krk-plecia', title: 'Krk a plecia', meta: '7 min · jemné', img: 'program-mindful.jpg', locked: false },
      { id: 'pred-spanim', title: 'Pred spaním · pokoj', meta: '8 min · jemné', img: 'testimonial-meditation.jpg', locked: true },
    ],
  },
  {
    eye: 'Stredné · 10–20 min',
    items: [
      { id: 'po-treningu', title: 'Po tréningu', meta: '12 min · celé telo', img: 'lifestyle-core-workout.jpg', locked: true },
      { id: 'otvorene-boky', title: 'Otvorené boky', meta: '15 min · jemné', img: 'program-hormonal.jpg', locked: true },
      { id: 'dlhe-sedenie', title: 'Dlhé popoludňajšie sedenie', meta: '10 min · krk + chrbát', img: 'section-diary.jpg', locked: true },
    ],
  },
  {
    eye: 'Dlhé · 20+ min',
    items: [{ id: 'nedelna-obnova', title: 'Nedeľná obnova', meta: '25 min · celé telo', img: 'hero-yoga.jpg', locked: true }],
  },
];

export default function TeloStrecing() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const [activeFilter, setActiveFilter] = useState<string>('Všetko');

  return (
    <Page>
      <BackHeader title="Telo · Strečing" showSearch={false} />

      <div style={{ padding: '0 18px' }}>
        <Ser size={30}>
          Uvoľnenie a <em style={{ color: NM.TERRA, fontWeight: 500, fontStyle: 'italic' }}>mobilita</em>.
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>Krátke zostavy na ráno, po tréningu alebo pred spaním.</Body>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '22px 18px 2px' }}>
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: 999,
                background: active ? NM.DEEP : '#fff',
                color: active ? '#fff' : NM.DEEP,
                border: active ? 'none' : `1px solid ${NM.HAIR_2}`,
                fontFamily: NM.SANS,
                fontSize: 12,
                fontWeight: 400,
                whiteSpace: 'nowrap',
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {SECTIONS.map((sec) => (
        <div key={sec.eye} style={{ margin: '26px 18px 0' }}>
          <Eye size={10} color={NM.TERRA} style={{ marginBottom: 10 }}>{sec.eye}</Eye>
          <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {sec.items.map((it, i, arr) => (
              <button
                key={it.id}
                onClick={() => {
                  if (it.locked && !isPremium) navigate('/paywall');
                  else navigate(`/stretch/${it.id}`);
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  width: '100%',
                  gap: 14,
                  padding: '12px 14px',
                  alignItems: 'center',
                  borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    flexShrink: 0,
                    backgroundImage: `url(/images/r9/${it.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'rgba(42,26,20,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 999, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                        <path d="M1 1v7l6-3.5L1 1z" fill={NM.DEEP} />
                      </svg>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{it.title}</div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, marginTop: 3, fontWeight: 400 }}>{it.meta}</div>
                </div>
                {it.locked && !isPremium ? <PlusTag /> : <div style={{ color: NM.TERTIARY, fontSize: 14 }}>›</div>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </Page>
  );
}
