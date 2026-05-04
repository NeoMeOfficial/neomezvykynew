import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipes } from '@/data/recipes';
import { useDailyRecipe } from '@/hooks/useDailyContent';
import { TopBar } from '@/components/v2/top-bar';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SectionHeader } from '@/components/ui/section-header';
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

const CAT_DOT: Record<string, string> = {
  ranajky: 'bg-pillar-strava', obed: 'bg-pillar-strava/80', vecera: 'bg-pillar-strava/60',
  snack: 'bg-pillar-strava/40', smoothie: 'bg-pillar-strava/30',
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
          <SectionHeader eyebrow="Recept dňa" className="mb-3" />
          <button
            onClick={() => navigate(`/recept/${featured.id}`)}
            className="w-full text-left rounded-card p-5 bg-white border border-ink/[0.08] shadow-nm-sm flex items-center gap-4 transition-all active:scale-[0.99]"
          >
            <div className="h-14 w-14 rounded-xl bg-pillar-strava/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🥗</span>
            </div>
            <div className="flex-1 min-w-0">
              <Eyebrow tone="muted" className="mb-0.5">
                {CAT_LABEL[featured.category] ?? featured.category} · {featured.prepTime} min
              </Eyebrow>
              <div className="font-serif text-h3 text-ink leading-snug truncate">{featured.title}</div>
            </div>
            <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
          </button>
        </div>
      )}

      <div className="px-5 mb-6">
        <SectionHeader eyebrow="Kategórie" className="mb-3" />
        <div className="flex flex-col gap-2">
          {categories.map(c => (
            <button
              key={c.key}
              onClick={() => navigate(`/recepty?cat=${c.key}`)}
              className="w-full text-left rounded-card p-4 bg-white border border-ink/[0.08] shadow-nm-sm flex items-center gap-4 transition-all active:scale-[0.99]"
            >
              <div className={`h-10 w-10 rounded-full ${CAT_DOT[c.key]} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="font-serif text-h3 text-ink">{c.label}</div>
                <BodyText size="sm" tone="muted">{c.count} receptov</BodyText>
              </div>
              <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
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
