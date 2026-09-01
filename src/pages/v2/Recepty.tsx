import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecipes, recipeCategories, CATEGORY_KEYS, CATEGORY_LABEL, type SupabaseRecipe, type RecipeCategory } from '@/hooks/useRecipes';
import { RecipeListCard } from '../../components/v2/RecipeListCard';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUniversalFavorites } from '@/hooks/useUniversalFavorites';
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

// ?cat= accepts the six category keys plus legacy aliases.
const CATEGORY_QUERY_MAP: Record<string, RecipeCategory> = {
  ranajky: 'ranajky', hlavne: 'hlavne', salaty: 'salaty', natierky: 'natierky', snacky: 'snacky', napoje: 'napoje',
  obedy: 'hlavne', vecera: 'hlavne', snack: 'snacky',
};

const CATEGORY_CHIPS: { id: RecipeCategory; label: string }[] =
  CATEGORY_KEYS.map((id) => ({ id, label: CATEGORY_LABEL[id] }));

export default function Recepty() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { recipes, loading, error } = useRecipes();
  const { isPremium } = useSubscription();
  const { isFavorite, toggleFavorite } = useUniversalFavorites();
  const [query, setQuery] = useState(params.get('q') ?? '');
  // Fáza B filters: prep-time bucket + meatless (both combine with category)
  const [timeFilter, setTimeFilter] = useState<'all' | 10 | 20 | 30 | 99>('all');
  const [meatless, setMeatless] = useState(false);
  const [favOnly, setFavOnly] = useState(params.get('fav') === '1');
  // The category lives in the URL (?cat=), so the history keeps the flow
  // Strava → category listing → recipe detail: back from a recipe returns to
  // the clearly-titled category, and back from the category returns to Strava.
  const catParam = params.get('cat');
  const slotFilter: RecipeCategory | 'all' = catParam ? CATEGORY_QUERY_MAP[catParam] ?? 'all' : 'all';

  const filtered = useMemo(() => {
    let list = recipes;
    if (slotFilter !== 'all') list = list.filter((r) => recipeCategories(r).includes(slotFilter));
    if (timeFilter !== 'all') {
      list = timeFilter === 99
        ? list.filter((r) => (r.prep_minutes ?? 0) > 30)
        : list.filter((r) => r.prep_minutes != null && r.prep_minutes <= timeFilter);
    }
    if (meatless) list = list.filter((r) => r.vegetarian === true);
    if (favOnly) list = list.filter((r) => isFavorite(r.id, 'recipe'));
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }
    return list;
  }, [recipes, slotFilter, timeFilter, meatless, favOnly, query, isFavorite]);

  const handleClick = (r: SupabaseRecipe) => {
    // Detail page enforces the per-user quota; listing taps are always permitted.
    // Plain push: back from the recipe returns to this category listing.
    navigate(`/recept/${r.id}`);
  };

  const inCategory = slotFilter !== 'all';

  // Opening a category replaces the current entry, so back from the category
  // view exits recipes entirely (to the Strava hub) instead of re-showing the
  // all-recipes landing.
  const openCategory = (id: RecipeCategory) => {
    setTimeFilter('all');
    setMeatless(false);
    setFavOnly(false);
    const next = new URLSearchParams(params);
    next.set('cat', id);
    setParams(next, { replace: true });
  };

  return (
    <Page>
      <BackHeader
        title={slotFilter !== 'all' ? `Recepty — ${CATEGORY_LABEL[slotFilter]}` : 'Recepty'}
        showSearch={false}
      />

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

      {!inCategory ? (
        /* Landing: category chips + favourites */
        <div style={{ padding: '0 18px 6px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {CATEGORY_CHIPS.map((c) => (
            <button
              key={c.id}
              onClick={() => openCategory(c.id)}
              style={{
                all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
                background: 'transparent', color: NM.DEEP,
                border: `1px solid ${NM.HAIR_2}`,
                fontFamily: NM.SANS, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              {c.label}
            </button>
          ))}
          <button
            onClick={() => setFavOnly((v) => !v)}
            style={{
              all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
              background: favOnly ? NM.TERRA : 'transparent',
              color: favOnly ? '#fff' : NM.DEEP,
              border: favOnly ? 'none' : `1px solid ${NM.HAIR_2}`,
              fontFamily: NM.SANS, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill={favOnly ? '#fff' : 'none'} stroke={favOnly ? '#fff' : NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            Obľúbené
          </button>
        </div>
      ) : (
        /* Category view: straight to filters — tap an active time chip again to clear it */
        <div style={{ padding: '0 18px 6px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {([
            { id: 10 as const, label: 'Do 10 min' },
            { id: 20 as const, label: 'Do 20 min' },
            { id: 30 as const, label: 'Do 30 min' },
            { id: 99 as const, label: 'Viac ako 30 min' },
          ]).map((c) => {
            const active = timeFilter === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setTimeFilter(active ? 'all' : c.id)}
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
            onClick={() => setMeatless((v) => !v)}
            style={{
              all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
              background: meatless ? NM.SAGE : 'transparent',
              color: meatless ? '#fff' : NM.DEEP,
              border: meatless ? 'none' : `1px solid ${NM.HAIR_2}`,
              fontFamily: NM.SANS, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Bez mäsa
          </button>
        </div>
      )}

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
            {favOnly
              ? 'Zatiaľ nemáš žiadne obľúbené recepty. Ulož si recept srdiečkom a nájdeš ho tu.'
              : timeFilter !== 'all' || meatless || slotFilter !== 'all'
              ? 'Nič sa nenašlo. Skús menej filtrov.'
              : 'Nič sa nenašlo. Skús inú frázu.'}
          </div>
        ) : (
          filtered.map((r) => (
            <RecipeListCard
              key={r.id}
              recipe={r}
              fav={isFavorite(r.id, 'recipe')}
              onOpen={() => handleClick(r)}
              onToggleFav={() => toggleFavorite({
                id: r.id,
                type: 'recipe',
                title: r.name,
                duration: `${r.prep_minutes ?? 0} min`,
                kcal: r.kcal ?? 0,
                category: r.slot,
              })}
            />
          ))
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
