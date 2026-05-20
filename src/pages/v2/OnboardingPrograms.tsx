import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnbShell } from '@/components/v2/onb-shell';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { CTASticky } from '@/components/v2/cta-sticky';
import { NM } from '@/components/v2/neome';
import { syncToSupabase, loadFromSupabase } from '@/features/supabaseSync';

/**
 * Onboarding step 2 — programs picker.
 *
 * Multi-select wellness program interest. Persists to user_app_data
 * (data_key='onboarding_programs') so it survives the rest of onboarding
 * and is available later for cohort segmentation, recommendation tuning,
 * and DomovNew personalization.
 *
 * Design lifted from the legacy 6-step Onboarding.tsx StepPrograms; flow
 * restructured to fit the new 3-step shell.
 *
 * Mounted at /onboarding/programs.
 */

// The four canonical Telo programmes — see src/data/programs.ts.
// TODO: program-hormonal.jpg / program-mindful.jpg are placeholder images
// reused for ElasticBands / Strong&Sexy until dedicated tile art is added
// (program-elastic-bands.jpg, program-strong-sexy.jpg).
const PROGRAMS = [
  { k: 'postpartum',    t: 'Postpartum',   sub: '8 týždňov · jemné obnovenie', img: 'program-postpartum.jpg',   c: NM.SAGE },
  { k: 'body-forming',  t: 'BodyForming',  sub: '6 týždňov · sila a tonus',    img: 'program-body-forming.jpg', c: NM.TERRA },
  { k: 'elastic-bands', t: 'ElasticBands', sub: '6 týždňov · dynamický odpor', img: 'program-hormonal.jpg',     c: NM.MAUVE },
  { k: 'strong-sexy',   t: 'Strong&Sexy',  sub: '6 týždňov · sila s činkami',  img: 'program-mindful.jpg',      c: NM.DUSTY },
] as const;

const STORAGE_KEY = 'neome_onboarding_programs';

function loadLocal(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set<string>(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export default function OnboardingPrograms() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(loadLocal);

  // Hydrate from Supabase if a previous session saved a selection — lets the
  // user resume mid-onboarding without losing their choices.
  useEffect(() => {
    loadFromSupabase<string[]>('onboarding_programs')
      .then((remote) => {
        if (Array.isArray(remote) && remote.length > 0) {
          setSelected(new Set(remote));
        }
      })
      .catch(() => {
        // ignore — local state already correct
      });
  }, []);

  const toggle = (k: string) => {
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setSelected(next);
  };

  const persistAndContinue = () => {
    const arr = Array.from(selected);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch {
      // ignore quota errors
    }
    syncToSupabase('onboarding_programs', arr);
    navigate('/onboarding/notifications');
  };

  return (
    <OnbShell step={2} totalSteps={3} onBack={() => navigate('/onboarding/cycle')}>
      <div className="pt-4 px-5">
        <Eyebrow>KROK 2 Z 3 · TVOJ PROGRAM</Eyebrow>
        <SerifHeader as="h1" size="hero" className="mt-4">
          Vyber si <em className="text-terra font-serif italic">kam začať</em>
        </SerifHeader>
        <BodyText tone="secondary" className="mt-4 max-w-[320px]">
          Môžeš začať aj s viacerými. Nie je to definitívne — kedykoľvek zmeníš.
        </BodyText>
      </div>

      <div className="px-5 pt-7 flex flex-col gap-3">
        {PROGRAMS.map((p) => {
          const active = selected.has(p.k);
          return (
            <button
              key={p.k}
              type="button"
              onClick={() => toggle(p.k)}
              aria-pressed={active}
              style={{
                all: 'unset',
                position: 'relative',
                borderRadius: 18,
                overflow: 'hidden',
                height: 96,
                backgroundImage: `url(/images/r9/${p.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: active ? `2px solid ${p.c}` : '2px solid transparent',
                boxShadow: active ? '0 10px 26px rgba(61,41,33,0.15)' : 'none',
                cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(42,26,20,0.75) 0%, rgba(42,26,20,0.35) 60%, rgba(42,26,20,0.15) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: active ? 'none' : '1.5px solid rgba(255,255,255,0.7)',
                    background: active ? p.c : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: '#fff', letterSpacing: '-0.005em' }}>{p.t}</div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.72)', marginTop: 2, fontWeight: 400 }}>{p.sub}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <CTASticky
        label="Pokračovať"
        skipLabel="Vyberiem si neskôr"
        onClick={persistAndContinue}
        onSkip={() => navigate('/onboarding/notifications')}
      />
    </OnbShell>
  );
}
