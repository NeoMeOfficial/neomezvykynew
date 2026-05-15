import { useNavigate } from 'react-router-dom';
import { NM } from '../../../components/v2/neome';
import { useSupabaseAuth } from '../../../contexts/SupabaseAuthContext';
import { getProgramBySlug, type ProgramSlug } from '../../../data/programs';

/**
 * /onboarding-plus/hotovo — final celebration. Dark full-bleed photo,
 * gold glow, "Vstúpiť" CTA that lands the user wherever makes most
 * sense:
 *   • if they picked a program → /program/:slug
 *   • otherwise → /domov-new
 */
const PROGRAM_KEY = 'onboarding-plus:program';
const HERO_IMG = '/images/r9/program-mindful.jpg';

export default function PlusFinal() {
  const navigate = useNavigate();
  const { profile } = useSupabaseAuth();
  const first = (profile?.first_name || '').trim() || 'Vitaj';

  const pickedSlug = (typeof window !== 'undefined' ? localStorage.getItem(PROGRAM_KEY) : null) as ProgramSlug | null;
  const picked = pickedSlug ? getProgramBySlug(pickedSlug) : undefined;

  const onEnter = () => {
    if (pickedSlug && picked) {
      navigate(`/program/${pickedSlug}`);
    } else {
      navigate('/domov-new');
    }
    // Clear the stash so a back-and-forth doesn't replay the same target.
    localStorage.removeItem(PROGRAM_KEY);
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
          NeoMe Plus · pripravené
        </div>
        <div style={{ marginTop: 22 }}>
          <div
            style={{
              fontFamily: NM.SERIF,
              fontSize: 48,
              fontWeight: 500,
              color: '#fff',
              lineHeight: 0.98,
              letterSpacing: '-0.025em',
            }}
          >
            Tvoj priestor
            <br />
            <span style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>čaká.</span>
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
          {first}, všetko je nastavené. Tvoj prvý deň v NeoMe je len o tom — vstúpiť. Príď, keď budeš pripravená.
        </div>

        {/* Three quiet bullets */}
        <div style={{ margin: '36px auto 0', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280 }}>
          {[
            picked ? `${picked.name} je pripravený` : 'Knižnica obsahu je otvorená',
            'Cyklus a denník čakajú v Profile',
            'Príď, keď budeš mať čas',
          ].map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 4, height: 4, borderRadius: 999, background: NM.GOLD, flexShrink: 0 }} />
              <div style={{ fontFamily: NM.SANS, fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: 300, textAlign: 'left' }}>
                {t}
              </div>
            </div>
          ))}
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
          {picked ? `Vstúpiť do ${picked.name}` : 'Vstúpiť'}
        </button>
      </div>

      {/* Spacer so content doesn't sit under the sticky CTA */}
      <div style={{ height: 140 }} />
    </div>
  );
}
