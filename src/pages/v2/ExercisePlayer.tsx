import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import Player from '@vimeo/player';
import { Share2, Heart } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { exercises } from '../../data/exercises';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import { useEntitlement } from '../../hooks/useEntitlement';
import { useExercises } from '../../hooks/useExercises';
import { useStretches } from '../../hooks/useStretches';
import { useUniversalFavorites } from '../../hooks/useUniversalFavorites';
import { catalogExercises, catalogStretches, CatalogExercise, CatalogStretch } from '../../features/telo/libraryCatalog';
import { EQUIP_LABEL, EQUIP_SHORT, FOCUS_LABEL, STRETCH_FOCUS_LABEL, parseFocus, parseStretchFocus } from '../../features/telo/exerciseTaxonomy';

// Library row prepared for the suggestion / favorites lists below the
// video — carries the ready-made route + location.state for this player.
interface SuggestionRow {
  id: string;
  title: string;
  meta: string;
  thumb: string | null;
  focus: string | null;
  route: string;
  state: { exercise: Record<string, unknown> };
}

function exerciseRow(c: CatalogExercise): SuggestionRow {
  return {
    id: c.e.id,
    title: c.title,
    meta: `${c.e.duration_min} min · ${EQUIP_SHORT[c.equip]}`,
    thumb: c.e.thumb_url,
    focus: c.focus,
    route: `/exercise/extra/${c.e.id}`,
    state: {
      exercise: {
        id: c.e.id,
        name: c.title,
        duration: `${c.e.duration_min} min`,
        category: c.band === '5' ? 'dopalovacka' : '15min',
        body: c.focus ? FOCUS_LABEL[c.focus] : c.e.body_target,
        equip: EQUIP_LABEL[c.equip],
        videoUrl: c.e.video_id,
        thumb: c.e.thumb_url,
        description: c.e.description,
        diastasisSafe: c.e.diastasis_safe,
      },
    },
  };
}

function stretchRow(c: CatalogStretch): SuggestionRow {
  return {
    id: c.s.id,
    title: c.title,
    meta: `${c.s.duration_min} min · ${EQUIP_SHORT[c.equip]}`,
    thumb: c.s.thumb_url,
    focus: c.focus,
    route: `/stretch/${c.s.id}`,
    state: {
      exercise: {
        id: c.s.id,
        name: c.title,
        duration: `${c.s.duration_min} min`,
        category: 'stretch',
        body: c.focus ? STRETCH_FOCUS_LABEL[c.focus] : c.s.body_target,
        equip: EQUIP_LABEL[c.equip],
        videoUrl: c.s.video_id,
        thumb: c.s.thumb_url,
        description: c.s.description,
      },
    },
  };
}

const INTENSITY_LABEL: Record<string, string> = {
  low: 'Nízka intenzita',
  medium: 'Stredná intenzita',
  high: 'Vysoká intenzita',
};

const INTENSITY_CLASS: Record<string, string> = {
  low: 'bg-pillar-strava/[0.10] text-pillar-strava',
  medium: 'bg-gold/[0.10] text-gold',
  high: 'bg-terra/[0.10] text-terra',
};

