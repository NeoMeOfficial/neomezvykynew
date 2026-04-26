import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';

/**
 * Telo · Programy — R9 list
 *
 * Big editorial program cards. Plus user has one program "Prebieha" with
 * progress bar; Free users see all four with Plus chips.
 *
 * TODO data: program list + active program / progress from
 * useWorkoutHistory + Supabase programs table (flagged for follow-up).
 */
export default function TeloPrograms() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();

  const programs = [
    { slug: 'postpartum', name: 'Postpartum návrat', weeks: 4, level: 'Jemné', desc: 'Jemné cvičenia pre návrat k panvovému dnu a bruchu.', img: 'program-postpartum.jpg', activeForPlus: true },
    { slug: 'body-forming', name: 'BodyForming', weeks: 6, level: 'Stredné', desc: 'Tonizácia celého tela s dôrazom na držanie.', img: 'program-body-forming.jpg', activeForPlus: false },
    { slug: 'hormonal', name: 'Hormonálna joga', weeks: 4, level: 'Jemné', desc: 'Joga podporujúca hormonálnu rovnováhu a cyklus.', img: 'program-hormonal.jpg', activeForPlus: false },
    { slug: 'mindful', name: 'Mindful pohyb', weeks: 3, level: 'Jemné', desc: 'Vnímavý pohyb s dychom pre pokojnú hlavu.', img: 'program-mindful.jpg', activeForPlus: false },
  ];

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
          const active = isPremium && p.activeForPlus;
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
                  Prebieha · deň 22
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
                    <div style={{ height: '100%', width: '78%', background: NM.TERRA }} />
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
