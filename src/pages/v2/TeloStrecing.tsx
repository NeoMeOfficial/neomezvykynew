import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useStretches } from '../../hooks/useStretches';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';
import PlusUnlockBanner from '../../components/v2/paywall/PlusUnlockBanner';
import { ExerciseListRow } from '../../components/v2/ExerciseListRow';
import {
  StretchFocusKey, EquipKey, BandKey,
  STRETCH_FOCUS_ORDER, STRETCH_EQUIP_ORDER, STRETCH_FOCUS_LABEL, STRETCH_BAND_LABEL,
  EQUIP_LABEL, EQUIP_SHORT,
} from '../../features/telo/exerciseTaxonomy';
import { catalogStretches, CatalogStretch } from '../../features/telo/libraryCatalog';

/**
 * Telo · Strečing — taxonomy-driven library (Gabi 2026-07-25), mirrors
 * the Cvičenia structure:
 *   band toggle (15 min strečingy / 5 min rýchla úľava)
 *   → focus chips (Celé telo / Vršok & stred tela / Dolná časť tela)
 *   → equipment filter (bez pomôcok / s gumou).
 * Titles are generated per series in creation order:
 * "Vršok & stred tela č. 2". No per-video names, no level.
 *
 * Free tier: the first no-equipment 15-min stretch of each focus (max 3).
 */

export default function TeloStrecing() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { stretches, loading } = useStretches();
  const [band, setBand] = useState<BandKey>('15');
  const [focus, setFocus] = useState<StretchFocusKey | 'all'>('all');
  const [equip, setEquip] = useState<EquipKey | null>(null);

  const enriched: CatalogStretch[] = useMemo(() => catalogStretches(stretches), [stretches]);

  const matchesExceptBand = useMemo(
    () => enriched.filter((p) =>
      (focus === 'all' || p.focus === focus)
      && (equip === null || p.equip === equip)
    ),
    [enriched, focus, equip],
  );
  const list = useMemo(
    () => matchesExceptBand.filter((p) => p.band === band),
    [matchesExceptBand, band],
  );
  const otherBand: BandKey = band === '15' ? '5' : '15';
  const otherBandCount = matchesExceptBand.length - list.length;

  const openStretch = (p: CatalogStretch) => {
    const locked = !p.isFree && !isPremium;
    if (locked) {
      navigate('/paywall');
      return;
    }
    // Player renders from location.state — category 'stretch' routes its
    // entitlement bucket and back path correctly.
    navigate(`/stretch/${p.s.id}`, {
      state: {
        exercise: {
          id: p.s.id,
          name: p.title,
          duration: `${p.s.duration_min} min`,
          category: 'stretch',
          body: p.focus ? STRETCH_FOCUS_LABEL[p.focus] : p.s.body_target,
          equip: EQUIP_LABEL[p.equip],
          videoUrl: p.s.video_id,
          thumb: p.s.thumb_url,
          description: p.s.description,
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
      <BackHeader title="Telo · Strečing" showSearch={false} />

      <div style={{ padding: '0 18px' }}>
        <Ser size={30}>
          Uvoľnenie a <em style={{ color: NM.TERRA, fontWeight: 500, fontStyle: 'italic' }}>mobilita</em>.
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>
          Vyber si dĺžku, partiu a pomôcku. 3 strečingy sú zadarmo — ostatné s Plus.
        </Body>
      </div>

      {/* Band toggle — 15 min strečingy / 5 min rýchla úľava */}
      <div style={{ margin: '20px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, background: '#fff', borderRadius: 999, border: `1px solid ${NM.HAIR}`, padding: 4 }}>
        {(['15', '5'] as BandKey[]).map((key) => {
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
              {STRETCH_BAND_LABEL[key]}
            </button>
          );
        })}
      </div>

      {/* Focus chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 18px 2px' }}>
        <button onClick={() => setFocus('all')} style={chip(focus === 'all')}>Všetko</button>
        {STRETCH_FOCUS_ORDER.map((f) => (
          <button key={f} onClick={() => setFocus(f)} style={chip(focus === f)}>{STRETCH_FOCUS_LABEL[f]}</button>
        ))}
      </div>

      {/* Equipment filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '10px 18px 2px', alignItems: 'center' }}>
        {STRETCH_EQUIP_ORDER.map((q) => (
          <button key={q} onClick={() => setEquip(equip === q ? null : q)} style={smallChip(equip === q)}>
            {EQUIP_LABEL[q]}
          </button>
        ))}
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
              <div>V kategórii {STRETCH_BAND_LABEL[band].toLowerCase()} zatiaľ takýto strečing nie je.</div>
              <button
                onClick={() => setBand(otherBand)}
                style={{ all: 'unset', cursor: 'pointer', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 999, background: NM.DEEP, color: '#fff', fontFamily: NM.SANS, fontSize: 12, fontWeight: 500 }}
              >
                Pozrieť {STRETCH_BAND_LABEL[otherBand].toLowerCase()} ({otherBandCount})
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
              </button>
            </>
          ) : (
            'Žiadne strečingy pre tieto filtre.'
          )}
        </div>
      )}

      {!loading && list.length > 0 && (
        <div style={{ margin: '22px 18px 0' }}>
          <Eye size={10} color={NM.TERRA} style={{ marginBottom: 10 }}>
            {STRETCH_BAND_LABEL[band]} · {list.length}
          </Eye>
          <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {list.map((p, i, arr) => (
              <ExerciseListRow
                key={p.s.id}
                thumbUrl={p.s.thumb_url}
                title={p.title}
                titleParts={p.titleParts}
                meta={`${p.s.duration_min} min · ${EQUIP_SHORT[p.equip]}`}
                locked={!p.isFree && !isPremium}
                onOpen={() => openStretch(p)}
                divider={i < arr.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      <PlusUnlockBanner label="Strečingy označené + odomkneš s NeoMe Plus" />
    </Page>
  );
}
