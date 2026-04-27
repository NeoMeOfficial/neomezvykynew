import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { recipes, type Recipe } from '../../data/recipes';
import { Page, BackHeader, Eye, NM } from '../../components/v2/neome';

/**
 * Recepty / Recipes browser — R3 filtered list
 *
 * Search row + filter chips + sectioned editorial rows.
 *
 * Wired:
 * - recipes from src/data/recipes
 * - URL ?cat= filter from Strava hub category clicks
 * - Search by query (?q=)
 *
 * FEATURE-NEEDED-RECEPTY-FILTERS: dietary filters (vegetariánske /
 * bez lepku / vysoký proteín) — requires diet_tags column on recipes
 * + admin tagging. Currently only category and prep-time filters work.
 *
 * Old version: Recepty.old.tsx.
 */

const CAT_LABEL: Record<Recipe['category'], string> = {
  ranajky: 'Raňajky',
  obed: 'Obed',
  vecera: 'Večera',
  snack: 'Snack',
  smoothie: 'Smoothie',
};

const CATEGORY_QUERY_MAP: Record<string, Recipe['category']> = {
  rananky: 'ranajky',
  obedy: 'obed',
  vecera: 'vecera',
  snacky: 'snack',
  napoje: 'smoothie',
};

const FILTER_CHIPS = [
  { id: 'cat', label: 'Typ jedla' },
  { id: 'fast', label: 'Do 20 min' },
  { id: 'veg', label: 'Vegetariánske' },
  { id: 'gf', label: 'Bez lepku' },
  { id: 'protein', label: 'Vysoký proteín' },
] as const;

function recipeImg(r: Recipe): string {
  if (r.category === 'ranajky' || r.category === 'snack' || r.category === 'smoothie') return 'testimonial-recipe.jpg';
  if (r.category === 'obed') return 'section-nutrition.jpg';
  return 'program-body-forming.jpg';
}

export default function Recepty() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [activeFast, setActiveFast] = useState(false);

  const cat = params.get('cat');
  const recipeCat = cat ? CATEGORY_QUERY_MAP[cat] ?? null : null;

  const filtered = useMemo(() => {
    let list = recipes;
    if (recipeCat) list = list.filter((r) => r.category === recipeCat);
    if (activeFast) list = list.filter((r) => r.prepTime <= 20);
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    return list;
  }, [recipeCat, activeFast, query]);

  return (
    <Page>
      <BackHeader title="Hľadať v receptoch" showSearch={false} />

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
            placeholder={recipeCat ? CAT_LABEL[recipeCat] : 'Hľadaj recept…'}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: NM.SANS,
              fontSize: 13,
              color: NM.DEEP,
            }}
          />
        </div>
      </div>

      <div style={{ padding: '0 18px 6px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {FILTER_CHIPS.map((c) => {
          const isCat = c.id === 'cat';
          const isFast = c.id === 'fast';
          const active = (isCat && !!recipeCat) || (isFast && activeFast);
          const label = isCat && recipeCat ? `Typ · ${CAT_LABEL[recipeCat]}` : c.label;
          return (
            <button
              key={c.id}
              onClick={() => {
                if (isFast) setActiveFast((v) => !v);
                // FEATURE-NEEDED-RECEPTY-FILTERS for the others
              }}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '8px 14px',
                borderRadius: 999,
                background: active ? NM.DEEP : 'transparent',
                color: active ? '#fff' : NM.DEEP,
                border: active ? 'none' : `1px solid ${NM.HAIR_2}`,
                fontFamily: NM.SANS,
                fontSize: 12,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '18px 18px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Eye>Výsledky · {filtered.length}</Eye>
      </div>

      <div style={{ padding: '0 18px 10px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: NM.MUTED, fontSize: 13 }}>
            Nič sa nenašlo. Skús inú frázu alebo zruš filter.
          </div>
        ) : (
          filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate(`/recipe/${r.id}`)}
              style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 14, width: '100%' }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 14,
                  backgroundImage: `url(/images/r9/${recipeImg(r)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                <Eye size={9} style={{ marginBottom: 5 }}>
                  {CAT_LABEL[r.category]} · {r.prepTime} min
                </Eye>
                <div style={{ fontFamily: NM.SERIF, fontSize: 16, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.008em', lineHeight: 1.25, marginBottom: 6 }}>{r.title}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.SAGE, fontWeight: 500, letterSpacing: '0.02em' }}>+ Pridať do plánu</div>
              </div>
            </button>
          ))
        )}
      </div>
    </Page>
  );
}
