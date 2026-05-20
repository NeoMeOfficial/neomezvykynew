import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NM } from '../../components/v2/neome';
import { useAchievements } from '../../hooks/useAchievements';
import { useMeditation } from '../../hooks/useMeditations';
import { useEntitlement } from '../../hooks/useEntitlement';

/**
 * Meditation player — real HTML5 audio backed by the `meditations` table.
 *
 * Resolves the meditation by slug from useMeditation(:meditationId).
 *
 * When meditation.audio_url is present: renders a real <audio> element,
 * binds play/pause/seek to standard transport, and drives the waveform
 * + time display from currentTime. When audio_url is null (audio file
 * not yet uploaded for this slug), falls back to the previous visual-
 * only stub with an inline "Audio dostupné čoskoro" notice so the page
 * still renders gracefully.
 *
 * Completion (via the Dokončiť meditáciu button) records an achievement
 * but no longer awards points — per product decision; points were
 * removable via free-tier replay farming.
 *
 * Mounted at /meditacia/:meditationId.
 */

const HEIGHTS = [20, 10, 28, 16, 32, 22, 14, 30, 18, 26, 12, 34, 20];

function fmtTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MeditationPlayer() {
  const navigate = useNavigate();
  const { meditationId } = useParams<{ meditationId: string }>();
  const { meditation, loading } = useMeditation(meditationId);
  const { addActivity } = useAchievements();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const completedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);

  // Entitlement: 2 unique meditations per rolling 7 days for free users.
  // logView fires after 10s of accumulated audio play (see useEffect below).
  const entitlement = useEntitlement('meditation', meditationId);
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

  // Reset transport when the meditation changes.
  useEffect(() => {
    setIsPlaying(false);
    setCurrentSec(0);
    if (meditation) setDurationSec(meditation.duration_sec);
  }, [meditation?.id]);

  // Wire audio events when the element + url exist.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      const t = audio.currentTime;
      setCurrentSec(t);
      // Accumulate play time, skipping large jumps that indicate scrubbing.
      const delta = t - lastTimeRef.current;
      if (delta > 0 && delta < 1.5) {
        playedSecRef.current += delta;
        if (playedSecRef.current >= 10 && !viewLoggedRef.current) {
          viewLoggedRef.current = true;
          entitlement.logView();
        }
      }
      lastTimeRef.current = t;
    };
    const onMeta = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setDurationSec(audio.duration);
      }
    };
    const onEnd = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, [meditation?.audio_url]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Audio play failed:', err);
      });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const seekRelative = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || durationSec, audio.currentTime + delta));
  };

  function handleComplete() {
    if (!completedRef.current) {
      completedRef.current = true;
      addActivity('meditation_complete', { ref_id: meditationId, ref_type: 'meditation' });
    }
    navigate(-1);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: NM.DEEP_2, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NM.SANS }}>
        <div>Načítavam meditáciu…</div>
      </div>
    );
  }

  if (!meditation) {
    return (
      <div style={{ minHeight: '100vh', background: NM.DEEP_2, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: NM.SANS, padding: '0 32px', textAlign: 'center' }}>
        <div>Meditácia sa nenašla.</div>
        <button
          onClick={() => navigate(-1)}
          style={{ all: 'unset', cursor: 'pointer', padding: '10px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.20)' }}
        >
          Späť
        </button>
      </div>
    );
  }

  const hasAudio = !!meditation.audio_url;
  const remaining = Math.max(0, durationSec - currentSec);
  const playedRatio = durationSec > 0 ? currentSec / durationSec : 0;
  const totalBars = 48;
  const playedBars = Math.floor(totalBars * playedRatio);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(160deg, ${NM.DEEP_2} 0%, #4A3327 40%, #3E2820 100%)`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: NM.SANS,
      }}
    >
      {hasAudio && (
        <audio ref={audioRef} src={meditation.audio_url!} preload="metadata" />
      )}

      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 280,
          height: 280,
          borderRadius: 999,
          background: 'radial-gradient(circle, rgba(216,180,145,0.35) 0%, rgba(216,180,145,0.15) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 180,
          height: 180,
          borderRadius: 999,
          background: 'radial-gradient(circle, rgba(193,133,106,0.45) 0%, rgba(193,133,106,0.1) 60%, transparent 80%)',
          filter: 'blur(15px)',
        }}
      />

      <div style={{ position: 'relative', padding: 'calc(env(safe-area-inset-top) + 14px) 18px 16px', display: 'flex', alignItems: 'center', zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Zavrieť"
          style={{
            all: 'unset',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.12)',
            width: 36,
            height: 36,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 10l4-4 4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ flex: 1 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', minHeight: 'calc(100vh - 100px)', padding: '0 28px 32px', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          {meditation.eyebrow && (
            <div style={{ fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 18 }}>
              {meditation.eyebrow}
            </div>
          )}
          <div style={{ fontFamily: NM.SERIF, fontSize: 42, fontWeight: 400, color: '#fff', letterSpacing: '-0.015em', lineHeight: 1.05, marginBottom: 16 }}>
            {meditation.title}
          </div>
          {meditation.subtitle && (
            <div style={{ fontFamily: NM.SANS, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>
              {meditation.subtitle}
            </div>
          )}
        </div>

        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center', height: 40, marginBottom: 14 }}>
          {Array.from({ length: totalBars }).map((_, i) => {
            const h = HEIGHTS[i % HEIGHTS.length];
            const played = i < playedBars;
            return (
              <div key={i} style={{ flex: 1, height: h, background: played ? '#fff' : 'rgba(255,255,255,0.25)', borderRadius: 999, maxWidth: 3 }} />
            );
          })}
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums', marginBottom: 28 }}>
          <span>{fmtTime(currentSec)}</span>
          <span>−{fmtTime(remaining)}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, marginBottom: 22 }}>
          <button
            aria-label="O 15 sekúnd späť"
            onClick={() => seekRelative(-15)}
            disabled={!hasAudio}
            style={{ all: 'unset', cursor: hasAudio ? 'pointer' : 'not-allowed', border: '1px solid rgba(255,255,255,0.35)', padding: '10px 14px', borderRadius: 999, color: '#fff', fontFamily: NM.SANS, fontSize: 12, opacity: hasAudio ? 1 : 0.4 }}
          >
            −15s
          </button>
          <button
            aria-label={isPlaying ? 'Pauza' : 'Prehrať'}
            onClick={handlePlayPause}
            disabled={!hasAudio}
            style={{ all: 'unset', cursor: hasAudio ? 'pointer' : 'not-allowed', background: '#fff', width: 72, height: 72, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hasAudio ? 1 : 0.5 }}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="6" y="4" width="3" height="14" rx="1" fill={NM.DEEP} />
                <rect x="13" y="4" width="3" height="14" rx="1" fill={NM.DEEP} />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M7 4l11 7-11 7V4z" fill={NM.DEEP} />
              </svg>
            )}
          </button>
          <button
            aria-label="O 15 sekúnd dopredu"
            onClick={() => seekRelative(15)}
            disabled={!hasAudio}
            style={{ all: 'unset', cursor: hasAudio ? 'pointer' : 'not-allowed', border: '1px solid rgba(255,255,255,0.35)', padding: '10px 14px', borderRadius: 999, color: '#fff', fontFamily: NM.SANS, fontSize: 12, opacity: hasAudio ? 1 : 0.4 }}
          >
            +15s
          </button>
        </div>

        {!hasAudio && (
          <div style={{ marginBottom: 18, padding: '10px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 14, fontFamily: NM.SANS, fontSize: 12, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
            Audio nahrávka pre túto meditáciu sa pripravuje.
          </div>
        )}

        {/* Complete button */}
        <button
          onClick={handleComplete}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            padding: '15px 0',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.20)',
            borderRadius: 999,
            textAlign: 'center',
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '0.02em',
            marginBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
            boxSizing: 'border-box',
          }}
        >
          Dokončiť meditáciu
        </button>
      </div>
    </div>
  );
}
