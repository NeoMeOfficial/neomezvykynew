import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { Share2, Heart } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { exercises } from '../../data/exercises';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import FavoriteLinksBlock from '../../components/v2/favorites/FavoriteLinksBlock';
import { useEntitlement } from '../../hooks/useEntitlement';
import { useSmartBack } from '../../hooks/useSmartBack';
import { useExercises } from '../../hooks/useExercises';
import { useStretches } from '../../hooks/useStretches';
import { useUniversalFavorites } from '../../hooks/useUniversalFavorites';
import { useProgramAccess } from '../../hooks/useProgramAccess';
import { useActiveProgram } from '../../hooks/useDailyRituals';
import { catalogExercises, catalogStretches, CatalogExercise, CatalogStretch } from '../../features/telo/libraryCatalog';
import { EQUIP_LABEL, EQUIP_SHORT, FOCUS_LABEL, STRETCH_FOCUS_LABEL, parseFocus, parseStretchFocus } from '../../features/telo/exerciseTaxonomy';

// Library row prepared for the suggestion / favorites lists below the
// video — carries the ready-made route + location.state for this player.
interface SuggestionRow {
  id: string;
  title: string;
  titleParts: { before: string; em: string; num: string } | null;
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
    titleParts: c.titleParts,
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
    titleParts: c.titleParts,
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
  const isBunny = !!exercise.videoUrl && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(exercise.videoUrl);

  // Library rows for the suggestion + favorites sections under the video.
  const { exercises: dbExercises } = useExercises();
  const { stretches: dbStretches } = useStretches();
  const { favorites, isFavorite, toggleFavorite } = useUniversalFavorites();
  const isStretchView = exercise.category === 'stretch';

  const exRows = useMemo(
    () => catalogExercises(dbExercises).filter((c) => c.focus !== null).map(exerciseRow),
    [dbExercises],
  );
  const stRows = useMemo(
    () => catalogStretches(dbStretches).filter((c) => c.focus !== null).map(stretchRow),
    [dbStretches],
  );

