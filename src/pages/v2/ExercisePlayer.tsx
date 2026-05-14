import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Share2 } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { exercises } from '../../data/exercises';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import { useSubscription } from '../../contexts/SubscriptionContext';

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
  const { isPremium, isLoading: subLoading } = useSubscription();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  let exercise = location.state?.exercise;
  if (!exercise) {
    const routePath = location.pathname;
    exercise = exercises.find(e => e.route === routePath || routePath.includes(e.id));
  }
  if (!exercise) exercise = exercises[0];

  // Subscription gate: free users can only access exercises explicitly
  // marked `free: true` (curated preview set). Everything else routes to
  // /paywall. Waits for the subscription load so paid users don't flash.
  const isLocked = !exercise.free && !isPremium;
  useEffect(() => {
    if (!subLoading && isLocked) {
      navigate('/paywall', { replace: true });
    }
  }, [subLoading, isLocked, navigate]);
  if (isLocked) return null;

  const isVimeo = !!exercise.videoUrl && /^\d+$/.test(exercise.videoUrl);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setIsPlaying(false); return 100; }
          return prev + 1;
        });
      }, 100);
    }
  };

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

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar
        title={exercise.name}
        onBack={() => navigate(getBackPath())}
        right={
          <div className="flex items-center gap-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium tracking-[0.12em] uppercase ${
                exercise.free
                  ? 'bg-pillar-strava/[0.12] text-pillar-strava'
                  : 'bg-gold/[0.12] text-gold'
              }`}
              title={exercise.free ? 'Voľne dostupné' : 'Súčasť NeoMe Plus'}
            >
              {exercise.free ? 'Free' : 'Plus'}
            </span>
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
            {exercise.videoUrl ? (
              <iframe
                src={
                  isVimeo
                    ? `https://player.vimeo.com/video/${exercise.videoUrl}?badge=0&autopause=0&player_id=0&app_id=58479`
                    : `https://www.youtube.com/embed/${exercise.videoUrl}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&showinfo=0`
                }
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
                  <button
                    onClick={handlePlayPause}
                    className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center active:scale-95 transition-transform shadow-nm"
                  >
                    {isPlaying
                      ? <Pause className="size-7 text-terra" />
                      : <Play className="size-7 ml-1 text-terra" fill="currentColor" strokeWidth={0} />
                    }
                  </button>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <div className="absolute top-3 right-3 bg-ink/60 text-white text-[11px] px-2 py-1 rounded-full">
                  {exercise.duration}
                </div>
              </>
            )}
          </div>

          {/* Restart control — fallback only */}
          {!exercise.videoUrl && (
            <div className="px-4 py-3 flex items-center justify-between bg-white border-t border-ink/[0.08]">
              <button
                onClick={() => { setProgress(0); setIsPlaying(false); }}
                className="flex items-center gap-2 text-ink/60 font-sans text-sm"
              >
                <RotateCcw className="size-4" />
                Reštart
              </button>
              <span className="font-sans text-xs text-ink/40">{Math.round(progress)}% dokončené</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans text-[11px] px-2.5 py-1 rounded-full bg-terra/[0.10] text-terra font-medium">
            {exercise.body}
          </span>
          <span className="font-sans text-[11px] px-2.5 py-1 rounded-full bg-gold/[0.10] text-gold font-medium">
            {exercise.equip}
          </span>
          <span className={`font-sans text-[11px] px-2.5 py-1 rounded-full font-medium ${INTENSITY_CLASS[exercise.intensity] || 'bg-ink/[0.06] text-ink/60'}`}>
            {INTENSITY_LABEL[exercise.intensity] || exercise.intensity}
          </span>
        </div>

        {/* Description */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <Eyebrow className="mb-2">O cvičení</Eyebrow>
          <BodyText tone="secondary">
            {exercise.category === 'stretch'
              ? 'Jemný strečing pre uvoľnenie napätia a zlepšenie flexibility. Ideálny pre dni, keď potrebuješ zmierniť stres a upokojiť myseľ.'
              : 'Posilňovacie cvičenie pre budovanie sily a vytrvalosti. Skvelé pre dni s vyššou energiou, keď sa cítiš pripravená na výzvy.'
            }
          </BodyText>
        </div>

        {/* Cycle recommendation */}
        {location.state?.fromRecommendation && (
          <div className="rounded-card bg-mauve/[0.08] border border-mauve/20 p-4">
            <BodyText size="sm" className="text-mauve font-medium">
              Toto cvičenie bolo odporúčané na základe aktuálnej fázy tvojho cyklu.
            </BodyText>
          </div>
        )}
      </div>
    </div>
  );
}
