import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useActiveProgram } from '../../hooks/useDailyRituals';
import { useToast } from '@/hooks/use-toast';
import { Eye, Ser, Body, PlusTag, FaqAccordion, NM } from '../../components/v2/neome';
import { getProgramBySlug, type Program, type ProgramSlug } from '../../data/programs';

/**
 * Program detail — R9 + Gabi's full content (postpartum, bodyforming,
 * elastic-bands, strong-sexy).
 *
 * Sections (top → bottom):
 *   1. Hero (full-bleed image + serif title with terra italic accent)
 *   2. Key stats strip (weeks · features count · min/day from schedule)
 *   3. About (description)
 *   4. Čo zahŕňa program (features bullet list)
 *   5. Týždňový rytmus (schedule day-by-day)
 *   6. Týždeň po týždni (phases — only for Postpartum; no emojis)
 *   7. Pomôcky (equipment, with inline HTML links)
 *   8. Mondays-only start picker (BC-5)
 *   9. Primary CTA (Plus → Aktivovať program · date | Free → editorial Plus card)
 *  10. FAQ accordion
 */

function getNextMondays(count = 4, from = new Date()): Date[] {
  const result: Date[] = [];
  const d = new Date(from);
  const dow = d.getDay();
  const offset = dow === 1 ? 0 : (8 - dow) % 7;
  d.setDate(d.getDate() + offset);
  for (let i = 0; i < count; i++) {
    const m = new Date(d);
    m.setDate(d.getDate() + i * 7);
    result.push(m);
  }
  return result;
}

const SK_MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];

const HERO_IMAGES: Record<string, string> = {
  postpartum:      '/images/r9/program-postpartum.jpg',
  bodyforming:     '/images/r9/program-body-forming.jpg',
  'elastic-bands': '/images/r9/program-elastic-bands.jpg',
  'strong-sexy':   '/images/r9/program-strong-sexy.jpg',
};

// Legacy URL aliases — keep `/program/body-forming` working alongside the
// canonical `/program/bodyforming`.
const SLUG_ALIASES: Record<string, ProgramSlug> = {
  'body-forming': 'bodyforming',
};

const LEVEL_LABEL: Record<Program['level'], string> = {
  1: 'Jemné',
  2: 'Stredné',
  3: 'Pokročilé',
  4: 'Náročné',
};

// Two-line serif title pattern: split the name on a known separator and
// italicise the second token. For one-word names, italicise the whole name.
function renderProgramTitle(name: string) {
  const parts = name.split(' ');
  if (parts.length === 1) {
    return <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>{name}</em>;
  }
  const first = parts.slice(0, parts.length - 1).join(' ');
  const last = parts[parts.length - 1];
  return (
    <>
      <span>{first}</span>
      <br />
      <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>{last}</em>
    </>
  );
}

// Estimate exercises count from features (Gabi often opens with "X cvičení").
function exercisesCountFor(program: Program): number {
  for (const f of program.features) {
    const m = f.match(/(\d+)\s+(?:bezpečných\s+)?(?:pokročilých\s+)?posilňovac/i);
    if (m) return parseInt(m[1], 10);
  }
  return 0;
}

// Average minutes per day from the schedule. Picks the lower bound when a
// range is given (e.g. "15-20 min" → 15).
function minutesPerDayFor(program: Program): number {
  if (!program.schedule || !program.schedule.length) return 0;
  const mins = program.schedule.map((s) => {
    const m = s.duration.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  });
  return Math.round(mins.reduce((a, b) => a + b, 0) / mins.length);
}

