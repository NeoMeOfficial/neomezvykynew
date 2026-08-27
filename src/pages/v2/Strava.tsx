import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecipes, dailyRecipeOf, recipeCategories, recipeCategoryLabel, CATEGORY_KEYS, CATEGORY_LABEL, categoryImage } from '@/hooks/useRecipes';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUniversalFavorites } from '@/hooks/useUniversalFavorites';
import { TopBar } from '@/components/v2/top-bar';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ChevronRight } from 'lucide-react';


export default function Strava() {
  const navigate = useNavigate();
  // Entered from a home pillar card → back returns home, not to Kniznica.
  const fromHome = new URLSearchParams(useLocation().search).get('from') === 'home';
  const { hasMealPlanner } = useSubscription();
  const { recipes, loading } = useRecipes();
  const { isFavorite } = useUniversalFavorites();
  const favCount = useMemo(
    () => recipes.filter(r => isFavorite(r.id, 'recipe')).length,
    [recipes, isFavorite],
  );

  const categories = useMemo(() =>
    CATEGORY_KEYS.map((key) => ({
      key,
      label: CATEGORY_LABEL[key],
      img: categoryImage(key),
      count: recipes.filter((r) => recipeCategories(r).includes(key)).length,
    })),
  [recipes]);

  // Deterministic recipe-of-the-day — shared with the home card.
  const featured = useMemo(() => dailyRecipeOf(recipes), [recipes]);

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Strava" backHref={fromHome ? '/domov-new' : '/kniznica'} />

      <div className="px-5 pb-6">
        <SerifHeader as="h1" size="h1">
          Dobré jedlo.{' '}
          <em className="text-[#8B9E88] not-italic font-serif italic">Bez diéty.</em>
        </SerifHeader>
        <BodyText tone="secondary" className="mt-2 max-w-[320px]">
          Recepty s celými potravinami, jednoduchou prípravou a chuťou, ktorú budeš mať rada.
        </BodyText>
      </div>

      {/* Meal plan shortcut at top — only if purchased */}
      {hasMealPlanner && (
        <div className="px-5 mb-6">
          <button
            onClick={() => navigate('/jedalnicek')}
            className="w-full text-left rounded-card p-4 flex items-center gap-3 transition-all active:scale-[0.99]"
            style={{ background: '#3D2921', border: 'none', cursor: 'pointer', borderRadius: 16 }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#7A9E78', fontWeight: 500, marginBottom: 4 }}>Môj jedálniček</div>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 18, color: '#F5EFE5', lineHeight: 1.2 }}>Plán na tento týždeň</div>
            </div>
            <ChevronRight size={18} color="rgba(245,239,229,0.5)" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {featured && (
        <div className="px-5 mb-6">
          <Eyebrow tone="gold" className="mb-3">Recept dňa</Eyebrow>
          <button
            onClick={() => navigate(`/recept/${featured.id}`)}
            style={{
              display: 'block', width: '100%', border: 'none', cursor: 'pointer',
              borderRadius: 18, overflow: 'hidden', aspectRatio: '4/3', position: 'relative',
              backgroundImage: 'url(/images/r9/testimonial-recipe.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.78) 100%)' }} />
            <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, color: '#fff', textAlign: 'left' }}>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 10 }}>
                {recipeCategoryLabel(featured)} · {featured.prep_minutes ?? 25} min
              </div>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 26, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                {featured.name}
              </div>
            </div>
          </button>
        </div>
      )}

      <div className="px-5 mb-6">
        <Eyebrow tone="muted" className="mb-4">Kategórie</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {categories.map(c => (
            <button
              key={c.key}
              onClick={() => navigate(`/recepty?cat=${c.key}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '2px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: 14, flexShrink: 0,
                backgroundImage: `url(${c.img})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 20, fontWeight: 500, color: '#3D2921', letterSpacing: '-0.008em', marginBottom: 4 }}>
                  {c.label}
                </div>
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: 'rgba(61,41,33,0.72)' }}>
                  {loading ? '…' : `${c.count} receptov`}
                </div>
              </div>
              <ChevronRight size={16} color="rgba(61,41,33,0.42)" strokeWidth={1.3} />
            </button>
          ))}

          {/* Favourites — same row anatomy as the slot categories */}
          <button
            onClick={() => navigate('/oblubene?tab=recipe')}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '2px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{
              width: 72, height: 72, borderRadius: 14, flexShrink: 0,
              background: 'rgba(194,122,110,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill={favCount > 0 ? '#C27A6E' : 'none'} stroke="#C27A6E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 20, fontWeight: 500, color: '#3D2921', letterSpacing: '-0.008em', marginBottom: 4 }}>
                Obľúbené
              </div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: 'rgba(61,41,33,0.72)' }}>
                {favCount > 0 ? `${favCount} ${favCount === 1 ? 'recept' : favCount < 5 ? 'recepty' : 'receptov'}` : 'Recepty uložené srdiečkom'}
              </div>
            </div>
            <ChevronRight size={16} color="rgba(61,41,33,0.42)" strokeWidth={1.3} />
          </button>
        </div>
      </div>

      {/* Meal plan section — shows active plan or upsell depending on purchase */}
      <div className="px-5 pb-8">
        {hasMealPlanner ? (
          <button
            onClick={() => navigate('/jedalnicek')}
            className="w-full text-left rounded-card p-5 bg-ink text-cream flex items-center gap-4 transition-all active:scale-[0.99]"
          >
            <div className="flex-1 min-w-0">
              <Eyebrow tone="muted" className="text-cream/50 mb-1">Tvoj jedálniček</Eyebrow>
              <div className="font-serif text-h2 text-cream leading-snug">Plán na tento týždeň</div>
              <div className="font-sans text-sm text-cream/72 mt-1">Otvoriť môj plán →</div>
            </div>
          </button>
        ) : (
          <button
            onClick={() => navigate('/jedalnicek-promo')}
            className="w-full text-left transition-all active:scale-[0.99]"
            style={{
              borderRadius: 20, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0,
              background: 'linear-gradient(135deg, #7A9E78 0%, #5F7E5D 100%)',
            }}
          >
            <div style={{ padding: '22px 20px 20px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, right: 12, fontFamily: 'Gilda Display, serif', fontSize: 110, fontStyle: 'italic', lineHeight: 0.9, color: '#F5EFE5', opacity: 0.22, userSelect: 'none', pointerEvents: 'none' }}>6</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(245,239,229,0.4)', marginBottom: 12 }}>
                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase' as const, fontWeight: 500, color: '#F5EFE5' }}>Jedálniček</span>
              </div>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 22, lineHeight: 1.2, color: '#F5EFE5', marginBottom: 6 }}>
                6-týždňový plán <em style={{ color: '#F5EFE5', fontStyle: 'italic', opacity: 0.92 }}>na mieru</em>
              </div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: 'rgba(245,239,229,0.85)', lineHeight: 1.5, fontWeight: 300, marginBottom: 16, maxWidth: 280 }}>
                Personalizovaný jedálniček s nákupným zoznamom a Gabinými receptami — na celých 6 týždňov.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px 14px', marginBottom: 18 }}>
                {['Nákupný zoznam', 'Makrá + kalórie', 'Gabine recepty', 'Cyklus-vedomé'].map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F5EFE5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-11"/></svg>
                    <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: 'rgba(245,239,229,0.95)' }}>{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: '#F5EFE5', color: '#4E6B4C', padding: '11px 20px', borderRadius: 999, fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Zistiť viac
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4E6B4C" strokeWidth="2.5" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
                </div>
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: 'rgba(245,239,229,0.8)', fontWeight: 300 }}>od 57 €</div>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
