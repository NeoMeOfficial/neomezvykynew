import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipes } from '@/data/recipes';
import { useDailyRecipe } from '@/hooks/useDailyContent';
import { TopBar } from '@/components/v2/top-bar';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { key: 'ranajky', label: 'Raňajky',  recipeCat: 'ranajky' as const },
  { key: 'obed',    label: 'Obedy',    recipeCat: 'obed' as const },
  { key: 'vecera',  label: 'Večera',   recipeCat: 'vecera' as const },
  { key: 'snack',   label: 'Snacky',   recipeCat: 'snack' as const },
  { key: 'smoothie',label: 'Nápoje',   recipeCat: 'smoothie' as const },
];

const CAT_LABEL: Record<string, string> = {
  ranajky: 'Raňajky', obed: 'Obed', vecera: 'Večera', snack: 'Snacky', smoothie: 'Nápoje',
};

const CAT_IMG: Record<string, string> = {
  ranajky: 'testimonial-recipe.jpg',
  obed:    'section-nutrition.jpg',
  vecera:  'lifestyle-core-workout.jpg',
  snack:   'hero-yoga.jpg',
  smoothie:'lifestyle-yoga-pose.jpg',
};

function dayOfYear(d = new Date()): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
}

export default function Strava() {
  const navigate = useNavigate();
  const { recipe: serverRecipe } = useDailyRecipe();

  const categories = useMemo(() =>
    CATEGORIES.map(c => ({ ...c, count: recipes.filter(r => r.category === c.recipeCat).length })),
  []);

  const featured = useMemo(() => {
    if (serverRecipe) return { id: serverRecipe.id, title: serverRecipe.title, category: serverRecipe.category, prepTime: serverRecipe.prep_time };
    if (!recipes.length) return null;
    return recipes[dayOfYear() % recipes.length];
  }, [serverRecipe]);

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Strava" backHref="/kniznica" />

      <div className="px-5 pb-6">
        <SerifHeader as="h1" size="h1">
          Dobré jedlo.{' '}
          <em className="text-[#8B9E88] not-italic font-serif italic">Bez diéty.</em>
        </SerifHeader>
        <BodyText tone="secondary" className="mt-2 max-w-[320px]">
          Recepty s celými potravinami, jednoduchou prípravou a chuťou, ktorú budeš mať rada.
        </BodyText>
      </div>

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
                {CAT_LABEL[featured.category] ?? featured.category} · {featured.prepTime ?? 25} min
              </div>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 26, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                {featured.title}
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
                backgroundImage: `url(/images/r9/${CAT_IMG[c.key]})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 20, fontWeight: 500, color: '#3D2921', letterSpacing: '-0.008em', marginBottom: 4 }}>
                  {c.label}
                </div>
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: 'rgba(61,41,33,0.72)' }}>
                  {c.count} receptov
                </div>
              </div>
              <ChevronRight size={16} color="rgba(61,41,33,0.42)" strokeWidth={1.3} />
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        <button
          onClick={() => navigate('/jedalnicek')}
          className="w-full text-left rounded-card p-5 bg-ink text-cream flex items-center gap-4 transition-all active:scale-[0.99]"
        >
          <div className="flex-1 min-w-0">
            <Eyebrow tone="muted" className="text-cream/50 mb-1">Jedálniček na týždeň</Eyebrow>
            <div className="font-serif text-h2 text-cream leading-snug">Pripravené každú nedeľu</div>
            <div className="font-sans text-sm text-cream/72 mt-1">Otvoriť môj plán →</div>
          </div>
        </button>
      </div>
    </div>
  );
}
