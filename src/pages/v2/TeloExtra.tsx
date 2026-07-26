import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useExercises } from '../../hooks/useExercises';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';
import PlusUnlockBanner from '../../components/v2/paywall/PlusUnlockBanner';
import {
  FocusKey, EquipKey, BandKey,
  FOCUS_ORDER, EQUIP_ORDER, FOCUS_LABEL, EQUIP_LABEL, EQUIP_SHORT, BAND_LABEL,
} from '../../features/telo/exerciseTaxonomy';
import { catalogExercises, CatalogExercise } from '../../features/telo/libraryCatalog';

/**
 * Telo · Cvičenia — taxonomy-driven library (Gabi 2026-07-24).
 *
 * No per-video names, no difficulty level. Structure:
 *   band toggle (15 min tréningy / 5 min dopaľovačky)
 *   → focus chips (Celé telo / Core & brucho / Nohy & zadok)
 *   → equipment filter + diastáza-safe toggle.
 * Titles are generated: "Core & brucho č. 3" — numbered per series
 * (band × focus × equipment) in creation order.
 *
 * Free tier: the first no-equipment 15-min video of each focus (max 3).
 */

export default function TeloExtra() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { exercises, loading } = useExercises();
  const [band, setBand] = useState<BandKey>('15');
  const [focus, setFocus] = useState<FocusKey | 'all'>('all');
  const [equip, setEquip] = useState<EquipKey | null>(null);
  const [diastOnly, setDiastOnly] = useState(false);

  const enriched: CatalogExercise[] = useMemo(() => catalogExercises(exercises), [exercises]);

  const matchesExceptBand = useMemo(
    () => enriched.filter((p) =>
      (focus === 'all' || p.focus === focus)
      && (equip === null || p.equip === equip)
      && (!diastOnly || p.e.diastasis_safe)
    ),
    [enriched, focus, equip, diastOnly],
  );
  const list = useMemo(
    () => matchesExceptBand.filter((p) => p.band === band),
    [matchesExceptBand, band],
  );
  // Same filters have hits in the OTHER duration band → offer the switch
  // instead of a dead "nič tu nie je" (e.g. nohy & zadok exist only as
  // 5-min dopaľovačky today).
  const otherBand: BandKey = band === '15' ? '5' : '15';
  const otherBandCount = matchesExceptBand.length - list.length;

  const openExercise = (p: CatalogExercise) => {
    const locked = !p.isFree && !isPremium;
    if (locked) {
      navigate('/paywall');
      return;
    }
    // Player renders from location.state — pass the generated title and
    // taxonomy labels so it never falls back to the static demo data.
    navigate(`/exercise/extra/${p.e.id}`, {
      state: {
        exercise: {
          id: p.e.id,
          name: p.title,
          duration: `${p.e.duration_min} min`,
          category: p.band === '5' ? 'dopalovacka' : '15min',
          body: p.focus ? FOCUS_LABEL[p.focus] : p.e.body_target,
          equip: EQUIP_LABEL[p.equip],
          videoUrl: p.e.video_id,
          thumb: p.e.thumb_url,
          description: p.e.description,
          diastasisSafe: p.e.diastasis_safe,
        },
      },
    });
  };

  const chip = (active: boolean): React.CSSProperties => ({
    all: 'unset',
    cursor: 'pointer',
    flexShrink: 0,
    padding: '8px 14px',
    borderRadius: 999,
    background: active ? NM.DEEP : '#fff',
    color: active ? '#fff' : NM.DEEP,
    border: active ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`,
    fontFamily: NM.SANS,
    fontSize: 12,
    fontWeight: 400,
    whiteSpace: 'nowrap',
  });

  const smallChip = (active: boolean): React.CSSProperties => ({
    all: 'unset',
    cursor: 'pointer',
    flexShrink: 0,
    padding: '6px 11px',
    borderRadius: 999,
    background: active ? NM.DEEP : 'transparent',
    color: active ? '#fff' : NM.MUTED,
    border: active ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`,
    fontFamily: NM.SANS,
    fontSize: 11,
    fontWeight: 400,
    whiteSpace: 'nowrap',
  });

  return (
    <Page>
      <BackHeader title="Telo · Cvičenia" showSearch={false} />

      <div style={{ padding: '0 18px' }}>
        <Ser size={30}>
          Jednotlivé <em style={{ color: NM.TERRA, fontWeight: 500, fontStyle: 'italic' }}>cvičenia</em>.
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>
          Vyber si dĺžku, zameranie a pomôcku. 3 cvičenia sú zadarmo — ostatné s Plus.
        </Body>
      </div>

      {/* Band toggle — 15 min tréningy / 5 min dopaľovačky */}
      <div style={{ margin: '20px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, background: '#fff', borderRadius: 999, border: `1px solid ${NM.HAIR}`, padding: 4 }}>
        {([['15', '15 min cvičenia'], ['5', '5 min dopaľovačky']] as [BandKey, string][]).map(([key, label]) => {
          const active = band === key;
          return (
            <button
              key={key}
              onClick={() => setBand(key)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                textAlign: 'center',
                padding: '10px 4px',
                borderRadius: 999,
                background: active ? NM.DEEP : 'transparent',
                color: active ? '#fff' : NM.MUTED,
                fontFamily: NM.SANS,
                fontSize: 12,
                fontWeight: active ? 500 : 400,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Focus chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 18px 2px' }}>
        <button onClick={() => setFocus('all')} style={chip(focus === 'all')}>Všetko</button>
        {FOCUS_ORDER.map((f) => (
          <button key={f} onClick={() => setFocus(f)} style={chip(focus === f)}>{FOCUS_LABEL[f]}</button>
        ))}
      </div>

      {/* Equipment + diastáza filters */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '10px 18px 2px', alignItems: 'center' }}>
        {EQUIP_ORDER.map((q) => (
          <button key={q} onClick={() => setEquip(equip === q ? null : q)} style={smallChip(equip === q)}>
            {EQUIP_LABEL[q]}
          </button>
        ))}
        <button onClick={() => setDiastOnly((v) => !v)} style={{ ...smallChip(diastOnly), color: diastOnly ? '#fff' : NM.SAGE, borderColor: diastOnly ? 'transparent' : `${NM.SAGE}66` }}>
          ✓ Diastáza
        </button>
      </div>

      {loading && (
        <div style={{ margin: '26px 18px', color: NM.MUTED, fontFamily: NM.SANS, fontSize: 13 }}>
          Načítavam…
        </div>
      )}

      {!loading && list.length === 0 && (
        <div style={{ margin: '26px 18px', color: NM.MUTED, fontFamily: NM.SANS, fontSize: 13 }}>
          {otherBandCount > 0 ? (
            <>
              <div>V kategórii {BAND_LABEL[band].toLowerCase()} zatiaľ takéto cvičenie nie je.</div>
              <button
                onClick={() => setBand(otherBand)}
                style={{ all: 'unset', cursor: 'pointer', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 999, background: NM.DEEP, color: '#fff', fontFamily: NM.SANS, fontSize: 12, fontWeight: 500 }}
              >
                Pozrieť {BAND_LABEL[otherBand].toLowerCase()} ({otherBandCount})
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
              </button>
            </>
          ) : (
            'Žiadne cvičenia pre tieto filtre.'
          )}
        </div>
      )}

      {!loading && list.length > 0 && (
        <div style={{ margin: '22px 18px 0' }}>
          <Eye size={10} color={NM.TERRA} style={{ marginBottom: 10 }}>
            {band === '15' ? '15 min cvičenia' : '5 min dopaľovačky'} · {list.length}
          </Eye>
          <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {list.map((p, i, arr) => {
              const locked = !p.isFree && !isPremium;
              return (
                <button
                  key={p.e.id}
                  onClick={() => openExercise(p)}
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
                      backgroundImage: p.e.thumb_url ? `url(${p.e.thumb_url})` : undefined,
                      backgroundColor: p.e.thumb_url ? undefined : NM.HAIR,
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
                    <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>
                      {p.titleParts
                        ? <>{p.titleParts.before}{' '}<strong style={{ color: '#6B4C3B', fontWeight: 700, fontSize: 16 }}>{p.titleParts.em}</strong></>
                        : p.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
                      <span style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, fontWeight: 400 }}>
                        {p.e.duration_min} min · {EQUIP_SHORT[p.equip]}
                      </span>
                      {p.e.diastasis_safe && (
                        <span style={{ fontFamily: NM.SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: NM.SAGE, background: `${NM.SAGE}1A`, padding: '2px 7px', borderRadius: 999 }}>
                          ✓ diastáza
                        </span>
                      )}
                    </div>
                  </div>
                  {locked ? <PlusTag /> : <div style={{ color: NM.TERTIARY, fontSize: 14 }}>›</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <PlusUnlockBanner label="Cvičenia označené + odomkneš s NeoMe Plus" />
    </Page>
  );
}