export default function ExercisePlayer() {
  const navigate = useNavigate();
  const location = useLocation();

  let exercise = location.state?.exercise;
  if (!exercise) {
    const routePath = location.pathname;
    exercise = exercises.find(e => e.route === routePath || routePath.includes(e.id));
  }
  if (!exercise) exercise = exercises[0];

  const isVimeo = !!exercise.videoUrl && /^\d+$/.test(exercise.videoUrl);

  // Library rows for the suggestion + favorites sections under the video.
  const { exercises: dbExercises } = useExercises();
  const { stretches: dbStretches } = useStretches();
  const { favorites } = useUniversalFavorites();
  const isStretchView = exercise.category === 'stretch';

  const exRows = useMemo(
    () => catalogExercises(dbExercises).filter((c) => c.focus !== null).map(exerciseRow),
    [dbExercises],
  );
  const stRows = useMemo(
    () => catalogStretches(dbStretches).filter((c) => c.focus !== null).map(stretchRow),
    [dbStretches],
  );

  // 3 more of the same kind — same focus first, current one excluded.
  const suggestions = useMemo(() => {
    const pool = isStretchView ? stRows : exRows;
    const currentFocus = isStretchView ? parseStretchFocus(exercise.body) : parseFocus(exercise.body);
    const rest = pool.filter((r) => r.id !== exercise.id);
    return [
      ...rest.filter((r) => r.focus === currentFocus),
      ...rest.filter((r) => r.focus !== currentFocus),
    ].slice(0, 3);
  }, [exRows, stRows, isStretchView, exercise.id, exercise.body]);

  // Hearted workouts resolved against the library (skips ids that aren't
  // library videos, e.g. program exercises).
  const allRows = useMemo(() => [...exRows, ...stRows], [exRows, stRows]);
  const favoriteRows = favorites
    .filter((f) => f.type === 'workout')
    .map((f) => allRows.find((r) => r.id === String(f.id)))
    .filter((r): r is SuggestionRow => !!r && r.id !== exercise.id)
    .slice(0, 4);

  // Jumping between videos keeps the same mounted component — snap back up.
  useEffect(() => { window.scrollTo(0, 0); }, [exercise.id]);

  // Entitlement: stretches and exercises are separate quota buckets
  // (2 unique each per rolling 7 days). logView fires after 10s of
  // accumulated Vimeo playback — see the player effect below.
  const contentType = exercise.category === 'stretch' ? 'stretch' : 'exercise';
  const entitlement = useEntitlement(contentType, exercise.id);

  const vimeoMountRef = useRef<HTMLDivElement | null>(null);
  const playedSecRef = useRef(0);
  const lastTimeRef = useRef(0);
  const viewLoggedRef = useRef(false);

  // Quota exhausted → redirect before render.
  useEffect(() => {
    if (entitlement.loading) return;
    if (!entitlement.allowed) {
      navigate('/paywall', { replace: true });
    }
  }, [entitlement.loading, entitlement.allowed, navigate]);

  // Vimeo SDK player — gives real playback + the timeupdate events we
  // need to measure 10s of accumulated play for the entitlement log.
  useEffect(() => {
    if (!isVimeo || !vimeoMountRef.current) return;
    if (entitlement.loading || !entitlement.allowed) return;

    const player = new Player(vimeoMountRef.current, {
      id: Number(exercise.videoUrl),
      responsive: true,
    });

    const onTimeUpdate = (data: { seconds: number }) => {
      const delta = data.seconds - lastTimeRef.current;
      // Skip large jumps (user scrubbed); count only natural playback.
      if (delta > 0 && delta < 1.5) {
        playedSecRef.current += delta;
        if (playedSecRef.current >= 10 && !viewLoggedRef.current) {
          viewLoggedRef.current = true;
          entitlement.logView();
        }
      }
      lastTimeRef.current = data.seconds;
    };

    player.on('timeupdate', onTimeUpdate);
    return () => {
      player.off('timeupdate', onTimeUpdate);
      player.destroy().catch(() => { /* element already gone */ });
    };
  }, [isVimeo, exercise.videoUrl, entitlement.loading, entitlement.allowed]);

  const handleShare = async () => {
    const videoUrl = exercise.videoUrl
      ? (isVimeo ? `https://vimeo.com/${exercise.videoUrl}` : `https://youtu.be/${exercise.videoUrl}`)
      : window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: exercise.name, text: `${exercise.name} – NeoMe`, url: videoUrl }); }
      catch { /* dismissed */ }
    } else {
      try { await navigator.clipboard.writeText(videoUrl); }
      catch { window.open(videoUrl, '_blank'); }
    }
  };

  const getBackPath = (): string => {
    if (location.state?.fromRecommendation) return '/domov';
    if (exercise.category === 'stretch') return '/kniznica/telo/strecing';
    return '/kniznica/telo/extra';
  };

  // While entitlement resolves, or if quota is exhausted (redirect in
  // flight), render nothing — avoids a flash of paid content.
  if (entitlement.loading || !entitlement.allowed) return null;

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar
        title={exercise.name}
        onBack={() => navigate(getBackPath())}
        right={
          <div className="flex items-center gap-1">
            <FavoriteButton
              itemId={exercise.id}
              type="workout"
              title={exercise.name}
              duration={exercise.duration}
              category={exercise.category}
              size="md"
            />
            <button
              onClick={handleShare}
              className="h-9 w-9 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <Share2 className="size-4 text-ink/50" />
            </button>
          </div>
        }
      />

      <div className="px-5 pt-2 flex flex-col gap-4">
        {/* Video */}
        <div className="rounded-card bg-black overflow-hidden">
          <div className="relative aspect-video">
            {isVimeo ? (
              <div ref={vimeoMountRef} className="w-full h-full" />
            ) : exercise.videoUrl ? (
              <iframe
                src={`https://www.youtube.com/embed/${exercise.videoUrl}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&showinfo=0`}
                title={exercise.name}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <>
                <img src={exercise.thumb} alt={exercise.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
                  <span className="font-sans text-sm text-white/80">Video čoskoro</span>
                </div>
                <div className="absolute top-3 right-3 bg-ink/60 text-white text-[11px] px-2 py-1 rounded-full">
                  {exercise.duration}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans text-[11px] px-2.5 py-1 rounded-full bg-terra/[0.10] text-terra font-medium">
            {exercise.body}
          </span>
          <span className="font-sans text-[11px] px-2.5 py-1 rounded-full bg-gold/[0.10] text-gold font-medium">
            {exercise.equip}
          </span>
          {exercise.intensity && (
            <span className={`font-sans text-[11px] px-2.5 py-1 rounded-full font-medium ${INTENSITY_CLASS[exercise.intensity] || 'bg-ink/[0.06] text-ink/60'}`}>
              {INTENSITY_LABEL[exercise.intensity] || exercise.intensity}
            </span>
          )}
          {exercise.diastasisSafe && (
            <span className="font-sans text-[11px] px-2.5 py-1 rounded-full font-medium bg-pillar-strava/[0.12] text-pillar-strava-700">
              ✓ Bezpečné pri diastáze
            </span>
          )}
        </div>

        {/* Per-video description from the admin — differentiates videos even
            while they all still show the placeholder thumb. */}
        {exercise.description && (
          <BodyText size="sm" tone="secondary">{exercise.description}</BodyText>
        )}

        {/* Cycle recommendation */}
        {location.state?.fromRecommendation && (
          <div className="rounded-card bg-mauve/[0.08] border border-mauve/20 p-4">
            <BodyText size="sm" className="text-mauve font-medium">
              Toto cvičenie bolo odporúčané na základe aktuálnej fázy tvojho cyklu.
            </BodyText>
          </div>
        )}

        {/* Next up — replaces the old generic 'O cvičení' text (Gabi 2026-07-25) */}
        {suggestions.length > 0 && (
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-4">
            <Eyebrow className="mb-2">{exercise.category === 'stretch' ? 'Ďalšie strečingy' : 'Ďalšie tréningy'}</Eyebrow>
            {suggestions.map((row) => (
              <button
                key={row.id}
                onClick={() => navigate(row.route, { state: row.state })}
                className="w-full flex items-center gap-3 py-2.5 text-left border-b border-ink/[0.06] last:border-0"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-cover bg-center flex-shrink-0 bg-ink/[0.06]"
                  style={row.thumb ? { backgroundImage: `url(${row.thumb})` } : undefined}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[14px] text-ink truncate">{row.title}</div>
                  <div className="font-sans text-[11px] text-ink/50 mt-0.5">{row.meta}</div>
                </div>
                <span className="text-ink/30 text-sm">›</span>
              </button>
            ))}
          </div>
        )}

        {/* Her hearted workouts — the top-bar heart saves them here */}
        {favoriteRows.length > 0 && (
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="size-3.5 text-pillar-cyklus" fill="currentColor" />
              <Eyebrow>Tvoje obľúbené</Eyebrow>
            </div>
            {favoriteRows.map((row) => (
              <button
                key={row.id}
                onClick={() => navigate(row.route, { state: row.state })}
                className="w-full flex items-center gap-3 py-2.5 text-left border-b border-ink/[0.06] last:border-0"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-cover bg-center flex-shrink-0 bg-ink/[0.06]"
                  style={row.thumb ? { backgroundImage: `url(${row.thumb})` } : undefined}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[14px] text-ink truncate">{row.title}</div>
                  <div className="font-sans text-[11px] text-ink/50 mt-0.5">{row.meta}</div>
                </div>
                <span className="text-ink/30 text-sm">›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
