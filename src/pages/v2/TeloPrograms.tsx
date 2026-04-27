import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useUserProgram } from '../../hooks/useUserProgram';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';

/**
 * Telo · Programy — R9 list
 *
 * Big editorial program cards. The user's active program (from
 * useUserProgram) gets a "Prebieha · deň N" badge and progress bar
 * derived from week×7 + day; the rest show their Plus chip for Free
 * users (or no chip when Plus and inactive).
 *
 * FEATURE-NEEDED-TELO-PROGRAMS-CATALOG: programs are currently a static
 * list — the live app's `programs` table should drive this so curation
 * + ordering is admin-managed.
 */
export default function TeloPrograms() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { userProgram } = useUserProgram();

  const programs = [
    { slug: 'postpartum', name: 'Postpartum návrat', weeks: 4, level: 'Jemné', desc: 'Jemné cvičenia pre návrat k panvovému dnu a bruchu.', img: 'program-postpartum.jpg' },
    { slug: 'body-forming', name: 'BodyForming', weeks: 6, level: 'Stredné', desc: 'Tonizácia celého tela s dôrazom na držanie.', img: 'program-body-forming.jpg' },
    { slug: 'hormonal', name: 'Hormonálna joga', weeks: 4, level: 'Jemné', desc: 'Joga podporujúca hormonálnu rovnováhu a cyklus.', img: 'program-hormonal.jpg' },
    { slug: 'mindful', name: 'Mindful pohyb', weeks: 3, level: 'Jemné', desc: 'Vnímavý pohyb s dychom pre pokojnú hlavu.', img: 'program-mindful.jpg' },
  ];

  // useUserProgram returns a single active program (id like 'bodyforming-1');
  // match it against our list by best-effort name compare.
  const activeSlug = userProgram
    ? programs.find((p) => p.name.toLowerCase().includes(userProgram.name.toLowerCase()))?.slug
    : null;
  const activeDayLabel = userProgram ? `Prebieha · deň ${(userProgram.week - 1) * 7 + userProgram.day}` : null;
  const activeProgress = userProgram ? Math.min(100, Math.round((((userProgram.week - 1) * 7 + userProgram.day) / (userProgram.totalWeeks * 7)) * 100)) : 0;

  return (
    <Page>
      <BackHeader title="Telo · Programy" showSearch={false} />
      <div style={{ padding: '0 20px' }}>
        <Ser size={30}>
          Tvoja <em style={{ color: NM.TERRA, fontWeight: 500, fontStyle: 'italic' }}>cesta</em>.
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>
          Niekoľkotýždenné programy s jasným rytmom. Začínajú v pondelok — tvoj kalendár sa prispôsobí.
        </Body>
      </div>

      {isPremium && (
        <div style={{ margin: '22px 20px 0' }}>
          <Eye size={10} color={NM.TERRA}>Aktívny program</Eye>
        </div>
      )}

      <div style={{ margin: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {programs.map((p) => {
          const active = isPremium && activeSlug === p.slug;
          return (
            <div
              key={p.slug}
              onClick={() => navigate(`/program/${p.slug}`)}
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
                  backgroundImage: `url(/images/r9/${p.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div style={{ padding: '18px 20px 20px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: NM.TERRA, fontWeight: 600 }}>{p.weeks} týždňov</div>
                  <span style={{ color: NM.TERTIARY, fontSize: 10 }}>·</span>
                  <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: NM.EYEBROW, fontWeight: 500 }}>{p.level}</div>
                </div>
                <Ser size={22} style={{ marginBottom: 8 }}>{p.name}</Ser>
                <Body size={12.5}>{p.desc}</Body>
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
