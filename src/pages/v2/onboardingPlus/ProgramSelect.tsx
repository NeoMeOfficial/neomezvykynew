import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NM, Eye } from '../../../components/v2/neome';
import { PlusPage, TopBar, StickyCTA } from './shared';
import { PROGRAM_SLUGS, programs, type ProgramSlug } from '../../../data/programs';
import { supabase } from '../../../lib/supabase';

/**
 * /onboarding-plus/program-select — pick one of the four canonical Telo
 * programs. Selection is persisted to localStorage so the final
 * handoff screen can route the user straight into the program detail.
 */

const PROGRAM_KEY = 'onboarding-plus:program';
const START_DATE_KEY = 'onboarding-plus:program-start-date';

// Build YYYY-MM-DD in the user's local timezone (toISOString would use UTC
// and roll the date back for users east of UTC after midnight).
function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function nextMonday(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const delta = (8 - day) % 7 || 7; // always strictly in the future
  d.setDate(d.getDate() + delta);
  return d;
}

// Slovak day-and-date label for the chosen start, e.g. "pondelok 19. mája".
const SK_MONTHS = ['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra'];
const SK_WEEKDAYS = ['nedeľa','pondelok','utorok','streda','štvrtok','piatok','sobota'];
function formatSkDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${SK_WEEKDAYS[date.getDay()]} ${d}. ${SK_MONTHS[m - 1]}`;
}

// Short label for the chips, e.g. "20. okt.".
function shortSkDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${d}. ${SK_MONTHS[m - 1].slice(0, 3)}.`;
}

// Hero image per program — matched to what TeloPrograms / ProgramDetail
// already use, so the visual identity is consistent across the app.
const HERO_IMAGES: Record<ProgramSlug, string> = {
  postpartum: '/images/r9/program-postpartum.jpg',
  bodyforming: '/images/r9/program-body-forming.jpg',
  'elastic-bands': '/images/r9/program-hormonal.jpg',
  'strong-sexy': '/images/r9/program-mindful.jpg',
};

// Difficulty label per program — mirrors the eyebrow on the in-app
// program cards (TeloPrograms / ProgramDetail).
const DIFFICULTY: Record<ProgramSlug, string> = {
  postpartum: 'Jemné',
  bodyforming: 'Stredné',
  'elastic-bands': 'Pokročilé',
  'strong-sexy': 'Náročné',
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
  // Default start date = today. User can pick today / tomorrow / next
  // Monday / a custom date. Stored as YYYY-MM-DD local-time.
  // Programs always start on a Monday — offer the three nearest Mondays
  // (today included if today already is Monday). No free date picker.
  const mondays = useMemo(() => {
    const d = new Date();
    const delta = (8 - d.getDay()) % 7; // 0 when today is Monday
    d.setDate(d.getDate() + delta);
    return [0, 1, 2].map((i) => {
      const m = new Date(d);
      m.setDate(d.getDate() + i * 7);
      return toLocalISODate(m);
    });
  }, []);
  const [startDate, setStartDate] = useState<string>(mondays[0]);

  const onContinue = () => {
    if (!selected) return;
    localStorage.setItem(PROGRAM_KEY, selected);
    localStorage.setItem(START_DATE_KEY, startDate);
    navigate('/onboarding-plus/cyklus');
  };

  const presets: { label: string; value: string }[] = mondays.map((iso) => ({ label: shortSkDate(iso), value: iso }));

  return (
    <PlusPage>
      <TopBar onBack={() => navigate('/onboarding-plus/program')} centerLabel="Nastav si svoju NeoMe" />
      <div style={{ padding: '0 22px 8px' }}>
        <Eye color={NM.TERRA} size={10}>Vyber program</Eye>
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
                  Level {p.level} · {p.weeks} týž. · {DIFFICULTY[slug]}
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

              {/* Body text under the image — the canonical program
                  description straight from programs.ts, so onboarding and
                  the in-app program cards never drift apart. */}
              <div style={{ padding: '14px 16px 16px' }}>
                <div
                  style={{
                    fontFamily: NM.SANS,
                    fontSize: 12.5,
                    color: NM.MUTED,
                    fontWeight: 400,
                    lineHeight: 1.55,
                  }}
                >
                  {p.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Start-date picker — appears after a program is selected. Three
          quick presets + a native date input for anything custom. */}
      {selected && (
        <div style={{ padding: '4px 22px 16px' }}>
          <Eye color={NM.TERRA} size={10}>Kedy chceš začať? · programy začínajú v pondelok</Eye>
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {presets.map((p) => {
              const active = startDate === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setStartDate(p.value)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '9px 14px',
                    borderRadius: 999,
                    background: active ? NM.DEEP : 'transparent',
                    color: active ? '#fff' : NM.DEEP,
                    border: `1px solid ${active ? NM.DEEP : NM.HAIR_2}`,
                    fontFamily: NM.SANS,
                    fontSize: 12.5,
                    fontWeight: 500,
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: NM.SANS,
              fontSize: 11.5,
              color: NM.MUTED,
              fontWeight: 300,
            }}
          >
            Začni: {formatSkDate(startDate)}
          </div>
        </div>
      )}

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
