import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useStretches, DbStretch } from '../../hooks/useStretches';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';

/**
 * Telo · Strečing — R9 sectioned list, Supabase-backed.
 *
 * Reads from useStretches (public.stretches table). Filter chip
 * matches against id / name substrings for the theme filters
 * (Ráno / Po tréningu / Pred spaním / Sed / Krk a plecia) since
 * the table doesn't carry an explicit theme/time-of-day tag yet.
 * Items group into three duration bands.
 *
 * Closes FEATURE-NEEDED-TELO-STRECING-CATALOG.
 */

const FILTERS = ['Všetko', 'Ráno', 'Po tréningu', 'Pred spaním', 'Sed', 'Krk a plecia'] as const;

interface Section {
  eye: string;
  items: DbStretch[];
}

const SECTION_DEFS: { eye: string; min: number; max: number }[] = [
  { eye: 'Krátke · do 10 min', min: 0,  max: 10 },
  { eye: 'Stredné · 10–20 min', min: 11, max: 20 },
  { eye: 'Dlhé · 20+ min',     min: 21, max: 999 },
];

// Loose substring/keyword matching against the user's chip choice.
function matchesFilter(s: DbStretch, filter: string): boolean {
  if (filter === 'Všetko') return true;
  const haystack = `${s.id} ${s.name} ${s.body_target}`.toLowerCase();
  const f = filter.toLowerCase();
  if (filter === 'Ráno')         return haystack.includes('rann');
  if (filter === 'Po tréningu')  return haystack.includes('treningu') || haystack.includes('po-treningu');
  if (filter === 'Pred spaním')  return haystack.includes('spani') || haystack.includes('spanim') || haystack.includes('pred-spanim');
  if (filter === 'Sed')          return haystack.includes('sedeni') || haystack.includes('sedenie');
  if (filter === 'Krk a plecia') return haystack.includes('krk');
  return haystack.includes(f);
}

export default function TeloStrecing() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { stretches, loading } = useStretches();
  const [activeFilter, setActiveFilter] = useState<string>('Všetko');

  // Skip the legacy 'stretch-N' demo rows on this curated catalog surface.
  const curated = useMemo(
    () => stretches.filter((s) => !s.id.startsWith('stretch-')),
    [stretches],
  );

  const sections: Section[] = useMemo(() => {
    return SECTION_DEFS
      .map((s) => ({
        eye: s.eye,
        items: curated.filter((x) =>
          x.duration_min >= s.min && x.duration_min <= s.max && matchesFilter(x, activeFilter),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [curated, activeFilter]);

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

      {loading && (
        <div style={{ margin: '26px 18px', color: NM.MUTED, fontFamily: NM.SANS, fontSize: 13 }}>
          Načítavam…
        </div>
      )}

      {!loading && sections.length === 0 && (
        <div style={{ margin: '26px 18px', color: NM.MUTED, fontFamily: NM.SANS, fontSize: 13 }}>
          Žiadne strečingy pre tento filter.
        </div>
      )}

      {sections.map((sec) => (
        <div key={sec.eye} style={{ margin: '26px 18px 0' }}>
          <Eye size={10} color={NM.TERRA} style={{ marginBottom: 10 }}>{sec.eye}</Eye>
          <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {sec.items.map((it, i, arr) => {
              const locked = !it.free;
              const meta = `${it.duration_min} min · ${it.body_target}`;
              return (
                <button
                  key={it.id}
                  onClick={() => {
                    if (locked && !isPremium) navigate('/paywall');
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
                      backgroundImage: it.thumb_url ? `url(${it.thumb_url})` : undefined,
                      backgroundColor: it.thumb_url ? undefined : NM.HAIR,
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
                    <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{it.name}</div>
                    <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, marginTop: 3, fontWeight: 400 }}>{meta}</div>
                  </div>
                  {locked && !isPremium ? <PlusTag /> : <div style={{ color: NM.TERTIARY, fontSize: 14 }}>›</div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </Page>
  );
}