  // 3 more of the same kind, current one excluded — DIVERSE focuses first
  // (Gabi 2026-07-26): if today's featured pick doesn't suit her, the
  // alternatives should cover the other body areas, not more of the same.
  // Round-robin across focus groups, current focus queued last.
  const suggestions = useMemo(() => {
    const pool = isStretchView ? stRows : exRows;
    const currentFocus = isStretchView ? parseStretchFocus(exercise.body) : parseFocus(exercise.body);
    const rest = pool.filter((r) => r.id !== exercise.id);

    const byFocus = new Map<string, SuggestionRow[]>();
    for (const r of rest) {
      const k = r.focus ?? 'other';
      if (!byFocus.has(k)) byFocus.set(k, []);
      byFocus.get(k)!.push(r);
    }
    const focusOrder = [...byFocus.keys()].sort(
      (a, b) => Number(a === currentFocus) - Number(b === currentFocus),
    );

    const result: SuggestionRow[] = [];
    let round = 0;
    while (result.length < 3 && result.length < rest.length) {
      let added = false;
      for (const k of focusOrder) {
        const q = byFocus.get(k)!;
        if (round < q.length) {
          result.push(q[round]);
          added = true;
          if (result.length === 3) break;
        }
      }
      if (!added) break;
      round += 1;
    }
    return result;
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

  // A scheduled program exercise plays for anyone with access to the
  // active program — subscribers AND single-program grantees, who are
  // otherwise free-tier and would hit the library quota.
  const { program: activeProg } = useActiveProgram();
  const { hasProgram: hasProgAccess } = useProgramAccess();
  const programAllowed = !!location.state?.fromProgram && !!activeProg && hasProgAccess(activeProg.program_id);
  const allowed = entitlement.allowed || programAllowed;

  const vimeoMountRef = useRef<HTMLDivElement | null>(null);
  const playedSecRef = useRef(0);
  const lastTimeRef = useRef(0);
  const viewLoggedRef = useRef(false);

  // Quota exhausted → redirect before render.
  useEffect(() => {
    if (entitlement.loading) return;
    if (!allowed) {
      navigate('/paywall', { replace: true });
    }
  }, [entitlement.loading, allowed, navigate]);

  // Vimeo SDK player — gives real playback + the timeupdate events we
  // need to measure 10s of accumulated play for the entitlement log.
  useEffect(() => {
    if (!isVimeo || !vimeoMountRef.current) return;
    if (entitlement.loading || !allowed) return;

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

    // Finishing the video is the workout completion — the celebration
    // screen logs history and asks the server for the +10 award. Only
    // Vimeo gets this (the YouTube iframe exposes no ended event);
    // replace:true so Späť from the celebration skips the dead player.
    const onEnded = () => {
      navigate('/completion/workout', {
        replace: true,
        state: {
          exerciseId: exercise.id,
          title: exercise.name,
          type: contentType,
          duration: Math.round(playedSecRef.current / 60) || undefined,
          program: location.state?.fromProgram ? activeProg?.program_id : undefined,
        },
      });
    };

    player.on('timeupdate', onTimeUpdate);
    player.on('ended', onEnded);
    return () => {
      player.off('timeupdate', onTimeUpdate);
      player.off('ended', onEnded);
      player.destroy().catch(() => { /* element already gone */ });
    };
  }, [isVimeo, exercise.videoUrl, entitlement.loading, entitlement.allowed]);

  // ── Bunny Stream (signed playback, Sam 2026-10-05) ──────────
  // The embed URL comes from video-token (authenticated, 4h expiry) so
  // raw GUIDs in the DB are unplayable. The Bunny player speaks the
  // player.js protocol over postMessage: we subscribe to timeupdate
  // (for the 10s view log) and ended (completion → +10 chain).
  const [bunnyEmbed, setBunnyEmbed] = useState<string | null>(null);
  const bunnyFrameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!isBunny || entitlement.loading || !allowed) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const res = await fetch('/.netlify/functions/video-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ videoId: exercise.videoUrl }),
        });
        if (!res.ok) {
          // Server-side paywall (402) — the client gate normally redirects
          // first, so this only hits on an edge/stale state. Send to paywall
          // rather than hang on "Pripravujem video…".
          if (res.status === 402 && !cancelled) navigate('/paywall', { replace: true });
          return;
        }
        const body = await res.json();
        if (!cancelled) setBunnyEmbed(body.embedUrl);
      } catch { /* player shows the fallback note */ }
    })();
    return () => { cancelled = true; };
  }, [isBunny, exercise.videoUrl, entitlement.loading, allowed]);

  useEffect(() => {
    if (!isBunny || !bunnyEmbed) return;

    const subscribe = () => {
      const w = bunnyFrameRef.current?.contentWindow;
      if (!w) return;
      for (const ev of ['timeupdate', 'ended']) {
        w.postMessage(JSON.stringify({ context: 'player.js', version: '0.0.11', method: 'addEventListener', value: ev }), '*');
      }
    };

    const onMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'string') return;
      let msg: any;
      try { msg = JSON.parse(e.data); } catch { return; }
      if (msg?.context !== 'player.js') return;
      if (msg.event === 'ready') subscribe();
      if (msg.event === 'timeupdate') {
        const seconds = msg.value?.seconds ?? 0;
        const delta = seconds - lastTimeRef.current;
        if (delta > 0 && delta < 1.5) {
          playedSecRef.current += delta;
          if (playedSecRef.current >= 10 && !viewLoggedRef.current) {
            viewLoggedRef.current = true;
            entitlement.logView();
          }
        }
        lastTimeRef.current = seconds;
      }
      if (msg.event === 'ended') {
        navigate('/completion/workout', {
          replace: true,
          state: {
            exerciseId: exercise.id,
            title: exercise.name,
            type: contentType,
            duration: Math.round(playedSecRef.current / 60) || undefined,
            program: location.state?.fromProgram ? activeProg?.program_id : undefined,
          },
        });
      }
    };

    window.addEventListener('message', onMessage);
    const t = setTimeout(subscribe, 1200); // belt & braces if 'ready' already fired
    return () => { window.removeEventListener('message', onMessage); clearTimeout(t); };
  }, [isBunny, bunnyEmbed, entitlement, navigate, contentType, activeProg?.program_id]);

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

  // Pops history (returns exactly where she entered the player from —
  // in-player video switches use replace, so they don't add steps);
  // the computed path is only the cold-deep-link fallback.
  const backFallback = location.state?.fromRecommendation
    ? '/domov'
    : exercise.category === 'stretch'
      ? '/kniznica/telo/strecing'
      : '/kniznica/telo/extra';
  const smartBack = useSmartBack(backFallback);

  // Manual completion — the same chain as the auto `ended` event. Needed
  // for YouTube (whose iframe exposes no ended event) and for anyone who
  // finishes early; without it those sessions log nothing.
  const markComplete = useCallback(() => {
    navigate('/completion/workout', {
      replace: true,
      state: {
        exerciseId: exercise.id,
        title: exercise.name,
        type: contentType,
        duration: Math.round(playedSecRef.current / 60) || undefined,
        program: location.state?.fromProgram ? activeProg?.program_id : undefined,
      },
    });
  }, [navigate, exercise.id, exercise.name, contentType, location.state?.fromProgram, activeProg?.program_id]);

  // While entitlement resolves, or if quota is exhausted (redirect in
  // flight), render nothing — avoids a flash of paid content.
  if (entitlement.loading || !allowed) return null;

  return (
    <div className="min-h-screen bg-cream pb-32">
      <TopBar
        title="Telo"
        onBack={smartBack}
        right={
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="h-10 w-10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
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
            {isBunny ? (
              bunnyEmbed ? (
                <iframe
                  ref={bunnyFrameRef}
                  src={bunnyEmbed}
                  title={exercise.name}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/70 font-sans text-sm">Pripravujem video…</div>
              )
            ) : isVimeo ? (
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

        {/* Manual completion — the auto `ended` event covers Vimeo/Bunny,
            but YouTube exposes none and nobody always watches to the end.
            This guarantees the session can be logged. */}
        <button
          onClick={markComplete}
          className="w-full rounded-full bg-terra text-white font-sans text-sm font-medium py-3.5 active:opacity-80"
        >
          Označiť ako dokončené
        </button>

        {/* Exercise name — the top bar now carries the section label */}
        <h1 className="font-serif text-[21px] text-ink leading-snug">{exercise.name}</h1>

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

        {/* Cycle-recommendation box removed (Sam 2026-10-13): first we test
            that the app reads the cycle correctly; the explicit per-exercise
            phase recommendation copy comes in a later stage. The phasePick
            state still arrives — revert this block to show it again. */}

        {/* 'Ďalšie cvičenia' suggestions removed (Sam 2026-10-05:
            no distractions under the video). Revert if Gabi misses her
            2026-07-26 diverse-focus alternatives. */}

        {/* Unified links (Pridať do obľúbených is the sticky dark CTA below,
            same as Strava) */}
        <FavoriteLinksBlock
          item={{ id: exercise.id, type: 'workout', title: exercise.name, duration: exercise.duration, category: exercise.category }}
          favTab="workout"
          allLabel="Všetky cvičenia"
          allPath="/kniznica/telo"
          color="#6B4C3B"
          showFavToggle={false}
        />
      </div>

      {/* Sticky "Pridať do obľúbených" — same dark CTA as the recipe page */}
      <div
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0,
          padding: '16px 18px calc(env(safe-area-inset-bottom) + 16px)',
          background: 'rgba(248,245,240,0.95)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(61,41,33,0.10)', zIndex: 50,
        }}
      >
        <button
          onClick={() => toggleFavorite({ id: exercise.id, type: 'workout', title: exercise.name, duration: exercise.duration, category: exercise.category })}
          style={{
            all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            padding: '16px 20px', borderRadius: 999,
            background: isFavorite(exercise.id, 'workout') ? '#6B4C3B' : '#2E2218', color: '#fff',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite(exercise.id, 'workout') ? '#fff' : 'none'} stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {isFavorite(exercise.id, 'workout') ? 'V obľúbených' : 'Pridať do obľúbených'}
        </button>
      </div>
    </div>
  );
}
