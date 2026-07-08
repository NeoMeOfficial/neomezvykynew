import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecipes, SLOT_LABEL, type SupabaseRecipe } from '@/hooks/useRecipes';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Page, BackHeader, Eye, NM } from '../../components/v2/neome';
import PlusUnlockBanner from '../../components/v2/paywall/PlusUnlockBanner';

/**
 * Recepty / Recipe browser — reads from Supabase public.recipes
 *
 * Gating model (ADR-0001): no catalog-level lock on the listing. Free users
 * can browse the full catalog and tap any recipe. The detail page enforces
 * the per-user quota (15 unique recipes per rolling 30 days) via
 * useEntitlement and routes to /paywall when the quota is exhausted.
 */

const CATEGORY_QUERY_MAP: Record<string, SupabaseRecipe['slot']> = {
  ranajky:  'ranajky',
  obedy:    'hlavne',
  vecera:   'hlavne',
  snacky:   'snack',
  napoje:   'snack',
  hlavne:   'hlavne',
  snack:    'snack',
};

const SLOT_CHIPS: { id: SupabaseRecipe['slot'] | 'all'; label: string }[] = [
  { id: 'all',     label: 'Všetko' },
  { id: 'ranajky', label: 'Raňajky' },
  { id: 'hlavne',  label: 'Hlavné' },
  { id: 'snack',   label: 'Snacky' },
];

function recipeImg(r: SupabaseRecipe): string {
  if (r.slot === 'ranajky' || r.slot === 'snack') return 'testimonial-recipe.jpg';
  return 'section-nutrition.jpg';
}

export default function Recepty() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { recipes, loading, error } = useRecipes();
  const { isPremium } = useSubscription();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [activeFast, setActiveFast] = useState(false);
  const [slotFilter, setSlotFilter] = useState<SupabaseRecipe['slot'] | 'all'>(() => {
    const cat = params.get('cat');
    return cat ? CATEGORY_QUERY_MAP[cat] ?? 'all' : 'all';
  });

  const filtered = useMemo(() => {
    let list = recipes;
    if (slotFilter !== 'all') list = list.filter((r) => r.slot === slotFilter);
    if (activeFast) list = list.filter((r) => (r.prep_minutes ?? 99) <= 20);
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }
    return list;
  }, [recipes, slotFilter, activeFast, query]);

  const handleClick = (r: SupabaseRecipe) => {
    // Detail page enforces the per-user quota; listing taps are always permitted.
    navigate(`/recept/${r.id}`);
  };

  return (
    <Page>
      <BackHeader title="Recepty" showSearch={false} />

      {/* Search bar */}
      <div style={{ padding: '4px 18px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#fff', border: `1px solid ${NM.HAIR_2}`, borderRadius: 999 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke={NM.TERTIARY} strokeWidth="1.4" />
            <path d="M11 11l3.5 3.5" stroke={NM.TERTIARY} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hľadaj recept…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP }}
          />
        </div>
      </div>

      {/* Slot chips */}
      <div style={{ padding: '0 18px 6px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {SLOT_CHIPS.map((c) => {
          const active = slotFilter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSlotFilter(c.id as SupabaseRecipe['slot'] | 'all')}
              style={{
                all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
                background: active ? NM.DEEP : 'transparent',
                color: active ? '#fff' : NM.DEEP,
                border: active ? 'none' : `1px solid ${NM.HAIR_2}`,
                fontFamily: NM.SANS, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              {c.label}
            </button>
          );
        })}
        <button
          onClick={() => setActiveFast((v) => !v)}
          style={{
            all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
            background: activeFast ? NM.DEEP : 'transparent',
            color: activeFast ? '#fff' : NM.DEEP,
            border: activeFast ? 'none' : `1px solid ${NM.HAIR_2}`,
            fontFamily: NM.SANS, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          Do 20 min
        </button>
      </div>

      <div style={{ padding: '18px 18px 8px' }}>
        <Eye>{loading ? 'Načítavam…' : `Výsledky · ${filtered.length}`}</Eye>
      </div>

      {!loading && (
        <PlusUnlockBanner label="Zadarmo máš 15 receptov mesačne — všetkých 225 odomkneš s NeoMe Plus" />
      )}

      <div style={{ padding: '0 18px 10px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 92, height: 92, borderRadius: 14, background: NM.HAIR, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
                <div style={{ height: 10, width: '40%', borderRadius: 4, background: NM.HAIR }} />
                <div style={{ height: 16, width: '80%', borderRadius: 4, background: NM.HAIR }} />
                <div style={{ height: 10, width: '30%', borderRadius: 4, background: NM.HAIR }} />
              </div>
            </div>
          ))
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ color: NM.MUTED, fontSize: 13, marginBottom: 14 }}>
              Recepty sa nepodarilo načítať. Skontroluj pripojenie.
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{ all: 'unset', cursor: 'pointer', background: NM.DEEP, color: '#fff', padding: '10px 20px', borderRadius: 999, fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500 }}
            >
              Skúsiť znova
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: NM.MUTED, fontSize: 13 }}>
            Nič sa nenašlo. Skús inú frázu alebo zruš filter.
          </div>
        ) : (
          filtered.map((r) => {
            return (
              <button
                key={r.id}
                onClick={() => handleClick(r)}
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 14, width: '100%' }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', width: 92, height: 92, borderRadius: 14, flexShrink: 0 }}>
                  <div
                    style={{
                      width: '100%', height: '100%', borderRadius: 14,
                      backgroundImage: `url(/images/r9/${recipeImg(r)})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }}
                  />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                  <Eye size={9} style={{ marginBottom: 5 }}>
                    {SLOT_LABEL[r.slot]}{r.prep_minutes ? ` · ${r.prep_minutes} min` : ''}
                    {r.kcal ? ` · ${r.kcal} kcal` : ''}
                  </Eye>
                  <div style={{
                    fontFamily: NM.SERIF, fontSize: 16, fontWeight: 500,
                    color: NM.DEEP,
                    letterSpacing: '-0.008em', lineHeight: 1.25, marginBottom: 6,
                  }}>
                    {r.name}
                  </div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.SAGE, fontWeight: 500, letterSpacing: '0.02em' }}>
                    + Pridať do plánu
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Upsell banner — shown to free users */}
      {!isPremium && !loading && filtered.length > 0 && (
        <div style={{ margin: '8px 18px 24px', padding: '18px 20px', background: NM.DEEP, borderRadius: 16 }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: NM.GOLD, marginBottom: 8, fontWeight: 500 }}>
            NeoMe Plus
          </div>
          <div style={{ fontFamily: NM.SERIF, fontSize: 18, color: '#F5EFE5', lineHeight: 1.25, marginBottom: 6 }}>
            Odomkni všetkých 225 receptov
          </div>
          <div style={{ fontFamily: NM.SANS, fontSize: 12, color: 'rgba(245,239,229,0.65)', marginBottom: 14 }}>
            Raňajky, hlavné jedlá aj snacky — plná knižnica so živinami.
          </div>
          <button
            onClick={() => navigate('/paywall')}
            style={{
              all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
              background: NM.GOLD, color: '#fff', padding: '10px 18px',
              borderRadius: 999, fontFamily: NM.SANS, fontSize: 13, fontWeight: 600,
            }}
          >
            Získať Plus
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      )}
    </Page>
  );
}
