import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUniversalFavorites, ContentType } from '../../hooks/useUniversalFavorites';
import { useRecipes, type SupabaseRecipe } from '@/hooks/useRecipes';
import { RecipeListCard } from '../../components/v2/RecipeListCard';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import { Heart, ChefHat, Dumbbell, Brain, FileText, Target } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';

const TYPE_ICON = {
  recipe: ChefHat,
  workout: Dumbbell,
  meditation: Brain,
  article: FileText,
  program: Target,
} as const;

const TYPE_LABEL: Record<ContentType, string> = {
  recipe: 'Recepty',
  workout: 'Cvičenia',
  meditation: 'Meditácie',
  article: 'Články',
  program: 'Programy',
};

const TYPE_COLOR: Record<ContentType, string> = {
  recipe: 'text-pillar-strava',
  workout: 'text-pillar-telo',
  meditation: 'text-pillar-mysel',
  article: 'text-gold',
  program: 'text-pillar-telo',
};

/** Route to open a favourited item, per content type. */
function itemPath(item: { id: string | number; type: ContentType; category?: string }): string {
  switch (item.type) {
    case 'recipe':     return `/recept/${item.id}`;
    case 'meditation': return `/meditacia/${item.id}`;
    case 'workout':    return item.category === 'stretch' ? `/stretch/${item.id}` : `/exercise/extra/${item.id}`;
    case 'article':    return `/blog/${item.id}`;
    case 'program':    return `/program/${item.id}`;
  }
}

export default function Oblubene() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { favorites, supabaseFavorites, isFavorite, toggleFavorite } = useUniversalFavorites();
  const { recipes, loading: recipesLoading } = useRecipes();
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>(() => {
    const tab = params.get('tab');
    return tab && tab in TYPE_LABEL ? (tab as ContentType) : 'all';
  });

  // Recipes resolve against the live library via the Supabase favourites list
  // (source of truth across devices) plus any local-only metadata (anon/demo).
  // Local metadata alone missed favourites saved on another device or before
  // metadata existed. Old favourites pointing at retired recipes are dropped.
  const recipeById = new Map(recipes.map((r) => [String(r.id), r]));
  const favRecipeIds: string[] = [];
  supabaseFavorites.forEach((f) => { if (f.item_type === 'recipe') favRecipeIds.push(f.item_id); });
  favorites.forEach((f) => {
    if (f.type === 'recipe' && !favRecipeIds.includes(String(f.id))) favRecipeIds.push(String(f.id));
  });
  const favRecipes = favRecipeIds
    .map((id) => recipeById.get(id))
    .filter((r): r is SupabaseRecipe => Boolean(r));
  const otherFavs = favorites.filter((f) => f.type !== 'recipe');

  const counts = {
    total: favRecipes.length + otherFavs.length,
    recipe: favRecipes.length,
    workout: otherFavs.filter((f) => f.type === 'workout').length,
    meditation: otherFavs.filter((f) => f.type === 'meditation').length,
    article: otherFavs.filter((f) => f.type === 'article').length,
    program: otherFavs.filter((f) => f.type === 'program').length,
  };

  const showRecipes = activeTab === 'all' || activeTab === 'recipe';
  const filteredOther = activeTab === 'all'
    ? otherFavs
    : activeTab === 'recipe'
    ? []
    : otherFavs.filter((f) => f.type === activeTab);

  const tabs = [
    { key: 'all' as const, label: 'Všetky', count: counts.total },
    { key: 'recipe' as const, label: 'Recepty', count: counts.recipe },
    { key: 'workout' as const, label: 'Cvičenia', count: counts.workout },
    { key: 'meditation' as const, label: 'Meditácie', count: counts.meditation },
    { key: 'article' as const, label: 'Články', count: counts.article },
    { key: 'program' as const, label: 'Programy', count: counts.program },
  ].filter(t => t.key === 'all' || t.count > 0 || t.key === activeTab);

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Obľúbené" onBack={() => navigate(-1)} />

      {counts.total === 0 && recipesLoading ? (
        <div className="px-5 mt-12 text-center">
          <BodyText tone="secondary">Načítavam…</BodyText>
        </div>
      ) : counts.total === 0 ? (
        <div className="px-5 mt-12 text-center">
          <div className="h-16 w-16 rounded-full bg-rose/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="size-7 text-rose" />
          </div>
          <SerifHeader as="h2" size="h2" className="mb-2">Zatiaľ nič uložené</SerifHeader>
          <BodyText tone="secondary" className="max-w-xs mx-auto">
            Keď nájdeš recept, cvičenie alebo meditáciu, ktoré sa ti páčia, klikni na srdiečko a nájdeš ich tu.
          </BodyText>
        </div>
      ) : (
        <div className="px-5 pt-2">
          {/* Filter tabs */}
          {tabs.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-5 px-5">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-sans text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-ink text-cream'
                      : 'bg-white border border-ink/[0.08] text-ink/72'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && tab.key !== 'all' && (
                    <span className={`ml-1.5 text-xs ${activeTab === tab.key ? 'opacity-60' : 'opacity-40'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Content list */}
          {(showRecipes ? favRecipes.length : 0) + filteredOther.length === 0 ? (
            <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-8 text-center">
              <BodyText tone="secondary">
                Žiadne obľúbené v tejto kategórii.
              </BodyText>
            </div>
          ) : (
            <>
            {/* Recipes — same card as in Recepty */}
            {showRecipes && favRecipes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: filteredOther.length > 0 ? 18 : 0 }}>
                {favRecipes.map((r) => (
                  <RecipeListCard
                    key={r.id}
                    recipe={r}
                    fav={isFavorite(r.id, 'recipe')}
                    onOpen={() => navigate(`/recept/${r.id}`)}
                    onToggleFav={() => toggleFavorite({
                      id: r.id,
                      type: 'recipe',
                      title: r.name,
                      duration: `${r.prep_minutes ?? 0} min`,
                      kcal: r.kcal ?? 0,
                      category: r.slot,
                    })}
                  />
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2">
              {filteredOther.map(item => {
                const Icon = TYPE_ICON[item.type];
                const colorClass = TYPE_COLOR[item.type];
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(itemPath(item))}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(itemPath(item)); }}
                    className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-4 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <div className="h-12 w-12 rounded-xl bg-cream-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <Icon className={`size-5 ${colorClass}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-h3 text-ink leading-snug truncate">{item.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Eyebrow tone="muted">{TYPE_LABEL[item.type]}</Eyebrow>
                        {item.duration && (
                          <Eyebrow tone="muted">· {item.duration}</Eyebrow>
                        )}
                      </div>
                    </div>

                    <FavoriteButton
                      itemId={item.id}
                      type={item.type}
                      title={item.title}
                      image={item.image}
                      duration={item.duration}
                      kcal={item.kcal}
                      category={item.category}
                      program={item.program}
                      metadata={item.metadata}
                      size="sm"
                      variant="minimal"
                    />
                  </div>
                );
              })}
            </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
