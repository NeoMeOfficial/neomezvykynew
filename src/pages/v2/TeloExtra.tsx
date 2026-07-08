import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useExercises, DbExercise } from '../../hooks/useExercises';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';
import PlusUnlockBanner from '../../components/v2/paywall/PlusUnlockBanner';

/**
 * Telo · Cvičenia — R9 sectioned list, now Supabase-backed.
 *
 * Reads from useExercises (public.exercises table). Filters by body
 * target chips + duration band sub-chips, then groups results into
 * three sections by duration (Krátke ≤10, Stredné 11-20, Dlhé 20+).
 *
 * Closes FEATURE-NEEDED-TELO-EXERCISES-CATALOG. Add new rows by
 * inserting directly into public.exercises (or via the admin UI
 * when one ships).
 */

const FILTERS = ['Všetko', 'Celé telo', 'Brucho', 'Panvové dno', 'Chrbát', 'Nohy', 'Ruky'] as const;
const DURATIONS = ['Krátke', 'Stredné', 'Dlhé'] as const;

interface ExSection {
  eye: string;
  items: DbExercise[];
}

const SECTION_DEFS: { eye: string; key: typeof DURATIONS[number]; min: number; max: number }[] = [
  { eye: 'Krátke · do 10 min', key: 'Krátke',  min: 0,  max: 10 },
  { eye: 'Stredné · 10–20 min', key: 'Stredné', min: 11, max: 20 },
  { eye: 'Dlhé · 20+ min',     key: 'Dlhé',    min: 21, max: 999 },
];

export default function TeloExtra() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { exercises, loading } = useExercises();
  const [activeFilter, setActiveFilter] = useState<string>('Všetko');
  const [activeDuration, setActiveDuration] = useState<string | null>(null);

  // Skip the legacy 'strength-N' demo rows on this curated catalog
  // surface — they're kept in the table for ExercisePlayer fallback but
  // aren't part of the editorial library.
  const curated = useMemo(
    () => exercises.filter((e) => !e.id.startsWith('strength-')),
    [exercises],
  );

  const sections: ExSection[] = useMemo(() => {
    return SECTION_DEFS
      .filter((s) => activeDuration === null || activeDuration === s.key)
      .map((s) => ({
        eye: s.eye,
        items: curated.filter((e) => {
          const inBand = e.duration_min >= s.min && e.duration_min <= s.max;
          if (!inBand) return false;
          if (activeFilter === 'Všetko') return true;
          return e.body_target === activeFilter;
        }),
      }))
      .filter((s) => s.items.length > 0);
  }, [curated, activeFilter, activeDuration]);

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

      {loading && (
        <div style={{ margin: '26px 18px', color: NM.MUTED, fontFamily: NM.SANS, fontSize: 13 }}>
          Načítavam…
        </div>
      )}

      {!loading && sections.length === 0 && (
        <div style={{ margin: '26px 18px', color: NM.MUTED, fontFamily: NM.SANS, fontSize: 13 }}>
          Žiadne cvičenia pre tieto filtre.
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
                    if (locked && !isPremium) {
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

      <PlusUnlockBanner label="Cvičenia označené + odomkneš s NeoMe Plus" />
    </Page>
  );
}
