import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipes } from '../../data/recipes';
import { useDailyRecipe } from '../../hooks/useDailyContent';
import { Page, BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Strava / Výživa — R3 hub
 *
 * Editorial hero, recipe-of-the-day full-bleed card, 5 categories list,
 * meal-plan entry strip.
 *
 * Wired:
 * - Category counts derived live from src/data/recipes
 * - Recipe of the day picked deterministically by ISO day-of-year so
 *   it rotates daily without server state
 *
 * Wired (F-002): useDailyRecipe prefers public.recipes.featured_on=today
 * (admin-curated row) and falls back to the deterministic dayOfYear
 * pick across the static recipes data when no DB row is featured.
 * Both paths render the same JSX shape — fields adapted inline.
 *
 * Old version: Strava.old.tsx.
 */

const CATEGORY_DEFS = [
  { key: 'rananky', recipeCat: 'ranajky' as const, label: 'Raňajky', img: 'testimonial-recipe.jpg' },
  { key: 'obedy', recipeCat: 'obed' as const, label: 'Obedy', img: 'section-nutrition.jpg' },
  { key: 'vecera', recipeCat: 'vecera' as const, label: 'Večera', img: 'lifestyle-core-workout.jpg' },
  { key: 'snacky', recipeCat: 'snack' as const, label: 'Snacky', img: 'hero-yoga.jpg' },
  { key: 'napoje', recipeCat: 'smoothie' as const, label: 'Nápoje', img: 'lifestyle-yoga-pose.jpg' },
];

function dayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

const CATEGORY_LABEL_BY_KEY: Record<string, string> = {
  ranajky: 'Raňajky',
  obed: 'Obed',
  vecera: 'Večera',
  snack: 'Snacky',
  smoothie: 'Nápoje',
};

export default function Strava() {
  const navigate = useNavigate();

  const categories = useMemo(() => {
    return CATEGORY_DEFS.map((c) => ({
      ...c,
      count: recipes.filter((r) => r.category === c.recipeCat).length,
    }));
  }, []);

  const { recipe: serverRecipe } = useDailyRecipe();

  const featured = useMemo(() => {
    if (serverRecipe) {
      return {
        id: serverRecipe.id,
        title: serverRecipe.title,
        category: serverRecipe.category,
        prepTime: serverRecipe.prep_time,
        servings: 2,
        description: serverRecipe.description ?? '',
      };
    }
    if (recipes.length === 0) return null;
    const idx = dayOfYear() % recipes.length;
    return recipes[idx];
  }, [serverRecipe]);
  return (
    <Page>
      <BackHeader title="Výživa" />

      <div style={{ padding: '6px 24px 22px' }}>
        <Eye color={NM.SAGE} style={{ marginBottom: 10 }}>Jedlo · rytmus · chuť</Eye>
        <Ser size={32} style={{ lineHeight: 1.04, marginBottom: 12 }}>
          Dobré jedlo.
          <br />
          Bez diéty.
        </Ser>
        <Body style={{ maxWidth: 310 }}>Recepty s celými potravinami, jednoduchou prípravou a chuťou, ktorú budeš mať rada.</Body>
      </div>

      {featured && (
        <div style={{ padding: '0 24px 22px' }}>
          <Eye color={NM.GOLD} style={{ marginBottom: 14 }}>Recept dňa</Eye>
          <button
            onClick={() => navigate(`/recipe/${featured.id}`)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              borderRadius: 18,
              overflow: 'hidden',
              aspectRatio: '4/5',
              backgroundImage: 'url(/images/r9/testimonial-recipe.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.78) 100%)' }} />
            <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, color: '#fff' }}>
              <div style={{ fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 10 }}>
                {CATEGORY_LABEL_BY_KEY[featured.category] ?? featured.category} · {featured.prepTime} min · {featured.servings} {featured.servings === 1 ? 'porcia' : 'porcie'}
              </div>
              <div style={{ fontFamily: NM.SERIF, fontSize: 28, fontWeight: 500, letterSpacing: '-0.012em', lineHeight: 1.05, marginBottom: 10 }}>
                {featured.title}
              </div>
              <div style={{ fontFamily: NM.SANS, fontSize: 12, color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}>
                {featured.description}
              </div>
            </div>
          </button>
        </div>
      )}

      <div style={{ padding: '6px 24px 10px' }}>
        <Eye style={{ marginBottom: 18 }}>Kategórie</Eye>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => navigate(`/kniznica/strava?cat=${c.key}`)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                gap: 14,
                padding: '2px 0',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  backgroundImage: `url(/images/r9/${c.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: NM.SERIF, fontSize: 20, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.008em', marginBottom: 4 }}>{c.label}</div>
                <Body size={12}>{c.count} receptov</Body>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke={NM.TERTIARY} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '22px 24px 20px' }}>
        <button
          onClick={() => navigate('/kniznica/strava/jedalnicek')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            background: NM.DEEP,
            borderRadius: 18,
            padding: '22px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: -20,
              top: -30,
              bottom: -30,
              width: 180,
              backgroundImage: 'url(/images/r9/section-nutrition.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              opacity: 0.4,
              maskImage: 'linear-gradient(270deg, #000 60%, transparent)',
              WebkitMaskImage: 'linear-gradient(270deg, #000 60%, transparent)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>
              Jedálniček na týždeň
            </div>
            <div style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 10 }}>
              Pripravené každú nedeľu
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 12, color: 'rgba(255,255,255,0.72)' }}>Otvoriť môj plán →</div>
          </div>
        </button>
      </div>
    </Page>
  );
}
