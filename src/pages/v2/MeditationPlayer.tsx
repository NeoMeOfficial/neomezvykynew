import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NM } from '../../components/v2/neome';

/**
 * Meditation player — R3 ambient
 *
 * Dark warm gradient with two soft orbs, serif title centered, fake
 * waveform with progress, time labels, transport controls, ambient
 * sound toggle row.
 *
 * FEATURE-NEEDED-MYSEL-AUDIO-PLAYER: real audio playback. The design
 * shows transport (play/skip/±15s) and a live waveform; the live app
 * has SecureVideoService but no audio-meditation pipeline. Build:
 *   - Storage bucket for meditation audio (signed URLs)
 *   - <audio> element + useState for playing/time
 *   - Update waveform via animationframe based on currentTime
 *   - Persist 'last position' per meditation in user_progress table
 * Currently the controls are static affordances.
 *
 * FEATURE-NEEDED-MYSEL-AMBIENT-MIX: ambient-sound layering (rain,
 * ocean, etc.) on top of the guided audio. Needs a separate buffer
 * per ambient track + volume mix UI.
 *
 * Old version: MeditationPlayer.old.tsx.
 */

const MEDITATIONS: Record<string, { title: string; eyebrow: string; subtitle: string; durationSec: number }> = {
  'rann-pokoj': {
    title: 'Ticho pred dňom',
    eyebrow: 'Ranná meditácia',
    subtitle: '10-minútové ranné stíšenie s Gabi. Zamestnaj dych, nechaj myseľ spomaliť.',
    durationSec: 600,
  },
  upokojenie: {
    title: 'Upokojenie úzkosti',
    eyebrow: 'Emócie',
    subtitle: '12 minút na uzemnenie keď cítiš nepokoj. Postupné uvedomenie tela a dychu.',
    durationSec: 720,
  },
  spanok: {
    title: 'Dych pre spánok',
    eyebrow: 'Večer',
    subtitle: '15 minút pomalého dychu pre prechod do spánku.',
    durationSec: 900,
  },
  prijatie: {
    title: 'Prijatie tela',
    eyebrow: 'Telo',
    subtitle: '8 minút body-scan praxe.',
    durationSec: 480,
  },
};

const HEIGHTS = [20, 10, 28, 16, 32, 22, 14, 30, 18, 26, 12, 34, 20];

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MeditationPlayer() {
  const navigate = useNavigate();
  const { meditationId } = useParams<{ meditationId: string }>();
  const m = (meditationId && MEDITATIONS[meditationId]) || MEDITATIONS['rann-pokoj'];

  // FEATURE-NEEDED-MYSEL-AUDIO-PLAYER — currently fake state for visual only
  const [playedSec] = useState(222); // 3:42 — matches design
  const remaining = m.durationSec - playedSec;
  const playedRatio = playedSec / m.durationSec;
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
          <div style={{ fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 18 }}>
            {m.eyebrow}
          </div>
          <div style={{ fontFamily: NM.SERIF, fontSize: 42, fontWeight: 400, color: '#fff', letterSpacing: '-0.015em', lineHeight: 1.05, marginBottom: 16 }}>
            {m.title}
          </div>
          <div style={{ fontFamily: NM.SANS, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>
            {m.subtitle}
          </div>
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
          <span>{fmtTime(playedSec)}</span>
          <span>−{fmtTime(remaining)}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, marginBottom: 22 }}>
          <button aria-label="Predošlá" style={{ all: 'unset', cursor: 'pointer', padding: 8 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10l6 6M15 4v12" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button aria-label="O 15 sekúnd späť" style={{ all: 'unset', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.35)', padding: '10px 14px', borderRadius: 999, color: '#fff', fontFamily: NM.SANS, fontSize: 12 }}>
            −15s
          </button>
          <button aria-label="Pauza / prehrať" style={{ all: 'unset', cursor: 'pointer', background: '#fff', width: 72, height: 72, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="6" y="4" width="3" height="14" rx="1" fill={NM.DEEP} />
              <rect x="13" y="4" width="3" height="14" rx="1" fill={NM.DEEP} />
            </svg>
          </button>
          <button aria-label="O 15 sekúnd dopredu" style={{ all: 'unset', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.35)', padding: '10px 14px', borderRadius: 999, color: '#fff', fontFamily: NM.SANS, fontSize: 12 }}>
            +15s
          </button>
          <button aria-label="Ďalšia" style={{ all: 'unset', cursor: 'pointer', padding: 8 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4l6 6-6 6M5 4v12" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            marginBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Ambientný zvuk
          </div>
          <div style={{ fontFamily: NM.SANS, fontSize: 12, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
            Jemný dážď
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3l3 3 3-3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
