import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NM, Eye } from '../../../components/v2/neome';
import { PlusPage, TopBar, StickyCTA } from './shared';
import { PROGRAM_SLUGS, programs, type ProgramSlug } from '../../../data/programs';

/**
 * /onboarding-plus/program-select — pick one of the four canonical Telo
 * programs. Selection is persisted to localStorage so the final
 * handoff screen can route the user straight into the program detail.
 */

const PROGRAM_KEY = 'onboarding-plus:program';

// Hero image per program — matched to what TeloPrograms / ProgramDetail
// already use, so the visual identity is consistent across the app.
const HERO_IMAGES: Record<ProgramSlug, string> = {
  postpartum: '/images/r9/program-postpartum.jpg',
  bodyforming: '/images/r9/program-body-forming.jpg',
  'elastic-bands': '/images/r9/program-hormonal.jpg',
  'strong-sexy': '/images/r9/program-mindful.jpg',
};

// One-line tagline shown under the program title.
const TAGLINES: Record<ProgramSlug, string> = {
  postpartum: 'Bezpečný návrat k cvičeniu — panvové dno, diastáza, brušný korzet.',
  bodyforming: 'Spevnenie celého tela s vlastnou váhou — bez gúm a činiek.',
  'elastic-bands': 'Dynamický odpor — formovanie zadku, stehien a paží s gumami.',
  'strong-sexy': 'Silový tréning s jednoručkami — definované krivky a sila.',
};

// Richer "Pre koho" line so it's obvious who each program suits.
const WHO_ITS_FOR: Record<ProgramSlug, string> = {
  postpartum: 'Pre ženy mesiace aj roky po pôrode. Bezpečné aj po sekcii (po 3 mesiacoch).',
  bodyforming: 'Pre začiatočníčky alebo návrat po dlhšej prestávke. Bez diastázy.',
  'elastic-bands': 'Pre tie, ktoré majú základy a chcú sa posunúť ďalej. Stredne pokročilá úroveň.',
  'strong-sexy': 'Pre pokročilé. Predpokladá dobrú techniku a pravidelné cvičenie.',
};

const ACCENTS: Record<ProgramSlug, string> = {
  postpartum: NM.MAUVE,
  bodyforming: NM.SAGE,
  'elastic-bands': NM.TERRA,
  'strong-sexy': NM.GOLD,
};

export default function PlusProgramSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ProgramSlug | null>(null);

  const onContinue = () => {
    if (!selected) return;
    localStorage.setItem(PROGRAM_KEY, selected);
    navigate('/onboarding-plus/cyklus');
  };

  return (
    <PlusPage>
      <TopBar onBack={() => navigate('/onboarding-plus/program')} centerLabel="Tvoja cesta · Krok programu" />
      <div style={{ padding: '0 22px 8px' }}>
        <Eye color={NM.TERRA} size={10}>Tvoja cesta · Vyber program</Eye>
      </div>
      <div style={{ padding: '0 22px' }}>
        <div
          style={{
            fontFamily: NM.SERIF,
            fontSize: 30,
            fontWeight: 500,
            color: NM.DEEP,
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
          }}
        >
          Vyber si{' '}
          <span style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>kam začať.</span>
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: NM.SANS,
            fontSize: 13,
            color: NM.MUTED,
            fontWeight: 300,
            lineHeight: 1.55,
          }}
        >
          Štyri programy, štyri úrovne. Nie je to definitívne — kedykoľvek to zmeníš.
        </div>
      </div>

      <div style={{ padding: '24px 22px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PROGRAM_SLUGS.map((slug) => {
          const p = programs[slug];
          const active = selected === slug;
          const accent = ACCENTS[slug];
          const heroImg = HERO_IMAGES[slug];
          return (
            <button
              key={slug}
              onClick={() => setSelected(slug)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'block',
                background: '#fff',
                borderRadius: 18,
                border: active ? `1.5px solid ${accent}` : `1px solid ${NM.HAIR}`,
                boxShadow: active ? `0 10px 24px rgba(61,41,33,0.10)` : 'none',
                overflow: 'hidden',
                transition: 'all .15s',
              }}
            >
              {/* Hero image strip with dark gradient + level chip overlay */}
              <div
                style={{
                  position: 'relative',
                  height: 96,
                  backgroundImage: `url(${heroImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 100%)',
                  }}
                />
                {/* Level chip top-right */}
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    padding: '4px 9px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.92)',
                    fontFamily: NM.SANS,
                    fontSize: 9.5,
                    color: accent,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  Level {p.level} · {p.weeks} týž.
                </div>
                {/* Title bottom-left */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    left: 16,
                    right: 60,
                    fontFamily: NM.SERIF,
                    fontSize: 22,
                    fontWeight: 500,
                    color: '#fff',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                  }}
                >
                  {p.name}
                </div>
                {/* Selection radio bottom-right */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    right: 16,
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    border: active ? `6px solid ${accent}` : `1.5px solid rgba(255,255,255,0.85)`,
                    background: active ? '#fff' : 'rgba(255,255,255,0.2)',
                    transition: 'all .15s',
                  }}
                />
              </div>

              {/* Body text under the image */}
              <div style={{ padding: '14px 16px 16px' }}>
                <div
                  style={{
                    fontFamily: NM.SANS,
                    fontSize: 12.5,
                    color: NM.DEEP,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {TAGLINES[slug]}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: NM.SANS,
                    fontSize: 11.5,
                    color: NM.MUTED,
                    fontWeight: 300,
                    lineHeight: 1.55,
                  }}
                >
                  {WHO_ITS_FOR[slug]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <StickyCTA
        label={selected ? `Pokračovať s ${programs[selected].name}` : 'Pokračovať'}
        disabled={!selected}
        onClick={onContinue}
        onSkip={() => navigate('/onboarding-plus/cyklus')}
        skipLabel="Vyberiem si neskôr"
      />
    </PlusPage>
  );
}
