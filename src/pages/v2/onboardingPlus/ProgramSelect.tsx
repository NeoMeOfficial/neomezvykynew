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

const TAGLINES: Record<ProgramSlug, string> = {
  postpartum: 'Bezpečný návrat k cvičeniu — panvové dno, diastáza, brušný korzet.',
  bodyforming: 'Spevnenie celého tela s vlastnou váhou — bez gúm a činiek.',
  'elastic-bands': 'Dynamický odpor — formovanie zadku, stehien a paží s gumami.',
  'strong-sexy': 'Silový tréning s jednoručkami — definované krivky a sila.',
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
          return (
            <button
              key={slug}
              onClick={() => setSelected(slug)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'block',
                padding: '16px 18px',
                background: active ? '#fff' : 'rgba(255,255,255,0.5)',
                borderRadius: 18,
                border: active ? `1.5px solid ${accent}` : `1px solid ${NM.HAIR}`,
                boxShadow: active ? `0 10px 24px rgba(61,41,33,0.10)` : 'none',
                transition: 'all .15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    border: active ? `6px solid ${accent}` : `1.5px solid ${NM.HAIR_2}`,
                    background: '#fff',
                    flexShrink: 0,
                    transition: 'all .15s',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <div
                      style={{
                        fontFamily: NM.SERIF,
                        fontSize: 19,
                        fontWeight: 500,
                        color: NM.DEEP,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontFamily: NM.SANS,
                        fontSize: 10,
                        color: accent,
                        fontWeight: 500,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                      }}
                    >
                      L{p.level} · {p.weeks} týž.
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: NM.SANS,
                      fontSize: 12,
                      color: NM.MUTED,
                      fontWeight: 300,
                      lineHeight: 1.5,
                    }}
                  >
                    {TAGLINES[slug]}
                  </div>
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
