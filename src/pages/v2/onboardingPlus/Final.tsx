import { useNavigate } from 'react-router-dom';
import { NM } from '../../../components/v2/neome';

/**
 * /onboarding-plus/hotovo — final celebration. Dark full-bleed photo,
 * gold glow. "Spoznaj NeoMe" hands the user to the home screen, where the
 * guided tour auto-starts for a fresh account.
 */
const HERO_IMG = '/images/r9/program-mindful.jpg';

export default function PlusFinal() {
  const navigate = useNavigate();

  const onEnter = () => {
    // Clear any program pick stashed by the picker, then go home — the
    // OnboardingTour fires there for new accounts.
    try { localStorage.removeItem('onboarding-plus:program'); } catch { /* ignore */ }
    navigate('/domov-new');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#2A1A14',
        color: '#fff',
        overflowY: 'auto',
        backgroundImage: `linear-gradient(180deg, rgba(42,26,20,0.45) 0%, rgba(42,26,20,0.85) 60%, #2A1A14 100%), url(${HERO_IMG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: NM.SANS,
      }}
    >
      {/* Gold glow */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: '-15%',
          width: 380,
          height: 380,
          borderRadius: 999,
          background: `radial-gradient(circle, rgba(184,134,74,0.26), transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', padding: 'calc(env(safe-area-inset-top) + 100px) 22px 0', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: NM.SANS,
            fontSize: 11,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            fontWeight: 500,
            color: NM.GOLD,
          }}
        >
          NeoMe Plus
        </div>
        <div style={{ marginTop: 22 }}>
          <div
            style={{
              fontFamily: NM.SERIF,
              fontSize: 40,
              fontWeight: 500,
              color: '#fff',
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
            }}
          >
            Tvoja NeoMe je
            <br />
            <span style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>pripravená pre teba.</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            padding: '0 18px',
            fontFamily: NM.SANS,
            fontSize: 15,
            color: 'rgba(255,255,255,0.78)',
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          Spoznaj, ako tvoja NeoMe funguje.
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '18px 22px calc(env(safe-area-inset-bottom) + 22px)',
          background: 'linear-gradient(180deg, rgba(42,26,20,0) 0%, rgba(42,26,20,0.85) 50%, rgba(42,26,20,1) 100%)',
        }}
      >
        <button
          onClick={onEnter}
          style={{
            width: '100%',
            padding: '16px',
            background: NM.GOLD,
            color: '#fff',
            border: 0,
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
        >
          Spoznaj NeoMe
        </button>
      </div>

      {/* Spacer so content doesn't sit under the sticky CTA */}
      <div style={{ height: 140 }} />
    </div>
  );
}
