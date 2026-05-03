import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useUserProgram } from '../../hooks/useUserProgram';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';
import { programList, type Program } from '../../data/programs';

/**
 * Telo · Programy — R9 list
 *
 * Big editorial program cards. Source of truth is `src/data/programs.ts`
 * (Gabi's authored content). The user's active program (from
 * useUserProgram) gets a "Prebieha · deň N" badge and progress bar
 * derived from week×7 + day; the rest show their Plus chip for Free
 * users (or no chip when Plus and inactive).
 */
const LEVEL_LABEL: Record<Program['level'], string> = {
  1: 'Jemné',
  2: 'Stredné',
  3: 'Pokročilé',
  4: 'Náročné',
};

const HERO_IMAGES: Record<string, string> = {
  postpartum:     '/images/r9/program-postpartum.jpg',
  bodyforming:    '/images/r9/program-body-forming.jpg',
  'elastic-bands':'/images/r9/program-elastic-bands.jpg',
  'strong-sexy':  '/images/r9/program-strong-sexy.jpg',
};

export default function TeloPrograms() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { userProgram } = useUserProgram();

  // useUserProgram returns a single active program — match it against our
  // canonical list by best-effort name compare (lowercased substring).
  const activeSlug = userProgram
    ? programList.find((p) => p.name.toLowerCase().includes(userProgram.name.toLowerCase()))?.slug
    : null;
  const activeDayLabel = userProgram
    ? `Prebieha · deň ${(userProgram.week - 1) * 7 + userProgram.day}`
    : null;
  const activeProgress = userProgram
    ? Math.min(
        100,
        Math.round((((userProgram.week - 1) * 7 + userProgram.day) / (userProgram.totalWeeks * 7)) * 100)
      )
    : 0;

  return (
    <Page>
      <BackHeader title="Telo · Programy" showSearch={false} />
      <div style={{ padding: '0 20px' }}>
        <Ser size={30}>
          Tvoja <em style={{ color: NM.TERRA, fontWeight: 500, fontStyle: 'italic' }}>cesta</em>.
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>
          Niekoľkotýždňové programy s jasným rytmom. Začínajú v pondelok — tvoj kalendár sa prispôsobí.
        </Body>
      </div>

      {isPremium && activeSlug && (
        <div style={{ margin: '22px 20px 0' }}>
          <Eye size={10} color={NM.TERRA}>Aktívny program</Eye>
        </div>
      )}

      <div style={{ margin: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {programList.map((p) => {
          const active = isPremium && activeSlug === p.slug;
          const heroImg = HERO_IMAGES[p.slug] ?? '/images/r9/program-postpartum.jpg';
          return (
            <div
              key={p.slug}
              onClick={() => navigate(`/program/${p.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/program/${p.slug}`);
                }
              }}
              style={{
                borderRadius: 22,
                overflow: 'hidden',
                background: '#fff',
                border: `1px solid ${NM.HAIR}`,
                boxShadow: '0 10px 28px rgba(61,41,33,0.06)',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    zIndex: 2,
                    padding: '5px 10px',
                    borderRadius: 999,
                    background: NM.TERRA,
                    color: '#fff',
                    fontFamily: NM.SANS,
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {activeDayLabel}
                </div>
              )}
              {!isPremium && (
                <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 2 }}>
                  <PlusTag />
                </div>
              )}
              <div
                style={{
                  height: 180,
                  backgroundImage: `url(${heroImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: NM.CREAM_2,
                }}
              />
              <div style={{ padding: '18px 20px 20px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 8 }}>
                  <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: NM.TERRA, fontWeight: 600 }}>
                    {p.weeks} týždňov
                  </div>
                  <span style={{ color: NM.TERTIARY, fontSize: 10 }}>·</span>
                  <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: NM.EYEBROW, fontWeight: 500 }}>
                    Level {p.level} · {LEVEL_LABEL[p.level]}
                  </div>
                </div>
                <Ser size={22} style={{ marginBottom: 8 }}>{p.name}</Ser>
                <Body size={12.5}>{p.description}</Body>
                {active && (
                  <div style={{ marginTop: 14, height: 4, borderRadius: 999, background: NM.HAIR, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${activeProgress}%`, background: NM.TERRA }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}
