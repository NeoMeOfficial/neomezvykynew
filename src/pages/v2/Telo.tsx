import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Page, BackHeader, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';

/**
 * Telo · R9 hub
 * Three equal editorial cards: Programy, Cvičenia, Strečing.
 * The Programy card carries a Plus chip for free users.
 */
export default function Telo() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();

  const cards = [
    { id: 'programy', name: 'Programy', sub: 'Niekoľkotýždenná cesta', img: '/images/r9/program-body-forming.jpg', count: isPremium ? '4 programy' : '4 programy · Plus', locked: !isPremium, path: '/kniznica/telo/programy' },
    { id: 'cvicenia', name: 'Cvičenia', sub: 'Jednotlivé tréningy', img: '/images/r9/lifestyle-core-workout.jpg', count: '32 cvičení · 5–30 min', locked: false, path: '/kniznica/telo/extra' },
    { id: 'strecing', name: 'Strečing', sub: 'Uvoľnenie a mobilita', img: '/images/r9/lifestyle-yoga-pose.jpg', count: '18 zostáv · 5–20 min', locked: false, path: '/kniznica/telo/strecing' },
  ];

  return (
    <Page>
      <BackHeader title="Telo" />
      <div style={{ padding: '0 20px' }}>
        <Ser size={36}>
          Pohyb a <em style={{ color: NM.TERRA, fontWeight: 500, fontStyle: 'italic' }}>sila</em>.
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>
          Programy pre dlhodobú premenu, jednotlivé cvičenia pre dnešný deň a strečing na každú chvíľu.
        </Body>
      </div>

      <div style={{ margin: '30px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => navigate(c.path)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              borderRadius: 22,
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '16/10',
              backgroundImage: `url(${c.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 12px 32px rgba(61,41,33,0.08)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0) 30%, rgba(42,26,20,0.85) 100%)' }} />
            {c.locked && (
              <div style={{ position: 'absolute', top: 14, right: 14 }}>
                <PlusTag />
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 18, left: 20, right: 20, color: '#fff' }}>
              <Eye color="rgba(255,255,255,0.72)" size={9}>Telo · 0{i + 1}</Eye>
              <div style={{ fontFamily: NM.SERIF, fontSize: 28, fontWeight: 500, marginTop: 5, letterSpacing: '-0.01em' }}>{c.name}</div>
              <div style={{ fontFamily: NM.SANS, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4, fontWeight: 400 }}>{c.sub}</div>
              <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{c.count}</div>
            </div>
          </button>
        ))}
      </div>
    </Page>
  );
}