export default function ProgramDetail() {
  const { programId: rawSlug } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { activateProgram } = useActiveProgram();
  const { toast } = useToast();

  const resolvedSlug: string = (rawSlug && SLUG_ALIASES[rawSlug]) || rawSlug || 'postpartum';
  const program = getProgramBySlug(resolvedSlug);

  const mondays = getNextMondays(4);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activating, setActivating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!program) {
    return (
      <div style={{ background: NM.BG, minHeight: '100vh', padding: 32, fontFamily: NM.SANS }}>
        <Eye>Program nenájdený</Eye>
        <Ser size={28} style={{ marginTop: 12 }}>
          Tento program <em style={{ color: NM.TERRA, fontStyle: 'italic' }}>nepoznáme</em>.
        </Ser>
        <button
          onClick={() => navigate('/kniznica/telo/programy')}
          style={{
            marginTop: 24,
            padding: '12px 20px',
            background: NM.TERRA,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Späť na programy
        </button>
      </div>
    );
  }

  const heroImg = HERO_IMAGES[program.slug] ?? HERO_IMAGES.postpartum;
  const exercises = exercisesCountFor(program);
  const minPerDay = minutesPerDayFor(program);

  const onActivate = async () => {
    if (activating) return;
    setActivating(true);
    const { error } = await activateProgram(program.slug, mondays[selectedIdx]);
    setActivating(false);
    if (error) {
      toast({
        title: 'Aktivácia zlyhala',
        description: error.message ?? 'Skús to ešte raz.',
        variant: 'destructive',
      });
      return;
    }
    setConfirmOpen(true);
  };

  const onConfirmContinue = () => {
    setConfirmOpen(false);
    navigate('/domov-new');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0);
  };

  const formatMonday = (d: Date) => `${d.getDate()}. ${SK_MONTHS_SHORT[d.getMonth()]}`;
  const finalDate = (() => {
    const d = new Date(mondays[selectedIdx]);
    d.setDate(d.getDate() + program.weeks * 7);
    return formatMonday(d);
  })();

  return (
    <div style={{ background: NM.BG, minHeight: '100vh', paddingBottom: 160, fontFamily: NM.SANS, color: NM.DEEP }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: 380,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: NM.CREAM_2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(42,26,20,0.32) 0%, rgba(42,26,20,0) 40%, rgba(248,245,240,0.18) 70%, rgba(248,245,240,0.96) 100%)',
          }}
        />
        <button
          onClick={() => navigate(-1)}
          aria-label="Späť"
          style={{
            all: 'unset',
            cursor: 'pointer',
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top) + 8px)',
            left: 20,
            width: 38,
            height: 38,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <Eye color={NM.TERRA}>Program · Telo · Level {program.level}</Eye>
          <div style={{ marginTop: 8 }}>
            <Ser size={34} style={{ whiteSpace: 'pre-line' }}>
              {renderProgramTitle(program.name)}
            </Ser>
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div
        style={{
          margin: '8px 20px 0',
          padding: '16px 18px',
          background: '#fff',
          borderRadius: 20,
          border: `1px solid ${NM.HAIR}`,
          boxShadow: '0 10px 28px rgba(61,41,33,0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        {[
          { n: program.weeks, l: 'týždne' },
          { n: exercises, l: 'cvičení' },
          { n: minPerDay, l: 'min / deň' },
        ].map((s, i) => (
          <div key={s.l} style={{ textAlign: 'center', borderLeft: i > 0 ? `1px solid ${NM.HAIR}` : 'none' }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 500, color: NM.TERRA, lineHeight: 1, letterSpacing: '-0.01em' }}>
              {s.n}
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: NM.EYEBROW, marginTop: 7, fontWeight: 500 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ margin: '24px 20px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>O programe</Eye>
        <Body size={14} color={NM.DEEP} weight={400}>{program.description}</Body>
      </div>

      {/* Features — Čo zahŕňa program */}
      <div style={{ margin: '28px 20px 0' }}>
        <Eye size={10} style={{ marginBottom: 12 }}>Čo zahŕňa program</Eye>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {program.features.map((feature, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 14px',
                background: '#fff',
                borderRadius: 14,
                border: `1px solid ${NM.HAIR}`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  marginTop: 5,
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: NM.TERRA,
                }}
              />
              <span style={{ flex: 1, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, lineHeight: 1.5, fontWeight: 400 }}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Schedule — Týždňový rytmus */}
      {program.schedule && program.schedule.length > 0 && (
        <div style={{ margin: '28px 20px 0' }}>
          <Eye size={10} style={{ marginBottom: 12 }}>Týždňový rytmus</Eye>
          <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {program.schedule.map((s, i, arr) => (
              <div
                key={s.day}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 60,
                    fontFamily: NM.SANS,
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: NM.TERRA,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {s.day}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 14, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>
                    {s.type}
                  </div>
                </div>
                <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, fontWeight: 500, flexShrink: 0 }}>
                  {s.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phases — Týždeň po týždni (Postpartum only). No emojis. */}
      {program.phases && program.phases.length > 0 && (
        <div style={{ margin: '28px 20px 0' }}>
          <Eye size={10} style={{ marginBottom: 12 }}>Týždeň po týždni</Eye>
          <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {program.phases.map((ph, i, arr) => (
              <div
                key={ph.weeks}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: `${NM.TERRA}18`,
                    color: NM.TERRA,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: NM.SERIF,
                    fontSize: 13,
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: NM.EYEBROW, fontWeight: 500 }}>
                    {ph.weeks}
                  </div>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 14, fontWeight: 500, color: NM.DEEP, marginTop: 3, letterSpacing: '-0.005em' }}>
                    {ph.title}
                  </div>
                  {ph.description && (
                    <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 4, lineHeight: 1.55, fontWeight: 400 }}>
                      {ph.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment — Pomôcky */}
      {program.equipment && program.equipment.length > 0 && (
        <div style={{ margin: '28px 20px 0' }}>
          <Eye size={10} style={{ marginBottom: 12 }}>Pomôcky</Eye>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {program.equipment.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#fff',
                  borderRadius: 14,
                  border: `1px solid ${NM.HAIR}`,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${NM.TERRA}14`,
                    color: NM.TERRA,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span
                  style={{ flex: 1, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, lineHeight: 1.5, fontWeight: 400 }}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mondays-only picker (BC-5) */}
      <div style={{ margin: '28px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <Eye size={10}>Začni v pondelok</Eye>
          {!isPremium && <PlusTag />}
        </div>
        <div
          style={{
            padding: '18px 18px 20px',
            borderRadius: 20,
            background: '#fff',
            border: `1px solid ${NM.HAIR}`,
            boxShadow: '0 10px 28px rgba(61,41,33,0.06)',
            opacity: isPremium ? 1 : 0.6,
            position: 'relative',
          }}
        >
          {!isPremium && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'rgba(248,245,240,0.25)', pointerEvents: 'none' }} />
          )}
          <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.EYEBROW, fontWeight: 400, marginBottom: 14 }}>
            Programy prebiehajú v týždňových cykloch — vyber si pondelok, kedy chceš začať.
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -18px', padding: '0 18px 4px' }}>
            {mondays.map((d, i) => {
              const sel = i === selectedIdx;
              return (
                <button
                  key={i}
                  onClick={() => isPremium && setSelectedIdx(i)}
                  style={{
                    all: 'unset',
                    cursor: isPremium ? 'pointer' : 'not-allowed',
                    flexShrink: 0,
                    width: 76,
                    padding: '13px 0',
                    borderRadius: 14,
                    background: sel ? NM.TERRA : NM.CREAM_2,
                    color: sel ? '#fff' : NM.DEEP,
                    border: sel ? 'none' : `1px solid ${NM.HAIR}`,
                    textAlign: 'center' as const,
                  }}
                >
                  <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: sel ? 'rgba(255,255,255,0.8)' : NM.EYEBROW, fontWeight: 500 }}>
                    Pon
                  </div>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 500, marginTop: 4, letterSpacing: '-0.01em' }}>
                    {d.getDate()}.
                  </div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 10, color: sel ? 'rgba(255,255,255,0.7)' : NM.TERTIARY, marginTop: 2, fontWeight: 400 }}>
                    {SK_MONTHS_SHORT[d.getMonth()]}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 14, fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, fontWeight: 400, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NM.TERRA} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            {isPremium ? (
              <>
                Skončíš v pondelok <strong style={{ color: NM.DEEP, fontWeight: 500 }}>{finalDate}</strong>.
              </>
            ) : (
              <>Začni v pondelok ľubovoľný týždeň.</>
            )}
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{ margin: '24px 20px 0' }}>
        {isPremium ? (
          <>
            <button
              onClick={onActivate}
              disabled={activating}
              style={{
                width: '100%',
                padding: '15px 20px',
                background: NM.TERRA,
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                fontFamily: NM.SANS,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.02em',
                cursor: activating ? 'wait' : 'pointer',
                opacity: activating ? 0.6 : 1,
              }}
            >
              {activating ? 'Aktivujem…' : `Aktivovať program · ${formatMonday(mondays[selectedIdx])}`}
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, fontWeight: 400 }}>
              Pridá sa do Domov a Kalendára
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 20,
                background: `linear-gradient(135deg, ${NM.DEEP_2} 0%, ${NM.DEEP} 100%)`,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}44, transparent 70%)` }} />
              <div style={{ position: 'relative' }}>
                <Eye color={NM.GOLD} size={10}>Plus program</Eye>
                <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, fontStyle: 'italic', marginTop: 8, letterSpacing: '-0.005em' }}>
                  Aktivuj Plus a začni v pondelok.
                </div>
                <button
                  onClick={() => navigate(`/paywall?returnTo=${encodeURIComponent(location.pathname)}`)}
                  style={{
                    marginTop: 14,
                    width: '100%',
                    padding: '13px 20px',
                    background: NM.GOLD,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    fontFamily: NM.SANS,
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    cursor: 'pointer',
                  }}
                >
                  Aktivovať Plus
                </button>
                <div style={{ textAlign: 'center', marginTop: 8, fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                  Prvý mesiac 4,99 €
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/domov-new')}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                textAlign: 'center',
                marginTop: 12,
                fontFamily: NM.SANS,
                fontSize: 12,
                color: NM.TERTIARY,
                fontWeight: 400,
                textDecoration: 'underline',
              }}
            >
              Pokračovať zdarma
            </button>
          </>
        )}
      </div>

      {/* FAQ */}
      {program.faqs && program.faqs.length > 0 && (
        <div style={{ margin: '36px 20px 0' }}>
          <Eye size={10} style={{ marginBottom: 12 }}>Časté otázky</Eye>
          <FaqAccordion items={program.faqs} accent={NM.TERRA} />
        </div>
      )}

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(42,26,20,0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={onConfirmContinue}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: NM.BG,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: '28px 24px 32px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
            }}
          >
            <Eye color={NM.TERRA} size={10}>Aktivované</Eye>
            <div style={{ marginTop: 10, fontFamily: NM.SERIF, fontSize: 24, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.01em' }}>
              Vidíme sa v pondelok.
            </div>
            <Body size={13} color={NM.MUTED} style={{ marginTop: 10 }}>
              Tvoj program <strong style={{ color: NM.DEEP, fontWeight: 500 }}>{program.name}</strong> sa pridá do Domov a Kalendára. Začneš v pondelok <strong style={{ color: NM.DEEP, fontWeight: 500 }}>{formatMonday(mondays[selectedIdx])}</strong>.
            </Body>
            <button
              onClick={onConfirmContinue}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '14px 20px',
                background: NM.TERRA,
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                fontFamily: NM.SANS,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.02em',
                cursor: 'pointer',
              }}
            >
              Pokračovať na Domov
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
