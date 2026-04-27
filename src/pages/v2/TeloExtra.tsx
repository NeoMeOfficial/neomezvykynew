import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';

/**
 * Telo · Cvičenia — R9 sectioned list
 *
 * Body-part filter chips + duration sub-chips, then 3 sections grouped
 * by length (Krátke / Stredné / Dlhé). Each row: thumbnail w/ play
 * glyph + title + meta + Plus chip if locked.
 *
 * FEATURE-NEEDED-TELO-EXERCISES-CATALOG: Supabase-backed exercise
 * catalog. Currently 8 hardcoded entries; admin-curated list lets
 * Gabi add/remove without redeploying.
 *
 * Old version: TeloExtra.old.tsx.
 */

const FILTERS = ['Všetko', 'Celé telo', 'Brucho', 'Panvové dno', 'Chrbát', 'Nohy', 'Ruky'] as const;
const DURATIONS = ['Krátke', 'Stredné', 'Dlhé'] as const;

interface ExItem {
  id: string;
  title: string;
  meta: string;
  img: string;
  locked: boolean;
}

interface ExSection {
  eye: string;
  items: ExItem[];
}

const SECTIONS: ExSection[] = [
  {
    eye: 'Krátke · do 10 min',
    items: [
      { id: 'ranne-prebudenie', title: 'Ranné prebudenie', meta: '8 min · celé telo', img: 'lifestyle-yoga-pose.jpg', locked: false },
      { id: 'panvove-dno-zaklad', title: 'Panvové dno · základ', meta: '6 min · jemné', img: 'program-postpartum.jpg', locked: true },
      { id: 'aktivacia-stredu', title: 'Aktivácia stredu', meta: '10 min · stredné', img: 'lifestyle-core-workout.jpg', locked: true },
    ],
  },
  {
    eye: 'Stredné · 10–20 min',
    items: [
      { id: 'jemny-core', title: 'Jemný core', meta: '15 min · jemné', img: 'lifestyle-core-workout.jpg', locked: false },
      { id: 'funkcny-trening', title: 'Funkčný tréning', meta: '18 min · stredné', img: 'program-body-forming.jpg', locked: true },
    ],
  },
  {
    eye: 'Dlhé · 20+ min',
    items: [
      { id: 'celotelova-tonizacia', title: 'Celotelová tonizácia', meta: '28 min · stredné', img: 'program-body-forming.jpg', locked: true },
      { id: 'joga-pre-silu', title: 'Joga pre silu', meta: '25 min · jemné', img: 'program-hormonal.jpg', locked: true },
    ],
  },
];

export default function TeloExtra() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const [activeFilter, setActiveFilter] = useState<string>('Všetko');
  const [activeDuration, setActiveDuration] = useState<string | null>(null);

  return (
    <Page>
      <BackHeader title="Telo · Cvičenia" showSearch={false} />

      <div style={{ padding: '0 18px' }}>
        <Ser size={30}>
          Jednotlivé <em style={{ color: NM.TERRA, fontWeight: 500, fontStyle: 'italic' }}>tréningy</em>.
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>
          Vyber si podľa času a partie tela. 3 cvičenia dostupné zadarmo — ostatné s Plus.
        </Body>
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

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '12px 18px 2px' }}>
        {DURATIONS.map((d) => {
          const active = activeDuration === d;
          return (
            <button
              key={d}
              onClick={() => setActiveDuration(active ? null : d)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                flexShrink: 0,
                padding: '6px 10px',
                borderRadius: 999,
                background: active ? NM.DEEP : NM.CREAM_2 ?? '#F1ECE3',
                color: active ? '#fff' : NM.MUTED,
                fontFamily: NM.SANS,
                fontSize: 10.5,
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {d}
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
                  if (it.locked && !isPremium) {
                    navigate('/paywall');
                  } else {
                    navigate(`/exercise/extra/${it.id}`);
                  }
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
