import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUniversalFavorites, ContentType } from '../../hooks/useUniversalFavorites';
import { useRecipes, type SupabaseRecipe } from '@/hooks/useRecipes';
import { RecipeListCard } from '../../components/v2/RecipeListCard';
import { ExerciseListRow } from '../../components/v2/ExerciseListRow';
import { MeditationListRow } from '../../components/v2/MeditationListRow';
import { useMeditations } from '../../hooks/useMeditations';
import { useExercises } from '../../hooks/useExercises';
import { useStretches } from '../../hooks/useStretches';
import { catalogExercises, catalogStretches, CatalogExercise, CatalogStretch } from '../../features/telo/libraryCatalog';
import { FOCUS_LABEL, STRETCH_FOCUS_LABEL, EQUIP_LABEL, EQUIP_SHORT } from '../../features/telo/exerciseTaxonomy';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { NM } from '../../components/v2/neome';
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

  // Workouts resolve the same way against the Telo catalogs (cvičenia + strečing)
  // and render with the same row card as the Telo listings. Workout favourites
  // that no longer match a catalog item fall back to the generic row below.
  const { exercises } = useExercises();
  const { stretches } = useStretches();
  const { isPremium } = useSubscription();
  const extraById = new Map(catalogExercises(exercises).map((p) => [String(p.e.id), p]));
  const stretchById = new Map(catalogStretches(stretches).map((p) => [String(p.s.id), p]));
  const workoutFavIds: string[] = [];
  supabaseFavorites.forEach((f) => { if (f.item_type === 'workout') workoutFavIds.push(f.item_id); });
  favorites.forEach((f) => {
    if (f.type === 'workout' && !workoutFavIds.includes(String(f.id))) workoutFavIds.push(String(f.id));
  });
  const favWorkouts = workoutFavIds
    .map((id) => {
      const extra = extraById.get(id);
      if (extra) return { kind: 'extra' as const, extra, stretch: undefined };
      const stretch = stretchById.get(id);
      if (stretch) return { kind: 'stretch' as const, extra: undefined, stretch };
      return null;
    })
    .filter((w): w is NonNullable<typeof w> => w !== null);
  const resolvedWorkoutIds = new Set(favWorkouts.map((w) => String(w.kind === 'extra' ? w.extra!.e.id : w.stretch!.s.id)));

  // Meditations resolve against the live library and render with the same
  // row card as in Myseľ. Unmatched ones fall back to the generic row.
  const { meditations } = useMeditations();
  const meditationById = new Map(meditations.map((m) => [String(m.id), m]));
  const meditationFavIds: string[] = [];
  supabaseFavorites.forEach((f) => { if (f.item_type === 'meditation') meditationFavIds.push(f.item_id); });
  favorites.forEach((f) => {
    if (f.type === 'meditation' && !meditationFavIds.includes(String(f.id))) meditationFavIds.push(String(f.id));
  });
  const favMeditations = meditationFavIds
    .map((id) => meditationById.get(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const resolvedMeditationIds = new Set(favMeditations.map((m) => String(m.id)));

  const otherFavs = favorites.filter((f) =>
    f.type !== 'recipe'
    && !(f.type === 'workout' && resolvedWorkoutIds.has(String(f.id)))
    && !(f.type === 'meditation' && resolvedMeditationIds.has(String(f.id)))
  );

  const openFavExercise = (p: CatalogExercise) => {
    if (!p.isFree && !isPremium) { navigate('/paywall'); return; }
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

  const openFavStretch = (p: CatalogStretch) => {
    if (!p.isFree && !isPremium) { navigate('/paywall'); return; }
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

  const counts = {
    total: favRecipes.length + favWorkouts.length + favMeditations.length + otherFavs.length,
    recipe: favRecipes.length,
    workout: favWorkouts.length + otherFavs.filter((f) => f.type === 'workout').length,
    meditation: favMeditations.length + otherFavs.filter((f) => f.type === 'meditation').length,
    article: otherFavs.filter((f) => f.type === 'article').length,
    program: otherFavs.filter((f) => f.type === 'program').length,
  };

  const showRecipes = activeTab === 'all' || activeTab === 'recipe';
  const showWorkouts = activeTab === 'all' || activeTab === 'workout';
  const showMeditations = activeTab === 'all' || activeTab === 'meditation';
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
          {(showRecipes ? favRecipes.length : 0) + (showWorkouts ? favWorkouts.length : 0) + (showMeditations ? favMeditations.length : 0) + filteredOther.length === 0 ? (
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
            {/* Workouts — same row card as the Telo listings */}
            {showWorkouts && favWorkouts.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden', marginBottom: filteredOther.length > 0 ? 18 : 0 }}>
                {favWorkouts.map((w, i) => w.kind === 'extra'
                  ? (
                    <ExerciseListRow
                      key={w.extra!.e.id}
                      thumbUrl={w.extra!.e.thumb_url}
                      title={w.extra!.title}
                      titleParts={w.extra!.titleParts}
                      meta={`${w.extra!.e.duration_min} min · ${EQUIP_SHORT[w.extra!.equip]}`}
                      diastasisSafe={w.extra!.e.diastasis_safe}
                      locked={!w.extra!.isFree && !isPremium}
                      onOpen={() => openFavExercise(w.extra!)}
                      divider={i < favWorkouts.length - 1}
                    />
                  ) : (
                    <ExerciseListRow
                      key={w.stretch!.s.id}
                      thumbUrl={w.stretch!.s.thumb_url}
                      title={w.stretch!.title}
                      titleParts={w.stretch!.titleParts}
                      meta={`${w.stretch!.s.duration_min} min · ${EQUIP_SHORT[w.stretch!.equip]}`}
                      locked={!w.stretch!.isFree && !isPremium}
                      onOpen={() => openFavStretch(w.stretch!)}
                      divider={i < favWorkouts.length - 1}
                    />
                  )
                )}
              </div>
            )}
            {/* Meditations — same row card as in Myseľ */}
            {showMeditations && favMeditations.length > 0 && (
              <div style={{ marginBottom: filteredOther.length > 0 ? 18 : 0 }}>
                {favMeditations.map((m, i) => (
                  <MeditationListRow
                    key={m.id}
                    id={m.id}
                    eye={`${m.category} · ${Math.round(m.duration_sec / 60)} min`}
                    title={m.title}
                    duration={`${Math.round(m.duration_sec / 60)} min`}
                    category={m.category}
                    last={i === favMeditations.length - 1}
                    onClick={() => navigate(`/meditacia/${m.id}`)}
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
